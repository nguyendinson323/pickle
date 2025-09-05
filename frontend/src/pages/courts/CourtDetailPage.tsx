import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchCourtById, clearCurrentCourt } from '../../store/courtSlice';
import { CourtDetail } from '../../components/courts/CourtDetail';
import { ReservationForm } from '../../components/reservations/ReservationForm';
import { CourtAnalyticsDashboard } from '../../components/analytics/CourtAnalyticsDashboard';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/ui/Badge';

export const CourtDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { currentCourt, loading, error } = useAppSelector(state => state.courts);
  const { user } = useAppSelector(state => state.auth);
  
  const [activeTab, setActiveTab] = React.useState<'details' | 'reserve' | 'analytics'>('details');

  const courtId = id ? parseInt(id, 10) : null;

  useEffect(() => {
    if (courtId) {
      dispatch(fetchCourtById(courtId));
    }

    return () => {
      dispatch(clearCurrentCourt());
    };
  }, [dispatch, courtId]);

  // Redirect if invalid ID
  useEffect(() => {
    if (!courtId || isNaN(courtId)) {
      navigate('/courts', { replace: true });
    }
  }, [courtId, navigate]);

  const canViewAnalytics = () => {
    if (!user || !currentCourt) return false;
    
    // Federation can view all analytics
    if (user.role === 'admin') return true;
    
    // Court owners can view their own analytics
    if (currentCourt.ownerId === user.id) return true;
    
    return false;
  };

  const canEditCourt = () => {
    if (!user || !currentCourt) return false;
    
    // Federation can edit all courts
    if (user.role === 'admin') return true;
    
    // Court owners can edit their own courts
    if (currentCourt.ownerId === user.id) return true;
    
    return false;
  };

  if (loading && !currentCourt) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading court</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => dispatch(fetchCourtById(courtId!))}>
              Try again
            </Button>
            <Button variant="outline" onClick={() => navigate('/courts')}>
              Back to courts
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentCourt) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Court not found</h3>
          <p className="text-gray-600 mb-4">
            The court you are looking for does not exist or has been deleted.
          </p>
          <Button onClick={() => navigate('/courts')}>
            Back to courts
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <button
                  onClick={() => navigate('/courts')}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Courts
                </button>
              </li>
              <li className="flex items-center">
                <svg className="flex-shrink-0 h-4 w-4 text-gray-400 mx-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 font-medium truncate max-w-xs">
                  {currentCourt.name}
                </span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {currentCourt.name}
                </h1>
                
                {currentCourt.isActive ? (
                  <Badge variant="success">Active</Badge>
                ) : (
                  <Badge variant="error">Inactive</Badge>
                )}

                {/* Featured badge removed - isFeatured property not available */}
              </div>
              
              <p className="text-gray-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {currentCourt.address}{currentCourt.state && `, ${currentCourt.state.name}`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {canEditCourt() && (
                <Button 
                  variant="outline"
                  onClick={() => navigate(`/courts/${currentCourt.id}/edit`)}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </Button>
              )}

              {user && (
                <Button 
                  variant="primary"
                  onClick={() => setActiveTab('reserve')}
                  className={activeTab === 'reserve' ? 'bg-blue-600' : ''}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h6l2 2h6a2 2 0 012 2v4m-8 16H8a2 2 0 01-2-2V9a2 2 0 012-2h8a2 2 0 012 2v1" />
                  </svg>
                  Reserve
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'details'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Details
            </button>
            
            {user && (
              <button
                onClick={() => setActiveTab('reserve')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'reserve'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Reserve
              </button>
            )}
            
            {canViewAnalytics() && (
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'analytics'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Analytics
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && currentCourt && (
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-2 text-blue-600">
              <LoadingSpinner size="sm" />
              <span className="text-sm">Updating...</span>
            </div>
          </div>
        )}

        {activeTab === 'details' && (
          <CourtDetail />
        )}

        {activeTab === 'reserve' && user && (
          <ReservationForm 
            courtId={currentCourt.id} 
            court={currentCourt}
          />
        )}

        {activeTab === 'analytics' && canViewAnalytics() && (
          <CourtAnalyticsDashboard 
            courtId={currentCourt.id}
            showFilters={false}
          />
        )}

        {/* Not logged in message for reservation tab */}
        {activeTab === 'reserve' && !user && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Log in to reserve
            </h3>
            <p className="text-gray-600 mb-4">
              You need to have an account to make reservations at this court.
            </p>
            <div className="flex gap-3 justify-center">
              <Button 
                variant="primary"
                onClick={() => navigate('/login', { state: { returnUrl: window.location.pathname } })}
              >
                Log In
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/register', { state: { returnUrl: window.location.pathname } })}
              >
                Create Account
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};