import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export type RegistrationStatus = 'pending' | 'confirmed' | 'paid' | 'cancelled' | 'waitlisted' | 'rejected';

interface TournamentRegistrationAttributes {
  id: number;
  tournamentId: number;
  categoryId: number;
  playerId: number;
  partnerId?: number;
  status: RegistrationStatus;
  registrationDate: Date;
  paymentId?: number;
  amountPaid: number;
  seedNumber?: number;
  notes?: string;
  emergencyContact: any;
  medicalInformation?: string;
  tshirtSize?: string;
  dietaryRestrictions?: string;
  transportationNeeds?: string;
  accommodationNeeds?: string;
  waiverSigned: boolean;
  waiverSignedDate?: Date;
  checkInTime?: Date;
  isCheckedIn: boolean;
  withdrawalReason?: string;
  withdrawalDate?: Date;
  refundAmount?: number;
  refundProcessedDate?: Date;
}

interface TournamentRegistrationCreationAttributes extends Optional<TournamentRegistrationAttributes, 'id'> {}

class TournamentRegistration extends Model<TournamentRegistrationAttributes, TournamentRegistrationCreationAttributes> implements TournamentRegistrationAttributes {
  public id!: number;
  public tournamentId!: number;
  public categoryId!: number;
  public playerId!: number;
  public partnerId?: number;
  public status!: RegistrationStatus;
  public registrationDate!: Date;
  public paymentId?: number;
  public amountPaid!: number;
  public seedNumber?: number;
  public notes?: string;
  public emergencyContact!: any;
  public medicalInformation?: string;
  public tshirtSize?: string;
  public dietaryRestrictions?: string;
  public transportationNeeds?: string;
  public accommodationNeeds?: string;
  public waiverSigned!: boolean;
  public waiverSignedDate?: Date;
  public checkInTime?: Date;
  public isCheckedIn!: boolean;
  public withdrawalReason?: string;
  public withdrawalDate?: Date;
  public refundAmount?: number;
  public refundProcessedDate?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

TournamentRegistration.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  tournamentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'tournaments', key: 'id' },
    field: 'tournament_id'
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'tournament_categories', key: 'id' },
    field: 'category_id'
  },
  playerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
    field: 'player_id'
  },
  partnerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'users', key: 'id' },
    field: 'partner_id'
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'paid', 'cancelled', 'waitlisted', 'rejected'),
    allowNull: false,
    defaultValue: 'pending'
  },
  registrationDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'registration_date'
  },
  paymentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'payments', key: 'id' },
    field: 'payment_id'
  },
  amountPaid: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'amount_paid'
  },
  seedNumber: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'seed_number'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  emergencyContact: {
    type: DataTypes.JSON,
    allowNull: false,
    field: 'emergency_contact'
  },
  medicalInformation: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'medical_information'
  },
  tshirtSize: {
    type: DataTypes.ENUM('XS', 'S', 'M', 'L', 'XL', 'XXL'),
    allowNull: true,
    field: 'tshirt_size'
  },
  dietaryRestrictions: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'dietary_restrictions'
  },
  transportationNeeds: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'transportation_needs'
  },
  accommodationNeeds: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'accommodation_needs'
  },
  waiverSigned: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'waiver_signed'
  },
  waiverSignedDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'waiver_signed_date'
  },
  checkInTime: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'check_in_time'
  },
  isCheckedIn: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_checked_in'
  },
  withdrawalReason: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'withdrawal_reason'
  },
  withdrawalDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'withdrawal_date'
  },
  refundAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    field: 'refund_amount'
  },
  refundProcessedDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'refund_processed_date'
  },
}, {
  sequelize,
  modelName: 'TournamentRegistration',
  tableName: 'tournament_registrations',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['tournament_id']
    },
    {
      fields: ['category_id']
    },
    {
      fields: ['player_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['registration_date']
    },
    {
      unique: true,
      fields: ['tournament_id', 'category_id', 'player_id']
    }
  ]
});

export default TournamentRegistration;