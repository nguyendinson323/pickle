# 07. Messaging & Notification System - Complete Implementation Guide

## Problem Analysis
The current project lacks a comprehensive messaging and notification system essential for player communication, tournament updates, court booking confirmations, and real-time platform notifications.

## Core Requirements
1. **Real-time Messaging**: Player-to-player and group messaging
2. **System Notifications**: Automated notifications for bookings, tournaments, matches
3. **Email Notifications**: Transactional emails for important events
4. **SMS Notifications**: Critical alerts via text message
5. **Push Notifications**: Browser and mobile app notifications
6. **Notification Preferences**: User-controlled notification settings
7. **Message History**: Persistent message storage and search
8. **Notification Templates**: Customizable templates for different events

## Step-by-Step Implementation Plan

### Phase 1: Database Schema Design

#### 1.1 Create Message Model (`backend/src/models/Message.ts`)
```typescript
interface Message extends Model {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  messageType: 'text' | 'image' | 'file' | 'system' | 'location' | 'match_invite';
  
  // File attachments
  attachments?: {
    type: 'image' | 'file';
    url: string;
    filename: string;
    size: number;
  }[];
  
  // Location sharing
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  
  // Match invitation
  matchInvite?: {
    courtId: string;
    facilityId: string;
    proposedTime: Date;
    duration: number;
  };
  
  // Message status
  isEdited: boolean;
  editedAt?: Date;
  isDeleted: boolean;
  deletedAt?: Date;
  
  // Read receipts
  readBy: {
    userId: string;
    readAt: Date;
  }[];
  
  // Reactions
  reactions: {
    userId: string;
    emoji: string;
    createdAt: Date;
  }[];
  
  createdAt: Date;
  updatedAt: Date;
}

Message.belongsTo(Conversation);
Message.belongsTo(User, { as: 'sender' });
```

#### 1.2 Create Conversation Model (`backend/src/models/Conversation.ts`)
```typescript
interface Conversation extends Model {
  id: string;
  type: 'direct' | 'group' | 'tournament' | 'court_booking';
  name?: string; // For group conversations
  description?: string;
  
  // Participants
  participants: {
    userId: string;
    role: 'admin' | 'member';
    joinedAt: Date;
    leftAt?: Date;
    isActive: boolean;
  }[];
  
  // Group settings
  isGroup: boolean;
  groupIcon?: string;
  
  // Related entities
  relatedEntityType?: 'tournament' | 'court_booking' | 'player_match';
  relatedEntityId?: string;
  
  // Last message info
  lastMessageId?: string;
  lastMessageAt?: Date;
  lastMessagePreview?: string;
  
  // Conversation settings
  settings: {
    allowFileSharing: boolean;
    allowLocationSharing: boolean;
    muteNotifications: boolean;
    archiveAfterDays?: number;
  };
  
  // Status
  isActive: boolean;
  isArchived: boolean;
  archivedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

Conversation.hasMany(Message);
Conversation.hasOne(Message, { as: 'lastMessage', foreignKey: 'id', sourceKey: 'lastMessageId' });
```

#### 1.3 Create Notification Model (`backend/src/models/Notification.ts`)
```typescript
interface Notification extends Model {
  id: string;
  userId: string;
  type: 'system' | 'tournament' | 'booking' | 'message' | 'match' | 'payment' | 'maintenance';
  category: 'info' | 'success' | 'warning' | 'error' | 'urgent';
  
  // Notification content
  title: string;
  message: string;
  actionText?: string;
  actionUrl?: string;
  
  // Related data
  relatedEntityType?: string; // 'tournament', 'booking', 'message', etc.
  relatedEntityId?: string;
  metadata?: Record<string, any>;
  
  // Status
  isRead: boolean;
  readAt?: Date;
  
  // Delivery channels
  channels: {
    inApp: boolean;
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  
  // Delivery status
  deliveryStatus: {
    inApp: { delivered: boolean; deliveredAt?: Date };
    email: { delivered: boolean; deliveredAt?: Date; error?: string };
    sms: { delivered: boolean; deliveredAt?: Date; error?: string };
    push: { delivered: boolean; deliveredAt?: Date; error?: string };
  };
  
  // Scheduling
  scheduledFor?: Date;
  isScheduled: boolean;
  
  // Expiry
  expiresAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

Notification.belongsTo(User);
```

