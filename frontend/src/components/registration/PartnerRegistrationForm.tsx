import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { registerPartner, selectIsSubmitting, selectRegistrationError } from '@/store/registrationSlice';
import { PartnerRegistrationData } from '@/types/registration';
import FormField from '@/components/forms/FormField';
import SelectField from '@/components/forms/SelectField';
import FileField from '@/components/forms/FileField';
import CheckboxField from '@/components/forms/CheckboxField';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface PartnerRegistrationFormProps {
  onSuccess?: () => void;
  onBack?: () => void;
}

const PartnerRegistrationForm: React.FC<PartnerRegistrationFormProps> = ({
  onSuccess,
  onBack
}) => {
  const dispatch = useAppDispatch();
  
  // Redux state
  const isSubmitting = useAppSelector(selectIsSubmitting);
  const registrationError = useAppSelector(selectRegistrationError);

  // Form data
  const [formData, setFormData] = useState<PartnerRegistrationData>({
    businessName: '',
    rfc: '',
    contactPersonName: '',
    contactPersonTitle: '',
    phone: '',
    partnerType: '',
    website: '',
    socialMedia: {},
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    privacyPolicyAccepted: false,
    logo: undefined
  });

  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [, setShowPrivacyModal] = useState(false);

  // Partner type options
  const partnerTypeOptions = [
    { value: 'hotel', label: 'Hotel' },
    { value: 'resort', label: 'Resort' },
    { value: 'camp', label: 'Camp/Campground' },
    { value: 'company', label: 'Company' },
    { value: 'court_owner', label: 'Court Owner' }
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
    if (!formData.contactPersonName.trim()) newErrors.contactPersonName = 'Contact person name is required';
    if (!formData.contactPersonTitle.trim()) newErrors.contactPersonTitle = 'Contact person title is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.partnerType) newErrors.partnerType = 'Partner type is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Password confirmation is required';
    if (!formData.privacyPolicyAccepted) newErrors.privacyPolicyAccepted = 'You must accept the privacy policy';

    // Format validations
    if (formData.rfc && formData.rfc.length !== 12) {
      newErrors.rfc = 'Company RFC must be 12 characters';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email format is not valid';
    }
    
    if (formData.phone && !/^(\+52)?[1-9]\d{9}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Phone format is not valid (10 digits)';
    }
    
    if (formData.website && formData.website.trim() && !/^https?:\/\/.+\..+/.test(formData.website)) {
      newErrors.website = 'Website format is not valid';
    }
    
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const result = await dispatch(registerPartner(formData)).unwrap();
      
      if (result.success) {
        onSuccess?.();
      }
    } catch (error) {
      // Error is handled by the slice
    }
  };

  const updateField = (field: keyof PartnerRegistrationData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const updateSocialMedia = (platform: string, url: string) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: url
      }
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Business Partner Registration
        </h2>
        <p className="text-lg text-gray-600">
          Complete the information to register your company as a partner of the Mexican Pickleball Federation
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Business Information */}
        <div className="bg-white p-6 rounded-lg shadow-card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0h2a2 2 0 012 2v6.5M8 6H6a2 2 0 00-2 2v6.5M12 10v4m-2-2h4" />
            </svg>
            Business Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              name="businessName"
              label="Business Name"
              type="text"
              required
              value={formData.businessName}
              onChange={(value) => updateField('businessName', value)}
              error={errors.businessName}
              placeholder="Hotel Paradise, Resort Maya, etc."
            />
            
            <FormField
              name="rfc"
              label="RFC (Optional)"
              type="text"
              value={formData.rfc || ''}
              onChange={(value) => updateField('rfc', value.toUpperCase())}
              error={errors.rfc}
              placeholder="ABC123456DE1"
            />
            
            <SelectField
              name="partnerType"
              label="Partner Type"
              required
              value={formData.partnerType}
              onChange={(value) => updateField('partnerType', value)}
              options={partnerTypeOptions}
              error={errors.partnerType}
            />
            
            <FormField
              name="website"
              label="Website (Optional)"
              type="url"
              value={formData.website || ''}
              onChange={(value) => updateField('website', value)}
              error={errors.website}
              placeholder="https://www.mybusiness.com"
            />
          </div>
        </div>

        {/* Contact Person Information */}
        <div className="bg-white p-6 rounded-lg shadow-card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Contact Person
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              name="contactPersonName"
              label="Contact Person Name"
              type="text"
              required
              value={formData.contactPersonName}
              onChange={(value) => updateField('contactPersonName', value)}
              error={errors.contactPersonName}
              placeholder="Maria González Rodriguez"
            />
            
            <FormField
              name="contactPersonTitle"
              label="Title/Position"
              type="text"
              required
              value={formData.contactPersonTitle}
              onChange={(value) => updateField('contactPersonTitle', value)}
              error={errors.contactPersonTitle}
              placeholder="Marketing Manager, Director, etc."
            />
            
            <FormField
              name="phone"
              label="Phone"
              type="tel"
              required
              value={formData.phone}
              onChange={(value) => updateField('phone', value)}
              error={errors.phone}
              placeholder="5512345678"
            />
          </div>
        </div>

        {/* Social Media (Optional) */}
        <div className="bg-white p-6 rounded-lg shadow-card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Social Media (Optional)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              name="facebook"
              label="Facebook"
              type="url"
              value={formData.socialMedia?.facebook || ''}
              onChange={(value) => updateSocialMedia('facebook', value)}
              placeholder="https://facebook.com/mybusiness"
            />
            
            <FormField
              name="instagram"
              label="Instagram"
              type="url"
              value={formData.socialMedia?.instagram || ''}
              onChange={(value) => updateSocialMedia('instagram', value)}
              placeholder="https://instagram.com/mybusiness"
            />
            
            <FormField
              name="twitter"
              label="Twitter/X"
              type="url"
              value={formData.socialMedia?.twitter || ''}
              onChange={(value) => updateSocialMedia('twitter', value)}
              placeholder="https://twitter.com/mybusiness"
            />
            
            <FormField
              name="linkedin"
              label="LinkedIn"
              type="url"
              value={formData.socialMedia?.linkedin || ''}
              onChange={(value) => updateSocialMedia('linkedin', value)}
              placeholder="https://linkedin.com/company/mybusiness"
            />
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white p-6 rounded-lg shadow-card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            Account Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              name="username"
              label="Username"
              type="text"
              required
              value={formData.username}
              onChange={(value) => updateField('username', value)}
              error={errors.username}
              placeholder="hotelparadise"
            />
            
            <FormField
              name="email"
              label="Email"
              type="email"
              required
              value={formData.email}
              onChange={(value) => updateField('email', value)}
              error={errors.email}
              placeholder="admin@mybusiness.com"
            />
            
            <FormField
              name="password"
              label="Password"
              type="password"
              required
              value={formData.password}
              onChange={(value) => updateField('password', value)}
              error={errors.password}
              placeholder="Minimum 8 characters"
            />
            
            <FormField
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(value) => updateField('confirmPassword', value)}
              error={errors.confirmPassword}
              placeholder="Repeat password"
            />
          </div>
        </div>

        {/* Logo Upload */}
        <div className="bg-white p-6 rounded-lg shadow-card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Logo/Image (Optional)
          </h3>
          
          <FileField
            name="logo"
            label="Company Logo"
            accept="image/jpeg,image/png"
            maxSize={5 * 1024 * 1024}
            onChange={(file) => updateField('logo', file)}
            description="JPG or PNG format, maximum 5MB"
          />
        </div>

        {/* Privacy Policy */}
        <div className="bg-white p-6 rounded-lg shadow-card">
          <CheckboxField
            name="privacyPolicyAccepted"
            label={
              <span>
                I have read and accept the{' '}
                <button
                  type="button"
                  onClick={() => setShowPrivacyModal(true)}
                  className="text-primary-600 hover:text-primary-700 underline"
                >
                  Privacy Policy
                </button>
              </span>
            }
            checked={formData.privacyPolicyAccepted}
            onChange={(checked) => updateField('privacyPolicyAccepted', checked)}
            required
            error={errors.privacyPolicyAccepted}
          />
        </div>

        {/* Error Display */}
        {registrationError && (
          <div className="bg-error-50 border border-error-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-error-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-error-700">{registrationError}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6">
          <button
            type="button"
            onClick={onBack}
            className="btn-secondary px-6 py-2"
          >
            Back
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary px-8 py-2 flex items-center"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Registering...
              </>
            ) : (
              'Register Partner'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PartnerRegistrationForm;