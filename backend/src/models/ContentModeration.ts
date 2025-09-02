import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

interface ContentModerationAttributes {
  id: number;
  contentType: 'user_profile' | 'tournament' | 'microsite' | 'message' | 'review' | 'media';
  contentId: string;
  reportedBy?: number; // User who reported the content
  
  // Content details
  contentData: Record<string, any>;
  contentUrl?: string;
  contentPreview: string;
  
  // Moderation info
  status: 'pending' | 'approved' | 'rejected' | 'flagged' | 'escalated';
  moderatorId?: number;
  moderatedAt?: Date;
  
  // Reason and action
  reportReason?: string;
  moderationReason?: string;
  actionTaken?: 'none' | 'warning' | 'content_removed' | 'account_suspended' | 'account_banned';
  
  // Severity assessment
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string[]; // ['inappropriate_language', 'spam', 'harassment', etc.]
  
  // AI analysis (if applicable)
  aiFlags?: {
    toxicity: number;
    spam: number;
    inappropriate: number;
    confidence: number;
  };
  
  // Follow-up
  requiresFollowUp: boolean;
  followUpDate?: Date;
  notes?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

interface ContentModerationCreationAttributes extends Optional<ContentModerationAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class ContentModeration extends Model<ContentModerationAttributes, ContentModerationCreationAttributes> implements ContentModerationAttributes {
  public id!: number;
  public contentType!: 'user_profile' | 'tournament' | 'microsite' | 'message' | 'review' | 'media';
  public contentId!: string;
  public reportedBy?: number;
  
  // Content details
  public contentData!: Record<string, any>;
  public contentUrl?: string;
  public contentPreview!: string;
  
  // Moderation info
  public status!: 'pending' | 'approved' | 'rejected' | 'flagged' | 'escalated';
  public moderatorId?: number;
  public moderatedAt?: Date;
  
  // Reason and action
  public reportReason?: string;
  public moderationReason?: string;
  public actionTaken?: 'none' | 'warning' | 'content_removed' | 'account_suspended' | 'account_banned';
  
  // Severity assessment
  public severity!: 'low' | 'medium' | 'high' | 'critical';
  public category!: string[];
  
  // AI analysis
  public aiFlags?: {
    toxicity: number;
    spam: number;
    inappropriate: number;
    confidence: number;
  };
  
  // Follow-up
  public requiresFollowUp!: boolean;
  public followUpDate?: Date;
  public notes?: string;
  
  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Helper methods
  public isPending(): boolean {
    return this.status === 'pending';
  }

  public isHighPriority(): boolean {
    return this.severity === 'high' || this.severity === 'critical';
  }

  public isCritical(): boolean {
    return this.severity === 'critical';
  }

  public hasAIFlags(): boolean {
    return Boolean(this.aiFlags && (
      this.aiFlags.toxicity > 0.7 || 
      this.aiFlags.spam > 0.7 || 
      this.aiFlags.inappropriate > 0.7
    ));
  }

  public getAgeInHours(): number {
    const now = new Date();
    const diffMs = now.getTime() - this.createdAt.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60));
  }

  public isOverdue(): boolean {
    const ageHours = this.getAgeInHours();
    
    // Define SLA based on severity
    const slaHours = {
      critical: 2,
      high: 8,
      medium: 24,
      low: 72
    };
    
    return ageHours > slaHours[this.severity];
  }

  public getContentTypeDisplayName(): string {
    const displayNames = {
      user_profile: 'Perfil de Usuario',
      tournament: 'Torneo',
      microsite: 'Micrositio',
      message: 'Mensaje',
      review: 'Reseña',
      media: 'Media'
    };
    
    return displayNames[this.contentType] || this.contentType;
  }

  public getSeverityColor(): string {
    const colors = {
      low: 'green',
      medium: 'yellow',
      high: 'orange',
      critical: 'red'
    };
    
    return colors[this.severity] || 'gray';
  }

  public getStatusColor(): string {
    const colors = {
      pending: 'yellow',
      approved: 'green',
      rejected: 'red',
      flagged: 'orange',
      escalated: 'purple'
    };
    
    return colors[this.status] || 'gray';
  }

  public getCategoryTags(): string[] {
    return this.category.map(cat => {
      const tagMap = {
        inappropriate_language: 'Lenguaje Inapropiado',
        spam: 'Spam',
        harassment: 'Acoso',
        fake_information: 'Información Falsa',
        copyright_violation: 'Violación de Derechos de Autor',
        adult_content: 'Contenido para Adultos',
        violence: 'Violencia',
        discrimination: 'Discriminación',
        privacy_violation: 'Violación de Privacidad',
        other: 'Otro'
      };
      
      return tagMap[cat as keyof typeof tagMap] || cat;
    });
  }
}

ContentModeration.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    contentType: {
      type: DataTypes.ENUM('user_profile', 'tournament', 'microsite', 'message', 'review', 'media'),
      allowNull: false,
      field: 'content_type',
    },
    contentId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'content_id',
    },
    reportedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      field: 'reported_by',
    },
    contentData: {
      type: DataTypes.JSONB,
      allowNull: false,
      field: 'content_data',
    },
    contentUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'content_url',
    },
    contentPreview: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'content_preview',
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'flagged', 'escalated'),
      allowNull: false,
      defaultValue: 'pending',
    },
    moderatorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      field: 'moderator_id',
    },
    moderatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'moderated_at',
    },
    reportReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'report_reason',
    },
    moderationReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'moderation_reason',
    },
    actionTaken: {
      type: DataTypes.ENUM('none', 'warning', 'content_removed', 'account_suspended', 'account_banned'),
      allowNull: true,
      field: 'action_taken',
    },
    severity: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
      allowNull: false,
      defaultValue: 'medium',
    },
    category: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    aiFlags: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'ai_flags',
    },
    requiresFollowUp: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'requires_follow_up',
    },
    followUpDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'follow_up_date',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'content_moderation',
    timestamps: true,
    indexes: [
      {
        fields: ['content_type'],
      },
      {
        fields: ['content_id'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['severity'],
      },
      {
        fields: ['reported_by'],
      },
      {
        fields: ['moderator_id'],
      },
      {
        fields: ['created_at'],
      },
      {
        fields: ['requires_follow_up', 'follow_up_date'],
      },
      {
        fields: ['content_type', 'content_id'],
      },
    ],
  }
);

// Associations
ContentModeration.belongsTo(User, { foreignKey: 'reportedBy', as: 'reporter' });
ContentModeration.belongsTo(User, { foreignKey: 'moderatorId', as: 'moderator' });
User.hasMany(ContentModeration, { foreignKey: 'reportedBy', as: 'reportedContent' });
User.hasMany(ContentModeration, { foreignKey: 'moderatorId', as: 'moderatedContent' });

export default ContentModeration;