import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface PlayerFinderMatchAttributes {
  id: number;
  requestId: number;
  playerId: number;
  matchScore: number; // compatibility score 0-100
  distance: number; // in kilometers
  status: string; // pending, accepted, declined, expired
  requestedAt: Date;
  respondedAt?: Date;
  message?: string;
  isViewed: boolean;
  matchReasons: string[]; // array of reasons why they matched
  createdAt: Date;
  updatedAt: Date;
}

interface PlayerFinderMatchCreationAttributes extends Optional<PlayerFinderMatchAttributes, 'id' | 'isViewed' | 'createdAt' | 'updatedAt'> {}

class PlayerFinderMatch extends Model<PlayerFinderMatchAttributes, PlayerFinderMatchCreationAttributes> implements PlayerFinderMatchAttributes {
  public id!: number;
  public requestId!: number;
  public playerId!: number;
  public matchScore!: number;
  public distance!: number;
  public status!: string;
  public requestedAt!: Date;
  public respondedAt?: Date;
  public message?: string;
  public isViewed!: boolean;
  public matchReasons!: string[];
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PlayerFinderMatch.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  requestId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'player_finder_requests',
      key: 'id'
    },
    onDelete: 'CASCADE',
    field: 'request_id'
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
  matchScore: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'match_score',
    validate: {
      min: 0,
      max: 100
    }
  },
  distance: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'pending',
    validate: {
      isIn: [['pending', 'accepted', 'declined', 'expired']]
    }
  },
  requestedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'requested_at'
  },
  respondedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'responded_at'
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isViewed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_viewed'
  },
  matchReasons: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
    field: 'match_reasons'
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
  modelName: 'PlayerFinderMatch',
  tableName: 'player_finder_matches',
  timestamps: true,
  indexes: [
    {
      fields: ['request_id']
    },
    {
      fields: ['player_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['match_score']
    },
    {
      fields: ['is_viewed']
    },
    {
      unique: true,
      fields: ['request_id', 'player_id']
    }
  ]
});

export default PlayerFinderMatch;