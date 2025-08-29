import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getUnreadCount
} from '../controllers/notificationController';

const router = Router();

// All notification routes require authentication
router.use(authenticate);

// Notification endpoints
router.get('/', asyncHandler(getNotifications));
router.put('/:id/read', asyncHandler(markNotificationAsRead));
router.put('/mark-all-read', asyncHandler(markAllNotificationsAsRead));
router.delete('/:id', asyncHandler(deleteNotification));
router.get('/unread-count', asyncHandler(getUnreadCount));

export default router;