import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('player_finder_requests', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    requester_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'players',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    skill_level: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    preferred_gender: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    age_range_min: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    age_range_max: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    playing_style: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    max_distance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 25
    },
    location_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'player_locations',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    availability_days: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: []
    },
    availability_time_start: {
      type: DataTypes.TIME,
      allowNull: true
    },
    availability_time_end: {
      type: DataTypes.TIME,
      allowNull: true
    },
    max_players: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 4
    },
    current_players: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    preferences: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {}
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'active'
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
  await queryInterface.addIndex('player_finder_requests', ['requester_id']);
  await queryInterface.addIndex('player_finder_requests', ['skill_level']);
  await queryInterface.addIndex('player_finder_requests', ['location_id']);
  await queryInterface.addIndex('player_finder_requests', ['is_active']);
  await queryInterface.addIndex('player_finder_requests', ['status']);
  await queryInterface.addIndex('player_finder_requests', ['expires_at']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('player_finder_requests');
}