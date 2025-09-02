import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface PaymentAttributes {
  id: number;
  userId: number;
  subscriptionId?: number;
  
  // Payment Details
  stripePaymentIntentId: string;
  stripeChargeId?: string;
  amount: number; // in cents
  currency: 'USD' | 'MXN';
  
  // Payment Purpose
  type: 'subscription' | 'tournament_entry' | 'court_booking' | 'one_time' | 'refund';
  relatedEntityType?: 'tournament' | 'court_booking' | 'subscription';
  relatedEntityId?: number;
  
  // Status
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'canceled' | 'requires_action';
  failureReason?: string;
  
  // Payment Method
  paymentMethod: {
    type: 'card' | 'bank_account' | 'wallet';
    card?: {
      brand: string;
      last4: string;
      expMonth: number;
      expYear: number;
    };
  };
  
  // Fees
  platformFee?: number; // in cents
  stripeFee?: number; // in cents
  netAmount?: number; // amount - fees
  
  // Refund Info
  refundedAmount?: number; // in cents
  refundedAt?: Date;
  refundReason?: string;
  
  // Metadata
  description?: string;
  metadata?: Record<string, any>;
  
  // Webhooks
  webhookProcessed: boolean;
  webhookData?: any;
  
  createdAt: Date;
  updatedAt: Date;
}

interface PaymentCreationAttributes extends Optional<PaymentAttributes, 'id' | 'subscriptionId' | 'stripeChargeId' | 'relatedEntityType' | 'relatedEntityId' | 'failureReason' | 'platformFee' | 'stripeFee' | 'netAmount' | 'refundedAmount' | 'refundedAt' | 'refundReason' | 'description' | 'metadata' | 'webhookData' | 'createdAt' | 'updatedAt'> {}

class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
  public id!: number;
  public userId!: number;
  public subscriptionId?: number;
  
  public stripePaymentIntentId!: string;
  public stripeChargeId?: string;
  public amount!: number;
  public currency!: 'USD' | 'MXN';
  
  public type!: 'subscription' | 'tournament_entry' | 'court_booking' | 'one_time' | 'refund';
  public relatedEntityType?: 'tournament' | 'court_booking' | 'subscription';
  public relatedEntityId?: number;
  
  public status!: 'pending' | 'processing' | 'succeeded' | 'failed' | 'canceled' | 'requires_action';
  public failureReason?: string;
  
  public paymentMethod!: {
    type: 'card' | 'bank_account' | 'wallet';
    card?: {
      brand: string;
      last4: string;
      expMonth: number;
      expYear: number;
    };
  };
  
  public platformFee?: number;
  public stripeFee?: number;
  public netAmount?: number;
  
  public refundedAmount?: number;
  public refundedAt?: Date;
  public refundReason?: string;
  
  public description?: string;
  public metadata?: Record<string, any>;
  
  public webhookProcessed!: boolean;
  public webhookData?: any;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Association properties
  public user?: any;
  public subscription?: any;
}

Payment.init({
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
  subscriptionId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'subscriptions',
      key: 'id'
    },
    field: 'subscription_id'
  },
  stripePaymentIntentId: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    field: 'stripe_payment_intent_id'
  },
  stripeChargeId: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'stripe_charge_id'
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
  type: {
    type: DataTypes.ENUM('subscription', 'tournament_entry', 'court_booking', 'one_time', 'refund'),
    allowNull: false
  },
  relatedEntityType: {
    type: DataTypes.ENUM('tournament', 'court_booking', 'subscription'),
    allowNull: true,
    field: 'related_entity_type'
  },
  relatedEntityId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'related_entity_id'
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'succeeded', 'failed', 'canceled', 'requires_action'),
    allowNull: false,
    defaultValue: 'pending'
  },
  failureReason: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'failure_reason'
  },
  paymentMethod: {
    type: DataTypes.JSONB,
    allowNull: false,
    field: 'payment_method',
    validate: {
      isValidPaymentMethod(value: any) {
        if (!value || !value.type) {
          throw new Error('Payment method must have a type');
        }
        
        if (!['card', 'bank_account', 'wallet'].includes(value.type)) {
          throw new Error('Invalid payment method type');
        }
        
        if (value.type === 'card' && value.card) {
          if (!value.card.brand || !value.card.last4 || !value.card.expMonth || !value.card.expYear) {
            throw new Error('Card payment method must include brand, last4, expMonth, and expYear');
          }
        }
      }
    }
  },
  platformFee: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    },
    field: 'platform_fee',
    comment: 'Platform fee in cents'
  },
  stripeFee: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    },
    field: 'stripe_fee',
    comment: 'Stripe fee in cents'
  },
  netAmount: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    },
    field: 'net_amount',
    comment: 'Net amount after fees in cents'
  },
  refundedAmount: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    },
    field: 'refunded_amount',
    comment: 'Refunded amount in cents'
  },
  refundedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'refunded_at'
  },
  refundReason: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'refund_reason'
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
  webhookProcessed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'webhook_processed'
  },
  webhookData: {
    type: DataTypes.JSONB,
    allowNull: true,
    field: 'webhook_data'
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
  modelName: 'Payment',
  tableName: 'payments',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['subscription_id']
    },
    {
      fields: ['stripe_payment_intent_id'],
      unique: true
    },
    {
      fields: ['stripe_charge_id']
    },
    {
      fields: ['type']
    },
    {
      fields: ['status']
    },
    {
      fields: ['related_entity_type', 'related_entity_id']
    },
    {
      fields: ['webhook_processed']
    },
    {
      fields: ['created_at']
    },
    {
      fields: ['refunded_at']
    }
  ]
});

export default Payment;