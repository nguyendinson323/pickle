import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { createCourt, updateCourt, Court } from '../../store/slices/courtSlice';
import { Button } from '../ui/Button';
import { FormField } from '../forms/FormField';
import { SelectField } from '../forms/SelectField';
import { CheckboxField } from '../forms/CheckboxField';
import { Modal } from '../ui/Modal';

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
    surfaceType: 'concrete' as const,
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
      0: { isOpen: true, startTime: '08:00', endTime: '20:00' }, // Sunday
      1: { isOpen: true, startTime: '06:00', endTime: '22:00' }, // Monday
      2: { isOpen: true, startTime: '06:00', endTime: '22:00' }, // Tuesday
      3: { isOpen: true, startTime: '06:00', endTime: '22:00' }, // Wednesday
      4: { isOpen: true, startTime: '06:00', endTime: '22:00' }, // Thursday
      5: { isOpen: true, startTime: '06:00', endTime: '22:00' }, // Friday
      6: { isOpen: true, startTime: '07:00', endTime: '21:00' }  // Saturday
    },
    maxAdvanceBookingDays: '30',
    minBookingDuration: '60',
    maxBookingDuration: '180',
    cancellationPolicy: 'Cancelación gratuita hasta 24 horas antes. 50% de reembolso entre 2-24 horas antes.'
  });

  const [imageUrl, setImageUrl] = useState('');

  const surfaceOptions = [
    { value: 'concrete', label: 'Concreto' },
    { value: 'asphalt', label: 'Asfalto' },
    { value: 'acrylic', label: 'Acrílico' },
    { value: 'composite', label: 'Compuesto' }
  ];

  const amenityOptions = [
    { value: 'lighting', label: 'Iluminación' },
    { value: 'seating', label: 'Asientos' },
    { value: 'parking', label: 'Estacionamiento' },
    { value: 'restrooms', label: 'Sanitarios' },
    { value: 'water_fountain', label: 'Bebedero' },
    { value: 'equipment_rental', label: 'Renta de Equipo' },
    { value: 'cafeteria', label: 'Cafetería' },
    { value: 'pro_shop', label: 'Tienda Pro' },
    { value: 'coaching_area', label: 'Área de Entrenamiento' },
    { value: 'professional_lighting', label: 'Iluminación Profesional' },
    { value: 'vip_seating', label: 'Asientos VIP' },
    { value: 'valet_parking', label: 'Valet Parking' },
    { value: 'premium_restrooms', label: 'Sanitarios Premium' }
  ];

  const stateOptions = states.map(state => ({
    value: state.id.toString(),
    label: state.name
  }));

  const dayNames = [
    'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
  ];

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
        operatingHours: court.operatingHours,
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
        },
        maxAdvanceBookingDays: '30',
        minBookingDuration: '60',
        maxBookingDuration: '180',
        cancellationPolicy: 'Cancelación gratuita hasta 24 horas antes. 50% de reembolso entre 2-24 horas antes.'
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

  const handleOperatingHoursChange = (day: number, field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: {
          ...prev.operatingHours[day],
          [field]: value
        }
      }
    }));
  };

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl.trim()]
      }));
      setImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
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
      title={court ? 'Editar Cancha' : 'Registrar Nueva Cancha'}
      size="2xl"
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
          <h3 className="text-lg font-medium text-gray-900">Información Básica</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Nombre de la Cancha *"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
            
            <SelectField
              label="Estado *"
              value={formData.stateId}
              options={stateOptions}
              onChange={(value) => handleInputChange('stateId', value)}
              required
            />
          </div>

          <FormField
            label="Descripción"
            type="textarea"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
          />

          <FormField
            label="Dirección *"
            type="text"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SelectField
              label="Tipo de Superficie *"
              value={formData.surfaceType}
              options={surfaceOptions}
              onChange={(value) => handleInputChange('surfaceType', value)}
              required
            />

            <FormField
              label="Latitud"
              type="number"
              value={formData.latitude.toString()}
              onChange={(e) => handleInputChange('latitude', parseFloat(e.target.value) || 0)}
              step="any"
            />

            <FormField
              label="Longitud"
              type="number"
              value={formData.longitude.toString()}
              onChange={(e) => handleInputChange('longitude', parseFloat(e.target.value) || 0)}
              step="any"
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Precios</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="Precio por Hora (MXN) *"
              type="number"
              value={formData.hourlyRate}
              onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
              min="0"
              step="0.01"
              required
            />

            <FormField
              label="Precio en Hora Pico (MXN)"
              type="number"
              value={formData.peakHourRate}
              onChange={(e) => handleInputChange('peakHourRate', e.target.value)}
              min="0"
              step="0.01"
              placeholder="Opcional"
            />

            <FormField
              label="Precio Fin de Semana (MXN)"
              type="number"
              value={formData.weekendRate}
              onChange={(e) => handleInputChange('weekendRate', e.target.value)}
              min="0"
              step="0.01"
              placeholder="Opcional"
            />
          </div>
        </div>

        {/* Amenities */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Servicios Disponibles</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {amenityOptions.map((amenity) => (
              <CheckboxField
                key={amenity.value}
                label={amenity.label}
                checked={formData.amenities.includes(amenity.value)}
                onChange={(checked) => handleAmenityChange(amenity.value, checked)}
              />
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Imágenes</h3>
          
          <div className="flex gap-2">
            <FormField
              label=""
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="URL de la imagen"
              className="flex-1"
            />
            <Button type="button" onClick={handleAddImage} disabled={!imageUrl.trim()}>
              Agregar
            </Button>
          </div>

          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Imagen ${index + 1}`}
                    className="w-full h-24 object-cover rounded border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-court.jpg';
                    }}
                  />
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    className="absolute top-1 right-1"
                    onClick={() => handleRemoveImage(index)}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Operating Hours */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Horarios de Operación</h3>
          
          <div className="space-y-3">
            {dayNames.map((dayName, dayIndex) => (
              <div key={dayIndex} className="flex items-center gap-4">
                <div className="w-20">
                  <CheckboxField
                    label={dayName}
                    checked={formData.operatingHours[dayIndex].isOpen}
                    onChange={(checked) => handleOperatingHoursChange(dayIndex, 'isOpen', checked)}
                  />
                </div>
                
                {formData.operatingHours[dayIndex].isOpen && (
                  <>
                    <FormField
                      label=""
                      type="time"
                      value={formData.operatingHours[dayIndex].startTime}
                      onChange={(e) => handleOperatingHoursChange(dayIndex, 'startTime', e.target.value)}
                      className="w-32"
                    />
                    <span className="text-gray-500">a</span>
                    <FormField
                      label=""
                      type="time"
                      value={formData.operatingHours[dayIndex].endTime}
                      onChange={(e) => handleOperatingHoursChange(dayIndex, 'endTime', e.target.value)}
                      className="w-32"
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Booking Policies */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Políticas de Reserva</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="Días máximos de anticipación"
              type="number"
              value={formData.maxAdvanceBookingDays}
              onChange={(e) => handleInputChange('maxAdvanceBookingDays', e.target.value)}
              min="1"
              required
            />

            <FormField
              label="Duración mínima (minutos)"
              type="number"
              value={formData.minBookingDuration}
              onChange={(e) => handleInputChange('minBookingDuration', e.target.value)}
              min="30"
              step="30"
              required
            />

            <FormField
              label="Duración máxima (minutos)"
              type="number"
              value={formData.maxBookingDuration}
              onChange={(e) => handleInputChange('maxBookingDuration', e.target.value)}
              min="30"
              step="30"
              required
            />
          </div>

          <FormField
            label="Política de Cancelación"
            type="textarea"
            value={formData.cancellationPolicy}
            onChange={(e) => handleInputChange('cancellationPolicy', e.target.value)}
            rows={3}
          />
        </div>

        {/* Form Actions */}
        <div className="flex gap-3">
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Guardando...' : court ? 'Actualizar Cancha' : 'Registrar Cancha'}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Modal>
  );
};