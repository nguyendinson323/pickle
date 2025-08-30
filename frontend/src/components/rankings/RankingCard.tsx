import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

interface RankingCardProps {
  ranking: {
    id: number;
    playerId: number;
    position: number;
    points: number;
    previousPosition: number;
    previousPoints: number;
    category: string;
    rankingType: string;
    stateId?: number;
    ageGroup?: string;
    gender?: string;
    tournamentsPlayed: number;
    lastTournamentDate?: string;
    isActive: boolean;
    Player?: {
      firstName: string;
      lastName: string;
      nrtpLevel?: string;
      photo?: string;
    };
    State?: {
      name: string;
      abbreviation: string;
    };
  };
  showDetails?: boolean;
  onClick?: () => void;
}

export const RankingCard: React.FC<RankingCardProps> = ({ 
  ranking, 
  showDetails = false,
  onClick 
}) => {
  const getPositionChange = () => {
    const change = ranking.previousPosition - ranking.position;
    if (change > 0) return { type: 'up', value: change };
    if (change < 0) return { type: 'down', value: Math.abs(change) };
    return { type: 'same', value: 0 };
  };

  const getPointsChange = () => {
    const change = ranking.points - ranking.previousPoints;
    return change;
  };

  const formatCategory = (category: string) => {
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const formatRankingType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const positionChange = getPositionChange();
  const pointsChange = getPointsChange();

  return (
    <Card 
      className={`p-4 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          {/* Position */}
          <div className="flex flex-col items-center">
            <div className={`
              text-2xl font-bold 
              ${ranking.position <= 3 ? 'text-yellow-600' : 
                ranking.position <= 10 ? 'text-blue-600' : 
                'text-gray-700'}
            `}>
              #{ranking.position}
            </div>
            {positionChange.type !== 'same' && (
              <div className={`
                text-xs flex items-center
                ${positionChange.type === 'up' ? 'text-green-600' : 'text-red-600'}
              `}>
                {positionChange.type === 'up' ? '↗' : '↘'}
                {positionChange.value}
              </div>
            )}
          </div>

          {/* Player Info */}
          <div>
            <h3 className="font-semibold text-lg">
              {ranking.Player ? 
                `${ranking.Player.firstName} ${ranking.Player.lastName}` : 
                'Unknown Player'
              }
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              {ranking.Player?.nrtpLevel && (
                <Badge variant="secondary" size="sm">
                  {ranking.Player.nrtpLevel}
                </Badge>
              )}
              {ranking.State && (
                <span>{ranking.State.name}</span>
              )}
              {ranking.ageGroup && (
                <Badge variant="secondary" size="sm">
                  {ranking.ageGroup}
                </Badge>
              )}
              {ranking.gender && (
                <Badge variant="secondary" size="sm">
                  {ranking.gender === 'male' ? 'M' : 'F'}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Points and Status */}
        <div className="text-right">
          <div className="text-xl font-semibold text-blue-600">
            {ranking.points.toFixed(0)} pts
          </div>
          {pointsChange !== 0 && (
            <div className={`
              text-sm flex items-center justify-end
              ${pointsChange > 0 ? 'text-green-600' : 'text-red-600'}
            `}>
              {pointsChange > 0 ? '+' : ''}{pointsChange.toFixed(0)}
            </div>
          )}
          <div className="text-xs text-gray-500 mt-1">
            {ranking.tournamentsPlayed} tournaments
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm">
            <div>
              <span className="font-medium">{formatCategory(ranking.category)}</span>
              <span className="text-gray-500 ml-2">
                {formatRankingType(ranking.rankingType)}
              </span>
            </div>
            <div className={`
              px-2 py-1 rounded text-xs
              ${ranking.isActive ? 
                'bg-green-100 text-green-800' : 
                'bg-gray-100 text-gray-600'
              }
            `}>
              {ranking.isActive ? 'Active' : 'Inactive'}
            </div>
          </div>
          
          {ranking.lastTournamentDate && (
            <div className="text-xs text-gray-500 mt-2">
              Last tournament: {new Date(ranking.lastTournamentDate).toLocaleDateString()}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};