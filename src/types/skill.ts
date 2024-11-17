export interface Skill {
  id: string;
  name: string;
  category?: string;
  description?: string;
  requiresEvidence: boolean;
  acceptedFileTypes?: string[];
}

export type SkillVerificationStatus = 'pending' | 'verified' | 'rejected';

export interface SkillClaim {
  id: string;
  userId: string;
  skillId: string;
  status: SkillVerificationStatus;
  evidence: SkillEvidence[];
  verifiedBy?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SkillEvidence {
  id: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  uploadedAt: string;
  description?: string;
}

export interface SkillVerificationMetrics {
  totalVerified: number;
  totalRejected: number;
  totalPending: number;
  averageVerificationTime: number;
  verificationsBySkill: Record<string, number>;
}