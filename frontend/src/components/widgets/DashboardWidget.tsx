import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  EllipsisVerticalIcon, 
  ArrowsPointingOutIcon,
  ArrowTopRightOnSquareIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

export interface DashboardWidgetProps {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  loading?: boolean;
  error?: string;
  refreshable?: boolean;
  expandable?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onRefresh?: () => void;
  onExpand?: () => void;
  onSettings?: () => void;
}

const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  id,
  title,
  subtitle,
  children,
  actions,
  loading = false,
  error,
  refreshable = false,
  expandable = false,
  className = '',
  size = 'md',
  onRefresh,
  onExpand,
  onSettings
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!onRefresh || isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'col-span-1 row-span-1 min-h-[200px]';
      case 'md':
        return 'col-span-1 md:col-span-2 row-span-1 min-h-[300px]';
      case 'lg':
        return 'col-span-1 md:col-span-3 row-span-2 min-h-[400px]';
      case 'xl':
        return 'col-span-1 md:col-span-4 row-span-2 min-h-[500px]';
      default:
        return 'col-span-1 md:col-span-2 row-span-1 min-h-[300px]';
    }
  };

  return (
    <Card className={`dashboard-widget ${getSizeClasses()} ${className} relative`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-gray-900 truncate">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-500 truncate">{subtitle}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          {actions}
          
          {/* Widget menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <EllipsisVerticalIcon className="h-5 w-5" />
            </button>
            
            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
                  {refreshable && (
                    <button
                      onClick={() => {
                        handleRefresh();
                        setShowMenu(false);
                      }}
                      disabled={isRefreshing}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <ArrowPathIcon className={`h-4 w-4 mr-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                      Refresh
                    </button>
                  )}
                  
                  {expandable && (
                    <button
                      onClick={() => {
                        onExpand?.();
                        setShowMenu(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <ArrowsPointingOutIcon className="h-4 w-4 mr-3" />
                      Expand
                    </button>
                  )}
                  
                  {onSettings && (
                    <button
                      onClick={() => {
                        onSettings();
                        setShowMenu(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-3" />
                      Settings
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-red-500 mb-2">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">Error loading data</h4>
            <p className="text-sm text-gray-500 mb-4">{error}</p>
            {refreshable && (
              <Button variant="secondary" size="sm" onClick={handleRefresh}>
                Try Again
              </Button>
            )}
          </div>
        ) : (
          <div className="h-full overflow-auto">
            {children}
          </div>
        )}
      </div>
      
      {/* Loading overlay */}
      {isRefreshing && !loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      )}
    </Card>
  );
};

export default DashboardWidget;