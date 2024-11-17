import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useJobListings } from '../../hooks/useJobListings';
import { useSkills } from '../../hooks/useSkills';
import { JobListing } from '../../types/job';
import { SkillSelector } from '../common/SkillSelector';

type JobFormData = Omit<JobListing, 'id' | 'userId' | 'facilityProfileId' | 'createdAt' | 'updatedAt' | 'applicationCount' | 'applications'>;

export function JobForm() {
  const navigate = useNavigate();
  const { createJob } = useJobListings();
  const { skills, loading: skillsLoading } = useSkills();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm<JobFormData>({
    defaultValues: {
      status: 'draft',
      type: 'full-time',
      requirements: [],
      salary: {
        amount: 0,
        type: 'hourly',
        currency: 'GBP'
      },
      requiredSkills: []
    }
  });

  const selectedSkills = watch('requiredSkills') || [];

  const handleSkillToggle = (skillId: string) => {
    const currentSkills = selectedSkills;
    const newSkills = currentSkills.includes(skillId)
      ? currentSkills.filter(id => id !== skillId)
      : [...currentSkills, skillId];
    setValue('requiredSkills', newSkills);
  };

  const handleRequirementsInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const requirements = value.split(',').map(req => req.trim()).filter(Boolean);
    setValue('requirements', requirements);
  };

  const onSubmit = async (data: JobFormData) => {
    try {
      await createJob(data);
      toast.success('Job listing created successfully');
      navigate('/jobs');
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error('Failed to create job listing');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-green-800 mb-8">Create Job Listing</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Job Details</h2>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Job Title</label>
              <input
                type="text"
                {...register('title', { required: 'Job title is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
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

            <div>
              <label className="block text-sm font-medium text-gray-700">Employment Type</label>
              <select
                {...register('type')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              >
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="temporary">Temporary</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Payment Amount</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('salary.amount', {
                    required: 'Payment amount is required',
                    min: { value: 0, message: 'Amount cannot be negative' }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
                {errors.salary?.amount && (
                  <p className="mt-1 text-sm text-red-600">{errors.salary.amount.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Payment Type</label>
                <select
                  {...register('salary.type')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                >
                  <option value="hourly">Hourly Rate</option>
                  <option value="daily">Day Rate</option>
                  <option value="fixed">Fixed Cost</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Currency</label>
                <select
                  {...register('salary.currency')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  defaultValue="GBP"
                >
                  <option value="GBP">GBP (£)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required Skills
              </label>
              {!skillsLoading && (
                <SkillSelector
                  availableSkills={skills}
                  selectedSkills={selectedSkills}
                  onSkillToggle={handleSkillToggle}
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Additional Requirements (comma-separated)
              </label>
              <input
                type="text"
                onChange={handleRequirementsInput}
                defaultValue={watch('requirements')?.join(', ')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="5+ years experience, Equipment operation"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                {...register('status')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              >
                <option value="draft">Draft</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="filled">Filled</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/jobs')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Job Listing'}
          </button>
        </div>
      </form>
    </div>
  );
}