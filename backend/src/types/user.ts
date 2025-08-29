export type AffiliationStatus = 'active' | 'inactive' | 'pending' | 'expired';
export type PlanType = 'basic' | 'premium';

export interface User {
  id: number;
  username: string;
  email: string;
  passwordHash: string;
  role: string;
  isActive: boolean;
  emailVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface State {
  id: number;
  name: string;
  code: string;
  createdAt: Date;
}