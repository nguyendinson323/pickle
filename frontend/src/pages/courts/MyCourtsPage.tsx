import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchCourtsByOwner } from '../../store/courtSlice';
import { CourtCard } from '../../components/courts/CourtCard';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Card from '../../components/ui/Card';

export const MyCourtsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { courts: myCourts, loading, error } = useAppSelector(state => state.courts);
  const { user } = useAppSelector(state => state.auth);

  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'pending'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'createdAt' | 'status'>('createdAt');

  useEffect(() => {
    // Check if user can access this page
    if (!user) {
      navigate('/login', { state: { returnUrl: '/my-courts' } });
      return;
    }

    if (!['club', 'partner', 'federation'].includes(user.role)) {
      navigate('/courts', { replace: true });
      return;
    }

    // Fetch courts by owner - need to implement proper owner filtering
    dispatch(fetchCourtsByOwner({ ownerType: user.role as any, ownerId: user.id }));
  }, [user, navigate, dispatch]);

  const handleToggleStatus = async (courtId: number) => {
    try {
      // toggleCourtStatus not available - need to implement
      console.log('Toggle court status for:', courtId);
    } catch (err) {
      // Error handling
    }
  };

  const getStatusColor = (status: string): 'success' | 'error' | 'warning' | 'primary' => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'pending': return 'warning';
      default: return 'primary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'inactive': return 'Inactive';
      case 'pending': return 'Pending';
      default: return status;
    }
  };

  const filteredAndSortedCourts = React.useMemo(() => {
    let filtered = myCourts;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter((court: any) => {
        switch (filterStatus) {
          case 'active': return court.isActive === true;
          case 'inactive': return court.isActive === false;
          case 'pending': return false; // No pending status available
          default: return true;
        }
      });
    }

    // Sort
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'status':
          return String(a.isActive).localeCompare(String(b.isActive));
        case 'createdAt':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [myCourts, filterStatus, sortBy]);

  const getStatsCard = (title: string, count: number, color: string) => (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className={`text-2xl font-bold text-${color}-600`}>{count}</p>
        </div>
        <div className={`p-2 bg-${color}-100 rounded-lg`}>
          <svg className={`w-6 h-6 text-${color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
      </div>
    </Card>
  );

  if (!user || !['club', 'partner', 'federation'].includes(user.role)) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Restricted Access</h3>
          <p className="text-gray-600 mb-4">
            This page is only for registered court owners.
          </p>
          <Button onClick={() => navigate('/courts')}>
            Back to Courts
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Courts</h1>
              <p className="text-gray-600 mt-1">
                Manage and monitor the performance of your courts
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/analytics')}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                View Analytics
              </Button>
              
              <Button
                variant="primary"
                onClick={() => navigate('/courts/register')}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Court
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {loading && myCourts.length === 0 && (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading courts</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => dispatch(fetchCourtsByOwner({ ownerType: user.role as any, ownerId: user.id }))}>
              Try again
            </Button>
          </div>
        )}

        {/* No Courts State */}
        {!loading && myCourts.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              You have no registered courts
            </h3>
            <p className="text-gray-600 mb-4">
              Register your first court to start receiving reservations.
            </p>
            <Button onClick={() => navigate('/courts/register')}>
              Register My First Court
            </Button>
          </div>
        )}

        {/* Courts Content */}
        {myCourts.length > 0 && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {getStatsCard(
                'Total Courts', 
                myCourts.length, 
                'blue'
              )}
              {getStatsCard(
                'Active', 
                myCourts.filter((c: any) => c.isActive).length, 
                'green'
              )}
              {getStatsCard(
                'Inactive', 
                myCourts.filter((c: any) => !c.isActive).length, 
                'red'
              )}
              {getStatsCard(
                'Pending', 
                0, // No pending status available 
                'yellow'
              )}
            </div>

            {/* Filters and Sort */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={filterStatus === 'all' ? 'primary' : 'outline'}
                  onClick={() => setFilterStatus('all')}
                >
                  All ({myCourts.length})
                </Button>
                <Button
                  size="sm"
                  variant={filterStatus === 'active' ? 'primary' : 'outline'}
                  onClick={() => setFilterStatus('active')}
                >
                  Active ({myCourts.filter((c: any) => c.isActive).length})
                </Button>
                <Button
                  size="sm"
                  variant={filterStatus === 'inactive' ? 'primary' : 'outline'}
                  onClick={() => setFilterStatus('inactive')}
                >
                  Inactive ({myCourts.filter((c: any) => !c.isActive).length})
                </Button>
                <Button
                  size="sm"
                  variant={filterStatus === 'pending' ? 'primary' : 'outline'}
                  onClick={() => setFilterStatus('pending')}
                >
                  Pending (0)
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="createdAt">Most recent</option>
                  <option value="name">Name</option>
                  <option value="status">Status</option>
                </select>
              </div>
            </div>

            {/* Loading indicator for actions */}
            {loading && myCourts.length > 0 && (
              <div className="flex justify-center mb-4">
                <div className="flex items-center gap-2 text-blue-600">
                  <LoadingSpinner size="sm" />
                  <span className="text-sm">Processing...</span>
                </div>
              </div>
            )}

            {/* Courts Grid */}
            {filteredAndSortedCourts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedCourts.map((court) => (
                  <div key={court.id} className="relative">
                    <CourtCard court={court} />
                    
                    {/* Management Overlay */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <Badge variant={getStatusColor(court.isActive ? 'active' : 'inactive') as any}>
                        {getStatusLabel(court.isActive ? 'active' : 'inactive')}
                      </Badge>
                      
                      {/* Featured badge removed - isFeatured property not available */}
                    </div>

                    {/* Quick Actions */}
                    <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/courts/${court.id}/edit`)}
                        className="bg-white shadow-lg"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Button>
                      
                      <Button
                        size="sm"
                        variant={court.isActive ? 'outline' : 'primary'}
                        onClick={() => handleToggleStatus(court.id)}
                        className="bg-white shadow-lg"
                        title={court.isActive ? 'Deactivate court' : 'Activate court'}
                      >
                        {court.isActive ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/courts/${court.id}/analytics`)}
                        className="bg-white shadow-lg"
                        title="View analytics"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </div>
                <p className="text-gray-600">
                  No courts match the selected filters.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};