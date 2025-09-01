import { useEffect, useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { selectUser } from '@/store/authSlice';
import apiService from '@/services/api';

// Real-time data refresh intervals (in milliseconds)
const REFRESH_INTERVALS = {
  DASHBOARD_STATS: 30000, // 30 seconds
  NOTIFICATIONS: 15000, // 15 seconds
  MESSAGES: 10000, // 10 seconds
  TOURNAMENTS: 60000, // 1 minute
  ACTIVITY: 45000, // 45 seconds
};

export interface UseRealTimeDataOptions {
  interval?: number;
  enabled?: boolean;
  onError?: (error: any) => void;
  dependencies?: any[];
}

export const useRealTimeData = <T>(
  fetchFunction: () => Promise<T>,
  options: UseRealTimeDataOptions = {}
) => {
  const {
    interval = REFRESH_INTERVALS.DASHBOARD_STATS,
    enabled = true,
    onError,
    dependencies = []
  } = options;

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    if (!enabled || !mountedRef.current) return;

    try {
      await fetchFunction();
    } catch (error) {
      console.error('Real-time data fetch error:', error);
      if (onError) {
        onError(error);
      }
    }
  }, [fetchFunction, enabled, onError]);

  useEffect(() => {
    if (!enabled) return;

    // Initial fetch
    fetchData();

    // Set up interval for subsequent fetches
    intervalRef.current = setInterval(fetchData, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchData, interval, enabled, ...dependencies]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);
};

// Hook for dashboard statistics
export const useDashboardStats = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const fetchDashboardStats = useCallback(async () => {
    if (!user) return;
    
    // This would dispatch the actual action to fetch dashboard data
    // For now, we'll simulate with a direct API call
    const response = await apiService.get('/dashboard/statistics');
    // The response would be handled by the appropriate slice
    return response;
  }, [dispatch, user]);

  useRealTimeData(fetchDashboardStats, {
    interval: REFRESH_INTERVALS.DASHBOARD_STATS,
    enabled: !!user,
    dependencies: [user?.id]
  });
};

// Hook for real-time notifications
export const useRealtimeNotifications = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    
    const response = await apiService.get('/notifications/unread');
    // Update notification count in store
    return response;
  }, [dispatch, user]);

  useRealTimeData(fetchNotifications, {
    interval: REFRESH_INTERVALS.NOTIFICATIONS,
    enabled: !!user,
    dependencies: [user?.id]
  });
};

// Hook for real-time messages
export const useRealtimeMessages = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const fetchMessages = useCallback(async () => {
    if (!user) return;
    
    const response = await apiService.get('/messages/unread-count');
    // Update message count in store
    return response;
  }, [dispatch, user]);

  useRealTimeData(fetchMessages, {
    interval: REFRESH_INTERVALS.MESSAGES,
    enabled: !!user,
    dependencies: [user?.id]
  });
};

// Hook for tournament updates
export const useTournamentUpdates = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const fetchTournamentUpdates = useCallback(async () => {
    if (!user) return;
    
    const response = await apiService.get('/tournaments/user-tournaments');
    // Update user's tournaments in store
    return response;
  }, [dispatch, user]);

  useRealTimeData(fetchTournamentUpdates, {
    interval: REFRESH_INTERVALS.TOURNAMENTS,
    enabled: !!user,
    dependencies: [user?.id]
  });
};

// Hook for recent activity updates
export const useActivityUpdates = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const fetchActivityUpdates = useCallback(async () => {
    if (!user) return;
    
    const response = await apiService.get('/activity/recent');
    // Update recent activity in store
    return response;
  }, [dispatch, user]);

  useRealTimeData(fetchActivityUpdates, {
    interval: REFRESH_INTERVALS.ACTIVITY,
    enabled: !!user,
    dependencies: [user?.id]
  });
};

// Master hook that combines all real-time data
export const useRealTimeUpdates = (options: { enabled?: boolean } = {}) => {
  const { enabled = true } = options;

  // Use individual hooks
  useDashboardStats();
  useRealtimeNotifications();
  useRealtimeMessages();
  useTournamentUpdates();
  useActivityUpdates();

  return {
    isEnabled: enabled
  };
};