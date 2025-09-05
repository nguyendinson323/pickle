# Step 2: User Registration and Profile Management

## Overview
This step builds the complete user registration system for all user roles (Player, Coach, Club, Partner, State Committee) with role-specific forms, file upload capabilities via Cloudinary, and comprehensive profile management. Each registration form includes Mexican-specific fields (CURP, RFC, INE) and privacy policy acceptance.
Before rendering a page, all required data for the page should be prepared from backend through API endpoint to store on Redux.
For each page, you must accurately determine whether the functionalities of all dynamic elements, including buttons, are correctly integrated with the backend and accurately reflected in Redux to ensure real-time updates.
There are already data seeded to test in database .
You need to test with only this database seeded data from backend.
Don't use any mockup, simulation or random data for frontend.

## Objectives
- Create role-specific registration forms
- Implement Cloudinary file upload for photos and documents
- Build profile management systems for all user types
- Add Mexican states integration
- Create privacy policy system
- Build profile editing functionality

## Database Extensions
### New Tables/Fields Required
- File uploads tracking (already in schema)
- Privacy policy acceptance tracking
- Profile completion status tracking

## Backend Development Tasks

### 1. File Upload Service
**Files to Create:**
- `src/services/cloudinaryService.ts` - Cloudinary integration
- `src/middleware/fileUpload.ts` - Multer configuration
- `src/controllers/uploadController.ts` - File upload endpoints

**Cloudinary Configuration:**
```typescript
// services/cloudinaryService.ts
export interface FileUploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
  originalFilename: string;
  bytes: number;
  format: string;
}

export const uploadToCloudinary = async (
  buffer: Buffer, 
  folder: string, 
  originalName: string
): Promise<FileUploadResult>

export const deleteFromCloudinary = async (publicId: string): Promise<void>
```

### 2. Registration Controllers
**Files to Create:**
- `src/controllers/registrationController.ts` - Handle all registration types
- `src/services/registrationService.ts` - Business logic for registration

**Registration Methods:**
- `registerPlayer()` - Player registration with CURP, photo, ID document
- `registerCoach()` - Coach registration (same as player)  
- `registerClub()` - Club registration with manager info
- `registerPartner()` - Partner/business registration
- `registerStateCommittee()` - State committee registration

### 3. Profile Controllers
**Files to Create:**
- `src/controllers/profileController.ts` - Profile management
- `src/services/profileService.ts` - Profile business logic

**Profile Methods:**
- `getProfile()` - Get user profile by role
- `updateProfile()` - Update profile information
- `uploadProfilePhoto()` - Update profile photo
- `uploadIdDocument()` - Update ID document

### 4. States and Data Controllers
**Files to Create:**
- `src/controllers/dataController.ts` - Static data endpoints

**Methods:**
- `getStates()` - Get all Mexican states
- `getMembershipPlans()` - Get available membership plans
- `getPrivacyPolicy()` - Get privacy policy content

### 5. API Endpoints
```
Registration Endpoints:
POST /api/registration/player
POST /api/registration/coach  
POST /api/registration/club
POST /api/registration/partner
POST /api/registration/state-committee

Profile Endpoints:
GET /api/profile/me
PUT /api/profile/me
POST /api/profile/upload-photo
POST /api/profile/upload-document

File Upload Endpoints:
POST /api/upload/image
POST /api/upload/document
DELETE /api/upload/:publicId

Data Endpoints:
GET /api/data/states
GET /api/data/membership-plans
GET /api/data/privacy-policy
```

## Frontend Development Tasks

### 1. Registration Components
**Files to Create:**
- `src/components/registration/RoleSelector.tsx` - Select account type
- `src/components/registration/PlayerRegistrationForm.tsx`
- `src/components/registration/CoachRegistrationForm.tsx`
- `src/components/registration/ClubRegistrationForm.tsx`
- `src/components/registration/PartnerRegistrationForm.tsx`
- `src/components/registration/StateCommitteeRegistrationForm.tsx`
- `src/components/registration/PrivacyPolicyModal.tsx`
- `src/components/common/FileUpload.tsx` - Reusable file upload
- `src/components/common/ImageCropper.tsx` - Photo cropping (Facebook-style)

