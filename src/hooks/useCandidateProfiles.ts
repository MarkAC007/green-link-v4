import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CandidateProfile } from '../types/candidate';

export function useCandidateProfiles() {
  const [profiles, setProfiles] = useState<Record<string, CandidateProfile>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCandidateProfile = async (userId: string) => {
    if (profiles[userId]) return profiles[userId];

    try {
      const docRef = doc(db, 'candidateProfiles', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const profile = docSnap.data() as CandidateProfile;
        setProfiles(prev => ({ ...prev, [userId]: profile }));
        return profile;
      }
    } catch (err) {
      console.error('Error fetching candidate profile:', err);
    }
    return null;
  };

  return {
    profiles,
    loading,
    error,
    getCandidateProfile
  };
}