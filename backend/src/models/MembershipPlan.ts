import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { UserRole } from '../types/auth';

interface MembershipPlanAttributes {
  id: number;
  name: string;
  role: UserRole;
  planType: 'basic' | 'premium';
  annualFee: number;
  monthlyFee: number;
  features: string[];
  stripePriceId: string;
  description: string;
  isActive: boolean;
}

interface MembershipPlanCreationAttributes extends Optional<MembershipPlanAttributes, 'id'> {}

class MembershipPlan extends Model<MembershipPlanAttributes, MembershipPlanCreationAttributes> implements MembershipPlanAttributes {
  public id!: number;
  public name!: string;
  public role!: UserRole;
  public planType!: 'basic' | 'premium';
  public annualFee!: number;
  public monthlyFee!: number;
  public features!: string[];
  public stripePriceId!: string;
  public description!: string;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MembershipPlan.init({
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
  planType: {
    type: DataTypes.ENUM('basic', 'premium'),
    allowNull: false,
    field: 'plan_type'
  },
  annualFee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'annual_fee'
  },
  monthlyFee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'monthly_fee'
  },
  features: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  stripePriceId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'stripe_price_id'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  },
}, {
  sequelize,
  modelName: 'MembershipPlan',
  tableName: 'membership_plans',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['role']
    },
    {
      fields: ['plan_type']
    },
    {
      fields: ['is_active']
    }
  ]
});

export default MembershipPlan;