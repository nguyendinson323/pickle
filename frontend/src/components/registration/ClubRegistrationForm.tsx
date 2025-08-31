import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchStates, selectStates, selectDataLoading } from '@/store/dataSlice';
import { registerClub, selectIsSubmitting, selectRegistrationError } from '@/store/registrationSlice';
import { ClubRegistrationData } from '@/types/registration';
import FormField from '@/components/forms/FormField';
import SelectField from '@/components/forms/SelectField';
import FileField from '@/components/forms/FileField';
import CheckboxField from '@/components/forms/CheckboxField';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface ClubRegistrationFormProps {
  onSuccess?: () => void;
  onBack?: () => void;
}

const ClubRegistrationForm: React.FC<ClubRegistrationFormProps> = ({
  onSuccess,
  onBack
}) => {
  const dispatch = useAppDispatch();
  
  // Redux state
  const states = useAppSelector(selectStates);
  const loading = useAppSelector(selectDataLoading);
  const isSubmitting = useAppSelector(selectIsSubmitting);
  const registrationError = useAppSelector(selectRegistrationError);

  // Form data
  const [formData, setFormData] = useState<ClubRegistrationData>({
    name: '',
    rfc: '',
    managerName: '',
    managerRole: '',
    contactEmail: '',
    phone: '',
    stateId: 0,
    clubType: '',
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

  // Club type options
  const clubTypeOptions = [
    { value: 'competitive', label: 'Competitivo' },
    { value: 'recreational', label: 'Recreativo' },
    { value: 'mixed', label: 'Mixto' }
  ];

  // Load data on component mount
  useEffect(() => {
    dispatch(fetchStates());
  }, [dispatch]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.name.trim()) newErrors.name = 'El nombre del club es requerido';
    if (!formData.managerName.trim()) newErrors.managerName = 'El nombre del gerente es requerido';
    if (!formData.managerRole.trim()) newErrors.managerRole = 'El cargo del gerente es requerido';
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'El correo de contacto es requerido';
    if (!formData.phone.trim()) newErrors.phone = 'El teléfono es requerido';
    if (!formData.stateId) newErrors.stateId = 'El estado es requerido';
    if (!formData.clubType) newErrors.clubType = 'El tipo de club es requerido';
    if (!formData.username.trim()) newErrors.username = 'El nombre de usuario es requerido';
    if (!formData.email.trim()) newErrors.email = 'El correo electrónico es requerido';
    if (!formData.password) newErrors.password = 'La contraseña es requerida';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'La confirmación de contraseña es requerida';
    if (!formData.privacyPolicyAccepted) newErrors.privacyPolicyAccepted = 'Debes aceptar la política de privacidad';

    // Format validations
    if (formData.rfc && formData.rfc.length !== 12 && formData.rfc.length !== 13) {
      newErrors.rfc = 'El RFC debe tener 12 o 13 caracteres';
    }
    
    if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'El formato del correo de contacto no es válido';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El formato del correo electrónico no es válido';
    }
    
    if (formData.phone && !/^(\+52)?[1-9]\d{9}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'El formato del teléfono no es válido (10 dígitos)';
    }
    
    if (formData.website && formData.website.trim() && !/^https?:\/\/.+\..+/.test(formData.website)) {
      newErrors.website = 'El formato del sitio web no es válido';
    }
    
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
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
      const result = await dispatch(registerClub(formData)).unwrap();
      
      if (result.success) {
        onSuccess?.();
      }
    } catch (error) {
      // Error is handled by the slice
    }
  };

  const updateField = (field: keyof ClubRegistrationData, value: any) => {
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

  if (loading.states) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-lg text-gray-600">Cargando formulario...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Registro de Club
        </h2>
        <p className="text-lg text-gray-600">
          Completa la información para registrar tu club en la Federación Mexicana de Pickleball
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Club Information */}
        <div className="bg-white p-6 rounded-lg shadow-card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Información del Club
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              name="name"
              label="Nombre del Club"
              type="text"
              required
              value={formData.name}
              onChange={(value) => updateField('name', value)}
              error={errors.name}
              placeholder="Club de Pickleball México"
            />
            
            <FormField
              name="rfc"
              label="RFC (Opcional)"
              type="text"
              value={formData.rfc || ''}
              onChange={(value) => updateField('rfc', value.toUpperCase())}
              error={errors.rfc}
              placeholder="ABC123456DEF"
            />
            
            <SelectField
              name="clubType"
              label="Tipo de Club"
              required
              value={formData.clubType}
              onChange={(value) => updateField('clubType', value)}
              options={clubTypeOptions}
              error={errors.clubType}
            />
            
            <SelectField
              name="stateId"
              label="Estado"
              required
              value={formData.stateId}
              onChange={(value) => updateField('stateId', parseInt(value))}
              options={states.map(state => ({ value: state.id, label: state.name }))}
              error={errors.stateId}
            />
            
            <FormField
              name="website"
              label="Sitio Web (Opcional)"
              type="url"
              value={formData.website || ''}
              onChange={(value) => updateField('website', value)}
              error={errors.website}
              placeholder="https://www.miclub.com"
              className="md:col-span-2"
            />
          </div>
        </div>

        {/* Manager Information */}
        <div className="bg-white p-6 rounded-lg shadow-card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Información del Gerente/Representante
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              name="managerName"
              label="Nombre del Gerente"
              type="text"
              required
              value={formData.managerName}
              onChange={(value) => updateField('managerName', value)}
              error={errors.managerName}
              placeholder="Juan Pérez García"
            />
            
            <FormField
              name="managerRole"
              label="Cargo"
              type="text"
              required
              value={formData.managerRole}
              onChange={(value) => updateField('managerRole', value)}
              error={errors.managerRole}
              placeholder="Gerente General, Presidente, etc."
            />
            
            <FormField
              name="contactEmail"
              label="Correo de Contacto"
              type="email"
              required
              value={formData.contactEmail}
              onChange={(value) => updateField('contactEmail', value)}
              error={errors.contactEmail}
              placeholder="contacto@miclub.com"
            />
            
            <FormField
              name="phone"
              label="Teléfono"
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
            Redes Sociales (Opcional)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              name="facebook"
              label="Facebook"
              type="url"
              value={formData.socialMedia?.facebook || ''}
              onChange={(value) => updateSocialMedia('facebook', value)}
              placeholder="https://facebook.com/miclub"
            />
            
            <FormField
              name="instagram"
              label="Instagram"
              type="url"
              value={formData.socialMedia?.instagram || ''}
              onChange={(value) => updateSocialMedia('instagram', value)}
              placeholder="https://instagram.com/miclub"
            />
            
            <FormField
              name="twitter"
              label="Twitter/X"
              type="url"
              value={formData.socialMedia?.twitter || ''}
              onChange={(value) => updateSocialMedia('twitter', value)}
              placeholder="https://twitter.com/miclub"
            />
            
            <FormField
              name="youtube"
              label="YouTube"
              type="url"
              value={formData.socialMedia?.youtube || ''}
              onChange={(value) => updateSocialMedia('youtube', value)}
              placeholder="https://youtube.com/@miclub"
            />
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white p-6 rounded-lg shadow-card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            Información de Cuenta
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              name="username"
              label="Nombre de Usuario"
              type="text"
              required
              value={formData.username}
              onChange={(value) => updateField('username', value)}
              error={errors.username}
              placeholder="clubpickleball"
            />
            
            <FormField
              name="email"
              label="Correo Electrónico"
              type="email"
              required
              value={formData.email}
              onChange={(value) => updateField('email', value)}
              error={errors.email}
              placeholder="admin@miclub.com"
            />
            
            <FormField
              name="password"
              label="Contraseña"
              type="password"
              required
              value={formData.password}
              onChange={(value) => updateField('password', value)}
              error={errors.password}
              placeholder="Mínimo 8 caracteres"
            />
            
            <FormField
              name="confirmPassword"
              label="Confirmar Contraseña"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(value) => updateField('confirmPassword', value)}
              error={errors.confirmPassword}
              placeholder="Repite la contraseña"
            />
          </div>
        </div>

        {/* Logo Upload */}
        <div className="bg-white p-6 rounded-lg shadow-card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Logo del Club (Opcional)
          </h3>
          
          <FileField
            name="logo"
            label="Logo del Club"
            accept="image/jpeg,image/png"
            maxSize={5 * 1024 * 1024}
            onChange={(file) => updateField('logo', file)}
            description="Formato JPG o PNG, máximo 5MB"
          />
        </div>

        {/* Privacy Policy */}
        <div className="bg-white p-6 rounded-lg shadow-card">
          <CheckboxField
            name="privacyPolicyAccepted"
            label={
              <span>
                He leído y acepto la{' '}
                <button
                  type="button"
                  onClick={() => setShowPrivacyModal(true)}
                  className="text-primary-600 hover:text-primary-700 underline"
                >
                  Política de Privacidad
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
            Volver
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary px-8 py-2 flex items-center"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Registrando...
              </>
            ) : (
              'Registrar Club'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClubRegistrationForm;