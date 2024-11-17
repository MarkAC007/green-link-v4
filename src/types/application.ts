export interface JobApplication {
  id: string;
  jobId: string;
  applicantId: string;
  facilityProfileId: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  coverLetter?: string;
  attachments?: string[];
  appliedAt: string;
  updatedAt: string;
  notes?: string;
}

export type JobApplicationFormData = Omit<JobApplication, 
  'id' | 'applicantId' | 'facilityProfileId' | 'appliedAt' | 'updatedAt' | 'status'
>;