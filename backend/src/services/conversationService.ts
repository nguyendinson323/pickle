import { Op } from 'sequelize';
import { 
  Conversation, 
  ConversationMessage, 
  MessageReadStatus, 
  MessageReaction,
  User,
  Player
} from '../models';
import privacyService from './privacyService';

interface CreateConversationData {
  name?: string;
  type: 'direct' | 'group' | 'tournament' | 'finder_request';
  participantIds: number[];
  metadata?: Record<string, any>;
}

interface SendMessageData {
  content: string;
  messageType?: 'text' | 'image' | 'file' | 'system' | 'location' | 'finder_invitation';
  replyToId?: number;
  attachments?: string[];
  metadata?: Record<string, any>;
}

interface ConversationFilters {
  type?: string[];
  isArchived?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

class ConversationService {
  async createConversation(
    creatorId: number,
    data: CreateConversationData
  ): Promise<Conversation> {
    const { participantIds, type, name, metadata = {} } = data;

    // Validate participants
    if (!participantIds.includes(creatorId)) {
      participantIds.push(creatorId);
    }

    // For direct conversations, ensure exactly 2 participants
    if (type === 'direct' && participantIds.length !== 2) {
      throw new Error('Direct conversations must have exactly 2 participants');
    }

    // Check if direct conversation already exists
    if (type === 'direct') {
      const existingConversation = await this.findDirectConversation(participantIds[0], participantIds[1]);
      if (existingConversation) {
        return existingConversation;
      }
    }

    // Check privacy settings for all participants
    for (const participantId of participantIds) {
      if (participantId !== creatorId) {
        const canContact = await privacyService.canPlayerContactUser(creatorId, participantId);
        if (!canContact.canContact) {
          throw new Error(`Cannot create conversation: ${canContact.reason}`);
        }
      }
    }

    const conversation = await Conversation.create({
      creatorId,
      name,
      type,
      participantIds,
      metadata
    });

    return conversation;
  }

  async findDirectConversation(userId1: number, userId2: number): Promise<Conversation | null> {
    const conversations = await Conversation.findAll({
      where: {
        type: 'direct',
        [Op.and]: [
          { participantIds: { [Op.contains]: [userId1] } },
          { participantIds: { [Op.contains]: [userId2] } }
        ]
      }
    });

    return conversations.find(conv => 
      conv.participantIds.length === 2 &&
      conv.participantIds.includes(userId1) &&
      conv.participantIds.includes(userId2)
    ) || null;
  }

  async sendMessage(
    conversationId: number,
    senderId: number,
    messageData: SendMessageData
  ): Promise<ConversationMessage> {
    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Check if user is participant
    if (!conversation.participantIds.includes(senderId)) {
      throw new Error('User is not a participant in this conversation');
    }

    // Check privacy settings for all other participants
    for (const participantId of conversation.participantIds) {
      if (participantId !== senderId) {
        const canContact = await privacyService.canPlayerContactUser(senderId, participantId);
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
              attributes: ['id', 'firstName', 'lastName', 'profileImageUrl']
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
    messages: ConversationMessage[];
    total: number;
  }> {
    const { limit = 50, offset = 0, before } = options;

    // Check if user is participant
    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation || !conversation.participantIds.includes(userId)) {
      throw new Error('Conversation not found or access denied');
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
          attributes: ['id', 'firstName', 'lastName', 'profileImageUrl']
        },
        {
          model: ConversationMessage,
          as: 'replyTo',
          include: [
            {
              model: User,
              as: 'sender',
              attributes: ['firstName', 'lastName']
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
              attributes: ['id', 'firstName', 'lastName']
            }
          ]
        },
        {
          model: MessageReadStatus,
          as: 'readStatus'
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
    // Get unread messages
    const unreadMessages = await ConversationMessage.findAll({
      where: {
        conversationId,
        senderId: { [Op.ne]: userId }, // Not sent by the user
        isDeleted: false
      },
      include: [
        {
          model: MessageReadStatus,
          as: 'readStatus',
          where: { userId },
          required: false
        }
      ]
    });

    // Filter messages that haven't been read yet
    const messagesToMarkRead = unreadMessages.filter(
      message => !message.readStatus || message.readStatus.length === 0
    );

    // Create read status records
    const readStatusData = messagesToMarkRead.map(message => ({
      messageId: message.id,
      userId,
      readAt: new Date()
    }));

    if (readStatusData.length > 0) {
      await MessageReadStatus.bulkCreate(readStatusData, {
        ignoreDuplicates: true
      });
    }
  }

  async addReaction(
    messageId: number,
    userId: number,
    reaction: string
  ): Promise<MessageReaction> {
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
    if (!message.conversation!.participantIds.includes(userId)) {
      throw new Error('Access denied');
    }

    // Remove existing reaction by this user on this message
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
  ): Promise<ConversationMessage> {
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
      // In a more complex system, you might track per-user deletions
      message.isDeleted = true;
      message.deletedAt = new Date();
      await message.save();
    }
  }

  async archiveConversation(conversationId: number, userId: number): Promise<void> {
    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation || !conversation.participantIds.includes(userId)) {
      throw new Error('Conversation not found or access denied');
    }

    conversation.isArchived = true;
    await conversation.save();
  }

  async unarchiveConversation(conversationId: number, userId: number): Promise<void> {
    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation || !conversation.participantIds.includes(userId)) {
      throw new Error('Conversation not found or access denied');
    }

    conversation.isArchived = false;
    await conversation.save();
  }

  async getUnreadMessageCount(userId: number): Promise<number> {
    const conversations = await Conversation.findAll({
      where: {
        participantIds: { [Op.contains]: [userId] },
        isArchived: false
      }
    });

    let totalUnread = 0;

    for (const conversation of conversations) {
      const unreadCount = await ConversationMessage.count({
        where: {
          conversationId: conversation.id,
          senderId: { [Op.ne]: userId },
          isDeleted: false
        },
        include: [
          {
            model: MessageReadStatus,
            as: 'readStatus',
            where: { userId },
            required: false
          }
        ]
      });

      totalUnread += unreadCount;
    }

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
    messages: ConversationMessage[];
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
          as: 'conversation',
          where: {
            participantIds: { [Op.contains]: [userId] }
          }
        },
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'firstName', 'lastName', 'profileImageUrl']
        }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

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

    if (!conversation.participantIds.includes(adderId)) {
      throw new Error('Only participants can add new members');
    }

    if (conversation.type === 'direct') {
      throw new Error('Cannot add participants to direct conversations');
    }

    if (conversation.participantIds.includes(newParticipantId)) {
      throw new Error('User is already a participant');
    }

    // Check privacy settings
    const canContact = await privacyService.canPlayerContactUser(adderId, newParticipantId);
    if (!canContact.canContact) {
      throw new Error(`Cannot add participant: ${canContact.reason}`);
    }

    conversation.participantIds = [...conversation.participantIds, newParticipantId];
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

    if (!conversation.participantIds.includes(removerId)) {
      throw new Error('Access denied');
    }

    if (conversation.type === 'direct') {
      throw new Error('Cannot remove participants from direct conversations');
    }

    // Users can remove themselves, or the creator can remove others
    if (removerId !== participantId && conversation.creatorId !== removerId) {
      throw new Error('Only the creator can remove other participants');
    }

    conversation.participantIds = conversation.participantIds.filter(id => id !== participantId);
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