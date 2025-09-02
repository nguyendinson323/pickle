import Notification from '../models/Notification';
import NotificationPreferences from '../models/NotificationPreferences';
import NotificationTemplate from '../models/NotificationTemplate';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

interface NotificationData {
  userId: string;
  type: 'system' | 'tournament' | 'booking' | 'message' | 'match' | 'payment' | 'maintenance';
  category: 'info' | 'success' | 'warning' | 'error' | 'urgent';
  templateType?: string;
  data?: Record<string, any>;
  title?: string;
  message?: string;
  actionText?: string;
  actionUrl?: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  scheduledFor?: Date;
  expiresAt?: Date;
  channels?: {
    inApp?: boolean;
    email?: boolean;
    sms?: boolean;
    push?: boolean;
  };
}

interface NotificationFilters {
  userId?: string;
  type?: string;
  category?: string;
  isRead?: boolean;
  fromDate?: Date;
  toDate?: Date;
}

interface PaginationOptions {
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
}

class NotificationService {
  
  async sendNotification(data: NotificationData): Promise<Notification> {
    try {
      // Get user's notification preferences
      const preferences = await this.getUserPreferences(data.userId);
      
      // Get template if specified
      let notificationContent;
      if (data.templateType) {
        notificationContent = await this.renderTemplate(data.templateType, data.data || {});
      } else {
        notificationContent = {
          title: data.title!,
          message: data.message!,
          actionText: data.actionText
        };
      }

      // Determine channels based on preferences and template type
      const channels = await this.determineChannels(
        data.type,
        data.templateType || 'default',
        preferences,
        data.channels
      );

      // Check quiet hours
      const shouldDelayForQuietHours = await this.isInQuietHours(preferences);
      const scheduledFor = shouldDelayForQuietHours && !data.scheduledFor
        ? this.getNextActiveTime(preferences)
        : data.scheduledFor;

      // Create notification
      const notification = await Notification.create({
        id: uuidv4(),
        userId: data.userId,
        type: data.type,
        category: data.category,
        title: notificationContent.title,
        message: notificationContent.message,
        actionText: notificationContent.actionText,
        actionUrl: data.actionUrl,
        relatedEntityType: data.relatedEntityType,
        relatedEntityId: data.relatedEntityId,
        isRead: false,
        channels,
        deliveryStatus: {
          inApp: { delivered: false },
          email: { delivered: false },
          sms: { delivered: false },
          push: { delivered: false }
        },
        scheduledFor,
        isScheduled: !!scheduledFor,
        expiresAt: data.expiresAt
      });

      // Deliver notification if not scheduled
      if (!scheduledFor) {
        await this.deliverNotification(notification);
      }

      return notification;
    } catch (error: any) {
      throw new Error(`Failed to send notification: ${error.message}`);
    }
  }

