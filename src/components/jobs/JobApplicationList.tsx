import React from 'react';
import { useJobApplications } from '../../hooks/useJobApplications';
import { format } from 'date-fns';
import { Paperclip, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';

interface JobApplicationListProps {
  jobId?: string;
}

export function JobApplicationList({ jobId }: JobApplicationListProps) {
  const { applications, loading, updateApplication } = useJobApplications(jobId);

  const handleStatusUpdate = async (applicationId: string, newStatus: 'pending' | 'reviewed' | 'accepted' | 'rejected') => {
    try {
      await updateApplication(applicationId, { status: newStatus });
    } catch (error) {
      console.error('Failed to update application status:', error);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-24 bg-gray-100 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No applications found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <div
          key={application.id}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">
                  Applied {format(new Date(application.appliedAt), 'PPP')}
                </span>
              </div>
              
              {application.attachments && application.attachments.length > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <Paperclip className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {application.attachments.length} attachment(s)
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                  application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  application.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}
              >
                {application.status}
              </span>
            </div>
          </div>

          {application.coverLetter && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 line-clamp-3">{application.coverLetter}</p>
            </div>
          )}

          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() => handleStatusUpdate(application.id, 'reviewed')}
              className="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleStatusUpdate(application.id, 'accepted')}
              className="inline-flex items-center p-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleStatusUpdate(application.id, 'rejected')}
              className="inline-flex items-center p-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              <XCircle className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}