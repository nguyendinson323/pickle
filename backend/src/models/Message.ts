import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface MessageAttributes {
  id: number;
  conversationId: number;
  senderId: number;
  content: string;
  messageType: 'text' | 'image' | 'file' | 'system' | 'location' | 'match_invite';
  
  // File attachments
  attachments?: {
    type: 'image' | 'file';
    url: string;
    filename: string;
    size: number;
  }[];
  
  // Location sharing
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  
  // Match invitation
  matchInvite?: {
    courtId: number;
    facilityId: number;
    proposedTime: Date;
    duration: number;
  };
  
  // Message status
  isEdited: boolean;
  editedAt?: Date;
  isDeleted: boolean;
  deletedAt?: Date;
  
  // Read receipts
  readBy: {
    userId: number;
    readAt: Date;
  }[];
  
  // Reactions
  reactions: {
    userId: number;
    emoji: string;
    createdAt: Date;
  }[];
}

interface MessageCreationAttributes extends Optional<MessageAttributes, 'id' | 'attachments' | 'location' | 'matchInvite' | 'editedAt' | 'deletedAt'> {}

class Message extends Model<MessageAttributes, MessageCreationAttributes> implements MessageAttributes {
  public id!: number;
  public conversationId!: number;
  public senderId!: number;
  public content!: string;
  public messageType!: 'text' | 'image' | 'file' | 'system' | 'location' | 'match_invite';
  
  public attachments?: {
    type: 'image' | 'file';
    url: string;
    filename: string;
    size: number;
  }[];
  
  public location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  
  public matchInvite?: {
    courtId: number;
    facilityId: number;
    proposedTime: Date;
    duration: number;
  };
  
  public isEdited!: boolean;
  public editedAt?: Date;
  public isDeleted!: boolean;
  public deletedAt?: Date;
  
  public readBy!: {
    userId: number;
    readAt: Date;
  }[];
  
  public reactions!: {
    userId: number;
    emoji: string;
    createdAt: Date;
  }[];
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Association properties
  public sender?: any;
  public conversation?: any;
}

Message.init({
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
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 10000]
    }
  },
  messageType: {
    type: DataTypes.ENUM('text', 'image', 'file', 'system', 'location', 'match_invite'),
    allowNull: false,
    defaultValue: 'text',
    field: 'message_type'
  },
  attachments: {
    type: DataTypes.JSONB,
    allowNull: true,
    validate: {
      isValidAttachments(value: any) {
        if (value && Array.isArray(value)) {
          for (const attachment of value) {
            if (!attachment.type || !attachment.url || !attachment.filename) {
              throw new Error('Invalid attachment structure');
            }
            if (!['image', 'file'].includes(attachment.type)) {
              throw new Error('Attachment type must be image or file');
            }
          }
        }
      }
    }
  },
  location: {
    type: DataTypes.JSONB,
    allowNull: true,
    validate: {
      isValidLocation(value: any) {
        if (value) {
          if (typeof value.latitude !== 'number' || typeof value.longitude !== 'number') {
            throw new Error('Location must include valid latitude and longitude');
          }
          if (value.latitude < -90 || value.latitude > 90) {
            throw new Error('Latitude must be between -90 and 90');
          }
          if (value.longitude < -180 || value.longitude > 180) {
            throw new Error('Longitude must be between -180 and 180');
          }
        }
      }
    }
  },
  matchInvite: {
    type: DataTypes.JSONB,
    allowNull: true,
    field: 'match_invite',
    validate: {
      isValidMatchInvite(value: any) {
        if (value) {
          if (!value.courtId || !value.facilityId || !value.proposedTime || !value.duration) {
            throw new Error('Match invite must include courtId, facilityId, proposedTime, and duration');
          }
          if (typeof value.duration !== 'number' || value.duration <= 0) {
            throw new Error('Duration must be a positive number');
          }
        }
      }
    }
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
  readBy: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: [],
    field: 'read_by',
    validate: {
      isValidReadBy(value: any) {
        if (!Array.isArray(value)) {
          throw new Error('ReadBy must be an array');
        }
        for (const read of value) {
          if (!read.userId || !read.readAt) {
            throw new Error('Each read receipt must have userId and readAt');
          }
        }
      }
    }
  },
  reactions: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: [],
    validate: {
      isValidReactions(value: any) {
        if (!Array.isArray(value)) {
          throw new Error('Reactions must be an array');
        }
        for (const reaction of value) {
          if (!reaction.userId || !reaction.emoji || !reaction.createdAt) {
            throw new Error('Each reaction must have userId, emoji, and createdAt');
          }
        }
      }
    }
  }
}, {
  sequelize,
  modelName: 'Message',
  tableName: 'messages',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['conversation_id']
    },
    {
      fields: ['sender_id']
    },
    {
      fields: ['message_type']
    },
    {
      fields: ['created_at']
    },
    {
      fields: ['is_deleted']
    },
    {
      name: 'messages_read_by_gin',
      fields: ['read_by'],
      using: 'gin'
    },
    {
      name: 'messages_reactions_gin',
      fields: ['reactions'],
      using: 'gin'
    }
  ]
});

export default Message;