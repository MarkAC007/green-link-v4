import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Upload, X, Plus } from 'lucide-react';
import { useSkillClaims } from '../../hooks/useSkillClaims';
import { Skill } from '../../types/skill';

interface SkillClaimFormProps {
  skill: Skill;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface FormData {
  descriptions: string[];
}

export function SkillClaimForm({ skill, onSuccess, onCancel }: SkillClaimFormProps) {
  const [files, setFiles] = useState<File[]>([]);
  const { createClaim } = useSkillClaims();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormData) => {
    if (files.length === 0) {
      toast.error('Please upload at least one evidence document');
      return;
    }

    try {
      await createClaim(skill.id, files, data.descriptions);
      toast.success('Skill claim submitted successfully');
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to submit skill claim');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Claim Skill: {skill.name}</h3>
        <p className="mt-1 text-sm text-gray-500">
          Please provide evidence to support your skill claim. This can include certificates,
          licenses, or other relevant documentation.
        </p>
      </div>

      <div className="space-y-4">
        {files.map((file, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Upload className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <input
                {...register(`descriptions.${index}`)}
                placeholder="Description (optional)"
                className="text-sm rounded-md border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}

        <div className="flex justify-center">
          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept={skill.acceptedFileTypes?.join(',')}
              onChange={handleFileChange}
              multiple
            />
            <div className="flex items-center justify-center px-6 py-4 border-2 border-gray-300 border-dashed rounded-lg hover:border-green-500">
              <Plus className="h-6 w-6 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">Add Evidence</span>
            </div>
          </label>
        </div>
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
          disabled={isSubmitting || files.length === 0}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Claim'}
        </button>
      </div>
    </form>
  );
}