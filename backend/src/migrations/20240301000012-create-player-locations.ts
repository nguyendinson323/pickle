import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('player_locations', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    player_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    zip_code: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'Mexico'
    },
    is_current_location: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    is_travel_location: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    travel_start_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    travel_end_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    location_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    search_radius: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 25
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    privacy_level: {
      type: DataTypes.ENUM('exact', 'city', 'state'),
      allowNull: false,
      defaultValue: 'city'
    },
    accuracy: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    last_updated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
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
  await queryInterface.addIndex('player_locations', ['player_id']);
  await queryInterface.addIndex('player_locations', ['latitude', 'longitude']);
  await queryInterface.addIndex('player_locations', ['city', 'state']);
  await queryInterface.addIndex('player_locations', ['is_active', 'is_current_location']);
  await queryInterface.addIndex('player_locations', ['is_travel_location', 'travel_start_date', 'travel_end_date']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('player_locations');
}