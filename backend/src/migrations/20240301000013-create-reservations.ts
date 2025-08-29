import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('reservations', {
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
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    reservation_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    reservation_date: {
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
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed', 'no_show', 'refunded'),
      defaultValue: 'pending',
      allowNull: false
    },
    base_rate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    peak_rate_multiplier: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 1.00,
      allowNull: false
    },
    weekend_rate_multiplier: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 1.00,
      allowNull: false
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    tax_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      allowNull: false
    },
    discount_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      allowNull: false
    },
    deposit_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      allowNull: false
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'MXN',
      allowNull: false
    },
    payment_status: {
      type: DataTypes.ENUM('pending', 'partial', 'paid', 'refunded', 'failed'),
      defaultValue: 'pending',
      allowNull: false
    },
    payment_method: {
      type: DataTypes.ENUM('credit_card', 'debit_card', 'cash', 'bank_transfer', 'paypal', 'other'),
      allowNull: true
    },
    payment_intent_id: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    stripe_session_id: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    transaction_id: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    receipt_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    discount_code: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    players: {
      type: DataTypes.JSON,
      allowNull: true
    },
    player_count: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false
    },
    game_type: {
      type: DataTypes.ENUM('singles', 'doubles', 'mixed_doubles', 'practice', 'lesson', 'tournament', 'other'),
      defaultValue: 'doubles',
      allowNull: false
    },
    skill_level: {
      type: DataTypes.ENUM('2.0', '2.5', '3.0', '3.5', '4.0', '4.5', '5.0', '5.5', '6.0'),
      allowNull: true
    },
    is_recurring: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    recurring_pattern: {
      type: DataTypes.JSON,
      allowNull: true
    },
    parent_reservation_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'reservations',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    booking_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    confirmation_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    cancellation_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    cancellation_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cancellation_fee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      allowNull: false
    },
    refund_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      allowNull: false
    },
    refund_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    checked_in_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    checked_out_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    no_show_fee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      allowNull: false
    },
    late_arrival_minutes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    early_departure_minutes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    equipment_rental: {
      type: DataTypes.JSON,
      allowNull: true
    },
    equipment_rental_fee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      allowNull: false
    },
    additional_services: {
      type: DataTypes.JSON,
      allowNull: true
    },
    additional_services_fee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      allowNull: false
    },
    special_requests: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    internal_notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    customer_notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    weather_conditions: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    temperature: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    humidity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    wind_speed: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rating_given: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true
    },
    review_given: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    would_recommend: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    reminder_sent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    reminder_sent_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    follow_up_sent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    follow_up_sent_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true
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

  // Add indexes
  await queryInterface.addIndex('reservations', ['court_id']);
  await queryInterface.addIndex('reservations', ['user_id']);
  await queryInterface.addIndex('reservations', ['reservation_number'], { unique: true });
  await queryInterface.addIndex('reservations', ['reservation_date']);
  await queryInterface.addIndex('reservations', ['start_time']);
  await queryInterface.addIndex('reservations', ['end_time']);
  await queryInterface.addIndex('reservations', ['status']);
  await queryInterface.addIndex('reservations', ['payment_status']);
  await queryInterface.addIndex('reservations', ['game_type']);
  await queryInterface.addIndex('reservations', ['skill_level']);
  await queryInterface.addIndex('reservations', ['is_recurring']);
  await queryInterface.addIndex('reservations', ['parent_reservation_id']);
  await queryInterface.addIndex('reservations', ['booking_date']);
  await queryInterface.addIndex('reservations', ['total_amount']);
  await queryInterface.addIndex('reservations', ['reservation_date', 'start_time', 'court_id']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('reservations');
}