import React from 'react';

export interface NotificationItemProps {
  id: string;
  type: 'tournament' | 'message' | 'system' | 'payment' | 'general';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority?: 'low' | 'medium' | 'high';
  actionUrl?: string;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  id,
  type,
  title,
  message,
  timestamp,
  read,
  priority = 'medium',
  actionUrl,
  onMarkAsRead,
  onDelete,
  onClick
}) => {
  const getTypeIcon = () => {
    switch (type) {
      case 'tournament':
        return '🏆';
      case 'message':
        return '💬';
      case 'system':
        return '⚙️';
      case 'payment':
        return '💳';
      default:
        return '🔔';
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'tournament':
        return 'text-yellow-600 bg-yellow-100';
      case 'message':
        return 'text-blue-600 bg-blue-100';
      case 'system':
        return 'text-gray-600 bg-gray-100';
      case 'payment':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-primary-600 bg-primary-100';
    }
  };

  const getPriorityColor = () => {
    switch (priority) {
      case 'high':
        return 'border-l-red-400';
      case 'medium':
        return 'border-l-yellow-400';
      case 'low':
        return 'border-l-green-400';
      default:
        return 'border-l-gray-400';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  const handleClick = () => {
    if (!read && onMarkAsRead) {
      onMarkAsRead(id);
    }
    if (onClick) {
      onClick(id);
    }
    if (actionUrl) {
      window.location.href = actionUrl;
    }
  };

  return (
    <div 
      className={`
        flex items-start space-x-3 p-3 border-l-2 cursor-pointer transition-colors
        ${getPriorityColor()}
        ${read ? 'bg-white hover:bg-gray-50' : 'bg-blue-50 hover:bg-blue-100'}
      `}
      onClick={handleClick}
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${getTypeColor()}`}>
        {getTypeIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className={`text-sm font-medium ${read ? 'text-gray-900' : 'text-gray-900 font-semibold'}`}>
              {title}
            </h4>
            <p className={`text-sm mt-1 ${read ? 'text-gray-600' : 'text-gray-700'}`}>
              {message}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {formatTimestamp(timestamp)}
            </p>
          </div>
          
          <div className="flex items-center space-x-1 ml-2">
            {!read && (
              <div className="w-2 h-2 bg-primary-500 rounded-full" title="Unread"></div>
            )}
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onMarkAsRead && !read) {
                  onMarkAsRead(id);
                }
              }}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
              title={read ? 'Already read' : 'Mark as read'}
            >
              {read ? '✓' : '○'}
            </button>
            
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(id);
                }}
                className="p-1 text-gray-400 hover:text-red-600 rounded"
                title="Delete notification"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;