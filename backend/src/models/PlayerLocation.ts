import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface PlayerLocationAttributes {
  id: number;
  playerId: number;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  zipCode?: string;
  country: string;
  isCurrentLocation: boolean;
  locationName?: string;
  radius: number; // in kilometers
  isPublic: boolean;
  accuracy?: number;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface PlayerLocationCreationAttributes extends Optional<PlayerLocationAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class PlayerLocation extends Model<PlayerLocationAttributes, PlayerLocationCreationAttributes> implements PlayerLocationAttributes {
  public id!: number;
  public playerId!: number;
  public latitude!: number;
  public longitude!: number;
  public address!: string;
  public city!: string;
  public state!: string;
  public zipCode?: string;
  public country!: string;
  public isCurrentLocation!: boolean;
  public locationName?: string;
  public radius!: number;
  public isPublic!: boolean;
  public accuracy?: number;
  public lastUpdated!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PlayerLocation.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  playerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'players',
      key: 'id'
    },
    onDelete: 'CASCADE',
    field: 'player_id'
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false,
    validate: {
      min: -90,
      max: 90
    }
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false,
    validate: {
      min: -180,
      max: 180
    }
  },
  address: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  state: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  zipCode: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'zip_code'
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'Mexico'
  },
  isCurrentLocation: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_current_location'
  },
  locationName: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'location_name'
  },
  radius: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10,
    validate: {
      min: 1,
      max: 100
    }
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_public'
  },
  accuracy: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  lastUpdated: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'last_updated'
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
  modelName: 'PlayerLocation',
  tableName: 'player_locations',
  timestamps: true,
  indexes: [
    {
      fields: ['player_id']
    },
    {
      fields: ['latitude', 'longitude']
    },
    {
      fields: ['city', 'state']
    },
    {
      fields: ['is_current_location']
    },
    {
      fields: ['is_public']
    }
  ]
});

export default PlayerLocation;