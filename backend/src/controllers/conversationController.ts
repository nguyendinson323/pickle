import { Response } from 'express';
import { AuthRequest } from '../types/auth';
import conversationService from '../services/conversationService';
import enhancedNotificationService from '../services/enhancedNotificationService';

// Create a new conversation
const createConversation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const conversation = await conversationService.createConversation(req.user.userId, {
      type: req.body.type,
      participantIds: req.body.participantIds,
      name: req.body.name,
      metadata: req.body.metadata || {}
    });

    res.status(201).json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create conversation'
    });
  }
};

// Get user's conversations
const getConversations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filters = {
      type: req.query.type as string[],
      isArchived: req.query.isArchived === 'true',
      search: req.query.search as string,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      offset: req.query.offset ? parseInt(req.query.offset as string) : 0
    };

    const result = await conversationService.getConversations(req.user.userId, filters);

    res.json({
      success: true,
      data: result.conversations,
      pagination: {
        total: result.total,
        limit: filters.limit,
        offset: filters.offset,
        hasMore: result.total > (filters.offset + filters.limit)
      }
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch conversations'
    });
  }
};

// Get conversation messages
const getConversationMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const options = {
      limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
      offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
      before: req.query.before ? new Date(req.query.before as string) : undefined
    };

    const result = await conversationService.getConversationMessages(
      parseInt(req.params.conversationId),
      req.user.userId,
      options
    );

    res.json({
      success: true,
      data: result.messages,
      pagination: {
        total: result.total,
        limit: options.limit,
        offset: options.offset,
        hasMore: result.total > (options.offset + options.limit)
      }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch messages'
    });
  }
};

// Send a message
const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const message = await conversationService.sendMessage(
      parseInt(req.params.conversationId),
      req.user.userId,
      {
        content: req.body.content,
        messageType: req.body.messageType,
        replyToId: req.body.replyToId,
        attachments: req.body.attachments,
        metadata: req.body.metadata
      }
    );

    // Send notifications to other participants (async)
    conversationService.getConversations(req.user.userId, { limit: 1 })
      .then(async (result) => {
        const conversation = result.conversations.find(c => c.id === parseInt(req.params.conversationId));
        if (conversation) {
          for (const participantId of conversation.participantIds) {
            if (participantId !== req.user.userId) {
              await enhancedNotificationService.notifyNewMessage(
                participantId,
                {
                  senderName: req.user.email,
                  messageContent: req.body.content,
                  messagePreview: req.body.content.substring(0, 100),
                  conversationId: parseInt(req.params.conversationId)
                }
              ).catch(console.error);
            }
          }
        }
      })
      .catch(console.error);

    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send message'
    });
  }
};

// Edit a message
const editMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const message = await conversationService.editMessage(
      parseInt(req.params.messageId),
      req.user.userId,
      req.body.content
    );

    res.json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Error editing message:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to edit message'
    });
  }
};

// Delete a message
const deleteMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await conversationService.deleteMessage(
      parseInt(req.params.messageId),
      req.user.userId,
      req.body.deleteForEveryone || false
    );

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete message'
    });
  }
};

// Add reaction to message
const addReaction = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const reaction = await conversationService.addReaction(
      parseInt(req.params.messageId),
      req.user.userId,
      req.body.reaction
    );

    res.status(201).json({
      success: true,
      data: reaction
    });
  } catch (error) {
    console.error('Error adding reaction:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add reaction'
    });
  }
};

// Remove reaction from message
const removeReaction = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await conversationService.removeReaction(
      parseInt(req.params.messageId),
      req.user.userId,
      req.params.reaction
    );

    res.json({
      success: true,
      message: 'Reaction removed successfully'
    });
  } catch (error) {
    console.error('Error removing reaction:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to remove reaction'
    });
  }
};

// Mark messages as read
const markMessagesAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await conversationService.markMessagesAsRead(
      parseInt(req.params.conversationId),
      req.user.userId
    );

    res.json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to mark messages as read'
    });
  }
};

// Archive conversation
const archiveConversation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await conversationService.archiveConversation(
      parseInt(req.params.conversationId),
      req.user.userId
    );

    res.json({
      success: true,
      message: 'Conversation archived successfully'
    });
  } catch (error) {
    console.error('Error archiving conversation:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to archive conversation'
    });
  }
};

// Unarchive conversation
const unarchiveConversation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await conversationService.unarchiveConversation(
      parseInt(req.params.conversationId),
      req.user.userId
    );

    res.json({
      success: true,
      message: 'Conversation unarchived successfully'
    });
  } catch (error) {
    console.error('Error unarchiving conversation:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to unarchive conversation'
    });
  }
};

// Add participant to conversation
const addParticipant = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await conversationService.addParticipant(
      parseInt(req.params.conversationId),
      req.user.userId,
      req.body.participantId
    );

    res.json({
      success: true,
      message: 'Participant added successfully'
    });
  } catch (error) {
    console.error('Error adding participant:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add participant'
    });
  }
};

// Remove participant from conversation
const removeParticipant = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await conversationService.removeParticipant(
      parseInt(req.params.conversationId),
      req.user.userId,
      parseInt(req.params.participantId)
    );

    res.json({
      success: true,
      message: 'Participant removed successfully'
    });
  } catch (error) {
    console.error('Error removing participant:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to remove participant'
    });
  }
};

// Get unread message count
const getUnreadMessageCount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const count = await conversationService.getUnreadMessageCount(req.user.userId);

    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get unread message count'
    });
  }
};

// Search messages
const searchMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const options = {
      conversationId: req.query.conversationId ? parseInt(req.query.conversationId as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      offset: req.query.offset ? parseInt(req.query.offset as string) : 0
    };

    const result = await conversationService.searchMessages(
      req.user.userId,
      req.query.q as string,
      options
    );

    res.json({
      success: true,
      data: result.messages,
      pagination: {
        total: result.total,
        limit: options.limit,
        offset: options.offset,
        hasMore: result.total > (options.offset + options.limit)
      }
    });
  } catch (error) {
    console.error('Error searching messages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search messages'
    });
  }
};

export default {
  createConversation,
  getConversations,
  getConversationMessages,
  sendMessage,
  editMessage,
  deleteMessage,
  addReaction,
  removeReaction,
  markMessagesAsRead,
  archiveConversation,
  unarchiveConversation,
  addParticipant,
  removeParticipant,
  getUnreadMessageCount,
  searchMessages
};