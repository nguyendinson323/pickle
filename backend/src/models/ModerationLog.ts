import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ModerationLogAttributes {
  id: number;
  micrositeId: number;
  moderatorId: number;
  resourceType: string;
  resourceId: number;
  action: string;
  reason?: string;
  previousContent?: any;
  newContent?: any;
  status: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ModerationLogCreationAttributes extends Optional<ModerationLogAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class ModerationLog extends Model<ModerationLogAttributes, ModerationLogCreationAttributes> implements ModerationLogAttributes {
  public id!: number;
  public micrositeId!: number;
  public moderatorId!: number;
  public resourceType!: string;
  public resourceId!: number;
  public action!: string;
  public reason?: string;
  public previousContent?: any;
  public newContent?: any;
  public status!: string;
  public notes?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ModerationLog.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  micrositeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'microsites',
      key: 'id'
    },
    onDelete: 'CASCADE',
    field: 'microsite_id'
  },
  moderatorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    field: 'moderator_id'
  },
  resourceType: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'resource_type',
    validate: {
      isIn: [['microsite', 'page', 'content_block', 'media_file']]
    }
  },
  resourceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'resource_id'
  },
  action: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: [['approved', 'rejected', 'suspended', 'flagged', 'content_warning', 'edited']]
    }
  },
  reason: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  previousContent: {
    type: DataTypes.JSONB,
    allowNull: true,
    field: 'previous_content'
  },
  newContent: {
    type: DataTypes.JSONB,
    allowNull: true,
    field: 'new_content'
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'active',
    validate: {
      isIn: [['active', 'resolved', 'appealed']]
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
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
  modelName: 'ModerationLog',
  tableName: 'moderation_logs',
  timestamps: true,
  indexes: [
    {
      fields: ['microsite_id']
    },
    {
      fields: ['moderator_id']
    },
    {
      fields: ['resource_type', 'resource_id']
    },
    {
      fields: ['action']
    },
    {
      fields: ['status']
    }
  ]
});

export default ModerationLog;