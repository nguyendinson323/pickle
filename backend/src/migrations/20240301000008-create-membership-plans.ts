import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('membership_plans', {
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
      allowNull: true
    },
    user_type: {
      type: DataTypes.ENUM('player', 'coach', 'club', 'partner', 'state', 'federation'),
      allowNull: false
    },
    plan_type: {
      type: DataTypes.ENUM('basic', 'premium', 'professional', 'enterprise'),
      allowNull: false
    },
    duration_months: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'MXN',
      allowNull: false
    },
    features: {
      type: DataTypes.JSON,
      allowNull: true
    },
    limitations: {
      type: DataTypes.JSON,
      allowNull: true
    },
    benefits: {
      type: DataTypes.JSON,
      allowNull: true
    },
    max_courts: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    max_tournaments: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    max_students: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    max_staff: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    storage_limit_mb: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    api_calls_limit: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    priority_support: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    custom_branding: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    analytics_access: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    tournament_management: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    payment_processing: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    marketing_tools: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    mobile_app_access: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    is_featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    display_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    trial_period_days: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    setup_fee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      allowNull: false
    },
    discount_percentage: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.00,
      allowNull: false
    },
    promotional_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    promotion_start_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    promotion_end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    stripe_price_id: {
      type: DataTypes.STRING(100),
      allowNull: true
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

  // Add indexes
  await queryInterface.addIndex('membership_plans', ['user_type']);
  await queryInterface.addIndex('membership_plans', ['plan_type']);
  await queryInterface.addIndex('membership_plans', ['is_active']);
  await queryInterface.addIndex('membership_plans', ['is_featured']);
  await queryInterface.addIndex('membership_plans', ['display_order']);
  await queryInterface.addIndex('membership_plans', ['price']);
  await queryInterface.addIndex('membership_plans', ['stripe_price_id'], { unique: true });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('membership_plans');
}