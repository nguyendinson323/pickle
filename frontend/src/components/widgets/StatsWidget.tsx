import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardWidget from './DashboardWidget';
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface StatItem {
  id: string;
  label: string;
  value: number | string;
  previousValue?: number | string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  format?: 'number' | 'percentage' | 'currency' | 'text';
  icon?: React.ComponentType<{ className?: string }>;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray';
}

export interface StatsWidgetProps {
  title?: string;
  userId?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  statsType?: 'player' | 'club' | 'coach' | 'tournament' | 'general';
}

const StatsWidget: React.FC<StatsWidgetProps> = ({
  title = 'Performance Stats',
  userId,
  className,
  size = 'md',
  statsType = 'player'
}) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setError(null);
      // Mock data based on stats type
      let mockStats: StatItem[] = [];

      switch (statsType) {
        case 'player':
          mockStats = [
            {
              id: 'matches',
              label: 'Matches Played',
              value: 24,
              previousValue: 18,
              change: 33.3,
              changeType: 'increase',
              format: 'number',
              color: 'blue'
            },
            {
              id: 'winRate',
              label: 'Win Rate',
              value: 87.5,
              previousValue: 82.1,
              change: 5.4,
              changeType: 'increase',
              format: 'percentage',
              color: 'green'
            },
            {
              id: 'ranking',
              label: 'Current Ranking',
              value: 42,
              previousValue: 58,
              change: -16,
              changeType: 'increase', // Lower ranking number is better
              format: 'number',
              color: 'purple'
            },
            {
              id: 'nrtpLevel',
              label: 'NRTP Level',
              value: '4.0',
              previousValue: '3.5',
              changeType: 'increase',
              format: 'text',
              color: 'yellow'
            }
          ];
          break;

        case 'club':
          mockStats = [
            {
              id: 'members',
              label: 'Active Members',
              value: 156,
              previousValue: 142,
              change: 9.9,
              changeType: 'increase',
              format: 'number',
              color: 'blue'
            },
            {
              id: 'events',
              label: 'Events This Month',
              value: 12,
              previousValue: 8,
              change: 50,
              changeType: 'increase',
              format: 'number',
              color: 'green'
            },
            {
              id: 'revenue',
              label: 'Monthly Revenue',
              value: 24500,
              previousValue: 22100,
              change: 10.9,
              changeType: 'increase',
              format: 'currency',
              color: 'purple'
            },
            {
              id: 'satisfaction',
              label: 'Member Satisfaction',
              value: 94.2,
              previousValue: 91.8,
              change: 2.4,
              changeType: 'increase',
              format: 'percentage',
              color: 'yellow'
            }
          ];
          break;

        default:
          mockStats = [
            {
              id: 'activity',
              label: 'Daily Activity',
              value: 85,
              previousValue: 72,
              change: 18.1,
              changeType: 'increase',
              format: 'percentage',
              color: 'blue'
            }
          ];
      }

      setStats(mockStats);
    } catch (err) {
      setError('Failed to load statistics');
      console.error('Stats fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [userId, statsType]);

  const formatValue = (value: number | string, format: StatItem['format'] = 'number') => {
    if (typeof value === 'string') return value;

    switch (format) {
      case 'percentage':
        return `${value}%`;
      case 'currency':
        return new Intl.NumberFormat('es-MX', {
          style: 'currency',
          currency: 'MXN'
        }).format(value);
      case 'number':
        return value.toLocaleString();
      default:
        return value;
    }
  };

  const getColorClasses = (color: StatItem['color'] = 'gray') => {
    const colors = {
      blue: 'text-blue-600 bg-blue-100',
      green: 'text-green-600 bg-green-100',
      red: 'text-red-600 bg-red-100',
      yellow: 'text-yellow-600 bg-yellow-100',
      purple: 'text-purple-600 bg-purple-100',
      gray: 'text-gray-600 bg-gray-100'
    };
    return colors[color];
  };

  const renderStatCard = (stat: StatItem) => {
    const hasChange = stat.change !== undefined && stat.previousValue !== undefined;
    const isPositiveChange = stat.changeType === 'increase';

    return (
      <div key={stat.id} className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className={`p-2 rounded-lg ${getColorClasses(stat.color)}`}>
            {stat.icon ? (
              <stat.icon className="h-5 w-5" />
            ) : (
              <ChartBarIcon className="h-5 w-5" />
            )}
          </div>
          {hasChange && (
            <div className={`flex items-center text-sm ${
              isPositiveChange ? 'text-green-600' : 'text-red-600'
            }`}>
              {isPositiveChange ? (
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
              ) : (
                <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
              )}
              {Math.abs(stat.change!)}%
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <div className="text-2xl font-bold text-gray-900">
            {formatValue(stat.value, stat.format)}
          </div>
          <div className="text-sm text-gray-500">{stat.label}</div>
          {hasChange && (
            <div className="text-xs text-gray-400">
              vs {formatValue(stat.previousValue!, stat.format)} last period
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <DashboardWidget
      id={`stats-${statsType}`}
      title={title}
      subtitle={`Performance overview for ${statsType}`}
      className={className}
      size={size}
      loading={loading}
      error={error || undefined}
      refreshable
      expandable
      onRefresh={fetchStats}
      onExpand={() => navigate('/analytics')}
      actions={
        <button
          onClick={() => navigate('/analytics')}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          View Details
        </button>
      }
    >
      <div className="space-y-4">
        {stats.length === 0 ? (
          <div className="text-center py-8">
            <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-sm font-medium text-gray-900 mb-2">No statistics available</h3>
            <p className="text-sm text-gray-500">
              Statistics will appear here once you start playing.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stats.map(renderStatCard)}
          </div>
        )}
      </div>
    </DashboardWidget>
  );
};

export default StatsWidget;