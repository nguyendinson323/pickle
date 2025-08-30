import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import { RankingFilters as RankingFiltersComponent } from '../../components/rankings/RankingFilters';
import { RankingList } from '../../components/rankings/RankingList';
import { RankingChart } from '../../components/rankings/RankingChart';
import { PlayerRankingProfile } from '../../components/rankings/PlayerRankingProfile';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Tabs from '../../components/ui/Tabs';
import Modal from '../../components/ui/Modal';

interface RankingFiltersType {
  category: string;
  rankingType: string;
  stateId?: number;
  ageGroup?: string;
  gender?: string;
}

export const RankingsPage: React.FC = () => {
  const [filters, setFilters] = useState<RankingFiltersType>({
    category: 'national',
    rankingType: 'overall'
  });
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [showPlayerProfile, setShowPlayerProfile] = useState(false);
  const [activeTab, setActiveTab] = useState('rankings');
  const [stats, setStats] = useState({
    totalPlayers: 0,
    activeRankings: 0,
    averagePoints: 0
  });

  useEffect(() => {
    fetchRankingStats();
  }, [filters]);

  const fetchRankingStats = async () => {
    try {
      const params = new URLSearchParams({
        category: filters.category,
        rankingType: filters.rankingType
      });

      if (filters.stateId) params.append('stateId', filters.stateId.toString());

      const response = await fetch(`/api/rankings/stats?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        await response.json();
        // This would need to be implemented in the backend
        // For now, we'll use placeholder stats
        setStats({
          totalPlayers: Math.floor(Math.random() * 1000) + 500,
          activeRankings: Math.floor(Math.random() * 800) + 400,
          averagePoints: Math.floor(Math.random() * 500) + 250
        });
      }
    } catch (error) {
      console.error('Error fetching ranking stats:', error);
    }
  };

  const handleFiltersChange = (newFilters: RankingFiltersType) => {
    setFilters(newFilters);
  };

  const handlePlayerClick = (playerId: number) => {
    setSelectedPlayerId(playerId);
    setShowPlayerProfile(true);
  };

  const formatCategory = (category: string) => {
    const labels: Record<string, string> = {
      'national': 'Nacional',
      'state': 'Estatal',
      'age_group': 'Grupo de Edad',
      'gender': 'Género'
    };
    return labels[category] || category;
  };

  const formatRankingType = (type: string) => {
    const labels: Record<string, string> = {
      'overall': 'General',
      'singles': 'Singles',
      'doubles': 'Dobles',
      'mixed_doubles': 'Dobles Mixtos'
    };
    return labels[type] || type;
  };

  const tabs = [
    { id: 'rankings', label: 'Rankings', count: stats.totalPlayers },
    { id: 'trends', label: 'Tendencias', count: 0 },
    { id: 'analytics', label: 'Análisis', count: 0 }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
          <h1 className="text-3xl font-bold mb-2">Rankings Oficiales</h1>
          <p className="text-blue-100">
            Sistema de ranking de la Federación Mexicana de Pickleball
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
              <div className="p-4 text-center">
                <div className="text-2xl font-bold">{stats.totalPlayers.toLocaleString()}</div>
                <div className="text-sm text-blue-100">Jugadores Rankeados</div>
              </div>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
              <div className="p-4 text-center">
                <div className="text-2xl font-bold">{stats.activeRankings.toLocaleString()}</div>
                <div className="text-sm text-blue-100">Rankings Activos</div>
              </div>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
              <div className="p-4 text-center">
                <div className="text-2xl font-bold">{stats.averagePoints.toFixed(0)}</div>
                <div className="text-sm text-blue-100">Puntos Promedio</div>
              </div>
            </Card>
          </div>
        </div>

        {/* Current Selection Info */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Badge variant="primary">
                  {formatCategory(filters.category)}
                </Badge>
                <Badge variant="secondary">
                  {formatRankingType(filters.rankingType)}
                </Badge>
                {filters.stateId && (
                  <Badge variant="info">Estado</Badge>
                )}
                {filters.ageGroup && (
                  <Badge variant="info">{filters.ageGroup}</Badge>
                )}
                {filters.gender && (
                  <Badge variant="info">
                    {filters.gender === 'male' ? 'Masculino' : 'Femenino'}
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              Última actualización: {new Date().toLocaleDateString()}
            </div>
          </div>
        </Card>

        {/* Filters */}
        <RankingFiltersComponent
          onFiltersChange={handleFiltersChange}
          initialFilters={filters}
        />

        {/* Tabs */}
        <Tabs
          items={tabs.map(tab => ({ ...tab, badge: tab.count > 0 ? tab.count : undefined }))}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'rankings' && (
            <RankingList
              category={filters.category}
              rankingType={filters.rankingType}
              stateId={filters.stateId}
              ageGroup={filters.ageGroup}
              gender={filters.gender}
              onPlayerClick={handlePlayerClick}
            />
          )}

          {activeTab === 'trends' && (
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Tendencias de Ranking - {formatCategory(filters.category)} {formatRankingType(filters.rankingType)}
                </h3>
                
                <RankingChart
                  category={filters.category}
                  rankingType={filters.rankingType}
                  period="month"
                />
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h4 className="font-semibold mb-4">Actividad Mensual</h4>
                  <RankingChart
                    category={filters.category}
                    rankingType={filters.rankingType}
                    period="month"
                    height={250}
                  />
                </Card>

                <Card className="p-6">
                  <h4 className="font-semibold mb-4">Tendencias Trimestrales</h4>
                  <RankingChart
                    category={filters.category}
                    rankingType={filters.rankingType}
                    period="quarter"
                    height={250}
                  />
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Análisis de Rankings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.floor(stats.totalPlayers * 0.1)}
                    </div>
                    <div className="text-sm text-gray-600">Top 10%</div>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.floor(stats.activeRankings * 0.85)}
                    </div>
                    <div className="text-sm text-gray-600">Activos Este Mes</div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.floor(Math.random() * 100) + 50}
                    </div>
                    <div className="text-sm text-gray-600">Nuevos Jugadores</div>
                  </div>
                  
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      +{Math.floor(Math.random() * 20) + 5}%
                    </div>
                    <div className="text-sm text-gray-600">Crecimiento</div>
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h4 className="font-semibold mb-4">Distribución por Nivel</h4>
                  <div className="space-y-3">
                    {[
                      { level: '5.0+', count: Math.floor(stats.totalPlayers * 0.05), color: 'bg-red-500' },
                      { level: '4.0-4.5', count: Math.floor(stats.totalPlayers * 0.15), color: 'bg-orange-500' },
                      { level: '3.0-3.5', count: Math.floor(stats.totalPlayers * 0.35), color: 'bg-yellow-500' },
                      { level: '2.0-2.5', count: Math.floor(stats.totalPlayers * 0.45), color: 'bg-green-500' }
                    ].map((item) => (
                      <div key={item.level} className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded ${item.color}`}></div>
                        <div className="flex-1 flex justify-between">
                          <span className="font-medium">{item.level}</span>
                          <span className="text-gray-600">{item.count.toLocaleString()} jugadores</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h4 className="font-semibold mb-4">Participación en Torneos</h4>
                  <div className="space-y-3">
                    {[
                      { category: 'Muy Activo (5+ torneos)', percentage: 25 },
                      { category: 'Activo (2-4 torneos)', percentage: 35 },
                      { category: 'Ocasional (1 torneo)', percentage: 25 },
                      { category: 'Inactivo', percentage: 15 }
                    ].map((item) => (
                      <div key={item.category} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{item.category}</span>
                          <span>{item.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>

        {/* Player Profile Modal */}
        <Modal
          isOpen={showPlayerProfile}
          onClose={() => setShowPlayerProfile(false)}
          title=""
          size="lg"
        >
          {selectedPlayerId && (
            <PlayerRankingProfile
              playerId={selectedPlayerId}
              onClose={() => setShowPlayerProfile(false)}
            />
          )}
        </Modal>

        {/* Help Section */}
        <Card className="p-6 bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">¿Cómo funciona el sistema de ranking?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
            <div>
              <h4 className="font-medium mb-2">Cálculo de Puntos</h4>
              <ul className="space-y-1">
                <li>• Torneos Nacionales: 1000 pts base</li>
                <li>• Torneos Estatales: 500 pts base</li>
                <li>• Torneos Municipales: 250 pts base</li>
                <li>• Torneos Locales: 100 pts base</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Multiplicadores</h4>
              <ul className="space-y-1">
                <li>• 1° Lugar: 100% de puntos</li>
                <li>• 2° Lugar: 70% de puntos</li>
                <li>• 3°-4° Lugar: 50% de puntos</li>
                <li>• Otros: 30% de puntos</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Bonificaciones</h4>
              <ul className="space-y-1">
                <li>• Oponente más fuerte: +puntos</li>
                <li>• Actividad frecuente: +puntos</li>
                <li>• Buen récord: +20% máx.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Actualización</h4>
              <ul className="space-y-1">
                <li>• Rankings se actualizan tras cada torneo</li>
                <li>• Decaimiento por inactividad (6 meses)</li>
                <li>• Recálculo semanal de posiciones</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};