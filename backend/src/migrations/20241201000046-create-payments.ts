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
      }
    },
    subscription_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'subscriptions',
        key: 'id'
      }
    },
    stripe_payment_intent_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    stripe_charge_id: {
      type: DataTypes.STRING(255),
      allowNull: true
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
    type: {
      type: DataTypes.ENUM('subscription', 'tournament_entry', 'court_booking', 'one_time', 'refund'),
      allowNull: false
    },
    related_entity_type: {
      type: DataTypes.ENUM('tournament', 'court_booking', 'subscription'),
      allowNull: true
    },
    related_entity_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'succeeded', 'failed', 'canceled', 'requires_action'),
      allowNull: false,
      defaultValue: 'pending'
    },
    failure_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    payment_method: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    platform_fee: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    stripe_fee: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    net_amount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    refunded_amount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    refunded_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    refund_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {}
    },
    webhook_processed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    webhook_data: {
      type: DataTypes.JSONB,
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

  // Add indexes exactly as defined in the model
  await queryInterface.addIndex('payments', ['user_id']);
  await queryInterface.addIndex('payments', ['subscription_id']);
  await queryInterface.addIndex('payments', ['stripe_payment_intent_id'], { unique: true });
  await queryInterface.addIndex('payments', ['stripe_charge_id']);
  await queryInterface.addIndex('payments', ['type']);
  await queryInterface.addIndex('payments', ['status']);
  await queryInterface.addIndex('payments', ['related_entity_type', 'related_entity_id']);
  await queryInterface.addIndex('payments', ['webhook_processed']);
  await queryInterface.addIndex('payments', ['created_at']);
  await queryInterface.addIndex('payments', ['refunded_at']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('payments');
}