import { Op } from 'sequelize';
import User from '../models/User';
import AdminLog from '../models/AdminLog';
import PlatformStatistics from '../models/PlatformStatistics';
import ContentModeration from '../models/ContentModeration';
import SystemAlert from '../models/SystemAlert';
import Payment from '../models/Payment';
import Subscription from '../models/Subscription';
import Tournament from '../models/Tournament';
import PlayerFinderMatch from '../models/PlayerFinderMatch';
import PlayerFinderRequest from '../models/PlayerFinderRequest';
import sequelize from '../config/database';
import NotificationService from './notificationService';

interface AdminDashboardOverview {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalTournaments: number;
    totalRevenue: number;
    pendingModerations: number;
    systemAlerts: number;
    systemUptime: number;
  };
  growthMetrics: GrowthMetrics;
  topContent: TopContent[];
  recentActivity: AdminLog[];
  alerts: SystemAlert[];
}

interface GrowthMetrics {
  userGrowth: number;
  tournamentGrowth: number;
  revenueGrowth: number;
  engagementGrowth: number;
}

interface TopContent {
  id: string;
  name: string;
  type: string;
  metric: string;
  value: string;
}

interface UserManagementFilters {
  role?: string;
  status?: string;
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

interface UserManagementResult {
  users: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ModerationFilters {
  status?: string;
  contentType?: string;
  severity?: string;
  page?: number;
  limit?: number;
}

interface ModerationQueueResult {
  moderations: ContentModeration[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary: {
    pending: number;
    flagged: number;
    escalated: number;
  };
}

interface ModerationAction {
  status: 'approved' | 'rejected' | 'flagged' | 'escalated';
  reason?: string;
  actionTaken?: 'none' | 'warning' | 'content_removed' | 'account_suspended' | 'account_banned';
  notes?: string;
  notifyUser?: boolean;
  userMessage?: string;
  targetUserId?: number;
  suspensionDuration?: number;
}

interface AlertFilters {
  status?: string;
  type?: string;
  severity?: string;
  page?: number;
  limit?: number;
}

interface AlertResult {
  alerts: SystemAlert[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary: {
    open: number;
    critical: number;
    acknowledged: number;
  };
}

interface BroadcastAnnouncement {
  title: string;
  message: string;
  targetAudience: {
    roles?: string[];
    states?: string[];
    userIds?: number[];
    subscriptionStatus?: string[];
  };
  channels: {
    inApp: boolean;
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  scheduledFor?: Date;
}

interface FinancialOverview {
  totalRevenue: number;
  subscriptionRevenue: number;
  tournamentRevenue: number;
  courtBookingRevenue: number;
  totalTransactions: number;
  revenueByDate: { date: string; revenue: number }[];
  topPayingUsers: { userId: number; username: string; totalPaid: number }[];
  subscriptionMetrics: {
    activeSubscriptions: number;
    newSubscriptions: number;
    cancelledSubscriptions: number;
    churnRate: number;
  };
}

class AdminDashboardService {
  async getDashboardOverview(adminId: number): Promise<AdminDashboardOverview> {
    // Verify admin permissions
    const admin = await User.findByPk(adminId);
    if (!admin || admin.role !== 'federation') {
      throw new Error('Insufficient permissions for admin dashboard');
    }

    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get latest platform statistics
    const latestStats = await PlatformStatistics.findOne({
      order: [['date', 'DESC']]
    });

    // Get pending items
    const [pendingModerations, systemAlerts, recentLogs] = await Promise.all([
      ContentModeration.count({ where: { status: 'pending' } }),
      SystemAlert.count({ where: { status: 'open' } }),
      AdminLog.findAll({
        where: { createdAt: { [Op.gte]: lastWeek } },
        order: [['createdAt', 'DESC']],
        limit: 10,
        include: [{ model: User, as: 'admin', attributes: ['username'] }]
      })
    ]);

    // Calculate growth metrics
    const growthMetrics = await this.calculateGrowthMetrics();

    // Get top-performing content
    const topContent = await this.getTopPerformingContent();

    return {
      overview: {
        totalUsers: latestStats?.totalUsers || 0,
        activeUsers: latestStats?.activeUsers || 0,
        totalTournaments: latestStats?.totalTournaments || 0,
        totalRevenue: latestStats?.totalRevenue || 0,
        pendingModerations,
        systemAlerts,
        systemUptime: latestStats?.systemUptime || 100
      },
      growthMetrics,
      topContent,
      recentActivity: recentLogs,
      alerts: await this.getCriticalAlerts()
    };
  }

