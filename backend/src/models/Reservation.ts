import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export type ReservationStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';

interface ReservationAttributes {
  id: number;
  courtId: number;
  userId: number;
  reservationDate: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  baseRate: number;
  peakRateMultiplier: number;
  weekendRateMultiplier: number;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  paymentId?: number;
  status: ReservationStatus;
  notes?: string;
  checkInTime?: Date;
  checkOutTime?: Date;
  actualDuration?: number;
  rating?: number;
  review?: string;
  cancellationReason?: string;
  cancelledAt?: Date;
  refundAmount?: number;
  refundProcessedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface ReservationCreationAttributes extends Optional<ReservationAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Reservation extends Model<ReservationAttributes, ReservationCreationAttributes> implements ReservationAttributes {
  public id!: number;
  public courtId!: number;
  public userId!: number;
  public reservationDate!: string;
  public startTime!: string;
  public endTime!: string;
  public duration!: number;
  public baseRate!: number;
  public peakRateMultiplier!: number;
  public weekendRateMultiplier!: number;
  public subtotal!: number;
  public taxAmount!: number;
  public totalAmount!: number;
  public paymentId?: number;
  public status!: ReservationStatus;
  public notes?: string;
  public checkInTime?: Date;
  public checkOutTime?: Date;
  public actualDuration?: number;
  public rating?: number;
  public review?: string;
  public cancellationReason?: string;
  public cancelledAt?: Date;
  public refundAmount?: number;
  public refundProcessedAt?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Reservation.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  courtId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'courts', key: 'id' },
    field: 'court_id'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
    field: 'user_id'
  },
  reservationDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'reservation_date'
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false,
    field: 'start_time'
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false,
    field: 'end_time'
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 30 // minimum 30 minutes
    }
  },
  baseRate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'base_rate'
  },
  peakRateMultiplier: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 1.0,
    field: 'peak_rate_multiplier'
  },
  weekendRateMultiplier: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 1.0,
    field: 'weekend_rate_multiplier'
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  taxAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'tax_amount'
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'total_amount'
  },
  paymentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'payments', key: 'id' },
    field: 'payment_id'
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled', 'no_show'),
    allowNull: false,
    defaultValue: 'pending'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  checkInTime: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'check_in_time'
  },
  checkOutTime: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'check_out_time'
  },
  actualDuration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'actual_duration'
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  },
  review: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  cancellationReason: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'cancellation_reason'
  },
  cancelledAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'cancelled_at'
  },
  refundAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    field: 'refund_amount'
  },
  refundProcessedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'refund_processed_at'
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
  modelName: 'Reservation',
  tableName: 'reservations',
  timestamps: true,
  indexes: [
    {
      fields: ['court_id']
    },
    {
      fields: ['user_id']
    },
    {
      fields: ['reservation_date']
    },
    {
      fields: ['status']
    },
    {
      fields: ['court_id', 'reservation_date', 'start_time', 'end_time'],
      unique: false // Allow overlapping only for cancelled reservations
    },
    {
      fields: ['created_at']
    }
  ]
});

export default Reservation;