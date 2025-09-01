import React, { useState, useCallback } from 'react';
import { Search, Filter, X, Calendar, MapPin, Users, Trophy, DollarSign } from 'lucide-react';
import Card from '../ui/Card';
import FormField from '../forms/FormField';
import SelectField from '../forms/SelectField';

interface SearchFilters {
  searchTerm: string;
  category: string;
  dateRange: {
    start: string;
    end: string;
  };
  location: {
    state: string;
    city: string;
    radius: number;
  };
  priceRange: {
    min: number;
    max: number;
  };
  skillLevel: string;
  status: string;
  sortBy: string;
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  searchType: 'tournaments' | 'players' | 'courts' | 'events';
  placeholder?: string;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onSearch,
  searchType,
  placeholder = 'Search...'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    category: '',
    dateRange: { start: '', end: '' },
    location: { state: '', city: '', radius: 10 },
    priceRange: { min: 0, max: 1000 },
    skillLevel: '',
    status: '',
    sortBy: 'relevance'
  });

  const handleFilterChange = useCallback((field: string, value: any) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        (newFilters as any)[parent][child] = value;
      } else {
        (newFilters as any)[field] = value;
      }
      return newFilters;
    });
  }, []);

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({
      searchTerm: '',
      category: '',
      dateRange: { start: '', end: '' },
      location: { state: '', city: '', radius: 10 },
      priceRange: { min: 0, max: 1000 },
      skillLevel: '',
      status: '',
      sortBy: 'relevance'
    });
    onSearch({
      searchTerm: '',
      category: '',
      dateRange: { start: '', end: '' },
      location: { state: '', city: '', radius: 10 },
      priceRange: { min: 0, max: 1000 },
      skillLevel: '',
      status: '',
      sortBy: 'relevance'
    });
  };

  const getCategoryOptions = () => {
    switch (searchType) {
      case 'tournaments':
        return [
          { value: 'singles', label: 'Singles' },
          { value: 'doubles', label: 'Doubles' },
          { value: 'mixed', label: 'Mixed Doubles' },
          { value: 'team', label: 'Team Event' }
        ];
      case 'players':
        return [
          { value: 'recreational', label: 'Recreational' },
          { value: 'competitive', label: 'Competitive' },
          { value: 'professional', label: 'Professional' }
        ];
      case 'courts':
        return [
          { value: 'public', label: 'Public' },
          { value: 'private', label: 'Private' },
          { value: 'club', label: 'Club' }
        ];
      case 'events':
        return [
          { value: 'clinic', label: 'Clinic' },
          { value: 'workshop', label: 'Workshop' },
          { value: 'social', label: 'Social' },
          { value: 'league', label: 'League' }
        ];
      default:
        return [];
    }
  };

  const getStatusOptions = () => {
    switch (searchType) {
      case 'tournaments':
        return [
          { value: 'upcoming', label: 'Upcoming' },
          { value: 'registration_open', label: 'Registration Open' },
          { value: 'in_progress', label: 'In Progress' },
          { value: 'completed', label: 'Completed' }
        ];
      case 'players':
        return [
          { value: 'active', label: 'Active' },
          { value: 'looking_for_partner', label: 'Looking for Partner' },
          { value: 'available', label: 'Available' }
        ];
      case 'courts':
        return [
          { value: 'available', label: 'Available' },
          { value: 'occupied', label: 'Occupied' },
          { value: 'maintenance', label: 'Under Maintenance' }
        ];
      default:
        return [];
    }
  };

  return (
    <Card className="mb-6">
      <div className="p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder={placeholder}
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 sm:py-2 text-base sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex-1 sm:flex-none px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center gap-2 transition-colors touch-target"
            >
              <Filter className="h-5 w-5" />
              <span className="sm:inline">Filters</span>
            </button>
            <button
              onClick={handleSearch}
              className="flex-1 sm:flex-none px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors touch-target"
            >
              Search
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <SelectField
                name="category"
                label="Category"
                value={filters.category}
                onChange={(value) => handleFilterChange('category', value)}
                options={getCategoryOptions()}
                placeholder="Select category"
              />

              {searchType !== 'players' && (
                <>
                  <FormField
                    name="dateStart"
                    label="Date From"
                    type="date"
                    value={filters.dateRange.start}
                    onChange={(value) => handleFilterChange('dateRange.start', value)}
                  />
                  <FormField
                    name="dateEnd"
                    label="Date To"
                    type="date"
                    value={filters.dateRange.end}
                    onChange={(value) => handleFilterChange('dateRange.end', value)}
                  />
                </>
              )}

              <SelectField
                name="state"
                label="State"
                value={filters.location.state}
                onChange={(value) => handleFilterChange('location.state', value)}
                options={[
                  { value: 'cdmx', label: 'Ciudad de México' },
                  { value: 'jalisco', label: 'Jalisco' },
                  { value: 'nuevo_leon', label: 'Nuevo León' },
                  { value: 'yucatan', label: 'Yucatán' },
                  { value: 'puebla', label: 'Puebla' }
                ]}
                placeholder="Select state"
              />

              <FormField
                name="city"
                label="City"
                type="text"
                value={filters.location.city}
                onChange={(value) => handleFilterChange('location.city', value)}
                placeholder="Enter city"
              />

              <FormField
                name="radius"
                label="Search Radius (km)"
                type="number"
                value={filters.location.radius.toString()}
                onChange={(value) => handleFilterChange('location.radius', parseInt(value) || 10)}
              />

              {(searchType === 'tournaments' || searchType === 'events') && (
                <>
                  <FormField
                    name="minPrice"
                    label="Min Price ($)"
                    type="number"
                    value={filters.priceRange.min.toString()}
                    onChange={(value) => handleFilterChange('priceRange.min', parseInt(value) || 0)}
                  />
                  <FormField
                    name="maxPrice"
                    label="Max Price ($)"
                    type="number"
                    value={filters.priceRange.max.toString()}
                    onChange={(value) => handleFilterChange('priceRange.max', parseInt(value) || 1000)}
                  />
                </>
              )}

              {(searchType === 'tournaments' || searchType === 'players') && (
                <SelectField
                  name="skillLevel"
                  label="Skill Level"
                  value={filters.skillLevel}
                  onChange={(value) => handleFilterChange('skillLevel', value)}
                  options={[
                    { value: '2.0', label: '2.0 - Beginner' },
                    { value: '2.5', label: '2.5 - Advanced Beginner' },
                    { value: '3.0', label: '3.0 - Intermediate' },
                    { value: '3.5', label: '3.5 - Advanced Intermediate' },
                    { value: '4.0', label: '4.0 - Advanced' },
                    { value: '4.5', label: '4.5 - Expert' },
                    { value: '5.0', label: '5.0 - Professional' }
                  ]}
                  placeholder="Select skill level"
                />
              )}

              <SelectField
                name="status"
                label="Status"
                value={filters.status}
                onChange={(value) => handleFilterChange('status', value)}
                options={getStatusOptions()}
                placeholder="Select status"
              />

              <SelectField
                name="sortBy"
                label="Sort By"
                value={filters.sortBy}
                onChange={(value) => handleFilterChange('sortBy', value)}
                options={[
                  { value: 'relevance', label: 'Relevance' },
                  { value: 'date_asc', label: 'Date (Oldest First)' },
                  { value: 'date_desc', label: 'Date (Newest First)' },
                  { value: 'price_asc', label: 'Price (Low to High)' },
                  { value: 'price_desc', label: 'Price (High to Low)' },
                  { value: 'name_asc', label: 'Name (A-Z)' },
                  { value: 'name_desc', label: 'Name (Z-A)' }
                ]}
              />
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={handleReset}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Reset Filters
              </button>
              <button
                onClick={() => setIsExpanded(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AdvancedSearch;