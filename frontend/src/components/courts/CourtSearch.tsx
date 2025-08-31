import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateSearchFilters, fetchCourts, resetSearchFilters } from '../../store/courtSlice';
import Button from '../ui/Button';

export const CourtSearch: React.FC = () => {
  const dispatch = useAppDispatch();
  const { searchFilters } = useAppSelector(state => state.courts);
  const { states } = useAppSelector(state => state.data);

  const [localFilters, setLocalFilters] = useState({
    search: searchFilters.search || '',
    surfaceType: searchFilters.surfaceType || '',
    stateId: searchFilters.stateId || '',
    minPrice: searchFilters.minPrice?.toString() || '',
    maxPrice: searchFilters.maxPrice?.toString() || '',
    amenities: searchFilters.amenities || [],
    sortBy: searchFilters.sortBy || 'created_at',
    sortOrder: searchFilters.sortOrder || 'DESC'
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const surfaceTypeOptions = [
    { value: '', label: 'Any surface' },
    { value: 'concrete', label: 'Concrete' },
    { value: 'asphalt', label: 'Asphalt' },
    { value: 'acrylic', label: 'Acrylic' },
    { value: 'composite', label: 'Composite' }
  ];

  const sortOptions = [
    { value: 'created_at:DESC', label: 'Most recent' },
    { value: 'created_at:ASC', label: 'Oldest' },
    { value: 'hourlyRate:ASC', label: 'Price: low to high' },
    { value: 'hourlyRate:DESC', label: 'Price: high to low' },
    { value: 'name:ASC', label: 'Name: A-Z' },
    { value: 'name:DESC', label: 'Name: Z-A' }
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
    { value: 'coaching_area', label: 'Coaching Area' }
  ];

  const stateOptions = [
    { value: '', label: 'Any state' },
    ...states.map(state => ({ value: state.id.toString(), label: state.name }))
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

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split(':');
    setLocalFilters(prev => ({ ...prev, sortBy, sortOrder: sortOrder as 'ASC' | 'DESC' }));
  };

  const handleSearch = () => {
    const filters: any = { ...localFilters, page: 1 };
    
    // Convert string values to appropriate types
    if (filters.stateId) {
      filters.stateId = parseInt(filters.stateId);
    } else {
      delete filters.stateId;
    }
    
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

    // Clean up empty values
    Object.keys(filters).forEach(key => {
      if (filters[key] === '' || filters[key] === null || filters[key] === undefined) {
        delete filters[key];
      }
    });

    dispatch(updateSearchFilters(filters));
    dispatch(fetchCourts(filters));
  };

  const handleReset = () => {
    setLocalFilters({
      search: '',
      surfaceType: '',
      stateId: '',
      minPrice: '',
      maxPrice: '',
      amenities: [],
      sortBy: 'created_at',
      sortOrder: 'DESC'
    });
    dispatch(resetSearchFilters());
    dispatch(fetchCourts({ page: 1, limit: 10, sortBy: 'created_at', sortOrder: 'DESC' }));
  };

  // Auto-search when sort order changes
  useEffect(() => {
    if (localFilters.sortBy !== searchFilters.sortBy || 
        localFilters.sortOrder !== searchFilters.sortOrder) {
      const timer = setTimeout(() => {
        handleSearch();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [localFilters.sortBy, localFilters.sortOrder, searchFilters.sortBy, searchFilters.sortOrder, handleSearch]);

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
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search by name or location
          </label>
          <input
            type="text"
            value={localFilters.search}
            onChange={(e) => handleInputChange('search', e.target.value)}
            placeholder="Court name, address..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State
          </label>
          <select
            value={localFilters.stateId}
            onChange={(e) => handleInputChange('stateId', e.target.value)}
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
            Sort by
          </label>
          <select
            value={`${localFilters.sortBy}:${localFilters.sortOrder}`}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {showAdvanced && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Surface
              </label>
              <select
                value={localFilters.surfaceType}
                onChange={(e) => handleInputChange('surfaceType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {surfaceTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum price (MXN/h)
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
                Maximum price (MXN/h)
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
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Available services
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