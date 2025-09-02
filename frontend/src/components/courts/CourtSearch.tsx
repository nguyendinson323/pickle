import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateSearchFilters, fetchFacilities, resetSearchFilters } from '../../store/courtSlice';
import Button from '../ui/Button';

export const CourtSearch: React.FC = () => {
  const dispatch = useAppDispatch();
  const { searchFilters } = useAppSelector(state => state.courts);
  const { states } = useAppSelector(state => state.data);

  const [localFilters, setLocalFilters] = useState({
    city: searchFilters.city || '',
    state: searchFilters.state || '',
    facilityType: searchFilters.facilityType || '',
    courtSurface: searchFilters.courtSurface || [],
    amenities: searchFilters.amenities || [],
    minPrice: searchFilters.minPrice?.toString() || '',
    maxPrice: searchFilters.maxPrice?.toString() || '',
    rating: searchFilters.rating?.toString() || '',
    hasLights: searchFilters.hasLights || false,
    accessibility: searchFilters.accessibility || false,
    latitude: searchFilters.latitude?.toString() || '',
    longitude: searchFilters.longitude?.toString() || '',
    radius: searchFilters.radius?.toString() || '25'
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const facilityTypeOptions = [
    { value: '', label: 'Any type' },
    { value: 'indoor', label: 'Indoor' },
    { value: 'outdoor', label: 'Outdoor' },
    { value: 'mixed', label: 'Mixed' }
  ];

  const courtSurfaceOptions = [
    { value: 'concrete', label: 'Concrete' },
    { value: 'asphalt', label: 'Asphalt' },
    { value: 'acrylic', label: 'Acrylic' },
    { value: 'composite', label: 'Composite' },
    { value: 'outdoor_court', label: 'Outdoor Court' },
    { value: 'indoor_court', label: 'Indoor Court' }
  ];

  const ratingOptions = [
    { value: '', label: 'Any rating' },
    { value: '4', label: '4+ stars' },
    { value: '3', label: '3+ stars' },
    { value: '2', label: '2+ stars' },
    { value: '1', label: '1+ stars' }
  ];

  const amenityOptions = [
    { value: 'parking', label: 'Parking' },
    { value: 'restrooms', label: 'Restrooms' },
    { value: 'pro_shop', label: 'Pro Shop' },
    { value: 'equipment_rental', label: 'Equipment Rental' },
    { value: 'cafeteria', label: 'Cafeteria' },
    { value: 'showers', label: 'Showers' },
    { value: 'lockers', label: 'Lockers' },
    { value: 'wifi', label: 'WiFi' },
    { value: 'air_conditioning', label: 'Air Conditioning' },
    { value: 'spectator_seating', label: 'Spectator Seating' },
    { value: 'coaching_services', label: 'Coaching Services' },
    { value: 'tournaments', label: 'Tournament Hosting' }
  ];

  const stateOptions = [
    { value: '', label: 'Any state' },
    { value: 'Aguascalientes', label: 'Aguascalientes' },
    { value: 'Baja California', label: 'Baja California' },
    { value: 'Baja California Sur', label: 'Baja California Sur' },
    { value: 'Campeche', label: 'Campeche' },
    { value: 'Chiapas', label: 'Chiapas' },
    { value: 'Chihuahua', label: 'Chihuahua' },
    { value: 'Ciudad de México', label: 'Ciudad de México' },
    { value: 'Coahuila', label: 'Coahuila' },
    { value: 'Colima', label: 'Colima' },
    { value: 'Durango', label: 'Durango' },
    { value: 'Guanajuato', label: 'Guanajuato' },
    { value: 'Guerrero', label: 'Guerrero' },
    { value: 'Hidalgo', label: 'Hidalgo' },
    { value: 'Jalisco', label: 'Jalisco' },
    { value: 'México', label: 'México' },
    { value: 'Michoacán', label: 'Michoacán' },
    { value: 'Morelos', label: 'Morelos' },
    { value: 'Nayarit', label: 'Nayarit' },
    { value: 'Nuevo León', label: 'Nuevo León' },
    { value: 'Oaxaca', label: 'Oaxaca' },
    { value: 'Puebla', label: 'Puebla' },
    { value: 'Querétaro', label: 'Querétaro' },
    { value: 'Quintana Roo', label: 'Quintana Roo' },
    { value: 'San Luis Potosí', label: 'San Luis Potosí' },
    { value: 'Sinaloa', label: 'Sinaloa' },
    { value: 'Sonora', label: 'Sonora' },
    { value: 'Tabasco', label: 'Tabasco' },
    { value: 'Tamaulipas', label: 'Tamaulipas' },
    { value: 'Tlaxcala', label: 'Tlaxcala' },
    { value: 'Veracruz', label: 'Veracruz' },
    { value: 'Yucatán', label: 'Yucatán' },
    { value: 'Zacatecas', label: 'Zacatecas' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setLocalFilters(prev => ({
      ...prev,
      amenities: checked
        ? [...prev.amenities, amenity]
        : prev.amenities.filter(a => a !== amenity)
    }));
  };

  const handleCourtSurfaceChange = (surface: string, checked: boolean) => {
    setLocalFilters(prev => ({
      ...prev,
      courtSurface: checked
        ? [...prev.courtSurface, surface]
        : prev.courtSurface.filter(s => s !== surface)
    }));
  };

  const handleLocationSearch = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocalFilters(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please enter manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleSearch = () => {
    const filters: any = { ...localFilters, page: 1, limit: 10 };
    
    // Convert string values to appropriate types
    if (filters.minPrice) {
      filters.minPrice = parseFloat(filters.minPrice);
    } else {
      delete filters.minPrice;
    }
    
    if (filters.maxPrice) {
      filters.maxPrice = parseFloat(filters.maxPrice);
    } else {
      delete filters.maxPrice;
    }

    if (filters.rating) {
      filters.rating = parseFloat(filters.rating);
    } else {
      delete filters.rating;
    }

    if (filters.latitude && filters.longitude) {
      filters.latitude = parseFloat(filters.latitude);
      filters.longitude = parseFloat(filters.longitude);
      if (filters.radius) {
        filters.radius = parseFloat(filters.radius);
      }
    } else {
      delete filters.latitude;
      delete filters.longitude;
      delete filters.radius;
    }

    // Clean up empty values and arrays
    Object.keys(filters).forEach(key => {
      if (filters[key] === '' || filters[key] === null || filters[key] === undefined ||
          (Array.isArray(filters[key]) && filters[key].length === 0)) {
        delete filters[key];
      }
    });

    dispatch(updateSearchFilters(filters));
    dispatch(fetchFacilities(filters));
  };

  const handleReset = () => {
    setLocalFilters({
      city: '',
      state: '',
      facilityType: '',
      courtSurface: [],
      amenities: [],
      minPrice: '',
      maxPrice: '',
      rating: '',
      hasLights: false,
      accessibility: false,
      latitude: '',
      longitude: '',
      radius: '25'
    });
    dispatch(resetSearchFilters());
    dispatch(fetchFacilities({ page: 1, limit: 10 }));
  };

  // Auto-search on location changes
  useEffect(() => {
    if (localFilters.latitude && localFilters.longitude) {
      const timer = setTimeout(() => {
        handleSearch();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [localFilters.latitude, localFilters.longitude]);

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Search Courts
        </h2>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? 'Hide filters' : 'More filters'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            type="text"
            value={localFilters.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            placeholder="Enter city name..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State
          </label>
          <select
            value={localFilters.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {stateOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Facility Type
          </label>
          <select
            value={localFilters.facilityType}
            onChange={(e) => handleInputChange('facilityType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {facilityTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Minimum Rating
          </label>
          <select
            value={localFilters.rating}
            onChange={(e) => handleInputChange('rating', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {ratingOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {showAdvanced && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Price (MXN/h)
              </label>
              <input
                type="number"
                value={localFilters.minPrice}
                onChange={(e) => handleInputChange('minPrice', e.target.value)}
                placeholder="0"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Price (MXN/h)
              </label>
              <input
                type="number"
                value={localFilters.maxPrice}
                onChange={(e) => handleInputChange('maxPrice', e.target.value)}
                placeholder="999999"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={localFilters.hasLights}
                  onChange={(e) => setLocalFilters(prev => ({ ...prev, hasLights: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Has Lighting</span>
              </label>
            </div>

            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={localFilters.accessibility}
                  onChange={(e) => setLocalFilters(prev => ({ ...prev, accessibility: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Accessibility</span>
              </label>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Court Surfaces
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {courtSurfaceOptions.map((surface) => (
                <label key={surface.value} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localFilters.courtSurface.includes(surface.value)}
                    onChange={(e) => handleCourtSurfaceChange(surface.value, e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">{surface.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Amenities & Services
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {amenityOptions.map((amenity) => (
                <label key={amenity.value} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localFilters.amenities.includes(amenity.value)}
                    onChange={(e) => handleAmenityChange(amenity.value, e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">{amenity.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Location-Based Search</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Latitude
                </label>
                <input
                  type="number"
                  value={localFilters.latitude}
                  onChange={(e) => handleInputChange('latitude', e.target.value)}
                  placeholder="19.4326"
                  step="any"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longitude
                </label>
                <input
                  type="number"
                  value={localFilters.longitude}
                  onChange={(e) => handleInputChange('longitude', e.target.value)}
                  placeholder="-99.1332"
                  step="any"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Radius (km)
                </label>
                <input
                  type="number"
                  value={localFilters.radius}
                  onChange={(e) => handleInputChange('radius', e.target.value)}
                  placeholder="25"
                  min="1"
                  max="200"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-end">
                <Button
                  variant="secondary"
                  onClick={handleLocationSearch}
                  className="w-full"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Use My Location
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <Button
          variant="primary"
          onClick={handleSearch}
          className="flex-1 sm:flex-none"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search
        </Button>
        
        <Button
          variant="secondary"
          onClick={handleReset}
          className="flex-1 sm:flex-none"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Clear
        </Button>
      </div>
    </div>
  );
};