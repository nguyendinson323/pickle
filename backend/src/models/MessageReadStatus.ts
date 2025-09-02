import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface MessageReadStatusAttributes {
  id: number;
  messageId: number;
  userId: number;
  readAt: Date;
}

interface MessageReadStatusCreationAttributes extends Optional<MessageReadStatusAttributes, 'id'> {}

class MessageReadStatus extends Model<MessageReadStatusAttributes, MessageReadStatusCreationAttributes> implements MessageReadStatusAttributes {
  public id!: number;
  public messageId!: number;
  public userId!: number;
  public readAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MessageReadStatus.init({
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
  readAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'read_at'
  }
}, {
  sequelize,
  modelName: 'MessageReadStatus',
  tableName: 'message_read_status',
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
      fields: ['message_id', 'user_id']
    }
  ]
});

export default MessageReadStatus;