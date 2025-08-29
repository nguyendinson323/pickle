import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

type PaymentStatus = 'pending' | 'completed' | 'succeeded' | 'failed' | 'cancelled' | 'refunded' | 'disputed';
type PaymentType = 'membership' | 'upgrade' | 'renewal' | 'tournament' | 'court_rental' | 'certification';

interface PaymentAttributes {
  id: number;
  userId: number;
  membershipPlanId?: number;
  paymentType: PaymentType;
  status: PaymentStatus;
  amount: number;
  currency: string;
  stripePaymentIntentId: string;
  stripeCustomerId?: string;
  stripeChargeId?: string;
  paymentMethod: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  description: string;
  referenceId?: number;
  referenceType?: string;
  metadata: any;
  paidAt?: Date;
  refundedAt?: Date;
  refundAmount?: number;
  failureReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface PaymentCreationAttributes extends Optional<PaymentAttributes, 'id' | 'createdAt' | 'updatedAt' | 'description' | 'subtotal'> {}

class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
  public id!: number;
  public userId!: number;
  public membershipPlanId?: number;
  public paymentType!: PaymentType;
  public status!: PaymentStatus;
  public amount!: number;
  public currency!: string;
  public stripePaymentIntentId!: string;
  public stripeCustomerId?: string;
  public stripeChargeId?: string;
  public paymentMethod!: string;
  public subtotal!: number;
  public taxAmount!: number;
  public totalAmount!: number;
  public description!: string;
  public referenceId?: number;
  public referenceType?: string;
  public metadata!: any;
  public paidAt?: Date;
  public refundedAt?: Date;
  public refundAmount?: number;
  public failureReason?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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
    references: { model: 'users', key: 'id' },
    field: 'user_id'
  },
  membershipPlanId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'membership_plans', key: 'id' },
    field: 'membership_plan_id'
  },
  paymentType: {
    type: DataTypes.ENUM('membership', 'upgrade', 'renewal', 'tournament', 'court_rental', 'certification'),
    allowNull: false,
    field: 'payment_type'
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
  stripePaymentIntentId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'stripe_payment_intent_id'
  },
  stripeCustomerId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'stripe_customer_id'
  },
  stripeChargeId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'stripe_charge_id'
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'card',
    field: 'payment_method'
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  taxAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'tax_amount'
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'total_amount'
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ''
  },
  referenceId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'reference_id'
  },
  referenceType: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'reference_type'
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {}
  },
  paidAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'paid_at'
  },
  refundedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'refunded_at'
  },
  refundAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    field: 'refund_amount'
  },
  failureReason: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'failure_reason'
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
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['payment_type']
    },
    {
      fields: ['stripe_payment_intent_id']
    },
    {
      fields: ['created_at']
    }
  ]
});

export default Payment;