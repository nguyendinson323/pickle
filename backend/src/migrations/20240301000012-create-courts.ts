import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('courts', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    owner_type: {
      type: DataTypes.ENUM('club', 'partner', 'state', 'federation'),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    court_number: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    surface_type: {
      type: DataTypes.ENUM('concrete', 'asphalt', 'acrylic', 'cushioned', 'clay', 'grass', 'indoor', 'other'),
      allowNull: false
    },
    court_type: {
      type: DataTypes.ENUM('outdoor', 'indoor', 'covered'),
      allowNull: false
    },
    lighting: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    lighting_type: {
      type: DataTypes.ENUM('LED', 'halogen', 'fluorescent', 'natural', 'other'),
      allowNull: true
    },
    net_height: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: true
    },
    court_length: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },
    court_width: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    state_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'states',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    postal_code: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true
    },
    amenities: {
      type: DataTypes.JSON,
      allowNull: true
    },
    facilities: {
      type: DataTypes.JSON,
      allowNull: true
    },
    equipment_available: {
      type: DataTypes.JSON,
      allowNull: true
    },
    images: {
      type: DataTypes.JSON,
      allowNull: true
    },
    hourly_rate: {
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
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'MXN',
      allowNull: false
    },
    operating_hours: {
      type: DataTypes.JSON,
      allowNull: true
    },
    peak_hours: {
      type: DataTypes.JSON,
      allowNull: true
    },
    booking_advance_limit: {
      type: DataTypes.INTEGER,
      defaultValue: 30,
      allowNull: false
    },
    min_booking_duration: {
      type: DataTypes.INTEGER,
      defaultValue: 60,
      allowNull: false
    },
    max_booking_duration: {
      type: DataTypes.INTEGER,
      defaultValue: 180,
      allowNull: false
    },
    booking_increment: {
      type: DataTypes.INTEGER,
      defaultValue: 30,
      allowNull: false
    },
    cancellation_policy: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cancellation_fee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      allowNull: false
    },
    no_show_fee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      allowNull: false
    },
    deposit_required: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    deposit_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      allowNull: false
    },
    rules: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    contact_phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    contact_email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    parking_available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    wheelchair_accessible: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    restrooms_nearby: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    water_fountain: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    seating_available: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    pro_shop: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    equipment_rental: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    coaching_available: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    tournaments_hosted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    is_public: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    requires_membership: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    allows_tournaments: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    maintenance_notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    last_maintenance_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    next_maintenance_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    condition_rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true
    },
    safety_rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true
    },
    average_rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true
    },
    total_reviews: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    total_bookings: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    is_featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
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
  await queryInterface.addIndex('courts', ['owner_id']);
  await queryInterface.addIndex('courts', ['owner_type']);
  await queryInterface.addIndex('courts', ['state_id']);
  await queryInterface.addIndex('courts', ['city']);
  await queryInterface.addIndex('courts', ['postal_code']);
  await queryInterface.addIndex('courts', ['surface_type']);
  await queryInterface.addIndex('courts', ['court_type']);
  await queryInterface.addIndex('courts', ['lighting']);
  await queryInterface.addIndex('courts', ['hourly_rate']);
  await queryInterface.addIndex('courts', ['is_active']);
  await queryInterface.addIndex('courts', ['is_public']);
  await queryInterface.addIndex('courts', ['is_featured']);
  await queryInterface.addIndex('courts', ['requires_membership']);
  await queryInterface.addIndex('courts', ['average_rating']);
  await queryInterface.addIndex('courts', ['latitude', 'longitude']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('courts');
}