import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export type SurfaceType = 'indoor' | 'outdoor' | 'concrete' | 'clay' | 'artificial_grass';
export type OwnerType = 'club' | 'partner';

interface OperatingHours {
  [dayOfWeek: number]: {
    isOpen: boolean;
    startTime: string;
    endTime: string;
  };
}

interface CourtAttributes {
  id: number;
  name: string;
  description: string;
  surfaceType: SurfaceType;
  ownerType: OwnerType;
  ownerId: number;
  stateId: number;
  address: string;
  latitude: number;
  longitude: number;
  amenities: string[];
  hourlyRate: number;
  peakHourRate?: number;
  weekendRate?: number;
  images: string[];
  isActive: boolean;
  operatingHours: OperatingHours;
  maxAdvanceBookingDays: number;
  minBookingDuration: number; // in minutes
  maxBookingDuration: number; // in minutes
  cancellationPolicy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CourtCreationAttributes extends Optional<CourtAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Court extends Model<CourtAttributes, CourtCreationAttributes> implements CourtAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public surfaceType!: SurfaceType;
  public ownerType!: OwnerType;
  public ownerId!: number;
  public stateId!: number;
  public address!: string;
  public latitude!: number;
  public longitude!: number;
  public amenities!: string[];
  public hourlyRate!: number;
  public peakHourRate?: number;
  public weekendRate?: number;
  public images!: string[];
  public isActive!: boolean;
  public operatingHours!: OperatingHours;
  public maxAdvanceBookingDays!: number;
  public minBookingDuration!: number;
  public maxBookingDuration!: number;
  public cancellationPolicy!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Court.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 100]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  surfaceType: {
    type: DataTypes.ENUM('indoor', 'outdoor', 'concrete', 'clay', 'artificial_grass'),
    allowNull: false,
    field: 'surface_type'
  },
  ownerType: {
    type: DataTypes.ENUM('club', 'partner'),
    allowNull: false,
    field: 'owner_type'
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'owner_id'
  },
  stateId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'states', key: 'id' },
    field: 'state_id'
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false,
    validate: {
      min: -90,
      max: 90
    }
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false,
    validate: {
      min: -180,
      max: 180
    }
  },
  amenities: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  hourlyRate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    },
    field: 'hourly_rate'
  },
  peakHourRate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0
    },
    field: 'peak_hour_rate'
  },
  weekendRate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0
    },
    field: 'weekend_rate'
  },
  images: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  },
  operatingHours: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {
      0: { isOpen: true, startTime: '06:00', endTime: '22:00' }, // Sunday
      1: { isOpen: true, startTime: '06:00', endTime: '22:00' }, // Monday
      2: { isOpen: true, startTime: '06:00', endTime: '22:00' }, // Tuesday
      3: { isOpen: true, startTime: '06:00', endTime: '22:00' }, // Wednesday
      4: { isOpen: true, startTime: '06:00', endTime: '22:00' }, // Thursday
      5: { isOpen: true, startTime: '06:00', endTime: '22:00' }, // Friday
      6: { isOpen: true, startTime: '06:00', endTime: '22:00' }  // Saturday
    },
    field: 'operating_hours'
  },
  maxAdvanceBookingDays: {
    type: DataTypes.INTEGER,
    defaultValue: 30,
    validate: {
      min: 1,
      max: 365
    },
    field: 'max_advance_booking_days'
  },
  minBookingDuration: {
    type: DataTypes.INTEGER,
    defaultValue: 60, // 1 hour in minutes
    field: 'min_booking_duration'
  },
  maxBookingDuration: {
    type: DataTypes.INTEGER,
    defaultValue: 240, // 4 hours in minutes
    field: 'max_booking_duration'
  },
  cancellationPolicy: {
    type: DataTypes.TEXT,
    defaultValue: 'Cancellations must be made at least 24 hours in advance for a full refund.',
    field: 'cancellation_policy'
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
  modelName: 'Court',
  tableName: 'courts',
  timestamps: true,
  indexes: [
    {
      fields: ['owner_type', 'owner_id']
    },
    {
      fields: ['state_id']
    },
    {
      fields: ['surface_type']
    },
    {
      fields: ['is_active']
    },
    {
      fields: ['latitude', 'longitude']
    }
  ]
});

export default Court;