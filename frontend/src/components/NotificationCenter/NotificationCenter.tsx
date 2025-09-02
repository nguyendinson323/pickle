import React, { useState, useEffect, useCallback } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { useAuth } from '../../hooks/useAuth';
import NotificationList from './NotificationList';
import NotificationPreferences from './NotificationPreferences';
import { Notification, NotificationPreferences as NotificationPrefsType } from '../../types/notifications';
import styles from './NotificationCenter.module.css';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'notifications' | 'preferences';

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose
}) => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [activeTab, setActiveTab] = useState<Tab>('notifications');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPrefsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMoreNotifications, setHasMoreNotifications] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    isRead: ''
  });

  // Load notifications
  const loadNotifications = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    try {
      const queryParams = new URLSearchParams({
        page: pageNum.toString(),
        limit: '20',
        ...(filters.type && { type: filters.type }),
        ...(filters.category && { category: filters.category }),
        ...(filters.isRead && { isRead: filters.isRead })
      });

      const response = await fetch(`/api/notifications?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load notifications');
      }

      const data = await response.json();
      const newNotifications = data.data.notifications;

      if (append) {
        setNotifications(prev => [...prev, ...newNotifications]);
      } else {
        setNotifications(newNotifications);
      }

      setUnreadCount(data.data.unreadCount);
      setHasMoreNotifications(newNotifications.length === 20);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load notifications:', error);
      setLoading(false);
    }
  }, [filters]);

  // Load preferences
  const loadPreferences = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications/preferences', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load preferences');
      }

      const data = await response.json();
      setPreferences(data.data);
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    if (isOpen && user) {
      loadNotifications();
      loadPreferences();
    }
  }, [isOpen, user, loadNotifications, loadPreferences]);

  // Reload when filters change
  useEffect(() => {
    if (isOpen) {
      setPage(1);
      loadNotifications(1, false);
    }
  }, [filters, isOpen, loadNotifications]);

  // Socket event handlers
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (data: { notification: Notification }) => {
      setNotifications(prev => [data.notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    };

    socket.on('notification:new', handleNewNotification);

    return () => {
      socket.off('notification:new', handleNewNotification);
    };
  }, [socket]);

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getToken()}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, isRead: true, readAt: new Date() }
            : notification
        )
      );

      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/read-all', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read');
      }

      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({
          ...notification,
          isRead: true,
          readAt: new Date()
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }

      // Update local state
      const deletedNotification = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      if (deletedNotification && !deletedNotification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const updatePreferences = async (newPreferences: Partial<NotificationPrefsType>) => {
    try {
      const response = await fetch('/api/notifications/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newPreferences)
      });

      if (!response.ok) {
        throw new Error('Failed to update preferences');
      }

      const data = await response.json();
      setPreferences(data.data);
    } catch (error) {
      console.error('Failed to update preferences:', error);
      throw error;
    }
  };

  const loadMoreNotifications = async () => {
    if (!hasMoreNotifications || loading) return;
    
    const nextPage = page + 1;
    setPage(nextPage);
    await loadNotifications(nextPage, true);
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.notificationCenter}>
        <div className={styles.header}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'notifications' ? styles.active : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              Notifications
              {unreadCount > 0 && (
                <span className={styles.unreadBadge}>{unreadCount}</span>
              )}
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'preferences' ? styles.active : ''}`}
              onClick={() => setActiveTab('preferences')}
            >
              Settings
            </button>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.content}>
          {activeTab === 'notifications' && (
            <NotificationList
              notifications={notifications}
              loading={loading}
              hasMore={hasMoreNotifications}
              unreadCount={unreadCount}
              filters={filters}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
              onDelete={deleteNotification}
              onLoadMore={loadMoreNotifications}
              onFilterChange={handleFilterChange}
            />
          )}

          {activeTab === 'preferences' && preferences && (
            <NotificationPreferences
              preferences={preferences}
              onUpdate={updatePreferences}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;