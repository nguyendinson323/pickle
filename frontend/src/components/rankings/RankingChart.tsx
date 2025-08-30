import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import LoadingSpinner from '../common/LoadingSpinner';

interface RankingChartProps {
  playerId?: number;
  category?: string;
  rankingType?: string;
  period?: 'week' | 'month' | 'quarter' | 'year';
  height?: number;
}

interface ChartDataPoint {
  period: string;
  totalChanges: number;
  activePlayers: number;
  averagePointsChange: number;
  positiveChanges: number;
  negativeChanges: number;
}

export const RankingChart: React.FC<RankingChartProps> = ({
  playerId,
  category = 'national',
  rankingType = 'overall',
  period = 'month',
  height = 300
}) => {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewType, setViewType] = useState<'changes' | 'points' | 'players'>('changes');

  useEffect(() => {
    fetchTrendData();
  }, [playerId, category, rankingType, period]);

  const fetchTrendData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        category,
        rankingType,
        period,
        limit: '12'
      });

      if (playerId) params.append('playerId', playerId.toString());

      const response = await fetch(`/api/rankings/trends?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch trend data');
      }

      const result = await response.json();
      if (result.success) {
        setData(result.data.reverse()); // Show oldest first
      } else {
        throw new Error('Failed to load trend data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatPeriod = (period: string) => {
    const date = new Date(period);
    return date.toLocaleDateString('es-ES', { 
      month: 'short', 
      year: '2-digit' 
    });
  };

  const getMaxValue = () => {
    if (data.length === 0) return 100;
    
    switch (viewType) {
      case 'changes':
        return Math.max(...data.map(d => d.totalChanges));
      case 'points':
        return Math.max(...data.map(d => Math.abs(d.averagePointsChange)));
      case 'players':
        return Math.max(...data.map(d => d.activePlayers));
      default:
        return 100;
    }
  };

  const renderChart = () => {
    if (data.length === 0) return null;

    const maxValue = getMaxValue();
    const chartHeight = height - 60; // Account for labels
    const chartWidth = 400;
    const barWidth = Math.max(20, chartWidth / data.length - 10);
    
    return (
      <div className="relative" style={{ height: height }}>
        <svg width="100%" height={height} className="overflow-visible">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <line
              key={ratio}
              x1="50"
              y1={40 + (chartHeight - 40) * ratio}
              x2="100%"
              y2={40 + (chartHeight - 40) * ratio}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}

          {/* Bars */}
          {data.map((point, index) => {
            let value: number;
            let color: string;

            switch (viewType) {
              case 'changes':
                value = point.totalChanges;
                color = '#3b82f6';
                break;
              case 'points':
                value = Math.abs(point.averagePointsChange);
                color = point.averagePointsChange >= 0 ? '#10b981' : '#ef4444';
                break;
              case 'players':
                value = point.activePlayers;
                color = '#8b5cf6';
                break;
              default:
                value = 0;
                color = '#6b7280';
            }

            const barHeight = (value / maxValue) * (chartHeight - 60);
            const x = 60 + index * (barWidth + 10);
            const y = chartHeight - barHeight - 20;

            return (
              <g key={index}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={color}
                  rx="2"
                  className="hover:opacity-80 transition-opacity"
                />
                <text
                  x={x + barWidth / 2}
                  y={chartHeight - 5}
                  textAnchor="middle"
                  className="text-xs fill-gray-600"
                >
                  {formatPeriod(point.period)}
                </text>
                <text
                  x={x + barWidth / 2}
                  y={y - 5}
                  textAnchor="middle"
                  className="text-xs fill-gray-800 font-medium"
                >
                  {viewType === 'points' ? value.toFixed(1) : value}
                </text>
              </g>
            );
          })}

          {/* Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <text
              key={ratio}
              x="45"
              y={40 + (chartHeight - 40) * ratio + 4}
              textAnchor="end"
              className="text-xs fill-gray-600"
            >
              {Math.round(maxValue * (1 - ratio))}
            </text>
          ))}
        </svg>
      </div>
    );
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex justify-center items-center" style={{ height: height }}>
          <LoadingSpinner />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <Button onClick={fetchTrendData} variant="outline" size="sm">
            Reintentar
          </Button>
        </div>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500" style={{ height: height }}>
          No hay datos suficientes para mostrar el gráfico
        </div>
      </Card>
    );
  }

  const viewOptions = [
    { value: 'changes', label: 'Total de Cambios' },
    { value: 'points', label: 'Promedio de Puntos' },
    { value: 'players', label: 'Jugadores Activos' }
  ];

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">
          Tendencias de Ranking {playerId ? '- Jugador' : '- General'}
        </h3>
        <div className="flex space-x-2">
          {viewOptions.map((option) => (
            <Button
              key={option.value}
              onClick={() => setViewType(option.value as any)}
              variant={viewType === option.value ? 'primary' : 'outline'}
              size="sm"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Chart */}
      {renderChart()}

      {/* Legend */}
      <div className="mt-4 flex justify-center space-x-6 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded ${
            viewType === 'changes' ? 'bg-blue-500' : 
            viewType === 'points' ? 'bg-green-500' : 
            'bg-purple-500'
          }`}></div>
          <span>
            {viewType === 'changes' && 'Cambios de ranking'}
            {viewType === 'points' && 'Cambio promedio de puntos'}
            {viewType === 'players' && 'Jugadores con actividad'}
          </span>
        </div>
      </div>

      {/* Summary Stats */}
      {data.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {data.reduce((sum, d) => sum + d.totalChanges, 0)}
            </div>
            <div className="text-sm text-gray-600">Total de cambios</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              +{data.reduce((sum, d) => sum + d.positiveChanges, 0)}
            </div>
            <div className="text-sm text-gray-600">Cambios positivos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(data.reduce((sum, d) => sum + d.activePlayers, 0) / data.length)}
            </div>
            <div className="text-sm text-gray-600">Promedio jugadores activos</div>
          </div>
        </div>
      )}
    </Card>
  );
};