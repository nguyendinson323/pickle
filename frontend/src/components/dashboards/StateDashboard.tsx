import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../store';
import StatCard from '../dashboard/StatCard';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import LoadingSpinner from '../common/LoadingSpinner';
import {
  FlagIcon,
  CogIcon,
  InboxIcon,
  BuildingOfficeIcon,
  TrophyIcon,
  UserGroupIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const StateDashboard: React.FC = () => {
  const { user } = useAppSelector(state => state.auth);
  const [loading, setLoading] = useState(false);
  const [error] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data since slices don't exist
  const dashboardData = {
    user: user || {
      firstName: 'State',
      lastName: 'de México'
    },
    statistics: {
      registeredClubs: 28,
      registeredPlayers: 1240,
      stateTournaments: 12,
      certifiedCoaches: 45
    }
  };
  const unreadCount = 0;

  useEffect(() => {
    // Mock loading effect
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const tabs = [
    {
      id: 'overview',
      label: 'State Overview',
      icon: <FlagIcon className="w-4 h-4" />,
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
      id: 'clubs',
      label: 'Clubs',
      icon: <BuildingOfficeIcon className="w-4 h-4" />,
      count: dashboardData?.statistics?.registeredClubs || 0
    },
    {
      id: 'tournaments',
      label: 'Tournaments',
      icon: <TrophyIcon className="w-4 h-4" />,
      count: dashboardData?.statistics?.stateTournaments || 0
    },
    {
      id: 'players',
      label: 'Players',
      icon: <UserGroupIcon className="w-4 h-4" />,
      count: dashboardData?.statistics?.registeredPlayers || 0
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <DocumentTextIcon className="w-4 h-4" />,
      count: 0
    }
  ];

  const renderOverviewTab = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">State Committee</h3>
              <p className="text-red-100 mb-4">
                State of Mexico
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-red-200">Code:</span>
                  <span className="ml-2 font-medium">MEX</span>
                </div>
                <div>
                  <span className="text-red-200">Region:</span>
                  <span className="ml-2 font-medium">Central</span>
                </div>
                <div>
                  <span className="text-red-200">Established:</span>
                  <span className="ml-2 font-medium">2019</span>
                </div>
                <div>
                  <span className="text-red-200">Status:</span>
                  <span className="ml-2 font-medium">Active</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="w-20 h-20 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <FlagIcon className="w-10 h-10 text-white" />
              </div>
              <Button variant="ghost" size="sm" className="text-white border-white/30">
                View Certificate
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <div className="p-6">
            <h4 className="font-semibold text-gray-900 mb-4">State Development</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Registered Clubs</span>
                <span className="font-medium">{dashboardData?.statistics?.registeredClubs || 28}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Active Players</span>
                <span className="font-medium">{dashboardData?.statistics?.registeredPlayers || 1240}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Coaches</span>
                <span className="font-medium">{dashboardData?.statistics?.certifiedCoaches || 45}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Recent Activity</h4>
            <div className="space-y-2">
              <div className="text-xs text-gray-500 bg-green-50 p-2 rounded">
                New club registered: Toluca Sports Club
              </div>
              <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
                State tournament scheduled for May
              </div>
              <div className="text-xs text-gray-500 bg-yellow-50 p-2 rounded">
                15 new players certified
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h4 className="font-semibold text-gray-900 mb-4">2024 Goals</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>New Clubs</span>
                  <span>28/35</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Players</span>
                  <span>1240/1500</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '83%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderClubsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Registered Clubs</h3>
        <Button variant="primary">
          <BuildingOfficeIcon className="w-4 h-4 mr-2" />
          Register Club
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Toluca Sports Club', city: 'Toluca', members: 45, status: 'active' },
          { name: 'Pickleball Naucalpan', city: 'Naucalpan', members: 67, status: 'active' },
          { name: 'Club Satélite', city: 'Ciudad Satélite', members: 38, status: 'active' },
          { name: 'Texcoco Sports Club', city: 'Texcoco', members: 29, status: 'pending' },
          { name: 'Club Valle de Bravo', city: 'Valle de Bravo', members: 52, status: 'active' },
          { name: 'Pickleball Ecatepec', city: 'Ecatepec', members: 41, status: 'active' }
        ].map((club, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-medium text-gray-900">{club.name}</h4>
                  <p className="text-sm text-gray-500">{club.city}</p>
                </div>
                <Badge 
                  variant={club.status === 'active' ? 'success' : 'warning'}
                >
                  {club.status === 'active' ? 'Active' : 'Pending'}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex justify-between">
                  <span>Members:</span>
                  <span className="font-medium">{club.members}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last update:</span>
                  <span className="font-medium">{Math.floor(Math.random() * 10) + 1} days ago</span>
                </div>
              </div>
              
              <Button variant="secondary" size="sm" className="w-full">
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderTournamentsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">State Tournaments</h3>
        <Button variant="primary">
          <TrophyIcon className="w-4 h-4 mr-2" />
          New Tournament
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { 
            name: 'State Championship 2024',
            date: '15-17 Jun 2024',
            location: 'Toluca',
            participants: 128,
            status: 'upcoming'
          },
          { 
            name: 'North Regional League',
            date: '2-4 Ago 2024',
            location: 'Naucalpan',
            participants: 64,
            status: 'registration'
          },
          { 
            name: 'State Youth Tournament',
            date: '5-7 Jul 2024',
            location: 'Texcoco',
            participants: 32,
            status: 'planning'
          },
          { 
            name: 'State of Mexico Cup',
            date: '10-12 Mar 2024',
            location: 'Valle de Bravo',
            participants: 96,
            status: 'completed'
          }
        ].map((tournament, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-medium text-gray-900">{tournament.name}</h4>
                <Badge 
                  variant={
                    tournament.status === 'upcoming' ? 'primary' :
                    tournament.status === 'registration' ? 'warning' :
                    tournament.status === 'planning' ? 'secondary' :
                    'success'
                  }
                >
                  {tournament.status === 'upcoming' ? 'Upcoming' :
                   tournament.status === 'registration' ? 'Registration' :
                   tournament.status === 'planning' ? 'Planning' :
                   'Completed'}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-medium">{tournament.date}</span>
                </div>
                <div className="flex justify-between">
                  <span>Venue:</span>
                  <span className="font-medium">{tournament.location}</span>
                </div>
                <div className="flex justify-between">
                  <span>Participants:</span>
                  <span className="font-medium">{tournament.participants}</span>
                </div>
              </div>
              
              <Button variant="secondary" size="sm" className="w-full">
                Manage
              </Button>
            </div>
          </Card>
        ))}
      </div>
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">Account Settings</h3>
            <p className="text-gray-500">Manage state committee information.</p>
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
      case 'clubs':
        return renderClubsTab();
      case 'tournaments':
        return renderTournamentsTab();
      case 'players':
        return (
          <div className="text-center py-12">
            <UserGroupIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Registered Players</h3>
            <p className="text-gray-500">State players database.</p>
          </div>
        );
      case 'reports':
        return (
          <div className="text-center py-12">
            <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">State Reports</h3>
            <p className="text-gray-500">Generate state reports and statistics.</p>
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
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            State Panel
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome to the state management system
          </p>
        </div>
        <div className="space-y-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Registered Clubs"
            value={dashboardData?.statistics?.registeredClubs?.toString() || '28'}
            icon={<BuildingOfficeIcon className="w-6 h-6" />}
            trend={{ direction: 'up', value: 4, label: 'this month' }}
            color="blue"
          />
          <StatCard
            title="Active Players"
            value={dashboardData?.statistics?.registeredPlayers?.toString() || '1,240'}
            icon={<UserGroupIcon className="w-6 h-6" />}
            trend={{ direction: 'up', value: 85, label: 'this month' }}
            color="green"
          />
          <StatCard
            title="Annual Tournaments"
            value={dashboardData?.statistics?.stateTournaments?.toString() || '12'}
            icon={<TrophyIcon className="w-6 h-6" />}
            trend={{ direction: 'up', value: 3, label: 'this month' }}
            color="purple"
          />
          <StatCard
            title="Coaches"
            value={dashboardData?.statistics?.certifiedCoaches?.toString() || '45'}
            icon={<UserGroupIcon className="w-6 h-6" />}
            trend={{ direction: 'up', value: 7, label: 'this month' }}
            color="yellow"
          />
        </div>

        {/* Main Content with Tabs */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2
                    ${activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100 text-gray-900">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default StateDashboard;