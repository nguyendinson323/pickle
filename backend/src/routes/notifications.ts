import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import notificationController from '../controllers/notificationController';

const router = Router();

// All notification routes require authentication
router.use(authenticate);

// Notification endpoints
router.get('/', notificationController.getNotifications);
router.put('/:id/read', notificationController.markNotificationAsRead);
router.put('/mark-all-read', notificationController.markAllNotificationsAsRead);
router.delete('/:id', notificationController.deleteNotification);
router.get('/unread-count', notificationController.getUnreadCount);

export default router;