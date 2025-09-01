import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import FormField from '@/components/forms/FormField';
import SelectField from '@/components/forms/SelectField';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import apiService from '@/services/api';
import {
  MapPinIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

interface Location {
  id: number;
  locationName?: string;
  city: string;
  state: string;
  address?: string;
  isCurrentLocation: boolean;
  isTravelLocation: boolean;
  travelStartDate?: string;
  travelEndDate?: string;
  searchRadius: number;
  privacyLevel: 'exact' | 'city' | 'state';
  latitude: number;
  longitude: number;
}

interface LocationManagerProps {
  onLocationChange: () => void;
}

const LocationManager: React.FC<LocationManagerProps> = ({ onLocationChange }) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    locationName: '',
    isCurrentLocation: false,
    isTravelLocation: false,
    travelStartDate: '',
    travelEndDate: '',
    searchRadius: '25',
    privacyLevel: 'city' as 'exact' | 'city' | 'state'
  });
  const [geocoding, setGeocoding] = useState(false);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      // For now, use mock data since API isn't ready
      const mockLocations: Location[] = [
        {
          id: 1,
          locationName: 'Home',
          city: 'Mexico City',
          state: 'CDMX',
          address: 'Polanco, Mexico City',
          isCurrentLocation: true,
          isTravelLocation: false,
          searchRadius: 25,
          privacyLevel: 'city',
          latitude: 19.4326,
          longitude: -99.1332
        }
      ];
      setLocations(mockLocations);
    } catch (error) {
      console.error('Failed to fetch locations:', error);
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGeocodeAddress = async () => {
    if (!formData.address.trim()) return;

    setGeocoding(true);
    try {
      // Mock geocoding for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update form data with mock geocoded results
      setFormData(prev => ({
        ...prev,
        city: prev.city || 'Mexico City',
        state: prev.state || 'CDMX'
      }));
    } catch (error) {
      console.error('Geocoding failed:', error);
    } finally {
      setGeocoding(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingLocation) {
        // Update existing location
        const updatedLocation = {
          ...editingLocation,
          ...formData,
          searchRadius: parseInt(formData.searchRadius)
        };
        
        setLocations(prev => 
          prev.map(loc => loc.id === editingLocation.id ? updatedLocation : loc)
        );
      } else {
        // Add new location
        const newLocation: Location = {
          id: Date.now(), // Mock ID
          ...formData,
          searchRadius: parseInt(formData.searchRadius),
          latitude: 19.4326, // Mock coordinates
          longitude: -99.1332
        };
        
        setLocations(prev => [...prev, newLocation]);
      }
      
      resetForm();
      onLocationChange();
    } catch (error) {
      console.error('Failed to save location:', error);
    }
  };

  const handleEdit = (location: Location) => {
    setEditingLocation(location);
    setFormData({
      address: location.address || '',
      city: location.city,
      state: location.state,
      locationName: location.locationName || '',
      isCurrentLocation: location.isCurrentLocation,
      isTravelLocation: location.isTravelLocation,
      travelStartDate: location.travelStartDate || '',
      travelEndDate: location.travelEndDate || '',
      searchRadius: location.searchRadius.toString(),
      privacyLevel: location.privacyLevel
    });
    setShowAddForm(true);
  };

  const handleDelete = async (locationId: number) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      setLocations(prev => prev.filter(loc => loc.id !== locationId));
      onLocationChange();
    }
  };

  const resetForm = () => {
    setFormData({
      address: '',
      city: '',
      state: '',
      locationName: '',
      isCurrentLocation: false,
      isTravelLocation: false,
      travelStartDate: '',
      travelEndDate: '',
      searchRadius: '25',
      privacyLevel: 'city'
    });
    setEditingLocation(null);
    setShowAddForm(false);
  };

  const getPrivacyLevelDisplay = (level: string) => {
    switch (level) {
      case 'exact': return 'Exact Location';
      case 'city': return 'City Level';
      case 'state': return 'State Level';
      default: return 'City Level';
    }
  };

  const getLocationDistance = (location: Location) => {
    // Mock distance calculation
    return Math.floor(Math.random() * 50) + 5;
  };

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <LoadingSpinner />
        <p className="text-gray-500 mt-4">Loading your locations...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-gray-900">My Locations</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage the locations where you'd like to find playing partners
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Location</span>
        </Button>
      </div>

      {/* Locations List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {locations.map((location) => (
          <Card key={location.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPinIcon className="h-5 w-5 text-blue-500" />
                  <h3 className="text-lg font-medium text-gray-900">
                    {location.locationName || `${location.city}, ${location.state}`}
                  </h3>
                  {location.isCurrentLocation && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Current
                    </span>
                  )}
                  {location.isTravelLocation && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Travel
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 mb-2">
                  {location.address && `${location.address}, `}
                  {location.city}, {location.state}
                </p>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mb-3">
                  <div>
                    <span className="font-medium">Search Radius:</span> {location.searchRadius}km
                  </div>
                  <div>
                    <span className="font-medium">Privacy:</span> {getPrivacyLevelDisplay(location.privacyLevel)}
                  </div>
                </div>
                
                {location.isTravelLocation && location.travelStartDate && location.travelEndDate && (
                  <p className="text-sm text-gray-500">
                    Travel dates: {new Date(location.travelStartDate).toLocaleDateString()} - {new Date(location.travelEndDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(location)}
                  className="p-2"
                >
                  <PencilIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(location.id)}
                  className="p-2 text-red-600 hover:text-red-700 hover:border-red-300"
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
        
        {locations.length === 0 && (
          <Card className="p-8 text-center lg:col-span-2">
            <GlobeAltIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No locations added yet</h3>
            <p className="text-gray-500 mb-4">
              Add your first location to start finding players in your area.
            </p>
            <Button variant="primary" onClick={() => setShowAddForm(true)}>
              Add Your First Location
            </Button>
          </Card>
        )}
      </div>

      {/* Add/Edit Location Form */}
      {showAddForm && (
        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {editingLocation ? 'Edit Location' : 'Add New Location'}
            </h3>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Location Name */}
            <FormField
              name="locationName"
              label="Location Name (Optional)"
              type="text"
              value={formData.locationName}
              onChange={(value) => handleInputChange('locationName', value)}
              placeholder="e.g., Home, Office, Vacation spot"
            />

            {/* Address */}
            <div>
              <FormField
                name="address"
                label="Address"
                type="text"
                value={formData.address}
                onChange={(value) => handleInputChange('address', value)}
                placeholder="Enter full address"
                required
              />
              <div className="mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGeocodeAddress}
                  disabled={geocoding || !formData.address.trim()}
                  className="flex items-center space-x-2"
                >
                  {geocoding ? <LoadingSpinner size="sm" /> : <MapPinIcon className="h-4 w-4" />}
                  <span>{geocoding ? 'Finding location...' : 'Find Location'}</span>
                </Button>
              </div>
            </div>

            {/* City and State */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                name="city"
                label="City"
                type="text"
                value={formData.city}
                onChange={(value) => handleInputChange('city', value)}
                required
              />
              <FormField
                name="state"
                label="State"
                type="text"
                value={formData.state}
                onChange={(value) => handleInputChange('state', value)}
                required
              />
            </div>

            {/* Location Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isCurrentLocation"
                  checked={formData.isCurrentLocation}
                  onChange={(e) => handleInputChange('isCurrentLocation', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isCurrentLocation" className="text-sm font-medium text-gray-700">
                  This is my current location
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isTravelLocation"
                  checked={formData.isTravelLocation}
                  onChange={(e) => handleInputChange('isTravelLocation', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isTravelLocation" className="text-sm font-medium text-gray-700">
                  This is a travel location
                </label>
              </div>
            </div>

            {/* Travel Dates */}
            {formData.isTravelLocation && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  name="travelStartDate"
                  label="Travel Start Date"
                  type="date"
                  value={formData.travelStartDate}
                  onChange={(value) => handleInputChange('travelStartDate', value)}
                />
                <FormField
                  name="travelEndDate"
                  label="Travel End Date"
                  type="date"
                  value={formData.travelEndDate}
                  onChange={(value) => handleInputChange('travelEndDate', value)}
                />
              </div>
            )}

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

            {/* Privacy Level */}
            <SelectField
              name="privacyLevel"
              label="Location Privacy Level"
              value={formData.privacyLevel}
              onChange={(value) => handleInputChange('privacyLevel', value)}
              options={[
                { value: 'state', label: 'State Level - Only show your state to other players' },
                { value: 'city', label: 'City Level - Show your city to other players (Recommended)' },
                { value: 'exact', label: 'Exact Location - Show your precise location' }
              ]}
            />

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button variant="outline" type="button" onClick={resetForm}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {editingLocation ? 'Update Location' : 'Add Location'}
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};

export default LocationManager;