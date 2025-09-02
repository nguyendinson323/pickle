import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface MaintenanceRecordAttributes {
  id: number;
  courtId: number;
  facilityId: number;
  maintenanceType: 'scheduled' | 'emergency' | 'preventive' | 'repair' | 'inspection' | 'cleaning';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'postponed';
  title: string;
  description: string;
  scheduledDate: Date;
  scheduledStartTime: string;
  scheduledEndTime: string;
  estimatedDuration: number;
  actualStartTime?: Date;
  actualEndTime?: Date;
  actualDuration?: number;
  assignedTo: {
    technician?: {
      id?: number;
      name: string;
      phone: string;
      email?: string;
      specialization: string[];
    };
    contractor?: {
      company: string;
      contactPerson: string;
      phone: string;
      email?: string;
      licenseNumber?: string;
    };
    internal?: {
      employeeId: number;
      name: string;
      department: string;
    };
  };
  workPerformed?: {
    tasks: string[];
    materialsUsed: {
      material: string;
      quantity: number;
      unit: string;
      cost: number;
    }[];
    toolsUsed: string[];
    observations: string;
  };
  cost: {
    laborCost: number;
    materialCost: number;
    equipmentCost: number;
    contractorCost: number;
    totalCost: number;
    currency: 'MXN';
  };
  qualityCheck: {
    inspector: string;
    inspectionDate?: Date;
    checklistItems: {
      item: string;
      status: 'pass' | 'fail' | 'needs_attention';
      notes?: string;
    }[];
    overallRating: number;
    followUpRequired: boolean;
    followUpNotes?: string;
  };
  affectedBookings?: {
    bookingId: number;
    action: 'cancelled' | 'rescheduled' | 'moved';
    notificationSent: boolean;
    compensationOffered?: {
      type: 'refund' | 'credit' | 'free_session';
      amount?: number;
      description: string;
    };
  }[];
  preventiveSchedule?: {
    isRecurring: boolean;
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
    nextScheduledDate?: Date;
    reminderDays: number;
  };
  warranty?: {
    warrantyPeriod: number;
    warrantyUnit: 'days' | 'months' | 'years';
    warrantyProvider: string;
    warrantyNotes?: string;
  };
  beforePhotos: string[];
  afterPhotos: string[];
  documents: {
    fileName: string;
    fileUrl: string;
    fileType: string;
    uploadedAt: Date;
    description?: string;
  }[];
  weatherConditions?: {
    temperature: number;
    humidity: number;
    conditions: string;
    impactedWork: boolean;
    weatherNotes?: string;
  };
  safetyMeasures: {
    hazardsIdentified: string[];
    safetyEquipmentUsed: string[];
    safetyIncidents: {
      incident: string;
      severity: 'minor' | 'moderate' | 'severe';
      actionTaken: string;
    }[];
    complianceCertification: boolean;
  };
  approvals: {
    requestedBy: number;
    approvedBy?: number;
    approvalDate?: Date;
    approvalNotes?: string;
    budgetApproved: boolean;
  };
  feedback?: {
    customerSatisfaction: number;
    technicalQuality: number;
    timeliness: number;
    communication: number;
    overallRating: number;
    comments?: string;
    feedbackDate: Date;
  };
  isActive: boolean;
}

interface MaintenanceRecordCreationAttributes extends Optional<MaintenanceRecordAttributes, 'id' | 'actualStartTime' | 'actualEndTime' | 'actualDuration' | 'workPerformed' | 'affectedBookings' | 'preventiveSchedule' | 'warranty' | 'weatherConditions' | 'feedback'> {}

