import React, { useState, useEffect } from 'react';
import { useJobApplications } from '../../hooks/useJobApplications';
import { useCandidateProfiles } from '../../hooks/useCandidateProfiles';
import { useJobListings } from '../../hooks/useJobListings';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';
import { 
  User, Phone, Mail, MapPin, Calendar, Award, 
  CheckCircle, XCircle, Clock, MessageSquare, Download
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Modal } from '../common/Modal';
import { JobApplication } from '../../types/application';
import { JobListing } from '../../types/job';

interface JobApplicationsManagerProps {
  jobId?: string;
}

export function JobApplicationsManager({ jobId }: JobApplicationsManagerProps) {
  const { userProfile } = useAuth();
  const { applications, loading, updateApplication, refreshApplications } = useJobApplications(jobId);
  const { getCandidateProfile } = useCandidateProfiles();
  const { jobs } = useJobListings();
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobsMap, setJobsMap] = useState<Record<string, JobListing>>({});

  useEffect(() => {
    const jobMapping = jobs.reduce((acc, job) => ({
      ...acc,
      [job.id!]: job
    }), {} as Record<string, JobListing>);
    setJobsMap(jobMapping);
  }, [jobs]);

  const handleStatusUpdate = async (applicationId: string, newStatus: 'reviewed' | 'accepted' | 'rejected') => {
    try {
      await updateApplication(applicationId, { 
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      await refreshApplications();
      toast.success(`Application ${newStatus} successfully`);
    } catch (error) {
      toast.error('Failed to update application status');
      console.error('Error updating application:', error);
    }
  };

  const getJobTitle = (jobId: string) => {
    return jobsMap[jobId]?.title || 'Unknown Position';
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-32 bg-gray-100 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">
            {userProfile?.role === 'facility' ? 'No Applications Received' : 'You haven\'t applied to any jobs yet'}
          </h3>
          <p className="mt-2 text-gray-500">
            {userProfile?.role === 'facility' 
              ? 'When candidates apply to your job listings, their applications will appear here.'
              : 'Start applying to jobs to see your applications here.'}
          </p>
        </div>
      </div>
    );
  }

  const selectedApplicationData = applications.find(app => app.id === selectedApplication);
  const candidate = selectedApplicationData ? getCandidateProfile(selectedApplicationData.applicantId) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {userProfile?.role === 'facility' ? 'Manage Applications' : 'My Applications'}
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Applications List */}
        <div className="lg:col-span-1 space-y-4">
          {applications.map((application) => (
            <div
              key={application.id}
              className={`bg-white rounded-lg shadow-sm p-4 cursor-pointer transition hover:shadow-md ${
                selectedApplication === application.id ? 'ring-2 ring-green-500' : ''
              }`}
              onClick={() => {
                setSelectedApplication(application.id);
                setIsModalOpen(true);
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {getJobTitle(application.jobId)}
                  </h3>
                  <div className="mt-1 text-sm text-gray-500">
                    Applied {format(new Date(application.appliedAt), 'MMM d, yyyy')}
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                  application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  application.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {application.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Application Details Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedApplication(null);
          }}
          title="Application Details"
        >
          {selectedApplicationData && candidate && (
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {getJobTitle(selectedApplicationData.jobId)}
                </h2>
                <div className="flex items-center text-gray-500 text-sm">
                  <Clock className="h-4 w-4 mr-1" />
                  Applied {format(new Date(selectedApplicationData.appliedAt), 'PPP')}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Candidate Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-600">
                    <User className="h-4 w-4 mr-2" />
                    {candidate.firstName} {candidate.lastName}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {candidate.email}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {candidate.phone}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {candidate.location}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Cover Letter</h3>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {selectedApplicationData.coverLetter}
                </p>
              </div>

              {selectedApplicationData.attachments && selectedApplicationData.attachments.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Attachments</h3>
                  <div className="space-y-2">
                    {selectedApplicationData.attachments.map((url, index) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-green-600 hover:text-green-700"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Attachment {index + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {userProfile?.role === 'facility' && (
                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <button
                    onClick={() => handleStatusUpdate(selectedApplicationData.id, 'reviewed')}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Mark as Reviewed
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedApplicationData.id, 'accepted')}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Accept
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedApplicationData.id, 'rejected')}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </button>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}