  async getUserManagement(filters: UserManagementFilters): Promise<UserManagementResult> {
    const { role, status, searchTerm, page = 1, limit = 50, sortBy = 'createdAt', sortOrder = 'DESC' } = filters;

    let whereClause: any = {};
    
    if (role && role !== 'all') whereClause.role = role;
    if (status && status !== 'all') whereClause.isActive = status === 'active';
    if (searchTerm) {
      whereClause[Op.or] = [
        { username: { [Op.iLike]: `%${searchTerm}%` } },
        { email: { [Op.iLike]: `%${searchTerm}%` } }
      ];
    }

    const users = await User.findAndCountAll({
      where: whereClause,
      attributes: [
        'id', 'username', 'email', 'role', 'isActive', 'lastLogin', 'createdAt',
        'emailVerified'
      ],
      include: [
        {
          model: Subscription,
          attributes: ['status', 'currentPeriodEnd'],
          required: false
        }
      ],
      limit,
      offset: (page - 1) * limit,
      order: [[sortBy, sortOrder]]
    });

    // Get user activity statistics
    const userStats = await this.getUserActivityStatistics(users.rows.map(u => u.id));

    return {
      users: users.rows.map(user => ({
        ...user.toJSON(),
        activityStats: userStats[user.id] || {
          tournamentsPlayed: 0,
          courtsBooked: 0,
          messagesExchanged: 0,
          lastActivity: null
        }
      })),
      pagination: {
        page,
        limit,
        total: users.count,
        totalPages: Math.ceil(users.count / limit)
      }
    };
  }

  async getContentModerationQueue(filters: ModerationFilters): Promise<ModerationQueueResult> {
    const { status, contentType, severity, page = 1, limit = 25 } = filters;

    let whereClause: any = {};
    
    if (status && status !== 'all') whereClause.status = status;
    if (contentType && contentType !== 'all') whereClause.contentType = contentType;
    if (severity && severity !== 'all') whereClause.severity = severity;

    const moderations = await ContentModeration.findAndCountAll({
      where: whereClause,
      include: [
        { model: User, as: 'reporter', attributes: ['id', 'username'] },
        { model: User, as: 'moderator', attributes: ['id', 'username'] }
      ],
      limit,
      offset: (page - 1) * limit,
      order: [
        ['severity', 'DESC'],
        ['createdAt', 'DESC']
      ]
    });

    return {
      moderations: moderations.rows,
      pagination: {
        page,
        limit,
        total: moderations.count,
        totalPages: Math.ceil(moderations.count / limit)
      },
      summary: {
        pending: await ContentModeration.count({ where: { status: 'pending' } }),
        flagged: await ContentModeration.count({ where: { status: 'flagged' } }),
        escalated: await ContentModeration.count({ where: { status: 'escalated' } })
      }
    };
  }

  async moderateContent(moderationId: number, action: ModerationAction, moderatorId: number): Promise<ContentModeration> {
    const moderation = await ContentModeration.findByPk(moderationId);
    if (!moderation) {
      throw new Error('Moderation record not found');
    }

    // Update moderation record
    await moderation.update({
      status: action.status,
      moderatorId,
      moderatedAt: new Date(),
      moderationReason: action.reason,
      actionTaken: action.actionTaken,
      notes: action.notes
    });

    // Take action based on decision
    if (action.actionTaken === 'content_removed') {
      await this.removeContent(moderation.contentType, moderation.contentId);
    } else if (action.actionTaken === 'account_suspended') {
      await this.suspendUser(action.targetUserId!, action.suspensionDuration || 7);
    } else if (action.actionTaken === 'account_banned') {
      await this.banUser(action.targetUserId!);
    }

    // Log admin action
    await this.logAdminAction(moderatorId, {
      action: 'content_moderation',
      category: 'content_moderation',
      description: `Moderated ${moderation.contentType} content - ${action.actionTaken}`,
      targetId: parseInt(moderation.contentId),
      targetType: moderation.contentType,
      severity: moderation.severity === 'critical' ? 'high' : 'medium',
      ipAddress: '127.0.0.1',
      userAgent: 'Admin Dashboard'
    });

    // Send notification to content owner if applicable
    if (action.notifyUser && action.targetUserId) {
      await NotificationService.createNotification(action.targetUserId, {
        type: 'system',
        category: action.actionTaken === 'warning' ? 'warning' : 'error',
        title: 'Content Moderation Action',
        message: action.userMessage || 'Your content has been reviewed by our moderation team.',
        channels: { inApp: true, email: true, sms: false, push: true }
      });
    }

    return moderation;
  }

