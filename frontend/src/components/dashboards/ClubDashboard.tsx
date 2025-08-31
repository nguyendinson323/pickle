import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { 
  fetchDashboardData, 
  selectDashboardData, 
  selectDashboardLoading, 
  selectDashboardError 
} from '@/store/dashboardSlice';
import { 
  fetchMessages, 
  selectUnreadCount 
} from '@/store/messageSlice';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import Tabs from '@/components/ui/Tabs';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import {
  BuildingOfficeIcon,
  CogIcon,
  InboxIcon,
  UsersIcon,
  CalendarIcon,
  MapIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

const ClubDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const dashboardData = useAppSelector(selectDashboardData);
  const loading = useAppSelector(selectDashboardLoading);
  const error = useAppSelector(selectDashboardError);
  // const messages = useAppSelector(selectMessages); // Unused for now
  const unreadCount = useAppSelector(selectUnreadCount);
  
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    dispatch(fetchDashboardData());
    dispatch(fetchMessages({ page: 1, limit: 10 }));
  }, [dispatch]);

  const tabs = [
    {
      id: 'profile',
      label: 'Club Profile',
      icon: <BuildingOfficeIcon className="w-4 h-4" />,
      count: 0
    },
    {
      id: 'account',
      label: 'My Account',
      icon: <CogIcon className="w-4 h-4" />,
      count: 0
    },
    {
      id: 'inbox',
      label: 'Inbox',
      icon: <InboxIcon className="w-4 h-4" />,
      count: unreadCount
    },
    {
      id: 'members',
      label: 'Members',
      icon: <UsersIcon className="w-4 h-4" />,
      count: dashboardData?.statistics?.members || 0
    },
    {
      id: 'events',
      label: 'Events',
      icon: <CalendarIcon className="w-4 h-4" />,
      count: dashboardData?.statistics?.upcomingEvents || 0
    },
    {
      id: 'facilities',
      label: 'Facilities',
      icon: <MapIcon className="w-4 h-4" />,
      count: dashboardData?.statistics?.courts || 0
    },
    {
      id: 'finances',
      label: 'Finances',
      icon: <CurrencyDollarIcon className="w-4 h-4" />,
      count: 0
    }
  ];

  const renderProfileTab = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Club Profile</h3>
              <p className="text-green-100 mb-4">
                {dashboardData?.user?.club_name || 'Example Pickleball Club'}
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-green-200">Club ID:</span>
                  <span className="ml-2 font-medium">{dashboardData?.user?.id || 'CLUB001'}</span>
                </div>
                <div>
                  <span className="text-green-200">State:</span>
                  <span className="ml-2 font-medium">{dashboardData?.user?.state || 'CDMX'}</span>
                </div>
                <div>
                  <span className="text-green-200">Founded:</span>
                  <span className="ml-2 font-medium">2020</span>
                </div>
                <div>
                  <span className="text-green-200">Status:</span>
                  <span className="ml-2 font-medium">Active</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="w-20 h-20 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <BuildingOfficeIcon className="w-10 h-10 text-white" />
              </div>
              <Button variant="ghost" size="sm" className="text-white border-white/30">
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h4 className="font-semibold text-gray-900 mb-4">General Information</h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Address</label>
                <p className="text-gray-900">Av. Reforma 123, Col. Centro, CDMX</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-gray-900">+52 55 1234 5678</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">info@clubpickleball.com</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Website</label>
                <p className="text-gray-900">www.clubpickleball.com</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Services</h4>
            <div className="space-y-2">
              <Badge variant="primary">Memberships</Badge>
              <Badge variant="success">Group Classes</Badge>
              <Badge variant="warning">Private Training</Badge>
              <Badge variant="secondary">Tournaments</Badge>
              <Badge variant="secondary">Court Rental</Badge>
            </div>
            <Button variant="outline" size="sm" fullWidth className="mt-4">
              Edit Services
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderMembersTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Member Management</h3>
        <Button variant="primary">
          <UsersIcon className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {dashboardData?.statistics?.members || 245}
            </div>
            <div className="text-sm text-gray-500">Active Members</div>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {dashboardData?.statistics?.newMembersThisMonth || 23}
            </div>
            <div className="text-sm text-gray-500">New This Month</div>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {dashboardData?.statistics?.membershipRenewalsDue || 12}
            </div>
            <div className="text-sm text-gray-500">Renewals Pending</div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Recent Members</h4>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((member) => (
              <div key={member} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <UsersIcon className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Member {member}</div>
                    <div className="text-sm text-gray-500">Premium Membership</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">Active</div>
                  <div className="text-xs text-gray-500">Desde Mar 2024</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );

  const renderEventsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Club Events</h3>
        <Button variant="primary">
          <CalendarIcon className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'Monthly Tournament', date: '15 Mar 2024', participants: 32, status: 'upcoming' },
          { title: 'Beginner Clinic', date: '20 Mar 2024', participants: 16, status: 'upcoming' },
          { title: 'Summer League', date: '1 Jun 2024', participants: 48, status: 'registration' },
          { title: 'Doubles Tournament', date: '10 Mar 2024', participants: 24, status: 'completed' }
        ].map((event, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-medium text-gray-900">{event.title}</h4>
                <Badge 
                  variant={
                    event.status === 'upcoming' ? 'primary' :
                    event.status === 'registration' ? 'warning' :
                    'success'
                  }
                >
                  {event.status === 'upcoming' ? 'Upcoming' :
                   event.status === 'registration' ? 'Registration' :
                   'Completed'}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-medium">{event.date}</span>
                </div>
                <div className="flex justify-between">
                  <span>Participants:</span>
                  <span className="font-medium">{event.participants}</span>
                </div>
              </div>
              
              <Button variant="outline" size="sm" fullWidth>
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderFacilitiesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Facilities</h3>
        <Button variant="primary">
          <MapIcon className="w-4 h-4 mr-2" />
          Add Court
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((court) => (
          <Card key={court} className="hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-medium text-gray-900">Court {court}</h4>
                <Badge variant={court % 3 === 0 ? 'warning' : 'success'}>
                  {court % 3 === 0 ? 'Maintenance' : 'Available'}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className="font-medium">Outdoor</span>
                </div>
                <div className="flex justify-between">
                  <span>Surface:</span>
                  <span className="font-medium">Acrylic</span>
                </div>
                <div className="flex justify-between">
                  <span>Lighting:</span>
                  <span className="font-medium">LED</span>
                </div>
                <div className="flex justify-between">
                  <span>Bookings today:</span>
                  <span className="font-medium">{Math.floor(Math.random() * 8) + 1}</span>
                </div>
              </div>
              
              <Button variant="outline" size="sm" fullWidth>
                View Schedule
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'account':
        return (
          <div className="text-center py-12">
            <CogIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Account Settings</h3>
            <p className="text-gray-500">Manage your club information and preferences.</p>
          </div>
        );
      case 'inbox':
        return (
          <div className="text-center py-12">
            <InboxIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Messages</h3>
            <p className="text-gray-500">Your inbox is empty.</p>
          </div>
        );
      case 'members':
        return renderMembersTab();
      case 'events':
        return renderEventsTab();
      case 'facilities':
        return renderFacilitiesTab();
      case 'finances':
        return (
          <div className="text-center py-12">
            <CurrencyDollarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Financial Management</h3>
            <p className="text-gray-500">Review income, expenses, and financial reports.</p>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading dashboard</p>
          <Button onClick={() => dispatch(fetchDashboardData())}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout
      tabs={tabs}
      onTabChange={setActiveTab}
    >
      <div className="space-y-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Active Members"
            value={dashboardData?.statistics?.members?.toString() || '245'}
            trend={{ value: 12, direction: 'up', label: '+12' }}
            icon={<UsersIcon className="w-6 h-6" />}
          />
          <StatCard
            title="Events This Month"
            value={dashboardData?.statistics?.eventsThisMonth?.toString() || '8'}
            trend={{ value: 2, direction: 'up', label: '+2' }}
            icon={<CalendarIcon className="w-6 h-6" />}
          />
          <StatCard
            title="Courts"
            value={dashboardData?.statistics?.courts?.toString() || '6'}
            trend={{ value: 0, direction: 'up', label: '0' }}
            icon={<MapIcon className="w-6 h-6" />}
          />
          <StatCard
            title="Monthly Revenue"
            value="$45,200"
            trend={{ value: 18, direction: 'up', label: '+18%' }}
            icon={<CurrencyDollarIcon className="w-6 h-6" />}
          />
        </div>

        {/* Main Content with Tabs */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b border-gray-200">
            <Tabs
              items={tabs}
              activeTab={activeTab}
              onChange={setActiveTab}
              variant="underline"
            />
          </div>
          
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClubDashboard;