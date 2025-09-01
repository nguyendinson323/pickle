import { useState, useEffect } from 'react';
import apiService from '@/services/api';

interface NotificationSummary {
  unread: number;
  total: number;
  latest: Array<{
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    timestamp: string;
    read: boolean;
  }>;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationSummary>({
    unread: 0,
    total: 0,
    latest: []
  });

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await apiService.get<NotificationSummary>('/notifications/summary');
        setNotifications((response as any).data || response);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        // Fallback to default values on error
        setNotifications({
          unread: 0,
          total: 0,
          latest: []
        });
      }
    };

    fetchNotifications();
    
    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return notifications;
};