class MaintenanceRecord extends Model<MaintenanceRecordAttributes, MaintenanceRecordCreationAttributes> implements MaintenanceRecordAttributes {
  public id!: number;
  public courtId!: number;
  public facilityId!: number;
  public maintenanceType!: 'scheduled' | 'emergency' | 'preventive' | 'repair' | 'inspection' | 'cleaning';
  public priority!: 'low' | 'medium' | 'high' | 'urgent';
  public status!: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'postponed';
  public title!: string;
  public description!: string;
  public scheduledDate!: Date;
  public scheduledStartTime!: string;
  public scheduledEndTime!: string;
  public estimatedDuration!: number;
  public actualStartTime?: Date;
  public actualEndTime?: Date;
  public actualDuration?: number;
  public assignedTo!: {
    technician?: {
      id?: number;
      name: string;
      phone: string;
      email?: string;
      specialization: string[];
    };
    contractor?: {
      company: string;
      contactPerson: string;
      phone: string;
      email?: string;
      licenseNumber?: string;
    };
    internal?: {
      employeeId: number;
      name: string;
      department: string;
    };
  };
  public workPerformed?: {
    tasks: string[];
    materialsUsed: {
      material: string;
      quantity: number;
      unit: string;
      cost: number;
    }[];
    toolsUsed: string[];
    observations: string;
  };
  public cost!: {
    laborCost: number;
    materialCost: number;
    equipmentCost: number;
    contractorCost: number;
    totalCost: number;
    currency: 'MXN';
  };
  public qualityCheck!: {
    inspector: string;
    inspectionDate?: Date;
    checklistItems: {
      item: string;
      status: 'pass' | 'fail' | 'needs_attention';
      notes?: string;
    }[];
    overallRating: number;
    followUpRequired: boolean;
    followUpNotes?: string;
  };
  public affectedBookings?: {
    bookingId: number;
    action: 'cancelled' | 'rescheduled' | 'moved';
    notificationSent: boolean;
    compensationOffered?: {
      type: 'refund' | 'credit' | 'free_session';
      amount?: number;
      description: string;
    };
  }[];
  public preventiveSchedule?: {
    isRecurring: boolean;
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
    nextScheduledDate?: Date;
    reminderDays: number;
  };
  public warranty?: {
    warrantyPeriod: number;
    warrantyUnit: 'days' | 'months' | 'years';
    warrantyProvider: string;
    warrantyNotes?: string;
  };
  public beforePhotos!: string[];
  public afterPhotos!: string[];
  public documents!: {
    fileName: string;
    fileUrl: string;
    fileType: string;
    uploadedAt: Date;
    description?: string;
  }[];
  public weatherConditions?: {
    temperature: number;
    humidity: number;
    conditions: string;
    impactedWork: boolean;
    weatherNotes?: string;
  };
  public safetyMeasures!: {
    hazardsIdentified: string[];
    safetyEquipmentUsed: string[];
    safetyIncidents: {
      incident: string;
      severity: 'minor' | 'moderate' | 'severe';
      actionTaken: string;
    }[];
    complianceCertification: boolean;
  };
  public approvals!: {
    requestedBy: number;
    approvedBy?: number;
    approvalDate?: Date;
    approvalNotes?: string;
    budgetApproved: boolean;
  };
  public feedback?: {
    customerSatisfaction: number;
    technicalQuality: number;
    timeliness: number;
    communication: number;
    overallRating: number;
    comments?: string;
    feedbackDate: Date;
  };
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MaintenanceRecord.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  courtId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'courts',
      key: 'id'
    },
    onDelete: 'CASCADE',
    field: 'court_id'
  },
  facilityId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'court_facilities',
      key: 'id'
    },
    onDelete: 'CASCADE',
    field: 'facility_id'
  },
  maintenanceType: {
    type: DataTypes.ENUM('scheduled', 'emergency', 'preventive', 'repair', 'inspection', 'cleaning'),
    allowNull: false,
    field: 'maintenance_type'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    allowNull: false,
    defaultValue: 'medium'
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'in_progress', 'completed', 'cancelled', 'postponed'),
    allowNull: false,
    defaultValue: 'scheduled'
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [5, 200]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [10, 2000]
    }
  },
  scheduledDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'scheduled_date'
  },
  scheduledStartTime: {
    type: DataTypes.TIME,
    allowNull: false,
    field: 'scheduled_start_time',
    validate: {
      is: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
    }
  },
  scheduledEndTime: {
    type: DataTypes.TIME,
    allowNull: false,
    field: 'scheduled_end_time',
    validate: {
      is: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
    }
  },
  estimatedDuration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'estimated_duration',
    validate: {
      min: 15,
      max: 1440
    }
  },
  actualStartTime: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'actual_start_time'
  },
  actualEndTime: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'actual_end_time'
  },
  actualDuration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'actual_duration'
  },
  assignedTo: {
    type: DataTypes.JSONB,
    allowNull: false,
    field: 'assigned_to',
    validate: {
      isValidAssignment(value: any) {
        if (!value || typeof value !== 'object') {
          throw new Error('Assigned to must be an object');
        }
        const assignmentTypes = ['technician', 'contractor', 'internal'];
        const hasValidAssignment = assignmentTypes.some(type => value[type]);
        if (!hasValidAssignment) {
          throw new Error('Must assign to at least one of: technician, contractor, or internal');
        }
      }
    }
  },
  workPerformed: {
    type: DataTypes.JSONB,
    allowNull: true,
    field: 'work_performed'
  },
  cost: {
    type: DataTypes.JSONB,
    allowNull: false,
    validate: {
      isValidCost(value: any) {
        if (!value || typeof value !== 'object') {
          throw new Error('Cost must be an object');
        }
        const required = ['laborCost', 'materialCost', 'equipmentCost', 'contractorCost', 'totalCost'];
        for (const field of required) {
          if (typeof value[field] !== 'number' || value[field] < 0) {
            throw new Error(`${field} must be a non-negative number`);
          }
        }
        if (value.currency !== 'MXN') {
          throw new Error('Currency must be MXN');
        }
      }
    }
  },
  qualityCheck: {
    type: DataTypes.JSONB,
    allowNull: false,
    field: 'quality_check',
    validate: {
      isValidQualityCheck(value: any) {
        if (!value || typeof value !== 'object') {
          throw new Error('Quality check must be an object');
        }
        if (!value.inspector || typeof value.inspector !== 'string') {
          throw new Error('Inspector name is required');
        }
        if (typeof value.overallRating !== 'number' || value.overallRating < 1 || value.overallRating > 5) {
          throw new Error('Overall rating must be between 1 and 5');
        }
        if (typeof value.followUpRequired !== 'boolean') {
          throw new Error('Follow up required must be a boolean');
        }
      }
    }
  },
  affectedBookings: {
    type: DataTypes.JSONB,
    allowNull: true,
    field: 'affected_bookings'
  },
  preventiveSchedule: {
    type: DataTypes.JSONB,
    allowNull: true,
    field: 'preventive_schedule'
  },
  warranty: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  beforePhotos: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: [],
    field: 'before_photos'
  },
  afterPhotos: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: [],
    field: 'after_photos'
  },
  documents: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: [],
    validate: {
      isValidDocuments(value: any) {
        if (!Array.isArray(value)) {
          throw new Error('Documents must be an array');
        }
        for (const doc of value) {
          if (!doc.fileName || !doc.fileUrl || !doc.fileType) {
            throw new Error('Each document must have fileName, fileUrl, and fileType');
          }
        }
      }
    }
  },
  weatherConditions: {
    type: DataTypes.JSONB,
    allowNull: true,
    field: 'weather_conditions'
  },
  safetyMeasures: {
    type: DataTypes.JSONB,
    allowNull: false,
    field: 'safety_measures',
    validate: {
      isValidSafetyMeasures(value: any) {
        if (!value || typeof value !== 'object') {
          throw new Error('Safety measures must be an object');
        }
        if (!Array.isArray(value.hazardsIdentified)) {
          throw new Error('Hazards identified must be an array');
        }
        if (!Array.isArray(value.safetyEquipmentUsed)) {
          throw new Error('Safety equipment used must be an array');
        }
        if (typeof value.complianceCertification !== 'boolean') {
          throw new Error('Compliance certification must be a boolean');
        }
      }
    }
  },
  approvals: {
    type: DataTypes.JSONB,
    allowNull: false,
    validate: {
      isValidApprovals(value: any) {
        if (!value || typeof value !== 'object') {
          throw new Error('Approvals must be an object');
        }
        if (typeof value.requestedBy !== 'number') {
          throw new Error('Requested by must be a user ID number');
        }
        if (typeof value.budgetApproved !== 'boolean') {
          throw new Error('Budget approved must be a boolean');
        }
      }
    }
  },
  feedback: {
    type: DataTypes.JSONB,
    allowNull: true,
    validate: {
      isValidFeedback(value: any) {
        if (value && typeof value === 'object') {
          const ratings = ['customerSatisfaction', 'technicalQuality', 'timeliness', 'communication', 'overallRating'];
          for (const rating of ratings) {
            if (value[rating] !== undefined) {
              if (typeof value[rating] !== 'number' || value[rating] < 1 || value[rating] > 5) {
                throw new Error(`${rating} must be a number between 1 and 5`);
              }
            }
          }
        }
      }
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active'
  }
}, {
  sequelize,
  modelName: 'MaintenanceRecord',
  tableName: 'maintenance_records',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['court_id']
    },
    {
      fields: ['facility_id']
    },
    {
      fields: ['maintenance_type']
    },
    {
      fields: ['priority']
    },
    {
      fields: ['status']
    },
    {
      fields: ['scheduled_date']
    },
    {
      fields: ['is_active']
    },
    {
      fields: ['scheduled_date', 'scheduled_start_time', 'scheduled_end_time']
    }
  ]
});

export default MaintenanceRecord;