#### 1.4 Create Notification Preferences Model (`backend/src/models/NotificationPreferences.ts`)
```typescript
interface NotificationPreferences extends Model {
  id: string;
  userId: string;
  
  // Global settings
  globalEnabled: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string; // "22:00"
  quietHoursEnd: string; // "08:00"
  
  // Channel preferences
  preferences: {
    // Tournament notifications
    tournaments: {
      registration_open: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      registration_confirmed: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      bracket_released: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      match_scheduled: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      match_reminder: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      results_posted: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
    };
    
    // Court booking notifications
    bookings: {
      booking_confirmed: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      booking_reminder: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      booking_cancelled: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      court_unavailable: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
    };
    
    // Player matching notifications
    matches: {
      match_request: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      match_accepted: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      match_declined: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      court_suggestion: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
    };
    
    // Messaging notifications
    messages: {
      direct_message: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      group_message: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      mention: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
    };
    
    // System notifications
    system: {
      account_security: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      payment_updates: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      maintenance_alerts: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
    };
  };
  
  createdAt: Date;
  updatedAt: Date;
}

NotificationPreferences.belongsTo(User);
```

#### 1.5 Create Notification Template Model (`backend/src/models/NotificationTemplate.ts`)
```typescript
interface NotificationTemplate extends Model {
  id: string;
  name: string;
  type: string; // 'tournament_reminder', 'booking_confirmation', etc.
  category: 'tournament' | 'booking' | 'message' | 'system' | 'payment';
  
  // Template content
  templates: {
    inApp: {
      title: string;
      message: string;
      actionText?: string;
    };
    email: {
      subject: string;
      htmlContent: string;
      textContent: string;
    };
    sms: {
      message: string;
    };
    push: {
      title: string;
      body: string;
      icon?: string;
    };
  };
  
  // Template variables
  variables: {
    name: string;
    description: string;
    type: 'string' | 'number' | 'date' | 'boolean';
    required: boolean;
  }[];
  
  // Status
  isActive: boolean;
  version: number;
  
  createdAt: Date;
  updatedAt: Date;
}
```

### Phase 2: Messaging Services

