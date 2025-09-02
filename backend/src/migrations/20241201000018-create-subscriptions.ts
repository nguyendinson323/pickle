import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('subscriptions', {
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
    plan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'subscription_plans',
        key: 'id'
      }
    },
    stripe_subscription_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    stripe_customer_id: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active', 'past_due', 'canceled', 'unpaid', 'incomplete', 'trialing'),
      allowNull: false,
      defaultValue: 'incomplete'
    },
    current_period_start: {
      type: DataTypes.DATE,
      allowNull: false
    },
    current_period_end: {
      type: DataTypes.DATE,
      allowNull: false
    },
    cancel_at_period_end: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    canceled_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    trial_start: {
      type: DataTypes.DATE,
      allowNull: true
    },
    trial_end: {
      type: DataTypes.DATE,
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
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {}
    },
    next_billing_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    last_payment_date: {
      type: DataTypes.DATE,
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
  await queryInterface.addIndex('subscriptions', ['user_id']);
  await queryInterface.addIndex('subscriptions', ['plan_id']);
  await queryInterface.addIndex('subscriptions', ['stripe_subscription_id'], { unique: true });
  await queryInterface.addIndex('subscriptions', ['stripe_customer_id']);
  await queryInterface.addIndex('subscriptions', ['status']);
  await queryInterface.addIndex('subscriptions', ['current_period_end']);
  await queryInterface.addIndex('subscriptions', ['next_billing_date']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('subscriptions');
}