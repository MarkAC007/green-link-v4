import { db } from '../lib/firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';

export async function initializeSkills() {
  try {
    // Check if skills collection exists and has documents
    const skillsRef = collection(db, 'skills');
    const snapshot = await getDocs(skillsRef);
    
    if (snapshot.empty) {
      // Create skillClaims collection if it doesn't exist
      const skillClaimsRef = collection(db, 'skillClaims');
      const skillClaimsSnapshot = await getDocs(skillClaimsRef);
      
      if (skillClaimsSnapshot.empty) {
        // Create an empty document to ensure the collection exists
        const dummyDoc = doc(skillClaimsRef);
        await setDoc(dummyDoc, {
          _collectionInit: true,
          createdAt: new Date().toISOString()
        });
        
        // Immediately delete the dummy document
        await deleteDoc(dummyDoc);
      }
      
      console.log('Skills and skillClaims collections initialized');
    } else {
      console.log('Skills collection already exists');
    }
  } catch (error) {
    console.error('Error initializing collections:', error);
    throw error;
  }
}