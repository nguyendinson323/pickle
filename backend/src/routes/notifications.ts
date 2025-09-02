import express from 'express';
import NotificationService from '../services/notificationService';
import { authenticateUser } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { body, param, query } from 'express-validator';

const router = express.Router();
const notificationService = new NotificationService();

// Validation schemas
const notificationIdValidation = [
  param('notificationId').isUUID().withMessage('Invalid notification ID')
];

const sendNotificationValidation = [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('type').isIn(['system', 'tournament', 'booking', 'message', 'match', 'payment', 'maintenance']).withMessage('Invalid notification type'),
  body('category').isIn(['info', 'success', 'warning', 'error', 'urgent']).withMessage('Invalid category'),
  body('title').optional().isLength({ min: 1, max: 255 }).withMessage('Title must be 1-255 characters'),
  body('message').optional().isLength({ min: 1, max: 2000 }).withMessage('Message must be 1-2000 characters'),
  body('templateType').optional().isString(),
  body('actionUrl').optional().isURL().withMessage('Invalid action URL'),
  body('scheduledFor').optional().isISO8601().withMessage('Invalid scheduled date'),
  body('expiresAt').optional().isISO8601().withMessage('Invalid expiry date')
];

const updatePreferencesValidation = [
  body('globalEnabled').optional().isBoolean(),
  body('quietHoursEnabled').optional().isBoolean(),
  body('quietHoursStart').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid time format'),
  body('quietHoursEnd').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid time format'),
  body('preferences').optional().isObject()
];

