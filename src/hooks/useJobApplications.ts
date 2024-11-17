import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, setDoc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { JobApplication } from '../types/application';
import { JobListing } from '../types/job';

export function useJobApplications(jobId?: string) {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser, userProfile } = useAuth();

  const fetchApplications = async () => {
    if (!currentUser?.uid || !userProfile?.role) {
      setLoading(false);
      return;
    }

    try {
      let applicationsData: JobApplication[] = [];

      if (userProfile.role === 'facility') {
        if (jobId) {
          const q = query(
            collection(db, 'jobApplications'),
            where('jobId', '==', jobId)
          );
          const querySnapshot = await getDocs(q);
          applicationsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as JobApplication[];
        } else {
          const jobsQuery = query(
            collection(db, 'jobListings'),
            where('facilityProfileId', '==', currentUser.uid)
          );
          const jobsSnapshot = await getDocs(jobsQuery);
          const jobIds = jobsSnapshot.docs.map(doc => doc.id);

          if (jobIds.length > 0) {
            const applicationsQuery = query(
              collection(db, 'jobApplications'),
              where('jobId', 'in', jobIds)
            );
            const applicationsSnapshot = await getDocs(applicationsQuery);
            applicationsData = applicationsSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as JobApplication[];
          }
        }
      } else {
        const q = query(
          collection(db, 'jobApplications'),
          where('applicantId', '==', currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        applicationsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as JobApplication[];
      }

      setApplications(applicationsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [currentUser?.uid, userProfile?.role, jobId]);

  const createApplication = async (data: Omit<JobApplication, 'id' | 'applicantId' | 'facilityProfileId' | 'status' | 'appliedAt' | 'updatedAt'>): Promise<string> => {
    if (!currentUser?.uid) throw new Error('Authentication required');

    try {
      const jobDoc = await getDoc(doc(db, 'jobListings', data.jobId));
      if (!jobDoc.exists()) throw new Error('Job not found');
      
      const jobData = jobDoc.data() as JobListing;
      const now = new Date().toISOString();
      
      const newApplication: Omit<JobApplication, 'id'> = {
        ...data,
        applicantId: currentUser.uid,
        facilityProfileId: jobData.facilityProfileId,
        status: 'pending',
        appliedAt: now,
        updatedAt: now
      };

      const docRef = doc(collection(db, 'jobApplications'));
      await setDoc(docRef, newApplication);

      const createdApplication = { ...newApplication, id: docRef.id };
      setApplications(prev => [...prev, createdApplication]);
      return docRef.id;
    } catch (err) {
      console.error('Error creating application:', err);
      throw new Error('Failed to create application');
    }
  };

  const updateApplication = async (applicationId: string, updates: Partial<JobApplication>) => {
    if (!currentUser?.uid) throw new Error('Authentication required');

    try {
      const applicationRef = doc(db, 'jobApplications', applicationId);
      const applicationDoc = await getDoc(applicationRef);

      if (!applicationDoc.exists()) {
        throw new Error('Application not found');
      }

      const currentData = applicationDoc.data() as JobApplication;
      const updatedData = {
        ...currentData,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      await updateDoc(applicationRef, updatedData);
      
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, ...updatedData }
            : app
        )
      );

      return true;
    } catch (err) {
      console.error('Error updating application:', err);
      throw err;
    }
  };

  const deleteApplication = async (applicationId: string) => {
    if (!currentUser?.uid) throw new Error('Authentication required');

    try {
      await deleteDoc(doc(db, 'jobApplications', applicationId));
      setApplications(prev => prev.filter(app => app.id !== applicationId));
    } catch (err) {
      console.error('Error deleting application:', err);
      throw new Error('Failed to delete application');
    }
  };

  return {
    applications,
    loading,
    error,
    createApplication,
    updateApplication,
    deleteApplication,
    refreshApplications: fetchApplications
  };
}