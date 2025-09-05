import React, { useEffect, useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import LoadingSpinner from '../common/LoadingSpinner';

export const FederationAnalytics: React.FC = () => {
  // Mock admin analytics data since analytics slice doesn't exist yet
  const admin = {
    totalRevenue: 0,
    totalCourts: 0,
    activeUsers: 0,
    totalReservations: 0,
    topStates: [] as Array<{ state: string; courts: number; reservations: number; revenue: number }>,
    newCourts: 0,
    newUsers: 0,
    averageOccupancy: 0,
    averageRating: 0
  };
  const loading = false;
  const error = null;
  
  const [selectedPeriod, setSelectedPeriod] = useState<'30days' | '3months' | '1year'>('30days');

  useEffect(() => {
    // TODO: Implement admin analytics data fetching when analytics slice is created
    console.log('Federation analytics data would be fetched for:', selectedPeriod);
  }, [selectedPeriod]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      notation: price >= 1000000 ? 'compact' : 'standard'
    }).format(price);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-MX').format(num);
  };

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case '30days': return 'Last 30 days';
      case '3months': return 'Last 3 months';
      case '1year': return 'Last year';
      default: return 'Period';
    }
  };

  if (loading && !admin) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading analytics</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Try again
        </Button>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No data available</h3>
        <p className="text-gray-600">No admin data found to display</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Federation Analytics</h1>
          <p className="text-gray-600 mt-1">General statistics of the pickleball ecosystem</p>
        </div>

        <div className="flex gap-1 border border-gray-300 rounded-md overflow-hidden">
          {[
            { key: '30days' as const, label: '30D' },
            { key: '3months' as const, label: '3M' },
            { key: '1year' as const, label: '1A' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSelectedPeriod(key)}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                selectedPeriod === key
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-4">
          <div className="flex items-center gap-2 text-blue-600">
            <LoadingSpinner size="sm" />
            <span className="text-sm">Updating data...</span>
          </div>
        </div>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">
                {formatPrice(admin.totalRevenue)}
              </p>
              <p className="text-xs text-gray-500 mt-1">{getPeriodLabel()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </Card>

        {/* Total Courts */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Registered Courts</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatNumber(admin.totalCourts)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Across the network</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </Card>

        {/* Active Users */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatNumber(admin.activeUsers)}
              </p>
              <p className="text-xs text-gray-500 mt-1">{getPeriodLabel()}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
        </Card>

        {/* Total Reservations */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reservations</p>
              <p className="text-2xl font-bold text-orange-600">
                {formatNumber(admin.totalReservations)}
              </p>
              <p className="text-xs text-gray-500 mt-1">{getPeriodLabel()}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h6l2 2h6a2 2 0 012 2v4m-8 16H8a2 2 0 01-2-2V9a2 2 0 012-2h8a2 2 0 012 2v1" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing States */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing States</h3>
          <div className="space-y-3">
            {admin.topStates.map((state: any, index: number) => (
              <div key={state.state} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant={index === 0 ? 'success' : index === 1 ? 'warning' : 'info'}>
                    #{index + 1}
                  </Badge>
                  <div>
                    <p className="font-medium text-gray-900">{state.state}</p>
                    <p className="text-sm text-gray-500">
                      {state.courts} courts • {state.reservations} reservations
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-green-600">
                  {formatPrice(state.revenue)}
                </p>
              </div>
            ))}
          </div>

          {admin.topStates.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>Not enough data to show states</p>
            </div>
          )}
        </Card>

        {/* Growth Metrics */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Metrics</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">New registered courts</span>
              <div className="flex items-center gap-2">
                <Badge variant="success">+{admin.newCourts}</Badge>
                <span className="text-sm text-gray-500">{getPeriodLabel()}</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">New users</span>
              <div className="flex items-center gap-2">
                <Badge variant="success">+{formatNumber(admin.newUsers)}</Badge>
                <span className="text-sm text-gray-500">{getPeriodLabel()}</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average occupancy rate</span>
              <Badge variant={
                admin.averageOccupancy >= 0.8 ? 'success' :
                admin.averageOccupancy >= 0.6 ? 'warning' : 'error'
              }>
                {(admin.averageOccupancy * 100).toFixed(1)}%
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average rating</span>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-gray-900">
                  {admin.averageRating.toFixed(1)}
                </span>
                <span className="text-yellow-500">⭐</span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average revenue per court</span>
                <span className="font-semibold text-green-600">
                  {admin.totalCourts > 0 
                    ? formatPrice(admin.totalRevenue / admin.totalCourts)
                    : formatPrice(0)
                  }
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Market Distribution */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Distribution</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {admin.totalCourts}
            </div>
            <p className="text-gray-600">Total Courts</p>
            <p className="text-xs text-gray-500 mt-1">Across the network</p>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {formatNumber(admin.activeUsers)}
            </div>
            <p className="text-gray-600">Active Users</p>
            <p className="text-xs text-gray-500 mt-1">Player base</p>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {formatPrice(admin.totalRevenue / (admin.totalReservations || 1))}
            </div>
            <p className="text-gray-600">Average Ticket</p>
            <p className="text-xs text-gray-500 mt-1">Per reservation</p>
          </div>
        </div>
      </Card>
    </div>
  );
};