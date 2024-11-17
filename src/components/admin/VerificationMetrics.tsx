import React from 'react';
import { useSkillVerificationMetrics } from '../../hooks/useSkillVerificationMetrics';
import { useSkills } from '../../hooks/useSkills';
import { CheckCircle, XCircle, Clock, BarChart2 } from 'lucide-react';

export function VerificationMetrics() {
  const { metrics, loading } = useSkillVerificationMetrics();
  const { skills } = useSkills();

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-gray-100 rounded-lg"></div>
      </div>
    );
  }

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    return hours === 1 ? '1 hour' : `${hours} hours`;
  };

  const getSkillName = (skillId: string) => {
    return skills.find(s => s.id === skillId)?.name || skillId;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 flex items-center">
        <BarChart2 className="h-5 w-5 mr-2 text-green-600" />
        Verification Metrics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-green-600">Verified Skills</p>
              <p className="text-2xl font-bold text-green-700">{metrics.totalVerified}</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-red-600">Rejected Claims</p>
              <p className="text-2xl font-bold text-red-700">{metrics.totalRejected}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-yellow-600">Pending Verifications</p>
              <p className="text-2xl font-bold text-yellow-700">{metrics.totalPending}</p>
            </div>
          </div>
        </div>
      </div>

      {metrics.averageVerificationTime > 0 && (
        <div className="border-t pt-4">
          <p className="text-sm text-gray-500">
            Average verification time: {formatTime(metrics.averageVerificationTime)}
          </p>
        </div>
      )}

      {Object.keys(metrics.verificationsBySkill).length > 0 && (
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Verifications by Skill</h3>
          <div className="space-y-2">
            {Object.entries(metrics.verificationsBySkill)
              .sort(([, a], [, b]) => b - a)
              .map(([skillId, count]) => (
                <div key={skillId} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{getSkillName(skillId)}</span>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}