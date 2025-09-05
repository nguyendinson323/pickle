import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import {
  TrophyIcon,
  UserIcon,
  CalendarIcon,
  ClockIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

interface Player {
  id: number;
  name: string;
  seed?: number;
  avatar?: string;
}

interface MatchScore {
  sets: {
    player1Score: number;
    player2Score: number;
  }[];
  retired: boolean;
  walkover: boolean;
  winner: 1 | 2 | null;
}

interface Match {
  id: number;
  round: number;
  roundName: string;
  matchNumber: number;
  player1?: Player;
  player2?: Player;
  score?: MatchScore;
  winnerId?: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'walkover';
  scheduledDate?: string;
  scheduledTime?: string;
  courtAssignment?: string;
}

interface TournamentBracketProps {
  tournamentId: number;
  categoryId: number;
  categoryName: string;
  bracketType: 'single_elimination' | 'double_elimination' | 'round_robin';
  canManage?: boolean;
  onMatchUpdate?: (matchId: number, score: MatchScore) => void;
}

const TournamentBracket: React.FC<TournamentBracketProps> = ({
  tournamentId,
  categoryId,
  categoryName,
  bracketType = 'single_elimination',
  canManage = false,
  onMatchUpdate
}) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [showScoring, setShowScoring] = useState(false);

  useEffect(() => {
    loadBracket();
  }, [tournamentId, categoryId]);

  const loadBracket = async () => {
    setLoading(true);
    try {
      // Mock bracket data
      const mockMatches: Match[] = [
        // First Round (Round 1)
        {
          id: 1, round: 1, roundName: 'First Round', matchNumber: 1,
          player1: { id: 1, name: 'Carlos Rodriguez', seed: 1 },
          player2: { id: 2, name: 'Miguel Santos', seed: 8 },
          status: 'completed',
          score: {
            sets: [{ player1Score: 11, player2Score: 6 }, { player1Score: 11, player2Score: 8 }],
            retired: false, walkover: false, winner: 1
          },
          winnerId: 1,
          scheduledDate: '2024-03-15',
          scheduledTime: '09:00',
          courtAssignment: 'Court 1'
        },
        {
          id: 2, round: 1, roundName: 'First Round', matchNumber: 2,
          player1: { id: 3, name: 'Ana Martinez', seed: 4 },
          player2: { id: 4, name: 'Sofia Gutierrez', seed: 5 },
          status: 'in_progress',
          score: {
            sets: [{ player1Score: 11, player2Score: 9 }, { player1Score: 8, player2Score: 11 }],
            retired: false, walkover: false, winner: null
          },
          scheduledDate: '2024-03-15',
          scheduledTime: '10:00',
          courtAssignment: 'Court 2'
        },
        {
          id: 3, round: 1, roundName: 'First Round', matchNumber: 3,
          player1: { id: 5, name: 'Luis Fernandez', seed: 3 },
          player2: { id: 6, name: 'Roberto Silva', seed: 6 },
          status: 'scheduled',
          scheduledDate: '2024-03-15',
          scheduledTime: '11:00',
          courtAssignment: 'Court 1'
        },
        {
          id: 4, round: 1, roundName: 'First Round', matchNumber: 4,
          player1: { id: 7, name: 'Maria Lopez', seed: 2 },
          player2: { id: 8, name: 'Carmen Diaz', seed: 7 },
          status: 'scheduled',
          scheduledDate: '2024-03-15',
          scheduledTime: '12:00',
          courtAssignment: 'Court 2'
        },
        // Semifinals (Round 2)
        {
          id: 5, round: 2, roundName: 'Semifinals', matchNumber: 1,
          player1: { id: 1, name: 'Carlos Rodriguez', seed: 1 },
          player2: undefined, // Winner of match 2
          status: 'scheduled',
          scheduledDate: '2024-03-16',
          scheduledTime: '14:00',
          courtAssignment: 'Center Court'
        },
        {
          id: 6, round: 2, roundName: 'Semifinals', matchNumber: 2,
          player1: undefined, // Winner of match 3
          player2: undefined, // Winner of match 4
          status: 'scheduled',
          scheduledDate: '2024-03-16',
          scheduledTime: '15:00',
          courtAssignment: 'Center Court'
        },
        // Final (Round 3)
        {
          id: 7, round: 3, roundName: 'Final', matchNumber: 1,
          player1: undefined, // Winner of semifinal 1
          player2: undefined, // Winner of semifinal 2
          status: 'scheduled',
          scheduledDate: '2024-03-17',
          scheduledTime: '16:00',
          courtAssignment: 'Center Court'
        }
      ];

      setMatches(mockMatches);
    } catch (error) {
      console.error('Error loading bracket:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupMatchesByRound = () => {
    const rounds: { [key: number]: Match[] } = {};
    matches.forEach(match => {
      if (!rounds[match.round]) {
        rounds[match.round] = [];
      }
      rounds[match.round].push(match);
    });
    return rounds;
  };

  const getPlayerName = (player: Player | undefined) => {
    if (!player) return 'TBD';
    return player.seed ? `${player.name} (${player.seed})` : player.name;
  };

  const getMatchScoreDisplay = (match: Match) => {
    if (!match.score) return '';
    
    if (match.score.walkover) return 'W.O.';
    if (match.score.retired) return 'RET.';
    
    if (match.status === 'completed') {
      const sets = match.score.sets.map(set => `${set.player1Score}-${set.player2Score}`);
      return sets.join(', ');
    } else if (match.status === 'in_progress') {
      const currentSet = match.score.sets[match.score.sets.length - 1];
      return `${currentSet.player1Score}-${currentSet.player2Score}`;
    }
    
    return '';
  };

  const getMatchStatusColor = (status: string) => {
    const colors = {
      scheduled: 'border-gray-200 bg-gray-50',
      in_progress: 'border-blue-200 bg-blue-50',
      completed: 'border-green-200 bg-green-50',
      walkover: 'border-yellow-200 bg-yellow-50'
    };
    return colors[status as keyof typeof colors] || 'border-gray-200 bg-gray-50';
  };

  const isWinner = (match: Match, playerNumber: 1 | 2) => {
    return match.score?.winner === playerNumber;
  };

  const handleMatchClick = (match: Match) => {
    setSelectedMatch(match);
    if (canManage && (match.status === 'scheduled' || match.status === 'in_progress')) {
      setShowScoring(true);
    }
  };

  const handleScoreUpdate = (score: MatchScore) => {
    if (selectedMatch && onMatchUpdate) {
      onMatchUpdate(selectedMatch.id, score);
      setShowScoring(false);
      setSelectedMatch(null);
      loadBracket(); // Reload to show updated bracket
    }
  };

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Loading tournament bracket...</p>
      </Card>
    );
  }

  const rounds = groupMatchesByRound();
  const totalRounds = Object.keys(rounds).length;

  return (
    <div className="space-y-6">
      {/* Bracket Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TrophyIcon className="w-6 h-6 text-gold-500" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{categoryName}</h2>
              <p className="text-sm text-gray-600 capitalize">{bracketType.replace('_', ' ')} Tournament</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Total Rounds</div>
            <div className="text-2xl font-bold text-gray-900">{totalRounds}</div>
          </div>
        </div>
      </Card>

      {/* Tournament Bracket */}
      <Card className="p-6 overflow-x-auto">
        <div className="flex space-x-8 min-w-max pb-4">
          {Object.entries(rounds)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([roundNum, roundMatches]) => (
              <div key={roundNum} className="flex-shrink-0 min-w-[300px]">
                {/* Round Header */}
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {roundMatches[0]?.roundName || `Round ${roundNum}`}
                  </h3>
                  <div className="text-sm text-gray-600 mt-1">
                    {roundMatches.filter(m => m.status === 'completed').length} / {roundMatches.length} matches completed
                  </div>
                </div>

                {/* Matches */}
                <div className="space-y-6">
                  {roundMatches
                    .sort((a, b) => a.matchNumber - b.matchNumber)
                    .map((match) => (
                      <div
                        key={match.id}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${getMatchStatusColor(match.status)}`}
                        onClick={() => handleMatchClick(match)}
                      >
                        {/* Match Header */}
                        <div className="flex justify-between items-center mb-3">
                          <div className="text-sm font-medium text-gray-600">
                            Match #{match.matchNumber}
                          </div>
                          <div className="flex items-center space-x-2">
                            {match.status === 'in_progress' && (
                              <div className="flex items-center text-xs text-blue-600">
                                <PlayIcon className="w-3 h-3 mr-1" />
                                LIVE
                              </div>
                            )}
                            {match.courtAssignment && (
                              <div className="text-xs text-gray-500">{match.courtAssignment}</div>
                            )}
                          </div>
                        </div>

                        {/* Players */}
                        <div className="space-y-2">
                          {/* Player 1 */}
                          <div className={`flex items-center justify-between p-2 rounded ${
                            isWinner(match, 1) ? 'bg-green-100 border border-green-200' : 'bg-white'
                          }`}>
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                                <UserIcon className="w-4 h-4 text-gray-600" />
                              </div>
                              <span className={`font-medium ${isWinner(match, 1) ? 'text-green-800' : 'text-gray-900'}`}>
                                {getPlayerName(match.player1)}
                              </span>
                            </div>
                            {match.score && match.score.sets.length > 0 && (
                              <div className="text-sm font-medium text-gray-700">
                                {match.score.sets.map((set, i) => (
                                  <span key={i} className="mr-1">{set.player1Score}</span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* VS Divider */}
                          <div className="text-center text-xs text-gray-400 py-1">vs</div>

                          {/* Player 2 */}
                          <div className={`flex items-center justify-between p-2 rounded ${
                            isWinner(match, 2) ? 'bg-green-100 border border-green-200' : 'bg-white'
                          }`}>
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                                <UserIcon className="w-4 h-4 text-gray-600" />
                              </div>
                              <span className={`font-medium ${isWinner(match, 2) ? 'text-green-800' : 'text-gray-900'}`}>
                                {getPlayerName(match.player2)}
                              </span>
                            </div>
                            {match.score && match.score.sets.length > 0 && (
                              <div className="text-sm font-medium text-gray-700">
                                {match.score.sets.map((set, i) => (
                                  <span key={i} className="mr-1">{set.player2Score}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Match Details */}
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex justify-between items-center text-xs text-gray-500">
                            <div className="flex items-center space-x-3">
                              {match.scheduledDate && (
                                <div className="flex items-center">
                                  <CalendarIcon className="w-3 h-3 mr-1" />
                                  {new Date(match.scheduledDate).toLocaleDateString()}
                                </div>
                              )}
                              {match.scheduledTime && (
                                <div className="flex items-center">
                                  <ClockIcon className="w-3 h-3 mr-1" />
                                  {match.scheduledTime}
                                </div>
                              )}
                            </div>
                            <div className="capitalize">
                              {match.status.replace('_', ' ')}
                            </div>
                          </div>

                          {/* Score Display */}
                          {getMatchScoreDisplay(match) && (
                            <div className="text-center mt-2 text-sm font-medium text-gray-700">
                              {getMatchScoreDisplay(match)}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>

                {/* Connection Lines (Visual Enhancement) */}
                {parseInt(roundNum) < totalRounds && (
                  <div className="flex justify-end mt-4">
                    <div className="w-8 h-0.5 bg-gray-300"></div>
                  </div>
                )}
              </div>
            ))}
        </div>
      </Card>

      {/* Champion Section */}
      {matches.some(m => m.roundName === 'Final' && m.status === 'completed') && (
        <Card className="p-6 text-center bg-gradient-to-r from-yellow-50 to-gold-50">
          <TrophyIcon className="w-12 h-12 mx-auto mb-4 text-gold-500" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Tournament Champion</h3>
          <div className="text-xl font-semibold text-gold-600">
            {(() => {
              const finalMatch = matches.find(m => m.roundName === 'Final');
              const winner = finalMatch?.score?.winner === 1 ? finalMatch.player1 : finalMatch?.player2;
              return getPlayerName(winner);
            })()}
          </div>
        </Card>
      )}

      {/* Empty State */}
      {matches.length === 0 && (
        <Card className="p-12 text-center">
          <TrophyIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No bracket available</h3>
          <p className="text-gray-600">
            The tournament bracket will be generated once registration closes and players are seeded.
          </p>
        </Card>
      )}

      {/* Match Details Modal - Basic version */}
      {selectedMatch && !showScoring && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold mb-4">
              {selectedMatch.roundName} - Match #{selectedMatch.matchNumber}
            </h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>{getPlayerName(selectedMatch.player1)}</span>
                <span className="font-medium">
                  {selectedMatch.score?.sets.map(s => s.player1Score).join(', ') || '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{getPlayerName(selectedMatch.player2)}</span>
                <span className="font-medium">
                  {selectedMatch.score?.sets.map(s => s.player2Score).join(', ') || '-'}
                </span>
              </div>
              {selectedMatch.scheduledDate && (
                <div className="pt-3 border-t text-sm text-gray-600">
                  <div>Date: {new Date(selectedMatch.scheduledDate).toLocaleDateString()}</div>
                  <div>Time: {selectedMatch.scheduledTime}</div>
                  <div>Court: {selectedMatch.courtAssignment}</div>
                </div>
              )}
            </div>
            <Button variant="outline" onClick={() => setSelectedMatch(null)} className="w-full">
              Close
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TournamentBracket;