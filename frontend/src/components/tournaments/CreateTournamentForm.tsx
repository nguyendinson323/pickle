import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/store';
import { selectUser } from '@/store/authSlice';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import FormField from '@/components/forms/FormField';
import SelectField from '@/components/forms/SelectField';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import {
  CalendarIcon,
  MapPinIcon,
  TrophyIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface TournamentCategory {
  id: string;
  name: string;
  description: string;
  playFormat: 'singles' | 'doubles' | 'mixed_doubles';
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'open';
  genderRequirement: 'men' | 'women' | 'mixed' | 'open';
  minAge?: number;
  maxAge?: number;
  maxParticipants: number;
  entryFee: number;
  prizeDistribution: {
    first: number;
    second: number;
    third: number;
  };
}

interface CreateTournamentForm {
  // Basic Information
  name: string;
  description: string;
  tournamentType: 'championship' | 'league' | 'open' | 'friendly';
  level: 'national' | 'state' | 'municipal' | 'local';
  
  // Dates and Registration
  startDate: string;
  endDate: string;
  registrationStart: string;
  registrationEnd: string;
  
  // Location
  venueName: string;
  venueAddress: string;
  venueCity: string;
  venueState: string;
  
  // Tournament Settings
  maxParticipants: number;
  entryFee: number;
  prizePool: number;
  requiresRanking: boolean;
  minRankingPoints?: number;
  maxRankingPoints?: number;
  allowLateRegistration: boolean;
  enableWaitingList: boolean;
  
  // Categories
  categories: TournamentCategory[];
  
  // Additional Information
  rules: string;
  requirements: string;
  contactEmail: string;
  contactPhone: string;
  websiteUrl?: string;
  specialInstructions?: string;
  weatherContingency?: string;
  transportationInfo?: string;
  accommodationInfo?: string;
}

const CreateTournamentForm: React.FC = () => {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  const [formData, setFormData] = useState<CreateTournamentForm>({
    name: '',
    description: '',
    tournamentType: 'open',
    level: 'local',
    startDate: '',
    endDate: '',
    registrationStart: '',
    registrationEnd: '',
    venueName: '',
    venueAddress: '',
    venueCity: '',
    venueState: '',
    maxParticipants: 64,
    entryFee: 0,
    prizePool: 0,
    requiresRanking: false,
    minRankingPoints: undefined,
    maxRankingPoints: undefined,
    allowLateRegistration: false,
    enableWaitingList: true,
    categories: [],
    rules: 'Standard pickleball tournament rules apply.',
    requirements: '',
    contactEmail: user?.email || '',
    contactPhone: '',
    websiteUrl: '',
    specialInstructions: '',
    weatherContingency: '',
    transportationInfo: '',
    accommodationInfo: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const mexicanStates = [
    'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche',
    'Chiapas', 'Chihuahua', 'Ciudad de México', 'Coahuila', 'Colima',
    'Durango', 'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco',
    'México', 'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León',
    'Oaxaca', 'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí',
    'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala',
    'Veracruz', 'Yucatán', 'Zacatecas'
  ];

  const handleInputChange = (field: keyof CreateTournamentForm, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addCategory = () => {
    const newCategory: TournamentCategory = {
      id: Date.now().toString(),
      name: '',
      description: '',
      playFormat: 'singles',
      skillLevel: 'intermediate',
      genderRequirement: 'open',
      minAge: undefined,
      maxAge: undefined,
      maxParticipants: 32,
      entryFee: formData.entryFee,
      prizeDistribution: {
        first: 50,
        second: 30,
        third: 20
      }
    };
    
    setFormData(prev => ({
      ...prev,
      categories: [...prev.categories, newCategory]
    }));
  };

  const updateCategory = (index: number, field: keyof TournamentCategory, value: any) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.map((cat, i) =>
        i === index ? { ...cat, [field]: value } : cat
      )
    }));
  };

  const removeCategory = (index: number) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index)
    }));
  };

  const validateCurrentStep = () => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 1:
        if (!formData.name.trim()) newErrors.name = 'Tournament name is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Contact email is required';
        break;

      case 2:
        if (!formData.startDate) newErrors.startDate = 'Start date is required';
        if (!formData.endDate) newErrors.endDate = 'End date is required';
        if (!formData.registrationStart) newErrors.registrationStart = 'Registration start date is required';
        if (!formData.registrationEnd) newErrors.registrationEnd = 'Registration end date is required';

        if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
          newErrors.endDate = 'End date must be after start date';
        }
        if (formData.registrationStart && formData.registrationEnd && formData.registrationStart > formData.registrationEnd) {
          newErrors.registrationEnd = 'Registration end date must be after start date';
        }
        break;

      case 3:
        if (!formData.venueName.trim()) newErrors.venueName = 'Venue name is required';
        if (!formData.venueAddress.trim()) newErrors.venueAddress = 'Venue address is required';
        if (!formData.venueCity.trim()) newErrors.venueCity = 'City is required';
        if (!formData.venueState.trim()) newErrors.venueState = 'State is required';
        break;

      case 4:
        if (formData.maxParticipants < 4) newErrors.maxParticipants = 'Must allow at least 4 participants';
        if (formData.entryFee < 0) newErrors.entryFee = 'Entry fee cannot be negative';
        if (formData.prizePool < 0) newErrors.prizePool = 'Prize pool cannot be negative';
        break;

      case 5:
        if (formData.categories.length === 0) {
          newErrors.categories = 'At least one category is required';
        }
        formData.categories.forEach((cat, index) => {
          if (!cat.name.trim()) {
            newErrors[`category_${index}_name`] = 'Category name is required';
          }
          if (cat.maxParticipants < 2) {
            newErrors[`category_${index}_maxParticipants`] = 'Must allow at least 2 participants';
          }
        });
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(totalSteps, prev + 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    setLoading(true);
    try {
      const tournamentData = {
        ...formData,
        organizerId: user?.id,
        organizerType: user?.role,
        status: 'draft',
        currentParticipants: 0,
        images: [],
        sponsorLogos: []
      };

      // Mock API call - replace with actual API
      console.log('Creating tournament:', tournamentData);
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Success - redirect to tournament management
      navigate('/tournaments/manage');
    } catch (error) {
      console.error('Error creating tournament:', error);
      setErrors({ submit: 'Failed to create tournament. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step < currentStep 
              ? 'bg-green-500 text-white'
              : step === currentStep
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-600'
          }`}>
            {step < currentStep ? <CheckCircleIcon className="w-5 h-5" /> : step}
          </div>
          {step < totalSteps && (
            <div className={`w-12 h-1 ${step < currentStep ? 'bg-green-500' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card className="p-6">
            <div className="flex items-center mb-6">
              <DocumentTextIcon className="w-6 h-6 text-blue-500 mr-3" />
              <h2 className="text-xl font-semibold">Basic Information</h2>
            </div>
            
            <div className="space-y-4">
              <FormField
                name="name"
                label="Tournament Name"
                type="text"
                value={formData.name}
                onChange={(value) => handleInputChange('name', value)}
                error={errors.name}
                placeholder="e.g., Mexico National Championship 2024"
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe your tournament, including format, prizes, and what makes it special..."
                />
                {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField
                  name="tournamentType"
                  label="Tournament Type"
                  value={formData.tournamentType}
                  onChange={(value) => handleInputChange('tournamentType', value)}
                  options={[
                    { value: 'championship', label: 'Championship' },
                    { value: 'league', label: 'League' },
                    { value: 'open', label: 'Open Tournament' },
                    { value: 'friendly', label: 'Friendly Match' }
                  ]}
                />

                <SelectField
                  name="level"
                  label="Tournament Level"
                  value={formData.level}
                  onChange={(value) => handleInputChange('level', value)}
                  options={[
                    { value: 'national', label: 'National' },
                    { value: 'state', label: 'State' },
                    { value: 'municipal', label: 'Municipal' },
                    { value: 'local', label: 'Local' }
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  name="contactEmail"
                  label="Contact Email"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(value) => handleInputChange('contactEmail', value)}
                  error={errors.contactEmail}
                  required
                />

                <FormField
                  name="contactPhone"
                  label="Contact Phone"
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(value) => handleInputChange('contactPhone', value)}
                  placeholder="e.g., +52 555 123 4567"
                />
              </div>
            </div>
          </Card>
        );

      case 2:
        return (
          <Card className="p-6">
            <div className="flex items-center mb-6">
              <CalendarIcon className="w-6 h-6 text-blue-500 mr-3" />
              <h2 className="text-xl font-semibold">Dates & Registration</h2>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  name="startDate"
                  label="Tournament Start Date"
                  type="date"
                  value={formData.startDate}
                  onChange={(value) => handleInputChange('startDate', value)}
                  error={errors.startDate}
                  required
                />

                <FormField
                  name="endDate"
                  label="Tournament End Date"
                  type="date"
                  value={formData.endDate}
                  onChange={(value) => handleInputChange('endDate', value)}
                  error={errors.endDate}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  name="registrationStart"
                  label="Registration Opens"
                  type="date"
                  value={formData.registrationStart}
                  onChange={(value) => handleInputChange('registrationStart', value)}
                  error={errors.registrationStart}
                  required
                />

                <FormField
                  name="registrationEnd"
                  label="Registration Deadline"
                  type="date"
                  value={formData.registrationEnd}
                  onChange={(value) => handleInputChange('registrationEnd', value)}
                  error={errors.registrationEnd}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allowLateRegistration"
                    checked={formData.allowLateRegistration}
                    onChange={(e) => handleInputChange('allowLateRegistration', e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="allowLateRegistration" className="ml-2 text-sm text-gray-700">
                    Allow late registration
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableWaitingList"
                    checked={formData.enableWaitingList}
                    onChange={(e) => handleInputChange('enableWaitingList', e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="enableWaitingList" className="ml-2 text-sm text-gray-700">
                    Enable waiting list when full
                  </label>
                </div>
              </div>
            </div>
          </Card>
        );

      case 3:
        return (
          <Card className="p-6">
            <div className="flex items-center mb-6">
              <MapPinIcon className="w-6 h-6 text-blue-500 mr-3" />
              <h2 className="text-xl font-semibold">Venue Information</h2>
            </div>
            
            <div className="space-y-4">
              <FormField
                name="venueName"
                label="Venue Name"
                type="text"
                value={formData.venueName}
                onChange={(value) => handleInputChange('venueName', value)}
                error={errors.venueName}
                placeholder="e.g., Centro Deportivo Nacional"
                required
              />

              <FormField
                name="venueAddress"
                label="Venue Address"
                type="text"
                value={formData.venueAddress}
                onChange={(value) => handleInputChange('venueAddress', value)}
                error={errors.venueAddress}
                placeholder="Full street address"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  name="venueCity"
                  label="City"
                  type="text"
                  value={formData.venueCity}
                  onChange={(value) => handleInputChange('venueCity', value)}
                  error={errors.venueCity}
                  required
                />

                <SelectField
                  name="venueState"
                  label="State"
                  value={formData.venueState}
                  onChange={(value) => handleInputChange('venueState', value)}
                  options={mexicanStates.map(state => ({ value: state, label: state }))}
                  error={errors.venueState}
                />
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Additional Information (Optional)</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Transportation Info</label>
                  <textarea
                    value={formData.transportationInfo}
                    onChange={(e) => handleInputChange('transportationInfo', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Parking information, public transport directions, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Accommodation Info</label>
                  <textarea
                    value={formData.accommodationInfo}
                    onChange={(e) => handleInputChange('accommodationInfo', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nearby hotels, camping options, etc."
                  />
                </div>
              </div>
            </div>
          </Card>
        );

      case 4:
        return (
          <Card className="p-6">
            <div className="flex items-center mb-6">
              <CurrencyDollarIcon className="w-6 h-6 text-blue-500 mr-3" />
              <h2 className="text-xl font-semibold">Tournament Settings</h2>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  name="maxParticipants"
                  label="Max Participants"
                  type="number"
                  value={formData.maxParticipants.toString()}
                  onChange={(value) => handleInputChange('maxParticipants', parseInt(value) || 0)}
                  error={errors.maxParticipants}
                  required
                />

                <FormField
                  name="entryFee"
                  label="Entry Fee (MXN)"
                  type="number"
                  value={formData.entryFee.toString()}
                  onChange={(value) => handleInputChange('entryFee', parseFloat(value) || 0)}
                  error={errors.entryFee}
                  placeholder="0 for free tournament"
                />

                <FormField
                  name="prizePool"
                  label="Prize Pool (MXN)"
                  type="number"
                  value={formData.prizePool.toString()}
                  onChange={(value) => handleInputChange('prizePool', parseFloat(value) || 0)}
                  error={errors.prizePool}
                />
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="requiresRanking"
                    checked={formData.requiresRanking}
                    onChange={(e) => handleInputChange('requiresRanking', e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="requiresRanking" className="ml-2 font-medium text-gray-700">
                    Require ranking points for eligibility
                  </label>
                </div>

                {formData.requiresRanking && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                    <FormField
                      name="minRankingPoints"
                      label="Minimum Ranking Points"
                      type="number"
                      value={formData.minRankingPoints?.toString() || ''}
                      onChange={(value) => handleInputChange('minRankingPoints', value ? parseInt(value) : undefined)}
                    />

                    <FormField
                      name="maxRankingPoints"
                      label="Maximum Ranking Points"
                      type="number"
                      value={formData.maxRankingPoints?.toString() || ''}
                      onChange={(value) => handleInputChange('maxRankingPoints', value ? parseInt(value) : undefined)}
                    />
                  </div>
                )}
              </div>
            </div>
          </Card>
        );

      case 5:
        return (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <UserGroupIcon className="w-6 h-6 text-blue-500 mr-3" />
                <h2 className="text-xl font-semibold">Tournament Categories</h2>
              </div>
              <Button onClick={addCategory} variant="secondary" size="sm">
                Add Category
              </Button>
            </div>

            {errors.categories && (
              <div className="mb-4 text-red-600 text-sm">{errors.categories}</div>
            )}
            
            <div className="space-y-6">
              {formData.categories.map((category, index) => (
                <Card key={category.id} className="p-4 border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-medium text-gray-900">Category {index + 1}</h3>
                    <Button
                      onClick={() => removeCategory(index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      Remove
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        name={`category_${index}_name`}
                        label="Category Name"
                        type="text"
                        value={category.name}
                        onChange={(value) => updateCategory(index, 'name', value)}
                        error={errors[`category_${index}_name`]}
                        placeholder="e.g., Men's Singles Advanced"
                        required
                      />

                      <FormField
                        name={`category_${index}_maxParticipants`}
                        label="Max Participants"
                        type="number"
                        value={category.maxParticipants.toString()}
                        onChange={(value) => updateCategory(index, 'maxParticipants', parseInt(value) || 0)}
                        error={errors[`category_${index}_maxParticipants`]}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <SelectField
                        name={`category_${index}_playFormat`}
                        label="Play Format"
                        value={category.playFormat}
                        onChange={(value) => updateCategory(index, 'playFormat', value)}
                        options={[
                          { value: 'singles', label: 'Singles' },
                          { value: 'doubles', label: 'Doubles' },
                          { value: 'mixed_doubles', label: 'Mixed Doubles' }
                        ]}
                      />

                      <SelectField
                        name={`category_${index}_skillLevel`}
                        label="Skill Level"
                        value={category.skillLevel}
                        onChange={(value) => updateCategory(index, 'skillLevel', value)}
                        options={[
                          { value: 'beginner', label: 'Beginner' },
                          { value: 'intermediate', label: 'Intermediate' },
                          { value: 'advanced', label: 'Advanced' },
                          { value: 'open', label: 'Open' }
                        ]}
                      />

                      <SelectField
                        name={`category_${index}_genderRequirement`}
                        label="Gender Requirement"
                        value={category.genderRequirement}
                        onChange={(value) => updateCategory(index, 'genderRequirement', value)}
                        options={[
                          { value: 'open', label: 'Open' },
                          { value: 'men', label: 'Men Only' },
                          { value: 'women', label: 'Women Only' },
                          { value: 'mixed', label: 'Mixed' }
                        ]}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        name={`category_${index}_minAge`}
                        label="Min Age (Optional)"
                        type="number"
                        value={category.minAge?.toString() || ''}
                        onChange={(value) => updateCategory(index, 'minAge', value ? parseInt(value) : undefined)}
                      />

                      <FormField
                        name={`category_${index}_maxAge`}
                        label="Max Age (Optional)"
                        type="number"
                        value={category.maxAge?.toString() || ''}
                        onChange={(value) => updateCategory(index, 'maxAge', value ? parseInt(value) : undefined)}
                      />

                      <FormField
                        name={`category_${index}_entryFee`}
                        label="Entry Fee (MXN)"
                        type="number"
                        value={category.entryFee.toString()}
                        onChange={(value) => updateCategory(index, 'entryFee', parseFloat(value) || 0)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={category.description}
                        onChange={(e) => updateCategory(index, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Category description and special rules..."
                      />
                    </div>
                  </div>
                </Card>
              ))}

              {formData.categories.length === 0 && (
                <Card className="p-8 text-center text-gray-500">
                  <TrophyIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium mb-2">No categories yet</p>
                  <p className="mb-4">Add at least one category to organize your tournament</p>
                  <Button onClick={addCategory} variant="primary">
                    Add First Category
                  </Button>
                </Card>
              )}
            </div>
          </Card>
        );

      case 6:
        return (
          <Card className="p-6">
            <div className="flex items-center mb-6">
              <DocumentTextIcon className="w-6 h-6 text-blue-500 mr-3" />
              <h2 className="text-xl font-semibold">Rules & Additional Information</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tournament Rules</label>
                <textarea
                  value={formData.rules}
                  onChange={(e) => handleInputChange('rules', e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Detailed tournament rules and regulations..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Requirements & Equipment</label>
                <textarea
                  value={formData.requirements}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Equipment requirements, player eligibility, etc."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website URL (Optional)</label>
                  <FormField
                    name="websiteUrl"
                    label=""
                    type="url"
                    value={formData.websiteUrl || ''}
                    onChange={(value) => handleInputChange('websiteUrl', value)}
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weather Contingency</label>
                  <textarea
                    value={formData.weatherContingency}
                    onChange={(e) => handleInputChange('weatherContingency', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="What happens in case of bad weather?"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
                <textarea
                  value={formData.specialInstructions}
                  onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any special instructions for participants..."
                />
              </div>

              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600">{errors.submit}</p>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Review Your Tournament</h3>
                <p className="text-blue-800 text-sm">
                  Please review all information carefully. Once created, some details may require administrator approval to change.
                </p>
              </div>
            </div>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Tournament</h1>
        <p className="text-gray-600">Set up a new pickleball tournament with categories, registration, and prize distribution.</p>
      </div>

      {renderStepIndicator()}
      
      {renderStepContent()}

      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          Previous
        </Button>

        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => navigate('/tournaments')}
          >
            Cancel
          </Button>

          {currentStep < totalSteps ? (
            <Button
              variant="primary"
              onClick={nextStep}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <LoadingSpinner size="sm" />
                  <span>Creating Tournament...</span>
                </div>
              ) : (
                'Create Tournament'
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateTournamentForm;