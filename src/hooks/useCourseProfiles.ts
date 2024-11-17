import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { CourseProfile } from '../types/course';

export function useCourseProfiles() {
  const [courses, setCourses] = useState<CourseProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    async function fetchCourses() {
      if (!currentUser?.uid) return;

      try {
        const q = query(
          collection(db, 'courseProfiles'),
          where('facilityProfileId', '==', currentUser.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const coursesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as CourseProfile[];

        setCourses(coursesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, [currentUser]);

  return { courses, loading, error };
}