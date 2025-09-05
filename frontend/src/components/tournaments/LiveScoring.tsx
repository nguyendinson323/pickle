import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import {
  UserIcon,
  PlusIcon,
  MinusIcon,
  ClockIcon,
  TrophyIcon,
  PlayIcon,
  PauseIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

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

interface LiveScoringProps {
  match: Match;
  onScoreUpdate: (matchId: number, score: MatchScore) => void;
  onMatchComplete: (matchId: number, winnerId: number) => void;
  canManage?: boolean;
}

const LiveScoring: React.FC<LiveScoringProps> = ({
  match,
  onScoreUpdate,
  onMatchComplete,
  canManage = false
}) => {
  const [currentScore, setCurrentScore] = useState<MatchScore>({
    sets: [{ player1Score: 0, player2Score: 0 }],
    retired: false,
    walkover: false,
    winner: null
  });
  
  const [matchTimer, setMatchTimer] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingWinner, setPendingWinner] = useState<1 | 2 | null>(null);

  // Tournament rules
  const POINTS_TO_WIN_GAME = 11;
  const POINTS_TO_WIN_SET = 2; // Must win by 2 points
  const MAX_SETS = 3; // Best of 3 sets
  const SETS_TO_WIN_MATCH = 2;

  useEffect(() => {
    // Initialize score from existing match data
    if (match.score) {
      setCurrentScore(match.score);
    }
    
    // Start timer for in-progress matches
    if (match.status === 'in_progress') {
      setIsTimerRunning(true);
      if (match.actualStartTime) {
        const elapsed = Math.floor((new Date().getTime() - new Date(match.actualStartTime).getTime()) / 1000);
        setMatchTimer(elapsed);
      }
    }
  }, [match]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setMatchTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentSet = () => {
    return currentScore.sets[currentScore.sets.length - 1];
  };

  const updateScore = (player: 1 | 2, increment: boolean) => {
    if (!canManage || currentScore.winner) return;

    const newScore = { ...currentScore };
    const currentSet = getCurrentSet();
    const newSet = { ...currentSet };

    // Update current set score
    if (player === 1) {
      newSet.player1Score = Math.max(0, newSet.player1Score + (increment ? 1 : -1));
    } else {
      newSet.player2Score = Math.max(0, newSet.player2Score + (increment ? 1 : -1));
    }

    // Replace the current set
    newScore.sets[newScore.sets.length - 1] = newSet;

    // Check if set is won
    const setWinner = checkSetWinner(newSet);
    if (setWinner) {
      // Check if match is won
      const setsWon = getSetsWon(newScore.sets);
      
      if (setsWon.player1 >= SETS_TO_WIN_MATCH || setsWon.player2 >= SETS_TO_WIN_MATCH) {
        // Match completed
        newScore.winner = setsWon.player1 >= SETS_TO_WIN_MATCH ? 1 : 2;
        setPendingWinner(newScore.winner);
        setShowConfirmation(true);
      } else if (newScore.sets.length < MAX_SETS) {
        // Start new set
        newScore.sets.push({ player1Score: 0, player2Score: 0 });
      }
    }

    setCurrentScore(newScore);
    onScoreUpdate(match.id, newScore);
  };

  const checkSetWinner = (set: SetScore): 1 | 2 | null => {
    if (set.player1Score >= POINTS_TO_WIN_GAME && set.player1Score - set.player2Score >= POINTS_TO_WIN_SET) {
      return 1;
    }
    if (set.player2Score >= POINTS_TO_WIN_GAME && set.player2Score - set.player1Score >= POINTS_TO_WIN_SET) {
      return 2;
    }
    return null;
  };

  const getSetsWon = (sets: SetScore[]) => {
    let player1Sets = 0;
    let player2Sets = 0;

    sets.forEach(set => {
      const winner = checkSetWinner(set);
      if (winner === 1) player1Sets++;
      if (winner === 2) player2Sets++;
    });

    return { player1: player1Sets, player2: player2Sets };
  };

  const handleMatchComplete = () => {
    if (pendingWinner) {
      setIsTimerRunning(false);
      onMatchComplete(match.id, pendingWinner === 1 ? match.player1.id : match.player2.id);
      setShowConfirmation(false);
    }
  };

  const handleRetirement = (player: 1 | 2) => {
    if (!canManage) return;
    
    const newScore = { ...currentScore };
    newScore.retired = true;
    newScore.winner = player === 1 ? 2 : 1; // Other player wins
    
    setCurrentScore(newScore);
    setPendingWinner(newScore.winner);
    setShowConfirmation(true);
  };

  const handleWalkover = (player: 1 | 2) => {
    if (!canManage) return;
    
    const newScore: MatchScore = {
      sets: [],
      retired: false,
      walkover: true,
      winner: player
    };
    
    setCurrentScore(newScore);
    setPendingWinner(player);
    setShowConfirmation(true);
  };

  const startMatch = () => {
    if (!canManage) return;
    setIsTimerRunning(true);
  };

  const pauseMatch = () => {
    if (!canManage) return;
    setIsTimerRunning(false);
  };

  const resetMatch = () => {
    if (!canManage || !window.confirm('Are you sure you want to reset the match? This will clear all scores.')) return;
    
    const resetScore: MatchScore = {
      sets: [{ player1Score: 0, player2Score: 0 }],
      retired: false,
      walkover: false,
      winner: null
    };
    
    setCurrentScore(resetScore);
    setMatchTimer(0);
    setIsTimerRunning(false);
    onScoreUpdate(match.id, resetScore);
  };

  const setsWon = getSetsWon(currentScore.sets);
  const currentSet = getCurrentSet();

  return (
    <div className="space-y-6">
      {/* Match Header */}
      <Card className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Live Scoring</h2>
            <p className="text-gray-600">{match.roundName} - Match #{match.matchNumber}</p>
            {match.courtAssignment && (
              <p className="text-sm text-gray-500">{match.courtAssignment}</p>
            )}
          </div>
          
          <div className="text-right">
            <div className="flex items-center text-2xl font-bold text-blue-600 mb-2">
              <ClockIcon className="w-6 h-6 mr-2" />
              {formatTime(matchTimer)}
            </div>
            <div className="flex space-x-2">
              {canManage && (
                <>
                  {isTimerRunning ? (
                    <Button variant="secondary" size="sm" onClick={pauseMatch}>
                      <PauseIcon className="w-4 h-4 mr-1" />
                      Pause
                    </Button>
                  ) : (
                    <Button variant="primary" size="sm" onClick={startMatch}>
                      <PlayIcon className="w-4 h-4 mr-1" />
                      Start
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Match Status */}
        <div className="flex items-center justify-center mb-4">
          <div className={`px-4 py-2 rounded-full text-sm font-medium ${
            match.status === 'in_progress' 
              ? 'bg-green-100 text-green-800'
              : match.status === 'completed'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {match.status === 'in_progress' && <PlayIcon className="w-4 h-4 inline mr-1" />}
            {match.status === 'completed' && <TrophyIcon className="w-4 h-4 inline mr-1" />}
            {match.status.replace('_', ' ').toUpperCase()}
          </div>
        </div>
      </Card>

      {/* Scoreboard */}
      <Card className="p-6">
        {/* Set Scores Header */}
        <div className="grid grid-cols-12 gap-4 mb-4 text-center text-sm font-medium text-gray-600">
          <div className="col-span-4">Player</div>
          {[1, 2, 3].map(setNum => (
            <div key={setNum} className="col-span-2">Set {setNum}</div>
          ))}
          <div className="col-span-2">Sets Won</div>
        </div>

        {/* Player 1 */}
        <div className={`grid grid-cols-12 gap-4 items-center p-4 rounded-lg mb-3 ${
          currentScore.winner === 1 ? 'bg-green-100 border-2 border-green-300' : 'bg-gray-50'
        }`}>
          <div className="col-span-4 flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">
                {match.player1.name}
                {match.player1.seed && <span className="text-sm text-gray-500 ml-1">(#{match.player1.seed})</span>}
              </div>
            </div>
          </div>

          {/* Set Scores */}
          {[0, 1, 2].map(setIndex => (
            <div key={setIndex} className="col-span-2 text-center">
              {setIndex < currentScore.sets.length ? (
                <div className={`text-2xl font-bold ${
                  setIndex === currentScore.sets.length - 1 && !checkSetWinner(currentScore.sets[setIndex])
                    ? 'text-blue-600' : 'text-gray-900'
                }`}>
                  {currentScore.sets[setIndex].player1Score}
                </div>
              ) : (
                <div className="text-2xl font-bold text-gray-300">-</div>
              )}
            </div>
          ))}

          <div className="col-span-2 text-center">
            <div className="text-2xl font-bold text-gray-900">{setsWon.player1}</div>
          </div>
        </div>

        {/* VS Divider */}
        <div className="text-center text-gray-400 font-bold text-lg mb-3">VS</div>

        {/* Player 2 */}
        <div className={`grid grid-cols-12 gap-4 items-center p-4 rounded-lg mb-4 ${
          currentScore.winner === 2 ? 'bg-green-100 border-2 border-green-300' : 'bg-gray-50'
        }`}>
          <div className="col-span-4 flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">
                {match.player2.name}
                {match.player2.seed && <span className="text-sm text-gray-500 ml-1">(#{match.player2.seed})</span>}
              </div>
            </div>
          </div>

          {/* Set Scores */}
          {[0, 1, 2].map(setIndex => (
            <div key={setIndex} className="col-span-2 text-center">
              {setIndex < currentScore.sets.length ? (
                <div className={`text-2xl font-bold ${
                  setIndex === currentScore.sets.length - 1 && !checkSetWinner(currentScore.sets[setIndex])
                    ? 'text-red-600' : 'text-gray-900'
                }`}>
                  {currentScore.sets[setIndex].player2Score}
                </div>
              ) : (
                <div className="text-2xl font-bold text-gray-300">-</div>
              )}
            </div>
          ))}

          <div className="col-span-2 text-center">
            <div className="text-2xl font-bold text-gray-900">{setsWon.player2}</div>
          </div>
        </div>

        {/* Current Set Display */}
        {!currentScore.winner && currentSet && (
          <div className="text-center text-lg font-medium text-gray-700 mb-4">
            Current Set: Set {currentScore.sets.length}
          </div>
        )}

        {/* Winner Display */}
        {currentScore.winner && (
          <div className="text-center p-4 bg-green-100 rounded-lg">
            <TrophyIcon className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <div className="text-xl font-bold text-green-800">
              Winner: {currentScore.winner === 1 ? match.player1.name : match.player2.name}
            </div>
            {currentScore.retired && <div className="text-sm text-gray-600">by retirement</div>}
            {currentScore.walkover && <div className="text-sm text-gray-600">by walkover</div>}
          </div>
        )}
      </Card>

      {/* Scoring Controls */}
      {canManage && !currentScore.winner && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Scoring Controls</h3>
          
          <div className="grid grid-cols-2 gap-6">
            {/* Player 1 Controls */}
            <div className="text-center">
              <h4 className="font-medium text-gray-900 mb-3">{match.player1.name}</h4>
              <div className="flex justify-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateScore(1, false)}
                  className="flex items-center space-x-1"
                >
                  <MinusIcon className="w-4 h-4" />
                  <span>-1</span>
                </Button>
                <div className="px-4 py-2 bg-blue-100 rounded-lg text-xl font-bold text-blue-800 min-w-[60px]">
                  {currentSet.player1Score}
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => updateScore(1, true)}
                  className="flex items-center space-x-1"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>+1</span>
                </Button>
              </div>
              
              <div className="mt-3 space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRetirement(1)}
                  className="w-full text-red-600 border-red-600 hover:bg-red-50"
                >
                  Retire
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleWalkover(1)}
                  className="w-full text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                >
                  Walkover Win
                </Button>
              </div>
            </div>

            {/* Player 2 Controls */}
            <div className="text-center">
              <h4 className="font-medium text-gray-900 mb-3">{match.player2.name}</h4>
              <div className="flex justify-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateScore(2, false)}
                  className="flex items-center space-x-1"
                >
                  <MinusIcon className="w-4 h-4" />
                  <span>-1</span>
                </Button>
                <div className="px-4 py-2 bg-red-100 rounded-lg text-xl font-bold text-red-800 min-w-[60px]">
                  {currentSet.player2Score}
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => updateScore(2, true)}
                  className="flex items-center space-x-1"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>+1</span>
                </Button>
              </div>
              
              <div className="mt-3 space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRetirement(2)}
                  className="w-full text-red-600 border-red-600 hover:bg-red-50"
                >
                  Retire
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleWalkover(2)}
                  className="w-full text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                >
                  Walkover Win
                </Button>
              </div>
            </div>
          </div>

          {/* Match Controls */}
          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-center">
            <Button
              variant="outline"
              onClick={resetMatch}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              Reset Match
            </Button>
          </div>
        </Card>
      )}

      {/* Match Completion Confirmation */}
      {showConfirmation && pendingWinner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4 p-6">
            <div className="text-center">
              <TrophyIcon className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
              <h3 className="text-lg font-semibold mb-2">Confirm Match Result</h3>
              <p className="text-gray-600 mb-6">
                Declare <strong>{pendingWinner === 1 ? match.player1.name : match.player2.name}</strong> as the winner?
                {currentScore.retired && ' (by retirement)'}
                {currentScore.walkover && ' (by walkover)'}
              </p>
              
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowConfirmation(false);
                    setPendingWinner(null);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleMatchComplete}
                  className="flex-1"
                >
                  Confirm Winner
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default LiveScoring;