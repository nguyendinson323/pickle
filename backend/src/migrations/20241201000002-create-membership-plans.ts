import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('membership_plans', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('player', 'coach', 'club', 'partner', 'state', 'admin'),
      allowNull: false
    },
    plan_type: {
      type: DataTypes.ENUM('basic', 'premium'),
      allowNull: false
    },
    annual_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    monthly_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    features: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: []
    },
    stripe_price_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
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
  await queryInterface.addIndex('membership_plans', ['role']);
  await queryInterface.addIndex('membership_plans', ['plan_type']);
  await queryInterface.addIndex('membership_plans', ['is_active']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('membership_plans');
}