import { useState, useEffect, useCallback } from 'react';
import { useAppSelector } from '@/store';
import { selectCurrentUser } from '@/store/authSlice';
import apiService from '@/services/api';

export type UserRole = 'player' | 'coach' | 'club' | 'partner' | 'state' | 'admin';

export const useDashboardData = (role?: UserRole) => {
  const user = useAppSelector(selectCurrentUser);
  const userRole = role || (user?.role as UserRole);
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const endpoints: Record<UserRole, string> = {
    admin: '/dashboard/admin',
    state: '/dashboard/state',
    club: '/dashboard/club',
    partner: '/dashboard/partner',
    coach: '/dashboard/coach',
    player: '/dashboard/player'
  };

  const fetchData = useCallback(async () => {
    if (!userRole) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const endpoint = endpoints[userRole] || endpoints.player;
      const response = await apiService.get(endpoint);
      setData(response);
    } catch (err: any) {
      console.error('Dashboard data fetch failed:', err);
      setError(err.message || 'Failed to load dashboard data');
      
      // Provide fallback data structure
      setData({
        statistics: {},
        recentActivity: [],
        notifications: { unread: 0 }
      });
    } finally {
      setLoading(false);
    }
  }, [userRole]);

  useEffect(() => {
    fetchData();
    
    // Refresh data every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, loading, error, refresh: fetchData };
};

export const useNotifications = () => {
  const [notifications, setNotifications] = useState({
    unread: 0,
    total: 0,
    latest: []
  });

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await apiService.get('/notifications/summary');
        setNotifications(response);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        // Keep default empty state
      }
    };

    fetchNotifications();
    
    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return notifications;
};

export default useDashboardData;