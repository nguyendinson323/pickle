import { useEffect, useRef, useCallback, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { selectUser } from '@/store/authSlice';

export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
}

export interface UseWebSocketOptions {
  reconnectAttempts?: number;
  reconnectInterval?: number;
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const {
    reconnectAttempts = 5,
    reconnectInterval = 3000,
    onMessage,
    onConnect,
    onDisconnect,
    onError
  } = options;

  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const attemptCountRef = useRef(0);
  const mountedRef = useRef(true);

  const getWebSocketUrl = useCallback(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname;
    const port = process.env.NODE_ENV === 'development' ? ':3001' : '';
    return `${protocol}//${host}${port}/ws`;
  }, []);

  const connect = useCallback(() => {
    if (!user || !mountedRef.current) return;

    try {
      setConnectionStatus('connecting');
      const wsUrl = getWebSocketUrl();
      const token = localStorage.getItem('authToken');
      
      wsRef.current = new WebSocket(`${wsUrl}?token=${encodeURIComponent(token || '')}`);

      wsRef.current.onopen = () => {
        if (!mountedRef.current) return;
        
        console.log('WebSocket connected');
        setIsConnected(true);
        setConnectionStatus('connected');
        attemptCountRef.current = 0;
        
        // Send user identification
        if (wsRef.current && user) {
          wsRef.current.send(JSON.stringify({
            type: 'auth',
            data: { userId: user.id, role: user.role }
          }));
        }
        
        if (onConnect) onConnect();
      };

      wsRef.current.onmessage = (event) => {
        if (!mountedRef.current) return;
        
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          console.log('WebSocket message received:', message);
          
          // Handle different message types
          switch (message.type) {
            case 'notification':
              // Handle new notifications
              dispatch({ type: 'notifications/addNotification', payload: message.data });
              break;
            case 'message':
              // Handle new messages
              dispatch({ type: 'messages/updateUnreadCount', payload: message.data });
              break;
            case 'tournament_update':
              // Handle tournament updates
              dispatch({ type: 'dashboard/updateTournamentStats', payload: message.data });
              break;
            case 'stats_update':
              // Handle stats updates
              dispatch({ type: 'dashboard/updateStatistics', payload: message.data });
              break;
            default:
              console.log('Unknown message type:', message.type);
          }
          
          if (onMessage) onMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      wsRef.current.onclose = () => {
        if (!mountedRef.current) return;
        
        console.log('WebSocket disconnected');
        setIsConnected(false);
        setConnectionStatus('disconnected');
        
        if (onDisconnect) onDisconnect();
        
        // Attempt to reconnect if we haven't exceeded the limit
        if (attemptCountRef.current < reconnectAttempts) {
          attemptCountRef.current += 1;
          console.log(`Attempting to reconnect (${attemptCountRef.current}/${reconnectAttempts})...`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            if (mountedRef.current) {
              connect();
            }
          }, reconnectInterval);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('error');
        if (onError) onError(error);
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setConnectionStatus('error');
    }
  }, [user, getWebSocketUrl, onConnect, onMessage, onDisconnect, onError, reconnectAttempts, reconnectInterval, dispatch]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    setIsConnected(false);
    setConnectionStatus('disconnected');
  }, []);

  const sendMessage = useCallback((message: Omit<WebSocketMessage, 'timestamp'>) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const messageWithTimestamp: WebSocketMessage = {
        ...message,
        timestamp: Date.now()
      };
      wsRef.current.send(JSON.stringify(messageWithTimestamp));
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    if (user) {
      connect();
    }

    return () => {
      mountedRef.current = false;
      disconnect();
    };
  }, [user, connect, disconnect]);

  return {
    isConnected,
    connectionStatus,
    sendMessage,
    connect,
    disconnect
  };
};