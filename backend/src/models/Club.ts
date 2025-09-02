import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ClubAttributes {
  id: number;
  userId: number;
  name: string;
  rfc?: string;
  managerName: string;
  managerRole: string;
  contactEmail: string;
  phone?: string;
  stateId: number;
  clubType?: string;
  website?: string;
  socialMedia?: any;
  logoUrl?: string;
  hasCourts: boolean;
  planType: 'basic' | 'premium';
  createdAt: Date;
  updatedAt: Date;
}

interface ClubCreationAttributes extends Optional<ClubAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Club extends Model<ClubAttributes, ClubCreationAttributes> implements ClubAttributes {
  public id!: number;
  public userId!: number;
  public name!: string;
  public rfc?: string;
  public managerName!: string;
  public managerRole!: string;
  public contactEmail!: string;
  public phone?: string;
  public stateId!: number;
  public clubType?: string;
  public website?: string;
  public socialMedia?: any;
  public logoUrl?: string;
  public hasCourts!: boolean;
  public planType!: 'basic' | 'premium';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Club.init({
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
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  rfc: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  managerName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'manager_name'
  },
  managerRole: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'manager_role'
  },
  contactEmail: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'contact_email'
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  stateId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'states',
      key: 'id'
    },
    field: 'state_id'
  },
  clubType: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'club_type'
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
  hasCourts: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'has_courts'
  },
  planType: {
    type: DataTypes.ENUM('basic', 'premium'),
    allowNull: false,
    defaultValue: 'basic',
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
  modelName: 'Club',
  tableName: 'clubs',
  timestamps: true,
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['state_id']
    }
  ]
});

export default Club;