import { DashboardData, DashboardStats, ActivityItem, NotificationItem, QuickAction } from '../types/dashboard';
import { User, Player, Coach, Club, Partner, StateCommittee } from '../models';

export class DashboardService {
  
  async getPlayerDashboard(userId: number): Promise<any> {
    const user = await User.findByPk(userId, {
      include: [{ model: Player, as: 'playerProfile' }]
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Build dashboard data according to the enhanced frontend interface
    const ranking = await this.getPlayerRanking(userId);
    const statistics = await this.getPlayerMatchStatistics(userId);
    const recentActivity = await this.getPlayerRecentActivity(userId);
    const upcomingTournaments = await this.getPlayerUpcomingTournaments(userId);
    const notifications = await this.getPlayerNotifications(userId);

    return {
      ranking,
      statistics,
      recentActivity,
      upcomingTournaments,
      notifications
    };
  }

  async getCoachDashboard(userId: number): Promise<DashboardData> {
    const user = await User.findByPk(userId, {
      include: [{ model: Coach, as: 'coachProfile' }]
    });

    if (!user) {
      throw new Error('User not found');
    }

    const statistics = await this.getCoachStatistics(userId);
    const recentActivity = await this.getCoachActivity(userId);
    const notifications = await this.getNotifications(userId);
    const quickActions = await this.getCoachQuickActions(userId);

    return {
      user: user.toJSON(),
      statistics,
      recentActivity,
      notifications,
      quickActions
    };
  }

  async getClubDashboard(userId: number): Promise<DashboardData> {
    const user = await User.findByPk(userId, {
      include: [{ model: Club, as: 'clubProfile' }]
    });

    if (!user) {
      throw new Error('User not found');
    }

    const statistics = await this.getClubStatistics(userId);
    const recentActivity = await this.getClubActivity(userId);
    const notifications = await this.getNotifications(userId);
    const quickActions = await this.getClubQuickActions(userId);

    return {
      user: user.toJSON(),
      statistics,
      recentActivity,
      notifications,
      quickActions
    };
  }

  async getPartnerDashboard(userId: number): Promise<DashboardData> {
    const user = await User.findByPk(userId, {
      include: [{ model: Partner, as: 'partnerProfile' }]
    });

    if (!user) {
      throw new Error('User not found');
    }

    const statistics = await this.getPartnerStatistics(userId);
    const recentActivity = await this.getPartnerActivity(userId);
    const notifications = await this.getNotifications(userId);
    const quickActions = await this.getPartnerQuickActions(userId);

    return {
      user: user.toJSON(),
      statistics,
      recentActivity,
      notifications,
      quickActions
    };
  }

  async getStateDashboard(userId: number): Promise<DashboardData> {
    const user = await User.findByPk(userId, {
      include: [{ model: StateCommittee, as: 'stateCommitteeProfile' }]
    });

    if (!user) {
      throw new Error('User not found');
    }

    const statistics = await this.getStateStatistics(userId);
    const recentActivity = await this.getStateActivity(userId);
    const notifications = await this.getNotifications(userId);
    const quickActions = await this.getStateQuickActions(userId);

    return {
      user: user.toJSON(),
      statistics,
      recentActivity,
      notifications,
      quickActions
    };
  }

  async getAdminDashboard(userId: number): Promise<any> {
    const user = await User.findByPk(userId);

    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized access');
    }

    // Build admin dashboard data according to enhanced frontend interface
    const statistics = await this.getAdminOverviewStatistics();
    const userBreakdown = await this.getUserBreakdown();
    const recentRegistrations = await this.getRecentRegistrations();
    const systemAlerts = await this.getSystemAlerts();
    const revenueChart = await this.getRevenueChart();

    return {
      statistics,
      userBreakdown,
      recentRegistrations,
      systemAlerts,
      revenueChart
    };
  }

  // Enhanced Player Dashboard Methods (matching frontend interface)
  private async getPlayerRanking(userId: number): Promise<{ position: number; change: number } | undefined> {
    // Mock data - in production this would query actual ranking data
    return {
      position: 15,
      change: 2 // positive means moved up
    };
  }

  private async getPlayerMatchStatistics(userId: number): Promise<{ 
    matchesPlayed: number; 
    winRate: number; 
    upcomingMatches: number 
  } | undefined> {
    // Mock data - in production this would query match history and upcoming matches
    return {
      matchesPlayed: 12,
      winRate: 75, // percentage
      upcomingMatches: 3
    };
  }

  private async getPlayerRecentActivity(userId: number): Promise<Array<{
    type: string;
    description: string;
    date: string;
  }> | undefined> {
    // Mock data - in production this would query recent user activities
    return [
      {
        type: 'match',
        description: 'Won match against Carlos M.',
        date: '2 days ago'
      },
      {
        type: 'tournament',
        description: 'Registered for State Championship',
        date: '5 days ago'
      },
      {
        type: 'ranking',
        description: 'Moved up 2 positions in ranking',
        date: '1 week ago'
      }
    ];
  }

  private async getPlayerUpcomingTournaments(userId: number): Promise<Array<{
    id: string;
    name: string;
    location: string;
    date: string;
    status: string;
  }> | undefined> {
    // Mock data - in production this would query tournament registrations
    return [
      {
        id: '1',
        name: 'State Championship',
        location: 'Mexico City',
        date: '2024-12-15',
        status: 'registered'
      },
      {
        id: '2',
        name: 'Club Tournament',
        location: 'Local Club',
        date: '2024-12-22',
        status: 'open'
      }
    ];
  }

  private async getPlayerNotifications(userId: number): Promise<{ unread: number } | undefined> {
    // Mock data - in production this would query unread notifications
    return {
      unread: 2
    };
  }

  // Original Statistics Methods (for backward compatibility)
  private async getPlayerStatistics(userId: number): Promise<DashboardStats> {
    // Mock data for now - will be replaced with actual database queries
    return {
      activeTournaments: 3,
      courtReservations: 8,
      membershipStatus: 'active' as const,
      nextRenewal: '2025-12-31',
    };
  }

  private async getCoachStatistics(userId: number): Promise<DashboardStats> {
    return {
      studentsCount: 15,
      trainingHours: 120,
      matchesRefereed: 45,
      certificationLevel: 'Level 3 Certified',
      membershipStatus: 'active' as const,
    };
  }

  private async getClubStatistics(userId: number): Promise<DashboardStats> {
    return {
      totalMembers: 85,
      activeTournaments: 5,
      courtReservations: 142,
      eventsCreated: 12,
      membershipStatus: 'active' as const,
    };
  }

  private async getPartnerStatistics(userId: number): Promise<DashboardStats> {
    return {
      courtReservations: 250,
      partnershipTier: 'Gold',
      sponsorshipValue: 25000,
      eventsCreated: 8,
      membershipStatus: 'active' as const,
    };
  }

  private async getStateStatistics(userId: number): Promise<DashboardStats> {
    return {
      totalClubs: 12,
      totalPlayers: 450,
      regionsManaged: 5,
      regionalEvents: 18,
      membershipStatus: 'active' as const,
    };
  }

  private async getAdminStatistics(): Promise<DashboardStats> {
    const totalPlayers = await Player.count();
    const totalCoaches = await Coach.count();
    const totalClubs = await Club.count();
    const totalPartners = await Partner.count();
    const totalStates = await StateCommittee.count();

    return {
      totalPlayers,
      totalCoaches,
      totalClubs,
      totalPartners,
      totalStates,
      activeTournaments: 45,
      revenue: 125000,
    };
  }

  // Enhanced Admin Dashboard Methods (matching frontend interface)
  private async getAdminOverviewStatistics(): Promise<any> {
    const totalUsers = await User.count({ where: { isActive: true } });
    const newUsersThisMonth = await User.count({
      where: {
        isActive: true
        // TODO: Add date filtering when Op is properly imported
        // createdAt: { [Op.gte]: new Date(...) }
      }
    });

    // Mock data - in production these would be real database queries
    return {
      totalUsers: totalUsers || 150,
      newUsersThisMonth: 12,
      activeMemberships: 89,
      totalCourts: 45,
      monthlyRevenue: 25000,
      activeTournaments: 8,
      userGrowthRate: 8.5
    };
  }

  private async getUserBreakdown(): Promise<any> {
    const players = await Player.count();
    const coaches = await Coach.count();
    const clubs = await Club.count();
    const partners = await Partner.count();

    return {
      players: players || 85,
      coaches: coaches || 12,
      clubs: clubs || 8,
      partners: partners || 5
    };
  }

  private async getRecentRegistrations(): Promise<any[]> {
    // Mock data - in production this would query recent user registrations
    return [
      {
        name: 'María González',
        role: 'player',
        state: 'Mexico City',
        status: 'verified',
        profilePhoto: null
      },
      {
        name: 'Carlos Ramirez',
        role: 'coach',
        state: 'Guadalajara',
        status: 'pending',
        profilePhoto: null
      },
      {
        name: 'Club Deportivo Norte',
        role: 'club',
        state: 'Monterrey',
        status: 'verified',
        profilePhoto: null
      }
    ];
  }

  private async getSystemAlerts(): Promise<any[]> {
    // Mock data - in production this would query system status and alerts
    return [
      {
        title: 'Server Performance',
        description: 'All systems operating normally',
        severity: 'low',
        timestamp: new Date().toISOString()
      },
      {
        title: 'Payment Gateway',
        description: 'Payment processing delays reported',
        severity: 'medium',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      }
    ];
  }

  private async getRevenueChart(): Promise<any[]> {
    // Mock data - in production this would query monthly revenue data
    return [
      { month: 'Jan', revenue: 18000 },
      { month: 'Feb', revenue: 22000 },
      { month: 'Mar', revenue: 25000 },
      { month: 'Apr', revenue: 28000 },
      { month: 'May', revenue: 31000 },
      { month: 'Jun', revenue: 29000 }
    ];
  }

  // Activity Methods
  private async getPlayerActivity(userId: number): Promise<ActivityItem[]> {
    return [
      {
        id: 1,
        title: 'Registered for Tournament',
        description: 'Mexico Open Championships 2024',
        type: 'tournament',
        timestamp: '2024-01-15T10:30:00Z',
        iconType: 'trophy',
        actionUrl: '/tournaments/5'
      },
      {
        id: 2,
        title: 'Training Session Completed',
        description: 'Advanced Techniques with Coach María',
        type: 'training',
        timestamp: '2024-01-14T16:00:00Z',
        iconType: 'academic-cap'
      }
    ];
  }

  private async getCoachActivity(userId: number): Promise<ActivityItem[]> {
    return [
      {
        id: 1,
        title: 'New Certification Earned',
        description: 'Level 3 Coaching Certification',
        type: 'certification',
        timestamp: '2024-01-15T09:00:00Z',
        iconType: 'badge-check'
      },
      {
        id: 2,
        title: 'Training Session Scheduled',
        description: 'Group session with 8 players',
        type: 'training',
        timestamp: '2024-01-14T18:00:00Z',
        iconType: 'calendar'
      }
    ];
  }

  private async getClubActivity(userId: number): Promise<ActivityItem[]> {
    return [
      {
        id: 1,
        title: 'Tournament Created',
        description: 'Club Championship 2024',
        type: 'tournament',
        timestamp: '2024-01-15T11:00:00Z',
        iconType: 'trophy'
      },
      {
        id: 2,
        title: 'New Member Registration',
        description: '5 new members joined this week',
        type: 'registration',
        timestamp: '2024-01-14T14:30:00Z',
        iconType: 'user-plus'
      }
    ];
  }

  private async getPartnerActivity(userId: number): Promise<ActivityItem[]> {
    return [
      {
        id: 1,
        title: 'Sponsorship Agreement',
        description: 'Regional Tournament Sponsorship',
        type: 'payment',
        timestamp: '2024-01-15T13:00:00Z',
        iconType: 'currency-dollar'
      }
    ];
  }

  private async getStateActivity(userId: number): Promise<ActivityItem[]> {
    return [
      {
        id: 1,
        title: 'State Tournament Approved',
        description: 'Annual State Championships',
        type: 'tournament',
        timestamp: '2024-01-15T15:00:00Z',
        iconType: 'trophy'
      }
    ];
  }

  private async getAdminActivity(): Promise<ActivityItem[]> {
    return [
      {
        id: 1,
        title: 'System Update Completed',
        description: 'Platform maintenance successful',
        type: 'message',
        timestamp: '2024-01-15T20:00:00Z',
        iconType: 'cog'
      }
    ];
  }

  // Notification Methods
  private async getNotifications(userId: number): Promise<NotificationItem[]> {
    return [
      {
        id: 1,
        title: 'Welcome to the Federation',
        message: 'Complete your profile to unlock all features',
        type: 'info',
        isRead: false,
        createdAt: '2024-01-15T12:00:00Z',
        actionUrl: '/profile'
      }
    ];
  }

  // Quick Actions Methods
  private async getPlayerQuickActions(userId: number): Promise<QuickAction[]> {
    return [
      {
        id: 'find-tournaments',
        title: 'Find Tournaments',
        description: 'Browse and register for upcoming tournaments',
        icon: 'trophy',
        actionType: 'navigate',
        actionUrl: '/tournaments',
        isAvailable: true
      },
      {
        id: 'book-court',
        title: 'Book Court',
        description: 'Reserve a court for training or matches',
        icon: 'location-marker',
        actionType: 'navigate',
        actionUrl: '/courts',
        isAvailable: true
      },
      {
        id: 'find-players',
        title: 'Find Players',
        description: 'Connect with other players in your area',
        icon: 'users',
        actionType: 'navigate',
        actionUrl: '/player-finder',
        isAvailable: true,
        isPremium: true
      }
    ];
  }

  private async getCoachQuickActions(userId: number): Promise<QuickAction[]> {
    return [
      {
        id: 'create-training',
        title: 'Schedule Training',
        description: 'Create a new training session',
        icon: 'calendar-plus',
        actionType: 'modal',
        isAvailable: true
      },
      {
        id: 'view-certifications',
        title: 'Certifications',
        description: 'View and manage your certifications',
        icon: 'badge-check',
        actionType: 'navigate',
        actionUrl: '/certifications',
        isAvailable: true
      }
    ];
  }

  private async getClubQuickActions(userId: number): Promise<QuickAction[]> {
    return [
      {
        id: 'create-tournament',
        title: 'Create Tournament',
        description: 'Organize a new tournament',
        icon: 'trophy',
        actionType: 'navigate',
        actionUrl: '/tournaments/create',
        isAvailable: true
      },
      {
        id: 'manage-members',
        title: 'Manage Members',
        description: 'Add or edit club members',
        icon: 'users',
        actionType: 'navigate',
        actionUrl: '/members',
        isAvailable: true
      }
    ];
  }

  private async getPartnerQuickActions(userId: number): Promise<QuickAction[]> {
    return [
      {
        id: 'court-management',
        title: 'Manage Courts',
        description: 'Update court availability and pricing',
        icon: 'cog',
        actionType: 'navigate',
        actionUrl: '/courts/manage',
        isAvailable: true
      }
    ];
  }

  private async getStateQuickActions(userId: number): Promise<QuickAction[]> {
    return [
      {
        id: 'create-state-tournament',
        title: 'Create State Tournament',
        description: 'Organize a state-level tournament',
        icon: 'trophy',
        actionType: 'navigate',
        actionUrl: '/tournaments/create',
        isAvailable: true
      }
    ];
  }

  private async getAdminQuickActions(): Promise<QuickAction[]> {
    return [
      {
        id: 'user-management',
        title: 'Manage Users',
        description: 'View and manage all users',
        icon: 'users',
        actionType: 'navigate',
        actionUrl: '/admin/users',
        isAvailable: true
      },
      {
        id: 'system-settings',
        title: 'System Settings',
        description: 'Configure platform settings',
        icon: 'cog',
        actionType: 'navigate',
        actionUrl: '/admin/settings',
        isAvailable: true
      }
    ];
  }
}

export default new DashboardService();