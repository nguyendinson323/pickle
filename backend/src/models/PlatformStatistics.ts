import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface PlatformStatisticsAttributes {
  id: number;
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
    federation: number;
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
  totalRevenue: number; // in cents (Mexican pesos)
  
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
  subscriptionRevenue: number; // in cents (Mexican pesos)
  
  // System health
  systemUptime: number; // percentage
  averageResponseTime: number; // in milliseconds
  errorRate: number; // percentage
  
  createdAt: Date;
  updatedAt: Date;
}

interface PlatformStatisticsCreationAttributes extends Optional<PlatformStatisticsAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class PlatformStatistics extends Model<PlatformStatisticsAttributes, PlatformStatisticsCreationAttributes> implements PlatformStatisticsAttributes {
  public id!: number;
  public date!: Date;
  
  // User statistics
  public totalUsers!: number;
  public newUsers!: number;
  public activeUsers!: number;
  public usersByRole!: {
    player: number;
    coach: number;
    club: number;
    partner: number;
    state_committee: number;
    federation: number;
  };
  
  // Engagement metrics
  public totalSessions!: number;
  public avgSessionDuration!: number;
  public pageViews!: number;
  
  // Tournament statistics
  public totalTournaments!: number;
  public newTournaments!: number;
  public activeTournaments!: number;
  public completedTournaments!: number;
  public totalRegistrations!: number;
  
  // Court booking statistics
  public totalBookings!: number;
  public newBookings!: number;
  public completedBookings!: number;
  public cancelledBookings!: number;
  public totalRevenue!: number;
  
  // Player matching statistics
  public totalMatches!: number;
  public newMatches!: number;
  public successfulMatches!: number;
  
  // Communication statistics
  public messagesExchanged!: number;
  public notificationsSent!: number;
  
  // Subscription statistics
  public activeSubscriptions!: number;
  public newSubscriptions!: number;
  public cancelledSubscriptions!: number;
  public subscriptionRevenue!: number;
  
  // System health
  public systemUptime!: number;
  public averageResponseTime!: number;
  public errorRate!: number;
  
  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Helper methods
  public getTotalRevenueMXN(): number {
    return this.totalRevenue / 100; // Convert from cents to pesos
  }

  public getSubscriptionRevenueMXN(): number {
    return this.subscriptionRevenue / 100; // Convert from cents to pesos
  }

  public getAverageUsersPerRole(): number {
    const totalRoleUsers = Object.values(this.usersByRole).reduce((sum, count) => sum + count, 0);
    const roleCount = Object.keys(this.usersByRole).length;
    return roleCount > 0 ? totalRoleUsers / roleCount : 0;
  }

  public getEngagementRate(): number {
    return this.totalUsers > 0 ? (this.activeUsers / this.totalUsers) * 100 : 0;
  }

  public getTournamentCompletionRate(): number {
    return this.totalTournaments > 0 
      ? (this.completedTournaments / this.totalTournaments) * 100 
      : 0;
  }

  public getBookingCancellationRate(): number {
    return this.totalBookings > 0 
      ? (this.cancelledBookings / this.totalBookings) * 100 
      : 0;
  }

  public getMatchSuccessRate(): number {
    return this.totalMatches > 0 
      ? (this.successfulMatches / this.totalMatches) * 100 
      : 0;
  }

  public getSystemHealth(): 'excellent' | 'good' | 'fair' | 'poor' {
    const healthScore = (this.systemUptime + (100 - this.errorRate)) / 2;
    
    if (healthScore >= 95) return 'excellent';
    if (healthScore >= 85) return 'good';
    if (healthScore >= 70) return 'fair';
    return 'poor';
  }

  public getFormattedDate(): string {
    return this.date.toLocaleDateString('es-MX');
  }
}

PlatformStatistics.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      unique: true, // Ensure only one record per date
    },
    // User statistics
    totalUsers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'total_users',
    },
    newUsers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'new_users',
    },
    activeUsers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'active_users',
    },
    usersByRole: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {
        player: 0,
        coach: 0,
        club: 0,
        partner: 0,
        state_committee: 0,
        federation: 0,
      },
      field: 'users_by_role',
    },
    // Engagement metrics
    totalSessions: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'total_sessions',
    },
    avgSessionDuration: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'avg_session_duration',
    },
    pageViews: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'page_views',
    },
    // Tournament statistics
    totalTournaments: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'total_tournaments',
    },
    newTournaments: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'new_tournaments',
    },
    activeTournaments: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'active_tournaments',
    },
    completedTournaments: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'completed_tournaments',
    },
    totalRegistrations: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'total_registrations',
    },
    // Court booking statistics
    totalBookings: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'total_bookings',
    },
    newBookings: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'new_bookings',
    },
    completedBookings: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'completed_bookings',
    },
    cancelledBookings: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'cancelled_bookings',
    },
    totalRevenue: {
      type: DataTypes.BIGINT, // Use BIGINT for large monetary values
      allowNull: false,
      defaultValue: 0,
      field: 'total_revenue',
    },
    // Player matching statistics
    totalMatches: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'total_matches',
    },
    newMatches: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'new_matches',
    },
    successfulMatches: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'successful_matches',
    },
    // Communication statistics
    messagesExchanged: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'messages_exchanged',
    },
    notificationsSent: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'notifications_sent',
    },
    // Subscription statistics
    activeSubscriptions: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'active_subscriptions',
    },
    newSubscriptions: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'new_subscriptions',
    },
    cancelledSubscriptions: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'cancelled_subscriptions',
    },
    subscriptionRevenue: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
      field: 'subscription_revenue',
    },
    // System health
    systemUptime: {
      type: DataTypes.DECIMAL(5, 2), // 999.99%
      allowNull: false,
      defaultValue: 100.00,
      field: 'system_uptime',
    },
    averageResponseTime: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'average_response_time',
    },
    errorRate: {
      type: DataTypes.DECIMAL(5, 2), // 999.99%
      allowNull: false,
      defaultValue: 0.00,
      field: 'error_rate',
    },
  },
  {
    sequelize,
    tableName: 'platform_statistics',
    timestamps: true,
    indexes: [
      {
        fields: ['date'],
        unique: true,
      },
      {
        fields: ['total_users'],
      },
      {
        fields: ['active_users'],
      },
      {
        fields: ['total_revenue'],
      },
      {
        fields: ['system_uptime'],
      },
      {
        fields: ['error_rate'],
      },
    ],
  }
);

export default PlatformStatistics;