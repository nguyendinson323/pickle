import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ConversationAttributes {
  id: number;
  name?: string; // for group conversations
  type: string; // direct, group, tournament, finder_request
  participantIds: number[]; // array of user IDs
  creatorId: number;
  lastMessageId?: number;
  lastMessageAt?: Date;
  isArchived: boolean;
  metadata: Record<string, any>; // flexible data for different conversation types
  createdAt: Date;
  updatedAt: Date;
}

interface ConversationCreationAttributes extends Optional<ConversationAttributes, 'id' | 'lastMessageId' | 'lastMessageAt' | 'isArchived' | 'metadata' | 'createdAt' | 'updatedAt'> {}

class Conversation extends Model<ConversationAttributes, ConversationCreationAttributes> implements ConversationAttributes {
  public id!: number;
  public name?: string;
  public type!: string;
  public participantIds!: number[];
  public creatorId!: number;
  public lastMessageId?: number;
  public lastMessageAt?: Date;
  public isArchived!: boolean;
  public metadata!: Record<string, any>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Conversation.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  type: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      isIn: [['direct', 'group', 'tournament', 'finder_request']]
    }
  },
  participantIds: {
    type: DataTypes.JSON,
    allowNull: false,
    field: 'participant_ids'
  },
  creatorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    field: 'creator_id'
  },
  lastMessageId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'messages',
      key: 'id'
    },
    field: 'last_message_id'
  },
  lastMessageAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'last_message_at'
  },
  isArchived: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_archived'
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
  modelName: 'Conversation',
  tableName: 'conversations',
  timestamps: true,
  indexes: [
    {
      fields: ['creator_id']
    },
    {
      fields: ['type']
    },
    {
      fields: ['last_message_at']
    },
    {
      fields: ['is_archived']
    }
  ]
});

export default Conversation;