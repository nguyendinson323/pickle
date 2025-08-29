import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Tabs } from '../ui/Tabs';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Button } from '../ui/Button';

interface PlayerRankingProfileProps {
  playerId: number;
  onClose?: () => void;
}

interface Ranking {
  id: number;
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
  State?: {
    name: string;
  };
}

interface RankingHistory {
  id: number;
  rankingType: string;
  category: string;
  oldPosition: number;
  newPosition: number;
  oldPoints: number;
  newPoints: number;
  pointsChange: number;
  positionChange: number;
  changeReason: string;
  changeDate: string;
  Tournament?: {
    name: string;
    level: string;
  };
}

interface TournamentParticipation {
  id: number;
  tournamentId: number;
  basePoints: number;
  totalPoints: number;
  finalPlacement: number;
  totalPlayers: number;
  matchesWon: number;
  matchesLost: number;
  calculatedAt: string;
  Tournament: {
    name: string;
    level: string;
    startDate: string;
  };
}

export const PlayerRankingProfile: React.FC<PlayerRankingProfileProps> = ({
  playerId,
  onClose
}) => {
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [history, setHistory] = useState<RankingHistory[]>([]);
  const [tournaments, setTournaments] = useState<TournamentParticipation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('rankings');

  useEffect(() => {
    fetchPlayerData();
  }, [playerId]);

  const fetchPlayerData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [rankingsRes, historyRes, tournamentsRes] = await Promise.all([
        fetch(`/api/rankings/player/${playerId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch(`/api/rankings/history/${playerId}?limit=20`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch(`/api/tournaments/player/${playerId}/point-calculations?limit=10`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      if (!rankingsRes.ok || !historyRes.ok) {
        throw new Error('Failed to fetch player data');
      }

      const [rankingsData, historyData, tournamentsData] = await Promise.all([
        rankingsRes.json(),
        historyRes.json(),
        tournamentsRes.ok ? tournamentsRes.json() : { data: [] }
      ]);

      if (rankingsData.success) setRankings(rankingsData.data);
      if (historyData.success) setHistory(historyData.data);
      if (tournamentsData.success) setTournaments(tournamentsData.data || []);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
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

  const getPositionChangeIcon = (change: number) => {
    if (change > 0) return <span className="text-green-600">↗</span>;
    if (change < 0) return <span className="text-red-600">↘</span>;
    return <span className="text-gray-400">→</span>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <Button onClick={fetchPlayerData} variant="outline">
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  const tabs = [
    { id: 'rankings', label: 'Rankings Actuales', count: rankings.length },
    { id: 'history', label: 'Historial', count: history.length },
    { id: 'tournaments', label: 'Torneos', count: tournaments.length }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Perfil de Rankings</h2>
        {onClose && (
          <Button onClick={onClose} variant="outline">
            Cerrar
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'rankings' && (
          <div className="space-y-4">
            {rankings.length === 0 ? (
              <Card className="p-6 text-center text-gray-500">
                Este jugador no tiene rankings activos
              </Card>
            ) : (
              rankings.map((ranking) => (
                <Card key={ranking.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-3">
                        <div className={`
                          text-2xl font-bold
                          ${ranking.position <= 3 ? 'text-yellow-600' : 
                            ranking.position <= 10 ? 'text-blue-600' : 
                            'text-gray-700'}
                        `}>
                          #{ranking.position}
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {formatCategory(ranking.category)} - {formatRankingType(ranking.rankingType)}
                          </h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            {ranking.State && (
                              <Badge variant="outline" size="sm">
                                {ranking.State.name}
                              </Badge>
                            )}
                            {ranking.ageGroup && (
                              <Badge variant="outline" size="sm">
                                {ranking.ageGroup}
                              </Badge>
                            )}
                            {ranking.gender && (
                              <Badge variant="outline" size="sm">
                                {ranking.gender === 'male' ? 'M' : 'F'}
                              </Badge>
                            )}
                            <Badge 
                              variant={ranking.isActive ? 'success' : 'secondary'}
                              size="sm"
                            >
                              {ranking.isActive ? 'Activo' : 'Inactivo'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-semibold text-blue-600">
                        {ranking.points.toFixed(0)} pts
                      </div>
                      <div className="text-sm text-gray-500">
                        {ranking.tournamentsPlayed} torneos
                      </div>
                      {ranking.lastTournamentDate && (
                        <div className="text-xs text-gray-400">
                          Último: {new Date(ranking.lastTournamentDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            {history.length === 0 ? (
              <Card className="p-6 text-center text-gray-500">
                No hay historial de cambios disponible
              </Card>
            ) : (
              history.map((record) => (
                <Card key={record.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">
                        {formatCategory(record.category)} - {formatRankingType(record.rankingType)}
                      </h3>
                      <div className="text-sm text-gray-600 mt-1">
                        {record.changeReason}
                      </div>
                      {record.Tournament && (
                        <div className="text-sm text-blue-600 mt-1">
                          {record.Tournament.name} ({record.Tournament.level})
                        </div>
                      )}
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(record.changeDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm text-gray-500">
                          #{record.oldPosition} → #{record.newPosition}
                        </span>
                        {getPositionChangeIcon(record.positionChange)}
                      </div>
                      <div className={`
                        text-sm font-medium
                        ${record.pointsChange > 0 ? 'text-green-600' : 
                          record.pointsChange < 0 ? 'text-red-600' : 
                          'text-gray-600'}
                      `}>
                        {record.pointsChange > 0 ? '+' : ''}{record.pointsChange.toFixed(0)} pts
                      </div>
                      <div className="text-xs text-gray-500">
                        {record.oldPoints.toFixed(0)} → {record.newPoints.toFixed(0)}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === 'tournaments' && (
          <div className="space-y-4">
            {tournaments.length === 0 ? (
              <Card className="p-6 text-center text-gray-500">
                No hay participaciones en torneos registradas
              </Card>
            ) : (
              tournaments.map((tournament) => (
                <Card key={tournament.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">
                        {tournament.Tournament.name}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                        <Badge variant="outline" size="sm">
                          {tournament.Tournament.level}
                        </Badge>
                        <span>
                          {new Date(tournament.Tournament.startDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mt-2">
                        Posición final: #{tournament.finalPlacement} de {tournament.totalPlayers}
                      </div>
                      <div className="text-sm text-gray-600">
                        Partidos: {tournament.matchesWon}W - {tournament.matchesLost}L
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-blue-600">
                        {tournament.totalPoints.toFixed(0)} pts
                      </div>
                      <div className="text-sm text-gray-500">
                        Base: {tournament.basePoints.toFixed(0)}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(tournament.calculatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};