import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import {
  sendMessage,
  getInbox,
  markMessageAsRead,
  deleteMessage,
  getUnreadCount,
  sendAnnouncement,
  getConversation
} from '../controllers/messageController';

const router = Router();

// All message routes require authentication
router.use(authenticate);

// Message endpoints
router.get('/inbox', asyncHandler(getInbox));
router.post('/send', asyncHandler(sendMessage));
router.put('/:id/read', asyncHandler(markMessageAsRead));
router.delete('/:id', asyncHandler(deleteMessage));
router.get('/unread-count', asyncHandler(getUnreadCount));

// Conversation endpoints
router.get('/conversation/:userId', asyncHandler(getConversation));

// Announcement endpoints (admin only)
router.post('/announcement', asyncHandler(sendAnnouncement));

export default router;