import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface StateCommitteeAttributes {
  id: number;
  userId: number;
  name: string;
  rfc?: string;
  presidentName: string;
  presidentTitle: string;
  institutionalEmail: string;
  phone?: string;
  stateId: number;
  affiliateType?: string;
  website?: string;
  socialMedia?: any;
  logoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface StateCommitteeCreationAttributes extends Optional<StateCommitteeAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class StateCommittee extends Model<StateCommitteeAttributes, StateCommitteeCreationAttributes> implements StateCommitteeAttributes {
  public id!: number;
  public userId!: number;
  public name!: string;
  public rfc?: string;
  public presidentName!: string;
  public presidentTitle!: string;
  public institutionalEmail!: string;
  public phone?: string;
  public stateId!: number;
  public affiliateType?: string;
  public website?: string;
  public socialMedia?: any;
  public logoUrl?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

StateCommittee.init({
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
  presidentName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'president_name'
  },
  presidentTitle: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'president_title'
  },
  institutionalEmail: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'institutional_email'
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
  affiliateType: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'affiliate_type'
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
  modelName: 'StateCommittee',
  tableName: 'state_committees',
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

export default StateCommittee;