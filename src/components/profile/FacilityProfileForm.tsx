import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { useFacilityProfile } from '../../hooks/useFacilityProfile';
import { FacilityProfileFormData } from '../../types/facility';
import { Clock, MapPin, Globe, Phone } from 'lucide-react';

const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export function FacilityProfileForm() {
  const { currentUser } = useAuth();
  const { profile, updateProfile } = useFacilityProfile();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset
  } = useForm<FacilityProfileFormData>({
    defaultValues: {
      type: 'golf_course',
      facilities: [],
      amenities: [],
      photos: [],
      operatingHours: DAYS_OF_WEEK.reduce((acc, day) => ({
        ...acc,
        [day]: { open: '09:00', close: '17:00' }
      }), {} as FacilityProfileFormData['operatingHours'])
    }
  });

  // Load existing profile data
  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        type: profile.type,
        email: profile.email,
        phone: profile.phone,
        address: profile.address,
        website: profile.website,
        description: profile.description,
        facilities: profile.facilities,
        amenities: profile.amenities,
        photos: profile.photos,
        operatingHours: profile.operatingHours
      });
    }
  }, [profile, reset]);

  const handleArrayInput = (e: React.ChangeEvent<HTMLInputElement>, field: keyof FacilityProfileFormData) => {
    const value = e.target.value;
    const arrayValue = value.split(',').map(item => item.trim()).filter(Boolean);
    setValue(field, arrayValue);
  };

  const onSubmit = async (data: FacilityProfileFormData) => {
    if (!currentUser) return;

    try {
      await updateProfile(data);
      toast.success('Profile saved successfully');
      navigate('/profile');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-green-800 mb-8">Facility Profile</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Facility Name</label>
              <input
                type="text"
                {...register('name', { required: 'Facility name is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Facility Type</label>
              <select
                {...register('type', { required: 'Facility type is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              >
                <option value="golf_course">Golf Course</option>
                <option value="sports_facility">Sports Facility</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  Phone Number
                </div>
              </label>
              <input
                type="tel"
                {...register('phone', { required: 'Phone number is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-1" />
                  Website
                </div>
              </label>
              <input
                type="url"
                {...register('website')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Address
            </div>
          </h2>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Street Address</label>
              <input
                type="text"
                {...register('address.street', { required: 'Street address is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  {...register('address.city', { required: 'City is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">State</label>
                <input
                  type="text"
                  {...register('address.state', { required: 'State is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                <input
                  type="text"
                  {...register('address.postalCode', { required: 'Postal code is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Country</label>
                <input
                  type="text"
                  {...register('address.country', { required: 'Country is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Operating Hours
            </div>
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {DAYS_OF_WEEK.map((day) => (
              <div key={day} className="grid grid-cols-3 gap-4 items-center">
                <div className="text-sm font-medium text-gray-700 capitalize">
                  {day}
                </div>
                <div>
                  <input
                    type="time"
                    {...register(`operatingHours.${day}.open` as const)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div>
                  <input
                    type="time"
                    {...register(`operatingHours.${day}.close` as const)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Facilities and Amenities */}
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Facilities & Amenities</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Facilities (comma-separated)
            </label>
            <input
              type="text"
              onChange={(e) => handleArrayInput(e, 'facilities')}
              defaultValue={watch('facilities')?.join(', ')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              placeholder="Pro shop, Driving range, Practice green"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amenities (comma-separated)
            </label>
            <input
              type="text"
              onChange={(e) => handleArrayInput(e, 'amenities')}
              defaultValue={watch('amenities')?.join(', ')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              placeholder="Restaurant, Locker rooms, Equipment rental"
            />
          </div>
        </div>

        {/* Photos */}
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Photos</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Photo URLs (comma-separated)
            </label>
            <input
              type="text"
              onChange={(e) => handleArrayInput(e, 'photos')}
              defaultValue={watch('photos')?.join(', ')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              placeholder="https://example.com/photo1.jpg, https://example.com/photo2.jpg"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}