import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('subscription_plans', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    stripe_price_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    stripe_product_id: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    currency: {
      type: DataTypes.ENUM('USD', 'MXN'),
      allowNull: false,
      defaultValue: 'USD'
    },
    interval: {
      type: DataTypes.ENUM('month', 'year'),
      allowNull: false,
      defaultValue: 'month'
    },
    interval_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    trial_period_days: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    features: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: []
    },
    max_tournament_registrations: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    max_court_bookings: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    max_player_matches: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    advanced_filters: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    priority_support: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    analytics_access: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    custom_branding: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    is_popular: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    sort_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    }
  });

  // Add indexes exactly as defined in the model
  await queryInterface.addIndex('subscription_plans', ['stripe_price_id'], { unique: true });
  await queryInterface.addIndex('subscription_plans', ['stripe_product_id']);
  await queryInterface.addIndex('subscription_plans', ['is_active']);
  await queryInterface.addIndex('subscription_plans', ['is_popular']);
  await queryInterface.addIndex('subscription_plans', ['sort_order']);
  await queryInterface.addIndex('subscription_plans', ['amount']);
  await queryInterface.addIndex('subscription_plans', ['interval']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('subscription_plans');
}