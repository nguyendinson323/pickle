import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '@/store';
import { selectUser } from '@/store/authSlice';
import EnhancedDashboardLayout from '@/components/dashboard/EnhancedDashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import QuickActionButton from '@/components/dashboard/QuickActionButton';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import apiService from '@/services/api';
import { 
  TrophyIcon, 
  ChartBarIcon,
  FireIcon,
  CalendarIcon,
  CheckBadgeIcon,
  ArrowRightIcon,
  UsersIcon,
  InboxIcon
} from '@heroicons/react/24/outline';

interface PlayerDashboardData {
  ranking?: {
    position: number;
    change: number;
  };
  statistics?: {
    matchesPlayed: number;
    winRate: number;
    upcomingMatches: number;
  };
  recentActivity?: Array<{
    type: string;
    description: string;
    date: string;
  }>;
  upcomingTournaments?: Array<{
    id: string;
    name: string;
    location: string;
    date: string;
    status: string;
  }>;
  notifications?: {
    unread: number;
  };
}

const EnhancedPlayerDashboard: React.FC = () => {
  const user = useAppSelector(selectUser);
  const [dashboardData, setDashboardData] = useState<PlayerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await apiService.get<PlayerDashboardData>('/dashboard/player');
        setDashboardData((response as any).data || response);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Set fallback data for demo
        setDashboardData({
          ranking: { position: 15, change: 2 },
          statistics: { matchesPlayed: 12, winRate: 75, upcomingMatches: 3 },
          recentActivity: [
            { type: 'match', description: 'Won match against Carlos M.', date: '2 days ago' },
            { type: 'tournament', description: 'Registered for State Championship', date: '5 days ago' },
            { type: 'ranking', description: 'Moved up 2 positions in ranking', date: '1 week ago' }
          ],
          upcomingTournaments: [
            { id: '1', name: 'State Championship', location: 'Mexico City', date: '2024-12-15', status: 'registered' },
            { id: '2', name: 'Club Tournament', location: 'Local Club', date: '2024-12-22', status: 'open' }
          ],
          notifications: { unread: 2 }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <EnhancedDashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      </EnhancedDashboardLayout>
    );
  }

  return (
    <EnhancedDashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                Welcome back, {(user?.profile as any)?.fullName || user?.username}!
              </h1>
              <p className="mt-1 text-cyan-100">
                Ready to play some pickleball today?
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">NRTP Level</div>
              <div className="text-3xl font-bold">
                {(user?.profile as any)?.nrtpLevel || 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Current Ranking"
            value={`#${dashboardData?.ranking?.position || 'N/A'}`}
            subtitle={dashboardData?.ranking?.change ? 
              `${dashboardData.ranking.change > 0 ? '+' : ''}${dashboardData.ranking.change} this month` : 
              'No change'
            }
            icon={<TrophyIcon className="h-8 w-8" />}
            color="yellow"
            trend={dashboardData?.ranking?.change}
          />
          
          <StatCard
            title="Matches Played"
            value={dashboardData?.statistics?.matchesPlayed.toString() || '0'}
            subtitle="This season"
            icon={<ChartBarIcon className="h-8 w-8" />}
            color="green"
          />
          
          <StatCard
            title="Win Rate"
            value={`${dashboardData?.statistics?.winRate || 0}%`}
            subtitle="Overall performance"
            icon={<FireIcon className="h-8 w-8" />}
            color="red"
          />
          
          <StatCard
            title="Upcoming Matches"
            value={dashboardData?.statistics?.upcomingMatches.toString() || '0'}
            subtitle="Next 7 days"
            icon={<CalendarIcon className="h-8 w-8" />}
            color="blue"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Digital Credential Preview */}
          <Card title="My Digital Credential" className="h-fit">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckBadgeIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Official Player Credential
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                View and download your official federation credential with QR code
              </p>
              <Link
                to="/profile"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <span>View Credential</span>
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card title="Recent Activity">
            <div className="space-y-4">
              {dashboardData?.recentActivity?.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'match' ? 'bg-green-400' :
                    activity.type === 'tournament' ? 'bg-blue-400' :
                    activity.type === 'ranking' ? 'bg-yellow-400' : 'bg-gray-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.date}</p>
                  </div>
                </div>
              )) || (
                <p className="text-sm text-gray-500 text-center py-4">
                  No recent activity
                </p>
              )}
            </div>
          </Card>

          {/* Upcoming Tournaments */}
          <Card title="Upcoming Tournaments">
            <div className="space-y-3">
              {dashboardData?.upcomingTournaments?.map((tournament) => (
                <div key={tournament.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{tournament.name}</h4>
                      <p className="text-sm text-gray-600">{tournament.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(tournament.date).toLocaleDateString()}
                      </p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        tournament.status === 'registered' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {tournament.status}
                      </span>
                    </div>
                  </div>
                  {tournament.status === 'open' && (
                    <button className="mt-2 text-sm text-primary-600 hover:text-primary-800">
                      Register Now →
                    </button>
                  )}
                </div>
              )) || (
                <p className="text-sm text-gray-500 text-center py-4">
                  No upcoming tournaments
                </p>
              )}
            </div>
          </Card>

          {/* Player Connection */}
          <Card title="Find Players">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <UsersIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Connect with Other Players
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Find players in your area or when traveling to play matches
              </p>
              <Link
                to="/player/connection"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <span>Find Players</span>
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card title="Quick Actions">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickActionButton
              icon={<CalendarIcon className="h-6 w-6" />}
              title="Book Court"
              subtitle="Reserve playing time"
              href="/courts"
            />
            <QuickActionButton
              icon={<TrophyIcon className="h-6 w-6" />}
              title="Join Tournament"
              subtitle="Register for events"
              href="/tournaments"
            />
            <QuickActionButton
              icon={<ChartBarIcon className="h-6 w-6" />}
              title="View Rankings"
              subtitle="See your position"
              href="/rankings"
            />
            <QuickActionButton
              icon={<InboxIcon className="h-6 w-6" />}
              title="Messages"
              subtitle="Check your inbox"
              href="/messages"
              badge={dashboardData?.notifications?.unread}
            />
          </div>
        </Card>
      </div>
    </EnhancedDashboardLayout>
  );
};

export default EnhancedPlayerDashboard;