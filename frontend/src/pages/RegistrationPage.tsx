import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setSelectedRole, selectSelectedRole } from '@/store/registrationSlice';
import { UserRole } from '@/types/registration';
import RoleSelector from '@/components/registration/RoleSelector';
import PlayerRegistrationForm from '@/components/registration/PlayerRegistrationForm';
import CoachRegistrationForm from '@/components/registration/CoachRegistrationForm';
import ClubRegistrationForm from '@/components/registration/ClubRegistrationForm';
import PartnerRegistrationForm from '@/components/registration/PartnerRegistrationForm';
import StateCommitteeRegistrationForm from '@/components/registration/StateCommitteeRegistrationForm';
import { useNavigate } from 'react-router-dom';

const RegistrationPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const selectedRole = useAppSelector(selectSelectedRole);
  
  const [step, setStep] = useState<'role-select' | 'form'>('role-select');

  useEffect(() => {
    // Listen for continue registration event from RoleSelector
    const handleContinue = () => {
      setStep('form');
    };

    window.addEventListener('continueRegistration', handleContinue as EventListener);
    
    return () => {
      window.removeEventListener('continueRegistration', handleContinue as EventListener);
    };
  }, []);

  const handleRoleSelect = (role: UserRole) => {
    dispatch(setSelectedRole(role));
  };

  const handleContinueToForm = () => {
    if (selectedRole) {
      setStep('form');
    }
  };

  const handleBackToRoleSelect = () => {
    setStep('role-select');
  };

  const handleRegistrationSuccess = () => {
    // Navigate to success page or dashboard
    navigate('/registration/success');
  };

  const renderRegistrationForm = () => {
    if (!selectedRole) return null;

    const formProps = {
      onSuccess: handleRegistrationSuccess,
      onBack: handleBackToRoleSelect
    };

    switch (selectedRole) {
      case 'player':
        return <PlayerRegistrationForm {...formProps} />;
      case 'coach':
        return <CoachRegistrationForm {...formProps} />;
      case 'club':
        return <ClubRegistrationForm {...formProps} />;
      case 'partner':
        return <PartnerRegistrationForm {...formProps} />;
      case 'state':
        return <StateCommitteeRegistrationForm {...formProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Progress Indicator */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4">
              {/* Step 1 - Role Selection */}
              <div className={`flex items-center ${
                step === 'role-select' ? 'text-primary-600' : 'text-gray-400'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  step === 'form' 
                    ? 'bg-primary-600 border-primary-600 text-white' 
                    : step === 'role-select'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {step === 'form' ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    '1'
                  )}
                </div>
                <span className="ml-2 text-sm font-medium">Select Type</span>
              </div>
              
              {/* Connector */}
              <div className={`w-12 h-0.5 ${
                step === 'form' ? 'bg-primary-600' : 'bg-gray-300'
              }`}></div>
              
              {/* Step 2 - Form */}
              <div className={`flex items-center ${
                step === 'form' ? 'text-primary-600' : 'text-gray-400'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  step === 'form'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-gray-300 text-gray-400'
                }`}>
                  2
                </div>
                <span className="ml-2 text-sm font-medium">Complete Registration</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {step === 'role-select' ? (
          <div>
            <RoleSelector
              selectedRole={selectedRole}
              onRoleSelect={handleRoleSelect}
            />
            
            {/* Continue Button */}
            {selectedRole && (
              <div className="text-center mt-8">
                <button
                  onClick={handleContinueToForm}
                  className="btn-primary px-8 py-3 text-lg"
                >
                  Continue with Registration
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            {renderRegistrationForm()}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationPage;