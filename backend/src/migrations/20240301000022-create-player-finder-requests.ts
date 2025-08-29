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
        model: 'users',
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
      allowNull: true
    },
    game_type: {
      type: DataTypes.ENUM('singles', 'doubles', 'mixed_doubles', 'practice', 'drill', 'lesson', 'any'),
      allowNull: false
    },
    skill_level_min: {
      type: DataTypes.ENUM('2.0', '2.5', '3.0', '3.5', '4.0', '4.5', '5.0', '5.5', '6.0'),
      allowNull: true
    },
    skill_level_max: {
      type: DataTypes.ENUM('2.0', '2.5', '3.0', '3.5', '4.0', '4.5', '5.0', '5.5', '6.0'),
      allowNull: true
    },
    preferred_gender: {
      type: DataTypes.ENUM('male', 'female', 'any'),
      defaultValue: 'any',
      allowNull: false
    },
    age_group_min: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    age_group_max: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    preferred_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    preferred_time_start: {
      type: DataTypes.TIME,
      allowNull: false
    },
    preferred_time_end: {
      type: DataTypes.TIME,
      allowNull: false
    },
    duration_minutes: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    flexible_timing: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    flexible_date: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    date_range_start: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    date_range_end: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    preferred_days: {
      type: DataTypes.JSON,
      allowNull: true
    },
    location_type: {
      type: DataTypes.ENUM('specific_court', 'area', 'anywhere'),
      defaultValue: 'area',
      allowNull: false
    },
    court_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'courts',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    preferred_location: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true
    },
    search_radius_km: {
      type: DataTypes.INTEGER,
      defaultValue: 25,
      allowNull: false
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
    max_cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    cost_sharing: {
      type: DataTypes.ENUM('split_even', 'requester_pays', 'each_pays_own', 'negotiable'),
      defaultValue: 'split_even',
      allowNull: false
    },
    players_needed: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false
    },
    current_players: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false
    },
    max_players: {
      type: DataTypes.INTEGER,
      defaultValue: 4,
      allowNull: false
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
    recurring_end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active', 'matched', 'expired', 'cancelled', 'completed'),
      defaultValue: 'active',
      allowNull: false
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    auto_extend: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    priority: {
      type: DataTypes.ENUM('low', 'normal', 'high', 'urgent'),
      defaultValue: 'normal',
      allowNull: false
    },
    visibility: {
      type: DataTypes.ENUM('public', 'friends_only', 'club_members', 'private'),
      defaultValue: 'public',
      allowNull: false
    },
    allow_beginners: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    coaching_available: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    equipment_provided: {
      type: DataTypes.JSON,
      allowNull: true
    },
    special_requirements: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    contact_method: {
      type: DataTypes.ENUM('in_app', 'email', 'phone', 'whatsapp'),
      defaultValue: 'in_app',
      allowNull: false
    },
    contact_info: {
      type: DataTypes.JSON,
      allowNull: true
    },
    language_preference: {
      type: DataTypes.ENUM('spanish', 'english', 'both'),
      defaultValue: 'spanish',
      allowNull: false
    },
    match_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    view_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    interested_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    notification_sent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    tags: {
      type: DataTypes.JSON,
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
  await queryInterface.addIndex('player_finder_requests', ['requester_id']);
  await queryInterface.addIndex('player_finder_requests', ['court_id']);
  await queryInterface.addIndex('player_finder_requests', ['state_id']);
  await queryInterface.addIndex('player_finder_requests', ['game_type']);
  await queryInterface.addIndex('player_finder_requests', ['skill_level_min']);
  await queryInterface.addIndex('player_finder_requests', ['skill_level_max']);
  await queryInterface.addIndex('player_finder_requests', ['preferred_gender']);
  await queryInterface.addIndex('player_finder_requests', ['preferred_date']);
  await queryInterface.addIndex('player_finder_requests', ['status']);
  await queryInterface.addIndex('player_finder_requests', ['expires_at']);
  await queryInterface.addIndex('player_finder_requests', ['priority']);
  await queryInterface.addIndex('player_finder_requests', ['visibility']);
  await queryInterface.addIndex('player_finder_requests', ['city']);
  await queryInterface.addIndex('player_finder_requests', ['latitude', 'longitude']);
  await queryInterface.addIndex('player_finder_requests', ['is_recurring']);
  await queryInterface.addIndex('player_finder_requests', ['featured']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('player_finder_requests');
}