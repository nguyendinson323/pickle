import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface MessageReactionAttributes {
  id: number;
  messageId: number;
  userId: number;
  reaction: string; // emoji or reaction type
}

interface MessageReactionCreationAttributes extends Optional<MessageReactionAttributes, 'id'> {}

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
  }
}, {
  sequelize,
  modelName: 'MessageReaction',
  tableName: 'message_reactions',
  timestamps: true,
  underscored: true,
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