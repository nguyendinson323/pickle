import Message from '../models/Message';
import Conversation from '../models/Conversation';
import NotificationService from './notificationService';
import { Op, literal } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

interface CreateMessageData {
  conversationId: string;
  senderId: string;
  content: string;
  messageType?: 'text' | 'image' | 'file' | 'system' | 'location' | 'match_invite';
  attachments?: {
    type: 'image' | 'file';
    url: string;
    filename: string;
    size: number;
  }[];
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  matchInvite?: {
    courtId: string;
    facilityId: string;
    proposedTime: Date;
    duration: number;
  };
}

interface UpdateMessageData {
  content?: string;
  attachments?: any[];
}

interface MessageFilters {
  conversationId?: string;
  senderId?: string;
  messageType?: string;
  fromDate?: Date;
  toDate?: Date;
  includeDeleted?: boolean;
}

interface PaginationOptions {
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
}

class MessageService {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  async createMessage(data: CreateMessageData): Promise<Message> {
    try {
      // Verify conversation exists and user is participant
      const conversation = await Conversation.findByPk(data.conversationId);
      if (!conversation) {
        throw new Error('Conversation not found');
      }

      const isParticipant = conversation.participants.some(
        (p: any) => p.userId === data.senderId.toString() && p.isActive
      );
      if (!isParticipant) {
        throw new Error('User is not a participant in this conversation');
      }

      // Create message
      const message = await Message.create({
        conversationId: parseInt(data.conversationId),
        senderId: parseInt(data.senderId),
        content: data.content,
        messageType: data.messageType || 'text',
        attachments: data.attachments || [],
        location: data.location,
        matchInvite: data.matchInvite ? {
          ...data.matchInvite,
          courtId: parseInt(data.matchInvite.courtId),
          facilityId: parseInt(data.matchInvite.facilityId)
        } : undefined,
        isEdited: false,
        isDeleted: false,
        readBy: [{ userId: parseInt(data.senderId), readAt: new Date() }],
        reactions: []
      });

      // Update conversation's last message
      await this.updateConversationLastMessage(data.conversationId, message);

      // Send notifications to other participants
      if (data.messageType !== 'system') {
        await this.sendMessageNotifications(conversation, message, data.senderId);
      }

      return message;
    } catch (error: any) {
      throw new Error(`Failed to create message: ${error.message}`);
    }
  }

  async getMessages(filters: MessageFilters, options: PaginationOptions = {}): Promise<{
    messages: Message[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const {
        page = 1,
        limit = 50,
        orderBy = 'createdAt',
        orderDirection = 'DESC'
      } = options;

      const whereClause: any = {};

      if (filters.conversationId) {
        whereClause.conversationId = filters.conversationId;
      }

      if (filters.senderId) {
        whereClause.senderId = filters.senderId;
      }

      if (filters.messageType) {
        whereClause.messageType = filters.messageType;
      }

      if (filters.fromDate && filters.toDate) {
        whereClause.createdAt = {
          [Op.between]: [filters.fromDate, filters.toDate]
        };
      } else if (filters.fromDate) {
        whereClause.createdAt = {
          [Op.gte]: filters.fromDate
        };
      } else if (filters.toDate) {
        whereClause.createdAt = {
          [Op.lte]: filters.toDate
        };
      }

      if (!filters.includeDeleted) {
        whereClause.isDeleted = false;
      }

      const offset = (page - 1) * limit;

      const { count, rows } = await Message.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        order: [[orderBy, orderDirection]],
        include: [
          {
            association: 'sender',
            attributes: ['id', 'username', 'firstName', 'lastName', 'profilePicture']
          }
        ]
      });

