# 10. Admin Dashboard Improvements - Complete Implementation Guide

## Problem Analysis
The current project lacks a comprehensive administrative dashboard system for admin administrators to manage the entire Mexican Pickleball Federation platform effectively. This includes user management, content moderation, analytics, system monitoring, and admin-wide governance tools.

## Core Requirements
1. **User Management**: Comprehensive user administration and role management
2. **Content Moderation**: Review and moderate user-generated content
3. **Analytics Dashboard**: Platform-wide metrics and insights
4. **Tournament Oversight**: Monitor and manage all tournaments
5. **Financial Management**: Revenue tracking and subscription management
6. **System Monitoring**: Platform health and performance metrics
7. **Communication Tools**: Broadcast messaging and announcements
8. **Audit Logging**: Track administrative actions and system changes
9. **Report Generation**: Automated and custom report creation
10. **Federation Governance**: State committee and club management

## Step-by-Step Implementation Plan

### Phase 1: Enhanced Admin Models

#### 1.1 Create Admin Log Model (`backend/src/models/AdminLog.ts`)
```typescript
interface AdminLog extends Model {
  id: string;
  adminId: string;
  action: string;
  category: 'user_management' | 'content_moderation' | 'system_config' | 'financial' | 'tournament' | 'communication';
  
  // Action details
  description: string;
  targetId?: string; // ID of affected entity
  targetType?: string; // Type of affected entity
  
  // Before/after data
  previousData?: Record<string, any>;
  newData?: Record<string, any>;
  
  // Context
  ipAddress: string;
  userAgent: string;
  sessionId?: string;
  
  // Impact assessment
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedUsers?: number;
  
  // Status
  status: 'success' | 'failed' | 'partial';
  errorMessage?: string;
  
  createdAt: Date;
}

AdminLog.belongsTo(User, { as: 'admin' });
```

#### 1.2 Create Platform Statistics Model (`backend/src/models/PlatformStatistics.ts`)
```typescript
interface PlatformStatistics extends Model {
  id: string;
  date: Date; // Daily aggregated statistics
  
  // User statistics
  totalUsers: number;
  newUsers: number;
  activeUsers: number; // Users active in last 30 days
  usersByRole: {
    player: number;
    coach: number;
    club: number;
    partner: number;
    state_committee: number;
    admin: number;
  };
  
  // Engagement metrics
  totalSessions: number;
  avgSessionDuration: number; // in minutes
  pageViews: number;
  
  // Tournament statistics
  totalTournaments: number;
  newTournaments: number;
  activeTournaments: number;
  completedTournaments: number;
  totalRegistrations: number;
  
  // Court booking statistics
  totalBookings: number;
  newBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalRevenue: number; // in cents
  
  // Player matching statistics
  totalMatches: number;
  newMatches: number;
  successfulMatches: number;
  
  // Communication statistics
  messagesExchanged: number;
  notificationsSent: number;
  
  // Subscription statistics
  activeSubscriptions: number;
  newSubscriptions: number;
  cancelledSubscriptions: number;
  subscriptionRevenue: number; // in cents
  
  // System health
  systemUptime: number; // percentage
  averageResponseTime: number; // in milliseconds
  errorRate: number; // percentage
  
  createdAt: Date;
  updatedAt: Date;
}
```

#### 1.3 Create Content Moderation Model (`backend/src/models/ContentModeration.ts`)
```typescript
interface ContentModeration extends Model {
  id: string;
  contentType: 'user_profile' | 'tournament' | 'microsite' | 'message' | 'review' | 'media';
  contentId: string;
  reportedBy?: string; // User who reported the content
  
  // Content details
  contentData: Record<string, any>;
  contentUrl?: string;
  contentPreview: string;
  
  // Moderation info
  status: 'pending' | 'approved' | 'rejected' | 'flagged' | 'escalated';
  moderatorId?: string;
  moderatedAt?: Date;
  
  // Reason and action
  reportReason?: string;
  moderationReason?: string;
  actionTaken?: 'none' | 'warning' | 'content_removed' | 'account_suspended' | 'account_banned';
  
  // Severity assessment
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string[]; // ['inappropriate_language', 'spam', 'harassment', etc.]
  
  // AI analysis (if applicable)
  aiFlags?: {
    toxicity: number;
    spam: number;
    inappropriate: number;
    confidence: number;
  };
  
  // Follow-up
  requiresFollowUp: boolean;
  followUpDate?: Date;
  notes?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

ContentModeration.belongsTo(User, { as: 'reporter' });
ContentModeration.belongsTo(User, { as: 'moderator' });
```