### 2. Form Components
**Files to Create:**
- `src/components/forms/FormField.tsx` - Reusable form field
- `src/components/forms/SelectField.tsx` - Dropdown select
- `src/components/forms/FileField.tsx` - File upload field
- `src/components/forms/CheckboxField.tsx` - Checkbox with label

### 3. Profile Management
**Files to Create:**
- `src/components/profile/ProfileView.tsx` - View profile info
- `src/components/profile/ProfileEdit.tsx` - Edit profile form
- `src/components/profile/PhotoUpload.tsx` - Profile photo management
- `src/components/profile/DocumentUpload.tsx` - ID document upload

### 4. Pages
**Files to Create:**
- `src/pages/RegistrationPage.tsx` - Main registration page
- `src/pages/ProfilePage.tsx` - Profile management page

### 5. Redux State Management
**Files to Create:**
- `src/store/registrationSlice.ts` - Registration state
- `src/store/profileSlice.ts` - Profile state
- `src/store/dataSlice.ts` - Static data (states, plans)

### 6. Services
**Files to Create:**
- `src/services/registrationService.ts` - Registration API calls
- `src/services/profileService.ts` - Profile API calls
- `src/services/uploadService.ts` - File upload service

## Type Definitions

### Backend Types
```typescript
// types/registration.ts
export interface PlayerRegistrationData {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  stateId: number;
  curp: string;
  nrtpLevel: string;
  email: string;
  mobilePhone: string;
  username: string;
  password: string;
  privacyPolicyAccepted: boolean;
  profilePhoto?: Express.Multer.File;
  idDocument?: Express.Multer.File;
}

export interface ClubRegistrationData {
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
  username: string;
  password: string;
  privacyPolicyAccepted: boolean;
  logo?: Express.Multer.File;
}

// Similar interfaces for Coach, Partner, StateCommittee
```

### Frontend Types
```typescript
// types/registration.ts
export interface RegistrationState {
  selectedRole: UserRole | null;
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
  completedSteps: string[];
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
}
```

## Form Specifications

### Player/Coach Registration Form
**Fields:**
- Full Name (text, required)
- Date of Birth (date, required) 
- Gender (select: Masculino, Femenino, Otro)
- State (select from states table)
- CURP (text, 18 chars, required)
- NRTP Level (select: 1.0-7.0)
- Email (email, required)
- Mobile Phone (tel, required)
- Profile Photo (file upload, oval crop)
- ID Document (file upload, INE or Passport)
- Username (text, required, unique check)
- Password (password, required, min 8 chars)
- Confirm Password (password, required)
- Privacy Policy (checkbox, required, modal view)

### Club Registration Form
**Fields:**
- Club Name (text, required)
- RFC (text, optional, Mexican tax ID)
- Club Manager (text, required)
- Manager Role/Title (text, required)
- Contact Email (email, required)
- Phone/WhatsApp (tel, required)
- State (select from states)
- Type of Club (select: Competitive, Recreational, Mixed)
- Website/Social Media (url, optional)
- Logo (file upload, optional)
- Username (text, required, unique check)
- Password (password, required)
- Confirm Password (password, required)
- Privacy Policy (checkbox, required)

### Partner Registration Form
**Fields:**
- Business Name (text, required)
- RFC (text, optional)
- Contact Person Name (text, required)
- Contact Person Title (text, required)
- Email (email, required)
- Phone/WhatsApp (tel, required)
- Type of Partner (select: Hotel, Resort, Camp, Private Company, Court Owner)
- Website/Social Media (url, optional)
- Logo (file upload, optional)
- Username (text, required, unique check)
- Password (password, required)
- Confirm Password (password, required)
- Privacy Policy (checkbox, required)

