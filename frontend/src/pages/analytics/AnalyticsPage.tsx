import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store';
// import { CourtAnalyticsDashboard } from '../../components/analytics/CourtAnalyticsDashboard';
// import { FederationAnalytics } from '../../components/analytics/FederationAnalytics';
import Button from '../../components/ui/Button';

export const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector(state => state.auth);
  const { courts: myCourts } = useAppSelector(state => state.courts);

  const [selectedView, setSelectedView] = useState<'federation' | 'courts'>('courts');

  // Check if user has access to analytics
  React.useEffect(() => {
    if (!user) {
      navigate('/login', { state: { returnUrl: '/analytics' } });
      return;
    }

    if (!['club', 'partner', 'federation'].includes(user.role)) {
      navigate('/courts', { replace: true });
      return;
    }
  }, [user, navigate]);

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
            This page is only for court owners and administrators.
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
              <h1 className="text-2xl font-bold text-gray-900">Analytics Center</h1>
              <p className="text-gray-600 mt-1">
                Monitor your business performance and growth
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                <button
                  onClick={() => setSelectedView('courts')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    selectedView === 'courts'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  My Courts
                </button>
                
                {user.role === 'federation' && (
                  <button
                    onClick={() => setSelectedView('federation')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      selectedView === 'federation'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Federation
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <Button
                variant="outline"
                onClick={() => navigate('/my-courts')}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Manage Courts
              </Button>

              <Button
                variant="primary"
                onClick={() => {
                  // Generate and download analytics report
                  const reportData = {
                    timestamp: new Date().toISOString(),
                    user: user.email,
                    view: selectedView,
                    generatedAt: new Date().toLocaleString('en-US')
                  };
                  
                  const blob = new Blob([JSON.stringify(reportData, null, 2)], { 
                    type: 'application/json' 
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Court Analytics View */}
        {selectedView === 'courts' && (
          <>
            {myCourts && myCourts.length > 0 ? (
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Court Analytics</h3>
                <p className="text-gray-600">Analytics dashboard implementation pending</p>
                {/* <CourtAnalyticsDashboard /> - Component has import issues */}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  You have no registered courts
                </h3>
                <p className="text-gray-600 mb-4">
                  Register your first court to start seeing performance analytics.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button 
                    variant="primary"
                    onClick={() => navigate('/courts/register')}
                  >
                    Register Court
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/courts')}
                  >
                    Explore Courts
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Federation Analytics View */}
        {selectedView === 'federation' && user.role === 'federation' && (
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Federation Analytics</h3>
            <p className="text-gray-600">Federation analytics dashboard implementation pending</p>
            {/* <FederationAnalytics /> - Component has import issues */}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 bg-gray-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Understanding Your Metrics
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                Total Revenue
              </h4>
              <p className="text-sm text-gray-600">
                Sum of all payments received for confirmed bookings, including base fees and extras.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h6l2 2h6a2 2 0 012 2v4m-8 16H8a2 2 0 01-2-2V9a2 2 0 012-2h8a2 2 0 012 2v1" />
                </svg>
                Total Bookings
              </h4>
              <p className="text-sm text-gray-600">
                Total number of bookings made, including completed, cancelled and in progress.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Occupancy Rate
              </h4>
              <p className="text-sm text-gray-600">
                Percentage of time your courts are occupied vs. total available time.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Average Rating
              </h4>
              <p className="text-sm text-gray-600">
                Average of ratings left by players based on their experience at your courts.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <svg className="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Peak Hours
              </h4>
              <p className="text-sm text-gray-600">
                Times with highest demand and profitability, useful for optimizing prices and availability.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Revenue Trend
              </h4>
              <p className="text-sm text-gray-600">
                Evolution of your revenue over time to identify patterns and opportunities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};