#### 1.4 Create System Alert Model (`backend/src/models/SystemAlert.ts`)
```typescript
interface SystemAlert extends Model {
  id: string;
  type: 'performance' | 'security' | 'error' | 'maintenance' | 'business' | 'user_behavior';
  severity: 'info' | 'warning' | 'error' | 'critical';
  
  // Alert details
  title: string;
  message: string;
  details?: Record<string, any>;
  
  // Source
  source: 'system' | 'monitoring' | 'user_report' | 'automated_check';
  sourceData?: Record<string, any>;
  
  // Thresholds (for automated alerts)
  threshold?: {
    metric: string;
    operator: 'greater_than' | 'less_than' | 'equals' | 'not_equals';
    value: number;
    actualValue?: number;
  };
  
  // Status tracking
  status: 'open' | 'acknowledged' | 'investigating' | 'resolved' | 'false_positive';
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolvedBy?: string;
  resolvedAt?: Date;
  
  // Resolution
  resolutionNotes?: string;
  actionsTaken?: string[];
  
  // Escalation
  isEscalated: boolean;
  escalatedTo?: string;
  escalatedAt?: Date;
  
  // Recurrence tracking
  isRecurring: boolean;
  relatedAlerts?: string[]; // IDs of related alerts
  
  createdAt: Date;
  updatedAt: Date;
}

SystemAlert.belongsTo(User, { as: 'acknowledgedByUser' });
SystemAlert.belongsTo(User, { as: 'resolvedByUser' });
```

### Phase 2: Admin Services

#### 2.1 Admin Dashboard Service (`backend/src/services/adminDashboardService.ts`)
```typescript
class AdminDashboardService {
  async getDashboardOverview(adminId: string): Promise<AdminDashboardOverview> {
    // Verify admin permissions
    const admin = await User.findByPk(adminId);
    if (admin.role !== 'admin') {
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
        'subscriptionStatus', 'emailVerified'
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

  async moderateContent(moderationId: string, action: ModerationAction, moderatorId: string): Promise<ContentModeration> {
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
      targetId: moderation.contentId,
      targetType: moderation.contentType,
      severity: moderation.severity === 'critical' ? 'high' : 'medium'
    });

    // Send notification to content owner if applicable
    if (action.notifyUser && action.targetUserId) {
      await notificationService.createNotification(action.targetUserId, {
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

  async generateReport(reportType: string, parameters: any): Promise<ReportResult> {
    switch (reportType) {
      case 'user_activity':
        return await this.generateUserActivityReport(parameters);
      case 'tournament_performance':
        return await this.generateTournamentReport(parameters);
      case 'financial_summary':
        return await this.generateFinancialReport(parameters);
      case 'system_health':
        return await this.generateSystemHealthReport(parameters);
      case 'moderation_summary':
        return await this.generateModerationReport(parameters);
      default:
        throw new Error('Unknown report type');
    }
  }

  async broadcastAnnouncement(announcement: BroadcastAnnouncement, senderId: string): Promise<void> {
    const { title, message, targetAudience, channels, scheduledFor } = announcement;

    // Determine target users
    const targetUsers = await this.getTargetUsers(targetAudience);

    // Create notifications for all target users
    const notificationPromises = targetUsers.map(userId =>
      notificationService.createNotification(userId, {
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
      severity: 'medium'
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

  private async logAdminAction(adminId: string, actionData: any): Promise<AdminLog> {
    return await AdminLog.create({
      adminId,
      ...actionData,
      ipAddress: actionData.ipAddress || '0.0.0.0',
      userAgent: actionData.userAgent || 'Unknown',
      status: 'success'
    });
  }

  private async calculateGrowthMetrics(): Promise<GrowthMetrics> {
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);

    const [thisWeekUsers, lastWeekUsers] = await Promise.all([
      User.count({ where: { createdAt: { [Op.gte]: lastWeek } } }),
      User.count({ where: { createdAt: { [Op.between]: [twoWeeksAgo, lastWeek] } } })
    ]);

    const userGrowth = lastWeekUsers > 0 ? ((thisWeekUsers - lastWeekUsers) / lastWeekUsers) * 100 : 0;

    // Similar calculations for other metrics...

    return {
      userGrowth,
      tournamentGrowth: 0, // Placeholder
      revenueGrowth: 0, // Placeholder
      engagementGrowth: 0 // Placeholder
    };
  }

  private async getTopPerformingContent(): Promise<TopContent[]> {
    // Implementation for getting top-performing tournaments, microsites, etc.
    return [];
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
}

export default new AdminDashboardService();
```

