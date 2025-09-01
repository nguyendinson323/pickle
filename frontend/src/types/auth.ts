export type UserRole = 'player' | 'coach' | 'club' | 'partner' | 'state' | 'federation';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  profile: PlayerProfile | CoachProfile | ClubProfile | PartnerProfile | StateCommitteeProfile | null;
}

export interface PlayerProfile {
  id: number;
  userId: number;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  stateId: number;
  curp?: string;
  nrtpLevel?: string;
  mobilePhone?: string;
  profilePhotoUrl?: string;
  idDocumentUrl?: string;
  nationality: string;
  canBeFound: boolean;
  isPremium: boolean;
  rankingPosition?: number;
  federationIdNumber?: string;
}

export interface CoachProfile {
  id: number;
  userId: number;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  stateId: number;
  curp?: string;
  nrtpLevel?: string;
  mobilePhone?: string;
  profilePhotoUrl?: string;
  idDocumentUrl?: string;
  nationality: string;
  licenseType?: string;
  rankingPosition?: number;
  federationIdNumber?: string;
}

export interface ClubProfile {
  id: number;
  userId: number;
  name: string;
  rfc?: string;
  managerName: string;
  managerRole: string;
  contactEmail: string;
  phone?: string;
  stateId: number;
  clubType?: string;
  website?: string;
  socialMedia?: any;
  logoUrl?: string;
  hasCourts: boolean;
  planType: 'basic' | 'premium';
}

export interface PartnerProfile {
  id: number;
  userId: number;
  businessName: string;
  rfc?: string;
  contactPersonName: string;
  contactPersonTitle: string;
  email: string;
  phone?: string;
  partnerType: string;
  website?: string;
  socialMedia?: any;
  logoUrl?: string;
  planType: 'premium';
}

export interface StateCommitteeProfile {
  id: number;
  userId: number;
  name: string;
  rfc?: string;
  presidentName: string;
  presidentTitle: string;
  institutionalEmail: string;
  phone?: string;
  stateId: number;
  affiliateType?: string;
  website?: string;
  socialMedia?: any;
  logoUrl?: string;
}

export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginAttempts: number;
  lastLoginTime: string | null;
}