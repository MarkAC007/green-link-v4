export interface OperatingHours {
  open: string;
  close: string;
}

export interface FacilityProfile {
  userId: string;
  name: string;
  type: 'golf_course' | 'sports_facility' | 'other';
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  website?: string;
  description: string;
  facilities: string[];
  amenities: string[];
  photos: string[];
  operatingHours: {
    monday: OperatingHours;
    tuesday: OperatingHours;
    wednesday: OperatingHours;
    thursday: OperatingHours;
    friday: OperatingHours;
    saturday: OperatingHours;
    sunday: OperatingHours;
  };
  createdAt: string;
  updatedAt: string;
}

export type FacilityProfileFormData = Omit<FacilityProfile, 'userId' | 'createdAt' | 'updatedAt'>;