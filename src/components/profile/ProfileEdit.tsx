import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';

interface ProfileEditForm {
  displayName: string;
  photoURL: string;
}

export function ProfileEdit() {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileEditForm>({
    defaultValues: {
      displayName: userProfile?.displayName || '',
      photoURL: userProfile?.photoURL || '',
    }
  });

  const onSubmit = async (data: ProfileEditForm) => {
    if (!userProfile) return;

    try {
      const userRef = doc(db, 'users', userProfile.userId);
      await updateDoc(userRef, {
        displayName: data.displayName,
        photoURL: data.photoURL,
        updatedAt: new Date().toISOString(),
        profileComplete: true,
      });

      toast.success('Profile updated successfully');
      navigate('/profile');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    }
  };

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-2xl font-bold leading-6 text-gray-900">Edit Profile</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Update your profile information
            </p>
          </div>

          <div className="border-t border-gray-200">
            <form onSubmit={handleSubmit(onSubmit)} className="px-4 py-5 sm:px-6 space-y-6">
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                  Display Name
                </label>
                <input
                  type="text"
                  {...register('displayName', { required: 'Display name is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
                {errors.displayName && (
                  <p className="mt-2 text-sm text-red-600">{errors.displayName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="photoURL" className="block text-sm font-medium text-gray-700">
                  Profile Photo URL
                </label>
                <input
                  type="url"
                  {...register('photoURL')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
                {errors.photoURL && (
                  <p className="mt-2 text-sm text-red-600">{errors.photoURL.message}</p>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}