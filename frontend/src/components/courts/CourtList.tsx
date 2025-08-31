import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchCourts, setCurrentPage, Court } from '../../store/courtSlice';
import { CourtCard } from './CourtCard';
import LoadingSpinner from '../common/LoadingSpinner';
import Button from '../ui/Button';

interface CourtListProps {
  showActions?: boolean;
  onEdit?: (court: Court) => void;
  onDelete?: (courtId: number) => void;
  ownerFilter?: { ownerType: 'club' | 'partner'; ownerId: number };
}

export const CourtList: React.FC<CourtListProps> = ({ 
  showActions = false, 
  onEdit, 
  onDelete,
  ownerFilter 
}) => {
  const dispatch = useAppDispatch();
  const { 
    courts, 
    loading, 
    error, 
    searchFilters, 
    pagination 
  } = useAppSelector(state => state.courts);

  const [shouldFetch, setShouldFetch] = useState(true);

  useEffect(() => {
    if (shouldFetch) {
      const filters = { ...searchFilters };
      
      if (ownerFilter) {
        // For owner-specific lists, we'll fetch from a different endpoint
        // This will be handled in the parent component
        setShouldFetch(false);
        return;
      }

      dispatch(fetchCourts(filters));
      setShouldFetch(false);
    }
  }, [dispatch, searchFilters, shouldFetch, ownerFilter]);

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
    setShouldFetch(true);
  };

  const handleRetry = () => {
    setShouldFetch(true);
  };

  if (loading && courts.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && courts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Error loading courts
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={handleRetry}>
          Try again
        </Button>
      </div>
    );
  }

  if (courts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No courts found
        </h3>
        <p className="text-gray-600">
          {ownerFilter 
            ? 'You don\'t have any courts registered yet.' 
            : 'Try adjusting the search filters.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Loading overlay for pagination */}
      {loading && courts.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <LoadingSpinner />
          </div>
        </div>
      )}

      {/* Results header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {ownerFilter ? 'My Courts' : 'Available Courts'}
          </h2>
          <p className="text-sm text-gray-600">
            {pagination.total} court{pagination.total !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      {/* Court grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courts.map((court) => (
          <CourtCard
            key={court.id}
            court={court}
            showActions={showActions}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-4">
          <Button
            variant="secondary"
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
                  variant={pagination.current === pageNum ? 'primary' : 'secondary'}
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
            variant="secondary"
            disabled={pagination.current === pagination.pages || loading}
            onClick={() => handlePageChange(pagination.current + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Error message for pagination */}
      {error && courts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error updating
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-3">
                <Button size="sm" onClick={handleRetry}>
                  Retry
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};