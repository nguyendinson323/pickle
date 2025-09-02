import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface CourtAttributes {
  id: number;
  facilityId: number;
  courtNumber: string;
  name?: string;
  courtType: 'indoor' | 'outdoor';
  surface: 'concrete' | 'asphalt' | 'sport_court' | 'acrylic' | 'clay' | 'grass' | 'synthetic';
  dimensions: {
    length: number;
    width: number;
    unit: 'meters' | 'feet';
  };
  netHeight: number;
  lighting: 'none' | 'basic' | 'professional' | 'led';
  hasLights: boolean;
  windscreen: boolean;
  covered: boolean;
  accessibility: {
    wheelchairAccessible: boolean;
    handicapParking: boolean;
    accessibleRestrooms: boolean;
  };
  condition: 'excellent' | 'good' | 'fair' | 'needs_repair';
  lastInspection: Date;
  nextMaintenanceDate?: Date;
  isActive: boolean;
  isAvailableForBooking: boolean;
  bookingNotes?: string;
  hourlyRate: number;
  peakHourRate: number;
  currency: 'MXN';
  minimumBookingDuration: number;
  maximumBookingDuration: number;
  advanceBookingDays: number;
  cancellationDeadlineHours: number;
  equipmentIncluded: string[];
  additionalEquipment: string[];
  specialFeatures: string[];
  photos: string[];
  maintenanceHistory: {
    lastCleaning: Date;
    lastRepair?: Date;
    lastSurfaceWork?: Date;
    lastNetReplacement?: Date;
  };
  utilizationStats: {
    totalBookings: number;
    totalHours: number;
    averageRating: number;
    lastBooking?: Date;
  };
  restrictions: {
    minAge?: number;
    maxPlayers?: number;
    skillLevelRestriction?: 'beginner' | 'intermediate' | 'advanced' | 'none';
    memberOnly: boolean;
    coachRequired: boolean;
    tournamentUse: boolean;
  };
  operatingHours: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };
}

interface CourtCreationAttributes extends Optional<CourtAttributes, 'id' | 'name' | 'bookingNotes' | 'nextMaintenanceDate'> {}