#### 2.1 Message Service (`backend/src/services/messageService.ts`)
```typescript
class MessageService {
  async sendMessage(senderId: string, messageData: SendMessageRequest) {
    const { conversationId, content, messageType, attachments, location, matchInvite } = messageData;
    
    // Verify sender is participant in conversation
    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }
    
    const isParticipant = conversation.participants.some(
      p => p.userId === senderId && p.isActive
    );
    
    if (!isParticipant) {
      throw new Error('You are not a participant in this conversation');
    }

    // Create message
    const message = await Message.create({
      conversationId,
      senderId,
      content,
      messageType,
      attachments: attachments || [],
      location,
      matchInvite,
      isEdited: false,
      isDeleted: false,
      readBy: [{ userId: senderId, readAt: new Date() }],
      reactions: []
    });

    // Update conversation
    await conversation.update({
      lastMessageId: message.id,
      lastMessageAt: new Date(),
      lastMessagePreview: this.generateMessagePreview(message)
    });

    // Send real-time notifications to other participants
    const otherParticipants = conversation.participants.filter(
      p => p.userId !== senderId && p.isActive
    );

    for (const participant of otherParticipants) {
      // Real-time websocket notification
      this.sendRealTimeNotification(participant.userId, {
        type: 'new_message',
        conversationId,
        message
      });

      // Check user's notification preferences
      const preferences = await this.getUserNotificationPreferences(participant.userId);
      
      if (this.shouldSendNotification(preferences, 'messages', conversation.type)) {
        await this.createNotification(participant.userId, {
          type: 'message',
          category: 'info',
          title: `New message from ${message.sender.username}`,
          message: this.generateMessagePreview(message),
          actionUrl: `/messages/${conversationId}`,
          relatedEntityType: 'message',
          relatedEntityId: message.id,
          channels: preferences.messages.direct_message
        });
      }
    }

    return message;
  }

  async createConversation(creatorId: string, conversationData: CreateConversationRequest) {
    const { type, name, participantIds, relatedEntityType, relatedEntityId } = conversationData;
    
    // For direct conversations, ensure only 2 participants
    if (type === 'direct' && participantIds.length !== 1) {
      throw new Error('Direct conversations must have exactly 2 participants');
    }

    // Check if direct conversation already exists
    if (type === 'direct') {
      const existingConversation = await Conversation.findOne({
        where: {
          type: 'direct',
          participants: {
            [Op.contains]: [
              { userId: creatorId, isActive: true },
              { userId: participantIds[0], isActive: true }
            ]
          }
        }
      });

      if (existingConversation) {
        return existingConversation;
      }
    }

    // Create participants array
    const participants = [
      { userId: creatorId, role: 'admin', joinedAt: new Date(), isActive: true }
    ];

    participantIds.forEach(userId => {
      participants.push({
        userId,
        role: 'member',
        joinedAt: new Date(),
        isActive: true
      });
    });

    // Create conversation
    const conversation = await Conversation.create({
      type,
      name,
      participants,
      isGroup: type === 'group',
      relatedEntityType,
      relatedEntityId,
      settings: {
        allowFileSharing: true,
        allowLocationSharing: true,
        muteNotifications: false
      },
      isActive: true,
      isArchived: false
    });

    return conversation;
  }

  async getConversations(userId: string, filters?: ConversationFilters) {
    const { type, isArchived = false, page = 1, limit = 20 } = filters || {};

    const conversations = await Conversation.findAndCountAll({
      where: {
        participants: {
          [Op.contains]: [{ userId, isActive: true }]
        },
        isArchived,
        ...(type && { type })
      },
      include: [
        {
          model: Message,
          as: 'lastMessage',
          include: [
            { model: User, as: 'sender', attributes: ['id', 'username', 'avatar'] }
          ]
        }
      ],
      limit,
      offset: (page - 1) * limit,
      order: [['lastMessageAt', 'DESC']]
    });

    return {
      conversations: conversations.rows,
      pagination: {
        page,
        limit,
        total: conversations.count,
        totalPages: Math.ceil(conversations.count / limit)
      }
    };
  }

  async getMessages(conversationId: string, userId: string, options?: MessageOptions) {
    const { page = 1, limit = 50, before, after } = options || {};

    // Verify user is participant
    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    const isParticipant = conversation.participants.some(
      p => p.userId === userId && p.isActive
    );

    if (!isParticipant) {
      throw new Error('Access denied');
    }

    let whereClause: any = {
      conversationId,
      isDeleted: false
    };

    if (before) {
      whereClause.createdAt = { [Op.lt]: new Date(before) };
    }

    if (after) {
      whereClause.createdAt = { [Op.gt]: new Date(after) };
    }

    const messages = await Message.findAndCountAll({
      where: whereClause,
      include: [
        { model: User, as: 'sender', attributes: ['id', 'username', 'avatar'] }
      ],
      limit,
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']]
    });

    // Mark messages as read
    await this.markMessagesAsRead(conversationId, userId);

    return {
      messages: messages.rows.reverse(),
      pagination: {
        page,
        limit,
        total: messages.count,
        totalPages: Math.ceil(messages.count / limit)
      }
    };
  }

  async markMessagesAsRead(conversationId: string, userId: string) {
    const unreadMessages = await Message.findAll({
      where: {
        conversationId,
        readBy: {
          [Op.not]: {
            [Op.contains]: [{ userId }]
          }
        }
      }
    });

    for (const message of unreadMessages) {
      const readBy = [...message.readBy, { userId, readAt: new Date() }];
      await message.update({ readBy });
    }

    // Send read receipt via websocket
    this.sendRealTimeNotification(null, {
      type: 'messages_read',
      conversationId,
      userId,
      messageIds: unreadMessages.map(m => m.id)
    });
  }

  async addReaction(messageId: string, userId: string, emoji: string) {
    const message = await Message.findByPk(messageId);
    if (!message) {
      throw new Error('Message not found');
    }

    // Remove existing reaction from this user if any
    const reactions = message.reactions.filter(r => r.userId !== userId);
    
    // Add new reaction
    reactions.push({
      userId,
      emoji,
      createdAt: new Date()
    });

    await message.update({ reactions });

    // Send real-time update
    this.sendRealTimeNotification(null, {
      type: 'message_reaction',
      conversationId: message.conversationId,
      messageId,
      reactions
    });

    return message;
  }

  private generateMessagePreview(message: Message): string {
    switch (message.messageType) {
      case 'text':
        return message.content.length > 50 
          ? message.content.substring(0, 50) + '...'
          : message.content;
      case 'image':
        return '📷 Photo';
      case 'file':
        return '📎 File';
      case 'location':
        return '📍 Location';
      case 'match_invite':
        return '🎾 Match invitation';
      default:
        return 'New message';
    }
  }

  private sendRealTimeNotification(userId: string | null, data: any) {
    // Implement WebSocket broadcasting
    // If userId is null, broadcast to all conversation participants
    if (global.io) {
      if (userId) {
        global.io.to(userId).emit('notification', data);
      } else {
        global.io.to(data.conversationId).emit('notification', data);
      }
    }
  }
}
```