### State Committee Registration Form
**Fields:**
- Association/Committee Name (text, required)
- RFC (text, optional)
- President/Representative Name (text, required)
- Role/Title (text, required)
- Institutional Email (email, required)
- Phone/WhatsApp (tel, required)
- State (select from states)
- Type of Affiliate (text, required)
- Website/Social Media (url, optional)
- Logo (file upload, optional)
- Username (text, required, unique check)
- Password (password, required)
- Confirm Password (password, required)
- Privacy Policy (checkbox, required)

## File Upload Specifications

### Profile Photo Requirements
- File types: JPG, PNG
- Max size: 5MB
- Aspect ratio: Square (1:1)
- Cropping: Oval/circular crop like Facebook
- Output size: 400x400px
- Upload to: cloudinary/profiles/photos/

### ID Document Requirements
- File types: PDF, JPG, PNG
- Max size: 10MB
- Documents accepted: INE (Mexican ID), Passport
- Upload to: cloudinary/profiles/documents/
- Security: Private access only

### Logo Requirements (Clubs, Partners, States)
- File types: JPG, PNG, SVG
- Max size: 2MB
- Recommended size: 200x200px
- Upload to: cloudinary/organizations/logos/

## Privacy Policy System

### Privacy Policy Management
**Features:**
- Downloadable PDF version
- Modal view during registration
- Version tracking for legal compliance
- Acceptance timestamp recording

**Implementation:**
- Store policy content in database
- Version control for policy updates
- Track user acceptance with timestamps
- Generate PDF for download

## Error Handling

### Backend Error Response Format
```typescript
interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    field?: string;
    details?: any;
  };
}
```

### Frontend Error Handling
- Form-level submission errors
- File upload error handling
- Network error recovery
- User-friendly error messages in Spanish

## Testing Requirements

### Backend Testing
```bash
# Test registration endpoints
POST /api/registration/player
POST /api/registration/club

# Test file uploads
POST /api/upload/image
POST /api/upload/document

# Test profile endpoints
GET /api/profile/me
PUT /api/profile/me
```

### Frontend Testing
- Test all registration forms
- Verify file upload functionality
- Verify image cropping
- Test privacy policy modal
- Test profile editing

### Integration Testing
- Complete registration flow for each role
- File upload to Cloudinary
- Profile photo cropping and saving
- Document upload and verification
- Privacy policy acceptance tracking

## Environment Variables

### Backend Additional Variables
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_FOLDER=pickleball-admin
MAX_FILE_SIZE=10485760
PRIVACY_POLICY_VERSION=1.0
```

### Frontend Additional Variables
```env
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=unsigned-preset
VITE_MAX_FILE_SIZE=10485760
```

## Success Criteria
✅ All registration forms work correctly
✅ File uploads to Cloudinary function properly
✅ Profile photo cropping works (Facebook-style)
✅ ID document upload is secure
✅ Privacy policy modal displays and tracks acceptance
✅ Profile editing works for all user types
✅ Mexican states populate correctly in dropdowns
✅ Username uniqueness is enforced
✅ All user roles can register successfully
✅ Profile completion status is tracked
✅ File upload progress indicators work
✅ Error messages are user-friendly and in Spanish

## Commands to Test
```bash
# Test file uploads
curl -X POST http://localhost:5000/api/upload/image \
  -H "Authorization: Bearer <token>" \
  -F "file=@test-photo.jpg"

# Test registration
curl -X POST http://localhost:5000/api/registration/player \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test Player","email":"test@example.com",...}'

# Test profile retrieval
curl -X GET http://localhost:5000/api/profile/me \
  -H "Authorization: Bearer <token>"
```

## Next Steps
After completing this step, you should have:
- Complete user registration system for all roles
- File upload functionality with Cloudinary
- Profile management system
- Privacy policy compliance
- Ready foundation for membership and payment integration

The next step will focus on building role-specific dashboards and core UI components.