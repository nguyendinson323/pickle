import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

type MembershipStatus = 'active' | 'expired' | 'cancelled' | 'pending';

interface MembershipAttributes {
  id: number;
  userId: number;
  membershipPlanId: number;
  status: MembershipStatus;
  startDate: Date;
  endDate: Date;
  isAutoRenew: boolean;
  stripeSubscriptionId?: string;
  lastPaymentId?: number;
  renewalReminderSent: boolean;
  expirationReminderSent: boolean;
  cancelledAt?: Date;
  cancelReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface MembershipCreationAttributes extends Optional<MembershipAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Membership extends Model<MembershipAttributes, MembershipCreationAttributes> implements MembershipAttributes {
  public id!: number;
  public userId!: number;
  public membershipPlanId!: number;
  public status!: MembershipStatus;
  public startDate!: Date;
  public endDate!: Date;
  public isAutoRenew!: boolean;
  public stripeSubscriptionId?: string;
  public lastPaymentId?: number;
  public renewalReminderSent!: boolean;
  public expirationReminderSent!: boolean;
  public cancelledAt?: Date;
  public cancelReason?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Membership.init({
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
    allowNull: false,
    references: { model: 'membership_plans', key: 'id' },
    field: 'membership_plan_id'
  },
  status: {
    type: DataTypes.ENUM('active', 'expired', 'cancelled', 'pending'),
    allowNull: false,
    defaultValue: 'pending'
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'start_date'
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'end_date'
  },
  isAutoRenew: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_auto_renew'
  },
  stripeSubscriptionId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'stripe_subscription_id'
  },
  lastPaymentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'payments', key: 'id' },
    field: 'last_payment_id'
  },
  renewalReminderSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'renewal_reminder_sent'
  },
  expirationReminderSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'expiration_reminder_sent'
  },
  cancelledAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'cancelled_at'
  },
  cancelReason: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'cancel_reason'
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
  modelName: 'Membership',
  tableName: 'memberships',
  timestamps: true,
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['end_date']
    },
    {
      fields: ['stripe_subscription_id']
    }
  ]
});

export default Membership;