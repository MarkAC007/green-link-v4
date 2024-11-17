import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { useCandidateProfile } from '../../hooks/useCandidateProfile';
import { useSkills } from '../../hooks/useSkills';
import { CandidateProfileFormData } from '../../types/candidate';
import { SkillSelector } from '../common/SkillSelector';
import { Modal } from '../common/Modal';
import { Upload, X, AlertCircle, Loader, Plus, Minus } from 'lucide-react';
import { SkillEvidenceForm } from './SkillEvidenceForm';
import { useSkillClaims } from '../../hooks/useSkillClaims';

interface SkillEvidence {
  skillId: string;
  files: File[];
  descriptions: string[];
  uploadStatus?: 'uploading' | 'success' | 'error';
  errorMessage?: string;
}

export function CandidateProfileForm() {
  const { currentUser } = useAuth();
  const { profile, updateProfile } = useCandidateProfile();
  const { skills } = useSkills();
  const { createClaim } = useSkillClaims();
  const navigate = useNavigate();
  const [hasChanges, setHasChanges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [skillEvidence, setSkillEvidence] = useState<SkillEvidence[]>([]);

  const { register, handleSubmit, setValue, watch, reset } = useForm<CandidateProfileFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      bio: '',
      skills: []
    }
  });

  const onSubmit = async (data: CandidateProfileFormData) => {
    if (!currentUser) return;

    try {
      setIsSubmitting(true);
      console.log('Submitting profile with data:', data);
      
      await updateProfile({
        ...data,
        skills: data.skills.map(skill => ({
          id: skill.id,
          status: 'pending'
        }))
      });

      setHasChanges(false);
      toast.success('Profile updated successfully');
      navigate('/profile');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    console.log('Profile data:', profile);
    console.log('Skills data:', skills);
    
    if (profile) {
      console.log('Resetting form with profile:', profile);
      reset({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        skills: profile.skills || []
      });
    }
  }, [profile, reset]);

  const selectedSkills = watch('skills') || [];

  useEffect(() => {
    console.log('Selected skills:', selectedSkills);
  }, [selectedSkills]);

  const handleSkillToggle = async (skillId: string) => {
    const currentSkills = watch('skills') || [];
    const skillExists = currentSkills.find(s => s.id === skillId);
    
    try {
      if (skillExists) {
        // Remove skill
        const updatedSkills = currentSkills.filter(s => s.id !== skillId);
        setValue('skills', updatedSkills, { shouldDirty: true });
        toast.success('Skill removed');
      } else {
        // Add skill
        const skillToAdd = skills.find(s => s.id === skillId);
        if (skillToAdd) {
          // Create the claim first
          await createClaim(skillId, [], []);
          
          // Then update form state
          const updatedSkills = [...currentSkills, { id: skillId, status: 'pending' }];
          setValue('skills', updatedSkills, { shouldDirty: true });
          toast.success('Skill added successfully');
        }
      }
      setHasChanges(true);
    } catch (error) {
      console.error('Error toggling skill:', error);
      toast.error('Failed to update skill');
    }
  };

  if (!profile || !skills) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            {...register('firstName')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            {...register('lastName')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            {...register('email')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            {...register('phone')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Bio
        </label>
        <textarea
          {...register('bio')}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Skills</h3>
        
        <div className="flex flex-wrap gap-2">
          {selectedSkills.map((skill) => {
            const skillData = skills.find(s => s.id === skill.id);
            return (
              <div
                key={skill.id}
                className="inline-flex items-center px-3 py-1.5 rounded-full bg-green-100 text-green-700"
              >
                <span className="text-sm font-medium">{skillData?.name}</span>
                <button
                  type="button"
                  onClick={() => handleSkillToggle(skill.id)}
                  className="ml-2 inline-flex items-center p-0.5 rounded-full hover:bg-green-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {skills
            .filter(skill => !selectedSkills.some(s => s.id === skill.id))
            .map((skill) => (
              <button
                key={skill.id}
                type="button"
                onClick={() => handleSkillToggle(skill.id)}
                className="p-4 rounded-lg border border-gray-200 hover:border-green-500 hover:bg-green-50 text-left"
              >
                <h4 className="font-medium text-gray-900">{skill.name}</h4>
                {skill.description && (
                  <p className="text-sm text-gray-500 mt-1">{skill.description}</p>
                )}
              </button>
            ))}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => navigate('/profile')}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !hasChanges}
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}