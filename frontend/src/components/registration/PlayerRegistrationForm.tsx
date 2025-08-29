import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchStates, fetchNrtpLevels, fetchGenderOptions, selectStates, selectNrtpLevels, selectGenderOptions, selectDataLoading } from '@/store/dataSlice';
import { registerPlayer, selectIsSubmitting, selectRegistrationError } from '@/store/registrationSlice';
import { PlayerRegistrationData } from '@/types/registration';
import FormField from '@/components/forms/FormField';
import SelectField from '@/components/forms/SelectField';
import FileField from '@/components/forms/FileField';
import CheckboxField from '@/components/forms/CheckboxField';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface PlayerRegistrationFormProps {
  onSuccess?: () => void;
  onBack?: () => void;
}

const PlayerRegistrationForm: React.FC<PlayerRegistrationFormProps> = ({
  onSuccess,
  onBack
}) => {
  const dispatch = useAppDispatch();
  
  // Redux state
  const states = useAppSelector(selectStates);
  const nrtpLevels = useAppSelector(selectNrtpLevels);
  const genderOptions = useAppSelector(selectGenderOptions);
  const loading = useAppSelector(selectDataLoading);
  const isSubmitting = useAppSelector(selectIsSubmitting);
  const registrationError = useAppSelector(selectRegistrationError);

  // Form data
  const [formData, setFormData] = useState<PlayerRegistrationData>({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    stateId: 0,
    curp: '',
    nrtpLevel: '',
    mobilePhone: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    privacyPolicyAccepted: false,
    profilePhoto: undefined,
    idDocument: undefined
  });

  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // Load data on component mount
  useEffect(() => {
    dispatch(fetchStates());
    dispatch(fetchNrtpLevels());
    dispatch(fetchGenderOptions());
  }, [dispatch]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.fullName.trim()) newErrors.fullName = 'El nombre completo es requerido';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'La fecha de nacimiento es requerida';
    if (!formData.gender) newErrors.gender = 'El género es requerido';
    if (!formData.stateId) newErrors.stateId = 'El estado es requerido';
    if (!formData.curp.trim()) newErrors.curp = 'La CURP es requerida';
    if (!formData.mobilePhone.trim()) newErrors.mobilePhone = 'El teléfono móvil es requerido';
    if (!formData.username.trim()) newErrors.username = 'El nombre de usuario es requerido';
    if (!formData.email.trim()) newErrors.email = 'El correo electrónico es requerido';
    if (!formData.password) newErrors.password = 'La contraseña es requerida';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'La confirmación de contraseña es requerida';
    if (!formData.privacyPolicyAccepted) newErrors.privacyPolicyAccepted = 'Debes aceptar la política de privacidad';

    // Format validations
    if (formData.curp && formData.curp.length !== 18) {
      newErrors.curp = 'La CURP debe tener exactamente 18 caracteres';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El formato del correo electrónico no es válido';
    }
    
    if (formData.mobilePhone && !/^(\+52)?[1-9]\d{9}$/.test(formData.mobilePhone.replace(/\s/g, ''))) {
      newErrors.mobilePhone = 'El formato del teléfono no es válido (10 dígitos)';
    }
    
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Age validation
    if (formData.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(formData.dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 13) {
        newErrors.dateOfBirth = 'Debes tener al menos 13 años para registrarte';
      } else if (age > 100) {
        newErrors.dateOfBirth = 'Por favor verifica tu fecha de nacimiento';
      }
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
      const result = await dispatch(registerPlayer(formData)).unwrap();
      
      if (result.success) {
        onSuccess?.();
      }
    } catch (error) {
      // Error is handled by the slice
    }
  };

  const updateField = (field: keyof PlayerRegistrationData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (loading.states || loading.nrtpLevels || loading.genderOptions) {
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
          Registro de Jugador
        </h2>
        <p className="text-lg text-gray-600">
          Completa la información para crear tu cuenta de jugador en la Federación Mexicana de Pickleball
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <div className="bg-white p-6 rounded-lg shadow-card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Información Personal
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              name="fullName"
              label="Nombre Completo"
              type="text"
              required
              value={formData.fullName}
              onChange={(value) => updateField('fullName', value)}
              error={errors.fullName}
              placeholder="Juan Pérez García"
            />
            
            <FormField
              name="dateOfBirth"
              label="Fecha de Nacimiento"
              type="date"
              required
              value={formData.dateOfBirth}
              onChange={(value) => updateField('dateOfBirth', value)}
              error={errors.dateOfBirth}
            />
            
            <SelectField
              name="gender"
              label="Género"
              required
              value={formData.gender}
              onChange={(value) => updateField('gender', value)}
              options={genderOptions}
              error={errors.gender}
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
              name="curp"
              label="CURP"
              type="text"
              required
              value={formData.curp}
              onChange={(value) => updateField('curp', value.toUpperCase())}
              error={errors.curp}
              placeholder="ABCD123456HEFGHI01"
              className="md:col-span-2"
            />
            
            <SelectField
              name="nrtpLevel"
              label="Nivel NRTP (Opcional)"
              value={formData.nrtpLevel}
              onChange={(value) => updateField('nrtpLevel', value)}
              options={nrtpLevels}
              error={errors.nrtpLevel}
            />
            
            <FormField
              name="mobilePhone"
              label="Teléfono Móvil"
              type="tel"
              required
              value={formData.mobilePhone}
              onChange={(value) => updateField('mobilePhone', value)}
              error={errors.mobilePhone}
              placeholder="5512345678"
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
              placeholder="jugador123"
            />
            
            <FormField
              name="email"
              label="Correo Electrónico"
              type="email"
              required
              value={formData.email}
              onChange={(value) => updateField('email', value)}
              error={errors.email}
              placeholder="correo@ejemplo.com"
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

        {/* File Uploads */}
        <div className="bg-white p-6 rounded-lg shadow-card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Documentos (Opcional)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileField
              name="profilePhoto"
              label="Foto de Perfil"
              accept="image/jpeg,image/png"
              maxSize={5 * 1024 * 1024}
              onChange={(file) => updateField('profilePhoto', file)}
              description="Formato JPG o PNG, máximo 5MB"
            />
            
            <FileField
              name="idDocument"
              label="Documento de Identidad"
              accept="image/jpeg,image/png,application/pdf"
              maxSize={10 * 1024 * 1024}
              onChange={(file) => updateField('idDocument', file)}
              description="INE o Pasaporte - JPG, PNG o PDF, máximo 10MB"
            />
          </div>
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
              'Crear Cuenta de Jugador'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlayerRegistrationForm;