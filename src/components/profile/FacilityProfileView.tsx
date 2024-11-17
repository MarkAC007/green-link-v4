import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Globe, Clock } from 'lucide-react';
import { useFacilityProfile } from '../../hooks/useFacilityProfile';

export function FacilityProfileView() {
  const { profile, loading, error } = useFacilityProfile();

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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-red-700">Error: {error}</p>
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
            <p className="mt-2 text-gray-600">Create a facility profile to get started</p>
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
        {/* Profile Header */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="relative h-48">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: profile.photos?.length 
                  ? `url(${profile.photos[0]})` 
                  : 'url(https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&q=80)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 to-green-800/75"></div>
            </div>
            
            <div className="relative h-full px-4 py-5 sm:px-6 flex justify-between items-center">
              <div className="text-white">
                <h1 className="text-3xl font-bold">{profile.name}</h1>
                <p className="mt-1 text-green-50 capitalize">
                  {profile.type.replace('_', ' ')}
                </p>
                <div className="mt-2 flex items-center text-green-50 text-sm">
                  <MapPin className="h-4 w-4 mr-1" />
                  {profile.address.city}, {profile.address.state}
                </div>
              </div>
              <Link
                to="/profile/edit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                Edit Profile
              </Link>
            </div>
          </div>

          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  Phone
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{profile.phone}</dd>
              </div>

              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Globe className="h-4 w-4 mr-1" />
                  Website
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {profile.website ? (
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-500">
                      {profile.website}
                    </a>
                  ) : (
                    'Not provided'
                  )}
                </dd>
              </div>

              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900">{profile.description}</dd>
              </div>

              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Operating Hours
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(profile.operatingHours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between">
                        <span className="capitalize">{day}:</span>
                        <span>{hours.open} - {hours.close}</span>
                      </div>
                    ))}
                  </div>
                </dd>
              </div>

              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Facilities</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <div className="flex flex-wrap gap-2">
                    {profile.facilities.map((facility, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                </dd>
              </div>

              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Amenities</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <div className="flex flex-wrap gap-2">
                    {profile.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}