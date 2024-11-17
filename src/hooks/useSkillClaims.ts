import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  getDoc,
  runTransaction
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { SkillClaim, SkillEvidence } from '../types/skill';

export function useSkillClaims() {
  const [claims, setClaims] = useState<SkillClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { currentUser, userProfile } = useAuth();

  useEffect(() => {
    async function fetchClaims() {
      if (!currentUser) return;

      try {
        const claimsQuery = userProfile?.role === 'admin'
          ? query(collection(db, 'skillClaims'))
          : query(collection(db, 'skillClaims'), where('userId', '==', currentUser.uid));

        const snapshot = await getDocs(claimsQuery);
        const claimsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as SkillClaim[];

        setClaims(claimsData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch skill claims'));
      } finally {
        setLoading(false);
      }
    }

    fetchClaims();
  }, [currentUser, userProfile?.role]);

  const uploadEvidence = async (file: File, description?: string): Promise<SkillEvidence> => {
    if (!currentUser) throw new Error('User must be authenticated');

    const fileRef = ref(storage, `skill-evidence/${currentUser.uid}/${Date.now()}-${file.name}`);
    await uploadBytes(fileRef, file);
    const downloadUrl = await getDownloadURL(fileRef);

    return {
      id: Math.random().toString(36).substr(2, 9),
      fileUrl: downloadUrl,
      fileName: file.name,
      fileType: file.type,
      uploadedAt: new Date().toISOString(),
      description
    };
  };

  const createClaim = async (skillId: string, evidence: File[], descriptions?: string[]) => {
    if (!currentUser) throw new Error('User must be authenticated');

    try {
      // Check for existing claim
      const existingClaimQuery = query(
        collection(db, 'skillClaims'),
        where('userId', '==', currentUser.uid),
        where('skillId', '==', skillId)
      );
      const existingClaimSnapshot = await getDocs(existingClaimQuery);

      if (!existingClaimSnapshot.empty) {
        throw new Error('A claim for this skill already exists');
      }

      // Use transaction to ensure atomicity
      await runTransaction(db, async (transaction) => {
        // Upload evidence files
        const evidencePromises = evidence.map((file, index) => 
          uploadEvidence(file, descriptions?.[index])
        );
        const uploadedEvidence = await Promise.all(evidencePromises);

        const now = new Date().toISOString();
        const newClaim: Omit<SkillClaim, 'id'> = {
          userId: currentUser.uid,
          skillId,
          status: 'pending',
          evidence: uploadedEvidence,
          createdAt: now,
          updatedAt: now
        };

        // Create skill claim
        const claimRef = doc(collection(db, 'skillClaims'));
        transaction.set(claimRef, newClaim);

        // Update user profile
        const userRef = doc(db, 'candidateProfiles', currentUser.uid);
        const userDoc = await transaction.get(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const updatedSkills = [...(userData.skills || []), {
            id: skillId,
            status: 'pending'
          }];
          transaction.update(userRef, { skills: updatedSkills });
        }

        // Update local state
        const createdClaim = { id: claimRef.id, ...newClaim };
        setClaims(prev => [...prev, createdClaim]);
        return claimRef.id;
      });
    } catch (err) {
      console.error('Error creating skill claim:', err);
      throw err;
    }
  };

  const updateClaimStatus = async (
    claimId: string, 
    status: 'verified' | 'rejected',
    rejectionReason?: string
  ) => {
    if (!currentUser || userProfile?.role !== 'admin') {
      throw new Error('Must be an admin to verify skills');
    }

    try {
      await runTransaction(db, async (transaction) => {
        const claimRef = doc(db, 'skillClaims', claimId);
        const claimDoc = await transaction.get(claimRef);

        if (!claimDoc.exists()) {
          throw new Error('Claim not found');
        }

        const claimData = claimDoc.data() as SkillClaim;
        const now = new Date().toISOString();

        // Update skill claim
        const updates: Partial<SkillClaim> = {
          status,
          updatedAt: now,
          verifiedBy: currentUser.uid,
          verifiedAt: now
        };

        if (status === 'rejected' && rejectionReason) {
          updates.rejectionReason = rejectionReason;
        }

        transaction.update(claimRef, updates);

        // Update user profile
        const userRef = doc(db, 'candidateProfiles', claimData.userId);
        const userDoc = await transaction.get(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const updatedSkills = userData.skills.map((skill: any) => 
            skill.id === claimData.skillId 
              ? { ...skill, status } 
              : skill
          );
          transaction.update(userRef, { skills: updatedSkills });
        }

        // Update local state
        setClaims(prev => prev.map(claim => 
          claim.id === claimId 
            ? { ...claim, ...updates }
            : claim
        ));
      });
    } catch (err) {
      console.error('Error updating skill claim:', err);
      throw err;
    }
  };

  return {
    claims,
    loading,
    error,
    createClaim,
    updateClaimStatus
  };
}