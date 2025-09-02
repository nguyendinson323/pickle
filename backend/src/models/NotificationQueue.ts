import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface NotificationQueueAttributes {
  id: number;
  userId: number;
  type: string; // email, sms, push
  template: string; // notification template name
  recipient: string; // email address or phone number
  subject?: string;
  content: string;
  data: Record<string, any>; // template data
  status: string; // pending, sent, failed, cancelled
  priority: number; // 1-5, 1 being highest
  scheduledAt?: Date;
  sentAt?: Date;
  failedAt?: Date;
  retryCount: number;
  maxRetries: number;
  errorMessage?: string;
}

interface NotificationQueueCreationAttributes extends Optional<NotificationQueueAttributes, 'id' | 'retryCount' | 'maxRetries'> {}

class NotificationQueue extends Model<NotificationQueueAttributes, NotificationQueueCreationAttributes> implements NotificationQueueAttributes {
  public id!: number;
  public userId!: number;
  public type!: string;
  public template!: string;
  public recipient!: string;
  public subject?: string;
  public content!: string;
  public data!: Record<string, any>;
  public status!: string;
  public priority!: number;
  public scheduledAt?: Date;
  public sentAt?: Date;
  public failedAt?: Date;
  public retryCount!: number;
  public maxRetries!: number;
  public errorMessage?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

NotificationQueue.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    field: 'user_id'
  },
  type: {
    type: DataTypes.STRING(10),
    allowNull: false,
    validate: {
      isIn: [['email', 'sms', 'push']]
    }
  },
  template: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  recipient: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  subject: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  data: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {}
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'pending',
    validate: {
      isIn: [['pending', 'sent', 'failed', 'cancelled']]
    }
  },
  priority: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 3,
    validate: {
      min: 1,
      max: 5
    }
  },
  scheduledAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'scheduled_at'
  },
  sentAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'sent_at'
  },
  failedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'failed_at'
  },
  retryCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'retry_count'
  },
  maxRetries: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 3,
    field: 'max_retries'
  },
  errorMessage: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'error_message'
  }
}, {
  sequelize,
  modelName: 'NotificationQueue',
  tableName: 'notification_queue',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['type']
    },
    {
      fields: ['priority']
    },
    {
      fields: ['scheduled_at']
    },
    {
      fields: ['created_at']
    }
  ]
});

export default NotificationQueue;