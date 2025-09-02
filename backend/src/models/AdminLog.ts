import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

interface AdminLogAttributes {
  id: number;
  adminId: number;
  action: string;
  category: 'user_management' | 'content_moderation' | 'system_config' | 'financial' | 'tournament' | 'communication';
  
  // Action details
  description: string;
  targetId?: number;
  targetType?: string;
  
  // Before/after data
  previousData?: Record<string, any>;
  newData?: Record<string, any>;
  
  // Context
  ipAddress: string;
  userAgent: string;
  sessionId?: string;
  
  // Impact assessment
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedUsers?: number;
  
  // Status
  status: 'success' | 'failed' | 'partial';
  errorMessage?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

interface AdminLogCreationAttributes extends Optional<AdminLogAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class AdminLog extends Model<AdminLogAttributes, AdminLogCreationAttributes> implements AdminLogAttributes {
  public id!: number;
  public adminId!: number;
  public action!: string;
  public category!: 'user_management' | 'content_moderation' | 'system_config' | 'financial' | 'tournament' | 'communication';
  
  // Action details
  public description!: string;
  public targetId?: number;
  public targetType?: string;
  
  // Before/after data
  public previousData?: Record<string, any>;
  public newData?: Record<string, any>;
  
  // Context
  public ipAddress!: string;
  public userAgent!: string;
  public sessionId?: string;
  
  // Impact assessment
  public severity!: 'low' | 'medium' | 'high' | 'critical';
  public affectedUsers?: number;
  
  // Status
  public status!: 'success' | 'failed' | 'partial';
  public errorMessage?: string;
  
  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Helper methods
  public isCriticalAction(): boolean {
    return this.severity === 'critical' || this.severity === 'high';
  }

  public getFormattedDate(): string {
    return this.createdAt.toLocaleString('es-MX', {
      dateStyle: 'short',
      timeStyle: 'medium'
    });
  }

  public getCategoryDisplayName(): string {
    const categoryNames = {
      user_management: 'Gestión de Usuarios',
      content_moderation: 'Moderación de Contenido',
      system_config: 'Configuración del Sistema',
      financial: 'Financiero',
      tournament: 'Torneos',
      communication: 'Comunicación'
    };
    
    return categoryNames[this.category] || this.category;
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
}

AdminLog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    adminId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      field: 'admin_id',
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM('user_management', 'content_moderation', 'system_config', 'financial', 'tournament', 'communication'),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    targetId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'target_id',
    },
    targetType: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'target_type',
    },
    previousData: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'previous_data',
    },
    newData: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'new_data',
    },
    ipAddress: {
      type: DataTypes.INET,
      allowNull: false,
      field: 'ip_address',
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'user_agent',
    },
    sessionId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'session_id',
    },
    severity: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
      allowNull: false,
      defaultValue: 'medium',
    },
    affectedUsers: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'affected_users',
    },
    status: {
      type: DataTypes.ENUM('success', 'failed', 'partial'),
      allowNull: false,
      defaultValue: 'success',
    },
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'error_message',
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
  },
  {
    sequelize,
    tableName: 'admin_logs',
    timestamps: true,
    indexes: [
      {
        fields: ['admin_id'],
      },
      {
        fields: ['action'],
      },
      {
        fields: ['category'],
      },
      {
        fields: ['severity'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['created_at'],
      },
      {
        fields: ['target_id', 'target_type'],
      },
    ],
  }
);

// Associations
AdminLog.belongsTo(User, { foreignKey: 'adminId', as: 'admin' });
User.hasMany(AdminLog, { foreignKey: 'adminId', as: 'adminLogs' });

export default AdminLog;