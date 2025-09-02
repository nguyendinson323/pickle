import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

interface SystemAlertAttributes {
  id: number;
  type: 'performance' | 'security' | 'error' | 'maintenance' | 'business' | 'user_behavior';
  severity: 'info' | 'warning' | 'error' | 'critical';
  
  // Alert details
  title: string;
  message: string;
  details?: Record<string, any>;
  
  // Source
  source: 'system' | 'monitoring' | 'user_report' | 'automated_check';
  sourceData?: Record<string, any>;
  
  // Thresholds (for automated alerts)
  threshold?: {
    metric: string;
    operator: 'greater_than' | 'less_than' | 'equals' | 'not_equals';
    value: number;
    actualValue?: number;
  };
  
  // Status tracking
  status: 'open' | 'acknowledged' | 'investigating' | 'resolved' | 'false_positive';
  acknowledgedBy?: number;
  acknowledgedAt?: Date;
  resolvedBy?: number;
  resolvedAt?: Date;
  
  // Resolution
  resolutionNotes?: string;
  actionsTaken?: string[];
  
  // Escalation
  isEscalated: boolean;
  escalatedTo?: number;
  escalatedAt?: Date;
  
  // Recurrence tracking
  isRecurring: boolean;
  relatedAlerts?: number[]; // IDs of related alerts
  
  createdAt: Date;
  updatedAt: Date;
}

interface SystemAlertCreationAttributes extends Optional<SystemAlertAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class SystemAlert extends Model<SystemAlertAttributes, SystemAlertCreationAttributes> implements SystemAlertAttributes {
  public id!: number;
  public type!: 'performance' | 'security' | 'error' | 'maintenance' | 'business' | 'user_behavior';
  public severity!: 'info' | 'warning' | 'error' | 'critical';
  
  // Alert details
  public title!: string;
  public message!: string;
  public details?: Record<string, any>;
  
  // Source
  public source!: 'system' | 'monitoring' | 'user_report' | 'automated_check';
  public sourceData?: Record<string, any>;
  
  // Thresholds
  public threshold?: {
    metric: string;
    operator: 'greater_than' | 'less_than' | 'equals' | 'not_equals';
    value: number;
    actualValue?: number;
  };
  
  // Status tracking
  public status!: 'open' | 'acknowledged' | 'investigating' | 'resolved' | 'false_positive';
  public acknowledgedBy?: number;
  public acknowledgedAt?: Date;
  public resolvedBy?: number;
  public resolvedAt?: Date;
  
  // Resolution
  public resolutionNotes?: string;
  public actionsTaken?: string[];
  
  // Escalation
  public isEscalated!: boolean;
  public escalatedTo?: number;
  public escalatedAt?: Date;
  
  // Recurrence tracking
  public isRecurring!: boolean;
  public relatedAlerts?: number[];
  
  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Helper methods
  public isOpen(): boolean {
    return this.status === 'open';
  }

  public isCritical(): boolean {
    return this.severity === 'critical';
  }

  public isResolved(): boolean {
    return this.status === 'resolved';
  }

  public getAgeInMinutes(): number {
    const now = new Date();
    const diffMs = now.getTime() - this.createdAt.getTime();
    return Math.floor(diffMs / (1000 * 60));
  }

  public getResolutionTimeInMinutes(): number | null {
    if (!this.resolvedAt) return null;
    
    const diffMs = this.resolvedAt.getTime() - this.createdAt.getTime();
    return Math.floor(diffMs / (1000 * 60));
  }

  public getAcknowledgmentTimeInMinutes(): number | null {
    if (!this.acknowledgedAt) return null;
    
    const diffMs = this.acknowledgedAt.getTime() - this.createdAt.getTime();
    return Math.floor(diffMs / (1000 * 60));
  }

  public isOverdue(): boolean {
    const ageMinutes = this.getAgeInMinutes();
    
    // Define SLA based on severity (in minutes)
    const slaMinutes = {
      critical: 30,    // 30 minutes
      error: 120,      // 2 hours
      warning: 480,    // 8 hours
      info: 1440       // 24 hours
    };
    
    return this.status === 'open' && ageMinutes > slaMinutes[this.severity];
  }

