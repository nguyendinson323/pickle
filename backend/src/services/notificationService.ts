import { Notification } from '../models';
import { NotificationItem } from '../types/dashboard';

export class NotificationService {
  
  async createNotification(userId: number, title: string, message: string, options?: {
    type?: 'info' | 'success' | 'warning' | 'error';
    actionUrl?: string;
  }): Promise<Notification> {
    return await Notification.create({
      userId,
      title,
      message,
      type: options?.type || 'info',
      actionUrl: options?.actionUrl
    });
  }

  async getUserNotifications(userId: number, page: number = 1, limit: number = 20): Promise<{
    notifications: NotificationItem[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
  }> {
    const offset = (page - 1) * limit;

    const { rows: notifications, count: totalCount } = await Notification.findAndCountAll({
      where: {
        userId
      },
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;

    const formattedNotifications: NotificationItem[] = notifications.map(notification => ({
      id: notification.id,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      isRead: notification.isRead,
      createdAt: notification.createdAt.toISOString(),
      actionUrl: notification.actionUrl
    }));

    return {
      notifications: formattedNotifications,
      totalCount,
      currentPage: page,
      totalPages,
      hasNextPage
    };
  }

  async markAsRead(notificationId: number, userId: number): Promise<boolean> {
    const [affectedCount] = await Notification.update(
      { isRead: true },
      {
        where: {
          id: notificationId,
          userId
        }
      }
    );

    return affectedCount > 0;
  }

  async markAllAsRead(userId: number): Promise<number> {
    const [affectedCount] = await Notification.update(
      { isRead: true },
      {
        where: {
          userId,
          isRead: false
        }
      }
    );

    return affectedCount;
  }

  async deleteNotification(notificationId: number, userId: number): Promise<boolean> {
    const deletedCount = await Notification.destroy({
      where: {
        id: notificationId,
        userId
      }
    });

    return deletedCount > 0;
  }

  async getUnreadCount(userId: number): Promise<number> {
    return await Notification.count({
      where: {
        userId,
        isRead: false
      }
    });
  }

  async createWelcomeNotification(userId: number, userRole: string): Promise<Notification> {
    const roleMessages = {
      player: 'Complete your profile and start connecting with other players',
      coach: 'Set up your coaching profile and start offering training sessions',
      club: 'Configure your club settings and start managing members',
      partner: 'Set up your business profile and start offering services',
      state: 'Configure your state committee and start managing regional activities',
      federation: 'Welcome to the federation administration panel'
    };

    const message = roleMessages[userRole as keyof typeof roleMessages] || 'Complete your profile to get started';

    return this.createNotification(userId, 'Welcome to the Federation!', message, {
      type: 'info',
      actionUrl: '/profile'
    });
  }

  async createSystemNotification(userIds: number[], title: string, message: string, options?: {
    type?: 'info' | 'success' | 'warning' | 'error';
    actionUrl?: string;
  }): Promise<Notification[]> {
    const notifications = await Promise.all(
      userIds.map(userId => 
        this.createNotification(userId, title, message, options)
      )
    );

    return notifications;
  }
}

const notificationService = new NotificationService();

export const createNotification = (data: {
  userId: number;
  type: 'info' | 'success' | 'warning' | 'error' | 'payment_success' | 'payment_failed' | 'payment_refunded' | 'payment_disputed' | 'subscription_created' | 'subscription_updated' | 'subscription_cancelled' | 'subscription_renewed' | 'membership_cancelled';
  title: string;
  message: string;
  metadata?: any;
}) => {
  return Notification.create({
    userId: data.userId,
    type: data.type,
    title: data.title,
    message: data.message,
    metadata: data.metadata || {}
  });
};

export default notificationService;