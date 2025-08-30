import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import conversationController from '../controllers/conversationController';

const router = Router();

// Create a new conversation
router.post('/', authenticate, conversationController.createConversation);

// Get user's conversations
router.get('/', authenticate, conversationController.getConversations);

// Get conversation messages
router.get('/:conversationId/messages', authenticate, conversationController.getConversationMessages);

// Send a message
router.post('/:conversationId/messages', authenticate, conversationController.sendMessage);

// Edit a message
router.patch('/messages/:messageId', authenticate, conversationController.editMessage);

// Delete a message
router.delete('/messages/:messageId', authenticate, conversationController.deleteMessage);

// Add reaction to message
router.post('/messages/:messageId/reactions', authenticate, conversationController.addReaction);

// Remove reaction from message
router.delete('/messages/:messageId/reactions/:reaction', authenticate, conversationController.removeReaction);

// Mark messages as read
router.post('/:conversationId/read', authenticate, conversationController.markMessagesAsRead);

// Archive conversation
router.patch('/:conversationId/archive', authenticate, conversationController.archiveConversation);

// Unarchive conversation
router.patch('/:conversationId/unarchive', authenticate, conversationController.unarchiveConversation);

// Add participant to conversation
router.post('/:conversationId/participants', authenticate, conversationController.addParticipant);

// Remove participant from conversation
router.delete('/:conversationId/participants/:participantId', authenticate, conversationController.removeParticipant);

// Get unread message count
router.get('/unread-count', authenticate, conversationController.getUnreadMessageCount);

// Search messages
router.get('/search', authenticate, conversationController.searchMessages);

export default router;