#### 2.2 Notification Service (`backend/src/services/notificationService.ts`)
```typescript
class NotificationService {
  async createNotification(userId: string, notificationData: CreateNotificationRequest) {
    const {
      type,
      category,
      title,
      message,
      actionText,
      actionUrl,
      relatedEntityType,
      relatedEntityId,
      metadata,
      channels,
      scheduledFor,
      expiresAt
    } = notificationData;

    // Create notification record
    const notification = await Notification.create({
      userId,
      type,
      category,
      title,
      message,
      actionText,
      actionUrl,
      relatedEntityType,
      relatedEntityId,
      metadata: metadata || {},
      isRead: false,
      channels,
      deliveryStatus: {
        inApp: { delivered: false },
        email: { delivered: false },
        sms: { delivered: false },
        push: { delivered: false }
      },
      scheduledFor,
      isScheduled: !!scheduledFor,
      expiresAt
    });

    // If not scheduled, deliver immediately
    if (!scheduledFor) {
      await this.deliverNotification(notification.id);
    }

    return notification;
  }

  async deliverNotification(notificationId: string) {
    const notification = await Notification.findByPk(notificationId, {
      include: [{ model: User }]
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    const user = notification.user;
    const preferences = await this.getUserNotificationPreferences(user.id);

    // Check quiet hours
    if (this.isInQuietHours(preferences)) {
      // Reschedule for after quiet hours
      const nextDeliveryTime = this.calculateNextDeliveryTime(preferences);
      await notification.update({
        scheduledFor: nextDeliveryTime,
        isScheduled: true
      });
      return;
    }

    const deliveryStatus = { ...notification.deliveryStatus };
    const promises = [];

    // In-app notification
    if (notification.channels.inApp) {
      promises.push(
        this.deliverInAppNotification(notification)
          .then(() => {
            deliveryStatus.inApp = { delivered: true, deliveredAt: new Date() };
          })
          .catch(error => {
            console.error('In-app notification failed:', error);
            deliveryStatus.inApp = { delivered: false, error: error.message };
          })
      );
    }

    // Email notification
    if (notification.channels.email && user.email) {
      promises.push(
        this.deliverEmailNotification(notification, user)
          .then(() => {
            deliveryStatus.email = { delivered: true, deliveredAt: new Date() };
          })
          .catch(error => {
            console.error('Email notification failed:', error);
            deliveryStatus.email = { delivered: false, error: error.message };
          })
      );
    }

    // SMS notification
    if (notification.channels.sms && user.phone) {
      promises.push(
        this.deliverSMSNotification(notification, user)
          .then(() => {
            deliveryStatus.sms = { delivered: true, deliveredAt: new Date() };
          })
          .catch(error => {
            console.error('SMS notification failed:', error);
            deliveryStatus.sms = { delivered: false, error: error.message };
          })
      );
    }

    // Push notification
    if (notification.channels.push) {
      promises.push(
        this.deliverPushNotification(notification, user)
          .then(() => {
            deliveryStatus.push = { delivered: true, deliveredAt: new Date() };
          })
          .catch(error => {
            console.error('Push notification failed:', error);
            deliveryStatus.push = { delivered: false, error: error.message };
          })
      );
    }

    // Wait for all deliveries to complete
    await Promise.all(promises);

    // Update delivery status
    await notification.update({ deliveryStatus });
  }

  async createFromTemplate(
    templateName: string,
    userId: string,
    variables: Record<string, any>,
    options?: NotificationOptions
  ) {
    const template = await NotificationTemplate.findOne({
      where: { name: templateName, isActive: true }
    });

    if (!template) {
      throw new Error(`Template '${templateName}' not found`);
    }

    // Process template variables
    const processedTemplates = this.processTemplate(template, variables);

    const notification = await this.createNotification(userId, {
      type: template.type,
      category: template.category,
      title: processedTemplates.inApp.title,
      message: processedTemplates.inApp.message,
      actionText: processedTemplates.inApp.actionText,
      channels: options?.channels || {
        inApp: true,
        email: true,
        sms: false,
        push: true
      },
      ...options
    });

    return notification;
  }

  async getUserNotifications(userId: string, filters?: NotificationFilters) {
    const {
      type,
      category,
      isRead,
      startDate,
      endDate,
      page = 1,
      limit = 20
    } = filters || {};

    let whereClause: any = { userId };

    if (type) whereClause.type = type;
    if (category) whereClause.category = category;
    if (typeof isRead === 'boolean') whereClause.isRead = isRead;
    
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt[Op.gte] = new Date(startDate);
      if (endDate) whereClause.createdAt[Op.lte] = new Date(endDate);
    }

    // Exclude expired notifications
    whereClause[Op.or] = [
      { expiresAt: null },
      { expiresAt: { [Op.gt]: new Date() } }
    ];

    const notifications = await Notification.findAndCountAll({
      where: whereClause,
      limit,
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']]
    });

    return {
      notifications: notifications.rows,
      pagination: {
        page,
        limit,
        total: notifications.count,
        totalPages: Math.ceil(notifications.count / limit)
      }
    };
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification = await Notification.findOne({
      where: { id: notificationId, userId }
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    await notification.update({
      isRead: true,
      readAt: new Date()
    });

    return notification;
  }

  async markAllAsRead(userId: string) {
    await Notification.update(
      { isRead: true, readAt: new Date() },
      {
        where: {
          userId,
          isRead: false
        }
      }
    );
  }

  async getUnreadCount(userId: string): Promise<number> {
    return await Notification.count({
      where: {
        userId,
        isRead: false,
        [Op.or]: [
          { expiresAt: null },
          { expiresAt: { [Op.gt]: new Date() } }
        ]
      }
    });
  }

  private async deliverInAppNotification(notification: Notification) {
    // Send via WebSocket
    if (global.io) {
      global.io.to(notification.userId).emit('notification', {
        type: 'notification',
        data: notification
      });
    }
  }

  private async deliverEmailNotification(notification: Notification, user: User) {
    // Use email service (Sendgrid, AWS SES, etc.)
    const emailService = require('./emailService');
    
    await emailService.sendEmail({
      to: user.email,
      subject: notification.title,
      html: this.generateEmailHTML(notification),
      text: notification.message
    });
  }

  private async deliverSMSNotification(notification: Notification, user: User) {
    // Use SMS service (Twilio, AWS SNS, etc.)
    const smsService = require('./smsService');
    
    await smsService.sendSMS({
      to: user.phone,
      message: `${notification.title}: ${notification.message}`
    });
  }

  private async deliverPushNotification(notification: Notification, user: User) {
    // Use push notification service (Firebase, etc.)
    const pushService = require('./pushService');
    
    await pushService.sendPushNotification({
      userId: user.id,
      title: notification.title,
      body: notification.message,
      data: {
        notificationId: notification.id,
        actionUrl: notification.actionUrl
      }
    });
  }

  private processTemplate(template: NotificationTemplate, variables: Record<string, any>) {
    const processString = (str: string) => {
      return str.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return variables[key] || match;
      });
    };

    return {
      inApp: {
        title: processString(template.templates.inApp.title),
        message: processString(template.templates.inApp.message),
        actionText: template.templates.inApp.actionText ? 
          processString(template.templates.inApp.actionText) : undefined
      },
      email: {
        subject: processString(template.templates.email.subject),
        htmlContent: processString(template.templates.email.htmlContent),
        textContent: processString(template.templates.email.textContent)
      },
      sms: {
        message: processString(template.templates.sms.message)
      },
      push: {
        title: processString(template.templates.push.title),
        body: processString(template.templates.push.body)
      }
    };
  }

  private isInQuietHours(preferences: NotificationPreferences): boolean {
    if (!preferences.quietHoursEnabled) return false;

    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    
    const start = preferences.quietHoursStart;
    const end = preferences.quietHoursEnd;

    // Handle overnight quiet hours (e.g., 22:00 - 08:00)
    if (start > end) {
      return currentTime >= start || currentTime <= end;
    } else {
      return currentTime >= start && currentTime <= end;
    }
  }

  private calculateNextDeliveryTime(preferences: NotificationPreferences): Date {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [endHour, endMin] = preferences.quietHoursEnd.split(':').map(Number);
    tomorrow.setHours(endHour, endMin, 0, 0);

    return tomorrow;
  }

  private generateEmailHTML(notification: Notification): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${notification.title}</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h2 style="color: #333; margin-bottom: 16px;">${notification.title}</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">${notification.message}</p>
            ${notification.actionUrl ? `
              <a href="${notification.actionUrl}" 
                 style="background-color: #007bff; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 4px; display: inline-block;">
                ${notification.actionText || 'View Details'}
              </a>
            ` : ''}
          </div>
          <div style="margin-top: 20px; font-size: 12px; color: #999; text-align: center;">
            <p>Mexican Pickleball Federation</p>
            <p>You received this notification because of your account settings.</p>
          </div>
        </body>
      </html>
    `;
  }
}
```

### Phase 3: WebSocket Real-time Communication

#### 3.1 Socket Service (`backend/src/services/socketService.ts`)
```typescript
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

