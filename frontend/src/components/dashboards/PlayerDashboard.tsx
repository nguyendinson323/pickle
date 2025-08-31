import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { 
  fetchDashboardData, 
  setActiveTab, 
  selectDashboardData, 
  selectDashboardLoading, 
  selectActiveTab,
  selectDashboardStatistics,
  selectQuickActions,
  selectRecentActivity
} from '@/store/dashboardSlice';
import { fetchUnreadCount } from '@/store/messageSlice';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { TabItem } from '@/components/ui/Tabs';

const PlayerDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  // const dashboardData = useAppSelector(selectDashboardData);
  const loading = useAppSelector(selectDashboardLoading);
  const activeTab = useAppSelector(selectActiveTab);
  const statistics = useAppSelector(selectDashboardStatistics);
  // const quickActions = useAppSelector(selectQuickActions);
  // const recentActivity = useAppSelector(selectRecentActivity);

  useEffect(() => {
    dispatch(fetchDashboardData());
    dispatch(fetchUnreadCount());
  }, [dispatch]);

  const tabs: TabItem[] = [
    {
      id: 'credential',
      label: 'Credential',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-4 0a2 2 0 014 0z" />
        </svg>
      )
    },
    {
      id: 'account',
      label: 'Account',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      id: 'inbox',
      label: 'Messages',
      badge: 3,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'connection',
      label: 'Connection',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      id: 'tournaments',
      label: 'Tournaments',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      )
    },
    {
      id: 'courts',
      label: 'Courts',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <StatCard key={i} title="" value="" loading />
            ))}
          </div>
          <Card loading>
            <div></div>
          </Card>
        </div>
      );
    }

    switch (activeTab) {
      case 'credential':
        return (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Active Tournaments"
                value={statistics?.activeTournaments || 0}
                color="blue"
                icon={
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                }
              />
              
              <StatCard
                title="Court Reservations"
                value={statistics?.courtReservations || 0}
                color="green"
                icon={
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                }
              />
              
              <StatCard
                title="Membership Status"
                value={statistics?.membershipStatus === 'active' ? 'Active' : 'Inactive'}
                color={statistics?.membershipStatus === 'active' ? 'green' : 'red'}
                icon={
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              
              <StatCard
                title="Next Renewal"
                value={statistics?.nextRenewal ? new Date(statistics.nextRenewal).toLocaleDateString() : 'N/A'}
                color="purple"
                icon={
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                }
              />
            </div>

            {/* Digital Credential */}
            <Card>
              <div className="text-center py-8">
                <div className="mx-auto w-32 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow-lg mb-6 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">ID</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Digital Player Credential
                </h3>
                <p className="text-gray-600 mb-4">
                  Your official identification as a federated player
                </p>
                <Button variant="primary">
                  Download Credential
                </Button>
              </div>
            </Card>
          </div>
        );

      case 'account':
        return (
          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Personal Information
              </h3>
              <p className="text-gray-600">
                Manage your personal information and account settings.
              </p>
              <div className="mt-4">
                <Button variant="primary">
                  Edit Profile
                </Button>
              </div>
            </Card>
          </div>
        );

      case 'inbox':
        return (
          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Messages and Communications
              </h3>
              <p className="text-gray-600 mb-4">
                Stay connected with the federation and other players.
              </p>
              <Button variant="primary">
                View All Messages
              </Button>
            </Card>
          </div>
        );

      case 'connection':
        return (
          <div className="space-y-6">
            <Card>
              <div className="text-center py-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Player Finder
                </h3>
                <p className="text-gray-600 mb-4">
                  Connect with other players in your skill level and area
                </p>
                <Badge variant="warning" className="mb-4">
                  Premium Feature
                </Badge>
                <div>
                  <Button variant="primary">
                    Activate Premium
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        );

      case 'tournaments':
        return (
          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Available Tournaments
              </h3>
              <p className="text-gray-600 mb-4">
                Find and register for official tournaments.
              </p>
              <Button variant="primary">
                Explore Tournaments
              </Button>
            </Card>
          </div>
        );

      default:
        return (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {tabs.find(t => t.id === activeTab)?.label}
            </h3>
            <p className="text-gray-600">
              {tabs.find(t => t.id === activeTab)?.label} content will be available soon.
            </p>
          </Card>
        );
    }
  };

  return (
    <DashboardLayout
      tabs={tabs}
      onTabChange={(tabId) => dispatch(setActiveTab(tabId))}
    >
      {renderTabContent()}
    </DashboardLayout>
  );
};

export default PlayerDashboard;