import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserCircle } from 'lucide-react';

export function ProfileView() {
  const { userProfile } = useAuth();

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold leading-6 text-gray-900">Profile Information</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Personal details and application settings
              </p>
            </div>
            <button 
              onClick={() => window.location.href = '/profile/edit'}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
            >
              Edit Profile
            </button>
          </div>
          
          <div className="border-t border-gray-200">
            <div className="px-4 py-12 sm:px-6">
              <div className="flex justify-center mb-8">
                {userProfile.photoURL ? (
                  <img 
                    src={userProfile.photoURL} 
                    alt={userProfile.displayName || 'Profile'} 
                    className="h-32 w-32 rounded-full object-cover"
                  />
                ) : (
                  <UserCircle className="h-32 w-32 text-gray-400" />
                )}
              </div>

              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Display Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{userProfile.displayName || 'Not set'}</dd>
                </div>

                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{userProfile.email}</dd>
                </div>

                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Role</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {userProfile.role === 'candidate' ? 'Turf Specialist' : 'Facility Manager'}
                  </dd>
                </div>

                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Member Since</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(userProfile.createdAt).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}