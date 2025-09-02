import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../store';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Tabs from '../ui/Tabs';
import Table from '../ui/Table';
import Badge from '../ui/Badge';
import Chart from '../ui/Chart';
import LoadingSpinner from '../common/LoadingSpinner';

interface Facility {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  contactPhone: string;
  contactEmail: string;
  facilityType: 'indoor' | 'outdoor' | 'mixed';
  rating: number;
  totalReviews: number;
  photos: string[];
  amenities: string[];
  operatingHours: {
    [key: string]: {
      open: string;
      close: string;
      closed: boolean;
    };
  };
  policies: {
    cancellation: string;
    payment: string;
    rules: string[];
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  courts: Court[];
}

interface Court {
  id: string;
  name: string;
  courtNumber: string;
  surface: string;
  isActive: boolean;
  isAvailableForBooking: boolean;
  pricing: {
    baseHourlyRate: number;
    peakHourMultiplier: number;
    weekendMultiplier: number;
    peakHours: {
      start: string;
      end: string;
    };
  };
  specifications: {
    length: number;
    width: number;
    netHeight: number;
    surfaceType: string;
  };
  maintenance: {
    lastMaintenanceDate: Date;
    nextScheduledDate: Date;
    status: 'excellent' | 'good' | 'fair' | 'needs_attention';
  };
}

interface Booking {
  id: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  user: {
    id: number;
    username: string;
    email: string;
    phone: string;
  };
  participants: any;
  contactInfo: any;
  court: {
    id: string;
    name: string;
    courtNumber: string;
  };
}

interface Analytics {
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  occupancyRate: number;
  peakHours: { hour: string; bookings: number }[];
  revenueByMonth: { month: string; revenue: number }[];
  bookingsByStatus: { status: string; count: number }[];
  courtUtilization: { courtId: string; courtName: string; utilization: number }[];
}

export const FacilityManagementDashboard: React.FC = () => {
  const { user } = useAppSelector(state => state.auth);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const [showCourtModal, setShowCourtModal] = useState(false);
  const [editingCourt, setEditingCourt] = useState<Court | null>(null);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'chart' },
    { id: 'bookings', label: 'Bookings', icon: 'calendar' },
    { id: 'courts', label: 'Court Management', icon: 'grid' },
    { id: 'analytics', label: 'Analytics', icon: 'trending-up' },
    { id: 'settings', label: 'Facility Settings', icon: 'settings' }
  ];

  useEffect(() => {
    loadFacilities();
  }, []);

  useEffect(() => {
    if (selectedFacility) {
      loadFacilityData();
    }
  }, [selectedFacility, dateRange]);

  const loadFacilities = async () => {
    try {
      const response = await fetch('/api/facilities/my-facilities', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFacilities(data.data || []);
        if (data.data && data.data.length > 0) {
          setSelectedFacility(data.data[0]);
        }
      }
    } catch (error) {
      console.error('Error loading facilities:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFacilityData = async () => {
    if (!selectedFacility) return;

    setLoading(true);
    try {
      // Load facility bookings
      const bookingsResponse = await fetch(
        `/api/bookings/facility/${selectedFacility.id}?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData.data || []);
      }

      // Load facility analytics
      const analyticsResponse = await fetch(
        `/api/facilities/${selectedFacility.id}/analytics?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json();
        setAnalytics(analyticsData.data);
      }
    } catch (error) {
      console.error('Error loading facility data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCourtUpdate = async (courtData: Partial<Court>) => {
    if (!selectedFacility || !editingCourt) return;

    try {
      const response = await fetch(`/api/courts/${editingCourt.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(courtData)
      });

      if (response.ok) {
        // Refresh facility data
        loadFacilities();
        setShowCourtModal(false);
        setEditingCourt(null);
      }
    } catch (error) {
      console.error('Error updating court:', error);
    }
  };

  const handleBookingStatusChange = async (bookingId: string, status: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        loadFacilityData();
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: { color: 'green', label: 'Confirmed' },
      cancelled: { color: 'red', label: 'Cancelled' },
      completed: { color: 'blue', label: 'Completed' },
      no_show: { color: 'gray', label: 'No Show' },
      pending: { color: 'yellow', label: 'Pending' },
      paid: { color: 'green', label: 'Paid' },
      refunded: { color: 'purple', label: 'Refunded' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { color: 'gray', label: status };
    return <Badge color={config.color}>{config.label}</Badge>;
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Bookings</h3>
              <p className="text-2xl font-semibold text-gray-900">{analytics?.totalBookings || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(analytics?.totalRevenue || 0)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Average Rating</h3>
              <p className="text-2xl font-semibold text-gray-900">{(analytics?.averageRating || 0).toFixed(1)}/5.0</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Occupancy Rate</h3>
              <p className="text-2xl font-semibold text-gray-900">{(analytics?.occupancyRate || 0).toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Bookings</h3>
        </div>
        <div className="p-6">
          {bookings.slice(0, 5).length > 0 ? (
            <div className="space-y-4">
              {bookings.slice(0, 5).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-medium text-gray-900">{booking.user.username}</p>
                        <p className="text-sm text-gray-600">
                          {booking.court.name} - {new Date(booking.bookingDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          {booking.startTime} - {booking.endTime}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatCurrency(booking.totalAmount)}</p>
                      <p className="text-sm text-gray-600">{getStatusBadge(booking.paymentStatus)}</p>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No recent bookings</p>
          )}
        </div>
      </div>

      {/* Court Status Overview */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Court Status</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedFacility?.courts.map((court) => (
              <div key={court.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{court.name}</h4>
                  <Badge color={court.isActive ? 'green' : 'red'}>
                    {court.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Surface:</span>
                    <span>{court.surface}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Base Rate:</span>
                    <span>{formatCurrency(court.pricing.baseHourlyRate)}/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Maintenance:</span>
                    <Badge 
                      color={
                        court.maintenance.status === 'excellent' ? 'green' :
                        court.maintenance.status === 'good' ? 'blue' :
                        court.maintenance.status === 'fair' ? 'yellow' : 'red'
                      }
                    >
                      {court.maintenance.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
                <div className="mt-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setEditingCourt(court);
                      setShowCourtModal(true);
                    }}
                    className="w-full"
                  >
                    Manage Court
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">All Bookings</h3>
            <div className="flex space-x-4">
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table
            columns={[
              { key: 'bookingDate', label: 'Date' },
              { key: 'time', label: 'Time' },
              { key: 'court', label: 'Court' },
              { key: 'customer', label: 'Customer' },
              { key: 'amount', label: 'Amount' },
              { key: 'status', label: 'Status' },
              { key: 'paymentStatus', label: 'Payment' },
              { key: 'actions', label: 'Actions' }
            ]}
            data={bookings.map(booking => ({
              bookingDate: new Date(booking.bookingDate).toLocaleDateString(),
              time: `${booking.startTime} - ${booking.endTime}`,
              court: `${booking.court.name} (${booking.court.courtNumber})`,
              customer: (
                <div>
                  <div className="font-medium">{booking.user.username}</div>
                  <div className="text-sm text-gray-600">{booking.user.email}</div>
                </div>
              ),
              amount: formatCurrency(booking.totalAmount),
              status: getStatusBadge(booking.status),
              paymentStatus: getStatusBadge(booking.paymentStatus),
              actions: (
                <div className="flex space-x-2">
                  {booking.status === 'confirmed' && (
                    <>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleBookingStatusChange(booking.id, 'completed')}
                      >
                        Complete
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleBookingStatusChange(booking.id, 'cancelled')}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      // View booking details
                      console.log('View booking:', booking.id);
                    }}
                  >
                    View
                  </Button>
                </div>
              )
            }))}
          />
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      {analytics && (
        <>
          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Trend</h3>
            <Chart
              type="line"
              data={analytics.revenueByMonth}
              xKey="month"
              yKey="revenue"
              height={300}
            />
          </div>

          {/* Peak Hours Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Peak Hours Analysis</h3>
            <Chart
              type="bar"
              data={analytics.peakHours}
              xKey="hour"
              yKey="bookings"
              height={300}
            />
          </div>

          {/* Court Utilization */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Court Utilization</h3>
            <div className="space-y-4">
              {analytics.courtUtilization.map((court) => (
                <div key={court.courtId} className="flex items-center justify-between">
                  <span className="font-medium">{court.courtName}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${court.utilization}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{court.utilization.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );

  if (loading && !selectedFacility) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (!selectedFacility) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No facilities found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your first facility.</p>
          <div className="mt-6">
            <Button variant="primary">Add Facility</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Facility Management</h1>
          <p className="text-gray-600">Manage your pickleball facilities and court operations</p>
        </div>
        
        {facilities.length > 1 && (
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Select Facility:</label>
            <select
              value={selectedFacility.id}
              onChange={(e) => {
                const facility = facilities.find(f => f.id === e.target.value);
                setSelectedFacility(facility || null);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {facilities.map((facility) => (
                <option key={facility.id} value={facility.id}>
                  {facility.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Facility Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{selectedFacility.name}</h2>
              <p className="text-gray-600">{selectedFacility.address}, {selectedFacility.city}, {selectedFacility.state}</p>
              <div className="flex items-center mt-2 space-x-4">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <span className="text-sm text-gray-600">{selectedFacility.rating.toFixed(1)} ({selectedFacility.totalReviews} reviews)</span>
                </div>
                <Badge color="blue">{selectedFacility.facilityType}</Badge>
                <span className="text-sm text-gray-600">{selectedFacility.courts.length} courts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Tab Content */}
      <div>
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'bookings' && renderBookings()}
            {activeTab === 'analytics' && renderAnalytics()}
          </>
        )}
      </div>

      {/* Court Management Modal */}
      <Modal isOpen={showCourtModal} onClose={() => setShowCourtModal(false)} size="lg">
        {editingCourt && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Manage Court: {editingCourt.name}
            </h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Court Name
                  </label>
                  <input
                    type="text"
                    value={editingCourt.name}
                    onChange={(e) => setEditingCourt(prev => prev ? { ...prev, name: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Base Hourly Rate (MXN)
                  </label>
                  <input
                    type="number"
                    value={editingCourt.pricing.baseHourlyRate}
                    onChange={(e) => setEditingCourt(prev => prev ? {
                      ...prev,
                      pricing: { ...prev.pricing, baseHourlyRate: parseFloat(e.target.value) || 0 }
                    } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editingCourt.isActive}
                    onChange={(e) => setEditingCourt(prev => prev ? { ...prev, isActive: e.target.checked } : null)}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Court Active</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editingCourt.isAvailableForBooking}
                    onChange={(e) => setEditingCourt(prev => prev ? { ...prev, isAvailableForBooking: e.target.checked } : null)}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Available for Booking</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowCourtModal(false);
                    setEditingCourt(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleCourtUpdate(editingCourt)}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FacilityManagementDashboard;