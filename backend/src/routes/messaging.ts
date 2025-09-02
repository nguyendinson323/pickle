import express from 'express';
import MessageService from '../services/messageService';
import ConversationService from '../services/conversationService';
import NotificationService from '../services/notificationService';
import { authenticateUser } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { body, param, query } from 'express-validator';

const router = express.Router();
const messageService = new MessageService();
const conversationService = new ConversationService();
const notificationService = new NotificationService();

// Validation schemas
const createConversationValidation = [
  body('type').isIn(['direct', 'group', 'tournament', 'court_booking']).withMessage('Invalid conversation type'),
  body('participants').isArray({ min: 1 }).withMessage('Participants must be a non-empty array'),
  body('participants.*.userId').notEmpty().withMessage('Participant userId is required'),
  body('participants.*.role').isIn(['admin', 'member']).withMessage('Invalid participant role'),
  body('name').optional().isLength({ min: 1, max: 255 }).withMessage('Name must be 1-255 characters'),
  body('description').optional().isLength({ max: 1000 }).withMessage('Description must be max 1000 characters')
];

const sendMessageValidation = [
  param('conversationId').isUUID().withMessage('Invalid conversation ID'),
  body('content').isLength({ min: 1, max: 10000 }).withMessage('Content must be 1-10000 characters'),
  body('messageType').optional().isIn(['text', 'image', 'file', 'system', 'location', 'match_invite']).withMessage('Invalid message type')
];

const messageIdValidation = [
  param('messageId').isUUID().withMessage('Invalid message ID')
];

const conversationIdValidation = [
  param('conversationId').isUUID().withMessage('Invalid conversation ID')
];

// Conversation routes

