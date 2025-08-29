import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('player_locations', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
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
      allowNull: true
    },
    state_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'states',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    postal_code: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    location_name: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    location_type: {
      type: DataTypes.ENUM('home', 'work', 'preferred_court', 'frequent_location', 'other'),
      defaultValue: 'home',
      allowNull: false
    },
    is_primary: {
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
    accuracy_meters: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    last_updated: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    update_frequency: {
      type: DataTypes.ENUM('never', 'manual', 'hourly', 'daily', 'weekly', 'on_play'),
      defaultValue: 'manual',
      allowNull: false
    },
    auto_share_location: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    share_with_friends: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    share_with_clubs: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    max_travel_distance_km: {
      type: DataTypes.INTEGER,
      defaultValue: 25,
      allowNull: false
    },
    preferred_courts: {
      type: DataTypes.JSON,
      allowNull: true
    },
    avoid_areas: {
      type: DataTypes.JSON,
      allowNull: true
    },
    transportation_methods: {
      type: DataTypes.JSON,
      allowNull: true
    },
    availability_radius_km: {
      type: DataTypes.INTEGER,
      defaultValue: 15,
      allowNull: false
    },
    timezone: {
      type: DataTypes.STRING(50),
      defaultValue: 'America/Mexico_City',
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT,
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
  await queryInterface.addIndex('player_locations', ['user_id']);
  await queryInterface.addIndex('player_locations', ['state_id']);
  await queryInterface.addIndex('player_locations', ['location_type']);
  await queryInterface.addIndex('player_locations', ['is_primary']);
  await queryInterface.addIndex('player_locations', ['is_active']);
  await queryInterface.addIndex('player_locations', ['is_public']);
  await queryInterface.addIndex('player_locations', ['city']);
  await queryInterface.addIndex('player_locations', ['postal_code']);
  await queryInterface.addIndex('player_locations', ['latitude', 'longitude']);
  await queryInterface.addIndex('player_locations', ['last_updated']);
  await queryInterface.addIndex('player_locations', ['auto_share_location']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('player_locations');
}