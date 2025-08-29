import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ConversationMessageAttributes {
  id: number;
  conversationId: number;
  senderId: number;
  content: string;
  messageType: string; // text, image, file, system, location, finder_invitation
  replyToId?: number; // for threaded replies
  attachments?: string[];
  metadata: Record<string, any>; // flexible data for different message types
  isEdited: boolean;
  editedAt?: Date;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface ConversationMessageCreationAttributes extends Optional<ConversationMessageAttributes, 'id' | 'replyToId' | 'attachments' | 'metadata' | 'isEdited' | 'editedAt' | 'isDeleted' | 'deletedAt' | 'createdAt' | 'updatedAt'> {}

class ConversationMessage extends Model<ConversationMessageAttributes, ConversationMessageCreationAttributes> implements ConversationMessageAttributes {
  public id!: number;
  public conversationId!: number;
  public senderId!: number;
  public content!: string;
  public messageType!: string;
  public replyToId?: number;
  public attachments?: string[];
  public metadata!: Record<string, any>;
  public isEdited!: boolean;
  public editedAt?: Date;
  public isDeleted!: boolean;
  public deletedAt?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ConversationMessage.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  conversationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'conversations',
      key: 'id'
    },
    onDelete: 'CASCADE',
    field: 'conversation_id'
  },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    field: 'sender_id'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  messageType: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'text',
    field: 'message_type',
    validate: {
      isIn: [['text', 'image', 'file', 'system', 'location', 'finder_invitation']]
    }
  },
  replyToId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'conversation_messages',
      key: 'id'
    },
    field: 'reply_to_id'
  },
  attachments: {
    type: DataTypes.JSON,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {}
  },
  isEdited: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_edited'
  },
  editedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'edited_at'
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_deleted'
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'deleted_at'
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
  modelName: 'ConversationMessage',
  tableName: 'conversation_messages',
  timestamps: true,
  indexes: [
    {
      fields: ['conversation_id']
    },
    {
      fields: ['sender_id']
    },
    {
      fields: ['reply_to_id']
    },
    {
      fields: ['created_at']
    },
    {
      fields: ['is_deleted']
    }
  ]
});

export default ConversationMessage;