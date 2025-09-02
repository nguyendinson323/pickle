import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';
import MessageService from './messageService';
import NotificationService from './notificationService';
import ConversationService from './conversationService';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

interface SocketUser {
  userId: string;
  socketId: string;
  userRole: string;
  lastSeen: Date;
  isOnline: boolean;
}

interface MessageData {
  conversationId: string;
  content: string;
  messageType?: 'text' | 'image' | 'file' | 'system' | 'location' | 'match_invite';
  attachments?: any[];
  location?: any;
  matchInvite?: any;
}

interface TypingData {
  conversationId: string;
  isTyping: boolean;
}

class SocketService {
  private io: SocketIOServer;
  private messageService: MessageService;
  private notificationService: NotificationService;
  private conversationService: ConversationService;
  private connectedUsers: Map<string, SocketUser> = new Map();
  private userSockets: Map<string, Set<string>> = new Map();

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['websocket', 'polling']
    });

    this.messageService = new MessageService();
    this.notificationService = new NotificationService();
    this.conversationService = new ConversationService();

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware(): void {
    // Authentication middleware
    this.io.use(async (socket: AuthenticatedSocket, next) => {
      try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
        
        if (!token) {
          return next(new Error('Authentication error: No token provided'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
        
        socket.userId = decoded.id || decoded.userId;
        socket.userRole = decoded.role;
        
        next();
      } catch (error) {
        next(new Error('Authentication error: Invalid token'));
      }
    });
  }

  private setupEventHandlers(): void {
    this.io.on('connection', (socket: AuthenticatedSocket) => {
      console.log(`User ${socket.userId} connected with socket ${socket.id}`);
      
      this.handleUserConnection(socket);
      this.handleMessageEvents(socket);
      this.handleConversationEvents(socket);
      this.handleNotificationEvents(socket);
      this.handleTypingEvents(socket);
      this.handlePresenceEvents(socket);
      this.handleDisconnection(socket);
    });
  }

  private handleUserConnection(socket: AuthenticatedSocket): void {
    if (!socket.userId) return;

    // Track user connection
    const userSockets = this.userSockets.get(socket.userId) || new Set();
    userSockets.add(socket.id);
    this.userSockets.set(socket.userId, userSockets);

    // Update user status
    this.connectedUsers.set(socket.id, {
      userId: socket.userId,
      socketId: socket.id,
      userRole: socket.userRole || 'player',
      lastSeen: new Date(),
      isOnline: true
    });

    // Join user to their personal room
    socket.join(`user:${socket.userId}`);

    // Join user to their conversation rooms
    this.joinUserConversations(socket);

    // Emit online status to contacts
    this.broadcastUserStatus(socket.userId, true);

    // Send initial data
    socket.emit('connected', {
      userId: socket.userId,
      timestamp: new Date()
    });
  }

  private async joinUserConversations(socket: AuthenticatedSocket): Promise<void> {
    if (!socket.userId) return;

    try {
      const conversations = await this.conversationService.getConversations(
        { userId: socket.userId, isActive: true },
        { limit: 100 }
      );

      for (const conversation of conversations.conversations) {
        socket.join(`conversation:${conversation.id}`);
      }
    } catch (error) {
      console.error('Failed to join user conversations:', error);
    }
  }

  private handleMessageEvents(socket: AuthenticatedSocket): void {
    // Send message
    socket.on('message:send', async (data: MessageData, callback) => {
      try {
        if (!socket.userId) {
          return callback?.({ error: 'Not authenticated' });
        }

        const message = await this.messageService.createMessage({
          ...data,
          senderId: socket.userId
        });

        // Emit to conversation room
        this.io.to(`conversation:${data.conversationId}`).emit('message:new', {
          message,
          timestamp: new Date()
        });

        // Send delivery confirmation
        callback?.({ success: true, messageId: message.id });

        // Update conversation last message timestamp
        this.io.to(`conversation:${data.conversationId}`).emit('conversation:updated', {
          conversationId: data.conversationId,
          lastMessageAt: message.createdAt,
          lastMessagePreview: message.content.substring(0, 100)
        });

      } catch (error: any) {
        console.error('Failed to send message:', error);
        callback?.({ error: error.message });
      }
    });

    // Edit message
    socket.on('message:edit', async (data: { messageId: string; content: string }, callback) => {
      try {
        if (!socket.userId) {
          return callback?.({ error: 'Not authenticated' });
        }

        const message = await this.messageService.updateMessage(data.messageId, socket.userId, {
          content: data.content
        });

        // Get conversation ID from message
        const messageWithConversation = await this.messageService.getMessageById(data.messageId);
        if (messageWithConversation) {
          this.io.to(`conversation:${messageWithConversation.conversationId}`).emit('message:edited', {
            messageId: data.messageId,
            content: data.content,
            editedAt: new Date(),
            timestamp: new Date()
          });
        }

        callback?.({ success: true });
      } catch (error: any) {
        console.error('Failed to edit message:', error);
        callback?.({ error: error.message });
      }
    });

    // Delete message
    socket.on('message:delete', async (data: { messageId: string }, callback) => {
      try {
        if (!socket.userId) {
          return callback?.({ error: 'Not authenticated' });
        }

        // Get message before deletion to get conversation ID
        const messageWithConversation = await this.messageService.getMessageById(data.messageId);
        
        await this.messageService.deleteMessage(data.messageId, socket.userId);

        if (messageWithConversation) {
          this.io.to(`conversation:${messageWithConversation.conversationId}`).emit('message:deleted', {
            messageId: data.messageId,
            timestamp: new Date()
          });
        }

        callback?.({ success: true });
      } catch (error: any) {
        console.error('Failed to delete message:', error);
        callback?.({ error: error.message });
      }
    });

    // Mark message as read
    socket.on('message:read', async (data: { messageId: string }, callback) => {
      try {
        if (!socket.userId) {
          return callback?.({ error: 'Not authenticated' });
        }

        await this.messageService.markMessageAsRead(data.messageId, socket.userId);

        // Get message to get conversation ID
        const messageWithConversation = await this.messageService.getMessageById(data.messageId);
        if (messageWithConversation) {
          // Notify other participants
          socket.to(`conversation:${messageWithConversation.conversationId}`).emit('message:read_by', {
            messageId: data.messageId,
            userId: socket.userId,
            readAt: new Date()
          });
        }

        callback?.({ success: true });
      } catch (error: any) {
        console.error('Failed to mark message as read:', error);
        callback?.({ error: error.message });
      }
    });

    // Add reaction
    socket.on('message:react', async (data: { messageId: string; emoji: string }, callback) => {
      try {
        if (!socket.userId) {
          return callback?.({ error: 'Not authenticated' });
        }

        await this.messageService.addReaction(data.messageId, socket.userId, data.emoji);

        // Get message to get conversation ID
        const messageWithConversation = await this.messageService.getMessageById(data.messageId);
        if (messageWithConversation) {
          this.io.to(`conversation:${messageWithConversation.conversationId}`).emit('message:reaction_added', {
            messageId: data.messageId,
            userId: socket.userId,
            emoji: data.emoji,
            timestamp: new Date()
          });
        }

        callback?.({ success: true });
      } catch (error: any) {
        console.error('Failed to add reaction:', error);
        callback?.({ error: error.message });
      }
    });

    // Remove reaction
    socket.on('message:unreact', async (data: { messageId: string }, callback) => {
      try {
        if (!socket.userId) {
          return callback?.({ error: 'Not authenticated' });
        }

        await this.messageService.removeReaction(data.messageId, socket.userId);

        // Get message to get conversation ID
        const messageWithConversation = await this.messageService.getMessageById(data.messageId);
        if (messageWithConversation) {
          this.io.to(`conversation:${messageWithConversation.conversationId}`).emit('message:reaction_removed', {
            messageId: data.messageId,
            userId: socket.userId,
            timestamp: new Date()
          });
        }

        callback?.({ success: true });
      } catch (error: any) {
        console.error('Failed to remove reaction:', error);
        callback?.({ error: error.message });
      }
    });
  }

  private handleConversationEvents(socket: AuthenticatedSocket): void {
    // Join conversation
    socket.on('conversation:join', async (data: { conversationId: string }, callback) => {
      try {
        if (!socket.userId) {
          return callback?.({ error: 'Not authenticated' });
        }

        // Verify user is participant
        const conversation = await this.conversationService.getConversationById(data.conversationId, socket.userId);
        if (!conversation) {
          return callback?.({ error: 'Conversation not found or access denied' });
        }

        socket.join(`conversation:${data.conversationId}`);
        callback?.({ success: true });

        // Notify other participants
        socket.to(`conversation:${data.conversationId}`).emit('conversation:user_joined', {
          userId: socket.userId,
          timestamp: new Date()
        });

      } catch (error: any) {
        console.error('Failed to join conversation:', error);
        callback?.({ error: error.message });
      }
    });

    // Leave conversation
    socket.on('conversation:leave', (data: { conversationId: string }, callback) => {
      socket.leave(`conversation:${data.conversationId}`);
      callback?.({ success: true });

      // Notify other participants
      socket.to(`conversation:${data.conversationId}`).emit('conversation:user_left', {
        userId: socket.userId,
        timestamp: new Date()
      });
    });

    // Get conversation participants
    socket.on('conversation:get_participants', async (data: { conversationId: string }, callback) => {
      try {
        if (!socket.userId) {
          return callback?.({ error: 'Not authenticated' });
        }

        const participants = await this.conversationService.getParticipants(data.conversationId, socket.userId);
        callback?.({ success: true, participants });
      } catch (error: any) {
        console.error('Failed to get participants:', error);
        callback?.({ error: error.message });
      }
    });
  }

  private handleNotificationEvents(socket: AuthenticatedSocket): void {
    // Mark notification as read
    socket.on('notification:read', async (data: { notificationId: string }, callback) => {
      try {
        if (!socket.userId) {
          return callback?.({ error: 'Not authenticated' });
        }

        await this.notificationService.markAsRead(data.notificationId, socket.userId);
        callback?.({ success: true });
      } catch (error: any) {
        console.error('Failed to mark notification as read:', error);
        callback?.({ error: error.message });
      }
    });

    // Mark all notifications as read
    socket.on('notification:read_all', async (callback) => {
      try {
        if (!socket.userId) {
          return callback?.({ error: 'Not authenticated' });
        }

        await this.notificationService.markAllAsRead(socket.userId);
        callback?.({ success: true });
      } catch (error: any) {
        console.error('Failed to mark all notifications as read:', error);
        callback?.({ error: error.message });
      }
    });

    // Get unread notifications count
    socket.on('notification:get_unread_count', async (callback) => {
      try {
        if (!socket.userId) {
          return callback?.({ error: 'Not authenticated' });
        }

        const result = await this.notificationService.getNotifications(socket.userId, { isRead: false }, { limit: 1 });
        callback?.({ success: true, count: result.unreadCount });
      } catch (error: any) {
        console.error('Failed to get unread count:', error);
        callback?.({ error: error.message });
      }
    });
  }

  private handleTypingEvents(socket: AuthenticatedSocket): void {
    socket.on('typing:start', (data: TypingData) => {
      socket.to(`conversation:${data.conversationId}`).emit('typing:user_started', {
        userId: socket.userId,
        conversationId: data.conversationId,
        timestamp: new Date()
      });
    });

    socket.on('typing:stop', (data: TypingData) => {
      socket.to(`conversation:${data.conversationId}`).emit('typing:user_stopped', {
        userId: socket.userId,
        conversationId: data.conversationId,
        timestamp: new Date()
      });
    });
  }

  private handlePresenceEvents(socket: AuthenticatedSocket): void {
    // Update user status
    socket.on('presence:update', (data: { status: 'online' | 'away' | 'busy' | 'offline' }) => {
      if (socket.userId) {
        this.broadcastUserStatus(socket.userId, data.status !== 'offline');
      }
    });

    // Get online users
    socket.on('presence:get_online_users', (callback) => {
      const onlineUsers = Array.from(this.connectedUsers.values())
        .filter(user => user.isOnline)
        .map(user => ({
          userId: user.userId,
          lastSeen: user.lastSeen
        }));

      callback?.({ success: true, users: onlineUsers });
    });
  }

  private handleDisconnection(socket: AuthenticatedSocket): void {
    socket.on('disconnect', () => {
      console.log(`User ${socket.userId} disconnected from socket ${socket.id}`);
      
      if (socket.userId) {
        // Remove socket from user's socket set
        const userSockets = this.userSockets.get(socket.userId);
        if (userSockets) {
          userSockets.delete(socket.id);
          
          // If no more sockets for this user, mark as offline
          if (userSockets.size === 0) {
            this.userSockets.delete(socket.userId);
            this.broadcastUserStatus(socket.userId, false);
          } else {
            this.userSockets.set(socket.userId, userSockets);
          }
        }
      }

      // Remove from connected users
      this.connectedUsers.delete(socket.id);
    });
  }

  private broadcastUserStatus(userId: string, isOnline: boolean): void {
    // Broadcast to all connected clients
    this.io.emit('presence:user_status_changed', {
      userId,
      isOnline,
      timestamp: new Date()
    });

    // Also emit to user's personal room for cross-device sync
    this.io.to(`user:${userId}`).emit('presence:status_sync', {
      isOnline,
      timestamp: new Date()
    });
  }

  // Public methods for external services to emit events

  public sendNotificationToUser(userId: string, notification: any): void {
    this.io.to(`user:${userId}`).emit('notification:new', {
      notification,
      timestamp: new Date()
    });
  }

  public sendNotificationToConversation(conversationId: string, notification: any): void {
    this.io.to(`conversation:${conversationId}`).emit('notification:new', {
      notification,
      timestamp: new Date()
    });
  }

  public updateConversationForUser(userId: string, conversationData: any): void {
    this.io.to(`user:${userId}`).emit('conversation:updated', {
      ...conversationData,
      timestamp: new Date()
    });
  }

  public broadcastSystemMessage(message: string, data?: any): void {
    this.io.emit('system:message', {
      message,
      data,
      timestamp: new Date()
    });
  }

  public getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }

  public isUserOnline(userId: string): boolean {
    return this.userSockets.has(userId);
  }

  public getOnlineUsers(): SocketUser[] {
    return Array.from(this.connectedUsers.values()).filter(user => user.isOnline);
  }

  public async gracefulShutdown(): Promise<void> {
    console.log('Shutting down Socket.IO server...');
    
    // Notify all connected users
    this.io.emit('system:shutdown', {
      message: 'Server is shutting down. Please reconnect in a moment.',
      timestamp: new Date()
    });

    // Wait a bit for messages to be sent
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Close all connections
    this.io.close();
    
    console.log('Socket.IO server shutdown complete');
  }
}

export default SocketService;