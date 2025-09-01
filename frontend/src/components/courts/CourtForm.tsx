import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { createCourt, updateCourt, Court } from '../../store/courtSlice';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

interface CourtFormProps {
  isOpen: boolean;
  onClose: () => void;
  court?: Court | null;
  onSuccess?: () => void;
}

export const CourtForm: React.FC<CourtFormProps> = ({ 
  isOpen, 
  onClose, 
  court, 
  onSuccess 
}) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.courts);
  const { states } = useAppSelector(state => state.data);
  const { user } = useAppSelector(state => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    surfaceType: 'concrete' as 'concrete' | 'asphalt' | 'acrylic' | 'composite',
    address: '',
    latitude: 0,
    longitude: 0,
    stateId: '',
    amenities: [] as string[],
    hourlyRate: '',
    peakHourRate: '',
    weekendRate: '',
    images: [] as string[],
    operatingHours: {
      0: { isOpen: true, startTime: '08:00', endTime: '20:00' },
      1: { isOpen: true, startTime: '06:00', endTime: '22:00' },
      2: { isOpen: true, startTime: '06:00', endTime: '22:00' },
      3: { isOpen: true, startTime: '06:00', endTime: '22:00' },
      4: { isOpen: true, startTime: '06:00', endTime: '22:00' },
      5: { isOpen: true, startTime: '06:00', endTime: '22:00' },
      6: { isOpen: true, startTime: '07:00', endTime: '21:00' }
    } as { [key: number]: { isOpen: boolean; startTime: string; endTime: string } },
    maxAdvanceBookingDays: '30',
    minBookingDuration: '60',
    maxBookingDuration: '180',
    cancellationPolicy: 'Free cancellation up to 24 hours before. 50% refund between 2-24 hours before.'
  });

  const surfaceOptions = [
    { value: 'concrete', label: 'Concrete' },
    { value: 'asphalt', label: 'Asphalt' },
    { value: 'acrylic', label: 'Acrylic' },
    { value: 'composite', label: 'Composite' }
  ];

  const amenityOptions = [
    { value: 'lighting', label: 'Lighting' },
    { value: 'seating', label: 'Seating' },
    { value: 'parking', label: 'Parking' },
    { value: 'restrooms', label: 'Restrooms' },
    { value: 'water_fountain', label: 'Water Fountain' },
    { value: 'equipment_rental', label: 'Equipment Rental' },
    { value: 'cafeteria', label: 'Cafeteria' },
    { value: 'pro_shop', label: 'Pro Shop' },
    { value: 'coaching_area', label: 'Coaching Area' },
    { value: 'professional_lighting', label: 'Professional Lighting' },
    { value: 'vip_seating', label: 'VIP Seating' },
    { value: 'valet_parking', label: 'Valet Parking' },
    { value: 'premium_restrooms', label: 'Premium Restrooms' }
  ];

  const stateOptions = states.map(state => ({
    value: state.id.toString(),
    label: state.name
  }));

  useEffect(() => {
    if (court && isOpen) {
      setFormData({
        name: court.name,
        description: court.description,
        surfaceType: court.surfaceType,
        address: court.address,
        latitude: court.latitude,
        longitude: court.longitude,
        stateId: court.stateId.toString(),
        amenities: court.amenities || [],
        hourlyRate: court.hourlyRate.toString(),
        peakHourRate: court.peakHourRate?.toString() || '',
        weekendRate: court.weekendRate?.toString() || '',
        images: court.images || [],
        operatingHours: court.operatingHours as { [key: number]: { isOpen: boolean; startTime: string; endTime: string } },
        maxAdvanceBookingDays: court.maxAdvanceBookingDays.toString(),
        minBookingDuration: court.minBookingDuration.toString(),
        maxBookingDuration: court.maxBookingDuration.toString(),
        cancellationPolicy: court.cancellationPolicy
      });
    } else if (isOpen && !court) {
      // Reset form for new court
      setFormData({
        name: '',
        description: '',
        surfaceType: 'concrete',
        address: '',
        latitude: 0,
        longitude: 0,
        stateId: '',
        amenities: [],
        hourlyRate: '',
        peakHourRate: '',
        weekendRate: '',
        images: [],
        operatingHours: {
          0: { isOpen: true, startTime: '08:00', endTime: '20:00' },
          1: { isOpen: true, startTime: '06:00', endTime: '22:00' },
          2: { isOpen: true, startTime: '06:00', endTime: '22:00' },
          3: { isOpen: true, startTime: '06:00', endTime: '22:00' },
          4: { isOpen: true, startTime: '06:00', endTime: '22:00' },
          5: { isOpen: true, startTime: '06:00', endTime: '22:00' },
          6: { isOpen: true, startTime: '07:00', endTime: '21:00' }
        } as { [key: number]: { isOpen: boolean; startTime: string; endTime: string } },
        maxAdvanceBookingDays: '30',
        minBookingDuration: '60',
        maxBookingDuration: '180',
        cancellationPolicy: 'Free cancellation up to 24 hours before. 50% refund between 2-24 hours before.'
      });
    }
  }, [court, isOpen]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      amenities: checked
        ? [...prev.amenities, amenity]
        : prev.amenities.filter(a => a !== amenity)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const courtData: any = {
      ...formData,
      stateId: parseInt(formData.stateId),
      hourlyRate: parseFloat(formData.hourlyRate),
      peakHourRate: formData.peakHourRate ? parseFloat(formData.peakHourRate) : undefined,
      weekendRate: formData.weekendRate ? parseFloat(formData.weekendRate) : undefined,
      maxAdvanceBookingDays: parseInt(formData.maxAdvanceBookingDays),
      minBookingDuration: parseInt(formData.minBookingDuration),
      maxBookingDuration: parseInt(formData.maxBookingDuration),
      ownerType: user?.role === 'club' ? 'club' : 'partner',
      ownerId: user?.id
    };

    try {
      if (court) {
        await dispatch(updateCourt({ id: court.id, ...courtData })).unwrap();
      } else {
        await dispatch(createCourt(courtData)).unwrap();
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      // Error is handled by Redux
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={court ? 'Edit Court' : 'Register New Court'}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Court Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State *
              </label>
              <select
                value={formData.stateId}
                onChange={(e) => handleInputChange('stateId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select state</option>
                {stateOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address *
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Surface Type *
              </label>
              <select
                value={formData.surfaceType}
                onChange={(e) => handleInputChange('surfaceType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {surfaceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                value={formData.latitude.toString()}
                onChange={(e) => handleInputChange('latitude', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={formData.longitude.toString()}
                onChange={(e) => handleInputChange('longitude', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Pricing</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hourly Rate (MXN) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.hourlyRate}
                onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Peak Hour Rate (MXN)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.peakHourRate}
                onChange={(e) => handleInputChange('peakHourRate', e.target.value)}
                placeholder="Optional"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weekend Rate (MXN)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.weekendRate}
                onChange={(e) => handleInputChange('weekendRate', e.target.value)}
                placeholder="Optional"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Available Services</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {amenityOptions.map((amenity) => (
              <label key={amenity.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.amenities.includes(amenity.value)}
                  onChange={(e) => handleAmenityChange(amenity.value, e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">{amenity.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-3">
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Saving...' : court ? 'Update Court' : 'Register Court'}
          </Button>
          
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};