### Phase 3: Admin Controllers

#### 3.1 Admin Dashboard Controller (`backend/src/controllers/adminDashboardController.ts`)
```typescript
export class AdminDashboardController {
  async getDashboardOverview(req: Request, res: Response) {
    try {
      const overview = await adminDashboardService.getDashboardOverview(req.user.id);
      
      res.json({
        success: true,
        data: overview
      });
    } catch (error) {
      res.status(403).json({
        success: false,
        error: error.message
      });
    }
  }

  async getUserManagement(req: Request, res: Response) {
    try {
      const filters = {
        role: req.query.role as string,
        status: req.query.status as string,
        searchTerm: req.query.search as string,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 50,
        sortBy: req.query.sortBy as string || 'createdAt',
        sortOrder: req.query.sortOrder as 'ASC' | 'DESC' || 'DESC'
      };

      const result = await adminDashboardService.getUserManagement(filters);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async updateUserStatus(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { isActive, reason } = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      await user.update({ isActive });

      // Log admin action
      await adminDashboardService.logAdminAction(req.user.id, {
        action: isActive ? 'activate_user' : 'deactivate_user',
        category: 'user_management',
        description: `${isActive ? 'Activated' : 'Deactivated'} user ${user.username}`,
        targetId: userId,
        targetType: 'user',
        severity: 'medium',
        newData: { isActive, reason }
      });

      // Send notification to user
      await notificationService.createNotification(userId, {
        type: 'system',
        category: isActive ? 'success' : 'warning',
        title: isActive ? 'Account Activated' : 'Account Deactivated',
        message: reason || 'Your account status has been updated by an administrator.',
        channels: { inApp: true, email: true, sms: false, push: true }
      });

      res.json({
        success: true,
        message: `User ${isActive ? 'activated' : 'deactivated'} successfully`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getContentModeration(req: Request, res: Response) {
    try {
      const filters = {
        status: req.query.status as string,
        contentType: req.query.contentType as string,
        severity: req.query.severity as string,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 25
      };

      const result = await adminDashboardService.getContentModerationQueue(filters);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async moderateContent(req: Request, res: Response) {
    try {
      const { moderationId } = req.params;
      const action = req.body as ModerationAction;

      const result = await adminDashboardService.moderateContent(
        moderationId,
        action,
        req.user.id
      );

      res.json({
        success: true,
        data: result,
        message: 'Content moderation action completed successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getSystemAlerts(req: Request, res: Response) {
    try {
      const filters = {
        status: req.query.status as string,
        type: req.query.type as string,
        severity: req.query.severity as string,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 25
      };

      const result = await adminDashboardService.getSystemAlerts(filters);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async acknowledgeAlert(req: Request, res: Response) {
    try {
      const { alertId } = req.params;
      
      const alert = await SystemAlert.findByPk(alertId);
      if (!alert) {
        return res.status(404).json({
          success: false,
          error: 'Alert not found'
        });
      }

      await alert.update({
        status: 'acknowledged',
        acknowledgedBy: req.user.id,
        acknowledgedAt: new Date()
      });

      res.json({
        success: true,
        message: 'Alert acknowledged successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async generateReport(req: Request, res: Response) {
    try {
      const { reportType } = req.params;
      const parameters = req.body;

      const report = await adminDashboardService.generateReport(reportType, parameters);

      res.json({
        success: true,
        data: report
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async broadcastAnnouncement(req: Request, res: Response) {
    try {
      const announcement = req.body as BroadcastAnnouncement;

      await adminDashboardService.broadcastAnnouncement(announcement, req.user.id);

      res.json({
        success: true,
        message: 'Announcement broadcast successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getFinancialOverview(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          error: 'Start date and end date are required'
        });
      }

      const dateRange = {
        startDate: new Date(startDate as string),
        endDate: new Date(endDate as string)
      };

      const overview = await adminDashboardService.getFinancialOverview(dateRange);

      res.json({
        success: true,
        data: overview
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getAdminLogs(req: Request, res: Response) {
    try {
      const {
        adminId,
        action,
        category,
        severity,
        startDate,
        endDate,
        page = 1,
        limit = 50
      } = req.query;

      let whereClause: any = {};
      
      if (adminId) whereClause.adminId = adminId;
      if (action) whereClause.action = action;
      if (category) whereClause.category = category;
      if (severity) whereClause.severity = severity;
      
      if (startDate || endDate) {
        whereClause.createdAt = {};
        if (startDate) whereClause.createdAt[Op.gte] = new Date(startDate as string);
        if (endDate) whereClause.createdAt[Op.lte] = new Date(endDate as string);
      }

      const logs = await AdminLog.findAndCountAll({
        where: whereClause,
        include: [
          { model: User, as: 'admin', attributes: ['id', 'username', 'role'] }
        ],
        limit: parseInt(limit as string),
        offset: (parseInt(page as string) - 1) * parseInt(limit as string),
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        data: {
          logs: logs.rows,
          pagination: {
            page: parseInt(page as string),
            limit: parseInt(limit as string),
            total: logs.count,
            totalPages: Math.ceil(logs.count / parseInt(limit as string))
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}
```

