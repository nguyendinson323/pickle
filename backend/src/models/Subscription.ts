import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface SubscriptionAttributes {
  id: number;
  userId: number;
  planId: number;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  
  // Subscription Details
  status: 'active' | 'past_due' | 'canceled' | 'unpaid' | 'incomplete' | 'trialing';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Date;
  trialStart?: Date;
  trialEnd?: Date;
  
  // Pricing
  amount: number; // in cents
  currency: 'USD' | 'MXN';
  interval: 'month' | 'year';
  intervalCount: number; // e.g., 3 for every 3 months
  
  // Metadata
  metadata?: Record<string, any>;
  
  // Billing
  nextBillingDate?: Date;
  lastPaymentDate?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

interface SubscriptionCreationAttributes extends Optional<SubscriptionAttributes, 'id' | 'canceledAt' | 'trialStart' | 'trialEnd' | 'metadata' | 'nextBillingDate' | 'lastPaymentDate' | 'createdAt' | 'updatedAt'> {}

class Subscription extends Model<SubscriptionAttributes, SubscriptionCreationAttributes> implements SubscriptionAttributes {
  public id!: number;
  public userId!: number;
  public planId!: number;
  public stripeSubscriptionId!: string;
  public stripeCustomerId!: string;
  
  public status!: 'active' | 'past_due' | 'canceled' | 'unpaid' | 'incomplete' | 'trialing';
  public currentPeriodStart!: Date;
  public currentPeriodEnd!: Date;
  public cancelAtPeriodEnd!: boolean;
  public canceledAt?: Date;
  public trialStart?: Date;
  public trialEnd?: Date;
  
  public amount!: number;
  public currency!: 'USD' | 'MXN';
  public interval!: 'month' | 'year';
  public intervalCount!: number;
  
  public metadata?: Record<string, any>;
  
  public nextBillingDate?: Date;
  public lastPaymentDate?: Date;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Association properties
  public user?: any;
  public plan?: any;
  public payments?: any[];
}

Subscription.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    field: 'user_id'
  },
  planId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'subscription_plans',
      key: 'id'
    },
    field: 'plan_id'
  },
  stripeSubscriptionId: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    field: 'stripe_subscription_id'
  },
  stripeCustomerId: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'stripe_customer_id'
  },
  status: {
    type: DataTypes.ENUM('active', 'past_due', 'canceled', 'unpaid', 'incomplete', 'trialing'),
    allowNull: false,
    defaultValue: 'incomplete'
  },
  currentPeriodStart: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'current_period_start'
  },
  currentPeriodEnd: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'current_period_end'
  },
  cancelAtPeriodEnd: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'cancel_at_period_end'
  },
  canceledAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'canceled_at'
  },
  trialStart: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'trial_start'
  },
  trialEnd: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'trial_end'
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    },
    comment: 'Amount in cents'
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
  intervalCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1
    },
    field: 'interval_count'
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  },
  nextBillingDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'next_billing_date'
  },
  lastPaymentDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'last_payment_date'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'updated_at'
  }
}, {
  sequelize,
  modelName: 'Subscription',
  tableName: 'subscriptions',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['plan_id']
    },
    {
      fields: ['stripe_subscription_id'],
      unique: true
    },
    {
      fields: ['stripe_customer_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['current_period_end']
    },
    {
      fields: ['next_billing_date']
    }
  ]
});

export default Subscription;