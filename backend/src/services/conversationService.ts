import Conversation from '../models/Conversation';
import ConversationMessage from '../models/ConversationMessage';
import MessageReaction from '../models/MessageReaction';
import User from '../models/User';
import privacyService from './privacyService';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

// Associations are defined in models/index.ts - no need to duplicate here

interface CreateConversationData {
  type: 'direct' | 'group' | 'tournament' | 'court_booking';
  name?: string;
  description?: string;
  participants: {
    userId: string;
    role: 'admin' | 'member';
  }[];
  relatedEntityType?: 'tournament' | 'court_booking' | 'player_match';
  relatedEntityId?: string;
  settings?: {
    allowFileSharing?: boolean;
    allowLocationSharing?: boolean;
    muteNotifications?: boolean;
    archiveAfterDays?: number;
  };
}

interface UpdateConversationData {
  name?: string;
  description?: string;
  groupIcon?: string;
  settings?: {
    allowFileSharing?: boolean;
    allowLocationSharing?: boolean;
    muteNotifications?: boolean;
    archiveAfterDays?: number;
  };
}

interface ConversationFilters {
  userId?: string;
  type?: string;
  isActive?: boolean;
  isArchived?: boolean;
  relatedEntityType?: string;
  relatedEntityId?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

interface PaginationOptions {
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
}

class ConversationService {
  
  async createConversation(data: CreateConversationData): Promise<Conversation> {
    try {
      // Validate participants
      if (!data.participants || data.participants.length === 0) {
        throw new Error('Conversation must have at least one participant');
      }

      // For direct conversations, ensure exactly 2 participants
      if (data.type === 'direct' && data.participants.length !== 2) {
        throw new Error('Direct conversation must have exactly 2 participants');
      }

      // For group conversations, ensure at least one admin
      if (data.type === 'group') {
        const hasAdmin = data.participants.some(p => p.role === 'admin');
        if (!hasAdmin) {
          throw new Error('Group conversation must have at least one admin');
        }
      }

      // Check if direct conversation already exists
      if (data.type === 'direct') {
        const userIds = data.participants.map(p => Number(p.userId)).sort();
        const existing = await this.findDirectConversation(userIds[0], userIds[1]);
        if (existing) {
          return existing;
        }
      }

      // Prepare participants data
      const participants = data.participants.map(p => ({
        userId: p.userId,
        role: p.role,
        joinedAt: new Date(),
        isActive: true
      }));

      // Create conversation
      const conversation = await Conversation.create({
        id: uuidv4(),
        type: data.type,
        name: data.name,
        description: data.description,
        participants,
        isGroup: data.type === 'group',
        relatedEntityType: data.relatedEntityType,
        relatedEntityId: data.relatedEntityId,
        settings: {
          allowFileSharing: true,
          allowLocationSharing: true,
          muteNotifications: false,
          ...data.settings
        },
        isActive: true,
        isArchived: false
      });

      return conversation;
    } catch (error: any) {
      throw new Error(`Failed to create conversation: ${error.message}`);
    }
  }

  async findDirectConversation(userId1: number, userId2: number): Promise<Conversation | null> {
    const conversations = await Conversation.findAll({
      where: {
        type: 'direct'
      } as any
    });

    return conversations.find(conv => {
      const participantUserIds = conv.participants
        .filter(p => p.isActive)
        .map(p => Number(p.userId));
      return participantUserIds.length === 2 &&
             participantUserIds.includes(userId1) &&
             participantUserIds.includes(userId2);
    }) || null;
  }

  async sendMessage(
    conversationId: number,
    senderId: number,
    messageData: any
  ): Promise<any> {
    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Check if user is participant
    const participantUserIds = conversation.participants
      .filter(p => p.isActive)
      .map(p => Number(p.userId));
    
    if (!participantUserIds.includes(senderId)) {
      throw new Error('User is not a participant in this conversation');
    }

    // Check privacy settings for all other participants
    for (const participantUserId of participantUserIds) {
      if (participantUserId !== senderId) {
        // Privacy service check
        const canContact = await privacyService.canPlayerContactUser(senderId, participantUserId);
        if (!canContact.canContact) {
          throw new Error(`Cannot send message: ${canContact.reason}`);
        }
      }
    }

    // Validate reply
    if (messageData.replyToId) {
      const replyMessage = await ConversationMessage.findOne({
        where: {
          id: messageData.replyToId,
          conversationId
        }
      });
      
      if (!replyMessage) {
        throw new Error('Reply message not found in this conversation');
      }
    }

    const message = await ConversationMessage.create({
      conversationId,
      senderId,
      content: messageData.content,
      messageType: messageData.messageType || 'text',
      replyToId: messageData.replyToId,
      attachments: messageData.attachments,
      metadata: messageData.metadata || {}
    });

    // Update conversation last message info
    await Conversation.update(
      {
        lastMessageId: message.id,
        lastMessageAt: message.createdAt
      },
      {
        where: { id: conversationId }
      }
    );

    return message;
  }

