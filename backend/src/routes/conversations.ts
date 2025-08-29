import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { body, param, query } from 'express-validator';
import conversationService from '../services/conversationService';
import enhancedNotificationService from '../services/enhancedNotificationService';

const router = Router();

// Create a new conversation
router.post('/',
  authenticateToken,
  [
    body('type').isIn(['direct', 'group', 'tournament', 'finder_request']),
    body('participantIds').isArray().notEmpty(),
    body('participantIds.*').isInt({ min: 1 }),
    body('name').optional().trim().isLength({ max: 100 }),
    body('metadata').optional().isObject()
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const conversation = await conversationService.createConversation(req.user!.id, {
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
  }
);

// Get user's conversations
router.get('/',
  authenticateToken,
  [
    query('type').optional().isArray(),
    query('isArchived').optional().isBoolean(),
    query('search').optional().trim().isLength({ max: 100 }),
    query('limit').optional().isInt({ min: 1, max: 50 }),
    query('offset').optional().isInt({ min: 0 })
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const filters = {
        type: req.query.type as string[],
        isArchived: req.query.isArchived === 'true',
        search: req.query.search as string,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
        offset: req.query.offset ? parseInt(req.query.offset as string) : 0
      };

      const result = await conversationService.getConversations(req.user!.id, filters);

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
  }
);

// Get conversation messages
router.get('/:conversationId/messages',
  authenticateToken,
  [
    param('conversationId').isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('offset').optional().isInt({ min: 0 }),
    query('before').optional().isISO8601()
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const options = {
        limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
        offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
        before: req.query.before ? new Date(req.query.before as string) : undefined
      };

      const result = await conversationService.getConversationMessages(
        parseInt(req.params.conversationId),
        req.user!.id,
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
  }
);

// Send a message
router.post('/:conversationId/messages',
  authenticateToken,
  [
    param('conversationId').isInt({ min: 1 }),
    body('content').notEmpty().trim().isLength({ max: 5000 }),
    body('messageType').optional().isIn(['text', 'image', 'file', 'system', 'location', 'finder_invitation']),
    body('replyToId').optional().isInt({ min: 1 }),
    body('attachments').optional().isArray(),
    body('metadata').optional().isObject()
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const message = await conversationService.sendMessage(
        parseInt(req.params.conversationId),
        req.user!.id,
        {
          content: req.body.content,
          messageType: req.body.messageType,
          replyToId: req.body.replyToId,
          attachments: req.body.attachments,
          metadata: req.body.metadata
        }
      );

      // Send notifications to other participants (async)
      // We don't await this to avoid slowing down the response
      conversationService.getConversations(req.user!.id, { limit: 1 })
        .then(async (result) => {
          const conversation = result.conversations.find(c => c.id === parseInt(req.params.conversationId));
          if (conversation) {
            for (const participantId of conversation.participantIds) {
              if (participantId !== req.user!.id) {
                await enhancedNotificationService.notifyNewMessage(
                  participantId,
                  {
                    senderName: `${req.user!.firstName} ${req.user!.lastName}`,
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
  }
);

// Edit a message
router.patch('/messages/:messageId',
  authenticateToken,
  [
    param('messageId').isInt({ min: 1 }),
    body('content').notEmpty().trim().isLength({ max: 5000 })
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const message = await conversationService.editMessage(
        parseInt(req.params.messageId),
        req.user!.id,
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
  }
);

// Delete a message
router.delete('/messages/:messageId',
  authenticateToken,
  [
    param('messageId').isInt({ min: 1 }),
    body('deleteForEveryone').optional().isBoolean()
  ],
  async (req: Request, res: Response) => {
    try {
      await conversationService.deleteMessage(
        parseInt(req.params.messageId),
        req.user!.id,
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
  }
);

// Add reaction to message
router.post('/messages/:messageId/reactions',
  authenticateToken,
  [
    param('messageId').isInt({ min: 1 }),
    body('reaction').notEmpty().trim().isLength({ min: 1, max: 10 })
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const reaction = await conversationService.addReaction(
        parseInt(req.params.messageId),
        req.user!.id,
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
  }
);

// Remove reaction from message
router.delete('/messages/:messageId/reactions/:reaction',
  authenticateToken,
  [
    param('messageId').isInt({ min: 1 }),
    param('reaction').notEmpty().trim().isLength({ min: 1, max: 10 })
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      await conversationService.removeReaction(
        parseInt(req.params.messageId),
        req.user!.id,
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
  }
);

// Mark messages as read
router.post('/:conversationId/read',
  authenticateToken,
  [
    param('conversationId').isInt({ min: 1 })
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      await conversationService.markMessagesAsRead(
        parseInt(req.params.conversationId),
        req.user!.id
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
  }
);

// Archive conversation
router.patch('/:conversationId/archive',
  authenticateToken,
  [
    param('conversationId').isInt({ min: 1 })
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      await conversationService.archiveConversation(
        parseInt(req.params.conversationId),
        req.user!.id
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
  }
);

// Unarchive conversation
router.patch('/:conversationId/unarchive',
  authenticateToken,
  [
    param('conversationId').isInt({ min: 1 })
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      await conversationService.unarchiveConversation(
        parseInt(req.params.conversationId),
        req.user!.id
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
  }
);

// Add participant to conversation
router.post('/:conversationId/participants',
  authenticateToken,
  [
    param('conversationId').isInt({ min: 1 }),
    body('participantId').isInt({ min: 1 })
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      await conversationService.addParticipant(
        parseInt(req.params.conversationId),
        req.user!.id,
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
  }
);

// Remove participant from conversation
router.delete('/:conversationId/participants/:participantId',
  authenticateToken,
  [
    param('conversationId').isInt({ min: 1 }),
    param('participantId').isInt({ min: 1 })
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      await conversationService.removeParticipant(
        parseInt(req.params.conversationId),
        req.user!.id,
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
  }
);

// Get unread message count
router.get('/unread-count',
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const count = await conversationService.getUnreadMessageCount(req.user!.id);

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
  }
);

// Search messages
router.get('/search',
  authenticateToken,
  [
    query('q').notEmpty().trim().isLength({ min: 2, max: 100 }),
    query('conversationId').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 }),
    query('offset').optional().isInt({ min: 0 })
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const options = {
        conversationId: req.query.conversationId ? parseInt(req.query.conversationId as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
        offset: req.query.offset ? parseInt(req.query.offset as string) : 0
      };

      const result = await conversationService.searchMessages(
        req.user!.id,
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
  }
);

export default router;