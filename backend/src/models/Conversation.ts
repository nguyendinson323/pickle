import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ConversationAttributes {
  id: number;
  type: 'direct' | 'group' | 'tournament' | 'court_booking';
  name?: string; // For group conversations
  description?: string;
  
  // Participants
  participants: {
    userId: string;
    role: 'admin' | 'member';
    joinedAt: Date;
    leftAt?: Date;
    isActive: boolean;
  }[];
  
  // Group settings
  isGroup: boolean;
  groupIcon?: string;
  
  // Related entities
  relatedEntityType?: 'tournament' | 'court_booking' | 'player_match';
  relatedEntityId?: string;
  
  // Last message info
  lastMessageId?: number;
  lastMessageAt?: Date;
  lastMessagePreview?: string;
  
  // Conversation settings
  settings: {
    allowFileSharing: boolean;
    allowLocationSharing: boolean;
    muteNotifications: boolean;
    archiveAfterDays?: number;
  };
  
  // Status
  isActive: boolean;
  isArchived: boolean;
  archivedAt?: Date;
}

interface ConversationCreationAttributes extends Optional<ConversationAttributes, 'id' | 'name' | 'description' | 'groupIcon' | 'relatedEntityType' | 'relatedEntityId' | 'lastMessageId' | 'lastMessageAt' | 'lastMessagePreview' | 'archivedAt'> {}

class Conversation extends Model<ConversationAttributes, ConversationCreationAttributes> implements ConversationAttributes {
  public id!: number;
  public type!: 'direct' | 'group' | 'tournament' | 'court_booking';
  public name?: string;
  public description?: string;
  
  public participants!: {
    userId: string;
    role: 'admin' | 'member';
    joinedAt: Date;
    leftAt?: Date;
    isActive: boolean;
  }[];
  
  public isGroup!: boolean;
  public groupIcon?: string;
  
  public relatedEntityType?: 'tournament' | 'court_booking' | 'player_match';
  public relatedEntityId?: string;
  
  public lastMessageId?: number;
  public lastMessageAt?: Date;
  public lastMessagePreview?: string;
  
  public settings!: {
    allowFileSharing: boolean;
    allowLocationSharing: boolean;
    muteNotifications: boolean;
    archiveAfterDays?: number;
  };
  
  public isActive!: boolean;
  public isArchived!: boolean;
  public archivedAt?: Date;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Association properties
  public messages?: any[];
  public lastMessage?: any;
}

Conversation.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  type: {
    type: DataTypes.ENUM('direct', 'group', 'tournament', 'court_booking'),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      len: [1, 255]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 1000]
    }
  },
  participants: {
    type: DataTypes.JSONB,
    allowNull: false,
    validate: {
      isValidParticipants(value: any) {
        if (!Array.isArray(value)) {
          throw new Error('Participants must be an array');
        }
        if (value.length === 0) {
          throw new Error('Conversation must have at least one participant');
        }
        for (const participant of value) {
          if (!participant.userId || !participant.role || !participant.joinedAt) {
            throw new Error('Each participant must have userId, role, and joinedAt');
          }
          if (!['admin', 'member'].includes(participant.role)) {
            throw new Error('Participant role must be admin or member');
          }
          if (typeof participant.isActive !== 'boolean') {
            throw new Error('Participant isActive must be a boolean');
          }
        }
      }
    }
  },
  isGroup: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_group'
  },
  groupIcon: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'group_icon',
    validate: {
      isUrl: true
    }
  },
  relatedEntityType: {
    type: DataTypes.ENUM('tournament', 'court_booking', 'player_match'),
    allowNull: true,
    field: 'related_entity_type'
  },
  relatedEntityId: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'related_entity_id'
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
  lastMessagePreview: {
    type: DataTypes.STRING(200),
    allowNull: true,
    field: 'last_message_preview'
  },
  settings: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {
      allowFileSharing: true,
      allowLocationSharing: true,
      muteNotifications: false
    },
    validate: {
      isValidSettings(value: any) {
        if (!value || typeof value !== 'object') {
          throw new Error('Settings must be an object');
        }
        if (typeof value.allowFileSharing !== 'boolean') {
          throw new Error('allowFileSharing must be a boolean');
        }
        if (typeof value.allowLocationSharing !== 'boolean') {
          throw new Error('allowLocationSharing must be a boolean');
        }
        if (typeof value.muteNotifications !== 'boolean') {
          throw new Error('muteNotifications must be a boolean');
        }
        if (value.archiveAfterDays !== undefined && 
            (typeof value.archiveAfterDays !== 'number' || value.archiveAfterDays <= 0)) {
          throw new Error('archiveAfterDays must be a positive number');
        }
      }
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active'
  },
  isArchived: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_archived'
  },
  archivedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'archived_at'
  }
}, {
  sequelize,
  modelName: 'Conversation',
  tableName: 'conversations',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['type']
    },
    {
      fields: ['is_active']
    },
    {
      fields: ['is_archived']
    },
    {
      fields: ['last_message_at']
    },
    {
      fields: ['related_entity_type', 'related_entity_id']
    },
    {
      name: 'conversations_participants_gin',
      fields: ['participants'],
      using: 'gin'
    }
  ]
});

export default Conversation;