import { collection, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CandidateProfile } from '../types/candidate';
import { SkillClaim } from '../types/skill';

export async function migrateSkillClaims() {
  try {
    // Get all candidate profiles
    const profilesRef = collection(db, 'candidateProfiles');
    const profilesSnapshot = await getDocs(profilesRef);
    const profiles = profilesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as (CandidateProfile & { id: string })[];

    // Create skillClaims for each skill in profiles
    for (const profile of profiles) {
      if (!profile.skills?.length) continue;

      for (const skill of profile.skills) {
        const now = new Date().toISOString();
        
        // Create new skill claim
        const claimData: Omit<SkillClaim, 'id'> = {
          userId: profile.userId,
          skillId: skill.id,
          status: skill.status || 'pending',
          evidence: [],
          createdAt: now,
          updatedAt: now
        };

        // Add to skillClaims collection
        await addDoc(collection(db, 'skillClaims'), claimData);

        // Update profile skill to reference claim
        const profileRef = doc(db, 'candidateProfiles', profile.id);
        await updateDoc(profileRef, {
          skills: profile.skills.map(s => 
            s.id === skill.id 
              ? { ...s, status: skill.status || 'pending' }
              : s
          )
        });
      }
    }

    console.log('Skill claims migration completed successfully');
  } catch (error) {
    console.error('Error migrating skill claims:', error);
    throw error;
  }
}