import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/store';
import { selectUser } from '@/store/authSlice';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import TournamentAnalytics from '../../components/tournaments/TournamentAnalytics';
import {
  TrophyIcon,
  UserGroupIcon,
  CalendarIcon,
  ChartBarIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlayIcon,
  StopIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

interface Tournament {
  id: number;
  name: string;
  description: string;
  status: 'draft' | 'open' | 'registration_closed' | 'in_progress' | 'completed' | 'cancelled';
  level: 'national' | 'state' | 'municipal' | 'local';
  startDate: string;
  endDate: string;
  registrationEnd: string;
  venueName: string;
  venueCity: string;
  venueState: string;
  maxParticipants: number;
  currentParticipants: number;
  entryFee: number;
  prizePool: number;
  categories: any[];
  createdAt: string;
}

interface TournamentStats {
  totalTournaments: number;
  activeTournaments: number;
  completedTournaments: number;
  totalRegistrations: number;
  totalRevenue: number;
  upcomingTournaments: number;
}

const TournamentManagePage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [stats, setStats] = useState<TournamentStats>({
    totalTournaments: 0,
    activeTournaments: 0,
    completedTournaments: 0,
    totalRegistrations: 0,
    totalRevenue: 0,
    upcomingTournaments: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'tournaments' | 'analytics'>('tournaments');

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API calls
      const mockTournaments: Tournament[] = [
        {
          id: 1,
          name: 'Mexico City Open 2024',
          description: 'Annual championship tournament featuring players from across Mexico',
          status: 'open',
          level: 'state',
          startDate: '2024-03-15',
          endDate: '2024-03-17',
          registrationEnd: '2024-03-10',
          venueName: 'Centro Deportivo Nacional',
          venueCity: 'Mexico City',
          venueState: 'Ciudad de México',
          maxParticipants: 128,
          currentParticipants: 67,
          entryFee: 500,
          prizePool: 15000,
          categories: [
            { name: "Men's Singles", participants: 32 },
            { name: "Women's Singles", participants: 24 },
            { name: "Mixed Doubles", participants: 11 }
          ],
          createdAt: '2024-02-01'
        },
        {
          id: 2,
          name: 'Guadalajara Championship',
          description: 'Regional tournament for advanced players',
          status: 'in_progress',
          level: 'municipal',
          startDate: '2024-02-20',
          endDate: '2024-02-22',
          registrationEnd: '2024-02-15',
          venueName: 'Club Deportivo Guadalajara',
          venueCity: 'Guadalajara',
          venueState: 'Jalisco',
          maxParticipants: 64,
          currentParticipants: 64,
          entryFee: 300,
          prizePool: 8000,
          categories: [
            { name: "Men's Doubles", participants: 32 },
            { name: "Women's Doubles", participants: 32 }
          ],
          createdAt: '2024-01-15'
        },
        {
          id: 3,
          name: 'Cancún Beach Tournament',
          description: 'Fun tournament by the beach',
          status: 'completed',
          level: 'local',
          startDate: '2024-01-20',
          endDate: '2024-01-21',
          registrationEnd: '2024-01-15',
          venueName: 'Beach Resort Courts',
          venueCity: 'Cancún',
          venueState: 'Quintana Roo',
          maxParticipants: 32,
          currentParticipants: 32,
          entryFee: 200,
          prizePool: 3000,
          categories: [
            { name: "Open Mixed", participants: 32 }
          ],
          createdAt: '2024-01-01'
        }
      ];

      setTournaments(mockTournaments);

      // Calculate stats
      const mockStats: TournamentStats = {
        totalTournaments: mockTournaments.length,
        activeTournaments: mockTournaments.filter(t => t.status === 'open' || t.status === 'in_progress').length,
        completedTournaments: mockTournaments.filter(t => t.status === 'completed').length,
        totalRegistrations: mockTournaments.reduce((sum, t) => sum + t.currentParticipants, 0),
        totalRevenue: mockTournaments.reduce((sum, t) => sum + (t.currentParticipants * t.entryFee), 0),
        upcomingTournaments: mockTournaments.filter(t => t.status === 'open' && new Date(t.startDate) > new Date()).length
      };

      setStats(mockStats);
    } catch (error) {
      console.error('Error loading tournaments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      open: 'bg-green-100 text-green-800',
      registration_closed: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-purple-100 text-purple-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      draft: 'Draft',
      open: 'Registration Open',
      registration_closed: 'Registration Closed',
      in_progress: 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const filteredTournaments = tournaments.filter(tournament => 
    selectedStatus === 'all' || tournament.status === selectedStatus
  );

  const handleCreateTournament = () => {
    navigate('/tournaments/create');
  };

  const handleViewTournament = (tournamentId: number) => {
    navigate(`/tournaments/${tournamentId}`);
  };

  const handleEditTournament = (tournamentId: number) => {
    navigate(`/tournaments/${tournamentId}/edit`);
  };

  const handleStartTournament = async (tournamentId: number) => {
    try {
      // Mock API call to start tournament
      console.log('Starting tournament:', tournamentId);
      await new Promise(resolve => setTimeout(resolve, 1000));
      loadTournaments();
    } catch (error) {
      console.error('Error starting tournament:', error);
    }
  };

  const handleCompleteTournament = async (tournamentId: number) => {
    try {
      // Mock API call to complete tournament
      console.log('Completing tournament:', tournamentId);
      await new Promise(resolve => setTimeout(resolve, 1000));
      loadTournaments();
    } catch (error) {
      console.error('Error completing tournament:', error);
    }
  };

  const handleExportTournament = (tournamentId: number) => {
    // Mock export functionality
    console.log('Exporting tournament data:', tournamentId);
    alert('Tournament data exported successfully!');
  };

  const handleDeleteTournament = async (tournamentId: number) => {
    if (window.confirm('Are you sure you want to delete this tournament? This action cannot be undone.')) {
      try {
        console.log('Deleting tournament:', tournamentId);
        await new Promise(resolve => setTimeout(resolve, 1000));
        loadTournaments();
      } catch (error) {
        console.error('Error deleting tournament:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tournament Management</h1>
          <p className="text-gray-600">Manage your tournaments, view registrations, and track performance.</p>
        </div>
        <Button variant="primary" onClick={handleCreateTournament} className="flex items-center space-x-2">
          <PlusIcon className="w-5 h-5" />
          <span>Create Tournament</span>
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrophyIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tournaments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTournaments}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <PlayIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeTournaments}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <StopIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedTournaments}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <UserGroupIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Registrations</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRegistrations}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <ChartBarIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <CalendarIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold text-gray-900">{stats.upcomingTournaments}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Filter by status:</span>
          <div className="flex space-x-2">
            {[
              { value: 'all', label: 'All' },
              { value: 'draft', label: 'Draft' },
              { value: 'open', label: 'Open' },
              { value: 'in_progress', label: 'In Progress' },
              { value: 'completed', label: 'Completed' }
            ].map((status) => (
              <button
                key={status.value}
                onClick={() => setSelectedStatus(status.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedStatus === status.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Tournament List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTournaments.map((tournament) => (
          <Card key={tournament.id} className="overflow-hidden">
            <div className="p-6">
              {/* Tournament Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{tournament.name}</h3>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(tournament.status)}`}>
                    {getStatusLabel(tournament.status)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {tournament.level}
                  </span>
                </div>
              </div>

              {/* Tournament Details */}
              <div className="space-y-2 mb-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  <span>{new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="w-4 h-4 mr-2" />
                  <span>{tournament.venueName}, {tournament.venueCity}</span>
                </div>
                <div className="flex items-center">
                  <UserGroupIcon className="w-4 h-4 mr-2" />
                  <span>{tournament.currentParticipants}/{tournament.maxParticipants} participants</span>
                </div>
                <div className="flex items-center">
                  <TrophyIcon className="w-4 h-4 mr-2" />
                  <span>{tournament.categories.length} categories</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Registration Progress</span>
                  <span>{Math.round((tournament.currentParticipants / tournament.maxParticipants) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (tournament.currentParticipants / tournament.maxParticipants) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Revenue Info */}
              <div className="flex justify-between text-sm mb-4">
                <span className="text-gray-600">Entry Fee:</span>
                <span className="font-medium">${tournament.entryFee}</span>
              </div>
              <div className="flex justify-between text-sm mb-6">
                <span className="text-gray-600">Prize Pool:</span>
                <span className="font-medium text-green-600">${tournament.prizePool.toLocaleString()}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewTournament(tournament.id)}
                  className="flex items-center space-x-1"
                >
                  <EyeIcon className="w-4 h-4" />
                  <span>View</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditTournament(tournament.id)}
                  className="flex items-center space-x-1"
                >
                  <PencilIcon className="w-4 h-4" />
                  <span>Edit</span>
                </Button>

                {tournament.status === 'open' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleStartTournament(tournament.id)}
                    className="flex items-center space-x-1"
                  >
                    <PlayIcon className="w-4 h-4" />
                    <span>Start</span>
                  </Button>
                )}

                {tournament.status === 'in_progress' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleCompleteTournament(tournament.id)}
                    className="flex items-center space-x-1"
                  >
                    <StopIcon className="w-4 h-4" />
                    <span>Complete</span>
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportTournament(tournament.id)}
                  className="flex items-center space-x-1"
                >
                  <DocumentArrowDownIcon className="w-4 h-4" />
                  <span>Export</span>
                </Button>

                {tournament.status === 'draft' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteTournament(tournament.id)}
                    className="flex items-center space-x-1 text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <TrashIcon className="w-4 h-4" />
                    <span>Delete</span>
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredTournaments.length === 0 && (
        <Card className="p-12 text-center">
          <TrophyIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            {selectedStatus === 'all' ? 'No tournaments yet' : `No ${selectedStatus} tournaments`}
          </h3>
          <p className="text-gray-600 mb-6">
            {selectedStatus === 'all' 
              ? 'Create your first tournament to get started organizing competitions.'
              : `There are no tournaments with status "${selectedStatus}" at the moment.`
            }
          </p>
          {selectedStatus === 'all' && (
            <Button variant="primary" onClick={handleCreateTournament}>
              Create Your First Tournament
            </Button>
          )}
        </Card>
      )}
    </div>
  );
};

export default TournamentManagePage;