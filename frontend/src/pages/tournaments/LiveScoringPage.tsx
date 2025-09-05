import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LiveScoring from '../../components/tournaments/LiveScoring';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAppSelector } from '../../store';

interface Player {
  id: number;
  name: string;
  seed?: number;
}

interface SetScore {
  player1Score: number;
  player2Score: number;
  tiebreak?: {
    player1Score: number;
    player2Score: number;
  };
}

interface MatchScore {
  sets: SetScore[];
  retired: boolean;
  walkover: boolean;
  winner: 1 | 2 | null;
}

interface Match {
  id: number;
  tournamentId: number;
  categoryId: number;
  round: string;
  roundName: string;
  matchNumber: number;
  player1: Player;
  player2: Player;
  score?: MatchScore;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  courtAssignment?: string;
  scheduledTime?: string;
  actualStartTime?: Date;
  actualEndTime?: Date;
}

const LiveScoringPage: React.FC = () => {
  const { id, matchId } = useParams<{ id: string; matchId: string }>();
  
  const [loading, setLoading] = useState(true);
  const [match, setMatch] = useState<Match | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchMatchData = async () => {
      if (!id || !matchId) {
        setError('Invalid match or tournament ID');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Fetch match data from API
        const response = await fetch(`/api/tournaments/${id}/matches/${matchId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch match data');
        }
        
        const matchData: Match = await response.json();
        setMatch(matchData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load match');
      } finally {
        setLoading(false);
      }
    };

    fetchMatchData();
  }, [id, matchId]);

  const handleScoreUpdate = async (updatedMatchId: number, score: MatchScore) => {
    try {
      const response = await fetch(`/api/matches/${updatedMatchId}/score`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(score),
      });

      if (!response.ok) {
        throw new Error('Failed to update score');
      }

      // Update local match state
      if (match) {
        setMatch({
          ...match,
          score,
          status: 'in_progress'
        });
      }
    } catch (err) {
      console.error('Failed to update match score:', err);
      // You might want to show a toast notification here
    }
  };

  const handleMatchComplete = async (completedMatchId: number, winnerId: number) => {
    try {
      const response = await fetch(`/api/matches/${completedMatchId}/complete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ winnerId }),
      });

      if (!response.ok) {
        throw new Error('Failed to complete match');
      }

      // Update local match state
      if (match) {
        setMatch({
          ...match,
          status: 'completed',
          score: match.score ? {
            ...match.score,
            winner: winnerId === match.player1.id ? 1 : 2
          } : undefined
        });
      }

      // You might want to redirect to tournament bracket or show success message
    } catch (err) {
      console.error('Failed to complete match:', err);
      // You might want to show a toast notification here
    }
  };

  // Determine if user can manage this match (input scores)
  const canManage = user && (
    user.role === 'admin' ||
    user.role === 'state' ||
    user.role === 'club' ||
    user.role === 'partner'
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Match</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">🏓</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Match Not Found</h2>
          <p className="text-gray-600">The requested match could not be found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Live Match Scoring</h1>
        <div className="text-lg text-gray-600">
          {match.player1?.name || 'TBD'} vs {match.player2?.name || 'TBD'}
        </div>
        <div className="text-sm text-gray-500">
          Round: {match.round} | Match #{match.matchNumber}
          {match.courtAssignment && ` | Court: ${match.courtAssignment}`}
        </div>
      </div>
      
      <LiveScoring
        match={match}
        onScoreUpdate={handleScoreUpdate}
        onMatchComplete={handleMatchComplete}
        canManage={canManage || false}
      />
    </div>
  );
};

export default LiveScoringPage;