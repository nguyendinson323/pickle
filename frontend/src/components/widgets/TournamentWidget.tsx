import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardWidget from './DashboardWidget';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { TrophyIcon, CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';

interface Tournament {
  id: string;
  name: string;
  location: string;
  date: string;
  status: 'upcoming' | 'ongoing' | 'registration' | 'completed';
  participantCount: number;
  maxParticipants: number;
  registrationDeadline: string;
  category: string;
  level: string;
}

export interface TournamentWidgetProps {
  userId?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showAll?: boolean;
}

const TournamentWidget: React.FC<TournamentWidgetProps> = ({
  userId,
  className,
  size = 'md',
  showAll = false
}) => {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTournaments = async () => {
    try {
      setError(null);
      // Mock data - in real implementation, fetch from API
      const mockTournaments: Tournament[] = [
        {
          id: '1',
          name: 'Mexico National Championship 2024',
          location: 'Cancún, Quintana Roo',
          date: '2024-03-15',
          status: 'registration',
          participantCount: 124,
          maxParticipants: 256,
          registrationDeadline: '2024-03-01',
          category: 'Professional',
          level: 'Open'
        },
        {
          id: '2',
          name: 'Guadalajara Open',
          location: 'Guadalajara, Jalisco',
          date: '2024-03-22',
          status: 'upcoming',
          participantCount: 89,
          maxParticipants: 128,
          registrationDeadline: '2024-03-10',
          category: 'Amateur',
          level: '4.0+'
        },
        {
          id: '3',
          name: 'Mexico City Masters',
          location: 'Mexico City, CDMX',
          date: '2024-04-05',
          status: 'ongoing',
          participantCount: 64,
          maxParticipants: 64,
          registrationDeadline: '2024-03-20',
          category: 'Masters',
          level: '50+'
        }
      ];

      // Filter based on user preferences or show all
      const filteredTournaments = showAll 
        ? mockTournaments 
        : mockTournaments.slice(0, 3);

      setTournaments(filteredTournaments);
    } catch (err) {
      setError('Failed to load tournaments');
      console.error('Tournament fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, [userId, showAll]);

  const getStatusBadge = (status: Tournament['status']) => {
    const variants = {
      upcoming: 'warning' as const,
      ongoing: 'success' as const,
      registration: 'info' as const,
      completed: 'secondary' as const
    };

    const labels = {
      upcoming: 'Upcoming',
      ongoing: 'Live',
      registration: 'Open',
      completed: 'Finished'
    };

    return (
      <Badge variant={variants[status]} size="sm">
        {labels[status]}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntil = (dateString: string) => {
    const targetDate = new Date(dateString);
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const renderTournamentCard = (tournament: Tournament) => (
    <div key={tournament.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 text-sm mb-1">{tournament.name}</h4>
          <div className="flex items-center text-xs text-gray-500 mb-2">
            <MapPinIcon className="h-3 w-3 mr-1" />
            {tournament.location}
          </div>
        </div>
        {getStatusBadge(tournament.status)}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center text-gray-600">
            <CalendarIcon className="h-3 w-3 mr-1" />
            {formatDate(tournament.date)}
          </span>
          <span className="text-gray-500">
            {getDaysUntil(tournament.date)} days
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">
            {tournament.participantCount}/{tournament.maxParticipants} players
          </span>
          <span className="font-medium text-primary-600">
            {tournament.level}
          </span>
        </div>

        {/* Progress bar for participants */}
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className="bg-primary-600 h-1.5 rounded-full transition-all duration-300"
            style={{ 
              width: `${(tournament.participantCount / tournament.maxParticipants) * 100}%` 
            }}
          />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate(`/tournaments/${tournament.id}`)}
        >
          View Details
        </Button>
        {tournament.status === 'registration' && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/tournaments/${tournament.id}/register`)}
          >
            Register
          </Button>
        )}
      </div>
    </div>
  );

  const actions = (
    <Button
      variant="secondary"
      size="sm"
      onClick={() => navigate('/tournaments')}
    >
      View All
    </Button>
  );

  return (
    <DashboardWidget
      id="tournaments"
      title="Tournaments"
      subtitle={`${tournaments.length} available tournaments`}
      className={className}
      size={size}
      loading={loading}
      error={error || undefined}
      refreshable
      expandable
      actions={actions}
      onRefresh={fetchTournaments}
      onExpand={() => navigate('/tournaments')}
    >
      <div className="space-y-4">
        {tournaments.length === 0 ? (
          <div className="text-center py-8">
            <TrophyIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-sm font-medium text-gray-900 mb-2">No tournaments found</h3>
            <p className="text-sm text-gray-500 mb-4">
              Check back later for new tournament announcements.
            </p>
            <Button variant="secondary" onClick={() => navigate('/tournaments')}>
              Browse All Tournaments
            </Button>
          </div>
        ) : (
          tournaments.map(renderTournamentCard)
        )}
      </div>
    </DashboardWidget>
  );
};

export default TournamentWidget;