// Create conversation
router.post('/conversations', 
  authenticateUser,
  createConversationValidation,
  validateRequest,
  async (req, res) => {
    try {
      const conversation = await conversationService.createConversation(req.body);
      res.status(201).json({
        success: true,
        data: conversation
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Get user conversations
router.get('/conversations',
  authenticateUser,
  [
    query('type').optional().isIn(['direct', 'group', 'tournament', 'court_booking']),
    query('isActive').optional().isBoolean(),
    query('isArchived').optional().isBoolean(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validateRequest,
  async (req, res) => {
    try {
      const userId = req.user?.id.toString();
      const filters = {
        userId,
        type: req.query.type as string,
        isActive: req.query.isActive === 'true',
        isArchived: req.query.isArchived === 'true'
      };

      const options = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20
      };

      const result = await conversationService.getConversations(filters, options);
      res.json({
        success: true,
        data: result
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Get conversation by ID
router.get('/conversations/:conversationId',
  authenticateUser,
  conversationIdValidation,
  validateRequest,
  async (req, res) => {
    try {
      const userId = req.user?.id.toString();
      const conversation = await conversationService.getConversationById(req.params.conversationId, userId);
      
      if (!conversation) {
        return res.status(404).json({
          success: false,
          error: 'Conversation not found'
        });
      }

      res.json({
        success: true,
        data: conversation
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Update conversation
router.put('/conversations/:conversationId',
  authenticateUser,
  conversationIdValidation,
  [
    body('name').optional().isLength({ min: 1, max: 255 }),
    body('description').optional().isLength({ max: 1000 }),
    body('settings.allowFileSharing').optional().isBoolean(),
    body('settings.allowLocationSharing').optional().isBoolean(),
    body('settings.muteNotifications').optional().isBoolean(),
    body('settings.archiveAfterDays').optional().isInt({ min: 1 })
  ],
  validateRequest,
  async (req, res) => {
    try {
      const userId = req.user?.id.toString();
      const conversation = await conversationService.updateConversation(
        req.params.conversationId,
        userId,
        req.body
      );

      res.json({
        success: true,
        data: conversation
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Add participant to conversation
router.post('/conversations/:conversationId/participants',
  authenticateUser,
  conversationIdValidation,
  [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('role').isIn(['admin', 'member']).withMessage('Invalid role')
  ],
  validateRequest,
  async (req, res) => {
    try {
      const adminUserId = req.user?.id.toString();
      await conversationService.addParticipant(
        req.params.conversationId,
        adminUserId,
        req.body
      );

      res.json({
        success: true,
        message: 'Participant added successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Remove participant from conversation
router.delete('/conversations/:conversationId/participants/:participantId',
  authenticateUser,
  [
    param('conversationId').isUUID(),
    param('participantId').notEmpty()
  ],
  validateRequest,
  async (req, res) => {
    try {
      const adminUserId = req.user?.id.toString();
      await conversationService.removeParticipant(
        req.params.conversationId,
        adminUserId,
        req.params.participantId
      );

      res.json({
        success: true,
        message: 'Participant removed successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Archive conversation
router.post('/conversations/:conversationId/archive',
  authenticateUser,
  conversationIdValidation,
  validateRequest,
  async (req, res) => {
    try {
      const userId = req.user?.id.toString();
      await conversationService.archiveConversation(req.params.conversationId, userId);

      res.json({
        success: true,
        message: 'Conversation archived successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Unarchive conversation
router.post('/conversations/:conversationId/unarchive',
  authenticateUser,
  conversationIdValidation,
  validateRequest,
  async (req, res) => {
    try {
      const userId = req.user?.id.toString();
      await conversationService.unarchiveConversation(req.params.conversationId, userId);

      res.json({
        success: true,
        message: 'Conversation unarchived successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Message routes

// Send message
router.post('/conversations/:conversationId/messages',
  authenticateUser,
  sendMessageValidation,
  validateRequest,
  async (req, res) => {
    try {
      const senderId = req.user?.id.toString();
      const message = await messageService.createMessage({
        ...req.body,
        conversationId: req.params.conversationId,
        senderId
      });

      res.status(201).json({
        success: true,
        data: message
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Get conversation messages
router.get('/conversations/:conversationId/messages',
  authenticateUser,
  conversationIdValidation,
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('fromDate').optional().isISO8601(),
    query('toDate').optional().isISO8601()
  ],
  validateRequest,
  async (req, res) => {
    try {
      const filters = {
        conversationId: req.params.conversationId,
        fromDate: req.query.fromDate ? new Date(req.query.fromDate as string) : undefined,
        toDate: req.query.toDate ? new Date(req.query.toDate as string) : undefined
      };

      const options = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 50,
        orderDirection: 'DESC' as const
      };

      const result = await messageService.getMessages(filters, options);
      res.json({
        success: true,
        data: result
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Get message by ID
router.get('/messages/:messageId',
  authenticateUser,
  messageIdValidation,
  validateRequest,
  async (req, res) => {
    try {
      const message = await messageService.getMessageById(req.params.messageId);
      
      if (!message) {
        return res.status(404).json({
          success: false,
          error: 'Message not found'
        });
      }

      res.json({
        success: true,
        data: message
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Update message
router.put('/messages/:messageId',
  authenticateUser,
  messageIdValidation,
  [
    body('content').isLength({ min: 1, max: 10000 }).withMessage('Content must be 1-10000 characters')
  ],
  validateRequest,
  async (req, res) => {
    try {
      const userId = req.user?.id.toString();
      const message = await messageService.updateMessage(
        req.params.messageId,
        userId,
        req.body
      );

      res.json({
        success: true,
        data: message
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Delete message
router.delete('/messages/:messageId',
  authenticateUser,
  messageIdValidation,
  validateRequest,
  async (req, res) => {
    try {
      const userId = req.user?.id.toString();
      await messageService.deleteMessage(req.params.messageId, userId);

      res.json({
        success: true,
        message: 'Message deleted successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Mark message as read
router.post('/messages/:messageId/read',
  authenticateUser,
  messageIdValidation,
  validateRequest,
  async (req, res) => {
    try {
      const userId = req.user?.id.toString();
      await messageService.markMessageAsRead(req.params.messageId, userId);

      res.json({
        success: true,
        message: 'Message marked as read'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Add reaction to message
router.post('/messages/:messageId/reactions',
  authenticateUser,
  messageIdValidation,
  [
    body('emoji').isLength({ min: 1, max: 10 }).withMessage('Emoji must be 1-10 characters')
  ],
  validateRequest,
  async (req, res) => {
    try {
      const userId = req.user?.id.toString();
      await messageService.addReaction(req.params.messageId, userId, req.body.emoji);

      res.json({
        success: true,
        message: 'Reaction added successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Remove reaction from message
router.delete('/messages/:messageId/reactions',
  authenticateUser,
  messageIdValidation,
  validateRequest,
  async (req, res) => {
    try {
      const userId = req.user?.id.toString();
      await messageService.removeReaction(req.params.messageId, userId);

      res.json({
        success: true,
        message: 'Reaction removed successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Search messages
router.get('/search/messages',
  authenticateUser,
  [
    query('q').isLength({ min: 1 }).withMessage('Search query is required'),
    query('conversationId').optional().isUUID(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validateRequest,
  async (req, res) => {
    try {
      const conversationId = req.query.conversationId as string;
      const query = req.query.q as string;
      
      const options = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20
      };

      const result = await messageService.searchMessages(conversationId, query, options);
      res.json({
        success: true,
        data: result
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Get unread messages count
router.get('/messages/unread/count',
  authenticateUser,
  [
    query('conversationId').optional().isUUID()
  ],
  validateRequest,
  async (req, res) => {
    try {
      const userId = req.user?.id.toString();
      const conversationId = req.query.conversationId as string;
      
      const count = await messageService.getUnreadCount(userId, conversationId);
      res.json({
        success: true,
        data: { count }
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Search conversations
router.get('/search/conversations',
  authenticateUser,
  [
    query('q').isLength({ min: 1 }).withMessage('Search query is required'),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validateRequest,
  async (req, res) => {
    try {
      const userId = req.user?.id.toString();
      const query = req.query.q as string;
      
      const options = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20
      };

      const result = await conversationService.searchConversations(userId, query, options);
      res.json({
        success: true,
        data: result
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);

export default router;