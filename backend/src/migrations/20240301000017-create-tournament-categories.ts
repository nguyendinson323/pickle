import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('tournament_categories', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    tournament_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tournaments',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    category_type: {
      type: DataTypes.ENUM('singles', 'doubles', 'mixed_doubles'),
      allowNull: false
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'mixed'),
      allowNull: false
    },
    age_group: {
      type: DataTypes.ENUM('junior', 'youth', 'adult', 'senior', 'open'),
      allowNull: false
    },
    min_age: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    max_age: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    min_ntrp_level: {
      type: DataTypes.ENUM('2.0', '2.5', '3.0', '3.5', '4.0', '4.5', '5.0', '5.5', '6.0'),
      allowNull: true
    },
    max_ntrp_level: {
      type: DataTypes.ENUM('2.0', '2.5', '3.0', '3.5', '4.0', '4.5', '5.0', '5.5', '6.0'),
      allowNull: true
    },
    min_ranking_points: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    max_ranking_points: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    max_participants: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    current_participants: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    min_participants: {
      type: DataTypes.INTEGER,
      defaultValue: 4,
      allowNull: false
    },
    waiting_list_size: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    entry_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    early_bird_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    late_registration_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'MXN',
      allowNull: false
    },
    prize_pool: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    prize_distribution: {
      type: DataTypes.JSON,
      allowNull: true
    },
    trophies: {
      type: DataTypes.JSON,
      allowNull: true
    },
    medals: {
      type: DataTypes.JSON,
      allowNull: true
    },
    format: {
      type: DataTypes.ENUM('single_elimination', 'double_elimination', 'round_robin', 'swiss', 'ladder', 'pool_play'),
      defaultValue: 'single_elimination',
      allowNull: false
    },
    seeding_method: {
      type: DataTypes.ENUM('random', 'ranking', 'manual', 'registration_order'),
      defaultValue: 'ranking',
      allowNull: false
    },
    match_format: {
      type: DataTypes.ENUM('best_of_1', 'best_of_3', 'best_of_5', 'games_to_11', 'games_to_15', 'games_to_21', 'timed'),
      defaultValue: 'best_of_3',
      allowNull: false
    },
    scoring_format: {
      type: DataTypes.ENUM('rally_point', 'side_out', 'no_ad', 'traditional'),
      defaultValue: 'rally_point',
      allowNull: false
    },
    time_limit_minutes: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    max_courts_simultaneous: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false
    },
    estimated_match_duration: {
      type: DataTypes.INTEGER,
      defaultValue: 45,
      allowNull: false
    },
    warm_up_time: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
      allowNull: false
    },
    break_between_matches: {
      type: DataTypes.INTEGER,
      defaultValue: 10,
      allowNull: false
    },
    equipment_provided: {
      type: DataTypes.JSON,
      allowNull: true
    },
    equipment_required: {
      type: DataTypes.JSON,
      allowNull: true
    },
    uniform_requirements: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    special_rules: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'cancelled', 'completed'),
      defaultValue: 'active',
      allowNull: false
    },
    registration_open: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    allow_late_registration: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    enable_waiting_list: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    auto_advance_winners: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    require_medical_clearance: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    require_insurance: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    display_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    scheduled_start_time: {
      type: DataTypes.TIME,
      allowNull: true
    },
    actual_start_time: {
      type: DataTypes.TIME,
      allowNull: true
    },
    completion_time: {
      type: DataTypes.TIME,
      allowNull: true
    },
    winner_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    runner_up_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    third_place_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    results_published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    results_published_at: {
      type: DataTypes.DATE,
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
  await queryInterface.addIndex('tournament_categories', ['tournament_id']);
  await queryInterface.addIndex('tournament_categories', ['category_type']);
  await queryInterface.addIndex('tournament_categories', ['gender']);
  await queryInterface.addIndex('tournament_categories', ['age_group']);
  await queryInterface.addIndex('tournament_categories', ['status']);
  await queryInterface.addIndex('tournament_categories', ['registration_open']);
  await queryInterface.addIndex('tournament_categories', ['display_order']);
  await queryInterface.addIndex('tournament_categories', ['start_date']);
  await queryInterface.addIndex('tournament_categories', ['end_date']);
  await queryInterface.addIndex('tournament_categories', ['winner_id']);
  await queryInterface.addIndex('tournament_categories', ['runner_up_id']);
  await queryInterface.addIndex('tournament_categories', ['third_place_id']);
  await queryInterface.addIndex('tournament_categories', ['results_published']);
  await queryInterface.addIndex('tournament_categories', ['min_ntrp_level']);
  await queryInterface.addIndex('tournament_categories', ['max_ntrp_level']);
  await queryInterface.addIndex('tournament_categories', ['entry_fee']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('tournament_categories');
}