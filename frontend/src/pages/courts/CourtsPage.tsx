import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchCourts } from '../../store/courtSlice';
import { CourtList } from '../../components/courts/CourtList';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export const CourtsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { courts, loading, error, pagination } = useAppSelector(state => state.courts);
  const [searchParams, setSearchParams] = useState<any>({});
  const { user } = useAppSelector(state => state.auth);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchCourts({
      page: 1,
      limit: 12,
      ...searchParams
    }));
  }, [dispatch, searchParams]);

  const handleSearch = (params: any) => {
    setSearchParams(params);
  };

  const handlePageChange = (page: number) => {
    dispatch(fetchCourts({
      page,
      limit: 12,
      ...searchParams
    }));
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters = Object.keys(searchParams).some(key => 
    searchParams[key] !== '' && searchParams[key] !== undefined && searchParams[key] !== null
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Pickleball Courts
              </h1>
              <p className="text-gray-600 mt-1">
                Find and reserve courts throughout Mexico
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 text-sm ${
                    viewMode === 'grid'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                  title="Grid view"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 text-sm ${
                    viewMode === 'list'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                  title="List view"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>

              {/* Filters Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={`${showFilters ? 'bg-blue-50 text-blue-700 border-blue-300' : ''}`}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
                {hasActiveFilters && (
                  <span className="ml-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    !
                  </span>
                )}
              </Button>

              {/* Register Court Button */}
              {user && (user.role === 'club' || user.role === 'partner' || user.role === 'federation') && (
                <Button
                  variant="primary"
                  onClick={() => window.location.href = '/courts/register'}
                >
                  Register Court
                </Button>
              )}
            </div>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              
              {searchParams.query && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Search: "{searchParams.query}"
                </span>
              )}
              
              {searchParams.state && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  State: {searchParams.state}
                </span>
              )}
              
              {searchParams.surfaceType && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Surface: {searchParams.surfaceType}
                </span>
              )}
              
              {(searchParams.minPrice || searchParams.maxPrice) && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Price: {searchParams.minPrice || '0'} - {searchParams.maxPrice || '∞'}
                </span>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="text-xs"
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:w-80">
              <div className="sticky top-8">
                {/* CourtSearch component needs to be updated for correct props */}
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="font-medium text-gray-900 mb-4">Filters</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Search courts..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      onChange={(e) => handleSearch({ ...searchParams, query: e.target.value })}
                    />
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      onChange={(e) => handleSearch({ ...searchParams, surfaceType: e.target.value })}
                    >
                      <option value="">Surface type</option>
                      <option value="concrete">Concrete</option>
                      <option value="asphalt">Asphalt</option>
                      <option value="acrylic">Acrylic</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Summary */}
            {!loading && (
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-gray-600">
                  {pagination.total > 0 ? (
                    <>
                      Showing {((pagination.current - 1) * 12) + 1}-{Math.min(pagination.current * 12, pagination.total)} of {pagination.total} courts
                    </>
                  ) : (
                    'No courts found'
                  )}
                </p>

                {courts.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Sort by:</span>
                    <select
                      value={searchParams.sortBy || 'createdAt'}
                      onChange={(e) => handleSearch({ ...searchParams, sortBy: e.target.value })}
                      className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="createdAt">Most recent</option>
                      <option value="hourlyRate">Price (low to high)</option>
                      <option value="-hourlyRate">Price (high to low)</option>
                      <option value="-averageRating">Best rated</option>
                      <option value="name">Name (A-Z)</option>
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Loading State */}
            {loading && courts.length === 0 && (
              <div className="flex justify-center items-center h-64">
                <LoadingSpinner />
              </div>
            )}

            {/* Error State */}
            {error && courts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-red-600 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading courts</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={() => dispatch(fetchCourts({ page: 1, limit: 12, ...searchParams }))}>
                  Try again
                </Button>
              </div>
            )}

            {/* Empty State */}
            {!loading && courts.length === 0 && !error && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No courts found
                </h3>
                <p className="text-gray-600 mb-4">
                  {hasActiveFilters 
                    ? 'Try adjusting your search filters to find more options.'
                    : 'No courts have been registered on the platform yet.'
                  }
                </p>
                {hasActiveFilters && (
                  <Button variant="outline" onClick={clearFilters}>
                    Clear filters
                  </Button>
                )}
              </div>
            )}

            {/* Courts List */}
            {courts.length > 0 && (
              <>
                <CourtList />

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center items-center space-x-4 mt-8">
                    <Button
                      variant="outline"
                      disabled={pagination.current === 1 || loading}
                      onClick={() => handlePageChange(pagination.current - 1)}
                    >
                      Previous
                    </Button>
                    
                    <div className="flex space-x-2">
                      {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                        let pageNum;
                        if (pagination.pages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.current <= 3) {
                          pageNum = i + 1;
                        } else if (pagination.current >= pagination.pages - 2) {
                          pageNum = pagination.pages - 4 + i;
                        } else {
                          pageNum = pagination.current - 2 + i;
                        }

                        return (
                          <Button
                            key={pageNum}
                            variant={pagination.current === pageNum ? 'primary' : 'outline'}
                            size="sm"
                            disabled={loading}
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      disabled={pagination.current === pagination.pages || loading}
                      onClick={() => handlePageChange(pagination.current + 1)}
                    >
                      Next
                    </Button>
                  </div>
                )}

                {/* Loading indicator for pagination */}
                {loading && courts.length > 0 && (
                  <div className="flex justify-center mt-4">
                    <div className="flex items-center gap-2 text-blue-600">
                      <LoadingSpinner size="sm" />
                      <span className="text-sm">Loading...</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};