### Phase 4: Frontend Admin Components

#### 4.1 Admin Dashboard Overview (`frontend/src/components/admin/AdminDashboard.tsx`)
```typescript
const AdminDashboard: React.FC = () => {
  const [overview, setOverview] = useState<AdminDashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadDashboardData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(loadDashboardData, 5 * 60 * 1000);
    setRefreshInterval(interval);
    
    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await api.get('/admin/dashboard/overview');
      setOverview(response.data.data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Mexican Pickleball Federation Platform Overview</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={loadDashboardData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Refresh
          </button>
          <Link
            to="/admin/broadcast"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Broadcast Message
          </Link>
        </div>
      </div>

      {/* Critical Alerts */}
      {overview?.alerts && overview.alerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            ⚠️ Critical Alerts ({overview.alerts.length})
          </h2>
          <div className="space-y-2">
            {overview.alerts.map(alert => (
              <div key={alert.id} className="flex justify-between items-center">
                <div>
                  <span className="font-medium text-red-700">{alert.title}</span>
                  <span className="text-red-600 text-sm ml-2">{alert.message}</span>
                </div>
                <Link
                  to={`/admin/alerts/${alert.id}`}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  View →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Users"
          value={overview?.overview.totalUsers || 0}
          change={overview?.growthMetrics.userGrowth || 0}
          icon="👥"
          color="blue"
        />
        <MetricCard
          title="Active Users (30d)"
          value={overview?.overview.activeUsers || 0}
          change={overview?.growthMetrics.engagementGrowth || 0}
          icon="🎯"
          color="green"
        />
        <MetricCard
          title="Total Tournaments"
          value={overview?.overview.totalTournaments || 0}
          change={overview?.growthMetrics.tournamentGrowth || 0}
          icon="🏆"
          color="purple"
        />
        <MetricCard
          title="Monthly Revenue"
          value={`$${((overview?.overview.totalRevenue || 0) / 100).toLocaleString()}`}
          change={overview?.growthMetrics.revenueGrowth || 0}
          icon="💰"
          color="yellow"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickActionCard
          title="Pending Moderations"
          count={overview?.overview.pendingModerations || 0}
          description="Content items awaiting review"
          action="Review Content"
          href="/admin/moderation"
          color="orange"
        />
        <QuickActionCard
          title="System Alerts"
          count={overview?.overview.systemAlerts || 0}
          description="Active system alerts"
          action="View Alerts"
          href="/admin/alerts"
          color="red"
        />
        <QuickActionCard
          title="System Uptime"
          count={`${overview?.overview.systemUptime || 100}%`}
          description="Platform availability"
          action="View Metrics"
          href="/admin/system"
          color="green"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Admin Activity</h2>
          <div className="space-y-4">
            {overview?.recentActivity.map(log => (
              <div key={log.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded">
                <div className="flex-shrink-0">
                  <span className={`inline-block w-3 h-3 rounded-full ${
                    log.severity === 'high' ? 'bg-red-500' :
                    log.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {log.admin?.username}
                  </p>
                  <p className="text-sm text-gray-600">{log.description}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(log.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/admin/logs"
            className="block text-center mt-4 text-blue-600 hover:text-blue-800 font-medium"
          >
            View All Activity →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Top Performing Content</h2>
          <div className="space-y-4">
            {overview?.topContent.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No data available</p>
            ) : (
              overview?.topContent.map(content => (
                <div key={content.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{content.name}</p>
                    <p className="text-sm text-gray-600">{content.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{content.metric}</p>
                    <p className="text-sm text-gray-600">{content.value}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{
  title: string;
  value: number | string;
  change: number;
  icon: string;
  color: string;
}> = ({ title, value, change, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    purple: 'bg-purple-50 text-purple-700',
    yellow: 'bg-yellow-50 text-yellow-700'
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
      {change !== 0 && (
        <div className="mt-4">
          <span className={`text-sm font-medium ${
            change > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {change > 0 ? '+' : ''}{change.toFixed(1)}%
          </span>
          <span className="text-sm text-gray-600 ml-1">vs last period</span>
        </div>
      )}
    </div>
  );
};

const QuickActionCard: React.FC<{
  title: string;
  count: number | string;
  description: string;
  action: string;
  href: string;
  color: string;
}> = ({ title, count, description, action, href, color }) => {
  const colorClasses = {
    orange: 'text-orange-600 bg-orange-50 border-orange-200',
    red: 'text-red-600 bg-red-50 border-red-200',
    green: 'text-green-600 bg-green-50 border-green-200'
  };

  return (
    <div className={`rounded-lg border-2 p-6 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">{title}</h3>
        <span className="text-2xl font-bold">{count}</span>
      </div>
      <p className="text-sm mb-4">{description}</p>
      <Link
        to={href}
        className="inline-flex items-center font-medium hover:underline"
      >
        {action} →
      </Link>
    </div>
  );
};
```

#### 4.2 User Management Component (`frontend/src/components/admin/UserManagement.tsx`)
```typescript
const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all',
    search: '',
    page: 1,
    limit: 50
  });
  const [pagination, setPagination] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [filters]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') params.append(key, value.toString());
      });

      const response = await api.get(`/admin/users?${params}`);
      setUsers(response.data.data.users);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId: string, action: string, reason?: string) => {
    try {
      if (action === 'activate' || action === 'deactivate') {
        await api.put(`/admin/users/${userId}/status`, {
          isActive: action === 'activate',
          reason
        });
      }

      await loadUsers();
      setShowUserModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error performing user action:', error);
    }
  };

  const getRoleColor = (role: string) => {
    const colors = {
      player: 'bg-blue-100 text-blue-800',
      coach: 'bg-green-100 text-green-800',
      club: 'bg-purple-100 text-purple-800',
      partner: 'bg-yellow-100 text-yellow-800',
      state_committee: 'bg-indigo-100 text-indigo-800',
      admin: 'bg-red-100 text-red-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage platform users and their permissions</p>
        </div>
        <div className="text-sm text-gray-500">
          Total Users: {pagination?.total || 0}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={filters.role}
              onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value, page: 1 }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">All Roles</option>
              <option value="player">Players</option>
              <option value="coach">Coaches</option>
              <option value="club">Clubs</option>
              <option value="partner">Partners</option>
              <option value="state_committee">State Committees</option>
              <option value="admin">Federation</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
                placeholder="Search by username or email..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subscription
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {user.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.username}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                        {user.role.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.isActive)}`}>
                        {user.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.subscriptionStatus ? (
                        <span className="capitalize">{user.subscriptionStatus}</span>
                      ) : (
                        <span className="text-gray-400">No subscription</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserModal(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleUserAction(user.id, user.isActive ? 'deactivate' : 'activate')}
                        className={user.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page >= pagination.totalPages}
                  className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => {
            setShowUserModal(false);
            setSelectedUser(null);
          }}
          onUserAction={handleUserAction}
        />
      )}
    </div>
  );
};
```

### Phase 5: Testing & Quality Assurance

#### 5.1 Admin System Tests
```typescript
// backend/tests/admin.test.ts
describe('Admin Dashboard System', () => {
  describe('Dashboard Overview', () => {
    it('should return dashboard overview for admin admin', async () => {
      const response = await request(app)
        .get('/api/admin/dashboard/overview')
        .set('Authorization', `Bearer ${federationToken}`)
        .expect(200);

      expect(response.body.data.overview).toBeDefined();
      expect(response.body.data.growthMetrics).toBeDefined();
    });

    it('should deny access for non-admin users', async () => {
      await request(app)
        .get('/api/admin/dashboard/overview')
        .set('Authorization', `Bearer ${playerToken}`)
        .expect(403);
    });
  });

  describe('User Management', () => {
    it('should get user list with filters', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${federationToken}`)
        .query({ role: 'player', status: 'active' })
        .expect(200);

      expect(response.body.data.users).toBeDefined();
      expect(response.body.data.pagination).toBeDefined();
    });

    it('should update user status', async () => {
      await request(app)
        .put(`/api/admin/users/${playerId}/status`)
        .set('Authorization', `Bearer ${federationToken}`)
        .send({ isActive: false, reason: 'Policy violation' })
        .expect(200);
    });
  });

  describe('Content Moderation', () => {
    it('should get moderation queue', async () => {
      const response = await request(app)
        .get('/api/admin/moderation')
        .set('Authorization', `Bearer ${federationToken}`)
        .expect(200);

      expect(response.body.data.moderations).toBeDefined();
      expect(response.body.data.summary).toBeDefined();
    });

    it('should moderate content', async () => {
      const action = {
        status: 'approved',
        reason: 'Content reviewed and approved',
        actionTaken: 'none'
      };

      await request(app)
        .put(`/api/admin/moderation/${moderationId}`)
        .set('Authorization', `Bearer ${federationToken}`)
        .send(action)
        .expect(200);
    });
  });
});
```

## Implementation Priority
1. **CRITICAL**: Admin models and database schema (Phase 1)
2. **CRITICAL**: Admin dashboard service layer (Phase 2)
3. **HIGH**: Admin controllers and API endpoints (Phase 3)
4. **HIGH**: Frontend admin dashboard components (Phase 4)
5. **MEDIUM**: Advanced analytics and reporting
6. **MEDIUM**: System monitoring and alerting
7. **LOW**: Comprehensive testing (Phase 5)

## Expected Results
After implementation:
- Comprehensive administrative dashboard for admin management
- User management with role-based permissions
- Content moderation workflow with automated flagging
- System monitoring and alerting capabilities
- Financial overview and revenue tracking
- Audit logging for administrative actions
- Broadcast messaging and announcement system
- Detailed analytics and reporting tools

## Files to Create/Modify
- `backend/src/models/AdminLog.ts`
- `backend/src/models/PlatformStatistics.ts`
- `backend/src/models/ContentModeration.ts`
- `backend/src/models/SystemAlert.ts`
- `backend/src/services/adminDashboardService.ts`
- `backend/src/controllers/adminDashboardController.ts`
- `backend/src/routes/adminRoutes.ts`
- `frontend/src/components/admin/AdminDashboard.tsx`
- `frontend/src/components/admin/UserManagement.tsx`
- `frontend/src/components/admin/ContentModeration.tsx`
- `frontend/src/components/admin/SystemAlerts.tsx`
- `frontend/src/pages/AdminDashboardPage.tsx`
- `frontend/src/store/adminSlice.ts`