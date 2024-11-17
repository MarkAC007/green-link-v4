import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, Plus, Edit2 } from 'lucide-react';
import { useJobListings } from '../../hooks/useJobListings';
import { useSkills } from '../../hooks/useSkills';
import { useAuth } from '../../contexts/AuthContext';
import { JobListing } from '../../types/job';
import { Modal } from '../common/Modal';
import { JobApplicationForm } from './JobApplicationForm';
import { formatCurrency } from '../../utils/currency';

export function JobList() {
  const { jobs, loading, error } = useJobListings();
  const { skills } = useSkills();
  const { userProfile } = useAuth();
  const isFacility = userProfile?.role === 'facility';
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  const formatSalary = (job: JobListing) => {
    if (!job.salary?.amount) return 'Salary not specified';
    
    const formattedAmount = formatCurrency(job.salary.amount, job.salary.currency);
    
    switch (job.salary.type) {
      case 'hourly':
        return `${formattedAmount}/hour`;
      case 'daily':
        return `${formattedAmount}/day`;
      case 'fixed':
        return formattedAmount;
      default:
        return formattedAmount;
    }
  };

  const getSkillName = (skillId: string) => {
    return skills.find(s => s.id === skillId)?.name || skillId;
  };

  const handleApplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowApplicationForm(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
    setShowApplicationForm(false);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-red-600 py-8">
          <p>Error loading jobs: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isFacility ? 'Manage Job Listings' : 'Available Positions'}
        </h1>
        {isFacility && (
          <Link
            to="/jobs/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </Link>
        )}
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {isFacility ? 'No jobs posted yet' : 'No positions available'}
          </h3>
          <p className="text-gray-500 mb-4">
            {isFacility ? 'Start by posting your first job listing' : 'Check back later for new opportunities'}
          </p>
          {isFacility && (
            <Link
              to="/jobs/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Post New Job
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
              onClick={() => {
                setSelectedJob(job);
                setIsModalOpen(true);
                setShowApplicationForm(false);
              }}
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    job.status === 'open' ? 'bg-green-100 text-green-800' :
                    job.status === 'closed' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {job.status}
                  </span>
                </div>
                
                <div className="mt-2 space-y-1">
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Briefcase className="w-4 h-4 mr-1" />
                    {job.type}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {formatSalary(job)}
                  </div>
                </div>

                {job.requiredSkills && job.requiredSkills.length > 0 && (
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-2">
                      {job.requiredSkills.map((skillId) => (
                        <span
                          key={skillId}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                        >
                          {getSkillName(skillId)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Job Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={showApplicationForm ? 'Apply for Position' : (selectedJob?.title || 'Job Details')}
      >
        {selectedJob && !showApplicationForm && (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {selectedJob.location}
                </div>
                <div className="flex items-center text-gray-600">
                  <Briefcase className="w-4 h-4 mr-2" />
                  {selectedJob.type}
                </div>
                <div className="text-gray-600">
                  {formatSalary(selectedJob)}
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedJob.status === 'open' ? 'bg-green-100 text-green-800' :
                selectedJob.status === 'closed' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {selectedJob.status}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{selectedJob.description}</p>
            </div>

            {selectedJob.requiredSkills && selectedJob.requiredSkills.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.requiredSkills.map((skillId) => (
                    <span
                      key={skillId}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800"
                    >
                      {getSkillName(skillId)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedJob.requirements && selectedJob.requirements.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Additional Requirements</h3>
                <ul className="list-disc list-inside space-y-1">
                  {selectedJob.requirements.map((req, index) => (
                    <li key={index} className="text-gray-600">{req}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-end space-x-4 pt-6 border-t">
              {isFacility ? (
                <>
                  <Link
                    to={`/jobs/${selectedJob.id}/edit`}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Listing
                  </Link>
                </>
              ) : (
                <button
                  onClick={handleApplyClick}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  Apply Now
                </button>
              )}
            </div>
          </div>
        )}

        {selectedJob && showApplicationForm && (
          <JobApplicationForm
            jobId={selectedJob.id!}
            onSuccess={handleModalClose}
            onCancel={() => setShowApplicationForm(false)}
          />
        )}
      </Modal>
    </div>
  );
}