      return {
        messages: rows,
        total: count,
        page,
        totalPages: Math.ceil(count / limit)
      };
    } catch (error: any) {
      throw new Error(`Failed to fetch messages: ${error.message}`);
    }
  }

  async getMessageById(messageId: string): Promise<Message | null> {
    try {
      return await Message.findByPk(messageId, {
        include: [
          {
            association: 'sender',
            attributes: ['id', 'username', 'firstName', 'lastName', 'profilePicture']
          },
          {
            association: 'conversation',
            attributes: ['id', 'type', 'name', 'participants']
          }
        ]
      });
    } catch (error: any) {
      throw new Error(`Failed to fetch message: ${error.message}`);
    }
  }

  async updateMessage(messageId: string, userId: string, data: UpdateMessageData): Promise<Message> {
    try {
      const message = await Message.findByPk(messageId);
      if (!message) {
        throw new Error('Message not found');
      }

      // Check if user owns the message
      if (message.senderId !== parseInt(userId)) {
        throw new Error('Unauthorized to edit this message');
      }

      // Check if message is not deleted
      if (message.isDeleted) {
        throw new Error('Cannot edit deleted message');
      }

      // Update message
      await message.update({
        ...data,
        isEdited: true,
        editedAt: new Date()
      });

      return message;
    } catch (error: any) {
      throw new Error(`Failed to update message: ${error.message}`);
    }
  }

  async deleteMessage(messageId: string, userId: string): Promise<void> {
    try {
      const message = await Message.findByPk(messageId);
      if (!message) {
        throw new Error('Message not found');
      }

      // Check if user owns the message
      if (message.senderId !== parseInt(userId)) {
        throw new Error('Unauthorized to delete this message');
      }

      // Soft delete
      await message.update({
        isDeleted: true,
        deletedAt: new Date(),
        content: '[Message deleted]'
      });
    } catch (error: any) {
      throw new Error(`Failed to delete message: ${error.message}`);
    }
  }

  async markMessageAsRead(messageId: string, userId: string): Promise<void> {
    try {
      const message = await Message.findByPk(messageId);
      if (!message) {
        throw new Error('Message not found');
      }

      // Check if already read by user
      const alreadyRead = message.readBy.some((read: any) => read.userId === userId);
      if (!alreadyRead) {
        const updatedReadBy = [
          ...message.readBy,
          { userId: parseInt(userId), readAt: new Date() }
        ];

        await message.update({ readBy: updatedReadBy });
      }
    } catch (error: any) {
      throw new Error(`Failed to mark message as read: ${error.message}`);
    }
  }

  async addReaction(messageId: string, userId: string, emoji: string): Promise<void> {
    try {
      const message = await Message.findByPk(messageId);
      if (!message) {
        throw new Error('Message not found');
      }

      // Remove existing reaction from same user
      const filteredReactions = message.reactions.filter(
        (reaction: any) => reaction.userId !== userId
      );

      // Add new reaction
      const updatedReactions = [
        ...filteredReactions,
        { userId: parseInt(userId), emoji, createdAt: new Date() }
      ];

      await message.update({ reactions: updatedReactions });
    } catch (error: any) {
      throw new Error(`Failed to add reaction: ${error.message}`);
    }
  }

  async removeReaction(messageId: string, userId: string): Promise<void> {
    try {
      const message = await Message.findByPk(messageId);
      if (!message) {
        throw new Error('Message not found');
      }

      // Remove reaction from user
      const updatedReactions = message.reactions.filter(
        (reaction: any) => reaction.userId !== userId
      );

      await message.update({ reactions: updatedReactions });
    } catch (error: any) {
      throw new Error(`Failed to remove reaction: ${error.message}`);
    }
  }

  async searchMessages(
    conversationId: string,
    query: string,
    options: PaginationOptions = {}
  ): Promise<{
    messages: Message[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const {
        page = 1,
        limit = 20,
        orderBy = 'createdAt',
        orderDirection = 'DESC'
      } = options;

      const offset = (page - 1) * limit;

      const { count, rows } = await Message.findAndCountAll({
        where: {
          conversationId,
          content: {
            [Op.iLike]: `%${query}%`
          },
          isDeleted: false
        },
        limit,
        offset,
        order: [[orderBy, orderDirection]],
        include: [
          {
            association: 'sender',
            attributes: ['id', 'username', 'firstName', 'lastName', 'profilePicture']
          }
        ]
      });

      return {
        messages: rows,
        total: count,
        page,
        totalPages: Math.ceil(count / limit)
      };
    } catch (error: any) {
      throw new Error(`Failed to search messages: ${error.message}`);
    }
  }

  async getUnreadCount(userId: string, conversationId?: string): Promise<number> {
    try {
      const whereClause: any = {
        senderId: { [Op.ne]: userId },
        isDeleted: false
      };

      if (conversationId) {
        whereClause.conversationId = conversationId;
      }

      const messages = await Message.findAll({
        where: whereClause,
        attributes: ['id', 'readBy']
      });

      // Count messages not read by user
      const unreadCount = messages.filter((message: any) => {
        return !message.readBy.some((read: any) => read.userId === userId);
      }).length;

      return unreadCount;
    } catch (error: any) {
      throw new Error(`Failed to get unread count: ${error.message}`);
    }
  }

  private async updateConversationLastMessage(conversationId: string, message: Message): Promise<void> {
    try {
      const preview = this.generateMessagePreview(message);
      
      await Conversation.update({
        lastMessageId: message.id,
        lastMessageAt: message.createdAt,
        lastMessagePreview: preview
      }, {
        where: { id: conversationId }
      });
    } catch (error: any) {
      console.error('Failed to update conversation last message:', error);
    }
  }

  private generateMessagePreview(message: Message): string {
    switch (message.messageType) {
      case 'text':
        return message.content.length > 100 
          ? `${message.content.substring(0, 100)}...` 
          : message.content;
      case 'image':
        return '📷 Image';
      case 'file':
        return '📎 File';
      case 'location':
        return '📍 Location';
      case 'match_invite':
        return '🎾 Match Invitation';
      case 'system':
        return message.content;
      default:
        return 'New message';
    }
  }

  private async sendMessageNotifications(
    conversation: Conversation,
    message: Message,
    senderId: string
  ): Promise<void> {
    try {
      // Get other participants (exclude sender)
      const otherParticipants = conversation.participants.filter(
        (p: any) => p.userId !== senderId && p.isActive
      );

      // Send notification to each participant
      for (const participant of otherParticipants) {
        const notificationType = conversation.isGroup ? 'group_message' : 'direct_message';
        
        await this.notificationService.sendNotification({
          userId: participant.userId,
          type: 'message',
          category: 'info',
          templateType: notificationType,
          data: {
            senderName: 'User', // Will be populated by notification service
            conversationName: conversation.name || 'Direct Message',
            messagePreview: this.generateMessagePreview(message),
            conversationId: conversation.id.toString(),
            messageId: message.id
          },
          actionUrl: `/messages/${conversation.id}`,
          relatedEntityType: 'message',
          relatedEntityId: message.id.toString()
        });
      }
    } catch (error: any) {
      console.error('Failed to send message notifications:', error);
    }
  }

  private async findOrCreateDirectConversation(senderId: string, receiverId: string): Promise<Conversation> {
    // Try to find existing conversation
    let conversation = await Conversation.findOne({
      where: {
        type: 'direct',
        [Op.and]: [
          literal(`participants @> '[{"userId": "${senderId}"}]'`),
          literal(`participants @> '[{"userId": "${receiverId}"}]'`)
        ]
      }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        id: uuidv4(),
        type: 'direct',
        name: null,
        participants: [
          { userId: senderId, role: 'member', isActive: true, joinedAt: new Date() },
          { userId: receiverId, role: 'member', isActive: true, joinedAt: new Date() }
        ],
        isGroup: false,
        // createdBy field removed as it doesn't exist in model
      });
    }

    return conversation;
  }

  // Additional methods for controller compatibility
  async sendMessage(
    senderId: string, 
    receiverId: string, 
    subject: string, 
    content: string, 
    options: { isUrgent?: boolean; attachments?: any[] } = {}
  ): Promise<any> {
    try {
      // Find or create conversation between sender and receiver
      let conversation = await this.findOrCreateDirectConversation(senderId, receiverId);
      
      const messageData: CreateMessageData = {
        conversationId: conversation.id.toString(),
        senderId,
        content,
        messageType: 'text',
        attachments: options.attachments || []
      };

      const message = await this.createMessage(messageData);
      
      // Note: subject and urgency could be stored separately if needed

      return message;
    } catch (error: any) {
      throw new Error(`Failed to send message: ${error.message}`);
    }
  }

  async getInbox(userId: string, page: number = 1, limit: number = 20): Promise<{
    conversations: any[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const offset = (page - 1) * limit;

      // Get conversations where user is participant
      const { count, rows } = await Conversation.findAndCountAll({
        where: literal(`participants @> '[{"userId": "${userId}"}]'`),
        limit,
        offset,
        order: [['lastMessageAt', 'DESC']],
        include: [
          {
            association: 'lastMessage',
            include: [{
              association: 'sender',
              attributes: ['id', 'username', 'firstName', 'lastName', 'profilePicture']
            }]
          }
        ]
      });

      return {
        conversations: rows,
        total: count,
        page,
        totalPages: Math.ceil(count / limit)
      };
    } catch (error: any) {
      throw new Error(`Failed to get inbox: ${error.message}`);
    }
  }

  async markAsRead(messageId: string, userId: string): Promise<boolean> {
    try {
      await this.markMessageAsRead(messageId, userId);
      return true;
    } catch (error: any) {
      return false;
    }
  }

  async sendAnnouncementToAll(
    senderId: string, 
    subject: string, 
    content: string, 
    targetRoles?: string[]
  ): Promise<number> {
    try {
      // This would typically involve creating a broadcast or system message
      // For now, we'll create individual conversations or use the notification system
      
      // Use notification service to send announcements
      const User = require('../models/User');
      const whereClause: any = {};
      
      if (targetRoles && targetRoles.length > 0) {
        whereClause.role = { [Op.in]: targetRoles };
      }

      const targetUsers = await User.findAll({
        where: whereClause,
        attributes: ['id']
      });

      let sentCount = 0;
      for (const user of targetUsers) {
        if (user.id !== senderId) {
          try {
            await this.notificationService.sendNotification({
              userId: user.id,
              type: 'message',
              category: 'info',
              templateType: 'system_announcement',
              data: {
                subject,
                content,
                senderName: 'System Administrator'
              },
              actionUrl: '/announcements',
              relatedEntityType: 'announcement',
              relatedEntityId: `announcement_${Date.now()}`
            });
            sentCount++;
          } catch (error) {
            console.error(`Failed to send announcement to user ${user.id}:`, error);
          }
        }
      }

      return sentCount;
    } catch (error: any) {
      throw new Error(`Failed to send announcement: ${error.message}`);
    }
  }

  async getConversation(
    userId: string, 
    otherUserId: string, 
    page: number = 1, 
    limit: number = 20
  ): Promise<{
    messages: Message[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      // Find conversation between the two users
      const conversation = await this.findDirectConversation(userId, otherUserId);
      
      if (!conversation) {
        return {
          messages: [],
          total: 0,
          page,
          totalPages: 0
        };
      }

      return await this.getMessages(
        { conversationId: conversation.id.toString() },
        { page, limit, orderDirection: 'ASC' }
      );
    } catch (error: any) {
      throw new Error(`Failed to get conversation: ${error.message}`);
    }
  }

  private async findDirectConversation(userId: string, otherUserId: string): Promise<Conversation | null> {
    try {
      return await Conversation.findOne({
        where: {
          type: 'direct',
          [Op.and]: [
            literal(`participants @> '[{"userId": "${userId}"}]'`),
            literal(`participants @> '[{"userId": "${otherUserId}"}]'`)
          ]
        }
      });
    } catch (error) {
      console.error('Error finding direct conversation:', error);
      return null;
    }
  }

}

export default new MessageService();