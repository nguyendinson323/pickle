export type UserRole = 'player' | 'coach' | 'club' | 'partner' | 'state';

export interface RegistrationState {
  selectedRole: UserRole | null;
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
  completedSteps: string[];
}

export interface BaseRegistrationData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  privacyPolicyAccepted: boolean;
}

export interface PlayerRegistrationData extends BaseRegistrationData {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  stateId: number;
  curp: string;
  nrtpLevel?: string;
  mobilePhone: string;
  profilePhoto?: File;
  idDocument?: File;
}

export interface CoachRegistrationData extends PlayerRegistrationData {}

export interface ClubRegistrationData extends BaseRegistrationData {
  name: string;
  rfc?: string;
  managerName: string;
  managerRole: string;
  contactEmail: string;
  phone: string;
  stateId: number;
  clubType: string;
  website?: string;
  socialMedia?: Record<string, string>;
  logo?: File;
}

export interface PartnerRegistrationData extends BaseRegistrationData {
  businessName: string;
  rfc?: string;
  contactPersonName: string;
  contactPersonTitle: string;
  phone: string;
  partnerType: string;
  website?: string;
  socialMedia?: Record<string, string>;
  logo?: File;
}

export interface StateCommitteeRegistrationData extends BaseRegistrationData {
  name: string;
  rfc?: string;
  presidentName: string;
  presidentTitle: string;
  institutionalEmail: string;
  phone: string;
  stateId: number;
  affiliateType: string;
  website?: string;
  socialMedia?: Record<string, string>;
  logo?: File;
}

export interface FormFieldProps {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface State {
  id: number;
  name: string;
  code: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  role: UserRole;
  type: 'basic' | 'premium';
  annualFee: number;
  description: string;
  features: string[];
}

export interface RegistrationResponse {
  success: boolean;
  user?: {
    id: number;
    username: string;
    email: string;
    role: UserRole;
    profile: any;
  };
  token?: string;
  error?: string;
}