import { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SkillVerificationMetrics, SkillClaim } from '../types/skill';

export function useSkillVerificationMetrics() {
  const [metrics, setMetrics] = useState<SkillVerificationMetrics>({
    totalVerified: 0,
    totalRejected: 0,
    totalPending: 0,
    averageVerificationTime: 0,
    verificationsBySkill: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const claimsRef = collection(db, 'skillClaims');
        const snapshot = await getDocs(claimsRef);
        const claims = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as SkillClaim[];

        // Calculate metrics
        const verifiedClaims = claims.filter(claim => claim.status === 'verified');
        const rejectedClaims = claims.filter(claim => claim.status === 'rejected');
        const pendingClaims = claims.filter(claim => claim.status === 'pending');

        // Calculate average verification time
        const verificationTimes = verifiedClaims
          .map(claim => {
            if (!claim.verifiedAt || !claim.createdAt) return 0;
            return new Date(claim.verifiedAt).getTime() - new Date(claim.createdAt).getTime();
          })
          .filter(time => time > 0);

        const averageTime = verificationTimes.length
          ? verificationTimes.reduce((a, b) => a + b, 0) / verificationTimes.length
          : 0;

        // Calculate verifications by skill
        const skillVerifications = claims.reduce((acc, claim) => {
          if (claim.status === 'verified') {
            acc[claim.skillId] = (acc[claim.skillId] || 0) + 1;
          }
          return acc;
        }, {} as Record<string, number>);

        setMetrics({
          totalVerified: verifiedClaims.length,
          totalRejected: rejectedClaims.length,
          totalPending: pendingClaims.length,
          averageVerificationTime: averageTime,
          verificationsBySkill: skillVerifications
        });

        setError(null);
      } catch (err) {
        console.error('Error fetching verification metrics:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch metrics'));
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
  }, []);

  return { metrics, loading, error };
}