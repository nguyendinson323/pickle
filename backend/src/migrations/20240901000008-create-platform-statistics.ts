import { QueryInterface, DataTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface): Promise<void> => {
  await queryInterface.createTable('platform_statistics', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      unique: true,
    },
    // User statistics
    total_users: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    new_users: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    active_users: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    users_by_role: {
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
    },
    // Engagement metrics
    total_sessions: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    avg_session_duration: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
      defaultValue: 0,
    },
    page_views: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    // Tournament statistics
    total_tournaments: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    new_tournaments: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    active_tournaments: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    completed_tournaments: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    total_registrations: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    // Court booking statistics
    total_bookings: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    new_bookings: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    completed_bookings: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    cancelled_bookings: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    total_revenue: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    // Player matching statistics
    total_matches: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    new_matches: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    successful_matches: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    // Communication statistics
    messages_exchanged: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    notifications_sent: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    // Subscription statistics
    active_subscriptions: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    new_subscriptions: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    cancelled_subscriptions: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    subscription_revenue: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    // System health
    system_uptime: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 100.00,
    },
    average_response_time: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    error_rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  // Create indexes
  await queryInterface.addIndex('platform_statistics', ['date'], { unique: true });
  await queryInterface.addIndex('platform_statistics', ['total_users']);
  await queryInterface.addIndex('platform_statistics', ['active_users']);
  await queryInterface.addIndex('platform_statistics', ['total_revenue']);
  await queryInterface.addIndex('platform_statistics', ['system_uptime']);
  await queryInterface.addIndex('platform_statistics', ['error_rate']);
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
  await queryInterface.dropTable('platform_statistics');
};