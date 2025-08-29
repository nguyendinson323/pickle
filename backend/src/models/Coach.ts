import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface CoachAttributes {
  id: number;
  userId: number;
  fullName: string;
  dateOfBirth: Date;
  gender: string;
  stateId: number;
  curp?: string;
  nrtpLevel?: string;
  mobilePhone?: string;
  profilePhotoUrl?: string;
  idDocumentUrl?: string;
  nationality: string;
  licenseType?: string;
  rankingPosition?: number;
  federationIdNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CoachCreationAttributes extends Optional<CoachAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Coach extends Model<CoachAttributes, CoachCreationAttributes> implements CoachAttributes {
  public id!: number;
  public userId!: number;
  public fullName!: string;
  public dateOfBirth!: Date;
  public gender!: string;
  public stateId!: number;
  public curp?: string;
  public nrtpLevel?: string;
  public mobilePhone?: string;
  public profilePhotoUrl?: string;
  public idDocumentUrl?: string;
  public nationality!: string;
  public licenseType?: string;
  public rankingPosition?: number;
  public federationIdNumber?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Coach.init({
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
  fullName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'full_name'
  },
  dateOfBirth: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'date_of_birth'
  },
  gender: {
    type: DataTypes.STRING(20),
    allowNull: false
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
  curp: {
    type: DataTypes.STRING(18),
    allowNull: true,
    unique: true
  },
  nrtpLevel: {
    type: DataTypes.STRING(10),
    allowNull: true,
    field: 'nrtp_level'
  },
  mobilePhone: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'mobile_phone'
  },
  profilePhotoUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'profile_photo_url'
  },
  idDocumentUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'id_document_url'
  },
  nationality: {
    type: DataTypes.STRING(50),
    defaultValue: 'Mexican'
  },
  licenseType: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'license_type'
  },
  rankingPosition: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'ranking_position'
  },
  federationIdNumber: {
    type: DataTypes.STRING(20),
    allowNull: true,
    unique: true,
    field: 'federation_id_number'
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
  modelName: 'Coach',
  tableName: 'coaches',
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

export default Coach;