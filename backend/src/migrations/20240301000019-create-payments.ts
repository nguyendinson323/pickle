import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('payments', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    membership_plan_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'membership_plans',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    payment_type: {
      type: DataTypes.ENUM('membership', 'upgrade', 'renewal', 'tournament', 'court_rental', 'certification'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'succeeded', 'failed', 'cancelled', 'refunded', 'disputed'),
      allowNull: false,
      defaultValue: 'pending'
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'mxn'
    },
    stripe_payment_intent_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    stripe_customer_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    stripe_charge_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    payment_method: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'card'
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    tax_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    reference_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    reference_type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {}
    },
    paid_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    refunded_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    refund_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    failure_reason: {
      type: DataTypes.TEXT,
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
  await queryInterface.addIndex('payments', ['user_id']);
  await queryInterface.addIndex('payments', ['status']);
  await queryInterface.addIndex('payments', ['payment_type']);
  await queryInterface.addIndex('payments', ['stripe_payment_intent_id']);
  await queryInterface.addIndex('payments', ['created_at']);
  await queryInterface.addIndex('payments', ['membership_plan_id']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('payments');
}