  async getSystemAlerts(filters: AlertFilters): Promise<AlertResult> {
    const { status, type, severity, page = 1, limit = 25 } = filters;

    let whereClause: any = {};
    
    if (status && status !== 'all') whereClause.status = status;
    if (type && type !== 'all') whereClause.type = type;
    if (severity && severity !== 'all') whereClause.severity = severity;

    const alerts = await SystemAlert.findAndCountAll({
      where: whereClause,
      include: [
        { model: User, as: 'acknowledgedByUser', attributes: ['id', 'username'] },
        { model: User, as: 'resolvedByUser', attributes: ['id', 'username'] }
      ],
      limit,
      offset: (page - 1) * limit,
      order: [
        ['severity', 'DESC'],
        ['createdAt', 'DESC']
      ]
    });

    return {
      alerts: alerts.rows,
      pagination: {
        page,
        limit,
        total: alerts.count,
        totalPages: Math.ceil(alerts.count / limit)
      },
      summary: {
        open: await SystemAlert.count({ where: { status: 'open' } }),
        critical: await SystemAlert.count({ where: { severity: 'critical', status: 'open' } }),
        acknowledged: await SystemAlert.count({ where: { status: 'acknowledged' } })
      }
    };
  }

  async broadcastAnnouncement(announcement: BroadcastAnnouncement, senderId: number): Promise<void> {
    const { title, message, targetAudience, channels, scheduledFor } = announcement;

    // Determine target users
    const targetUsers = await this.getTargetUsers(targetAudience);

    // Create notifications for all target users
    const notificationPromises = targetUsers.map(userId =>
      NotificationService.createNotification(userId, {
        type: 'system',
        category: 'info',
        title,
        message,
        channels,
        scheduledFor
      })
    );

    await Promise.all(notificationPromises);

    // Log admin action
    await this.logAdminAction(senderId, {
      action: 'broadcast_announcement',
      category: 'communication',
      description: `Broadcast announcement to ${targetUsers.length} users`,
      severity: 'medium',
      ipAddress: '127.0.0.1',
      userAgent: 'Admin Dashboard'
    });
  }

  async getFinancialOverview(dateRange: { startDate: Date; endDate: Date }): Promise<FinancialOverview> {
    const { startDate, endDate } = dateRange;

    // Get subscription revenue
    const subscriptionPayments = await Payment.findAll({
      where: {
        type: 'subscription',
        status: 'succeeded',
        createdAt: { [Op.between]: [startDate, endDate] }
      },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        'currency'
      ],
      group: ['currency']
    });

    // Get tournament entry revenue
    const tournamentPayments = await Payment.findAll({
      where: {
        type: 'tournament_entry',
        status: 'succeeded',
        createdAt: { [Op.between]: [startDate, endDate] }
      },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        'currency'
      ],
      group: ['currency']
    });

    // Get court booking revenue
    const bookingPayments = await Payment.findAll({
      where: {
        type: 'court_booking',
        status: 'succeeded',
        createdAt: { [Op.between]: [startDate, endDate] }
      },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        'currency'
      ],
      group: ['currency']
    });

    // Calculate totals
    const totalRevenue = [
      ...subscriptionPayments,
      ...tournamentPayments,
      ...bookingPayments
    ].reduce((sum, payment) => sum + (payment.getDataValue('totalAmount') || 0), 0);

    return {
      totalRevenue,
      subscriptionRevenue: subscriptionPayments.reduce((sum, p) => sum + (p.getDataValue('totalAmount') || 0), 0),
      tournamentRevenue: tournamentPayments.reduce((sum, p) => sum + (p.getDataValue('totalAmount') || 0), 0),
      courtBookingRevenue: bookingPayments.reduce((sum, p) => sum + (p.getDataValue('totalAmount') || 0), 0),
      totalTransactions: [
        ...subscriptionPayments,
        ...tournamentPayments,
        ...bookingPayments
      ].reduce((sum, payment) => sum + (payment.getDataValue('count') || 0), 0),
      revenueByDate: await this.getRevenueByDate(startDate, endDate),
      topPayingUsers: await this.getTopPayingUsers(startDate, endDate),
      subscriptionMetrics: await this.getSubscriptionMetrics(startDate, endDate)
    };
  }

  async logAdminAction(adminId: number, actionData: any): Promise<AdminLog> {
    return await AdminLog.create({
      adminId,
      ...actionData,
      ipAddress: actionData.ipAddress || '127.0.0.1',
      userAgent: actionData.userAgent || 'Admin Dashboard',
      status: 'success'
    });
  }

