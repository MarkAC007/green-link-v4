import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { JobApplicationFormData } from '../../types/application';
import { useJobApplications } from '../../hooks/useJobApplications';
import { Paperclip } from 'lucide-react';

interface JobApplicationFormProps {
  jobId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function JobApplicationForm({ jobId, onSuccess, onCancel }: JobApplicationFormProps) {
  const navigate = useNavigate();
  const { createApplication } = useJobApplications();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm<JobApplicationFormData>({
    defaultValues: {
      jobId,
      attachments: []
    }
  });

  const handleAttachmentsInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const attachments = value.split(',').map(url => url.trim()).filter(Boolean);
    setValue('attachments', attachments);
  };

  const onSubmit = async (data: JobApplicationFormData) => {
    try {
      await createApplication(data);
      toast.success('Application submitted successfully');
      onSuccess?.() || navigate('/applications');
    } catch (error) {
      toast.error('Failed to submit application');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Cover Letter</label>
        <textarea
          {...register('coverLetter', {
            required: 'Cover letter is required',
            minLength: {
              value: 100,
              message: 'Cover letter should be at least 100 characters'
            }
          })}
          rows={6}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          placeholder="Explain why you're the perfect candidate for this position..."
        />
        {errors.coverLetter && (
          <p className="mt-1 text-sm text-red-600">{errors.coverLetter.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          <div className="flex items-center">
            <Paperclip className="h-4 w-4 mr-1" />
            Attachments (comma-separated URLs)
          </div>
        </label>
        <input
          type="text"
          onChange={handleAttachmentsInput}
          defaultValue={watch('attachments')?.join(', ')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          placeholder="https://example.com/resume.pdf, https://example.com/certification.pdf"
        />
        <p className="mt-1 text-sm text-gray-500">
          Add links to your resume, certifications, or other relevant documents
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
        <textarea
          {...register('notes')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          placeholder="Any additional information you'd like to share..."
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </div>
    </form>
  );
}