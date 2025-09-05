# 02. User Profile Management System - Complete Implementation Guide

## Overview
The current project lacks comprehensive user profile management workflows. Users need complete profile creation, editing, credential generation, and role-specific profile features based on the admin requirements.

## Missing Components Analysis

### Critical Missing Features
1. **Profile Photo Upload with Crop/Center**: Facebook-style photo editing
2. **Document Upload System**: ID documents, PDFs for verification
3. **Digital Credential Generation**: QR code-enabled official credentials
4. **Profile Completion Workflow**: Multi-step profile setup
5. **Privacy Settings**: "Can Be Found" toggle for player search
6. **Role-specific Profile Views**: Different layouts per user role

## Step-by-Step Implementation Plan

### Phase 1: Profile Photo Management System

#### 1.1 Create Photo Upload Component (`frontend/src/components/profile/PhotoUpload.tsx`)
```typescript
interface PhotoUploadProps {
  currentPhoto?: string;
  onPhotoUpdate: (photoUrl: string) => void;
  isLoading?: boolean;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ 
  currentPhoto, 
  onPhotoUpdate,
  isLoading 
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cropData, setCropData] = useState<string>('');
  const [cropper, setCropper] = useState<Cropper>();
  const [showCropModal, setShowCropModal] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type and size
      if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
        alert('Please select a valid image file (JPEG, JPG, or PNG)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image size must be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      setShowCropModal(true);
    }
  };

  const handleCrop = () => {
    if (cropper) {
      const canvas = cropper.getCroppedCanvas({
        width: 300,
        height: 300,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
      });
      
      canvas.toBlob(async (blob) => {
        if (blob) {
          const formData = new FormData();
          formData.append('photo', blob, 'profile.jpg');
          
          try {
            const response = await apiService.uploadFile('/upload/profile-photo', blob, 'photo');
            onPhotoUpdate(response.url);
            setShowCropModal(false);
          } catch (error) {
            console.error('Photo upload failed:', error);
            alert('Failed to upload photo. Please try again.');
          }
        }
      }, 'image/jpeg', 0.9);
    }
  };

  return (
    <div className="profile-photo-upload">
      {/* Current photo display */}
      <div className="relative w-32 h-32 mx-auto mb-4">
        <img
          src={currentPhoto || '/default-avatar.png'}
          alt="Profile"
          className="w-full h-full rounded-full object-cover border-4 border-gray-200"
        />
        <button
          type="button"
          onClick={() => document.getElementById('photo-input')?.click()}
          className="absolute bottom-0 right-0 bg-primary-600 text-white rounded-full p-2 hover:bg-primary-700 transition-colors"
          disabled={isLoading}
        >
          <CameraIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Hidden file input */}
      <input
        id="photo-input"
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Crop Modal */}
      {showCropModal && selectedFile && (
        <Modal isOpen={showCropModal} onClose={() => setShowCropModal(false)}>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Adjust Your Photo</h3>
            <div className="mb-4">
              <Cropper
                src={URL.createObjectURL(selectedFile)}
                style={{ height: 400, width: '100%' }}
                initialAspectRatio={1}
                aspectRatio={1}
                guides={false}
                crop={handleCrop}
                ref={(ref) => setCropper(ref)}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowCropModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCrop}
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Uploading...' : 'Save Photo'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
```

#### 1.2 Backend Photo Upload Endpoint (`backend/src/controllers/uploadController.ts`)
```typescript
import { v2 as cloudinary } from 'cloudinary';

const uploadProfilePhoto = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No photo file provided'
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'profile_photos',
      transformation: [
        { width: 300, height: 300, crop: 'fill', gravity: 'face' },
        { quality: 'auto:good' },
        { format: 'jpg' }
      ]
    });

    // Update user profile with new photo URL
    const userId = req.user.userId;
    await User.update(
      { profilePhotoUrl: result.secure_url },
      { where: { id: userId } }
    );

    return res.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    });
  } catch (error) {
    console.error('Photo upload error:', error);
    return res.status(500).json({
      success: false,
      error: 'Photo upload failed'
    });
  }
};
```

