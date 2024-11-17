import { useState, useEffect, useRef } from 'react';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import type { SkillClaim } from '../types/skill';

export function useSkillClaims() {
  const { currentUser, userProfile } = useAuth();
  const [claims, setClaims] = useState<SkillClaim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setClaims([]);
      setLoading(false);
      return;
    }

    let claimsQuery;
    
    // For admin users, get all claims
    if (userProfile?.role === 'admin') {
      claimsQuery = query(
        collection(db, 'skillClaims'),
        orderBy('createdAt', 'desc')
      );
    } else {
      // For regular users, only get their claims
      claimsQuery = query(
        collection(db, 'skillClaims'),
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );
    }

    const unsubscribe = onSnapshot(claimsQuery, (snapshot) => {
      const newClaims = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SkillClaim[];
      
      console.log('Fetched claims for role:', userProfile?.role);
      console.log('Number of claims fetched:', newClaims.length);
      
      setClaims(newClaims);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, userProfile?.role]);

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