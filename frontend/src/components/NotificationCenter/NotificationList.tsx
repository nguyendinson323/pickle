import React from 'react';
import NotificationItem from './NotificationItem';
import NotificationFilters from './NotificationFilters';
import { Notification } from '../../types/notifications';
import styles from './NotificationList.module.css';

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

  const getNotificationIcon = (type: string, category: string) => {
    const iconMap: { [key: string]: string } = {
      'tournament': '🏆',
      'booking': '📅',
      'message': '💬',
      'match': '🎾',
      'payment': '💳',
      'maintenance': '🔧',
      'system': '⚙️'
    };

    const categoryIconMap: { [key: string]: string } = {
      'success': '✅',
      'warning': '⚠️',
      'error': '❌',
      'urgent': '🚨',
      'info': 'ℹ️'
    };

    return categoryIconMap[category] || iconMap[type] || '📢';
  };

  if (loading && notifications.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}>Loading notifications...</div>
      </div>
    );
  }

  const notificationGroups = groupNotificationsByDate(notifications);

  return (
    <div className={styles.notificationList}>
      <div className={styles.header}>
        <div className={styles.headerActions}>
          {unreadCount > 0 && (
            <button
              className={styles.markAllReadButton}
              onClick={onMarkAllAsRead}
            >
              Mark all as read ({unreadCount})
            </button>
          )}
        </div>
        
        <NotificationFilters
          filters={filters}
          onChange={onFilterChange}
        />
      </div>

      {notifications.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🔔</div>
          <h3>No notifications</h3>
          <p>You're all caught up! New notifications will appear here.</p>
        </div>
      ) : (
        <div className={styles.notificationsContainer}>
          {Object.entries(notificationGroups).map(([date, dateNotifications]) => (
            <div key={date} className={styles.dateGroup}>
              <div className={styles.dateDivider}>
                <span className={styles.dateLabel}>{formatDate(date)}</span>
              </div>
              
              {dateNotifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  icon={getNotificationIcon(notification.type, notification.category)}
                  onMarkAsRead={onMarkAsRead}
                  onDelete={onDelete}
                />
              ))}
            </div>
          ))}

          {hasMore && (
            <div className={styles.loadMoreContainer}>
              <button
                className={styles.loadMoreButton}
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