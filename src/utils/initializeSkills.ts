import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function initializeSkills() {
  try {
    // Check if skills collection exists and has documents
    const skillsRef = collection(db, 'skills');
    const snapshot = await getDocs(skillsRef);
    
    if (snapshot.empty) {
      console.log('Skills collection is empty');
    } else {
      console.log('Skills collection already exists');
    }
  } catch (error) {
    console.error('Error checking skills collection:', error);
    throw error;
  }
}