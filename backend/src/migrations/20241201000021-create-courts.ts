import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('courts', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    facility_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'court_facilities',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    court_number: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    court_type: {
      type: DataTypes.ENUM('indoor', 'outdoor'),
      allowNull: false
    },
    surface: {
      type: DataTypes.ENUM('concrete', 'asphalt', 'sport_court', 'acrylic', 'clay', 'grass', 'synthetic'),
      allowNull: false
    },
    dimensions: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    net_height: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: false
    },
    lighting: {
      type: DataTypes.ENUM('none', 'basic', 'professional', 'led'),
      allowNull: false,
      defaultValue: 'none'
    },
    has_lights: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
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
      }
    },
    condition: {
      type: DataTypes.ENUM('excellent', 'good', 'fair', 'needs_repair'),
      allowNull: false,
      defaultValue: 'good'
    },
    last_inspection: {
      type: DataTypes.DATE,
      allowNull: false
    },
    next_maintenance_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    is_available_for_booking: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    booking_notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    hourly_rate: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false
    },
    peak_hour_rate: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false
    },
    currency: {
      type: DataTypes.ENUM('MXN'),
      allowNull: false,
      defaultValue: 'MXN'
    },
    minimum_booking_duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 60
    },
    maximum_booking_duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 180
    },
    advance_booking_days: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 14
    },
    cancellation_deadline_hours: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 24
    },
    equipment_included: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: []
    },
    additional_equipment: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: []
    },
    special_features: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: []
    },
    photos: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: []
    },
    maintenance_history: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    utilization_stats: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {
        totalBookings: 0,
        totalHours: 0,
        averageRating: 0
      }
    },
    restrictions: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {
        memberOnly: false,
        coachRequired: false,
        tournamentUse: false
      }
    },
    operating_hours: {
      type: DataTypes.JSONB,
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

  // Add indexes exactly as defined in the model
  await queryInterface.addIndex('courts', ['facility_id']);
  await queryInterface.addIndex('courts', ['court_number', 'facility_id'], { unique: true });
  await queryInterface.addIndex('courts', ['is_active', 'is_available_for_booking']);
  await queryInterface.addIndex('courts', ['court_type']);
  await queryInterface.addIndex('courts', ['surface']);
  await queryInterface.addIndex('courts', ['condition']);
  await queryInterface.addIndex('courts', ['hourly_rate']);
  await queryInterface.addIndex('courts', ['last_inspection']);
  await queryInterface.addIndex('courts', ['next_maintenance_date']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('courts');
}