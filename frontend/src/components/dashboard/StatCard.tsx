import React from 'react';
import {
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/20/solid';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: number;
  color?: 'default' | 'green' | 'red' | 'blue' | 'yellow' | 'purple' | 'indigo' | 'cyan';
  className?: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'default',
  className = '',
  onClick
}) => {
  const getColorClasses = (colorName: string) => {
    const colors = {
      default: 'text-gray-500',
      green: 'text-green-500',
      red: 'text-red-500',
      blue: 'text-blue-500',
      yellow: 'text-yellow-500',
      purple: 'text-purple-500',
      indigo: 'text-indigo-500',
      cyan: 'text-cyan-500'
    };
    return colors[colorName as keyof typeof colors] || colors.default;
  };

  return (
    <div 
      className={`bg-white overflow-hidden shadow-sm border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center">
        {icon && (
          <div className="flex-shrink-0">
            <div className={getColorClasses(color)}>
              {icon}
            </div>
          </div>
        )}
        <div className={`w-0 flex-1 ${icon ? 'ml-5' : ''}`}>
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">
              {title}
            </dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">
                {value}
              </div>
              {trend !== undefined && (
                <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                  trend > 0 
                    ? 'text-green-600' 
                    : trend < 0 
                    ? 'text-red-600' 
                    : 'text-gray-600'
                }`}>
                  {trend > 0 ? (
                    <ArrowUpIcon className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                  ) : trend < 0 ? (
                    <ArrowDownIcon className="self-center flex-shrink-0 h-4 w-4 text-red-500" />
                  ) : null}
                  <span className="sr-only">
                    {trend > 0 ? 'Increased' : 'Decreased'} by
                  </span>
                  {Math.abs(trend)}%
                </div>
              )}
            </dd>
            {subtitle && (
              <dd className="text-sm text-gray-600 mt-1">
                {subtitle}
              </dd>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default StatCard;