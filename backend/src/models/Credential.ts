import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export enum CredentialStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  SUSPENDED = 'suspended',
  REVOKED = 'revoked',
  PENDING = 'pending'
}

export enum CredentialType {
  PLAYER = 'player',
  COACH = 'coach',
  REFEREE = 'referee',
  CLUB_ADMIN = 'club_admin'
}

export enum AffiliationStatus {
  ACTIVE = 'ACTIVO',
  INACTIVE = 'INACTIVO',
  SUSPENDED = 'SUSPENDIDO',
  PENDING = 'PENDIENTE'
}

interface CredentialAttributes {
  id: string;
  userId: number;
  userType: CredentialType;
  federationName: string;
  federationLogo?: string;
  stateName: string;
  stateId: number;
  fullName: string;
  nrtpLevel?: string;
  affiliationStatus: AffiliationStatus;
  rankingPosition?: number;
  clubName?: string;
  licenseType?: string;
  qrCode: string;
  federationIdNumber: string;
  nationality: string;
  photo?: string;
  issuedDate: Date;
  expirationDate: Date;
  status: CredentialStatus;
  verificationUrl: string;
  checksum: string;
  lastVerified?: Date;
  verificationCount: number;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

interface CredentialCreationAttributes extends Optional<CredentialAttributes, 'verificationCount' | 'metadata' | 'createdAt' | 'updatedAt'> {}

class Credential extends Model<CredentialAttributes, CredentialCreationAttributes> implements CredentialAttributes {
  public id!: string;
  public userId!: number;
  public userType!: CredentialType;
  public federationName!: string;
  public federationLogo?: string;
  public stateName!: string;
  public stateId!: number;
  public fullName!: string;
  public nrtpLevel?: string;
  public affiliationStatus!: AffiliationStatus;
  public rankingPosition?: number;
  public clubName?: string;
  public licenseType?: string;
  public qrCode!: string;
  public federationIdNumber!: string;
  public nationality!: string;
  public photo?: string;
  public issuedDate!: Date;
  public expirationDate!: Date;
  public status!: CredentialStatus;
  public verificationUrl!: string;
  public checksum!: string;
  public lastVerified?: Date;
  public verificationCount!: number;
  public metadata!: Record<string, any>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Credential.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
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
  userType: {
    type: DataTypes.ENUM(...Object.values(CredentialType)),
    allowNull: false,
    field: 'user_type'
  },
  federationName: {
    type: DataTypes.STRING(200),
    allowNull: false,
    defaultValue: 'FEDERACIÓN MEXICANA DE PICKLEBALL',
    field: 'federation_name'
  },
  federationLogo: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'federation_logo'
  },
  stateName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'state_name'
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
  fullName: {
    type: DataTypes.STRING(200),
    allowNull: false,
    field: 'full_name'
  },
  nrtpLevel: {
    type: DataTypes.STRING(10),
    allowNull: true,
    field: 'nrtp_level'
  },
  affiliationStatus: {
    type: DataTypes.ENUM(...Object.values(AffiliationStatus)),
    allowNull: false,
    defaultValue: AffiliationStatus.ACTIVE,
    field: 'affiliation_status'
  },
  rankingPosition: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'ranking_position'
  },
  clubName: {
    type: DataTypes.STRING(200),
    allowNull: true,
    field: 'club_name'
  },
  licenseType: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'license_type'
  },
  qrCode: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'qr_code'
  },
  federationIdNumber: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    field: 'federation_id_number'
  },
  nationality: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: '🇲🇽 México'
  },
  photo: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  issuedDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'issued_date'
  },
  expirationDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'expiration_date'
  },
  status: {
    type: DataTypes.ENUM(...Object.values(CredentialStatus)),
    allowNull: false,
    defaultValue: CredentialStatus.ACTIVE
  },
  verificationUrl: {
    type: DataTypes.STRING(500),
    allowNull: false,
    field: 'verification_url'
  },
  checksum: {
    type: DataTypes.STRING(64),
    allowNull: false
  },
  lastVerified: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'last_verified'
  },
  verificationCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'verification_count'
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {}
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
  modelName: 'Credential',
  tableName: 'credentials',
  timestamps: true,
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['user_type']
    },
    {
      fields: ['federation_id_number']
    },
    {
      fields: ['status']
    },
    {
      fields: ['state_id']
    },
    {
      fields: ['expiration_date']
    },
    {
      fields: ['checksum']
    }
  ]
});

export default Credential;