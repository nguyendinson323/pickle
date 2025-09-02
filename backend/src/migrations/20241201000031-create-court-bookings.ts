import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('court_bookings', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    court_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'courts',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    booking_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    currency: {
      type: DataTypes.ENUM('MXN'),
      allowNull: false,
      defaultValue: 'MXN'
    },
    payment_status: {
      type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded', 'partially_refunded'),
      allowNull: false,
      defaultValue: 'pending'
    },
    payment_method: {
      type: DataTypes.ENUM('stripe', 'paypal', 'cash', 'transfer'),
      allowNull: true
    },
    payment_reference: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    booking_status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed', 'no_show'),
      allowNull: false,
      defaultValue: 'pending'
    },
    participant_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    participants: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: []
    },
    booking_notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    facility_notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    equipment_requests: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: []
    },
    additional_services: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: []
    },
    recurring_booking: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    cancellation: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    check_in: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    check_out: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    rating: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    weather_conditions: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    pricing: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    contact_info: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    special_requests: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    access_code: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    qr_code: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    reminders_sent: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {
        confirmation: false,
        dayBefore: false,
        hourBefore: false
      }
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    }
  });

  // Add indexes exactly as defined in the model
  await queryInterface.addIndex('court_bookings', ['court_id']);
  await queryInterface.addIndex('court_bookings', ['user_id']);
  await queryInterface.addIndex('court_bookings', ['booking_date', 'start_time', 'end_time']);
  await queryInterface.addIndex('court_bookings', ['booking_status']);
  await queryInterface.addIndex('court_bookings', ['payment_status']);
  await queryInterface.addIndex('court_bookings', ['booking_date']);
  await queryInterface.addIndex('court_bookings', ['is_active']);
  
  // Create unique constraint for time conflict prevention
  await queryInterface.addIndex('court_bookings', ['court_id', 'booking_date', 'start_time', 'end_time'], {
    name: 'court_booking_time_conflict',
    unique: true,
    where: {
      booking_status: ['confirmed', 'pending'],
      is_active: true
    }
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('court_bookings');
}