  public getPriorityScore(): number {
    let score = 0;
    
    // Severity weight
    const severityWeight = {
      critical: 100,
      error: 70,
      warning: 40,
      info: 10
    };
    score += severityWeight[this.severity];
    
    // Age weight (more points for older alerts)
    const ageMinutes = this.getAgeInMinutes();
    score += Math.min(ageMinutes / 10, 50); // Max 50 points for age
    
    // Escalation weight
    if (this.isEscalated) score += 20;
    
    // Recurrence weight
    if (this.isRecurring) score += 15;
    
    return Math.round(score);
  }

  public getTypeDisplayName(): string {
    const displayNames = {
      performance: 'Rendimiento',
      security: 'Seguridad',
      error: 'Error',
      maintenance: 'Mantenimiento',
      business: 'Negocio',
      user_behavior: 'Comportamiento de Usuario'
    };
    
    return displayNames[this.type] || this.type;
  }

  public getSeverityColor(): string {
    const colors = {
      info: 'blue',
      warning: 'yellow',
      error: 'orange',
      critical: 'red'
    };
    
    return colors[this.severity] || 'gray';
  }

  public getStatusColor(): string {
    const colors = {
      open: 'red',
      acknowledged: 'yellow',
      investigating: 'blue',
      resolved: 'green',
      false_positive: 'gray'
    };
    
    return colors[this.status] || 'gray';
  }

  public getStatusDisplayName(): string {
    const displayNames = {
      open: 'Abierto',
      acknowledged: 'Reconocido',
      investigating: 'Investigando',
      resolved: 'Resuelto',
      false_positive: 'Falso Positivo'
    };
    
    return displayNames[this.status] || this.status;
  }

  public getThresholdDescription(): string | null {
    if (!this.threshold) return null;
    
    const operators = {
      greater_than: 'mayor que',
      less_than: 'menor que',
      equals: 'igual a',
      not_equals: 'diferente de'
    };
    
    const operator = operators[this.threshold.operator] || this.threshold.operator;
    const actualText = this.threshold.actualValue !== undefined 
      ? ` (actual: ${this.threshold.actualValue})`
      : '';
    
    return `${this.threshold.metric} ${operator} ${this.threshold.value}${actualText}`;
  }

  public canBeEscalated(): boolean {
    return !this.isEscalated && (this.severity === 'critical' || this.severity === 'error');
  }
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
        key: 'id',
      },
      field: 'acknowledged_by',
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
        key: 'id',
      },
      field: 'resolved_by',
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
        key: 'id',
      },
      field: 'escalated_to',
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
    tableName: 'system_alerts',
    timestamps: true,
    indexes: [
      {
        fields: ['type'],
      },
      {
        fields: ['severity'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['source'],
      },
      {
        fields: ['is_escalated'],
      },
      {
        fields: ['is_recurring'],
      },
      {
        fields: ['created_at'],
      },
      {
        fields: ['acknowledged_by'],
      },
      {
        fields: ['resolved_by'],
      },
      {
        fields: ['escalated_to'],
      },
      // Composite indexes for common queries
      {
        fields: ['status', 'severity'],
      },
      {
        fields: ['type', 'severity'],
      },
    ],
  }
);

// Associations
SystemAlert.belongsTo(User, { foreignKey: 'acknowledgedBy', as: 'acknowledgedByUser' });
SystemAlert.belongsTo(User, { foreignKey: 'resolvedBy', as: 'resolvedByUser' });
SystemAlert.belongsTo(User, { foreignKey: 'escalatedTo', as: 'escalatedToUser' });

User.hasMany(SystemAlert, { foreignKey: 'acknowledgedBy', as: 'acknowledgedAlerts' });
User.hasMany(SystemAlert, { foreignKey: 'resolvedBy', as: 'resolvedAlerts' });
User.hasMany(SystemAlert, { foreignKey: 'escalatedTo', as: 'escalatedAlerts' });

export default SystemAlert;