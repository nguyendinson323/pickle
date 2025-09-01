import React, { useState, useEffect } from 'react';
import { useAppSelector } from '@/store';
import { selectUser } from '@/store/authSlice';
import EnhancedDashboardLayout from '@/components/dashboard/EnhancedDashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import CreateRequestModal from './CreateRequestModal';
import LocationManager from './LocationManager';
import MatchesList from './MatchesList';
import ActiveRequestsList from './ActiveRequestsList';
import apiService from '@/services/api';
import {
  MapPinIcon,
  UserGroupIcon,
  ClockIcon,
  CheckBadgeIcon,
  PlusIcon,
  Cog6ToothIcon,
  HeartIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

interface PlayerFinderMatch {
  id: number;
  requestId: number;
  matchedUserId: number;
  distance: number;
  compatibilityScore: number;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  responseMessage?: string;
  matchedAt: string;
  respondedAt?: string;
  contactShared: boolean;
  matchedUser?: {
    id: number;
    username: string;
    email: string;
    profile?: {
      firstName: string;
      lastName: string;
      profilePhotoUrl?: string;
      nrtpLevel: string;
    };
  };
}

interface PlayerFinderRequest {
  id: number;
  requesterId: number;
  locationId: number;
  nrtpLevelMin?: string;
  nrtpLevelMax?: string;
  preferredGender?: 'male' | 'female' | 'any';
  preferredAgeMin?: number;
  preferredAgeMax?: number;
  searchRadius: number;
  availableTimeSlots: any[];
  message?: string;
  isActive: boolean;
  expiresAt: string;
  createdAt: string;
  location?: {
    id: number;
    city: string;
    state: string;
    locationName?: string;
  };
}

const PlayerFinderPage: React.FC = () => {
  const user = useAppSelector(selectUser);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'matches' | 'locations' | 'requests'>('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [matches, setMatches] = useState<PlayerFinderMatch[]>([]);
  const [sentMatches, setSentMatches] = useState<PlayerFinderMatch[]>([]);
  const [activeRequests, setActiveRequests] = useState<PlayerFinderRequest[]>([]);
  const [stats, setStats] = useState({
    totalMatches: 0,
    pendingMatches: 0,
    acceptedMatches: 0,
    activeRequests: 0,
  });

  useEffect(() => {
    if (user?.role === 'player') {
      fetchPlayerFinderData();
    }
  }, [user]);

  const fetchPlayerFinderData = async () => {
    setLoading(true);
    try {
      // Fetch user matches (where they were matched with others)
      const matchesResponse = await apiService.get('/api/player-finder/matches');
      const userMatches = matchesResponse.data?.data || [];

      // Fetch user requests (their active requests)  
      const requestsResponse = await apiService.get('/api/player-finder/requests');
      const userRequests = requestsResponse.data?.data || [];

      // Separate received matches (matches for others' requests) and sent matches (matches for user's requests)
      const receivedMatches = userMatches;
      const sentMatchesData = userRequests.flatMap((req: any) => req.matches || []);
      const requestsData = userRequests;

      setMatches(receivedMatches);
      setSentMatches(sentMatchesData);
      setActiveRequests(requestsData);

      // Calculate stats
      setStats({
        totalMatches: receivedMatches.length + sentMatchesData.length,
        pendingMatches: receivedMatches.filter((m: PlayerFinderMatch) => m.status === 'pending').length,
        acceptedMatches: receivedMatches.filter((m: PlayerFinderMatch) => m.status === 'accepted').length,
        activeRequests: requestsData.length,
      });
    } catch (error) {
      console.error('Failed to fetch player finder data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = () => {
    setShowCreateModal(true);
  };

  const handleRequestCreated = () => {
    setShowCreateModal(false);
    fetchPlayerFinderData();
  };

  const handleRespondToMatch = async (matchId: number, response: 'accepted' | 'declined', message?: string) => {
    try {
      await apiService.post(`/api/player-finder/matches/${matchId}/respond`, {
        response,
        message,
      });
      await fetchPlayerFinderData();
    } catch (error) {
      console.error('Failed to respond to match:', error);
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <SparklesIcon className="h-12 w-12 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Find Your Perfect Playing Partner</h2>
              <p className="text-gray-600 mt-1">
                Connect with players near you based on skill level, location, and availability.
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <Button
              variant="primary"
              onClick={handleCreateRequest}
              className="inline-flex items-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Create New Request</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 text-center hover:shadow-md transition-shadow">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-lg">
            <UserGroupIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalMatches}</div>
          <div className="text-sm text-gray-500">Total Matches</div>
        </Card>

        <Card className="p-6 text-center hover:shadow-md transition-shadow">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-yellow-100 rounded-lg">
            <ClockIcon className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.pendingMatches}</div>
          <div className="text-sm text-gray-500">Pending Responses</div>
        </Card>

        <Card className="p-6 text-center hover:shadow-md transition-shadow">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-green-100 rounded-lg">
            <CheckBadgeIcon className="h-6 w-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.acceptedMatches}</div>
          <div className="text-sm text-gray-500">Accepted Matches</div>
        </Card>

        <Card className="p-6 text-center hover:shadow-md transition-shadow">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-purple-100 rounded-lg">
            <HeartIcon className="h-6 w-6 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.activeRequests}</div>
          <div className="text-sm text-gray-500">Active Requests</div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Matches</h3>
          </div>
          <div className="p-6">
            {matches.slice(0, 3).length > 0 ? (
              <div className="space-y-4">
                {matches.slice(0, 3).map((match) => (
                  <div key={match.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <UserGroupIcon className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {match.matchedUser?.profile?.firstName} {match.matchedUser?.profile?.lastName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {match.compatibilityScore}% compatibility " {match.distance.toFixed(1)}km away
                      </p>
                    </div>
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      match.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      match.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {match.status}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No matches yet. Create a request to get started!</p>
            )}
            
            {matches.length > 3 && (
              <div className="mt-4 text-center">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setActiveTab('matches')}
                >
                  View All Matches
                </Button>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Active Requests</h3>
          </div>
          <div className="p-6">
            {activeRequests.length > 0 ? (
              <div className="space-y-4">
                {activeRequests.slice(0, 3).map((request) => (
                  <div key={request.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <MapPinIcon className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {request.location?.locationName || `${request.location?.city}, ${request.location?.state}`}
                      </p>
                      <p className="text-sm text-gray-500">
                        {request.searchRadius}km radius " Expires {new Date(request.expiresAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No active requests. Create one to start finding players!</p>
            )}
            
            {activeRequests.length > 3 && (
              <div className="mt-4 text-center">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setActiveTab('requests')}
                >
                  View All Requests
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );

  if (user?.role !== 'player') {
    return (
      <EnhancedDashboardLayout title="Player Finder">
        <Card className="p-8 text-center">
          <UserGroupIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Player Access Required</h3>
          <p className="text-gray-500">
            The Player Finder feature is only available to registered players.
          </p>
        </Card>
      </EnhancedDashboardLayout>
    );
  }

  if (loading) {
    return (
      <EnhancedDashboardLayout title="Player Finder">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-6 text-center">
                <LoadingSpinner size="sm" />
              </Card>
            ))}
          </div>
          <Card className="p-8 text-center">
            <LoadingSpinner />
            <p className="text-gray-500 mt-4">Loading player finder data...</p>
          </Card>
        </div>
      </EnhancedDashboardLayout>
    );
  }

  return (
    <EnhancedDashboardLayout 
      title="Player Finder"
      actions={
        <Button variant="primary" onClick={handleCreateRequest}>
          <PlusIcon className="h-5 w-5 mr-2" />
          New Request
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: SparklesIcon },
              { id: 'matches', name: 'Matches', icon: UserGroupIcon },
              { id: 'requests', name: 'My Requests', icon: ClockIcon },
              { id: 'locations', name: 'Locations', icon: MapPinIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverviewTab()}
        
        {activeTab === 'matches' && (
          <MatchesList
            receivedMatches={matches}
            sentMatches={sentMatches}
            onRespondToMatch={handleRespondToMatch}
            onRefresh={fetchPlayerFinderData}
          />
        )}
        
        {activeTab === 'requests' && (
          <ActiveRequestsList
            requests={activeRequests}
            onRefresh={fetchPlayerFinderData}
          />
        )}
        
        {activeTab === 'locations' && (
          <LocationManager onLocationChange={fetchPlayerFinderData} />
        )}
      </div>

      {/* Create Request Modal */}
      {showCreateModal && (
        <CreateRequestModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleRequestCreated}
        />
      )}
    </EnhancedDashboardLayout>
  );
};

export default PlayerFinderPage;