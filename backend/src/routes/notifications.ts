import express from 'express';
import NotificationService from '../services/notificationService';
import { authenticate } from '../middleware/auth';
// Validation middleware and express-validator not available

const router = express.Router();
const notificationService = new NotificationService();

// Validation schemas

// Get user notifications
router.get('/',
  authenticate,
  async (req, res) => {
    try {
      const userId = req.user?.userId.toString();
      
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
  authenticate,
  async (req, res) => {
    try {
      // Check if user has admin privileges
      if (req.user?.role !== 'admin') {
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
  authenticate,
  async (req, res) => {
    try {
      const userId = req.user?.userId.toString();
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
  authenticate,
  async (req, res) => {
    try {
      const userId = req.user?.userId.toString();
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
  authenticate,
  async (req, res) => {
    try {
      const userId = req.user?.userId.toString();
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
  authenticate,
  async (req, res) => {
    try {
      const userId = req.user?.userId.toString();
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
  authenticate,
  async (req, res) => {
    try {
      const userId = req.user?.userId.toString();
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
  authenticate,
  async (req, res) => {
    try {
      const userId = req.user?.userId.toString();
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
  authenticate,
  async (req, res) => {
    try {
      // Check if user has admin privileges
      if (req.user?.role !== 'admin') {
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
  authenticate,
  async (req, res) => {
    try {
      // Check if user has admin privileges
      if (req.user?.role !== 'admin') {
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
  authenticate,
  async (req, res) => {
    try {
      // Check if user has admin privileges
      if (req.user?.role !== 'admin') {
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
  authenticate,
  async (req, res) => {
    try {
      // Check if user has admin privileges
      if (req.user?.role !== 'admin') {
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
  authenticate,
  async (req, res) => {
    try {
      // Check if user has admin privileges
      if (req.user?.role !== 'admin') {
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