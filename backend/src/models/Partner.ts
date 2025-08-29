import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface PartnerAttributes {
  id: number;
  userId: number;
  businessName: string;
  rfc?: string;
  contactPersonName: string;
  contactPersonTitle: string;
  email: string;
  phone?: string;
  partnerType: string;
  website?: string;
  socialMedia?: any;
  logoUrl?: string;
  planType: 'premium';
  createdAt: Date;
  updatedAt: Date;
}

interface PartnerCreationAttributes extends Optional<PartnerAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Partner extends Model<PartnerAttributes, PartnerCreationAttributes> implements PartnerAttributes {
  public id!: number;
  public userId!: number;
  public businessName!: string;
  public rfc?: string;
  public contactPersonName!: string;
  public contactPersonTitle!: string;
  public email!: string;
  public phone?: string;
  public partnerType!: string;
  public website?: string;
  public socialMedia?: any;
  public logoUrl?: string;
  public planType!: 'premium';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Partner.init({
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
    onDelete: 'CASCADE',
    field: 'user_id'
  },
  businessName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'business_name'
  },
  rfc: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  contactPersonName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'contact_person_name'
  },
  contactPersonTitle: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'contact_person_title'
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  partnerType: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'partner_type'
  },
  website: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  socialMedia: {
    type: DataTypes.JSONB,
    allowNull: true,
    field: 'social_media'
  },
  logoUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'logo_url'
  },
  planType: {
    type: DataTypes.ENUM('premium'),
    defaultValue: 'premium',
    field: 'plan_type'
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
  modelName: 'Partner',
  tableName: 'partners',
  timestamps: true,
  indexes: [
    {
      fields: ['user_id']
    }
  ]
});

export default Partner;