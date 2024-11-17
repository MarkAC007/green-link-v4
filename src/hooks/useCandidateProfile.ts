import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CandidateProfile } from '../types/candidate';
import { useAuth } from '../contexts/AuthContext';

export function useCandidateProfile() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'candidateProfiles', currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const profileData = docSnap.data() as CandidateProfile;
          // Ensure all skills have a status
          profileData.skills = profileData.skills.map(skill => ({
            ...skill,
            status: skill.status || 'pending'
          }));
          setProfile(profileData);
        }
      } catch (err) {
        setError('Failed to fetch profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [currentUser]);

  const updateProfile = async (data: Partial<CandidateProfile>) => {
    if (!currentUser) throw new Error('No authenticated user');

    const docRef = doc(db, 'candidateProfiles', currentUser.uid);
    const now = new Date().toISOString();

    try {
      if (!profile) {
        // Create new profile
        const newProfile: CandidateProfile = {
          ...data,
          userId: currentUser.uid,
          createdAt: now,
          updatedAt: now,
          // Ensure new skills have pending status
          skills: (data.skills || []).map(skill => ({
            ...skill,
            status: 'pending'
          }))
        } as CandidateProfile;

        await setDoc(docRef, newProfile);
        setProfile(newProfile);
      } else {
        // Update existing profile
        const updatedProfile = {
          ...data,
          updatedAt: now,
          // Preserve existing skill statuses
          skills: (data.skills || []).map(skill => {
            const existingSkill = profile.skills.find(s => s.id === skill.id);
            return {
              ...skill,
              status: existingSkill?.status || 'pending'
            };
          })
        };

        await updateDoc(docRef, updatedProfile);
        setProfile({ ...profile, ...updatedProfile });
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      throw err;
    }
  };

  return { profile, loading, error, updateProfile };
}