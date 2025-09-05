import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface PlatformStatisticsAttributes {
  id: number;
  date: Date;
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  usersByRole: any;
  totalSessions: number;
  avgSessionDuration: number;
  pageViews: number;
  totalTournaments: number;
  newTournaments: number;
  activeTournaments: number;
  completedTournaments: number;
  totalRegistrations: number;
  totalBookings: number;
  newBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  totalMatches: number;
  newMatches: number;
  successfulMatches: number;
  messagesExchanged: number;
  notificationsSent: number;
  activeSubscriptions: number;
  newSubscriptions: number;
  cancelledSubscriptions: number;
  subscriptionRevenue: number;
  systemUptime: number;
  averageResponseTime: number;
  errorRate: number;
}

interface PlatformStatisticsCreationAttributes extends Optional<PlatformStatisticsAttributes, 'id'> {}

class PlatformStatistics extends Model<PlatformStatisticsAttributes, PlatformStatisticsCreationAttributes> implements PlatformStatisticsAttributes {
  public id!: number;
  public date!: Date;
  public totalUsers!: number;
  public newUsers!: number;
  public activeUsers!: number;
  public usersByRole!: any;
  public totalSessions!: number;
  public avgSessionDuration!: number;
  public pageViews!: number;
  public totalTournaments!: number;
  public newTournaments!: number;
  public activeTournaments!: number;
  public completedTournaments!: number;
  public totalRegistrations!: number;
  public totalBookings!: number;
  public newBookings!: number;
  public completedBookings!: number;
  public cancelledBookings!: number;
  public totalRevenue!: number;
  public totalMatches!: number;
  public newMatches!: number;
  public successfulMatches!: number;
  public messagesExchanged!: number;
  public notificationsSent!: number;
  public activeSubscriptions!: number;
  public newSubscriptions!: number;
  public cancelledSubscriptions!: number;
  public subscriptionRevenue!: number;
  public systemUptime!: number;
  public averageResponseTime!: number;
  public errorRate!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PlatformStatistics.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    unique: true
  },
  totalUsers: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'total_users'
  },
  newUsers: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'new_users'
  },
  activeUsers: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'active_users'
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
      admin: 0
    },
    field: 'users_by_role'
  },
  totalSessions: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'total_sessions'
  },
  avgSessionDuration: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'avg_session_duration'
  },
  pageViews: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'page_views'
  },
  totalTournaments: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'total_tournaments'
  },
  newTournaments: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'new_tournaments'
  },
  activeTournaments: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'active_tournaments'
  },
  completedTournaments: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'completed_tournaments'
  },
  totalRegistrations: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'total_registrations'
  },
  totalBookings: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'total_bookings'
  },
  newBookings: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'new_bookings'
  },
  completedBookings: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'completed_bookings'
  },
  cancelledBookings: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'cancelled_bookings'
  },
  totalRevenue: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: 0,
    field: 'total_revenue'
  },
  totalMatches: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'total_matches'
  },
  newMatches: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'new_matches'
  },
  successfulMatches: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'successful_matches'
  },
  messagesExchanged: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'messages_exchanged'
  },
  notificationsSent: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'notifications_sent'
  },
  activeSubscriptions: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'active_subscriptions'
  },
  newSubscriptions: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'new_subscriptions'
  },
  cancelledSubscriptions: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'cancelled_subscriptions'
  },
  subscriptionRevenue: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: 0,
    field: 'subscription_revenue'
  },
  systemUptime: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 100.00,
    field: 'system_uptime'
  },
  averageResponseTime: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'average_response_time'
  },
  errorRate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0.00,
    field: 'error_rate'
  }
}, {
  sequelize,
  modelName: 'PlatformStatistics',
  tableName: 'platform_statistics',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['date'],
      unique: true
    },
    {
      fields: ['total_users']
    },
    {
      fields: ['active_users']
    },
    {
      fields: ['total_revenue']
    },
    {
      fields: ['system_uptime']
    },
    {
      fields: ['error_rate']
    }
  ]
});

export default PlatformStatistics;