import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('courts', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    surface_type: {
      type: DataTypes.ENUM('indoor', 'outdoor', 'concrete', 'clay', 'artificial_grass'),
      allowNull: false
    },
    owner_type: {
      type: DataTypes.ENUM('club', 'partner'),
      allowNull: false
    },
    owner_id: {
      type: DataTypes.INTEGER,
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
      onDelete: 'RESTRICT'
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false
    },
    amenities: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: []
    },
    hourly_rate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    peak_hour_rate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    weekend_rate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    images: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: []
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    operating_hours: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {
        0: { isOpen: true, startTime: '06:00', endTime: '22:00' },
        1: { isOpen: true, startTime: '06:00', endTime: '22:00' },
        2: { isOpen: true, startTime: '06:00', endTime: '22:00' },
        3: { isOpen: true, startTime: '06:00', endTime: '22:00' },
        4: { isOpen: true, startTime: '06:00', endTime: '22:00' },
        5: { isOpen: true, startTime: '06:00', endTime: '22:00' },
        6: { isOpen: true, startTime: '06:00', endTime: '22:00' }
      }
    },
    max_advance_booking_days: {
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
      defaultValue: 240,
      allowNull: false
    },
    cancellation_policy: {
      type: DataTypes.TEXT,
      defaultValue: 'Cancellations must be made at least 24 hours in advance for a full refund.',
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
  await queryInterface.addIndex('courts', ['owner_type', 'owner_id']);
  await queryInterface.addIndex('courts', ['state_id']);
  await queryInterface.addIndex('courts', ['surface_type']);
  await queryInterface.addIndex('courts', ['is_active']);
  await queryInterface.addIndex('courts', ['latitude', 'longitude']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('courts');
}