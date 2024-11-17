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
import { Upload, X, AlertCircle, Loader } from 'lucide-react';

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
  const { skills, loading: skillsLoading } = useSkills();
  const navigate = useNavigate();
  
  const [skillEvidence, setSkillEvidence] = useState<SkillEvidence[]>([]);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isDirty } } = useForm<CandidateProfileFormData>({
    defaultValues: profile || {
      skills: [],
      certifications: [],
      preferences: {
        jobTypes: [],
        preferredLocations: [],
        remote: false
      }
    }
  });

  // Get selected skills and verified skills
  const selectedSkills = watch('skills') || [];
  const verifiedSkillIds = selectedSkills.filter(s => s.verified).map(s => s.id);

  const handleSkillToggle = (skillId: string) => {
    try {
      const currentSkills = selectedSkills;
      const skillExists = currentSkills.find(s => s.id === skillId);
      
      if (skillExists) {
        // Remove skill and its evidence
        const updatedSkills = currentSkills.filter(s => s.id !== skillId);
        setValue('skills', updatedSkills, { shouldDirty: true });
        setSkillEvidence(prev => prev.filter(e => e.skillId !== skillId));
        setHasChanges(true);
      } else {
        // Add skill and open evidence modal
        const updatedSkills = [...currentSkills, { id: skillId, verified: false }];
        setValue('skills', updatedSkills, { shouldDirty: true });
        setSelectedSkillId(skillId);
        setIsEvidenceModalOpen(true);
        setHasChanges(true);
      }
    } catch (error) {
      console.error('Error toggling skill:', error);
      toast.error('Failed to update skill');
    }
  };

  useEffect(() => {
    if (profile) {
      reset(profile);
    }
  }, [profile, reset]);

  const handleFileUpload = (files: FileList | null, skillId: string) => {
    if (!files) return;

    try {
      const newFiles = Array.from(files);
      const totalSize = newFiles.reduce((sum, file) => sum + file.size, 0);
      const maxSize = 10 * 1024 * 1024; // 10MB per file

      // Validate file size
      if (newFiles.some(file => file.size > maxSize)) {
        toast.error('Each file must be less than 10MB');
        return;
      }

      setSkillEvidence(prev => {
        const existing = prev.find(e => e.skillId === skillId);
        if (existing) {
          return prev.map(e => 
            e.skillId === skillId 
              ? { 
                  ...e, 
                  files: [...e.files, ...newFiles], 
                  descriptions: [...e.descriptions, ...newFiles.map(() => '')],
                  uploadStatus: 'success'
                }
              : e
          );
        }
        return [...prev, { 
          skillId, 
          files: newFiles, 
          descriptions: newFiles.map(() => ''),
          uploadStatus: 'success'
        }];
      });

      setHasChanges(true);
      toast.success('Files added successfully');
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Failed to upload files');
    }
  };

  const handleDescriptionChange = (skillId: string, fileIndex: number, description: string) => {
    try {
      setSkillEvidence(prev => 
        prev.map(e => 
          e.skillId === skillId 
            ? {
                ...e,
                descriptions: e.descriptions.map((d, i) => i === fileIndex ? description : d)
              }
            : e
        )
      );
      setHasChanges(true);
    } catch (error) {
      console.error('Error updating description:', error);
      toast.error('Failed to update description');
    }
  };

  const removeFile = (skillId: string, fileIndex: number) => {
    try {
      setSkillEvidence(prev => 
        prev.map(e => 
          e.skillId === skillId 
            ? {
                ...e,
                files: e.files.filter((_, i) => i !== fileIndex),
                descriptions: e.descriptions.filter((_, i) => i !== fileIndex)
              }
            : e
        )
      );
      setHasChanges(true);
      toast.success('File removed');
    } catch (error) {
      console.error('Error removing file:', error);
      toast.error('Failed to remove file');
    }
  };

  const onSubmit = async (data: CandidateProfileFormData) => {
    if (!currentUser) return;

    try {
      setIsSubmitting(true);
      console.log('Submitting profile with data:', { data, skillEvidence });

      // TODO: Upload evidence files to storage and attach URLs to profile
      await updateProfile(data);
      setHasChanges(false);
      toast.success('Profile saved successfully');
      navigate('/profile');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSkillName = (skillId: string) => {
    return skills.find(s => s.id === skillId)?.name || skillId;
  };

  const handleEvidenceModalClose = () => {
    try {
      const currentEvidence = skillEvidence.find(e => e.skillId === selectedSkillId);
      if (!currentEvidence?.files.length) {
        // If no evidence was uploaded, remove the skill
        const updatedSkills = selectedSkills.filter(s => s.id !== selectedSkillId);
        setValue('skills', updatedSkills, { shouldDirty: true });
        toast.error('No evidence provided - skill removed');
      }
      setIsEvidenceModalOpen(false);
      setSelectedSkillId(null);
    } catch (error) {
      console.error('Error closing evidence modal:', error);
      toast.error('Failed to process evidence');
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        navigate('/profile');
      }
    } else {
      navigate('/profile');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Personal Information */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              {...register("firstName", { required: "First name is required" })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              onChange={() => setHasChanges(true)}
            />
            {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              {...register("lastName", { required: "Last name is required" })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              onChange={() => setHasChanges(true)}
            />
            {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              {...register("email")}
              defaultValue={currentUser?.email || ''}
              readOnly
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              {...register("phone", { required: "Phone is required" })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              onChange={() => setHasChanges(true)}
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              {...register("location", { required: "Location is required" })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              onChange={() => setHasChanges(true)}
            />
            {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              {...register("bio", { required: "Bio is required" })}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              onChange={() => setHasChanges(true)}
            />
            {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>}
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Skills</h2>
        
        {!skillsLoading && (
          <div className="space-y-4">
            <SkillSelector
              availableSkills={skills}
              selectedSkills={selectedSkills.map(s => s.id)}
              verifiedSkills={verifiedSkillIds}
              onSkillToggle={handleSkillToggle}
            />
            
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Skill Evidence</h3>
              {selectedSkills.map((skill) => {
                const evidence = skillEvidence.find(e => e.skillId === skill.id);
                return (
                  <div key={skill.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <span className="font-medium">{getSkillName(skill.id)}</span>
                        {!skill.verified && (
                          <div className="ml-2 flex items-center text-red-600">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            <span className="text-sm">Unverified</span>
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSkillId(skill.id);
                          setIsEvidenceModalOpen(true);
                        }}
                        className="text-green-600 hover:text-green-700 text-sm font-medium"
                      >
                        {evidence?.files.length ? 'Edit Evidence' : 'Add Evidence'}
                      </button>
                    </div>
                    
                    {evidence?.files.length ? (
                      <div className="space-y-2">
                        {evidence.files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <div className="flex items-center">
                              <Upload className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-600">{file.name}</span>
                              {evidence.uploadStatus === 'uploading' && (
                                <Loader className="w-4 h-4 ml-2 animate-spin text-green-500" />
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(skill.id, index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No evidence uploaded yet</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || (!isDirty && !hasChanges)}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </span>
          ) : (
            'Save Profile'
          )}
        </button>
      </div>

      {/* Evidence Upload Modal */}
      <Modal
        isOpen={isEvidenceModalOpen}
        onClose={handleEvidenceModalClose}
        title={`Upload Evidence for ${selectedSkillId ? getSkillName(selectedSkillId) : 'Skill'}`}
      >
        {selectedSkillId && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Upload documents or images as evidence of your skill. Each file must be less than 10MB.
              Supported formats: PDF, JPG, PNG
            </p>

            <div className="space-y-4">
              <label className="block">
                <span className="sr-only">Choose files</span>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload(e.target.files, selectedSkillId)}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-medium
                    file:bg-green-50 file:text-green-700
                    hover:file:bg-green-100"
                />
              </label>

              {skillEvidence.find(e => e.skillId === selectedSkillId)?.files.map((file, index) => (
                <div key={index} className="flex items-start space-x-4 bg-gray-50 p-3 rounded-lg">
                  <div className="flex-grow">
                    <div className="flex items-center">
                      <Upload className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{file.name}</span>
                    </div>
                    <input
                      type="text"
                      placeholder="Add a description for this evidence..."
                      value={skillEvidence.find(e => e.skillId === selectedSkillId)?.descriptions[index] || ''}
                      onChange={(e) => handleDescriptionChange(selectedSkillId, index, e.target.value)}
                      className="mt-2 block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(selectedSkillId, index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={() => setIsEvidenceModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </Modal>
    </form>
  );
}