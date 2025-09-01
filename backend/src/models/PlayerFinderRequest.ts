import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface PlayerFinderRequestAttributes {
  id: number;
  requesterId: number;
  locationId: number;
  nrtpLevelMin?: string;
  nrtpLevelMax?: string;
  preferredGender?: 'male' | 'female' | 'any';
  preferredAgeMin?: number;
  preferredAgeMax?: number;
  searchRadius: number;
  availableTimeSlots: object; // JSON with time preferences
  message?: string;
  isActive: boolean;
  expiresAt: Date;
}

interface PlayerFinderRequestCreationAttributes 
  extends Optional<PlayerFinderRequestAttributes, 'id'> {}

class PlayerFinderRequest extends Model<
  PlayerFinderRequestAttributes,
  PlayerFinderRequestCreationAttributes
> implements PlayerFinderRequestAttributes {
  public id!: number;
  public requesterId!: number;
  public locationId!: number;
  public nrtpLevelMin?: string;
  public nrtpLevelMax?: string;
  public preferredGender?: 'male' | 'female' | 'any';
  public preferredAgeMin?: number;
  public preferredAgeMax?: number;
  public searchRadius!: number;
  public availableTimeSlots!: object;
  public message?: string;
  public isActive!: boolean;
  public expiresAt!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PlayerFinderRequest.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  requesterId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    field: 'requester_id'
  },
  locationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'player_locations',
      key: 'id'
    },
    field: 'location_id'
  },
  nrtpLevelMin: {
    type: DataTypes.STRING(10),
    allowNull: true,
    field: 'nrtp_level_min'
  },
  nrtpLevelMax: {
    type: DataTypes.STRING(10),
    allowNull: true,
    field: 'nrtp_level_max'
  },
  preferredGender: {
    type: DataTypes.ENUM('male', 'female', 'any'),
    allowNull: true,
    defaultValue: 'any',
    field: 'preferred_gender'
  },
  preferredAgeMin: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 18,
      max: 100
    },
    field: 'preferred_age_min'
  },
  preferredAgeMax: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 18,
      max: 100
    },
    field: 'preferred_age_max'
  },
  searchRadius: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 25,
    validate: {
      min: 5,
      max: 100
    },
    field: 'search_radius'
  },
  availableTimeSlots: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {},
    field: 'available_time_slots'
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 500]
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active'
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'expires_at'
  }
}, {
  sequelize,
  tableName: 'player_finder_requests',
  modelName: 'PlayerFinderRequest',
  timestamps: true,
  indexes: [
    {
      fields: ['requester_id']
    },
    {
      fields: ['location_id']
    },
    {
      fields: ['is_active', 'expires_at']
    },
    {
      fields: ['preferred_gender']
    },
    {
      fields: ['nrtp_level_min', 'nrtp_level_max']
    }
  ]
});

export default PlayerFinderRequest;