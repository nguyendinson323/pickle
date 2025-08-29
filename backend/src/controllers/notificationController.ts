import { Response } from 'express';
import { AuthRequest } from '../types/auth';
import notificationService from '../services/notificationService';
import { asyncHandler } from '../middleware/errorHandler';

export const getNotifications = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user.userId;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  const notificationData = await notificationService.getUserNotifications(userId, page, limit);

  res.json({
    success: true,
    data: notificationData
  });
});

export const markNotificationAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const notificationId = parseInt(req.params.id);
  const userId = req.user.userId;

  const updated = await notificationService.markAsRead(notificationId, userId);

  if (!updated) {
    return res.status(404).json({
      success: false,
      error: 'Notification not found or access denied'
    });
  }

  res.json({
    success: true,
    message: 'Notification marked as read'
  });
});

export const markAllNotificationsAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user.userId;
  const updatedCount = await notificationService.markAllAsRead(userId);

  res.json({
    success: true,
    data: {
      updatedCount
    },
    message: `${updatedCount} notifications marked as read`
  });
});

export const deleteNotification = asyncHandler(async (req: AuthRequest, res: Response) => {
  const notificationId = parseInt(req.params.id);
  const userId = req.user.userId;

  const deleted = await notificationService.deleteNotification(notificationId, userId);

  if (!deleted) {
    return res.status(404).json({
      success: false,
      error: 'Notification not found or access denied'
    });
  }

  res.json({
    success: true,
    message: 'Notification deleted successfully'
  });
});

export const getUnreadCount = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user.userId;
  const unreadCount = await notificationService.getUnreadCount(userId);

  res.json({
    success: true,
    data: {
      unreadCount
    }
  });
});