  async getNotifications(
    userId: string,
    filters: NotificationFilters = {},
    options: PaginationOptions = {}
  ): Promise<{
    notifications: Notification[];
    total: number;
    unreadCount: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const {
        page = 1,
        limit = 20,
        orderBy = 'createdAt',
        orderDirection = 'DESC'
      } = options;

      const whereClause: any = { userId };

      if (filters.type) {
        whereClause.type = filters.type;
      }

      if (filters.category) {
        whereClause.category = filters.category;
      }

      if (filters.isRead !== undefined) {
        whereClause.isRead = filters.isRead;
      }

      if (filters.fromDate && filters.toDate) {
        whereClause.createdAt = {
          [Op.between]: [filters.fromDate, filters.toDate]
        };
      } else if (filters.fromDate) {
        whereClause.createdAt = {
          [Op.gte]: filters.fromDate
        };
      } else if (filters.toDate) {
        whereClause.createdAt = {
          [Op.lte]: filters.toDate
        };
      }

      // Exclude expired notifications
      whereClause[Op.or] = [
        { expiresAt: null },
        { expiresAt: { [Op.gt]: new Date() } }
      ];

      const offset = (page - 1) * limit;

      const { count, rows } = await Notification.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        order: [[orderBy, orderDirection]]
      });

      // Get unread count
      const unreadCount = await Notification.count({
        where: {
          userId,
          isRead: false,
          [Op.or]: [
            { expiresAt: null },
            { expiresAt: { [Op.gt]: new Date() } }
          ]
        }
      });

      return {
        notifications: rows,
        total: count,
        unreadCount,
        page,
        totalPages: Math.ceil(count / limit)
      };
    } catch (error: any) {
      throw new Error(`Failed to fetch notifications: ${error.message}`);
    }
  }

  async markAsRead(notificationId: string, userId: string): Promise<void> {
    try {
      const notification = await Notification.findOne({
        where: { id: notificationId, userId }
      });

      if (!notification) {
        throw new Error('Notification not found');
      }

      if (!notification.isRead) {
        await notification.update({
          isRead: true,
          readAt: new Date()
        });
      }
    } catch (error: any) {
      throw new Error(`Failed to mark notification as read: ${error.message}`);
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    try {
      await Notification.update(
        {
          isRead: true,
          readAt: new Date()
        },
        {
          where: {
            userId,
            isRead: false
          }
        }
      );
    } catch (error: any) {
      throw new Error(`Failed to mark all notifications as read: ${error.message}`);
    }
  }

  async deleteNotification(notificationId: string, userId: string): Promise<void> {
    try {
      const deletedCount = await Notification.destroy({
        where: { id: notificationId, userId }
      });

      if (deletedCount === 0) {
        throw new Error('Notification not found');
      }
    } catch (error: any) {
      throw new Error(`Failed to delete notification: ${error.message}`);
    }
  }

  async processScheduledNotifications(): Promise<void> {
    try {
      const now = new Date();
      
      const scheduledNotifications = await Notification.findAll({
        where: {
          isScheduled: true,
          scheduledFor: { [Op.lte]: now }
        }
      });

      for (const notification of scheduledNotifications) {
        await this.deliverNotification(notification);
        await notification.update({ isScheduled: false });
      }
    } catch (error: any) {
      console.error('Failed to process scheduled notifications:', error);
    }
  }

  async cleanupExpiredNotifications(): Promise<number> {
    try {
      const deletedCount = await Notification.destroy({
        where: {
          expiresAt: { [Op.lt]: new Date() }
        }
      });

      return deletedCount;
    } catch (error: any) {
      console.error('Failed to cleanup expired notifications:', error);
      return 0;
    }
  }

  async updateUserPreferences(
    userId: string,
    preferences: Partial<NotificationPreferences>
  ): Promise<NotificationPreferences> {
    try {
      const [userPrefs, created] = await NotificationPreferences.findOrCreate({
        where: { userId },
        defaults: {
          userId,
          globalEnabled: true,
          quietHoursEnabled: false,
          quietHoursStart: '22:00',
          quietHoursEnd: '08:00',
          preferences: {} // Will use default from model
        }
      });

      await userPrefs.update(preferences);
      return userPrefs;
    } catch (error: any) {
      throw new Error(`Failed to update notification preferences: ${error.message}`);
    }
  }

  async getUserPreferences(userId: string): Promise<NotificationPreferences> {
    try {
      const [preferences] = await NotificationPreferences.findOrCreate({
        where: { userId },
        defaults: {
          userId,
          globalEnabled: true,
          quietHoursEnabled: false,
          quietHoursStart: '22:00',
          quietHoursEnd: '08:00',
          preferences: {} // Will use default from model
        }
      });

      return preferences;
    } catch (error: any) {
      throw new Error(`Failed to get notification preferences: ${error.message}`);
    }
  }

  private async renderTemplate(templateType: string, data: Record<string, any>): Promise<{
    title: string;
    message: string;
    actionText?: string;
  }> {
    try {
      // Find template by type
      const template = await NotificationTemplate.findOne({
        where: {
          type: templateType,
          isActive: true
        },
        order: [['version', 'DESC']]
      });

      if (!template) {
        throw new Error(`Template not found: ${templateType}`);
      }

      // Replace variables in template
      const inAppTemplate = template.templates.inApp;
      
      let title = inAppTemplate.title;
      let message = inAppTemplate.message;

      // Replace template variables
      for (const variable of template.variables) {
        const placeholder = `{{${variable.name}}}`;
        const value = data[variable.name] || (variable.required ? 'N/A' : '');
        
        title = title.replace(new RegExp(placeholder, 'g'), String(value));
        message = message.replace(new RegExp(placeholder, 'g'), String(value));
      }

      return {
        title,
        message,
        actionText: inAppTemplate.actionText
      };
    } catch (error: any) {
      // Fallback to basic template
      return {
        title: data.title || 'New Notification',
        message: data.message || 'You have a new notification'
      };
    }
  }

  private async determineChannels(
    notificationType: string,
    templateType: string,
    preferences: NotificationPreferences,
    overrides?: Record<string, boolean>
  ): Promise<{ inApp: boolean; email: boolean; sms: boolean; push: boolean }> {
    // Default channels
    let channels = {
      inApp: true,
      email: false,
      sms: false,
      push: false
    };

    // Check if notifications are globally enabled
    if (!preferences.globalEnabled) {
      return { inApp: false, email: false, sms: false, push: false };
    }

    // Apply user preferences based on notification type
    const categoryMap: Record<string, keyof typeof preferences.preferences> = {
      tournament: 'tournaments',
      booking: 'bookings',
      match: 'matches',
      message: 'messages',
      system: 'system'
    };

    const category = categoryMap[notificationType];
    if (category && preferences.preferences[category]) {
      const categoryPrefs = preferences.preferences[category] as any;
      if (categoryPrefs[templateType]) {
        channels = { ...categoryPrefs[templateType] };
      }
    }

    // Apply overrides
    if (overrides) {
      channels = { ...channels, ...overrides };
    }

    return channels;
  }

  private async isInQuietHours(preferences: NotificationPreferences): Promise<boolean> {
    if (!preferences.quietHoursEnabled) {
      return false;
    }

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMin] = preferences.quietHoursStart.split(':').map(Number);
    const [endHour, endMin] = preferences.quietHoursEnd.split(':').map(Number);
    
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    if (startTime < endTime) {
      // Same day quiet hours (e.g., 22:00 to 23:00)
      return currentTime >= startTime && currentTime < endTime;
    } else {
      // Overnight quiet hours (e.g., 22:00 to 08:00)
      return currentTime >= startTime || currentTime < endTime;
    }
  }

  private getNextActiveTime(preferences: NotificationPreferences): Date {
    const now = new Date();
    const [endHour, endMin] = preferences.quietHoursEnd.split(':').map(Number);
    
    const nextActiveTime = new Date(now);
    nextActiveTime.setHours(endHour, endMin, 0, 0);
    
    // If end time is tomorrow
    if (nextActiveTime <= now) {
      nextActiveTime.setDate(nextActiveTime.getDate() + 1);
    }
    
    return nextActiveTime;
  }

  private async deliverNotification(notification: Notification): Promise<void> {
    try {
      const deliveryPromises = [];

      // In-app notification (always delivered immediately)
      if (notification.channels.inApp) {
        deliveryPromises.push(this.deliverInApp(notification));
      }

      // Email notification
      if (notification.channels.email) {
        deliveryPromises.push(this.deliverEmail(notification));
      }

      // SMS notification
      if (notification.channels.sms) {
        deliveryPromises.push(this.deliverSMS(notification));
      }

      // Push notification
      if (notification.channels.push) {
        deliveryPromises.push(this.deliverPush(notification));
      }

      await Promise.allSettled(deliveryPromises);
    } catch (error: any) {
      console.error('Failed to deliver notification:', error);
    }
  }

  private async deliverInApp(notification: Notification): Promise<void> {
    try {
      // In-app notifications are already stored in database
      // Update delivery status
      const updatedDeliveryStatus = {
        ...notification.deliveryStatus,
        inApp: { delivered: true, deliveredAt: new Date() }
      };

      await notification.update({ deliveryStatus: updatedDeliveryStatus });
    } catch (error: any) {
      console.error('Failed to deliver in-app notification:', error);
    }
  }

  private async deliverEmail(notification: Notification): Promise<void> {
    try {
      // TODO: Implement email delivery (SendGrid, AWS SES, etc.)
      console.log(`Sending email notification to user ${notification.userId}: ${notification.title}`);
      
      // Simulate email delivery
      const delivered = true; // Replace with actual email service result
      
      const updatedDeliveryStatus = {
        ...notification.deliveryStatus,
        email: { 
          delivered,
          deliveredAt: delivered ? new Date() : undefined,
          error: delivered ? undefined : 'Email service unavailable'
        }
      };

      await notification.update({ deliveryStatus: updatedDeliveryStatus });
    } catch (error: any) {
      const updatedDeliveryStatus = {
        ...notification.deliveryStatus,
        email: { 
          delivered: false,
          error: error.message
        }
      };
      await notification.update({ deliveryStatus: updatedDeliveryStatus });
    }
  }

  private async deliverSMS(notification: Notification): Promise<void> {
    try {
      // TODO: Implement SMS delivery (Twilio, AWS SNS, etc.)
      console.log(`Sending SMS notification to user ${notification.userId}: ${notification.title}`);
      
      // Simulate SMS delivery
      const delivered = true; // Replace with actual SMS service result
      
      const updatedDeliveryStatus = {
        ...notification.deliveryStatus,
        sms: { 
          delivered,
          deliveredAt: delivered ? new Date() : undefined,
          error: delivered ? undefined : 'SMS service unavailable'
        }
      };

      await notification.update({ deliveryStatus: updatedDeliveryStatus });
    } catch (error: any) {
      const updatedDeliveryStatus = {
        ...notification.deliveryStatus,
        sms: { 
          delivered: false,
          error: error.message
        }
      };
      await notification.update({ deliveryStatus: updatedDeliveryStatus });
    }
  }

  private async deliverPush(notification: Notification): Promise<void> {
    try {
      // TODO: Implement push notification delivery (FCM, APNs, etc.)
      console.log(`Sending push notification to user ${notification.userId}: ${notification.title}`);
      
      // Simulate push delivery
      const delivered = true; // Replace with actual push service result
      
      const updatedDeliveryStatus = {
        ...notification.deliveryStatus,
        push: { 
          delivered,
          deliveredAt: delivered ? new Date() : undefined,
          error: delivered ? undefined : 'Push service unavailable'
        }
      };

      await notification.update({ deliveryStatus: updatedDeliveryStatus });
    } catch (error: any) {
      const updatedDeliveryStatus = {
        ...notification.deliveryStatus,
        push: { 
          delivered: false,
          error: error.message
        }
      };
      await notification.update({ deliveryStatus: updatedDeliveryStatus });
    }
  }
}

export default NotificationService;