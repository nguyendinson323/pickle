import React from 'react';
import Card from '@/components/ui/Card';
import { StatCardProps } from '@/types/dashboard';

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  color = 'blue',
  loading = false,
  onClick
}) => {
  const colorStyles = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      value: 'text-blue-900',
      trend: 'text-blue-600'
    },
    green: {
      bg: 'bg-green-50',
      icon: 'text-green-600',
      value: 'text-green-900',
      trend: 'text-green-600'
    },
    yellow: {
      bg: 'bg-yellow-50',
      icon: 'text-yellow-600',
      value: 'text-yellow-900',
      trend: 'text-yellow-600'
    },
    red: {
      bg: 'bg-red-50',
      icon: 'text-red-600',
      value: 'text-red-900',
      trend: 'text-red-600'
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'text-purple-600',
      value: 'text-purple-900',
      trend: 'text-purple-600'
    },
    gray: {
      bg: 'bg-gray-50',
      icon: 'text-gray-600',
      value: 'text-gray-900',
      trend: 'text-gray-600'
    }
  };

  const styles = colorStyles[color];

  if (loading) {
    return (
      <Card padding="lg" hover={false}>
        <div className="animate-pulse">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-gray-200 w-12 h-12"></div>
            <div className="ml-4 flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      padding="lg" 
      hover={!!onClick}
      onClick={onClick}
      className="transition-all duration-200"
    >
      <div className="flex items-center">
        {icon && (
          <div className={`p-2 rounded-lg ${styles.bg} flex-shrink-0`}>
            <div className={`w-8 h-8 ${styles.icon}`}>
              {icon}
            </div>
          </div>
        )}
        
        <div className="ml-4 flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-500 mb-1 truncate">
            {title}
          </div>
          
          <div className={`text-2xl font-bold ${styles.value} mb-1`}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          
          {trend && (
            <div className="flex items-center text-sm">
              {trend.direction === 'up' ? (
                <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-red-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
              
              <span className={trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}>
                {Math.abs(trend.value)}%
              </span>
              
              {trend.label && (
                <span className="text-gray-500 ml-1">
                  {trend.label}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;