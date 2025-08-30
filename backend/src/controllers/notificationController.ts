import { Response } from 'express';
import { AuthRequest } from '../types/auth';
import notificationService from '../services/notificationService';

const getNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const notificationData = await notificationService.getUserNotifications(userId, page, limit);

    res.json({ success: true, data: notificationData });
  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
};

const markNotificationAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const notificationId = parseInt(req.params.id);
    const userId = req.user.userId;

    const updated = await notificationService.markAsRead(notificationId, userId);

    if (!updated) {
      res.status(404).json({ success: false, error: 'Notification not found or access denied' });
      return;
    }

    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error: any) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
};

const markAllNotificationsAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.userId;
    const updatedCount = await notificationService.markAllAsRead(userId);

    res.json({
      success: true,
      data: { updatedCount },
      message: `${updatedCount} notifications marked as read`
    });
  } catch (error: any) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
};

const deleteNotification = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const notificationId = parseInt(req.params.id);
    const userId = req.user.userId;

    const deleted = await notificationService.deleteNotification(notificationId, userId);

    if (!deleted) {
      res.status(404).json({ success: false, error: 'Notification not found or access denied' });
      return;
    }

    res.json({ success: true, message: 'Notification deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
};

const getUnreadCount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.userId;
    const unreadCount = await notificationService.getUnreadCount(userId);

    res.json({ success: true, data: { unreadCount } });
  } catch (error: any) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
};

export default {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getUnreadCount
};
