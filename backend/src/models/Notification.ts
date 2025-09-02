import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface NotificationAttributes {
  id: number;
  userId: number;
  type: 'system' | 'tournament' | 'booking' | 'message' | 'match' | 'payment' | 'maintenance';
  category: 'info' | 'success' | 'warning' | 'error' | 'urgent';
  
  // Notification content
  title: string;
  message: string;
  actionText?: string;
  actionUrl?: string;
  
  // Related data
  relatedEntityType?: string; // 'tournament', 'booking', 'message', etc.
  relatedEntityId?: number;
  metadata?: Record<string, any>;
  
  // Status
  isRead: boolean;
  readAt?: Date;
  
  // Delivery channels
  channels: {
    inApp: boolean;
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  
  // Delivery status
  deliveryStatus: {
    inApp: { delivered: boolean; deliveredAt?: Date };
    email: { delivered: boolean; deliveredAt?: Date; error?: string };
    sms: { delivered: boolean; deliveredAt?: Date; error?: string };
    push: { delivered: boolean; deliveredAt?: Date; error?: string };
  };
  
  // Scheduling
  scheduledFor?: Date;
  isScheduled: boolean;
  
  // Expiry
  expiresAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

interface NotificationCreationAttributes extends Optional<NotificationAttributes, 'id' | 'actionText' | 'actionUrl' | 'relatedEntityType' | 'relatedEntityId' | 'metadata' | 'readAt' | 'scheduledFor' | 'expiresAt' | 'createdAt' | 'updatedAt'> {}

class Notification extends Model<NotificationAttributes, NotificationCreationAttributes> implements NotificationAttributes {
  public id!: number;
  public userId!: number;
  public type!: 'system' | 'tournament' | 'booking' | 'message' | 'match' | 'payment' | 'maintenance';
  public category!: 'info' | 'success' | 'warning' | 'error' | 'urgent';
  
  public title!: string;
  public message!: string;
  public actionText?: string;
  public actionUrl?: string;
  
  public relatedEntityType?: string;
  public relatedEntityId?: number;
  public metadata?: Record<string, any>;
  
  public isRead!: boolean;
  public readAt?: Date;
  
  public channels!: {
    inApp: boolean;
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  
  public deliveryStatus!: {
    inApp: { delivered: boolean; deliveredAt?: Date };
    email: { delivered: boolean; deliveredAt?: Date; error?: string };
    sms: { delivered: boolean; deliveredAt?: Date; error?: string };
    push: { delivered: boolean; deliveredAt?: Date; error?: string };
  };
  
  public scheduledFor?: Date;
  public isScheduled!: boolean;
  public expiresAt?: Date;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Association properties
  public user?: any;
}

Notification.init({
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
    type: DataTypes.ENUM('system', 'tournament', 'booking', 'message', 'match', 'payment', 'maintenance'),
    allowNull: false,
    defaultValue: 'system'
  },
  category: {
    type: DataTypes.ENUM('info', 'success', 'warning', 'error', 'urgent'),
    allowNull: false,
    defaultValue: 'info'
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 255]
    }
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 2000]
    }
  },
  actionText: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'action_text',
    validate: {
      len: [1, 100]
    }
  },
  actionUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'action_url'
  },
  relatedEntityType: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'related_entity_type'
  },
  relatedEntityId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'related_entity_id'
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_read'
  },
  readAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'read_at'
  },
  channels: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {
      inApp: true,
      email: false,
      sms: false,
      push: false
    },
    validate: {
      isValidChannels(value: any) {
        if (!value || typeof value !== 'object') {
          throw new Error('Channels must be an object');
        }
        const requiredFields = ['inApp', 'email', 'sms', 'push'];
        for (const field of requiredFields) {
          if (typeof value[field] !== 'boolean') {
            throw new Error(`Channel ${field} must be a boolean`);
          }
        }
      }
    }
  },
  deliveryStatus: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {
      inApp: { delivered: false },
      email: { delivered: false },
      sms: { delivered: false },
      push: { delivered: false }
    },
    field: 'delivery_status',
    validate: {
      isValidDeliveryStatus(value: any) {
        if (!value || typeof value !== 'object') {
          throw new Error('Delivery status must be an object');
        }
        const channels = ['inApp', 'email', 'sms', 'push'];
        for (const channel of channels) {
          if (!value[channel] || typeof value[channel].delivered !== 'boolean') {
            throw new Error(`Delivery status for ${channel} must include delivered boolean`);
          }
        }
      }
    }
  },
  scheduledFor: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'scheduled_for'
  },
  isScheduled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_scheduled'
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'expires_at'
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
  modelName: 'Notification',
  tableName: 'notifications',
  timestamps: true,
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['type']
    },
    {
      fields: ['category']
    },
    {
      fields: ['is_read']
    },
    {
      fields: ['is_scheduled']
    },
    {
      fields: ['scheduled_for']
    },
    {
      fields: ['expires_at']
    },
    {
      fields: ['created_at']
    },
    {
      fields: ['related_entity_type', 'related_entity_id']
    }
  ]
});

export default Notification;