class Court extends Model<CourtAttributes, CourtCreationAttributes> implements CourtAttributes {
  public id!: number;
  public facilityId!: number;
  public courtNumber!: string;
  public name?: string;
  public courtType!: 'indoor' | 'outdoor';
  public surface!: 'concrete' | 'asphalt' | 'sport_court' | 'acrylic' | 'clay' | 'grass' | 'synthetic';
  public dimensions!: {
    length: number;
    width: number;
    unit: 'meters' | 'feet';
  };
  public netHeight!: number;
  public lighting!: 'none' | 'basic' | 'professional' | 'led';
  public hasLights!: boolean;
  public windscreen!: boolean;
  public covered!: boolean;
  public accessibility!: {
    wheelchairAccessible: boolean;
    handicapParking: boolean;
    accessibleRestrooms: boolean;
  };
  public condition!: 'excellent' | 'good' | 'fair' | 'needs_repair';
  public lastInspection!: Date;
  public nextMaintenanceDate?: Date;
  public isActive!: boolean;
  public isAvailableForBooking!: boolean;
  public bookingNotes?: string;
  public hourlyRate!: number;
  public peakHourRate!: number;
  public currency!: 'MXN';
  public minimumBookingDuration!: number;
  public maximumBookingDuration!: number;
  public advanceBookingDays!: number;
  public cancellationDeadlineHours!: number;
  public equipmentIncluded!: string[];
  public additionalEquipment!: string[];
  public specialFeatures!: string[];
  public photos!: string[];
  public maintenanceHistory!: {
    lastCleaning: Date;
    lastRepair?: Date;
    lastSurfaceWork?: Date;
    lastNetReplacement?: Date;
  };
  public utilizationStats!: {
    totalBookings: number;
    totalHours: number;
    averageRating: number;
    lastBooking?: Date;
  };
  public restrictions!: {
    minAge?: number;
    maxPlayers?: number;
    skillLevelRestriction?: 'beginner' | 'intermediate' | 'advanced' | 'none';
    memberOnly: boolean;
    coachRequired: boolean;
    tournamentUse: boolean;
  };
  public operatingHours!: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Court.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
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
  courtNumber: {
    type: DataTypes.STRING(10),
    allowNull: false,
    field: 'court_number',
    validate: {
      notEmpty: true
    }
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  courtType: {
    type: DataTypes.ENUM('indoor', 'outdoor'),
    allowNull: false,
    field: 'court_type'
  },
  surface: {
    type: DataTypes.ENUM('concrete', 'asphalt', 'sport_court', 'acrylic', 'clay', 'grass', 'synthetic'),
    allowNull: false
  },
  dimensions: {
    type: DataTypes.JSONB,
    allowNull: false,
    validate: {
      isValidDimensions(value: any) {
        if (!value || typeof value !== 'object') {
          throw new Error('Dimensions must be an object');
        }
        if (typeof value.length !== 'number' || typeof value.width !== 'number') {
          throw new Error('Dimensions must contain numeric length and width');
        }
        if (!['meters', 'feet'].includes(value.unit)) {
          throw new Error('Dimensions unit must be meters or feet');
        }
        if (value.length <= 0 || value.width <= 0) {
          throw new Error('Dimensions must be positive numbers');
        }
      }
    }
  },
  netHeight: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: false,
    field: 'net_height',
    validate: {
      min: 0.5,
      max: 2.0
    }
  },
  lighting: {
    type: DataTypes.ENUM('none', 'basic', 'professional', 'led'),
    allowNull: false,
    defaultValue: 'none'
  },
  hasLights: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'has_lights'
  },
  windscreen: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  covered: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  accessibility: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {
      wheelchairAccessible: false,
      handicapParking: false,
      accessibleRestrooms: false
    },
    validate: {
      isValidAccessibility(value: any) {
        if (!value || typeof value !== 'object') {
          throw new Error('Accessibility must be an object');
        }
        const required = ['wheelchairAccessible', 'handicapParking', 'accessibleRestrooms'];
        for (const field of required) {
          if (typeof value[field] !== 'boolean') {
            throw new Error(`${field} must be a boolean`);
          }
        }
      }
    }
  },
  condition: {
    type: DataTypes.ENUM('excellent', 'good', 'fair', 'needs_repair'),
    allowNull: false,
    defaultValue: 'good'
  },
  lastInspection: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'last_inspection'
  },
  nextMaintenanceDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'next_maintenance_date'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active'
  },
  isAvailableForBooking: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_available_for_booking'
  },
  bookingNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'booking_notes'
  },
  hourlyRate: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: false,
    field: 'hourly_rate',
    validate: {
      min: 0
    }
  },
  peakHourRate: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: false,
    field: 'peak_hour_rate',
    validate: {
      min: 0
    }
  },
  currency: {
    type: DataTypes.ENUM('MXN'),
    allowNull: false,
    defaultValue: 'MXN'
  },
  minimumBookingDuration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 60,
    field: 'minimum_booking_duration',
    validate: {
      min: 30,
      max: 480
    }
  },
  maximumBookingDuration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 180,
    field: 'maximum_booking_duration',
    validate: {
      min: 60,
      max: 480
    }
  },
  advanceBookingDays: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 14,
    field: 'advance_booking_days',
    validate: {
      min: 1,
      max: 90
    }
  },
  cancellationDeadlineHours: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 24,
    field: 'cancellation_deadline_hours',
    validate: {
      min: 1,
      max: 168
    }
  },
  equipmentIncluded: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: [],
    field: 'equipment_included'
  },
  additionalEquipment: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: [],
    field: 'additional_equipment'
  },
  specialFeatures: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: [],
    field: 'special_features'
  },
  photos: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: []
  },
  maintenanceHistory: {
    type: DataTypes.JSONB,
    allowNull: false,
    field: 'maintenance_history',
    validate: {
      isValidMaintenanceHistory(value: any) {
        if (!value || typeof value !== 'object') {
          throw new Error('Maintenance history must be an object');
        }
        if (!value.lastCleaning) {
          throw new Error('Last cleaning date is required in maintenance history');
        }
      }
    }
  },
  utilizationStats: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {
      totalBookings: 0,
      totalHours: 0,
      averageRating: 0
    },
    field: 'utilization_stats',
    validate: {
      isValidUtilizationStats(value: any) {
        if (!value || typeof value !== 'object') {
          throw new Error('Utilization stats must be an object');
        }
        const required = ['totalBookings', 'totalHours', 'averageRating'];
        for (const field of required) {
          if (typeof value[field] !== 'number') {
            throw new Error(`${field} must be a number`);
          }
        }
      }
    }
  },
  restrictions: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {
      memberOnly: false,
      coachRequired: false,
      tournamentUse: false
    },
    validate: {
      isValidRestrictions(value: any) {
        if (!value || typeof value !== 'object') {
          throw new Error('Restrictions must be an object');
        }
        const required = ['memberOnly', 'coachRequired', 'tournamentUse'];
        for (const field of required) {
          if (typeof value[field] !== 'boolean') {
            throw new Error(`${field} must be a boolean`);
          }
        }
      }
    }
  },
  operatingHours: {
    type: DataTypes.JSONB,
    allowNull: false,
    field: 'operating_hours',
    validate: {
      isValidOperatingHours(value: any) {
        if (!value || typeof value !== 'object') {
          throw new Error('Operating hours must be an object');
        }
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        for (const day of days) {
          if (!value[day] || typeof value[day] !== 'object') {
            throw new Error(`Missing or invalid ${day} operating hours`);
          }
          const dayHours = value[day];
          if (typeof dayHours.closed !== 'boolean') {
            throw new Error(`${day} must have a closed boolean`);
          }
          if (!dayHours.closed && (!dayHours.open || !dayHours.close)) {
            throw new Error(`${day} must have open and close times when not closed`);
          }
        }
      }
    }
  }
}, {
  sequelize,
  modelName: 'Court',
  tableName: 'courts',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['facility_id']
    },
    {
      fields: ['court_number', 'facility_id'],
      unique: true
    },
    {
      fields: ['is_active', 'is_available_for_booking']
    },
    {
      fields: ['court_type']
    },
    {
      fields: ['surface']
    },
    {
      fields: ['condition']
    },
    {
      fields: ['hourly_rate']
    },
    {
      fields: ['last_inspection']
    },
    {
      fields: ['next_maintenance_date']
    }
  ]
});

export default Court;