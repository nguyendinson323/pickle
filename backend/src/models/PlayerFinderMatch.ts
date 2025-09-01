import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface PlayerFinderMatchAttributes {
  id: number;
  requestId: number;
  matchedUserId: number;
  distance: number;
  compatibilityScore: number;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  responseMessage?: string;
  matchedAt: Date;
  respondedAt?: Date;
  contactShared: boolean;
}

interface PlayerFinderMatchCreationAttributes 
  extends Optional<PlayerFinderMatchAttributes, 'id' | 'contactShared'> {}

class PlayerFinderMatch extends Model<
  PlayerFinderMatchAttributes,
  PlayerFinderMatchCreationAttributes
> implements PlayerFinderMatchAttributes {
  public id!: number;
  public requestId!: number;
  public matchedUserId!: number;
  public distance!: number;
  public compatibilityScore!: number;
  public status!: 'pending' | 'accepted' | 'declined' | 'expired';
  public responseMessage?: string;
  public matchedAt!: Date;
  public respondedAt?: Date;
  public contactShared!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PlayerFinderMatch.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  requestId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'player_finder_requests',
      key: 'id'
    },
    field: 'request_id'
  },
  matchedUserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    field: 'matched_user_id'
  },
  distance: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
      max: 1000
    }
  },
  compatibilityScore: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 100
    },
    field: 'compatibility_score'
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'declined', 'expired'),
    allowNull: false,
    defaultValue: 'pending'
  },
  responseMessage: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 500]
    },
    field: 'response_message'
  },
  matchedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'matched_at'
  },
  respondedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'responded_at'
  },
  contactShared: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'contact_shared'
  }
}, {
  sequelize,
  tableName: 'player_finder_matches',
  modelName: 'PlayerFinderMatch',
  timestamps: true,
  indexes: [
    {
      fields: ['request_id']
    },
    {
      fields: ['matched_user_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['matched_at']
    },
    {
      fields: ['compatibility_score']
    },
    {
      unique: true,
      fields: ['request_id', 'matched_user_id']
    }
  ]
});

export default PlayerFinderMatch;