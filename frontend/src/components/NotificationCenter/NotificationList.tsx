import React from 'react';
import NotificationItem from './NotificationItem';
import { Notification } from '../../types/notifications';

interface NotificationListProps {
  notifications: Notification[];
  loading: boolean;
  hasMore: boolean;
  unreadCount: number;
  filters: {
    type: string;
    category: string;
    isRead: string;
  };
  onMarkAsRead: (notificationId: string) => Promise<void>;
  onMarkAllAsRead: () => Promise<void>;
  onDelete: (notificationId: string) => Promise<void>;
  onLoadMore: () => Promise<void>;
  onFilterChange: (filters: { type: string; category: string; isRead: string; }) => void;
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  loading,
  hasMore,
  unreadCount,
  filters,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onLoadMore,
  onFilterChange
}) => {
  const groupNotificationsByDate = (notifications: Notification[]) => {
    const groups: { [date: string]: Notification[] } = {};
    
    notifications.forEach(notification => {
      const date = new Date(notification.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notification);
    });

    return groups;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };


  if (loading && notifications.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading notifications...</div>
      </div>
    );
  }

  const notificationGroups = groupNotificationsByDate(notifications);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              onClick={onMarkAllAsRead}
            >
              Mark all as read ({unreadCount})
            </button>
          )}
        </div>
        
        <div className="flex gap-2">
          <select
            value={filters.type}
            onChange={(e) => onFilterChange({ ...filters, type: e.target.value })}
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="tournament">Tournament</option>
            <option value="message">Message</option>
            <option value="system">System</option>
            <option value="payment">Payment</option>
          </select>
          <select
            value={filters.isRead}
            onChange={(e) => onFilterChange({ ...filters, isRead: e.target.value })}
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            <option value="false">Unread</option>
            <option value="true">Read</option>
          </select>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <div className="text-4xl mb-4">🔔</div>
          <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
          <p className="text-sm mt-1 text-gray-500">You're all caught up! New notifications will appear here.</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {Object.entries(notificationGroups).map(([date, dateNotifications]) => (
            <div key={date} className="mb-4">
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">{formatDate(date)}</span>
              </div>
              
              {dateNotifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  id={notification.id}
                  type={notification.type as 'tournament' | 'message' | 'system' | 'payment' | 'general'}
                  title={notification.title}
                  message={notification.message}
                  timestamp={new Date(notification.createdAt)}
                  read={notification.isRead}
                  priority={'medium'}
                  actionUrl={notification.actionUrl}
                  onMarkAsRead={onMarkAsRead}
                  onDelete={onDelete}
                />
              ))}
            </div>
          ))}

          {hasMore && (
            <div className="flex justify-center py-4 border-t border-gray-200">
              <button
                className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={onLoadMore}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load more notifications'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationList;