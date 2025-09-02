import { useEffect, useState, useContext, createContext, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './useAuth';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  connectionError: string | null;
  reconnecting: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  connectionError: null,
  reconnecting: false
});

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { user, token } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [reconnecting, setReconnecting] = useState(false);

  const connect = useCallback(() => {
    if (!user || !token) return;

    console.log('Connecting to socket server...');

    const newSocket = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001', {
      auth: {
        token
      },
      transports: ['websocket', 'polling'],
      timeout: 20000,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      maxReconnectionAttempts: 5
    });

    // Connection events
    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      setIsConnected(true);
      setConnectionError(null);
      setReconnecting(false);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
      
      if (reason === 'io server disconnect') {
        // Server disconnected, need to reconnect manually
        newSocket.connect();
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setConnectionError(error.message);
      setIsConnected(false);
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts');
      setReconnecting(false);
    });

    newSocket.on('reconnect_attempt', (attemptNumber) => {
      console.log('Socket reconnection attempt:', attemptNumber);
      setReconnecting(true);
    });

    newSocket.on('reconnect_error', (error) => {
      console.error('Socket reconnection error:', error);
      setConnectionError(error.message);
    });

    newSocket.on('reconnect_failed', () => {
      console.error('Socket failed to reconnect');
      setConnectionError('Failed to reconnect to server');
      setReconnecting(false);
    });

    // Authentication events
    newSocket.on('authenticated', (data) => {
      console.log('Socket authenticated:', data);
    });

    newSocket.on('authentication_error', (error) => {
      console.error('Socket authentication error:', error);
      setConnectionError('Authentication failed');
    });

    // System events
    newSocket.on('system:message', (data) => {
      console.log('System message:', data);
      // Could show a toast notification here
    });

    newSocket.on('system:shutdown', (data) => {
      console.log('Server shutdown:', data);
      // Could show a maintenance notice
    });

    setSocket(newSocket);

    return newSocket;
  }, [user, token]);

  const disconnect = useCallback(() => {
    if (socket) {
      console.log('Disconnecting socket...');
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
      setConnectionError(null);
      setReconnecting(false);
    }
  }, [socket]);

  // Connect when user and token are available
  useEffect(() => {
    if (user && token) {
      const newSocket = connect();
      
      return () => {
        if (newSocket) {
          newSocket.disconnect();
        }
      };
    } else {
      disconnect();
    }
  }, [user, token, connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  const value = {
    socket,
    isConnected,
    connectionError,
    reconnecting
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

// Hook for specific socket events
export const useSocketEvent = (event: string, handler: (data: any) => void, deps: any[] = []) => {
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on(event, handler);
      
      return () => {
        socket.off(event, handler);
      };
    }
  }, [socket, event, ...deps]);
};

// Hook for presence management
export const usePresence = () => {
  const { socket, isConnected } = useSocket();
  const [onlineUsers, setOnlineUsers] = useState<Array<{ userId: string; lastSeen: Date }>>([]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleUserStatusChanged = (data: { userId: string; isOnline: boolean; timestamp: Date }) => {
      setOnlineUsers(prev => {
        if (data.isOnline) {
          // Add or update user
          const existing = prev.find(user => user.userId === data.userId);
          if (existing) {
            return prev.map(user => 
              user.userId === data.userId 
                ? { ...user, lastSeen: data.timestamp }
                : user
            );
          } else {
            return [...prev, { userId: data.userId, lastSeen: data.timestamp }];
          }
        } else {
          // Remove user
          return prev.filter(user => user.userId !== data.userId);
        }
      });
    };

    const updateStatus = (status: 'online' | 'away' | 'busy' | 'offline') => {
      socket.emit('presence:update', { status });
    };

    const getOnlineUsers = () => {
      socket.emit('presence:get_online_users', (response: any) => {
        if (response.success) {
          setOnlineUsers(response.users);
        }
      });
    };

    socket.on('presence:user_status_changed', handleUserStatusChanged);
    
    // Get initial online users
    getOnlineUsers();

    return () => {
      socket.off('presence:user_status_changed', handleUserStatusChanged);
    };
  }, [socket, isConnected]);

  const updateStatus = useCallback((status: 'online' | 'away' | 'busy' | 'offline') => {
    if (socket && isConnected) {
      socket.emit('presence:update', { status });
    }
  }, [socket, isConnected]);

  const isUserOnline = useCallback((userId: string) => {
    return onlineUsers.some(user => user.userId === userId);
  }, [onlineUsers]);

  return {
    onlineUsers,
    updateStatus,
    isUserOnline
  };
};

// Hook for typing indicators
export const useTyping = (conversationId: string) => {
  const { socket, isConnected } = useSocket();
  const [typingUsers, setTypingUsers] = useState<Array<{ userId: string; username: string }>>([]);

  useEffect(() => {
    if (!socket || !isConnected || !conversationId) return;

    const handleTypingStarted = (data: { userId: string; conversationId: string }) => {
      if (data.conversationId === conversationId) {
        setTypingUsers(prev => {
          const existing = prev.find(user => user.userId === data.userId);
          if (!existing) {
            return [...prev, { userId: data.userId, username: 'User' }]; // TODO: Get actual username
          }
          return prev;
        });
      }
    };

    const handleTypingStopped = (data: { userId: string; conversationId: string }) => {
      if (data.conversationId === conversationId) {
        setTypingUsers(prev => prev.filter(user => user.userId !== data.userId));
      }
    };

    socket.on('typing:user_started', handleTypingStarted);
    socket.on('typing:user_stopped', handleTypingStopped);

    return () => {
      socket.off('typing:user_started', handleTypingStarted);
      socket.off('typing:user_stopped', handleTypingStopped);
    };
  }, [socket, isConnected, conversationId]);

  const startTyping = useCallback(() => {
    if (socket && isConnected && conversationId) {
      socket.emit('typing:start', { conversationId });
    }
  }, [socket, isConnected, conversationId]);

  const stopTyping = useCallback(() => {
    if (socket && isConnected && conversationId) {
      socket.emit('typing:stop', { conversationId });
    }
  }, [socket, isConnected, conversationId]);

  return {
    typingUsers,
    startTyping,
    stopTyping
  };
};