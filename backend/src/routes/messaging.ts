import express from 'express';
// import MessageService from '../services/messageService';
import ConversationService from '../services/conversationService';
import NotificationService from '../services/notificationService';
import { authenticate } from '../middleware/auth';

const router = express.Router();
// Services would need to be properly imported and instantiated
// const messageService = new MessageService(); // MessageService needs to be a class
const conversationService = ConversationService; // ConversationService is already exported as instance
const notificationService = new NotificationService();

// Basic conversation routes

// Create conversation
router.post('/conversations', 
  authenticate,
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
  authenticate,
  async (req, res) => {
    try {
      const userId = req.user?.userId || 0; // Fixed: use userId instead of id
      const conversations = await conversationService.getConversations(userId, {});
      res.json({
        success: true,
        data: conversations
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Archive conversation
router.post('/conversations/:conversationId/archive',
  authenticate,
  async (req, res) => {
    try {
      const userId = req.user?.userId || 0; // Fixed: use userId instead of id
      await conversationService.archiveConversation(parseInt(req.params.conversationId), userId);

      res.json({
        success: true,
        message: 'Conversation archived successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Send message (placeholder - would need MessageService)
router.post('/conversations/:conversationId/messages',
  authenticate,
  async (req, res) => {
    try {
      // This would require MessageService to be properly implemented
      res.status(501).json({
        success: false,
        error: 'Message sending not implemented yet - MessageService needed'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Get conversation messages
router.get('/conversations/:conversationId/messages',
  authenticate,
  async (req, res) => {
    try {
      const userId = req.user?.userId || 0;
      const conversationId = parseInt(req.params.conversationId);
      const messages = await conversationService.getConversationMessages(conversationId, userId, {});
      
      res.json({
        success: true,
        data: messages
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Get unread messages count
router.get('/messages/unread/count',
  authenticate,
  async (req, res) => {
    try {
      const userId = req.user?.userId || 0;
      const count = await conversationService.getUnreadMessageCount(userId);
      
      res.json({
        success: true,
        data: { count }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

export default router;