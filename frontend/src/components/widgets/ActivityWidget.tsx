import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardWidget from './DashboardWidget';
import { 
  ClockIcon, 
  TrophyIcon, 
  UserGroupIcon,
  MapPinIcon,
  StarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

interface ActivityItem {
  id: string;
  type: 'match' | 'tournament' | 'training' | 'achievement' | 'social' | 'update';
  title: string;
  description: string;
  timestamp: Date;
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'red' | 'gray';
  actionable?: boolean;
  actionText?: string;
  actionUrl?: string;
}

export interface ActivityWidgetProps {
  userId?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  limit?: number;
}

const ActivityWidget: React.FC<ActivityWidgetProps> = ({
  userId,
  className,
  size = 'md',
  limit = 5
}) => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async () => {
    try {
      setError(null);
      // Mock data - in real implementation, fetch from API
      const mockActivities: ActivityItem[] = [
        {
          id: '1',
          type: 'tournament',
          title: 'Tournament Registration',
          description: 'Registered for Mexico National Championship 2024',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          icon: TrophyIcon,
          color: 'green',
          actionable: true,
          actionText: 'View Tournament',
          actionUrl: '/tournaments/1'
        },
        {
          id: '2',
          type: 'achievement',
          title: 'NRTP Level Updated',
          description: 'Your NRTP level has been updated to 4.0',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          icon: StarIcon,
          color: 'yellow',
          actionable: true,
          actionText: 'View Profile',
          actionUrl: '/profile'
        },
        {
          id: '3',
          type: 'match',
          title: 'Match Result',
          description: 'Won against Carlos Rodriguez (6-4, 6-2)',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          icon: TrophyIcon,
          color: 'blue',
          actionable: true,
          actionText: 'View Match',
          actionUrl: '/matches/123'
        },
        {
          id: '4',
          type: 'social',
          title: 'New Connection',
          description: 'Connected with Maria Gonzalez from Club Deportivo',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
          icon: UserGroupIcon,
          color: 'purple',
          actionable: true,
          actionText: 'View Profile',
          actionUrl: '/players/maria-gonzalez'
        },
        {
          id: '5',
          type: 'training',
          title: 'Training Session',
          description: 'Completed advanced serve technique training',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          icon: MapPinIcon,
          color: 'green',
          actionable: false
        },
        {
          id: '6',
          type: 'update',
          title: 'Profile Updated',
          description: 'Updated contact information and preferences',
          timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
          icon: DocumentTextIcon,
          color: 'gray',
          actionable: true,
          actionText: 'View Profile',
          actionUrl: '/profile'
        }
      ];

      // Apply limit and sort by timestamp
      const limitedActivities = mockActivities
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, limit);

      setActivities(limitedActivities);
    } catch (err) {
      setError('Failed to load activity');
      console.error('Activity fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [userId, limit]);

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 60) {
      return minutes < 1 ? 'Just now' : `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else if (days < 7) {
      return `${days}d ago`;
    } else {
      return timestamp.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const getColorClasses = (color: ActivityItem['color']) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      red: 'bg-red-100 text-red-600',
      gray: 'bg-gray-100 text-gray-600'
    };
    return colors[color];
  };

  const renderActivityItem = (activity: ActivityItem) => (
    <div key={activity.id} className="flex items-start space-x-3 py-3 hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors">
      <div className={`p-2 rounded-full flex-shrink-0 ${getColorClasses(activity.color)}`}>
        <activity.icon className="h-4 w-4" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="text-sm font-medium text-gray-900 mb-1">
              {activity.title}
            </h4>
            <p className="text-sm text-gray-600 mb-2">
              {activity.description}
            </p>
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500 flex items-center">
                <ClockIcon className="h-3 w-3 mr-1" />
                {formatTimestamp(activity.timestamp)}
              </p>
              {activity.actionable && (
                <button
                  onClick={() => activity.actionUrl && navigate(activity.actionUrl)}
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                >
                  {activity.actionText}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardWidget
      id="activity"
      title="Recent Activity"
      subtitle={`Last ${activities.length} activities`}
      className={className}
      size={size}
      loading={loading}
      error={error || undefined}
      refreshable
      expandable
      onRefresh={fetchActivities}
      onExpand={() => navigate('/activity')}
      actions={
        <button
          onClick={() => navigate('/activity')}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          View All
        </button>
      }
    >
      <div className="space-y-1">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-sm font-medium text-gray-900 mb-2">No recent activity</h3>
            <p className="text-sm text-gray-500">
              Your activities will appear here as you use the platform.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {activities.map(renderActivityItem)}
          </div>
        )}
      </div>
    </DashboardWidget>
  );
};

export default ActivityWidget;