class SocketService {
  private io: Server;
  private connectedUsers: Map<string, string> = new Map(); // userId -> socketId

  initialize(server: any) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL,
        methods: ['GET', 'POST']
      }
    });

    // Global io instance for other services
    global.io = this.io;

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    // Authentication middleware
    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
        socket.userId = decoded.userId;
        next();
      } catch (error) {
        next(new Error('Authentication error'));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`User ${socket.userId} connected`);
      
      // Store connection
      this.connectedUsers.set(socket.userId, socket.id);
      
      // Join user-specific room for notifications
      socket.join(socket.userId);

      // Handle conversation joining
      socket.on('join_conversation', (conversationId) => {
        socket.join(conversationId);
      });

      socket.on('leave_conversation', (conversationId) => {
        socket.leave(conversationId);
      });

      // Handle typing indicators
      socket.on('typing_start', (data) => {
        socket.to(data.conversationId).emit('user_typing', {
          userId: socket.userId,
          conversationId: data.conversationId
        });
      });

      socket.on('typing_stop', (data) => {
        socket.to(data.conversationId).emit('user_stopped_typing', {
          userId: socket.userId,
          conversationId: data.conversationId
        });
      });

      // Handle message delivery confirmations
      socket.on('message_delivered', (data) => {
        socket.to(data.conversationId).emit('message_delivery_confirmed', {
          messageId: data.messageId,
          userId: socket.userId
        });
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`User ${socket.userId} disconnected`);
        this.connectedUsers.delete(socket.userId);
      });
    });
  }

  // Public methods for other services to use
  sendToUser(userId: string, event: string, data: any) {
    this.io.to(userId).emit(event, data);
  }

  sendToConversation(conversationId: string, event: string, data: any) {
    this.io.to(conversationId).emit(event, data);
  }

  isUserOnline(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }

  getOnlineUsers(): string[] {
    return Array.from(this.connectedUsers.keys());
  }
}