// Get user notifications
router.get('/',
  authenticateUser,
  [
    query('type').optional().isIn(['system', 'tournament', 'booking', 'message', 'match', 'payment', 'maintenance']),
    query('category').optional().isIn(['info', 'success', 'warning', 'error', 'urgent']),
    query('isRead').optional().isBoolean(),
    query('fromDate').optional().isISO8601(),
    query('toDate').optional().isISO8601(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validateRequest,
  async (req, res) => {
    try {
      const userId = req.user?.id.toString();
      
      const filters = {
        type: req.query.type as string,
        category: req.query.category as string,
        isRead: req.query.isRead === 'true',
        fromDate: req.query.fromDate ? new Date(req.query.fromDate as string) : undefined,
        toDate: req.query.toDate ? new Date(req.query.toDate as string) : undefined
      };

      const options = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20
      };

      const result = await notificationService.getNotifications(userId, filters, options);
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

// Send notification (admin only)
router.post('/',
  authenticateUser,
  sendNotificationValidation,
  validateRequest,
  async (req, res) => {
    try {
      // Check if user has admin privileges
      if (req.user?.role !== 'admin' && req.user?.role !== 'federation') {
        return res.status(403).json({
          success: false,
          error: 'Insufficient permissions'
        });
      }

      const notificationData = {
        ...req.body,
        scheduledFor: req.body.scheduledFor ? new Date(req.body.scheduledFor) : undefined,
        expiresAt: req.body.expiresAt ? new Date(req.body.expiresAt) : undefined
      };

      const notification = await notificationService.sendNotification(notificationData);
      res.status(201).json({
        success: true,
        data: notification
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Mark notification as read
router.post('/:notificationId/read',
  authenticateUser,
  notificationIdValidation,
  validateRequest,
  async (req, res) => {
    try {
      const userId = req.user?.id.toString();
      await notificationService.markAsRead(req.params.notificationId, userId);

      res.json({
        success: true,
        message: 'Notification marked as read'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Mark all notifications as read
router.post('/read-all',
  authenticateUser,
  async (req, res) => {
    try {
      const userId = req.user?.id.toString();
      await notificationService.markAllAsRead(userId);

      res.json({
        success: true,
        message: 'All notifications marked as read'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Delete notification
router.delete('/:notificationId',
  authenticateUser,
  notificationIdValidation,
  validateRequest,
  async (req, res) => {
    try {
      const userId = req.user?.id.toString();
      await notificationService.deleteNotification(req.params.notificationId, userId);

      res.json({
        success: true,
        message: 'Notification deleted successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Get notification preferences
router.get('/preferences',
  authenticateUser,
  async (req, res) => {
    try {
      const userId = req.user?.id.toString();
      const preferences = await notificationService.getUserPreferences(userId);

      res.json({
        success: true,
        data: preferences
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Update notification preferences
router.put('/preferences',
  authenticateUser,
  updatePreferencesValidation,
  validateRequest,
  async (req, res) => {
    try {
      const userId = req.user?.id.toString();
      const preferences = await notificationService.updateUserPreferences(userId, req.body);

      res.json({
        success: true,
        data: preferences
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Get unread notifications count
router.get('/unread/count',
  authenticateUser,
  async (req, res) => {
    try {
      const userId = req.user?.id.toString();
      const result = await notificationService.getNotifications(
        userId,
        { isRead: false },
        { limit: 1 }
      );

      res.json({
        success: true,
        data: { count: result.unreadCount }
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Process scheduled notifications (admin only)
router.post('/process-scheduled',
  authenticateUser,
  async (req, res) => {
    try {
      // Check if user has admin privileges
      if (req.user?.role !== 'admin' && req.user?.role !== 'federation') {
        return res.status(403).json({
          success: false,
          error: 'Insufficient permissions'
        });
      }

      await notificationService.processScheduledNotifications();
      res.json({
        success: true,
        message: 'Scheduled notifications processed successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Cleanup expired notifications (admin only)
router.post('/cleanup-expired',
  authenticateUser,
  async (req, res) => {
    try {
      // Check if user has admin privileges
      if (req.user?.role !== 'admin' && req.user?.role !== 'federation') {
        return res.status(403).json({
          success: false,
          error: 'Insufficient permissions'
        });
      }

      const deletedCount = await notificationService.cleanupExpiredNotifications();
      res.json({
        success: true,
        message: `${deletedCount} expired notifications cleaned up`
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Batch send notifications (admin only)
router.post('/batch',
  authenticateUser,
  [
    body('userIds').isArray({ min: 1 }).withMessage('User IDs must be a non-empty array'),
    body('type').isIn(['system', 'tournament', 'booking', 'message', 'match', 'payment', 'maintenance']),
    body('category').isIn(['info', 'success', 'warning', 'error', 'urgent']),
    body('title').optional().isLength({ min: 1, max: 255 }),
    body('message').optional().isLength({ min: 1, max: 2000 }),
    body('templateType').optional().isString()
  ],
  validateRequest,
  async (req, res) => {
    try {
      // Check if user has admin privileges
      if (req.user?.role !== 'admin' && req.user?.role !== 'federation') {
        return res.status(403).json({
          success: false,
          error: 'Insufficient permissions'
        });
      }

      const { userIds, ...notificationData } = req.body;
      const notifications = [];

      // Send notification to each user
      for (const userId of userIds) {
        try {
          const notification = await notificationService.sendNotification({
            ...notificationData,
            userId
          });
          notifications.push(notification);
        } catch (error) {
          console.error(`Failed to send notification to user ${userId}:`, error);
        }
      }

      res.json({
        success: true,
        message: `Successfully sent ${notifications.length} notifications`,
        data: { sent: notifications.length, total: userIds.length }
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Get notification templates (admin only)
router.get('/templates',
  authenticateUser,
  [
    query('category').optional().isIn(['tournament', 'booking', 'message', 'system', 'payment']),
    query('isActive').optional().isBoolean(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validateRequest,
  async (req, res) => {
    try {
      // Check if user has admin privileges
      if (req.user?.role !== 'admin' && req.user?.role !== 'federation') {
        return res.status(403).json({
          success: false,
          error: 'Insufficient permissions'
        });
      }

      // This would typically fetch from NotificationTemplate model
      // For now, return a placeholder response
      res.json({
        success: true,
        data: {
          templates: [],
          total: 0,
          page: 1,
          totalPages: 0
        }
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Test notification delivery (admin only)
router.post('/test',
  authenticateUser,
  [
    body('userId').notEmpty(),
    body('channel').isIn(['inApp', 'email', 'sms', 'push']),
    body('title').isLength({ min: 1, max: 255 }),
    body('message').isLength({ min: 1, max: 2000 })
  ],
  validateRequest,
  async (req, res) => {
    try {
      // Check if user has admin privileges
      if (req.user?.role !== 'admin' && req.user?.role !== 'federation') {
        return res.status(403).json({
          success: false,
          error: 'Insufficient permissions'
        });
      }

      const { userId, channel, title, message } = req.body;
      
      const channels = {
        inApp: channel === 'inApp',
        email: channel === 'email',
        sms: channel === 'sms',
        push: channel === 'push'
      };

      const notification = await notificationService.sendNotification({
        userId,
        type: 'system',
        category: 'info',
        title: `[TEST] ${title}`,
        message: `[TEST] ${message}`,
        channels
      });

      res.json({
        success: true,
        message: `Test notification sent via ${channel}`,
        data: notification
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