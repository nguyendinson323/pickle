import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/store';
import { selectUser } from '@/store/authSlice';
import PhotoUpload from './PhotoUpload';
import DocumentUpload from './DocumentUpload';
import PrivacySettings from './PrivacySettings';
import { ROUTES } from '@/utils/constants';
import apiService from '@/services/api';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface WizardStep {
  id: string;
  title: string;
  description: string;
  isComplete: boolean;
  isRequired: boolean;
}

interface ProfileData {
  profilePhotoUrl?: string;
  idDocumentUrl?: string;
  canBeFound?: boolean;
  fullName?: string;
  mobilePhone?: string;
  dateOfBirth?: string;
  gender?: string;
  nationality?: string;
  [key: string]: any;
}

interface ProfileWizardProps {
  onComplete?: () => void;
}

const ProfileWizard: React.FC<ProfileWizardProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const [currentStep, setCurrentStep] = useState(0);
  const [profileData, setProfileData] = useState<ProfileData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [steps, setSteps] = useState<WizardStep[]>([]);

  useEffect(() => {
    if (user) {
      const userSteps = getStepsForRole(user.role as any);
      setSteps(userSteps);
      
      // Initialize profile data from existing user profile
      const profile = user.profile as any;
      setProfileData({
        profilePhotoUrl: profile?.profilePhotoUrl,
        idDocumentUrl: profile?.idDocumentUrl,
        canBeFound: profile?.canBeFound ?? true,
        fullName: profile?.fullName,
        mobilePhone: profile?.mobilePhone,
        dateOfBirth: profile?.dateOfBirth,
        gender: profile?.gender,
        nationality: profile?.nationality || 'Mexican'
      });
    }
  }, [user]);

  const getStepsForRole = (role: string): WizardStep[] => {
    const commonSteps: WizardStep[] = [
      {
        id: 'basic-info',
        title: 'Basic Information',
        description: 'Complete your personal details',
        isComplete: !!((user?.profile as any)?.fullName && (user?.profile as any)?.mobilePhone),
        isRequired: true
      },
      {
        id: 'photo',
        title: 'Profile Photo',
        description: 'Upload and crop your profile photo',
        isComplete: !!(user?.profile as any)?.profilePhotoUrl,
        isRequired: true
      },
      {
        id: 'documents',
        title: 'Document Verification',
        description: 'Upload required identification documents',
        isComplete: !!(user?.profile as any)?.idDocumentUrl,
        isRequired: true
      }
    ];

    // Role-specific additional steps
    if (role === 'player') {
      commonSteps.push({
        id: 'privacy',
        title: 'Privacy Settings',
        description: 'Configure your visibility in player search',
        isComplete: (user?.profile as any)?.canBeFound !== undefined,
        isRequired: false
      });
    }

    return commonSteps;
  };

  const handleStepComplete = (stepData: any) => {
    const newProfileData = { ...profileData, ...stepData };
    setProfileData(newProfileData);
    
    // Mark current step as complete
    const newSteps = [...steps];
    newSteps[currentStep].isComplete = true;
    setSteps(newSteps);
    
    // Move to next step if not last
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await apiService.put('/profile', profileData);
      
      if ((response as any).success) {
        if (onComplete) {
          onComplete();
        } else {
          navigate(ROUTES.DASHBOARD);
        }
      } else {
        throw new Error((response as any).error || 'Profile update failed');
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const BasicInfoStep: React.FC<{ onComplete: (data: any) => void; data: ProfileData }> = ({ onComplete, data }) => {
    const [formData, setFormData] = useState({
      fullName: data.fullName || '',
      mobilePhone: data.mobilePhone || '',
      dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
      gender: data.gender || '',
      nationality: data.nationality || 'Mexican'
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNext = () => {
      if (formData.fullName && formData.mobilePhone) {
        onComplete(formData);
      } else {
        alert('Please fill in all required fields');
      }
    };

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mobile Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="mobilePhone"
            value={formData.mobilePhone}
            onChange={handleInputChange}
            placeholder="+52 55 1234 5678"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nationality
          </label>
          <input
            type="text"
            name="nationality"
            value={formData.nationality}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            className="btn-primary"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const PhotoStep: React.FC<{ onComplete: (data: any) => void; data: ProfileData }> = ({ onComplete, data }) => {
    const handlePhotoUpdate = (photoUrl: string) => {
      onComplete({ profilePhotoUrl: photoUrl });
    };

    return (
      <div className="space-y-4">
        <p className="text-gray-600">
          Upload a clear photo of yourself. This will be used for your digital credential and profile.
        </p>
        <PhotoUpload
          currentPhoto={data.profilePhotoUrl}
          onPhotoUpdate={handlePhotoUpdate}
        />
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="btn-secondary"
          >
            Previous
          </button>
          <button
            onClick={() => onComplete({})}
            className="btn-primary"
          >
            {data.profilePhotoUrl ? 'Next' : 'Skip for now'}
          </button>
        </div>
      </div>
    );
  };

  const DocumentStep: React.FC<{ onComplete: (data: any) => void; data: ProfileData }> = ({ onComplete, data }) => {
    const handleDocumentUpdate = (documentUrl: string) => {
      onComplete({ idDocumentUrl: documentUrl });
    };

    return (
      <div className="space-y-4">
        <p className="text-gray-600">
          Please upload a government-issued identification document (INE, passport, etc.) for verification.
        </p>
        <DocumentUpload
          label="Identification Document"
          accept=".pdf,.jpg,.jpeg,.png"
          maxSize={10}
          currentDocument={data.idDocumentUrl}
          onDocumentUpdate={handleDocumentUpdate}
          required
        />
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="btn-secondary"
          >
            Previous
          </button>
          <button
            onClick={() => onComplete({})}
            className="btn-primary"
          >
            {data.idDocumentUrl ? 'Next' : 'Skip for now'}
          </button>
        </div>
      </div>
    );
  };

  const PrivacyStep: React.FC<{ onComplete: (data: any) => void; data: ProfileData }> = ({ onComplete, data }) => {
    const handlePrivacyUpdate = (settings: any) => {
      onComplete(settings);
    };

    return (
      <div className="space-y-4">
        <PrivacySettings onUpdate={handlePrivacyUpdate} />
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="btn-secondary"
          >
            Previous
          </button>
          <button
            onClick={() => onComplete({})}
            className="btn-primary"
          >
            Complete
          </button>
        </div>
      </div>
    );
  };

  const renderStepComponent = () => {
    const step = steps[currentStep];
    if (!step) return null;

    const componentProps = {
      onComplete: handleStepComplete,
      data: profileData
    };

    switch (step.id) {
      case 'basic-info':
        return <BasicInfoStep {...componentProps} />;
      case 'photo':
        return <PhotoStep {...componentProps} />;
      case 'documents':
        return <DocumentStep {...componentProps} />;
      case 'privacy':
        return <PrivacyStep {...componentProps} />;
      default:
        return null;
    }
  };

  if (!user || steps.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
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
        {renderStepComponent()}
      </div>

      {/* Final Submit Button */}
      {currentStep === steps.length - 1 && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Complete Profile</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileWizard;