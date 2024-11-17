import { FacilityProfile } from './facility';

export interface CourseProfile {
  id?: string;
  facilityProfileId: string;
  name: string;
  description: string;
  location: string;
  courseDetails: {
    holes: number;
    totalYardage: number;
    par: number;
    courseRating?: number;
    slopeRating?: number;
  };
  photos: string[];
  status: 'active' | 'inactive' | 'maintenance';
  createdAt: string;
  updatedAt: string;
}

export type CourseProfileFormData = Omit<CourseProfile, 'id' | 'facilityProfileId' | 'createdAt' | 'updatedAt'>;