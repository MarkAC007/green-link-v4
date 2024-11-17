export interface JobListing {
  id?: string;
  userId: string;
  facilityProfileId: string;
  title: string;
  description: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'temporary';
  salary: {
    amount: number;
    type: 'hourly' | 'daily' | 'fixed';
    currency: 'GBP' | 'USD' | 'EUR';
  };
  requirements: string[];
  requiredSkills: string[];
  status: 'open' | 'closed' | 'filled' | 'draft' | 'deleted';
  createdAt: string;
  updatedAt: string;
  applications?: JobApplication[];
  applicationCount?: number;
}

export interface JobApplication {
  id: string;
  jobId: string;
  applicantId: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  coverLetter?: string;
  attachments?: string[];
  appliedAt: string;
  updatedAt: string;
  notes?: string;
}