import { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Skill } from '../types/skill';

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchSkills() {
      try {
        const skillsRef = collection(db, 'skills');
        const snapshot = await getDocs(skillsRef);
        const skillsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Skill[];
        
        setSkills(skillsData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch skills'));
      } finally {
        setLoading(false);
      }
    }

    fetchSkills();
  }, []);

  const addSkill = async (skillData: Omit<Skill, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'skills'), skillData);
      const newSkill = { id: docRef.id, ...skillData };
      setSkills(prev => [...prev, newSkill]);
      return docRef.id;
    } catch (err) {
      console.error('Error adding skill:', err);
      throw new Error('Failed to add skill');
    }
  };

  const deleteSkill = async (skillId: string) => {
    try {
      await deleteDoc(doc(db, 'skills', skillId));
      setSkills(prev => prev.filter(skill => skill.id !== skillId));
    } catch (err) {
      console.error('Error deleting skill:', err);
      throw new Error('Failed to delete skill');
    }
  };

  return {
    skills,
    loading,
    error,
    addSkill,
    deleteSkill
  };
}