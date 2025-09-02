import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface SystemAlertAttributes {
  id: number;
  type: 'performance' | 'security' | 'error' | 'maintenance' | 'business' | 'user_behavior';
  severity: 'info' | 'warning' | 'error' | 'critical';
  
  // Alert details
  title: string;
  message: string;
  details?: any;
  
  // Source
  source: 'system' | 'monitoring' | 'user_report' | 'automated_check';
  sourceData?: any;
  threshold?: any;
  
  // Status tracking
  status: 'open' | 'acknowledged' | 'investigating' | 'resolved' | 'false_positive';
  acknowledgedBy?: number;
  acknowledgedAt?: Date;
  resolvedBy?: number;
  resolvedAt?: Date;
  
  // Resolution
  resolutionNotes?: string;
  actionsTaken?: any;
  
  // Escalation
  isEscalated: boolean;
  escalatedTo?: number;
  escalatedAt?: Date;
  
  // Recurrence tracking
  isRecurring: boolean;
  relatedAlerts?: any;
}

interface SystemAlertCreationAttributes extends Optional<SystemAlertAttributes, 'id'> {}

class SystemAlert extends Model<SystemAlertAttributes, SystemAlertCreationAttributes> implements SystemAlertAttributes {
  public id!: number;
  public type!: 'performance' | 'security' | 'error' | 'maintenance' | 'business' | 'user_behavior';
  public severity!: 'info' | 'warning' | 'error' | 'critical';
  
  // Alert details
  public title!: string;
  public message!: string;
  public details?: any;
  public source!: 'system' | 'monitoring' | 'user_report' | 'automated_check';
  public sourceData?: any;
  public threshold?: any;
  
  // Status tracking
  public status!: 'open' | 'acknowledged' | 'investigating' | 'resolved' | 'false_positive';
  public acknowledgedBy?: number;
  public acknowledgedAt?: Date;
  public resolvedBy?: number;
  public resolvedAt?: Date;
  
  // Resolution
  public resolutionNotes?: string;
  public actionsTaken?: any;
  
  // Escalation
  public isEscalated!: boolean;
  public escalatedTo?: number;
  public escalatedAt?: Date;
  
  // Recurrence tracking
  public isRecurring!: boolean;
  public relatedAlerts?: any;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

SystemAlert.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM('performance', 'security', 'error', 'maintenance', 'business', 'user_behavior'),
      allowNull: false,
    },
    severity: {
      type: DataTypes.ENUM('info', 'warning', 'error', 'critical'),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    details: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    source: {
      type: DataTypes.ENUM('system', 'monitoring', 'user_report', 'automated_check'),
      allowNull: false,
    },
    sourceData: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'source_data',
    },
    threshold: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('open', 'acknowledged', 'investigating', 'resolved', 'false_positive'),
      allowNull: false,
      defaultValue: 'open',
    },
    acknowledgedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      field: 'acknowledged_by'
    },
    acknowledgedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'acknowledged_at',
    },
    resolvedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      field: 'resolved_by'
    },
    resolvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'resolved_at',
    },
    resolutionNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'resolution_notes',
    },
    actionsTaken: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'actions_taken',
    },
    isEscalated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_escalated',
    },
    escalatedTo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      field: 'escalated_to'
    },
    escalatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'escalated_at',
    },
    isRecurring: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_recurring',
    },
    relatedAlerts: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'related_alerts',
    },
  },
  {
    sequelize,
    modelName: 'SystemAlert',
    tableName: 'system_alerts',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['type']
      },
      {
        fields: ['severity']
      },
      {
        fields: ['status']
      },
      {
        fields: ['source']
      },
      {
        fields: ['is_escalated']
      },
      {
        fields: ['is_recurring']
      },
      {
        fields: ['created_at']
      },
      {
        fields: ['acknowledged_by']
      },
      {
        fields: ['resolved_by']
      },
      {
        fields: ['escalated_to']
      },
      {
        fields: ['status', 'severity']
      },
      {
        fields: ['type', 'severity']
      }
    ]
  }
);


export default SystemAlert;