  async getConversations(
    userId: number,
    filters: ConversationFilters = {}
  ): Promise<{
    conversations: Conversation[];
    total: number;
  }> {
    const {
      type,
      isArchived = false,
      search,
      limit = 20,
      offset = 0
    } = filters;

    const whereConditions: any = {
      participantIds: { [Op.contains]: [userId] },
      isArchived
    };

    if (type && type.length > 0) {
      whereConditions.type = { [Op.in]: type };
    }

    if (search) {
      whereConditions.name = {
        [Op.iLike]: `%${search}%`
      };
    }

    const { count, rows } = await Conversation.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: ConversationMessage,
          as: 'messages',
          limit: 1,
          order: [['createdAt', 'DESC']],
          include: [
            {
              model: User,
              as: 'sender',
              attributes: ['id', 'username', 'email']
            }
          ]
        }
      ],
      limit,
      offset,
      order: [['lastMessageAt', 'DESC']]
    });

    return {
      conversations: rows,
      total: count
    };
  }

  async getConversationMessages(
    conversationId: number,
    userId: number,
    options: {
      limit?: number;
      offset?: number;
      before?: Date;
    } = {}
  ): Promise<{
    messages: any[];
    total: number;
  }> {
    const { limit = 50, offset = 0, before } = options;

    // Check if user is participant
    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Check if user is participant using the correct participants structure
    const participantUserIds = conversation.participants
      .filter(p => p.isActive)
      .map(p => Number(p.userId));
    
    if (!participantUserIds.includes(userId)) {
      throw new Error('Access denied - user is not a participant in this conversation');
    }

    const whereConditions: any = {
      conversationId,
      isDeleted: false
    };

    if (before) {
      whereConditions.createdAt = {
        [Op.lt]: before
      };
    }

    const { count, rows } = await ConversationMessage.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'username', 'email']
        },
        {
          model: ConversationMessage,
          as: 'replyTo',
          include: [
            {
              model: User,
              as: 'sender',
              attributes: ['username']
            }
          ]
        },
        {
          model: MessageReaction,
          as: 'reactions',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username']
            }
          ]
        }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    // Mark messages as read
    await this.markMessagesAsRead(conversationId, userId);

    return {
      messages: rows.reverse(), // Reverse to show oldest first
      total: count
    };
  }

  async markMessagesAsRead(conversationId: number, userId: number): Promise<void> {
    const unreadMessages = await ConversationMessage.findAll({
      where: {
        conversationId,
        senderId: { [Op.ne]: userId },
        isDeleted: false
      }
    });

    console.log(`Marking ${unreadMessages.length} messages as read for user ${userId} in conversation ${conversationId}`);
  }

  async addReaction(
    messageId: number,
    userId: number,
    reaction: string
  ): Promise<any> {
    const message = await ConversationMessage.findByPk(messageId, {
      include: [
        {
          model: Conversation,
          as: 'conversation'
        }
      ]
    });

    if (!message) {
      throw new Error('Message not found');
    }

    // Check if user is participant in the conversation
    const conversation = (message as any).conversation;
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    const participantUserIds = conversation.participants
      .filter((p: any) => p.isActive)
      .map((p: any) => Number(p.userId));
    
    if (!participantUserIds.includes(userId)) {
      throw new Error('Access denied');
    }

    // Remove existing reaction by this user on this message with same reaction type
    await MessageReaction.destroy({
      where: {
        messageId,
        userId,
        reaction
      }
    });

    // Add new reaction
    return await MessageReaction.create({
      messageId,
      userId,
      reaction
    });
  }

  async removeReaction(
    messageId: number,
    userId: number,
    reaction: string
  ): Promise<void> {
    await MessageReaction.destroy({
      where: {
        messageId,
        userId,
        reaction
      }
    });
  }

  async editMessage(
    messageId: number,
    userId: number,
    newContent: string
  ): Promise<any> {
    const message = await ConversationMessage.findByPk(messageId);
    if (!message) {
      throw new Error('Message not found');
    }

    if (message.senderId !== userId) {
      throw new Error('Only the sender can edit this message');
    }

    // Don't allow editing system messages
    if (message.messageType === 'system') {
      throw new Error('Cannot edit system messages');
    }

    message.content = newContent;
    message.isEdited = true;
    message.editedAt = new Date();
    await message.save();

    return message;
  }

  async deleteMessage(
    messageId: number,
    userId: number,
    deleteForEveryone: boolean = false
  ): Promise<void> {
    const message = await ConversationMessage.findByPk(messageId);
    if (!message) {
      throw new Error('Message not found');
    }

    if (message.senderId !== userId) {
      throw new Error('Only the sender can delete this message');
    }

    if (deleteForEveryone) {
      message.isDeleted = true;
      message.deletedAt = new Date();
      message.content = 'Este mensaje ha sido eliminado';
      await message.save();
    } else {
      // For now, we'll implement soft delete for everyone
      message.isDeleted = true;
      message.deletedAt = new Date();
      await message.save();
    }
  }

  async archiveConversation(conversationId: number, userId: number): Promise<void> {
    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Check if user is participant using correct participants structure
    const participantUserIds = conversation.participants
      .filter(p => p.isActive)
      .map(p => Number(p.userId));
    
    if (!participantUserIds.includes(userId)) {
      throw new Error('Access denied - user is not a participant');
    }

    conversation.isArchived = true;
    await conversation.save();
  }

  async unarchiveConversation(conversationId: number, userId: number): Promise<void> {
    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Check if user is participant using correct participants structure
    const participantUserIds = conversation.participants
      .filter(p => p.isActive)
      .map(p => Number(p.userId));
    
    if (!participantUserIds.includes(userId)) {
      throw new Error('Access denied - user is not a participant');
    }

    conversation.isArchived = false;
    await conversation.save();
  }

  async getUnreadMessageCount(userId: number): Promise<number> {
    const conversations = await Conversation.findAll({
      where: {
        isArchived: false
      } as any
    });

    // Filter conversations where user is an active participant
    const userConversations = conversations.filter(conv => {
      const participantUserIds = conv.participants
        .filter(p => p.isActive)
        .map(p => Number(p.userId));
      return participantUserIds.includes(userId);
    });

    let totalUnread = 0;
    for (const conversation of userConversations) {
      const unreadCount = await ConversationMessage.count({
        where: {
          conversationId: conversation.id,
          senderId: { [Op.ne]: userId },
          isDeleted: false
        }
      });
      totalUnread += unreadCount;
    }

    console.log(`Getting unread message count for user ${userId} across ${userConversations.length} conversations: ${totalUnread}`);
    return totalUnread;
  }

  async searchMessages(
    userId: number,
    query: string,
    options: {
      conversationId?: number;
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<{
    messages: any[];
    total: number;
  }> {
    const { conversationId, limit = 20, offset = 0 } = options;

    const whereConditions: any = {
      content: {
        [Op.iLike]: `%${query}%`
      },
      isDeleted: false
    };

    if (conversationId) {
      whereConditions.conversationId = conversationId;
    }

    const { count, rows } = await ConversationMessage.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: Conversation,
          as: 'conversation'
        },
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'username', 'email']
        }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    console.log(`Searching messages for user ${userId} with query: ${query} - found ${count} results`);
    return {
      messages: rows,
      total: count
    };
  }

  async addParticipant(conversationId: number, adderId: number, newParticipantId: number): Promise<void> {
    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Check if adder is participant using correct participants structure
    const participantUserIds = conversation.participants
      .filter(p => p.isActive)
      .map(p => Number(p.userId));
    
    if (!participantUserIds.includes(adderId)) {
      throw new Error('Only participants can add new members');
    }

    if (conversation.type === 'direct') {
      throw new Error('Cannot add participants to direct conversations');
    }

    if (participantUserIds.includes(newParticipantId)) {
      throw new Error('User is already a participant');
    }

    // Privacy service check would go here
    const canContact = await privacyService.canPlayerContactUser(adderId, newParticipantId);
    if (!canContact.canContact) {
      throw new Error(`Cannot add participant: ${canContact.reason}`);
    }

    // Add new participant to the participants array
    const newParticipant = {
      userId: newParticipantId.toString(),
      role: 'member' as const,
      joinedAt: new Date(),
      isActive: true
    };
    conversation.participants = [...conversation.participants, newParticipant];
    await conversation.save();

    // Send system message
    await this.sendMessage(conversationId, adderId, {
      content: `Usuario agregado a la conversación`,
      messageType: 'system',
      metadata: { addedUserId: newParticipantId }
    });
  }

  async removeParticipant(conversationId: number, removerId: number, participantId: number): Promise<void> {
    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Check if remover is participant using correct participants structure
    const participantUserIds = conversation.participants
      .filter(p => p.isActive)
      .map(p => Number(p.userId));
    
    if (!participantUserIds.includes(removerId)) {
      throw new Error('Access denied');
    }

    if (conversation.type === 'direct') {
      throw new Error('Cannot remove participants from direct conversations');
    }

    // Users can remove themselves, or the first participant (creator) can remove others
    const creatorId = conversation.participants
      .filter(p => p.isActive)
      .sort((a, b) => new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime())[0];
    
    if (removerId !== participantId && Number(creatorId?.userId) !== removerId) {
      throw new Error('Only the creator can remove other participants');
    }

    // Remove participant by setting isActive to false
    conversation.participants = conversation.participants.map(p => 
      Number(p.userId) === participantId 
        ? { ...p, isActive: false, leftAt: new Date() }
        : p
    );
    await conversation.save();

    // Send system message if not self-removal
    if (removerId !== participantId) {
      await this.sendMessage(conversationId, removerId, {
        content: `Usuario removido de la conversación`,
        messageType: 'system',
        metadata: { removedUserId: participantId }
      });
    }
  }
}

export default new ConversationService();