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
  ShieldCheckIcon,
  CogIcon,
  InboxIcon,
  UserGroupIcon,
  ChartBarIcon,
  ServerIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const AdminDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const dashboardData = useAppSelector(selectDashboardData);
  const loading = useAppSelector(selectDashboardLoading);
  const error = useAppSelector(selectDashboardError);
  // const messages = useAppSelector(selectMessages); // Unused for now
  const unreadCount = useAppSelector(selectUnreadCount);
  
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    dispatch(fetchDashboardData());
    dispatch(fetchMessages({ page: 1, limit: 10 }));
  }, [dispatch]);

  const tabs = [
    {
      id: 'overview',
      label: 'General Overview',
      icon: <ShieldCheckIcon className="w-4 h-4" />,
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
      id: 'users',
      label: 'Users',
      icon: <UserGroupIcon className="w-4 h-4" />,
      count: dashboardData?.statistics?.totalUsers || 0
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <ChartBarIcon className="w-4 h-4" />,
      count: 0
    },
    {
      id: 'system',
      label: 'System',
      icon: <ServerIcon className="w-4 h-4" />,
      count: 0
    },
    {
      id: 'issues',
      label: 'Issues',
      icon: <ExclamationTriangleIcon className="w-4 h-4" />,
      count: dashboardData?.statistics?.openIssues || 0
    }
  ];

  const renderOverviewTab = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Administration Panel</h3>
              <p className="text-indigo-100 mb-4">
                Mexican Pickleball Federation
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-indigo-200">Administrator:</span>
                  <span className="ml-2 font-medium">{dashboardData?.user?.username || 'Admin'}</span>
                </div>
                <div>
                  <span className="text-indigo-200">Level:</span>
                  <span className="ml-2 font-medium">Super Admin</span>
                </div>
                <div>
                  <span className="text-indigo-200">Last access:</span>
                  <span className="ml-2 font-medium">Today</span>
                </div>
                <div>
                  <span className="text-indigo-200">Status:</span>
                  <span className="ml-2 font-medium">Connected</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="w-20 h-20 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <ShieldCheckIcon className="w-10 h-10 text-white" />
              </div>
              <Button variant="ghost" size="sm" className="text-white border-white/30">
                Configure
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="p-6">
            <h4 className="font-semibold text-gray-900 mb-4">System Status</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">API</span>
                <Badge variant="success">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Database</span>
                <Badge variant="success">Connected</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Services</span>
                <Badge variant="success">Active</Badge>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Recent Activity</h4>
            <div className="space-y-2">
              <div className="text-xs text-gray-500 bg-green-50 p-2 rounded">
                25 new users registered
              </div>
              <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
                12 clubs verified
              </div>
              <div className="text-xs text-gray-500 bg-yellow-50 p-2 rounded">
                3 pending reports
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h4 className="font-semibold text-gray-900 mb-4">National Statistics</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Active States</span>
                <span className="font-medium">32/32</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Total Clubs</span>
                <span className="font-medium">{dashboardData?.statistics?.totalClubs || 245}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Players</span>
                <span className="font-medium">{dashboardData?.statistics?.totalPlayers || 12500}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Pending Tasks</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Verifications</span>
                <span className="font-medium text-orange-600">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Reports</span>
                <span className="font-medium text-red-600">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Updates</span>
                <span className="font-medium text-blue-600">2</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderUsersTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">User Management</h3>
        <div className="flex space-x-2">
          <Button variant="outline">Export</Button>
          <Button variant="primary">
            <UserGroupIcon className="w-4 h-4 mr-2" />
            Create User
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {dashboardData?.statistics?.totalUsers || 2450}
            </div>
            <div className="text-sm text-gray-500">Total Users</div>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {dashboardData?.statistics?.totalPlayers || 1850}
            </div>
            <div className="text-sm text-gray-500">Players</div>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {dashboardData?.statistics?.totalCoaches || 180}
            </div>
            <div className="text-sm text-gray-500">Coaches</div>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {dashboardData?.statistics?.totalClubs || 245}
            </div>
            <div className="text-sm text-gray-500">Clubs</div>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {dashboardData?.statistics?.totalPartners || 45}
            </div>
            <div className="text-sm text-gray-500">Partners</div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Recent Users</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  { name: 'Juan Pérez', type: 'Player', status: 'Active', date: '2024-03-15' },
                  { name: 'Sports Club', type: 'Club', status: 'Verified', date: '2024-03-14' },
                  { name: 'María González', type: 'Coach', status: 'Pending', date: '2024-03-13' },
                  { name: 'Empresa XYZ', type: 'Partner', status: 'Active', date: '2024-03-12' },
                  { name: 'Carlos López', type: 'Player', status: 'Active', date: '2024-03-11' }
                ].map((user, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                          <UserGroupIcon className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{user.type}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge 
                        variant={
                          user.status === 'Active' || user.status === 'Verified' ? 'success' :
                          user.status === 'Pending' ? 'warning' : 'secondary'
                        }
                      >
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button variant="outline" size="sm">View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'account':
        return (
          <div className="text-center py-12">
            <CogIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Administrator Settings</h3>
            <p className="text-gray-500">Advanced system configuration and permissions.</p>
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
      case 'users':
        return renderUsersTab();
      case 'analytics':
        return (
          <div className="text-center py-12">
            <ChartBarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">System Analytics</h3>
            <p className="text-gray-500">Detailed reports and statistics.</p>
          </div>
        );
      case 'system':
        return (
          <div className="text-center py-12">
            <ServerIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">System Administration</h3>
            <p className="text-gray-500">Server configuration and maintenance.</p>
          </div>
        );
      case 'issues':
        return (
          <div className="text-center py-12">
            <ExclamationTriangleIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Issue Management</h3>
            <p className="text-gray-500">Problem reports and support tickets.</p>
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
            title="Total Users"
            value={dashboardData?.statistics?.totalUsers?.toString() || '2,450'}
            trend={{ value: 125, direction: 'up', label: '+125' }}
            icon={<UserGroupIcon className="w-6 h-6" />}
          />
          <StatCard
            title="Active Clubs"
            value={dashboardData?.statistics?.totalClubs?.toString() || '245'}
            trend={{ value: 8, direction: 'up', label: '+8' }}
            icon={<ShieldCheckIcon className="w-6 h-6" />}
          />
          <StatCard
            title="States Covered"
            value="32"
            trend={{ value: 0, direction: 'up', label: '0' }}
            icon={<ChartBarIcon className="w-6 h-6" />}
          />
          <StatCard
            title="Open Issues"
            value={dashboardData?.statistics?.openIssues?.toString() || '3'}
            trend={{ value: 2, direction: 'down', label: '-2' }}
            icon={<ExclamationTriangleIcon className="w-6 h-6" />}
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

export default AdminDashboard;