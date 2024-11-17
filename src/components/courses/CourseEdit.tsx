import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { CourseProfileFormData } from '../../types/course';
import { useCourseProfiles } from '../../hooks/useCourseProfiles';

export function CourseEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { courses, updateCourse } = useCourseProfiles();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset
  } = useForm<CourseProfileFormData>();

  useEffect(() => {
    const course = courses.find(c => c.id === id);
    if (course) {
      reset({
        name: course.name,
        description: course.description,
        location: course.location,
        courseDetails: course.courseDetails,
        photos: course.photos,
        status: course.status
      });
    }
  }, [courses, id, reset]);

  const handlePhotosInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const photos = value.split(',').map(url => url.trim()).filter(Boolean);
    setValue('photos', photos);
  };

  const onSubmit = async (data: CourseProfileFormData) => {
    if (!id) return;

    try {
      await updateCourse(id, data);
      toast.success('Course updated successfully');
      navigate('/courses');
    } catch (error) {
      toast.error('Failed to update course');
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-green-800 mb-8">Edit Course</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Course Information</h2>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Course Name</label>
              <input
                type="text"
                {...register('name', { required: 'Course name is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                {...register('location', { required: 'Location is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
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
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Course Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Number of Holes</label>
              <input
                type="number"
                {...register('courseDetails.holes', {
                  required: 'Number of holes is required',
                  min: { value: 9, message: 'Minimum 9 holes' },
                  max: { value: 36, message: 'Maximum 36 holes' }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Total Yardage</label>
              <input
                type="number"
                {...register('courseDetails.totalYardage', {
                  required: 'Total yardage is required',
                  min: { value: 1000, message: 'Invalid yardage' }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Par</label>
              <input
                type="number"
                {...register('courseDetails.par', {
                  required: 'Par is required',
                  min: { value: 27, message: 'Invalid par' }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Course Rating</label>
              <input
                type="number"
                step="0.1"
                {...register('courseDetails.courseRating')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Slope Rating</label>
              <input
                type="number"
                {...register('courseDetails.slopeRating')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                {...register('status')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              >
                <option value="active">Active</option>
                <option value="maintenance">Under Maintenance</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Photos</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Photo URLs (comma-separated)
            </label>
            <input
              type="text"
              onChange={handlePhotosInput}
              defaultValue={watch('photos')?.join(', ')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              placeholder="https://example.com/photo1.jpg, https://example.com/photo2.jpg"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/courses')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}