  async updateUserStatus(adminId: number, userId: number, status: string, reason: string): Promise<any> {
    // Implementation would update user status
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    await user.update({ isActive: status === 'active' });
    return { success: true, message: 'User status updated' };
  }

  async updateSystemAlert(adminId: number, alertId: number, status: string, notes: string): Promise<any> {
    const alert = await SystemAlert.findByPk(alertId);
    if (!alert) {
      throw new Error('Alert not found');
    }
    
    await alert.update({ 
      status, 
      notes,
      acknowledgedBy: adminId,
      acknowledgedAt: new Date()
    });
    
    return { success: true, message: 'Alert updated' };
  }

  async getAdminLogs(filters: any): Promise<any> {
    const { page = 1, limit = 25 } = filters;
    
    const logs = await AdminLog.findAndCountAll({
      include: [{ model: User, as: 'admin', attributes: ['username'] }],
      limit,
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']]
    });
    
    return {
      logs: logs.rows,
      pagination: {
        page,
        limit,
        total: logs.count,
        totalPages: Math.ceil(logs.count / limit)
      }
    };
  }

  async generateReport(reportType: string, filters: any): Promise<any> {
    // Placeholder implementation
    return {
      reportType,
      generatedAt: new Date(),
      data: [],
      message: 'Report generation not yet implemented'
    };
  }

  async getPlatformStatistics(dateRange: any): Promise<any> {
    const stats = await PlatformStatistics.findOne({
      order: [['date', 'DESC']]
    });
    
    return stats || {
      totalUsers: 0,
      activeUsers: 0,
      totalRevenue: 0,
      systemUptime: 100
    };
  }

  private async calculateGrowthMetrics(): Promise<GrowthMetrics> {
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);

    const [thisWeekUsers, lastWeekUsers, thisWeekTournaments, lastWeekTournaments] = await Promise.all([
      User.count({ where: { createdAt: { [Op.gte]: lastWeek } } }),
      User.count({ where: { createdAt: { [Op.between]: [twoWeeksAgo, lastWeek] } } }),
      Tournament.count({ where: { createdAt: { [Op.gte]: lastWeek } } }),
      Tournament.count({ where: { createdAt: { [Op.between]: [twoWeeksAgo, lastWeek] } } })
    ]);

    const userGrowth = lastWeekUsers > 0 ? ((thisWeekUsers - lastWeekUsers) / lastWeekUsers) * 100 : 0;
    const tournamentGrowth = lastWeekTournaments > 0 ? ((thisWeekTournaments - lastWeekTournaments) / lastWeekTournaments) * 100 : 0;

    // Get revenue growth
    const thisWeekRevenue = await Payment.sum('amount', {
      where: {
        status: 'succeeded',
        createdAt: { [Op.gte]: lastWeek }
      }
    }) || 0;

    const lastWeekRevenue = await Payment.sum('amount', {
      where: {
        status: 'succeeded',
        createdAt: { [Op.between]: [twoWeeksAgo, lastWeek] }
      }
    }) || 0;

    const revenueGrowth = lastWeekRevenue > 0 ? ((thisWeekRevenue - lastWeekRevenue) / lastWeekRevenue) * 100 : 0;

    // Calculate engagement growth (based on active users)
    const thisWeekActiveUsers = await User.count({
      where: {
        lastLogin: { [Op.gte]: lastWeek }
      }
    });

    const lastWeekActiveUsers = await User.count({
      where: {
        lastLogin: { [Op.between]: [twoWeeksAgo, lastWeek] }
      }
    });

    const engagementGrowth = lastWeekActiveUsers > 0 ? ((thisWeekActiveUsers - lastWeekActiveUsers) / lastWeekActiveUsers) * 100 : 0;

    return {
      userGrowth,
      tournamentGrowth,
      revenueGrowth,
      engagementGrowth
    };
  }

  private async getTopPerformingContent(): Promise<TopContent[]> {
    // Get top tournaments by registrations
    const topTournaments = await Tournament.findAll({
      attributes: [
        'id',
        'name',
        [sequelize.fn('COUNT', sequelize.col('registrations.id')), 'registrationCount']
      ],
      include: [
        {
          model: User,
          as: 'registrations',
          attributes: [],
          through: { attributes: [] }
        }
      ],
      group: ['Tournament.id', 'Tournament.name'],
      order: [[sequelize.fn('COUNT', sequelize.col('registrations.id')), 'DESC']],
      limit: 5
    });

    return topTournaments.map(tournament => ({
      id: tournament.id.toString(),
      name: tournament.name,
      type: 'Tournament',
      metric: 'Registrations',
      value: tournament.getDataValue('registrationCount')?.toString() || '0'
    }));
  }