export default new SocketService();
```

### Phase 4: Frontend Components

#### 4.1 Real-time Chat Component (`frontend/src/components/messaging/ChatWindow.tsx`)
```typescript
interface ChatWindowProps {
  conversationId: string;
  onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversationId, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [typing, setTyping] = useState<string[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const user = useAppSelector(selectCurrentUser);

  useEffect(() => {
    loadConversation();
    loadMessages();
    
    // Join conversation for real-time updates
    socket.emit('join_conversation', conversationId);
    
    // Setup socket listeners
    socket.on('new_message', handleNewMessage);
    socket.on('user_typing', handleUserTyping);
    socket.on('user_stopped_typing', handleUserStoppedTyping);
    socket.on('message_reaction', handleMessageReaction);
    
    return () => {
      socket.emit('leave_conversation', conversationId);
      socket.off('new_message');
      socket.off('user_typing');
      socket.off('user_stopped_typing');
      socket.off('message_reaction');
    };
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversation = async () => {
    try {
      const response = await api.get(`/conversations/${conversationId}`);
      setConversation(response.data.data);
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const loadMessages = async () => {
    try {
      const response = await api.get(`/conversations/${conversationId}/messages`);
      setMessages(response.data.data.messages);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewMessage = (data: { message: Message; conversationId: string }) => {
    if (data.conversationId === conversationId) {
      setMessages(prev => [...prev, data.message]);
    }
  };

  const handleUserTyping = (data: { userId: string; conversationId: string }) => {
    if (data.conversationId === conversationId && data.userId !== user?.id) {
      setTyping(prev => [...prev.filter(id => id !== data.userId), data.userId]);
    }
  };

  const handleUserStoppedTyping = (data: { userId: string; conversationId: string }) => {
    if (data.conversationId === conversationId) {
      setTyping(prev => prev.filter(id => id !== data.userId));
    }
  };

  const handleMessageReaction = (data: { messageId: string; reactions: any[] }) => {
    setMessages(prev => prev.map(msg => 
      msg.id === data.messageId 
        ? { ...msg, reactions: data.reactions }
        : msg
    ));
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    try {
      const messageData = {
        conversationId,
        content: newMessage.trim(),
        messageType: 'text'
      };

      await api.post('/messages', messageData);
      setNewMessage('');
      
      // Stop typing indicator
      socket.emit('typing_stop', { conversationId });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleTyping = (value: string) => {
    setNewMessage(value);
    
    // Send typing indicator
    if (value.length > 0) {
      socket.emit('typing_start', { conversationId });
    } else {
      socket.emit('typing_stop', { conversationId });
    }
  };

  const addReaction = async (messageId: string, emoji: string) => {
    try {
      await api.post(`/messages/${messageId}/reactions`, { emoji });
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <h3 className="font-medium">
            {conversation?.name || 'Direct Message'}
          </h3>
          {conversation?.type === 'group' && (
            <span className="ml-2 text-sm text-gray-500">
              {conversation.participants.filter(p => p.isActive).length} members
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.senderId === user?.id}
            onReaction={(emoji) => addReaction(message.id, emoji)}
          />
        ))}
        
        {/* Typing indicator */}
        {typing.length > 0 && (
          <div className="text-sm text-gray-500 italic">
            {typing.length === 1 ? 'Someone is typing...' : `${typing.length} people are typing...`}
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="border-t p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => handleTyping(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

const MessageBubble: React.FC<{
  message: Message;
  isOwn: boolean;
  onReaction: (emoji: string) => void;
}> = ({ message, isOwn, onReaction }) => {
  const [showReactions, setShowReactions] = useState(false);

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const groupedReactions = message.reactions?.reduce((acc, reaction) => {
    if (!acc[reaction.emoji]) {
      acc[reaction.emoji] = [];
    }
    acc[reaction.emoji].push(reaction.userId);
    return acc;
  }, {} as Record<string, string[]>) || {};

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className="max-w-xs lg:max-w-md">
        {!isOwn && (
          <div className="text-xs text-gray-500 mb-1">
            {message.sender?.username}
          </div>
        )}
        
        <div
          className={`relative rounded-lg px-3 py-2 ${
            isOwn
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-900'
          }`}
          onDoubleClick={() => setShowReactions(!showReactions)}
        >
          <div className="break-words">{message.content}</div>
          
          <div className="text-xs mt-1 opacity-75">
            {formatTime(message.createdAt)}
          </div>

          {/* Reactions */}
          {Object.keys(groupedReactions).length > 0 && (
            <div className="absolute -bottom-2 left-0 flex space-x-1">
              {Object.entries(groupedReactions).map(([emoji, userIds]) => (
                <span
                  key={emoji}
                  className="bg-white border border-gray-200 rounded-full px-2 py-1 text-xs shadow-sm"
                >
                  {emoji} {userIds.length}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Quick reactions */}
        {showReactions && (
          <div className="flex space-x-1 mt-2">
            {['👍', '❤️', '😂', '😮', '😢', '🎾'].map(emoji => (
              <button
                key={emoji}
                onClick={() => {
                  onReaction(emoji);
                  setShowReactions(false);
                }}
                className="bg-gray-100 hover:bg-gray-200 rounded-full p-1 text-sm"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
```

#### 4.2 Notification Center (`frontend/src/components/notifications/NotificationCenter.tsx`)
```typescript
const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
    
    // Setup real-time notifications
    socket.on('notification', handleNewNotification);
    
    return () => {
      socket.off('notification');
    };
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await api.get('/notifications', {
        params: { limit: 10 }
      });
      setNotifications(response.data.data.notifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await api.get('/notifications/unread-count');
      setUnreadCount(response.data.data.count);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const handleNewNotification = (data: { type: string; data?: Notification }) => {
    if (data.type === 'notification' && data.data) {
      setNotifications(prev => [data.data, ...prev.slice(0, 9)]);
      setUnreadCount(prev => prev + 1);
      
      // Show browser notification if permitted
      if (Notification.permission === 'granted') {
        new Notification(data.data.title, {
          body: data.data.message,
          icon: '/favicon.ico'
        });
      }
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, isRead: true, readAt: new Date() } : n
      ));
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/mark-all-read');
      
      setNotifications(prev => prev.map(n => ({ 
        ...n, 
        isRead: true, 
        readAt: new Date() 
      })));
      
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
    
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onClick={() => handleNotificationClick(notification)}
                />
              ))
            )}
          </div>

          <div className="p-4 border-t">
            <Link
              to="/notifications"
              className="block text-center text-sm text-blue-600 hover:text-blue-800"
              onClick={() => setShowDropdown(false)}
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

const NotificationItem: React.FC<{
  notification: Notification;
  onClick: () => void;
}> = ({ notification, onClick }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'tournament':
        return '🏆';
      case 'booking':
        return '🎾';
      case 'message':
        return '💬';
      case 'payment':
        return '💳';
      default:
        return '📢';
    }
  };

  const getCategoryColor = () => {
    switch (notification.category) {
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      case 'urgent':
        return 'text-red-700';
      default:
        return 'text-blue-600';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return new Date(date).toLocaleDateString();
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
        !notification.isRead ? 'bg-blue-50' : ''
      }`}
    >
      <div className="flex items-start space-x-3">
        <span className="text-lg flex-shrink-0">{getIcon()}</span>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className={`text-sm font-medium ${getCategoryColor()}`}>
              {notification.title}
            </p>
            {!notification.isRead && (
              <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
            )}
          </div>
          
          <p className="text-sm text-gray-600 mt-1">
            {notification.message}
          </p>
          
          <p className="text-xs text-gray-500 mt-2">
            {formatTime(notification.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
};
```

### Phase 5: Testing & Quality Assurance

#### 5.1 Messaging System Tests
```typescript
// backend/tests/messaging.test.ts
describe('Messaging System', () => {
  describe('Message Creation', () => {
    it('should create and send message', async () => {
      const messageData = {
        conversationId: 'conv-id',
        content: 'Hello world!',
        messageType: 'text'
      };

      const response = await request(app)
        .post('/api/messages')
        .set('Authorization', `Bearer ${playerToken}`)
        .send(messageData)
        .expect(201);

      expect(response.body.data.content).toBe('Hello world!');
    });
  });

  describe('Notifications', () => {
    it('should create notification from template', async () => {
      const response = await request(app)
        .post('/api/notifications/from-template')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          templateName: 'tournament_reminder',
          userId: 'player-id',
          variables: {
            tournamentName: 'Test Tournament',
            startTime: '2024-12-01 10:00'
          }
        })
        .expect(201);

      expect(response.body.success).toBe(true);
    });

    it('should get user notifications', async () => {
      const response = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${playerToken}`)
        .expect(200);

      expect(Array.isArray(response.body.data.notifications)).toBe(true);
    });
  });

  describe('Real-time Features', () => {
    it('should handle socket connection', (done) => {
      const client = io('http://localhost:5000', {
        auth: { token: playerToken }
      });

      client.on('connect', () => {
        expect(client.connected).toBe(true);
        client.disconnect();
        done();
      });
    });
  });
});
```

## Implementation Priority
1. **CRITICAL**: Database schema and models (Phase 1)
2. **CRITICAL**: Message and notification services (Phase 2)
3. **HIGH**: WebSocket real-time communication (Phase 3)
4. **HIGH**: Frontend chat and notification components (Phase 4)
5. **MEDIUM**: Email and SMS integration
6. **LOW**: Comprehensive testing (Phase 5)

## Expected Results
After implementation:
- Real-time messaging system with WebSocket support
- Comprehensive notification system across multiple channels
- User-controlled notification preferences
- Template-based notification system for consistency
- Message history with search capabilities
- Push notifications for mobile and browser
- Email and SMS integration for critical notifications
- In-app notification center with read/unread status

## Files to Create/Modify
- `backend/src/models/Message.ts`
- `backend/src/models/Conversation.ts`
- `backend/src/models/Notification.ts`
- `backend/src/models/NotificationPreferences.ts`
- `backend/src/models/NotificationTemplate.ts`
- `backend/src/services/messageService.ts`
- `backend/src/services/notificationService.ts`
- `backend/src/services/socketService.ts`
- `backend/src/controllers/messageController.ts`
- `backend/src/controllers/notificationController.ts`
- `frontend/src/components/messaging/ChatWindow.tsx`
- `frontend/src/components/notifications/NotificationCenter.tsx`
- `frontend/src/hooks/useSocket.ts`
- `frontend/src/store/messageSlice.ts`
- `frontend/src/store/notificationSlice.ts`