import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ContentModerationAttributes {
  id: number;
  contentType: 'user_profile' | 'tournament' | 'microsite' | 'message' | 'review' | 'media';
  contentId: string;
  reportedBy?: number;
  contentData: any;
  contentUrl?: string;
  contentPreview: string;
  status: 'pending' | 'approved' | 'rejected' | 'flagged' | 'escalated';
  moderatorId?: number;
  moderatedAt?: Date;
  reportReason?: string;
  moderationReason?: string;
  actionTaken?: 'none' | 'warning' | 'content_removed' | 'account_suspended' | 'account_banned';
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: any;
  aiFlags?: any;
  requiresFollowUp: boolean;
  followUpDate?: Date;
  notes?: string;
}

interface ContentModerationCreationAttributes extends Optional<ContentModerationAttributes, 'id'> {}

class ContentModeration extends Model<ContentModerationAttributes, ContentModerationCreationAttributes> implements ContentModerationAttributes {
  public id!: number;
  public contentType!: 'user_profile' | 'tournament' | 'microsite' | 'message' | 'review' | 'media';
  public contentId!: string;
  public reportedBy?: number;
  public contentData!: any;
  public contentUrl?: string;
  public contentPreview!: string;
  public status!: 'pending' | 'approved' | 'rejected' | 'flagged' | 'escalated';
  public moderatorId?: number;
  public moderatedAt?: Date;
  public reportReason?: string;
  public moderationReason?: string;
  public actionTaken?: 'none' | 'warning' | 'content_removed' | 'account_suspended' | 'account_banned';
  public severity!: 'low' | 'medium' | 'high' | 'critical';
  public category!: any;
  public aiFlags?: any;
  public requiresFollowUp!: boolean;
  public followUpDate?: Date;
  public notes?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ContentModeration.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  contentType: {
    type: DataTypes.ENUM('user_profile', 'tournament', 'microsite', 'message', 'review', 'media'),
    allowNull: false,
    field: 'content_type'
  },
  contentId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'content_id'
  },
  reportedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    field: 'reported_by'
  },
  contentData: {
    type: DataTypes.JSONB,
    allowNull: false,
    field: 'content_data'
  },
  contentUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'content_url'
  },
  contentPreview: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'content_preview'
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'flagged', 'escalated'),
    allowNull: false,
    defaultValue: 'pending'
  },
  moderatorId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    field: 'moderator_id'
  },
  moderatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'moderated_at'
  },
  reportReason: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'report_reason'
  },
  moderationReason: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'moderation_reason'
  },
  actionTaken: {
    type: DataTypes.ENUM('none', 'warning', 'content_removed', 'account_suspended', 'account_banned'),
    allowNull: true,
    field: 'action_taken'
  },
  severity: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    allowNull: false,
    defaultValue: 'medium'
  },
  category: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: []
  },
  aiFlags: {
    type: DataTypes.JSONB,
    allowNull: true,
    field: 'ai_flags'
  },
  requiresFollowUp: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'requires_follow_up'
  },
  followUpDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'follow_up_date'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'ContentModeration',
  tableName: 'content_moderation',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['content_type']
    },
    {
      fields: ['content_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['severity']
    },
    {
      fields: ['reported_by']
    },
    {
      fields: ['moderator_id']
    },
    {
      fields: ['created_at']
    },
    {
      fields: ['requires_follow_up', 'follow_up_date']
    },
    {
      fields: ['content_type', 'content_id']
    }
  ]
});


export default ContentModeration;