  private async getCriticalAlerts(): Promise<SystemAlert[]> {
    return await SystemAlert.findAll({
      where: {
        severity: 'critical',
        status: 'open'
      },
      order: [['createdAt', 'DESC']],
      limit: 5
    });
  }

  private async getTargetUsers(targetAudience: BroadcastAnnouncement['targetAudience']): Promise<number[]> {
    let whereClause: any = {};

    if (targetAudience.roles && targetAudience.roles.length > 0) {
      whereClause.role = { [Op.in]: targetAudience.roles };
    }

    if (targetAudience.userIds && targetAudience.userIds.length > 0) {
      whereClause.id = { [Op.in]: targetAudience.userIds };
    }

    // Add subscription status filter if specified
    if (targetAudience.subscriptionStatus && targetAudience.subscriptionStatus.length > 0) {
      whereClause['$subscription.status$'] = { [Op.in]: targetAudience.subscriptionStatus };
    }

    const users = await User.findAll({
      where: whereClause,
      attributes: ['id'],
      include: targetAudience.subscriptionStatus ? [
        {
          model: Subscription,
          attributes: [],
          required: true
        }
      ] : []
    });

    return users.map(user => user.id);
  }

  private async getUserActivityStatistics(userIds: number[]): Promise<Record<number, any>> {
    // This would typically involve complex queries across multiple tables
    // For now, returning empty stats to maintain interface compatibility
    const stats: Record<number, any> = {};
    
    userIds.forEach(userId => {
      stats[userId] = {
        tournamentsPlayed: 0,
        courtsBooked: 0,
        messagesExchanged: 0,
        lastActivity: null
      };
    });

    return stats;
  }

  private async removeContent(contentType: string, contentId: string): Promise<void> {
    // Implementation would depend on content type
    // This is a placeholder for the actual content removal logic
    console.log(`Removing ${contentType} content with ID: ${contentId}`);
  }

  private async suspendUser(userId: number, duration: number): Promise<void> {
    const user = await User.findByPk(userId);
    if (user) {
      await user.update({
        isActive: false
        // In a real implementation, you'd also set a suspension end date
      });
    }
  }

  private async banUser(userId: number): Promise<void> {
    const user = await User.findByPk(userId);
    if (user) {
      await user.update({
        isActive: false
        // In a real implementation, you'd also mark the account as permanently banned
      });
    }
  }

  private async getRevenueByDate(startDate: Date, endDate: Date): Promise<{ date: string; revenue: number }[]> {
    const revenueByDate = await Payment.findAll({
      where: {
        status: 'succeeded',
        createdAt: { [Op.between]: [startDate, endDate] }
      },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'revenue']
      ],
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']]
    });

    return revenueByDate.map(item => ({
      date: item.getDataValue('date'),
      revenue: item.getDataValue('revenue') || 0
    }));
  }

  private async getTopPayingUsers(startDate: Date, endDate: Date): Promise<{ userId: number; username: string; totalPaid: number }[]> {
    const topUsers = await Payment.findAll({
      where: {
        status: 'succeeded',
        createdAt: { [Op.between]: [startDate, endDate] }
      },
      attributes: [
        'userId',
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalPaid']
      ],
      include: [
        {
          model: User,
          attributes: ['username']
        }
      ],
      group: ['Payment.userId', 'user.id', 'user.username'],
      order: [[sequelize.fn('SUM', sequelize.col('amount')), 'DESC']],
      limit: 10
    });

    return topUsers.map(item => ({
      userId: item.userId,
      username: item.user?.username || 'Unknown',
      totalPaid: item.getDataValue('totalPaid') || 0
    }));
  }

  private async getSubscriptionMetrics(startDate: Date, endDate: Date): Promise<FinancialOverview['subscriptionMetrics']> {
    const [activeSubscriptions, newSubscriptions, cancelledSubscriptions] = await Promise.all([
      Subscription.count({ where: { status: 'active' } }),
      Subscription.count({
        where: {
          status: 'active',
          createdAt: { [Op.between]: [startDate, endDate] }
        }
      }),
      Subscription.count({
        where: {
          status: 'cancelled',
          updatedAt: { [Op.between]: [startDate, endDate] }
        }
      })
    ]);

    const churnRate = activeSubscriptions > 0 ? (cancelledSubscriptions / activeSubscriptions) * 100 : 0;

    return {
      activeSubscriptions,
      newSubscriptions,
      cancelledSubscriptions,
      churnRate
    };
  }
}

export default new AdminDashboardService();