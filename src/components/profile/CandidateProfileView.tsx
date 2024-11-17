import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Briefcase, Award, CheckCircle, AlertCircle, XCircle, Upload } from 'lucide-react';
import { useCandidateProfile } from '../../hooks/useCandidateProfile';
import { useSkills } from '../../hooks/useSkills';

export function CandidateProfileView() {
  const { profile, loading } = useCandidateProfile();
  const { skills } = useSkills();

  const getSkillName = (skillId: string) => {
    return skills.find(s => s.id === skillId)?.name || skillId;
  };

  const getSkillStatusStyles = (skill: any) => {
    if (skill.verified) return 'bg-green-100 text-green-800';
    if (skill.rejected) return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getSkillStatusIcon = (skill: any) => {
    if (skill.verified) {
      return (
        <div className="ml-1.5 flex items-center text-green-600" title="Verified">
          <CheckCircle className="h-4 w-4" />
        </div>
      );
    }
    if (skill.rejected) {
      return (
        <div className="relative ml-1.5">
          <XCircle className="h-4 w-4 text-red-500" />
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Verification Rejected
          </div>
        </div>
      );
    }
    return (
      <div className="relative ml-1.5">
        <AlertCircle className="h-4 w-4 text-yellow-500" />
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Pending Verification
        </div>
      </div>
    );
  };

  const formatAvailability = (availability?: string) => {
    if (!availability) return 'Not specified';
    return availability
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-64 bg-white rounded-lg"></div>
            <div className="h-96 bg-white rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">No Profile Found</h2>
            <p className="mt-2 text-gray-600">Complete your profile to get started</p>
            <Link
              to="/profile/edit"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              Create Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header */}
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {profile.firstName} {profile.lastName}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">{profile.email}</p>
            </div>
            <Link
              to="/profile/edit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              Edit Profile
            </Link>
          </div>

          {/* Content */}
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Bio</dt>
                <dd className="mt-1 text-sm text-gray-900">{profile.bio || 'No bio provided'}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  Location
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{profile.location || 'Not specified'}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Availability
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatAvailability(profile.availability)}
                </dd>
              </div>

              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Skills</dt>
                <dd className="mt-1">
                  <div className="flex flex-wrap gap-2">
                    {profile.skills?.length > 0 ? (
                      profile.skills.map((skill) => (
                        <div
                          key={skill.id}
                          className={`group relative inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${getSkillStatusStyles(skill)}`}
                        >
                          {getSkillName(skill.id)}
                          {getSkillStatusIcon(skill)}
                          {skill.evidence && skill.evidence.length > 0 && (
                            <div className="ml-1.5 text-gray-500" title="Evidence Submitted">
                              <Upload className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No skills added yet</p>
                    )}
                  </div>
                </dd>
              </div>

              {/* Rest of the profile content remains the same */}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}