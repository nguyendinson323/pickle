import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

interface AnalyticsOverviewProps {
  analytics: {
    totalRevenue: number;
    totalReservations: number;
    averageRating: number;
    occupancyRate: number;
    topRevenueHours: Array<{
      hour: string;
      revenue: number;
      reservations: number;
    }>;
    revenueByDay: Array<{
      date: string;
      revenue: number;
      reservations: number;
    }>;
  };
  period: string;
}

export const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({ analytics, period }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-yellow-600';
    if (rating >= 3.0) return 'text-orange-600';
    return 'text-red-600';
  };

  const getOccupancyColor = (rate: number) => {
    if (rate >= 0.8) return 'text-green-600 bg-green-100';
    if (rate >= 0.6) return 'text-yellow-600 bg-yellow-100';
    if (rate >= 0.4) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPrice(analytics.totalRevenue)}
              </p>
              <p className="text-xs text-gray-500 mt-1">{period}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </Card>

        {/* Total Reservations */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reservations</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.totalReservations.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">{period}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h6l2 2h6a2 2 0 012 2v4m-8 16H8a2 2 0 01-2-2V9a2 2 0 012-2h8a2 2 0 012 2v1" />
              </svg>
            </div>
          </div>
        </Card>

        {/* Average Rating */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <p className={`text-2xl font-bold ${getRatingColor(analytics.averageRating)}`}>
                {analytics.averageRating.toFixed(1)} ⭐
              </p>
              <p className="text-xs text-gray-500 mt-1">Based on reviews</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
        </Card>

        {/* Occupancy Rate */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPercentage(analytics.occupancyRate)}
              </p>
              <Badge 
                variant="info" 
                className={`mt-1 ${getOccupancyColor(analytics.occupancyRate)}`}
              >
                {analytics.occupancyRate >= 0.8 ? 'Excellent' :
                 analytics.occupancyRate >= 0.6 ? 'Good' :
                 analytics.occupancyRate >= 0.4 ? 'Fair' : 'Low'}
              </Badge>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Top Revenue Hours */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Top Revenue Hours
        </h3>
        <div className="space-y-3">
          {analytics.topRevenueHours.slice(0, 5).map((hour, index) => (
            <div key={hour.hour} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index === 0 ? 'bg-gold text-yellow-800' :
                  index === 1 ? 'bg-gray-200 text-gray-800' :
                  index === 2 ? 'bg-orange-200 text-orange-800' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {hour.hour}:00 - {(parseInt(hour.hour) + 1).toString().padStart(2, '0')}:00
                  </p>
                  <p className="text-sm text-gray-500">
                    {hour.reservations} reservations
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">
                  {formatPrice(hour.revenue)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Revenue Trend */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Revenue Trend ({period})
        </h3>
        <div className="space-y-2">
          {analytics.revenueByDay.slice(-7).map((day) => (
            <div key={day.date} className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-gray-900">
                  {new Date(day.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'short'
                  })}
                </p>
                <p className="text-sm text-gray-500">
                  {day.reservations} reservations
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  {formatPrice(day.revenue)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};