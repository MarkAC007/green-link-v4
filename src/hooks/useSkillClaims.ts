import { useState, useEffect, useRef } from 'react';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import type { SkillClaim } from '../types/skill';

export function useSkillClaims() {
  const { currentUser } = useAuth();
  const [claims, setClaims] = useState<SkillClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const snapshotListenerRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setClaims([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'skillClaims'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newClaims = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SkillClaim[];
      setClaims(newClaims);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const createClaim = async (skillId: string, files: File[], descriptions: string[]) => {
    if (!currentUser) throw new Error('No authenticated user');

    try {
      // Create new claim document
      const claimData = {
        userId: currentUser.uid,
        skillId,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        evidence: [] // We'll add evidence later when storage is set up
      };

      const docRef = await addDoc(collection(db, 'skillClaims'), claimData);
      console.log('Skill claim created with ID:', docRef.id);
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating skill claim:', error);
      throw error;
    }
  };

  return {
    claims,
    loading,
    createClaim
  };
}