import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface CourtBookingAttributes {
  id: number;
  courtId: number;
  userId: number;
  bookingDate: Date;
  startTime: string;
  endTime: string;
  duration: number;
  totalAmount: number;
  currency: 'MXN';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
  paymentMethod?: 'stripe' | 'paypal' | 'cash' | 'transfer';
  paymentReference?: string;
  bookingStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  participantCount: number;
  participants: {
    userId?: number;
    name: string;
    email?: string;
    phone?: string;
    isGuest: boolean;
  }[];
  bookingNotes?: string;
  facilityNotes?: string;
  equipmentRequests: string[];
  additionalServices: {
    service: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  recurringBooking?: {
    isRecurring: boolean;
    frequency: 'weekly' | 'biweekly' | 'monthly';
    endDate: Date;
    totalOccurrences: number;
    completedOccurrences: number;
  };
  cancellation?: {
    cancelledAt: Date;
    cancelledBy: number;
    reason: string;
    refundAmount: number;
    refundProcessed: boolean;
  };
  checkIn?: {
    checkedInAt: Date;
    checkedInBy: number;
    lateArrival: boolean;
    minutesLate?: number;
  };
  checkOut?: {
    checkedOutAt: Date;
    checkedOutBy: number;
    earlyDeparture: boolean;
    minutesEarly?: number;
  };
  rating?: {
    courtRating: number;
    facilityRating: number;
    serviceRating: number;
    overallRating: number;
    review?: string;
    ratedAt: Date;
  };
  weatherConditions?: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    conditions: string;
    weatherAlert: boolean;
  };
  pricing: {
    baseRate: number;
    peakHourMultiplier: number;
    weekendMultiplier: number;
    memberDiscount: number;
    promoDiscount: number;
    taxAmount: number;
    serviceFee: number;
  };
  contactInfo: {
    primaryPhone: string;
    secondaryPhone?: string;
    emergencyContact?: {
      name: string;
      phone: string;
      relationship: string;
    };
  };
  specialRequests?: string;
  accessCode?: string;
  qrCode?: string;
  remindersSent: {
    confirmation: boolean;
    dayBefore: boolean;
    hourBefore: boolean;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface CourtBookingCreationAttributes extends Optional<CourtBookingAttributes, 'id' | 'createdAt' | 'updatedAt' | 'bookingNotes' | 'facilityNotes' | 'paymentMethod' | 'paymentReference' | 'recurringBooking' | 'cancellation' | 'checkIn' | 'checkOut' | 'rating' | 'weatherConditions' | 'specialRequests' | 'accessCode' | 'qrCode'> {}

class CourtBooking extends Model<CourtBookingAttributes, CourtBookingCreationAttributes> implements CourtBookingAttributes {
  public id!: number;
  public courtId!: number;
  public userId!: number;
  public bookingDate!: Date;
  public startTime!: string;
  public endTime!: string;
  public duration!: number;
  public totalAmount!: number;
  public currency!: 'MXN';
  public paymentStatus!: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
  public paymentMethod?: 'stripe' | 'paypal' | 'cash' | 'transfer';
  public paymentReference?: string;
  public bookingStatus!: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  public participantCount!: number;
  public participants!: {
    userId?: number;
    name: string;
    email?: string;
    phone?: string;
    isGuest: boolean;
  }[];
  public bookingNotes?: string;
  public facilityNotes?: string;
  public equipmentRequests!: string[];
  public additionalServices!: {
    service: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  public recurringBooking?: {
    isRecurring: boolean;
    frequency: 'weekly' | 'biweekly' | 'monthly';
    endDate: Date;
    totalOccurrences: number;
    completedOccurrences: number;
  };
  public cancellation?: {
    cancelledAt: Date;
    cancelledBy: number;
    reason: string;
    refundAmount: number;
    refundProcessed: boolean;
  };
  public checkIn?: {
    checkedInAt: Date;
    checkedInBy: number;
    lateArrival: boolean;
    minutesLate?: number;
  };
  public checkOut?: {
    checkedOutAt: Date;
    checkedOutBy: number;
    earlyDeparture: boolean;
    minutesEarly?: number;
  };
  public rating?: {
    courtRating: number;
    facilityRating: number;
    serviceRating: number;
    overallRating: number;
    review?: string;
    ratedAt: Date;
  };
  public weatherConditions?: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    conditions: string;
    weatherAlert: boolean;
  };
  public pricing!: {
    baseRate: number;
    peakHourMultiplier: number;
    weekendMultiplier: number;
    memberDiscount: number;
    promoDiscount: number;
    taxAmount: number;
    serviceFee: number;
  };
  public contactInfo!: {
    primaryPhone: string;
    secondaryPhone?: string;
    emergencyContact?: {
      name: string;
      phone: string;
      relationship: string;
    };
  };
  public specialRequests?: string;
  public accessCode?: string;
  public qrCode?: string;
  public remindersSent!: {
    confirmation: boolean;
    dayBefore: boolean;
    hourBefore: boolean;
  };
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CourtBooking.init({
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
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    field: 'user_id'
  },
  bookingDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'booking_date',
    validate: {
      isAfter: new Date().toDateString()
    }
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false,
    field: 'start_time',
    validate: {
      is: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
    }
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false,
    field: 'end_time',
    validate: {
      is: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
    }
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 30,
      max: 480
    }
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'total_amount',
    validate: {
      min: 0
    }
  },
  currency: {
    type: DataTypes.ENUM('MXN'),
    allowNull: false,
    defaultValue: 'MXN'
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded', 'partially_refunded'),
    allowNull: false,
    defaultValue: 'pending',
    field: 'payment_status'
  },
  paymentMethod: {
    type: DataTypes.ENUM('stripe', 'paypal', 'cash', 'transfer'),
    allowNull: true,
    field: 'payment_method'
  },
  paymentReference: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'payment_reference'
  },
  bookingStatus: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed', 'no_show'),
    allowNull: false,
    defaultValue: 'pending',
    field: 'booking_status'
  },
  participantCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    field: 'participant_count',
    validate: {
      min: 1,
      max: 4
    }
  },
  participants: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: [],
    validate: {
      isValidParticipants(value: any) {
        if (!Array.isArray(value)) {
          throw new Error('Participants must be an array');
        }
        for (const participant of value) {
          if (!participant.name || typeof participant.name !== 'string') {
            throw new Error('Each participant must have a name');
          }
          if (typeof participant.isGuest !== 'boolean') {
            throw new Error('Each participant must specify if they are a guest');
          }
        }
      }
    }
  },
  bookingNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'booking_notes'
  },
  facilityNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'facility_notes'
  },
  equipmentRequests: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: [],
    field: 'equipment_requests'
  },
  additionalServices: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: [],
    field: 'additional_services',
    validate: {
      isValidServices(value: any) {
        if (!Array.isArray(value)) {
          throw new Error('Additional services must be an array');
        }
        for (const service of value) {
          if (!service.service || typeof service.service !== 'string') {
            throw new Error('Each service must have a service name');
          }
          if (typeof service.quantity !== 'number' || service.quantity <= 0) {
            throw new Error('Each service must have a positive quantity');
          }
          if (typeof service.unitPrice !== 'number' || service.unitPrice < 0) {
            throw new Error('Each service must have a valid unit price');
          }
        }
      }
    }
  },
  recurringBooking: {
    type: DataTypes.JSONB,
    allowNull: true,
    field: 'recurring_booking'
  },
  cancellation: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  checkIn: {
    type: DataTypes.JSONB,
    allowNull: true,
    field: 'check_in'
  },
  checkOut: {
    type: DataTypes.JSONB,
    allowNull: true,
    field: 'check_out'
  },
  rating: {
    type: DataTypes.JSONB,
    allowNull: true,
    validate: {
      isValidRating(value: any) {
        if (value && typeof value === 'object') {
          const ratings = ['courtRating', 'facilityRating', 'serviceRating', 'overallRating'];
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
  weatherConditions: {
    type: DataTypes.JSONB,
    allowNull: true,
    field: 'weather_conditions'
  },
  pricing: {
    type: DataTypes.JSONB,
    allowNull: false,
    validate: {
      isValidPricing(value: any) {
        if (!value || typeof value !== 'object') {
          throw new Error('Pricing must be an object');
        }
        const required = ['baseRate', 'peakHourMultiplier', 'weekendMultiplier', 'memberDiscount', 'promoDiscount', 'taxAmount', 'serviceFee'];
        for (const field of required) {
          if (typeof value[field] !== 'number') {
            throw new Error(`${field} must be a number`);
          }
        }
      }
    }
  },
  contactInfo: {
    type: DataTypes.JSONB,
    allowNull: false,
    field: 'contact_info',
    validate: {
      isValidContactInfo(value: any) {
        if (!value || typeof value !== 'object') {
          throw new Error('Contact info must be an object');
        }
        if (!value.primaryPhone || typeof value.primaryPhone !== 'string') {
          throw new Error('Primary phone is required');
        }
      }
    }
  },
  specialRequests: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'special_requests'
  },
  accessCode: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'access_code'
  },
  qrCode: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'qr_code'
  },
  remindersSent: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {
      confirmation: false,
      dayBefore: false,
      hourBefore: false
    },
    field: 'reminders_sent',
    validate: {
      isValidReminders(value: any) {
        if (!value || typeof value !== 'object') {
          throw new Error('Reminders sent must be an object');
        }
        const required = ['confirmation', 'dayBefore', 'hourBefore'];
        for (const field of required) {
          if (typeof value[field] !== 'boolean') {
            throw new Error(`${field} must be a boolean`);
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
  modelName: 'CourtBooking',
  tableName: 'court_bookings',
  timestamps: true,
  indexes: [
    {
      fields: ['court_id']
    },
    {
      fields: ['user_id']
    },
    {
      fields: ['booking_date', 'start_time', 'end_time']
    },
    {
      fields: ['booking_status']
    },
    {
      fields: ['payment_status']
    },
    {
      fields: ['booking_date']
    },
    {
      fields: ['is_active']
    },
    {
      name: 'court_booking_time_conflict',
      fields: ['court_id', 'booking_date', 'start_time', 'end_time'],
      unique: true,
      where: {
        booking_status: ['confirmed', 'pending'],
        is_active: true
      }
    }
  ]
});

export default CourtBooking;