### Phase 2: Document Upload System

#### 2.1 Create Document Upload Component (`frontend/src/components/profile/DocumentUpload.tsx`)
```typescript
interface DocumentUploadProps {
  label: string;
  accept: string;
  maxSize: number; // in MB
  currentDocument?: string;
  onDocumentUpdate: (documentUrl: string) => void;
  required?: boolean;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  label,
  accept,
  maxSize,
  currentDocument,
  onDocumentUpdate,
  required = false
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = async (file: File) => {
    // Validate file
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      alert(`File size must be less than ${maxSize}MB`);
      return;
    }

    const allowedTypes = accept.split(',').map(type => type.trim());
    if (!allowedTypes.some(type => file.type.match(type))) {
      alert('Please select a valid file type');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('document', file);

      const response = await apiService.uploadFile('/upload/document', file, 'document');
      onDocumentUpdate(response.url);
    } catch (error) {
      console.error('Document upload failed:', error);
      alert('Failed to upload document. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  return (
    <div className="document-upload">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        {currentDocument ? (
          <div className="flex items-center justify-center space-x-2">
            <DocumentIcon className="w-8 h-8 text-green-500" />
            <span className="text-sm text-green-600">Document uploaded</span>
            <button
              type="button"
              onClick={() => window.open(currentDocument, '_blank')}
              className="text-primary-600 hover:text-primary-800 text-sm underline"
            >
              View
            </button>
          </div>
        ) : (
          <div>
            <DocumentIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Drag and drop your document here, or{' '}
              <button
                type="button"
                onClick={() => document.getElementById(`file-input-${label}`)?.click()}
                className="text-primary-600 hover:text-primary-800 underline"
                disabled={isUploading}
              >
                browse
              </button>
            </p>
            <p className="text-xs text-gray-500">
              Supported formats: {accept} • Max size: {maxSize}MB
            </p>
          </div>
        )}

        {isUploading && (
          <div className="mt-2">
            <LoadingSpinner size="sm" />
            <p className="text-xs text-gray-500 mt-1">Uploading...</p>
          </div>
        )}
      </div>

      <input
        id={`file-input-${label}`}
        type="file"
        accept={accept}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file);
        }}
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
};
```

### Phase 3: Digital Credential Generation System

