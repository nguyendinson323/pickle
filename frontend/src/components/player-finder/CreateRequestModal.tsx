import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import FormField from '@/components/forms/FormField';
import SelectField from '@/components/forms/SelectField';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import {
  ClockIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface Location {
  id: number;
  locationName?: string;
  city: string;
  state: string;
  address?: string;
  isCurrentLocation: boolean;
  searchRadius: number;
  privacyLevel: 'exact' | 'city' | 'state';
}

interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
  flexible: boolean;
}

interface CreateRequestModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const NRTP_LEVELS = [
  '1.0', '1.5', '2.0', '2.5', '3.0', '3.5', '4.0', '4.5', '5.0', '5.5', '6.0'
];

const CreateRequestModal: React.FC<CreateRequestModalProps> = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [formData, setFormData] = useState({
    locationId: '',
    nrtpLevelMin: '',
    nrtpLevelMax: '',
    preferredGender: 'any',
    preferredAgeMin: '',
    preferredAgeMax: '',
    searchRadius: '25',
    message: '',
    expiresInHours: '168' // 7 days
  });
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      // Mock locations data since API is temporarily disabled
      const mockLocations: Location[] = [
        {
          id: 1,
          locationName: 'Home',
          city: 'Mexico City',
          state: 'CDMX',
          address: 'Polanco, Mexico City',
          isCurrentLocation: true,
          searchRadius: 25,
          privacyLevel: 'city'
        },
        {
          id: 2,
          locationName: 'Work',
          city: 'Mexico City',
          state: 'CDMX',
          address: 'Santa Fe, Mexico City',
          isCurrentLocation: false,
          searchRadius: 20,
          privacyLevel: 'city'
        }
      ];
      
      setLocations(mockLocations);
      
      // Auto-select current location if available
      const currentLocation = mockLocations.find(loc => loc.isCurrentLocation);
      if (currentLocation) {
        setFormData(prev => ({ 
          ...prev, 
          locationId: currentLocation.id.toString(),
          searchRadius: currentLocation.searchRadius.toString()
        }));
      }
    } catch (error) {
      console.error('Failed to fetch locations:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addTimeSlot = () => {
    setTimeSlots(prev => [...prev, {
      day: 'Monday',
      startTime: '09:00',
      endTime: '11:00',
      flexible: false
    }]);
  };

  const updateTimeSlot = (index: number, field: keyof TimeSlot, value: any) => {
    setTimeSlots(prev => prev.map((slot, i) => 
      i === index ? { ...slot, [field]: value } : slot
    ));
  };

  const removeTimeSlot = (index: number) => {
    setTimeSlots(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.locationId) {
      newErrors.locationId = 'Location is required';
    }

    if (timeSlots.length === 0) {
      newErrors.timeSlots = 'At least one time slot is required';
    }

    // Validate time slots
    timeSlots.forEach((slot, index) => {
      if (slot.startTime >= slot.endTime) {
        newErrors[`timeSlot_${index}`] = 'Start time must be before end time';
      }
    });

    if (formData.preferredAgeMin && formData.preferredAgeMax) {
      const min = parseInt(formData.preferredAgeMin);
      const max = parseInt(formData.preferredAgeMax);
      if (min >= max) {
        newErrors.preferredAgeMin = 'Minimum age must be less than maximum age';
      }
    }

    if (formData.nrtpLevelMin && formData.nrtpLevelMax) {
      const minIndex = NRTP_LEVELS.indexOf(formData.nrtpLevelMin);
      const maxIndex = NRTP_LEVELS.indexOf(formData.nrtpLevelMax);
      if (minIndex > maxIndex) {
        newErrors.nrtpLevelMin = 'Minimum level must be less than or equal to maximum level';
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

    setLoading(true);
    try {
      const requestData = {
        locationId: parseInt(formData.locationId),
        nrtpLevelMin: formData.nrtpLevelMin || undefined,
        nrtpLevelMax: formData.nrtpLevelMax || undefined,
        preferredGender: formData.preferredGender !== 'any' ? formData.preferredGender : undefined,
        preferredAgeMin: formData.preferredAgeMin ? parseInt(formData.preferredAgeMin) : undefined,
        preferredAgeMax: formData.preferredAgeMax ? parseInt(formData.preferredAgeMax) : undefined,
        searchRadius: parseInt(formData.searchRadius),
        availableTimeSlots: timeSlots,
        message: formData.message || undefined,
        expiresInHours: parseInt(formData.expiresInHours),
      };

      // Mock successful request creation since API is temporarily disabled
      console.log('Would create request with data:', requestData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onSuccess();
    } catch (error: any) {
      console.error('Failed to create request:', error);
      if (error.response?.data?.errors) {
        const apiErrors: Record<string, string> = {};
        error.response.data.errors.forEach((err: any) => {
          apiErrors[err.param] = err.msg;
        });
        setErrors(apiErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      isOpen={true} 
      onClose={onClose} 
      title="Create Player Finder Request"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Location Selection */}
        <div>
          <SelectField
            name="locationId"
            label="Playing Location"
            value={formData.locationId}
            onChange={(value) => {
              handleInputChange('locationId', value);
              const selectedLocation = locations.find(loc => loc.id.toString() === value);
              if (selectedLocation) {
                handleInputChange('searchRadius', selectedLocation.searchRadius.toString());
              }
            }}
            options={locations.map(location => ({
              value: location.id.toString(),
              label: location.locationName || `${location.city}, ${location.state}`
            }))}
            error={errors.locationId}
            required
          />
          
          {locations.length === 0 && (
            <p className="text-sm text-yellow-600 mt-2">
              You need to add a location first. Go to the Locations tab to add one.
            </p>
          )}
        </div>

        {/* Search Radius */}
        <FormField
          name="searchRadius"
          label="Search Radius (km)"
          type="number"
          value={formData.searchRadius}
          onChange={(value) => handleInputChange('searchRadius', value)}
          placeholder="25"
          required
        />

        {/* NRTP Level Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            name="nrtpLevelMin"
            label="Minimum NRTP Level"
            value={formData.nrtpLevelMin}
            onChange={(value) => handleInputChange('nrtpLevelMin', value)}
            options={[
              { value: '', label: 'No minimum' },
              ...NRTP_LEVELS.map(level => ({ value: level, label: level }))
            ]}
            error={errors.nrtpLevelMin}
          />
          
          <SelectField
            name="nrtpLevelMax"
            label="Maximum NRTP Level"
            value={formData.nrtpLevelMax}
            onChange={(value) => handleInputChange('nrtpLevelMax', value)}
            options={[
              { value: '', label: 'No maximum' },
              ...NRTP_LEVELS.map(level => ({ value: level, label: level }))
            ]}
            error={errors.nrtpLevelMax}
          />
        </div>

        {/* Gender Preference */}
        <SelectField
          name="preferredGender"
          label="Gender Preference"
          value={formData.preferredGender}
          onChange={(value) => handleInputChange('preferredGender', value)}
          options={[
            { value: 'any', label: 'Any' },
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' }
          ]}
        />

        {/* Age Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            name="preferredAgeMin"
            label="Minimum Age"
            type="number"
            value={formData.preferredAgeMin}
            onChange={(value) => handleInputChange('preferredAgeMin', value)}
            placeholder="No minimum"
            error={errors.preferredAgeMin}
          />
          
          <FormField
            name="preferredAgeMax"
            label="Maximum Age"
            type="number"
            value={formData.preferredAgeMax}
            onChange={(value) => handleInputChange('preferredAgeMax', value)}
            placeholder="No maximum"
            error={errors.preferredAgeMax}
          />
        </div>

        {/* Available Time Slots */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Available Time Slots <span className="text-red-500">*</span>
            </label>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={addTimeSlot}
              className="flex items-center space-x-1"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Add Slot</span>
            </Button>
          </div>
          
          {errors.timeSlots && (
            <p className="text-sm text-red-600 mb-3">{errors.timeSlots}</p>
          )}
          
          <div className="space-y-3">
            {timeSlots.map((slot, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 grid grid-cols-4 gap-3">
                  <select
                    value={slot.day}
                    onChange={(e) => updateTimeSlot(index, 'day', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                  >
                    {DAYS_OF_WEEK.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                  
                  <input
                    type="time"
                    value={slot.startTime}
                    onChange={(e) => updateTimeSlot(index, 'startTime', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                  />
                  
                  <input
                    type="time"
                    value={slot.endTime}
                    onChange={(e) => updateTimeSlot(index, 'endTime', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                  />
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={slot.flexible}
                      onChange={(e) => updateTimeSlot(index, 'flexible', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                    />
                    <span className="text-sm text-gray-600">Flexible</span>
                  </div>
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeTimeSlot(index)}
                  className="flex-shrink-0 p-2"
                >
                  <XMarkIcon className="h-4 w-4" />
                </Button>
              </div>
              
              {errors[`timeSlot_${index}`] && (
                <p className="text-sm text-red-600 px-3">{errors[`timeSlot_${index}`]}</p>
              )}
            </div>
            ))}
          </div>
          
          {timeSlots.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <ClockIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>No time slots added yet</p>
              <p className="text-sm">Click "Add Slot" to specify your availability</p>
            </div>
          )}
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Optional Message
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            rows={3}
            maxLength={500}
            placeholder="Tell potential partners a bit about yourself or what you're looking for..."
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.message.length}/500 characters
          </p>
        </div>

        {/* Expiration */}
        <SelectField
          name="expiresInHours"
          label="Request Duration"
          value={formData.expiresInHours}
          onChange={(value) => handleInputChange('expiresInHours', value)}
          options={[
            { value: '24', label: '1 Day' },
            { value: '72', label: '3 Days' },
            { value: '168', label: '1 Week' },
            { value: '336', label: '2 Weeks' },
            { value: '720', label: '30 Days' }
          ]}
        />

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading || locations.length === 0}>
            {loading ? (
              <div className="flex items-center space-x-2">
                <LoadingSpinner size="sm" />
                <span>Creating Request...</span>
              </div>
            ) : (
              'Create Request'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateRequestModal;