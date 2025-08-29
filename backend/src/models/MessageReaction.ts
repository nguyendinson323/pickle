import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface MessageReactionAttributes {
  id: number;
  messageId: number;
  userId: number;
  reaction: string; // emoji or reaction type
  createdAt: Date;
  updatedAt: Date;
}

interface MessageReactionCreationAttributes extends Optional<MessageReactionAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class MessageReaction extends Model<MessageReactionAttributes, MessageReactionCreationAttributes> implements MessageReactionAttributes {
  public id!: number;
  public messageId!: number;
  public userId!: number;
  public reaction!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MessageReaction.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  messageId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'conversation_messages',
      key: 'id'
    },
    onDelete: 'CASCADE',
    field: 'message_id'
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
  reaction: {
    type: DataTypes.STRING(10),
    allowNull: false,
    validate: {
      len: [1, 10]
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
  modelName: 'MessageReaction',
  tableName: 'message_reactions',
  timestamps: true,
  indexes: [
    {
      fields: ['message_id']
    },
    {
      fields: ['user_id']
    },
    {
      unique: true,
      fields: ['message_id', 'user_id', 'reaction']
    }
  ]
});

export default MessageReaction;