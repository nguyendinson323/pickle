import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface CourtFacilityAttributes {
  id: number;
  name: string;
  description: string;
  ownerId: number;
  ownerType: 'club' | 'independent';
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  totalCourts: number;
  facilityType: 'indoor' | 'outdoor' | 'mixed';
  operatingHours: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };
  amenities: string[];
  parkingSpaces: number;
  hasRestrooms: boolean;
  hasShowers: boolean;
  hasProShop: boolean;
  hasRental: boolean;
  contactPhone: string;
  contactEmail: string;
  website?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  isActive: boolean;
  isVerified: boolean;
  verificationDate?: Date;
  photos: string[];
  rating: number;
  totalReviews: number;
  policies: {
    cancellationPolicy: string;
    refundPolicy: string;
    noShowPolicy: string;
    equipmentPolicy: string;
    guestPolicy: string;
    childrenPolicy?: string;
  };
  pricing: {
    baseHourlyRate: number;
    currency: 'MXN';
    peakHourMultiplier: number;
    weekendMultiplier: number;
    memberDiscount: number;
    advanceBookingDiscount?: number;
  };
  bookingSettings: {
    minAdvanceHours: number;
    maxAdvanceDays: number;
    allowSameDayBooking: boolean;
    requirePaymentUpfront: boolean;
    allowPartialRefunds: boolean;
    autoConfirmBookings: boolean;
  };
  integrations: {
    paymentProcessor: 'stripe' | 'paypal' | 'manual';
    calendarSync: boolean;
    posSystem?: string;
  };
  businessHours: {
    timezone: string;
    holidaySchedule?: object;
    seasonalHours?: object;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface CourtFacilityCreationAttributes extends Optional<CourtFacilityAttributes, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'totalReviews' | 'verificationDate' | 'website' | 'socialMedia'> {}

class CourtFacility extends Model<CourtFacilityAttributes, CourtFacilityCreationAttributes> implements CourtFacilityAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public ownerId!: number;
  public ownerType!: 'club' | 'independent';
  public address!: string;
  public city!: string;
  public state!: string;
  public zipCode!: string;
  public country!: string;
  public coordinates!: {
    latitude: number;
    longitude: number;
  };
  public totalCourts!: number;
  public facilityType!: 'indoor' | 'outdoor' | 'mixed';
  public operatingHours!: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };
  public amenities!: string[];
  public parkingSpaces!: number;
  public hasRestrooms!: boolean;
  public hasShowers!: boolean;
  public hasProShop!: boolean;
  public hasRental!: boolean;
  public contactPhone!: string;
  public contactEmail!: string;
  public website?: string;
  public socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  public isActive!: boolean;
  public isVerified!: boolean;
  public verificationDate?: Date;
  public photos!: string[];
  public rating!: number;
  public totalReviews!: number;
  public policies!: {
    cancellationPolicy: string;
    refundPolicy: string;
    noShowPolicy: string;
    equipmentPolicy: string;
    guestPolicy: string;
    childrenPolicy?: string;
  };
  public pricing!: {
    baseHourlyRate: number;
    currency: 'MXN';
    peakHourMultiplier: number;
    weekendMultiplier: number;
    memberDiscount: number;
    advanceBookingDiscount?: number;
  };
  public bookingSettings!: {
    minAdvanceHours: number;
    maxAdvanceDays: number;
    allowSameDayBooking: boolean;
    requirePaymentUpfront: boolean;
    allowPartialRefunds: boolean;
    autoConfirmBookings: boolean;
  };
  public integrations!: {
    paymentProcessor: 'stripe' | 'paypal' | 'manual';
    calendarSync: boolean;
    posSystem?: string;
  };
  public businessHours!: {
    timezone: string;
    holidaySchedule?: object;
    seasonalHours?: object;
  };
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CourtFacility.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 200]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [10, 2000]
    }
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    field: 'owner_id'
  },
  ownerType: {
    type: DataTypes.ENUM('club', 'independent'),
    allowNull: false,
    field: 'owner_type'
  },
  address: {
    type: DataTypes.STRING(300),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  state: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  zipCode: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: 'zip_code'
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'Mexico'
  },
  coordinates: {
    type: DataTypes.JSONB,
    allowNull: false,
    validate: {
      isValidCoordinates(value: any) {
        if (!value || typeof value !== 'object') {
          throw new Error('Coordinates must be an object');
        }
        if (typeof value.latitude !== 'number' || typeof value.longitude !== 'number') {
          throw new Error('Coordinates must contain numeric latitude and longitude');
        }
        if (value.latitude < -90 || value.latitude > 90) {
          throw new Error('Latitude must be between -90 and 90');
        }
        if (value.longitude < -180 || value.longitude > 180) {
          throw new Error('Longitude must be between -180 and 180');
        }
      }
    }
  },
  totalCourts: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 50
    },
    field: 'total_courts'
  },
  facilityType: {
    type: DataTypes.ENUM('indoor', 'outdoor', 'mixed'),
    allowNull: false,
    field: 'facility_type'
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
  },
  amenities: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: []
  },
  parkingSpaces: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    },
    field: 'parking_spaces'
  },
  hasRestrooms: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'has_restrooms'
  },
  hasShowers: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'has_showers'
  },
  hasProShop: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'has_pro_shop'
  },
  hasRental: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'has_rental'
  },
  contactPhone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: 'contact_phone',
    validate: {
      notEmpty: true
    }
  },
  contactEmail: {
    type: DataTypes.STRING(150),
    allowNull: false,
    field: 'contact_email',
    validate: {
      isEmail: true
    }
  },
  website: {
    type: DataTypes.STRING(300),
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  socialMedia: {
    type: DataTypes.JSONB,
    allowNull: true,
    field: 'social_media'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active'
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_verified'
  },
  verificationDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'verification_date'
  },
  photos: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: []
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5
    }
  },
  totalReviews: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    },
    field: 'total_reviews'
  },
  policies: {
    type: DataTypes.JSONB,
    allowNull: false,
    validate: {
      isValidPolicies(value: any) {
        if (!value || typeof value !== 'object') {
          throw new Error('Policies must be an object');
        }
        const required = ['cancellationPolicy', 'refundPolicy', 'noShowPolicy', 'equipmentPolicy', 'guestPolicy'];
        for (const policy of required) {
          if (!value[policy] || typeof value[policy] !== 'string') {
            throw new Error(`${policy} is required and must be a string`);
          }
        }
      }
    }
  },
  pricing: {
    type: DataTypes.JSONB,
    allowNull: false,
    validate: {
      isValidPricing(value: any) {
        if (!value || typeof value !== 'object') {
          throw new Error('Pricing must be an object');
        }
        if (typeof value.baseHourlyRate !== 'number' || value.baseHourlyRate <= 0) {
          throw new Error('Base hourly rate must be a positive number');
        }
        if (value.currency !== 'MXN') {
          throw new Error('Currency must be MXN');
        }
      }
    }
  },
  bookingSettings: {
    type: DataTypes.JSONB,
    allowNull: false,
    field: 'booking_settings',
    validate: {
      isValidBookingSettings(value: any) {
        if (!value || typeof value !== 'object') {
          throw new Error('Booking settings must be an object');
        }
        const required = ['minAdvanceHours', 'maxAdvanceDays', 'allowSameDayBooking', 'requirePaymentUpfront', 'allowPartialRefunds', 'autoConfirmBookings'];
        for (const setting of required) {
          if (value[setting] === undefined) {
            throw new Error(`${setting} is required in booking settings`);
          }
        }
      }
    }
  },
  integrations: {
    type: DataTypes.JSONB,
    allowNull: false,
    validate: {
      isValidIntegrations(value: any) {
        if (!value || typeof value !== 'object') {
          throw new Error('Integrations must be an object');
        }
        if (!['stripe', 'paypal', 'manual'].includes(value.paymentProcessor)) {
          throw new Error('Payment processor must be stripe, paypal, or manual');
        }
      }
    }
  },
  businessHours: {
    type: DataTypes.JSONB,
    allowNull: false,
    field: 'business_hours',
    validate: {
      isValidBusinessHours(value: any) {
        if (!value || typeof value !== 'object') {
          throw new Error('Business hours must be an object');
        }
        if (!value.timezone || typeof value.timezone !== 'string') {
          throw new Error('Timezone is required in business hours');
        }
      }
    }
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
  modelName: 'CourtFacility',
  tableName: 'court_facilities',
  timestamps: true,
  indexes: [
    {
      fields: ['owner_id']
    },
    {
      fields: ['city', 'state']
    },
    {
      fields: ['is_active', 'is_verified']
    },
    {
      fields: ['facility_type']
    },
    {
      fields: ['rating']
    },
    {
      name: 'court_facilities_coordinates_idx',
      fields: ['coordinates'],
      using: 'gin'
    }
  ]
});

export default CourtFacility;