#### 3.1 Create Credential Component (`frontend/src/components/credentials/DigitalCredential.tsx`)
```typescript
interface CredentialData {
  id: string;
  fullName: string;
  role: string;
  state: string;
  nrtpLevel?: string;
  affiliationStatus: 'active' | 'expired' | 'pending';
  rankingPosition?: number;
  clubStatus?: string;
  licenseType?: string;
  nationality: string;
  profilePhoto: string;
}

const DigitalCredential: React.FC<{ data: CredentialData }> = ({ data }) => {
  const qrCodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate QR code pointing to public credential view
    const qrUrl = `${window.location.origin}/credential/${data.id}`;
    
    if (qrCodeRef.current) {
      // Clear previous QR code
      qrCodeRef.current.innerHTML = '';
      
      // Generate new QR code
      QRCode.toCanvas(qrCodeRef.current, qrUrl, {
        width: 120,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
    }
  }, [data.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'expired': return 'text-red-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const handleDownload = async () => {
    const element = document.getElementById('credential-card');
    if (element) {
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true
      });
      
      const link = document.createElement('a');
      link.download = `credential-${data.fullName.replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className="credential-container max-w-md mx-auto">
      <div 
        id="credential-card"
        className="bg-white border-2 border-gray-200 rounded-lg shadow-lg p-6"
        style={{
          backgroundImage: `url('/credential-background.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Header with Federation Logo */}
        <div className="flex items-center justify-between mb-4">
          <img 
            src="/admin-logo.png" 
            alt="Mexican Pickleball Federation"
            className="h-12 w-auto"
          />
          <div className="text-right">
            <h3 className="text-sm font-bold text-gray-800">
              MEXICAN PICKLEBALL
            </h3>
            <h3 className="text-sm font-bold text-gray-800">FEDERATION</h3>
          </div>
        </div>

        {/* Profile Photo */}
        <div className="flex items-start space-x-4 mb-4">
          <img
            src={data.profilePhoto || '/default-avatar.png'}
            alt={data.fullName}
            className="w-20 h-20 rounded-full border-2 border-gray-300 object-cover"
          />
          
          <div className="flex-1">
            {/* Name */}
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              {data.fullName}
            </h2>
            
            {/* Role */}
            <p className="text-sm font-semibold text-primary-600 mb-1 capitalize">
              {data.role.replace('_', ' ')}
            </p>
            
            {/* State */}
            <p className="text-sm text-gray-600">
              {data.state}
            </p>
          </div>
        </div>

        {/* Credential Details */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
          {data.nrtpLevel && (
            <div>
              <span className="font-semibold">NRTP Level:</span>
              <span className="ml-1">{data.nrtpLevel}</span>
            </div>
          )}
          
          <div>
            <span className="font-semibold">Status:</span>
            <span className={`ml-1 ${getStatusColor(data.affiliationStatus)}`}>
              {data.affiliationStatus.toUpperCase()}
            </span>
          </div>
          
          {data.rankingPosition && (
            <div>
              <span className="font-semibold">Ranking:</span>
              <span className="ml-1">#{data.rankingPosition}</span>
            </div>
          )}
          
          {data.clubStatus && (
            <div>
              <span className="font-semibold">Club:</span>
              <span className="ml-1">{data.clubStatus}</span>
            </div>
          )}
          
          {data.licenseType && (
            <div>
              <span className="font-semibold">License:</span>
              <span className="ml-1">{data.licenseType}</span>
            </div>
          )}
          
          <div>
            <span className="font-semibold">ID:</span>
            <span className="ml-1">#{data.id}</span>
          </div>
        </div>

        {/* QR Code and Nationality */}
        <div className="flex items-center justify-between">
          <div ref={qrCodeRef} className="bg-white p-1 rounded" />
          <div className="text-right">
            <img
              src={`/flags/${data.nationality.toLowerCase()}.png`}
              alt={data.nationality}
              className="w-8 h-6 rounded shadow-sm"
              onError={(e) => {
                e.currentTarget.src = '/flags/mx.png'; // Default to Mexico
              }}
            />
            <p className="text-xs text-gray-600 mt-1">{data.nationality}</p>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        className="w-full mt-4 btn-primary flex items-center justify-center space-x-2"
      >
        <DownloadIcon className="w-4 h-4" />
        <span>Download Credential</span>
      </button>
    </div>
  );
};
```

### Phase 4: Complete Profile Management Workflow

#### 4.1 Profile Completion Wizard (`frontend/src/components/profile/ProfileWizard.tsx`)
```typescript
interface WizardStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<any>;
  isComplete: boolean;
  isRequired: boolean;
}

const ProfileWizard: React.FC<{ userRole: UserRole }> = ({ userRole }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [profileData, setProfileData] = useState({});

  const getStepsForRole = (role: UserRole): WizardStep[] => {
    const commonSteps = [
      {
        id: 'basic-info',
        title: 'Basic Information',
        description: 'Complete your personal details',
        component: BasicInfoStep,
        isComplete: false,
        isRequired: true
      },
      {
        id: 'photo',
        title: 'Profile Photo',
        description: 'Upload and crop your profile photo',
        component: PhotoStep,
        isComplete: false,
        isRequired: true
      },
      {
        id: 'documents',
        title: 'Document Verification',
        description: 'Upload required identification documents',
        component: DocumentStep,
        isComplete: false,
        isRequired: true
      }
    ];

    // Role-specific additional steps
    const roleSpecificSteps: Record<UserRole, WizardStep[]> = {
      player: [
        {
          id: 'privacy',
          title: 'Privacy Settings',
          description: 'Configure your visibility in player search',
          component: PrivacyStep,
          isComplete: false,
          isRequired: false
        }
      ],
      club: [
        {
          id: 'club-details',
          title: 'Club Details',
          description: 'Add information about your club',
          component: ClubDetailsStep,
          isComplete: false,
          isRequired: true
        }
      ],
      // Add other role-specific steps...
    };

    return [...commonSteps, ...(roleSpecificSteps[role] || [])];
  };

  const steps = getStepsForRole(userRole);

  const handleStepComplete = (stepData: any) => {
    setProfileData({ ...profileData, ...stepData });
    
    // Mark current step as complete
    steps[currentStep].isComplete = true;
    
    // Move to next step if not last
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = async () => {
    try {
      await apiService.updateProfile(profileData);
      // Redirect to dashboard or show success message
      navigate('/dashboard');
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center ${
                index < steps.length - 1 ? 'flex-1' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step.isComplete
                    ? 'bg-green-500 text-white'
                    : currentStep === index
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step.isComplete ? '✓' : index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-4 ${
                    step.isComplete ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900">
          {steps[currentStep]?.title}
        </h2>
        <p className="text-gray-600">
          {steps[currentStep]?.description}
        </p>
      </div>

      {/* Current Step Component */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        {steps[currentStep] && (
          <steps[currentStep].component
            onComplete={handleStepComplete}
            data={profileData}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="btn-secondary"
        >
          Previous
        </button>
        
        {currentStep === steps.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="btn-primary"
          >
            Complete Profile
          </button>
        ) : (
          <button
            onClick={() => setCurrentStep(currentStep + 1)}
            className="btn-primary"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};
```

### Phase 5: Privacy Settings for Player Search

#### 5.1 Privacy Settings Component (`frontend/src/components/profile/PrivacySettings.tsx`)
```typescript
const PrivacySettings: React.FC = () => {
  const user = useAppSelector(selectCurrentUser);
  const [canBeFound, setCanBeFound] = useState(user?.canBeFound || false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleVisibility = async () => {
    setIsLoading(true);
    
    try {
      await apiService.updateProfile({
        canBeFound: !canBeFound
      });
      
      setCanBeFound(!canBeFound);
      
      // Show success message
      toast.success(
        canBeFound 
          ? 'You are now hidden from player search'
          : 'You are now visible in player search'
      );
    } catch (error) {
      console.error('Privacy setting update failed:', error);
      toast.error('Failed to update privacy setting');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Player Search Visibility
      </h3>
      
      <div className="flex items-start space-x-4">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 mb-2">
            Can Be Found
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            When enabled, other players can find you in the player search feature. 
            This allows them to connect with you for matches and activities. 
            When disabled, your profile will be hidden from all search results.
          </p>
          
          <div className="flex items-center space-x-3">
            <Switch
              checked={canBeFound}
              onChange={handleToggleVisibility}
              disabled={isLoading}
              className={`${
                canBeFound ? 'bg-primary-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
            >
              <span
                className={`${
                  canBeFound ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
            
            <span className={`text-sm font-medium ${
              canBeFound ? 'text-green-600' : 'text-gray-600'
            }`}>
              {canBeFound ? 'Visible' : 'Hidden'}
            </span>
            
            {isLoading && <LoadingSpinner size="sm" />}
          </div>
        </div>
        
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          canBeFound ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
        }`}>
          {canBeFound ? (
            <EyeIcon className="w-6 h-6" />
          ) : (
            <EyeSlashIcon className="w-6 h-6" />
          )}
        </div>
      </div>
      
      {canBeFound && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h5 className="font-medium text-blue-900 mb-2">What others can see:</h5>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Your name and profile photo</li>
            <li>• Your NRTP level and ranking</li>
            <li>• Your general location (city/state)</li>
            <li>• Your playing preferences</li>
          </ul>
          <p className="text-xs text-blue-600 mt-2">
            Your contact information and personal details remain private.
          </p>
        </div>
      )}
    </div>
  );
};
```

## Backend Implementation Requirements

### Database Updates
```sql
-- Add missing columns to users table
ALTER TABLE users ADD COLUMN profile_photo_url VARCHAR(500);
ALTER TABLE users ADD COLUMN id_document_url VARCHAR(500);
ALTER TABLE users ADD COLUMN profile_completion_percentage INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN profile_completed_at TIMESTAMP;

-- Add privacy settings to player profiles
ALTER TABLE players ADD COLUMN can_be_found BOOLEAN DEFAULT true;
ALTER TABLE players ADD COLUMN search_visibility_settings JSONB;
```

### Profile Service Updates (`backend/src/services/profileService.ts`)
```typescript
const updateProfile = async (userId: string, profileData: any) => {
  const user = await User.findByPk(userId, {
    include: [
      { model: Player, as: 'playerProfile' },
      { model: Club, as: 'clubProfile' },
      { model: Coach, as: 'coachProfile' },
      // ... other profile associations
    ]
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Update user table fields
  await user.update({
    profilePhotoUrl: profileData.profilePhotoUrl,
    idDocumentUrl: profileData.idDocumentUrl,
    // ... other common fields
  });

  // Update role-specific profile
  if (user.role === 'player' && user.playerProfile) {
    await user.playerProfile.update({
      canBeFound: profileData.canBeFound,
      // ... other player-specific fields
    });
  }

  // Calculate and update profile completion percentage
  const completionPercentage = calculateProfileCompletion(user);
  await user.update({ profileCompletionPercentage: completionPercentage });

  return user;
};

const calculateProfileCompletion = (user: any): number => {
  let totalFields = 10; // Base required fields
  let completedFields = 0;

  if (user.email) completedFields++;
  if (user.username) completedFields++;
  if (user.profilePhotoUrl) completedFields++;
  if (user.idDocumentUrl) completedFields++;
  // ... check other required fields based on role

  return Math.round((completedFields / totalFields) * 100);
};
```

## Implementation Priority

### Phase 1 (Critical - Week 1)
1. **Profile Photo Upload with Cropping**: Users need proper profile photos
2. **Document Upload System**: Required for verification
3. **Basic Profile Completion Workflow**: Essential for onboarding

### Phase 2 (High Priority - Week 2)
1. **Digital Credential Generation**: Core admin requirement
2. **Privacy Settings for Players**: Required for player search feature
3. **Role-specific Profile Views**: Different dashboards per role

### Phase 3 (Medium Priority - Week 3)
1. **Profile Completion Progress Tracking**: UX improvement
2. **Advanced Privacy Controls**: Enhanced user control
3. **Profile Verification Status**: Admin approval workflow

## Expected Results

After implementation:
- ✅ Users can upload and crop profile photos (Facebook-style)
- ✅ Users can upload ID documents for verification
- ✅ Digital credentials are automatically generated with QR codes
- ✅ Players can control their visibility in search results
- ✅ Profile completion is tracked and guided through wizard
- ✅ Role-specific profile features work correctly
- ✅ All profile data is properly validated and stored

## Files to Create/Modify

### Frontend
- `src/components/profile/PhotoUpload.tsx` (new)
- `src/components/profile/DocumentUpload.tsx` (new)  
- `src/components/credentials/DigitalCredential.tsx` (new)
- `src/components/profile/ProfileWizard.tsx` (new)
- `src/components/profile/PrivacySettings.tsx` (new)
- `src/pages/ProfilePage.tsx` (update)

### Backend
- `src/controllers/uploadController.ts` (new)
- `src/controllers/profileController.ts` (update)
- `src/services/profileService.ts` (update)  
- `src/routes/upload.ts` (new)
- Database migrations for new columns

This comprehensive profile management system will provide users with all the required functionality for profile creation, editing, and management according to the admin's specifications.