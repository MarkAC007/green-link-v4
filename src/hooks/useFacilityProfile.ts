import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { FacilityProfile } from '../types/facility';

export function useFacilityProfile() {
  const [profile, setProfile] = useState<FacilityProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    async function fetchProfile() {
      if (!currentUser?.uid) {
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'facilityProfiles', currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfile(docSnap.data() as FacilityProfile);
        } else {
          setProfile(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch profile');
        console.error('Error fetching facility profile:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [currentUser]);

  const updateProfile = async (data: Partial<FacilityProfile>) => {
    if (!currentUser) throw new Error('No authenticated user');

    const docRef = doc(db, 'facilityProfiles', currentUser.uid);
    const now = new Date().toISOString();

    try {
      if (!profile) {
        // Create new profile
        const newProfile: FacilityProfile = {
          userId: currentUser.uid,
          ...data,
          createdAt: now,
          updatedAt: now,
        } as FacilityProfile;

        await setDoc(docRef, newProfile);
        setProfile(newProfile);
      } else {
        // Update existing profile
        const updatedProfile = {
          ...data,
          updatedAt: now,
        };

        await updateDoc(docRef, updatedProfile);
        setProfile({ ...profile, ...updatedProfile });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      throw err;
    }
  };

  return { profile, loading, error, updateProfile };
}