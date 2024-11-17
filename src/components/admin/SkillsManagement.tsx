import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSkillClaims } from '../../hooks/useSkillClaims';
import { useSkills } from '../../hooks/useSkills';
import { CheckCircle, XCircle, AlertCircle, ExternalLink, Plus, Trash2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { toast } from 'react-hot-toast';
import { VerificationMetrics } from './VerificationMetrics';
import { Skill } from '../../types/skill';

interface NewSkillFormData {
  name: string;
  category?: string;
  description?: string;
  requiresEvidence: boolean;
  acceptedFileTypes: string[];
}

export function SkillsManagement() {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const { claims, loading: claimsLoading, updateClaimStatus } = useSkillClaims();
  const { skills, loading: skillsLoading, addSkill, deleteSkill } = useSkills();
  const [selectedClaim, setSelectedClaim] = React.useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isNewSkillModalOpen, setIsNewSkillModalOpen] = React.useState(false);
  const [newSkill, setNewSkill] = React.useState<NewSkillFormData>({
    name: '',
    category: '',
    description: '',
    requiresEvidence: true,
    acceptedFileTypes: ['.pdf', '.jpg', '.png']
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  React.useEffect(() => {
    if (userProfile?.role !== 'admin') {
      navigate('/');
      return;
    }
  }, [userProfile, navigate]);

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newSkill.name.trim()) {
      toast.error('Skill name is required');
      return;
    }

    try {
      await addSkill(newSkill);
      toast.success('Skill added successfully');
      setIsNewSkillModalOpen(false);
      setNewSkill({
        name: '',
        category: '',
        description: '',
        requiresEvidence: true,
        acceptedFileTypes: ['.pdf', '.jpg', '.png']
      });
    } catch (error) {
      toast.error('Failed to add skill');
      console.error(error);
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    if (window.confirm('Are you sure you want to delete this skill? This action cannot be undone.')) {
      try {
        await deleteSkill(skillId);
        toast.success('Skill deleted successfully');
      } catch (error) {
        toast.error('Failed to delete skill');
        console.error(error);
      }
    }
  };

  const getSkillName = (skillId: string) => {
    return skills.find(s => s.id === skillId)?.name || skillId;
  };

  const handleVerify = async (claimId: string) => {
    try {
      setIsVerifying(true);
      await updateClaimStatus(claimId, 'verified');
      toast.success('Skill verified successfully');
    } catch (error) {
      toast.error('Failed to verify skill');
      console.error(error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleReject = async (claimId: string) => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      await updateClaimStatus(claimId, 'rejected', rejectionReason);
      toast.success('Skill claim rejected');
      setIsModalOpen(false);
      setRejectionReason('');
      setSelectedClaim(null);
    } catch (error) {
      toast.error('Failed to reject skill claim');
      console.error(error);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Date not available';
    try {
      return new Date(timestamp).toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  if (claimsLoading || skillsLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const pendingClaims = claims.filter(claim => {
    console.log('Checking claim:', claim);
    return claim.status === 'pending' || !claim.status;
  });
  const verifiedClaims = claims.filter(claim => claim.status === 'verified');
  const rejectedClaims = claims.filter(claim => claim.status === 'rejected');

  console.log('All claims:', claims);
  console.log('Pending claims:', pendingClaims);
  console.log('Verified claims:', verifiedClaims);
  console.log('Rejected claims:', rejectedClaims);

  // Log the filtered results
  console.log('Claims array type:', Array.isArray(claims));
  console.log('Claims structure:', JSON.stringify(claims[0], null, 2));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <VerificationMetrics />

      {/* Skills Management Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Available Skills</h2>
          <button
            onClick={() => setIsNewSkillModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Skill
          </button>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Evidence Required
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {skills.map((skill) => (
                <tr key={skill.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{skill.name}</div>
                    {skill.description && (
                      <div className="text-sm text-gray-500">{skill.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{skill.category || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      skill.requiresEvidence
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {skill.requiresEvidence ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDeleteSkill(skill.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Claims */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Verifications</h2>
        <div className="space-y-4">
          {pendingClaims.map((claim) => (
            <div key={claim.id} className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {getSkillName(claim.skillId)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Submitted by {claim.userName || claim.userId}
                  </p>
                  <p className="text-sm text-gray-500">
                    Submitted on {formatDate(claim.createdAt)}
                  </p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Pending Review
                </span>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900">Evidence Documents</h4>
                <div className="mt-2 space-y-2">
                  {claim.evidence && claim.evidence.length > 0 ? (
                    claim.evidence.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <ExternalLink className="h-4 w-4 text-gray-400 mr-2" />
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-green-600 hover:text-green-700"
                          >
                            {doc.fileName}
                          </a>
                        </div>
                        {doc.description && (
                          <span className="text-sm text-gray-500">{doc.description}</span>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No evidence provided</p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setSelectedClaim(claim.id);
                    setIsModalOpen(true);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </button>
                <button
                  onClick={() => handleVerify(claim.id)}
                  disabled={isVerifying}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {isVerifying ? 'Verifying...' : 'Verify'}
                </button>
              </div>
            </div>
          ))}

          {pendingClaims.length === 0 && (
            <p className="text-gray-500 text-center py-4">No pending skill verifications</p>
          )}
        </div>
      </div>

      {/* Verified Claims */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Verified Skills</h2>
        <div className="space-y-4">
          {verifiedClaims.map((claim) => (
            <div key={claim.id} className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {getSkillName(claim.skillId)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Verified on {formatDate(claim.verifiedAt)}
                  </p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Verified
                </span>
              </div>
            </div>
          ))}

          {verifiedClaims.length === 0 && (
            <p className="text-gray-500 text-center py-4">No verified skills</p>
          )}
        </div>
      </div>

      {/* Rejected Claims */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Rejected Claims</h2>
        <div className="space-y-4">
          {rejectedClaims.map((claim) => (
            <div key={claim.id} className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {getSkillName(claim.skillId)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Rejected on {formatDate(claim.rejectedAt)}
                  </p>
                  {claim.rejectionReason && (
                    <p className="mt-2 text-sm text-red-600">
                      Reason: {claim.rejectionReason}
                    </p>
                  )}
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Rejected
                </span>
              </div>
            </div>
          ))}

          {rejectedClaims.length === 0 && (
            <p className="text-gray-500 text-center py-4">No rejected claims</p>
          )}
        </div>
      </div>

      {/* Rejection Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedClaim(null);
          setRejectionReason('');
        }}
        title="Reject Skill Claim"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Please provide a reason for rejecting this skill claim. This will be visible to the user.
          </p>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            placeholder="Enter rejection reason..."
          />
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setSelectedClaim(null);
                setRejectionReason('');
              }}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => selectedClaim && handleReject(selectedClaim)}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              Reject Claim
            </button>
          </div>
        </div>
      </Modal>

      {/* New Skill Modal */}
      <Modal
        isOpen={isNewSkillModalOpen}
        onClose={() => setIsNewSkillModalOpen(false)}
        title="Add New Skill"
      >
        <form onSubmit={handleAddSkill} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Skill Name
            </label>
            <input
              type="text"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <input
              type="text"
              value={newSkill.category}
              onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={newSkill.description}
              onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={newSkill.requiresEvidence}
              onChange={(e) => setNewSkill({ ...newSkill, requiresEvidence: e.target.checked })}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Requires Evidence
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Accepted File Types (comma-separated)
            </label>
            <input
              type="text"
              value={newSkill.acceptedFileTypes.join(', ')}
              onChange={(e) => setNewSkill({
                ...newSkill,
                acceptedFileTypes: e.target.value.split(',').map(t => t.trim())
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              placeholder=".pdf, .jpg, .png"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setIsNewSkillModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              Add Skill
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}