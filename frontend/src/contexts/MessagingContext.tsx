import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppSelector } from '../store';
import { API_BASE_URL } from '../utils/constants';
import { 
  Message, 
  Conversation, 
  ConversationParticipant,
  MessageReaction,
  TypingUser,
  UserPresence
} from '../types/messaging';
import { Notification } from '../types/notifications';

interface MessagingContextType {
  // Connection state
  socket: Socket | null;
  isConnected: boolean;
  connectionError: string | null;
  
  // Conversations
  conversations: Conversation[];
  activeConversation: Conversation | null;
  setActiveConversation: (conversation: Conversation | null) => void;
  
  // Messages
  messages: Record<string, Message[]>;
  sendMessage: (conversationId: string, content: string, messageType?: string, attachments?: any[]) => Promise<void>;
  editMessage: (messageId: string, content: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  addReaction: (messageId: string, emoji: string) => Promise<void>;
  removeReaction: (messageId: string, emoji: string) => Promise<void>;
  markMessageAsRead: (messageId: string) => Promise<void>;
  
  // Conversations
  createConversation: (type: string, participantIds: string[], name?: string) => Promise<Conversation>;
  joinConversation: (conversationId: string) => Promise<void>;
  leaveConversation: (conversationId: string) => Promise<void>;
  archiveConversation: (conversationId: string) => Promise<void>;
  
  // Typing indicators
  typingUsers: Record<string, TypingUser[]>;
  startTyping: (conversationId: string) => void;
  stopTyping: (conversationId: string) => void;
  
  // User presence
  userPresence: Record<string, UserPresence>;
  setUserStatus: (status: 'online' | 'away' | 'busy' | 'offline') => void;
  
  // Notifications
  unreadNotifications: Notification[];
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  
  // Search
  searchMessages: (query: string, conversationId?: string) => Promise<Message[]>;
  
  // Loading states
  isLoading: boolean;
  isSending: boolean;
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

export const useMessaging = () => {
  const context = useContext(MessagingContext);
  if (!context) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
};

interface MessagingProviderProps {
  children: React.ReactNode;
}

export const MessagingProvider: React.FC<MessagingProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  
  // Socket connection
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  // Data state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [typingUsers, setTypingUsers] = useState<Record<string, TypingUser[]>>({});
  const [userPresence, setUserPresence] = useState<Record<string, UserPresence>>({});
  const [unreadNotifications, setUnreadNotifications] = useState<Notification[]>([]);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Initialize socket connection
  useEffect(() => {
    if (isAuthenticated && user) {
      const token = localStorage.getItem('auth_token');
      if (token) {
        const socketInstance = io(`${API_BASE_URL.replace('/api', '')}`, {
          auth: { token },
          transports: ['websocket'],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        socketInstance.on('connect', () => {
          console.log('📡 Connected to messaging server');
          setIsConnected(true);
          setConnectionError(null);
        });

        socketInstance.on('disconnect', (reason) => {
          console.log('📡 Disconnected from messaging server:', reason);
          setIsConnected(false);
        });

        socketInstance.on('connect_error', (error) => {
          console.error('📡 Connection error:', error);
          setConnectionError(error.message);
        });

        // Message events
        socketInstance.on('message:new', (data: { message: Message; conversation: Conversation }) => {
          const { message, conversation } = data;
          
          // Add message to the appropriate conversation
          setMessages(prev => ({
            ...prev,
            [conversation.id]: [...(prev[conversation.id] || []), message]
          }));

          // Update conversation's last message info
          setConversations(prev => 
            prev.map(conv => 
              conv.id === conversation.id 
                ? { ...conv, lastMessageAt: message.createdAt, lastMessage: message.content }
                : conv
            )
          );
        });

        socketInstance.on('message:updated', (message: Message) => {
          setMessages(prev => ({
            ...prev,
            [message.conversationId]: (prev[message.conversationId] || []).map(msg =>
              msg.id === message.id ? message : msg
            )
          }));
        });

        socketInstance.on('message:deleted', (data: { messageId: string; conversationId: string }) => {
          setMessages(prev => ({
            ...prev,
            [data.conversationId]: (prev[data.conversationId] || []).map(msg =>
              msg.id === data.messageId ? { ...msg, isDeleted: true, content: 'This message was deleted' } : msg
            )
          }));
        });

        // Conversation events
        socketInstance.on('conversation:new', (conversation: Conversation) => {
          setConversations(prev => [conversation, ...prev]);
        });

        socketInstance.on('conversation:updated', (conversation: Conversation) => {
          setConversations(prev => 
            prev.map(conv => conv.id === conversation.id ? conversation : conv)
          );
        });

        // Typing events
        socketInstance.on('typing:start', (data: { conversationId: string; user: TypingUser }) => {
          setTypingUsers(prev => ({
            ...prev,
            [data.conversationId]: [...(prev[data.conversationId] || []).filter(u => u.id !== data.user.id), data.user]
          }));
        });

        socketInstance.on('typing:stop', (data: { conversationId: string; userId: string }) => {
          setTypingUsers(prev => ({
            ...prev,
            [data.conversationId]: (prev[data.conversationId] || []).filter(u => u.id !== data.userId)
          }));
        });

        // Presence events
        socketInstance.on('presence:update', (data: { userId: string; presence: UserPresence }) => {
          setUserPresence(prev => ({
            ...prev,
            [data.userId]: data.presence
          }));
        });

        // Notification events
        socketInstance.on('notification:new', (notification: Notification) => {
          setUnreadNotifications(prev => [notification, ...prev]);
        });

        setSocket(socketInstance);

        return () => {
          socketInstance.disconnect();
        };
      }
    }
  }, [isAuthenticated, user]);

  // Load initial data
  useEffect(() => {
    if (isConnected && socket) {
      setIsLoading(true);
      
      // Load conversations
      socket.emit('conversation:list', {}, (response: any) => {
        if (response.success) {
          setConversations(response.conversations);
        }
        setIsLoading(false);
      });

      // Load unread notifications
      socket.emit('notification:unread', {}, (response: any) => {
        if (response.success) {
          setUnreadNotifications(response.notifications);
        }
      });
    }
  }, [isConnected, socket]);

  // Message operations
  const sendMessage = useCallback(async (
    conversationId: string, 
    content: string, 
    messageType: string = 'text', 
    attachments: any[] = []
  ): Promise<void> => {
    if (!socket || !isConnected) {
      throw new Error('Not connected to messaging server');
    }

    setIsSending(true);
    
    return new Promise((resolve, reject) => {
      socket.emit('message:send', {
        conversationId,
        content,
        messageType,
        attachments
      }, (response: any) => {
        setIsSending(false);
        
        if (response.success) {
          resolve();
        } else {
          reject(new Error(response.error || 'Failed to send message'));
        }
      });
    });
  }, [socket, isConnected]);

  const editMessage = useCallback(async (messageId: string, content: string): Promise<void> => {
    if (!socket || !isConnected) {
      throw new Error('Not connected to messaging server');
    }

    return new Promise((resolve, reject) => {
      socket.emit('message:edit', { messageId, content }, (response: any) => {
        if (response.success) {
          resolve();
        } else {
          reject(new Error(response.error || 'Failed to edit message'));
        }
      });
    });
  }, [socket, isConnected]);

  const deleteMessage = useCallback(async (messageId: string): Promise<void> => {
    if (!socket || !isConnected) {
      throw new Error('Not connected to messaging server');
    }

    return new Promise((resolve, reject) => {
      socket.emit('message:delete', { messageId }, (response: any) => {
        if (response.success) {
          resolve();
        } else {
          reject(new Error(response.error || 'Failed to delete message'));
        }
      });
    });
  }, [socket, isConnected]);

  const addReaction = useCallback(async (messageId: string, emoji: string): Promise<void> => {
    if (!socket || !isConnected) {
      throw new Error('Not connected to messaging server');
    }

    return new Promise((resolve, reject) => {
      socket.emit('message:react', { messageId, emoji }, (response: any) => {
        if (response.success) {
          resolve();
        } else {
          reject(new Error(response.error || 'Failed to add reaction'));
        }
      });
    });
  }, [socket, isConnected]);

  const removeReaction = useCallback(async (messageId: string, emoji: string): Promise<void> => {
    if (!socket || !isConnected) {
      throw new Error('Not connected to messaging server');
    }

    return new Promise((resolve, reject) => {
      socket.emit('message:unreact', { messageId, emoji }, (response: any) => {
        if (response.success) {
          resolve();
        } else {
          reject(new Error(response.error || 'Failed to remove reaction'));
        }
      });
    });
  }, [socket, isConnected]);

  const markMessageAsRead = useCallback(async (messageId: string): Promise<void> => {
    if (!socket || !isConnected) {
      throw new Error('Not connected to messaging server');
    }

    return new Promise((resolve, reject) => {
      socket.emit('message:read', { messageId }, (response: any) => {
        if (response.success) {
          resolve();
        } else {
          reject(new Error(response.error || 'Failed to mark message as read'));
        }
      });
    });
  }, [socket, isConnected]);

  // Conversation operations
  const createConversation = useCallback(async (
    type: string, 
    participantIds: string[], 
    name?: string
  ): Promise<Conversation> => {
    if (!socket || !isConnected) {
      throw new Error('Not connected to messaging server');
    }

    return new Promise((resolve, reject) => {
      socket.emit('conversation:create', {
        type,
        participantIds,
        name
      }, (response: any) => {
        if (response.success) {
          resolve(response.conversation);
        } else {
          reject(new Error(response.error || 'Failed to create conversation'));
        }
      });
    });
  }, [socket, isConnected]);

  const joinConversation = useCallback(async (conversationId: string): Promise<void> => {
    if (!socket || !isConnected) {
      throw new Error('Not connected to messaging server');
    }

    socket.emit('conversation:join', { conversationId });
    
    // Load messages for this conversation
    socket.emit('message:list', { conversationId }, (response: any) => {
      if (response.success) {
        setMessages(prev => ({
          ...prev,
          [conversationId]: response.messages
        }));
      }
    });
  }, [socket, isConnected]);

  const leaveConversation = useCallback(async (conversationId: string): Promise<void> => {
    if (!socket || !isConnected) {
      throw new Error('Not connected to messaging server');
    }

    socket.emit('conversation:leave', { conversationId });
  }, [socket, isConnected]);

  const archiveConversation = useCallback(async (conversationId: string): Promise<void> => {
    if (!socket || !isConnected) {
      throw new Error('Not connected to messaging server');
    }

    return new Promise((resolve, reject) => {
      socket.emit('conversation:archive', { conversationId }, (response: any) => {
        if (response.success) {
          resolve();
        } else {
          reject(new Error(response.error || 'Failed to archive conversation'));
        }
      });
    });
  }, [socket, isConnected]);

  // Typing operations
  const startTyping = useCallback((conversationId: string) => {
    if (socket && isConnected) {
      socket.emit('typing:start', { conversationId });
    }
  }, [socket, isConnected]);

  const stopTyping = useCallback((conversationId: string) => {
    if (socket && isConnected) {
      socket.emit('typing:stop', { conversationId });
    }
  }, [socket, isConnected]);

  // Presence operations
  const setUserStatus = useCallback((status: 'online' | 'away' | 'busy' | 'offline') => {
    if (socket && isConnected) {
      socket.emit('presence:update', { status });
    }
  }, [socket, isConnected]);

  // Notification operations
  const markNotificationAsRead = useCallback(async (notificationId: string): Promise<void> => {
    if (!socket || !isConnected) {
      throw new Error('Not connected to messaging server');
    }

    return new Promise((resolve, reject) => {
      socket.emit('notification:read', { notificationId }, (response: any) => {
        if (response.success) {
          setUnreadNotifications(prev => prev.filter(n => n.id !== notificationId));
          resolve();
        } else {
          reject(new Error(response.error || 'Failed to mark notification as read'));
        }
      });
    });
  }, [socket, isConnected]);

  // Search operations
  const searchMessages = useCallback(async (query: string, conversationId?: string): Promise<Message[]> => {
    if (!socket || !isConnected) {
      throw new Error('Not connected to messaging server');
    }

    return new Promise((resolve, reject) => {
      socket.emit('message:search', { query, conversationId }, (response: any) => {
        if (response.success) {
          resolve(response.messages);
        } else {
          reject(new Error(response.error || 'Failed to search messages'));
        }
      });
    });
  }, [socket, isConnected]);

  const contextValue: MessagingContextType = {
    // Connection state
    socket,
    isConnected,
    connectionError,
    
    // Conversations
    conversations,
    activeConversation,
    setActiveConversation,
    
    // Messages
    messages,
    sendMessage,
    editMessage,
    deleteMessage,
    addReaction,
    removeReaction,
    markMessageAsRead,
    
    // Conversations
    createConversation,
    joinConversation,
    leaveConversation,
    archiveConversation,
    
    // Typing
    typingUsers,
    startTyping,
    stopTyping,
    
    // Presence
    userPresence,
    setUserStatus,
    
    // Notifications
    unreadNotifications,
    markNotificationAsRead,
    
    // Search
    searchMessages,
    
    // Loading states
    isLoading,
    isSending
  };

  return (
    <MessagingContext.Provider value={contextValue}>
      {children}
    </MessagingContext.Provider>
  );
};