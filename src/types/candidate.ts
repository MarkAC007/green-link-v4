export interface CandidateProfile {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  skills: Array<{
    id: string;
    status: 'pending' | 'verified' | 'rejected';
    verifiedBy?: string;
    verifiedAt?: string;
    rejectionReason?: string;
  }>;
  certifications: string[];
  availability: 'immediate' | 'two_weeks' | 'month_plus';
  preferences: {
    jobTypes: string[];
    preferredLocations: string[];
    remote: boolean;
  };
  experience: Array<{
    title: string;
    company: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CandidateProfileFormData extends Omit<CandidateProfile, 'userId' | 'createdAt' | 'updatedAt'> {}