import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface PlayerFinderRequestAttributes {
  id: number;
  requesterId: number;
  title: string;
  description: string;
  skillLevel: string; // beginner, intermediate, advanced, pro
  preferredGender?: string; // any, male, female
  ageRangeMin?: number;
  ageRangeMax?: number;
  playingStyle?: string; // casual, competitive, training
  maxDistance: number; // in kilometers
  locationId: number; // reference to PlayerLocation
  availabilityDays: string[]; // array of days: monday, tuesday, etc.
  availabilityTimeStart?: string; // HH:MM format
  availabilityTimeEnd?: string; // HH:MM format
  maxPlayers: number;
  currentPlayers: number;
  isActive: boolean;
  expiresAt?: Date;
  preferences: Record<string, any>; // JSON object for flexible preferences
  status: string; // active, paused, completed, cancelled
  createdAt: Date;
  updatedAt: Date;
}

interface PlayerFinderRequestCreationAttributes extends Optional<PlayerFinderRequestAttributes, 'id' | 'currentPlayers' | 'createdAt' | 'updatedAt'> {}

class PlayerFinderRequest extends Model<PlayerFinderRequestAttributes, PlayerFinderRequestCreationAttributes> implements PlayerFinderRequestAttributes {
  public id!: number;
  public requesterId!: number;
  public title!: string;
  public description!: string;
  public skillLevel!: string;
  public preferredGender?: string;
  public ageRangeMin?: number;
  public ageRangeMax?: number;
  public playingStyle?: string;
  public maxDistance!: number;
  public locationId!: number;
  public availabilityDays!: string[];
  public availabilityTimeStart?: string;
  public availabilityTimeEnd?: string;
  public maxPlayers!: number;
  public currentPlayers!: number;
  public isActive!: boolean;
  public expiresAt?: Date;
  public preferences!: Record<string, any>;
  public status!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PlayerFinderRequest.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  requesterId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'players',
      key: 'id'
    },
    onDelete: 'CASCADE',
    field: 'requester_id'
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  skillLevel: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: 'skill_level',
    validate: {
      isIn: [['beginner', 'intermediate', 'advanced', 'pro']]
    }
  },
  preferredGender: {
    type: DataTypes.STRING(10),
    allowNull: true,
    field: 'preferred_gender',
    validate: {
      isIn: [['any', 'male', 'female']]
    }
  },
  ageRangeMin: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'age_range_min',
    validate: {
      min: 13,
      max: 100
    }
  },
  ageRangeMax: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'age_range_max',
    validate: {
      min: 13,
      max: 100
    }
  },
  playingStyle: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'playing_style',
    validate: {
      isIn: [['casual', 'competitive', 'training']]
    }
  },
  maxDistance: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 25,
    field: 'max_distance',
    validate: {
      min: 1,
      max: 100
    }
  },
  locationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'player_locations',
      key: 'id'
    },
    onDelete: 'CASCADE',
    field: 'location_id'
  },
  availabilityDays: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
    field: 'availability_days'
  },
  availabilityTimeStart: {
    type: DataTypes.TIME,
    allowNull: true,
    field: 'availability_time_start'
  },
  availabilityTimeEnd: {
    type: DataTypes.TIME,
    allowNull: true,
    field: 'availability_time_end'
  },
  maxPlayers: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 4,
    field: 'max_players',
    validate: {
      min: 2,
      max: 20
    }
  },
  currentPlayers: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    field: 'current_players',
    validate: {
      min: 1
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
    allowNull: true,
    field: 'expires_at'
  },
  preferences: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {}
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'active',
    validate: {
      isIn: [['active', 'paused', 'completed', 'cancelled']]
    }
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
  modelName: 'PlayerFinderRequest',
  tableName: 'player_finder_requests',
  timestamps: true,
  indexes: [
    {
      fields: ['requester_id']
    },
    {
      fields: ['skill_level']
    },
    {
      fields: ['location_id']
    },
    {
      fields: ['is_active']
    },
    {
      fields: ['status']
    },
    {
      fields: ['expires_at']
    }
  ]
});

export default PlayerFinderRequest;