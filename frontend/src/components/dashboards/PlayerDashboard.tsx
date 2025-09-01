import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/store';
import { selectUser } from '@/store/authSlice';
import EnhancedDashboardLayout from '@/components/dashboard/EnhancedDashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import apiService from '@/services/api';
import { notificationService } from '../../services/notificationService';
import { 
  TrophyIcon, 
  ChartBarIcon,
  StarIcon,
  MapPinIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

interface PlayerDashboardData {
  ranking?: {
    position: number;
    change?: number;
  };
  statistics: {
    matchesPlayed: number;
    winRate: number;
    upcomingMatches: number;
    activeTournaments: number;
    courtReservations: number;
    membershipStatus: string;
  };
  recentActivity?: Array<{
    type: string;
    description: string;
    date: string;
  }>;
  upcomingTournaments?: Array<{
    id: number;
    name: string;
    location: string;
    date: string;
    status: string;
  }>;
  notifications?: {
    unread: number;
  };
}

const PlayerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<PlayerDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const connectionStatus = 'connected';

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Initialize notification service
        if (user) {
          const token = localStorage.getItem('auth_token');
          if (token) {
            notificationService.init(user.id, token);
          }
        }

        // Fetch real dashboard data from backend
        const response = await apiService.get<PlayerDashboardData>('/dashboard/player');
        setDashboardData(response);
      } catch (error: any) {
        console.error('Failed to fetch dashboard data:', error);
        setError(error.message || 'Failed to load dashboard data');
        
        // Fallback to basic user data if API fails
        if (user?.profile) {
          setDashboardData({
            statistics: {
              matchesPlayed: 0,
              winRate: 0,
              upcomingMatches: 0,
              activeTournaments: 0,
              courtReservations: 0,
              membershipStatus: 'active'
            }
          });
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }

    return () => {
      // Cleanup on unmount
      // notificationService.disconnect(); // Don't disconnect here to keep notifications working across pages
    };
  }, [user]);

  const renderQuickActions = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/profile')}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <UserGroupIcon className="h-8 w-8 text-blue-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">Update Profile</h3>
            <p className="text-sm text-gray-500">Manage your player information</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/tournaments')}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <TrophyIcon className="h-8 w-8 text-purple-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">Find Tournaments</h3>
            <p className="text-sm text-gray-500">Register for competitions</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/courts')}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <MapPinIcon className="h-8 w-8 text-green-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">Find Courts</h3>
            <p className="text-sm text-gray-500">Locate nearby facilities</p>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderRecentActivity = () => (
    <Card>
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <TrophyIcon className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Registered for Mexico National Championship</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <StarIcon className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">NRTP level updated to 4.0</p>
              <p className="text-xs text-gray-500">1 day ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <MapPinIcon className="h-4 w-4 text-purple-600" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Checked in at Club Deportivo Mexicali</p>
              <p className="text-xs text-gray-500">3 days ago</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <Button variant="secondary" onClick={() => navigate('/activity')} className="w-full">
            View All Activity
          </Button>
        </div>
      </div>
    </Card>
  );

  const renderUpcomingEvents = () => (
    <Card>
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Upcoming Events</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Mexico National Championship</h4>
                <p className="text-sm text-gray-500">Cancún, Quintana Roo</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-blue-600">Mar 15-17</p>
                <p className="text-xs text-gray-500">3 days</p>
              </div>
            </div>
          </div>
          
          <div className="border-l-4 border-green-500 pl-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Weekly Training Session</h4>
                <p className="text-sm text-gray-500">Club Deportivo Mexicali</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-600">Tomorrow</p>
                <p className="text-xs text-gray-500">7:00 PM</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <Button variant="secondary" onClick={() => navigate('/events')} className="w-full">
            View All Events
          </Button>
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <EnhancedDashboardLayout>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </Card>
            ))}
          </div>
          <Card loading>
            <div className="h-32"></div>
          </Card>
        </div>
      </EnhancedDashboardLayout>
    );
  }

  const actionButtons = (
    <div className="flex space-x-3">
      <Button 
        variant="primary" 
        onClick={() => navigate('/profile')}
      >
        Edit Profile
      </Button>
      <Button 
        variant="secondary" 
        onClick={() => navigate('/credentials')}
      >
        Download Credential
      </Button>
    </div>
  );

  return (
    <EnhancedDashboardLayout 
      title="Player Dashboard"
      actions={actionButtons}
    >
      <div className="space-y-8">
        {/* Statistics Cards */}
        {/* Welcome Section with Real User Data */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg shadow-sm p-6 text-white mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                Welcome back, {(user?.profile as any)?.fullName || user?.username}!
              </h1>
              <p className="mt-1 text-cyan-100">
                Ready to play some pickleball today?
              </p>
              {error && (
                <p className="mt-2 text-sm text-yellow-200 bg-black bg-opacity-20 px-3 py-1 rounded">
                  ⚠️ Using cached data - {error}
                </p>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">NRTP Level</div>
              <div className="text-3xl font-bold">
                {(user?.profile as any)?.nrtpLevel || 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards with Real Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Current Ranking"
            value={`#${dashboardData?.ranking?.position || (user?.profile as any)?.rankingPosition || 'N/A'}`}
            subtitle={dashboardData?.ranking?.change ? 
              `${dashboardData.ranking.change > 0 ? '+' : ''}${dashboardData.ranking.change} this month` : 
              'No change this month'
            }
            color="yellow"
            icon={<TrophyIcon className="w-8 h-8" />}
            trend={dashboardData?.ranking?.change}
          />
          
          <StatCard
            title="Matches Played"
            value={dashboardData?.statistics?.matchesPlayed?.toString() || '0'}
            subtitle="This season"
            color="green"
            icon={<ChartBarIcon className="w-8 h-8" />}
          />
          
          <StatCard
            title="Win Rate"
            value={`${dashboardData?.statistics?.winRate || 0}%`}
            subtitle="Overall performance"
            color="red"
            icon={<StarIcon className="w-8 h-8" />}
          />
          
          <StatCard
            title="Upcoming Matches"
            value={dashboardData?.statistics?.upcomingMatches?.toString() || '0'}
            subtitle="Next 7 days"
            color="blue"
            icon={<MapPinIcon className="w-8 h-8" />}
          />
        </div>

        {/* Connection Status Indicator */}
        {connectionStatus !== 'connected' && (
          <div className={`p-3 rounded-lg text-sm ${
            connectionStatus === 'connecting' 
              ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {connectionStatus === 'connecting' ? 'Connecting to real-time updates...' : 'Real-time updates unavailable'}
          </div>
        )}

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          {renderQuickActions()}
        </div>

        {/* Player Finder Widget */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Player Connections</h2>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <UserGroupIcon className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Player Finder</h3>
                  <p className="text-sm text-gray-500">Find players in your area</p>
                </div>
              </div>
              <Button 
                variant="primary" 
                onClick={() => navigate('/dashboard/player-finder')}
              >
                Find Players
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">5</div>
                <div className="text-sm text-gray-500">Active Requests</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">12</div>
                <div className="text-sm text-gray-500">Potential Matches</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Legacy Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div>
            {renderRecentActivity()}
          </div>

          {/* Upcoming Events */}
          <div>
            {renderUpcomingEvents()}
          </div>
        </div>

        {/* Player Performance Section */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Player Performance</h3>
              <Button variant="secondary" size="sm" onClick={() => navigate('/statistics')}>
                View Details
              </Button>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">87%</div>
                <div className="text-sm text-gray-500">Win Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">24</div>
                <div className="text-sm text-gray-500">Matches Played</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">1,247</div>
                <div className="text-sm text-gray-500">Ranking Points</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </EnhancedDashboardLayout>
  );
};

export default PlayerDashboard;