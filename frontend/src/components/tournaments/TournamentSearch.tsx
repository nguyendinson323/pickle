import React, { useState, useEffect } from 'react';
import { TournamentSearchFilters } from '../../types/tournament';

interface TournamentSearchProps {
  filters: TournamentSearchFilters;
  onFiltersChange: (filters: TournamentSearchFilters) => void;
  states?: Array<{ id: number; name: string }>;
  isLoading?: boolean;
}

const TournamentSearch: React.FC<TournamentSearchProps> = ({
  filters,
  onFiltersChange,
  states = [],
  isLoading = false
}) => {
  const [localFilters, setLocalFilters] = useState<TournamentSearchFilters>(filters);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleInputChange = (key: keyof TournamentSearchFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value, page: 1 };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({ ...localFilters, page: 1 });
  };

  const clearFilters = () => {
    const clearedFilters: TournamentSearchFilters = {
      page: 1,
      limit: 10
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    setShowAdvanced(false);
  };

  const hasActiveFilters = () => {
    return Object.keys(localFilters).some(key => {
      const value = localFilters[key as keyof TournamentSearchFilters];
      return value && value !== '' && key !== 'page' && key !== 'limit';
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Search */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search tournaments
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                placeholder="Tournament name, description..."
                value={localFilters.search || ''}
                onChange={(e) => handleInputChange('search', e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex gap-2">
            <select
              value={localFilters.status || ''}
              onChange={(e) => handleInputChange('status', e.target.value || undefined)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">All statuses</option>
              <option value="registration_open">Registration Open</option>
              <option value="registration_closed">Registration Closed</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={localFilters.level || ''}
              onChange={(e) => handleInputChange('level', e.target.value || undefined)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">All levels</option>
              <option value="National">National</option>
              <option value="State">State</option>
              <option value="Municipal">Municipal</option>
              <option value="Local">Local</option>
            </select>

            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              {showAdvanced ? 'Fewer filters' : 'More filters'}
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="border-t pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Tournament Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tournament Type
                </label>
                <select
                  value={localFilters.tournamentType || ''}
                  onChange={(e) => handleInputChange('tournamentType', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">All types</option>
                  <option value="Championship">Championship</option>
                  <option value="League">League</option>
                  <option value="Open">Open</option>
                  <option value="Friendly">Friendly</option>
                  <option value="Tour">Tour</option>
                  <option value="Youth">Youth</option>
                </select>
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <select
                  value={localFilters.stateId || ''}
                  onChange={(e) => handleInputChange('stateId', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">All states</option>
                  {states.map(state => (
                    <option key={state.id} value={state.id}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start date (from)
                </label>
                <input
                  type="date"
                  value={localFilters.startDate || ''}
                  onChange={(e) => handleInputChange('startDate', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start date (to)
                </label>
                <input
                  type="date"
                  value={localFilters.endDate || ''}
                  onChange={(e) => handleInputChange('endDate', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {hasActiveFilters() && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Clear filters
              </button>
            )}
            {hasActiveFilters() && (
              <span className="text-xs text-gray-500">
                ({Object.keys(localFilters).filter(key => {
                  const value = localFilters[key as keyof TournamentSearchFilters];
                  return value && value !== '' && key !== 'page' && key !== 'limit';
                }).length} active filter{Object.keys(localFilters).filter(key => {
                  const value = localFilters[key as keyof TournamentSearchFilters];
                  return value && value !== '' && key !== 'page' && key !== 'limit';
                }).length !== 1 ? 's' : ''})
              </span>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      </form>

      {/* Active Filters Display */}
      {hasActiveFilters() && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700">Active filters:</span>
            {localFilters.search && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                Search: "{localFilters.search}"
                <button
                  onClick={() => handleInputChange('search', undefined)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {localFilters.status && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                Status: {localFilters.status.replace('_', ' ')}
                <button
                  onClick={() => handleInputChange('status', undefined)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {localFilters.level && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                Level: {localFilters.level}
                <button
                  onClick={() => handleInputChange('level', undefined)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {localFilters.tournamentType && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                Type: {localFilters.tournamentType}
                <button
                  onClick={() => handleInputChange('tournamentType', undefined)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {localFilters.stateId && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                State: {states.find(s => s.id === localFilters.stateId)?.name}
                <button
                  onClick={() => handleInputChange('stateId', undefined)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {localFilters.startDate && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                From: {localFilters.startDate}
                <button
                  onClick={() => handleInputChange('startDate', undefined)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {localFilters.endDate && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                To: {localFilters.endDate}
                <button
                  onClick={() => handleInputChange('endDate', undefined)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TournamentSearch;