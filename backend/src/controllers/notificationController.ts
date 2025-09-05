import { Response } from 'express';
import { AuthRequest } from '../types/auth';
import NotificationService from '../services/notificationService';

const notificationService = new NotificationService();

const getNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const notificationData = await notificationService.getNotifications(userId.toString(), {}, { page, limit });

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

    const updated = await notificationService.markAsRead(notificationId.toString(), userId.toString());

    // Updated successfully

    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error: any) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
};

const markAllNotificationsAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.userId;
    await notificationService.markAllAsRead(userId.toString());
    const updatedCount = 'All notifications marked as read';

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

    await notificationService.deleteNotification(notificationId.toString(), userId.toString());
    const deleted = true;

    // Deleted successfully

    res.json({ success: true, message: 'Notification deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
};

const getUnreadCount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.userId;
    const result = await notificationService.getNotifications(userId.toString(), { isRead: false }, { limit: 1 });
    const unreadCount = result.unreadCount || 0;

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
