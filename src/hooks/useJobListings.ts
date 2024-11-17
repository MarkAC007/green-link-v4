import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { JobListing } from '../types/job';
import { useAuth } from '../contexts/AuthContext';
import { useFacilityProfile } from './useFacilityProfile';

export function useJobListings() {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { currentUser, userProfile } = useAuth();
  const { profile: facilityProfile } = useFacilityProfile();
  const isFacility = userProfile?.role === 'facility';

  useEffect(() => {
    async function fetchJobs() {
      try {
        let jobsQuery;
        
        if (isFacility && currentUser) {
          // Facility managers can see all their jobs including drafts
          jobsQuery = query(
            collection(db, 'jobListings'),
            where('userId', '==', currentUser.uid)
          );
        } else {
          // Candidates only see open jobs
          jobsQuery = query(
            collection(db, 'jobListings'),
            where('status', '==', 'open')
          );
        }
        
        const snapshot = await getDocs(jobsQuery);
        const jobsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as JobListing[];

        setJobs(jobsData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch jobs'));
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, [currentUser, isFacility]);

  const createJob = async (data: Omit<JobListing, 'id' | 'userId' | 'facilityProfileId' | 'createdAt' | 'updatedAt'>) => {
    if (!currentUser) throw new Error('User must be authenticated');
    if (!facilityProfile) throw new Error('Facility profile not found');

    const now = new Date().toISOString();
    const newJob: Omit<JobListing, 'id'> = {
      ...data,
      userId: currentUser.uid,
      facilityProfileId: facilityProfile.userId,
      createdAt: now,
      updatedAt: now,
      applicationCount: 0
    };

    try {
      const docRef = await addDoc(collection(db, 'jobListings'), newJob);
      const createdJob = { ...newJob, id: docRef.id };
      setJobs(prev => [...prev, createdJob]);
      return docRef.id;
    } catch (err) {
      console.error('Error creating job:', err);
      throw new Error('Failed to create job listing');
    }
  };

  const updateJob = async (jobId: string, data: Partial<JobListing>) => {
    if (!currentUser) throw new Error('User must be authenticated');

    try {
      const jobRef = doc(db, 'jobListings', jobId);
      const updates = {
        ...data,
        updatedAt: new Date().toISOString()
      };

      await updateDoc(jobRef, updates);
      setJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, ...updates } : job
      ));
    } catch (err) {
      console.error('Error updating job:', err);
      throw new Error('Failed to update job listing');
    }
  };

  const deleteJob = async (jobId: string) => {
    if (!currentUser) throw new Error('User must be authenticated');

    try {
      await deleteDoc(doc(db, 'jobListings', jobId));
      setJobs(prev => prev.filter(job => job.id !== jobId));
    } catch (err) {
      console.error('Error deleting job:', err);
      throw new Error('Failed to delete job listing');
    }
  };

  return {
    jobs,
    loading,
    error,
    createJob,
    updateJob,
    deleteJob
  };
}