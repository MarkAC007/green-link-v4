export interface UserProfile {
  userId: string;
  email: string;
  role: 'candidate' | 'facility' | 'admin';
  displayName?: string;
  photoURL?: string;
  createdAt: string;
  updatedAt: string;
  profileComplete: boolean;
}