import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('player_finder_matches', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    request_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'player_finder_requests',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
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
    matched_player_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    match_type: {
      type: DataTypes.ENUM('perfect', 'good', 'acceptable', 'stretch'),
      allowNull: false
    },
    compatibility_score: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false
    },
    skill_level_compatibility: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },
    location_compatibility: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },
    time_compatibility: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },
    schedule_compatibility: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },
    preference_compatibility: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },
    distance_km: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true
    },
    travel_time_minutes: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('suggested', 'viewed', 'interested', 'contacted', 'accepted', 'rejected', 'expired', 'completed'),
      defaultValue: 'suggested',
      allowNull: false
    },
    interest_level: {
      type: DataTypes.ENUM('none', 'low', 'medium', 'high', 'very_high'),
      defaultValue: 'none',
      allowNull: false
    },
    requester_response: {
      type: DataTypes.ENUM('none', 'interested', 'maybe', 'not_interested', 'contacted'),
      defaultValue: 'none',
      allowNull: false
    },
    matched_player_response: {
      type: DataTypes.ENUM('none', 'interested', 'maybe', 'not_interested', 'contacted'),
      defaultValue: 'none',
      allowNull: false
    },
    mutual_interest: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    contacted_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    response_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    accepted_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    rejected_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    rejection_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    requester_notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    matched_player_notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    final_court_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'courts',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    final_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    final_start_time: {
      type: DataTypes.TIME,
      allowNull: true
    },
    final_end_time: {
      type: DataTypes.TIME,
      allowNull: true
    },
    final_duration_minutes: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    cost_arrangement: {
      type: DataTypes.ENUM('split_even', 'requester_pays', 'matched_player_pays', 'each_pays_own'),
      allowNull: true
    },
    estimated_cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    actual_cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    payment_status: {
      type: DataTypes.ENUM('pending', 'arranged', 'paid', 'disputed'),
      defaultValue: 'pending',
      allowNull: false
    },
    game_completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    completion_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    game_result: {
      type: DataTypes.JSON,
      allowNull: true
    },
    post_game_rating_requester: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5
      }
    },
    post_game_rating_matched: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5
      }
    },
    post_game_feedback_requester: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    post_game_feedback_matched: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    would_play_again_requester: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    would_play_again_matched: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    follow_up_requests: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    became_friends: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    blocked_by_requester: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    blocked_by_matched: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    reported_by_requester: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    reported_by_matched: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    match_quality_rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true
    },
    algorithm_version: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    match_factors: {
      type: DataTypes.JSON,
      allowNull: true
    },
    communication_log: {
      type: DataTypes.JSON,
      allowNull: true
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    priority: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    machine_learning_score: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },
    success_prediction: {
      type: DataTypes.DECIMAL(5, 2),
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
  await queryInterface.addIndex('player_finder_matches', ['request_id']);
  await queryInterface.addIndex('player_finder_matches', ['requester_id']);
  await queryInterface.addIndex('player_finder_matches', ['matched_player_id']);
  await queryInterface.addIndex('player_finder_matches', ['final_court_id']);
  await queryInterface.addIndex('player_finder_matches', ['match_type']);
  await queryInterface.addIndex('player_finder_matches', ['compatibility_score']);
  await queryInterface.addIndex('player_finder_matches', ['status']);
  await queryInterface.addIndex('player_finder_matches', ['interest_level']);
  await queryInterface.addIndex('player_finder_matches', ['mutual_interest']);
  await queryInterface.addIndex('player_finder_matches', ['game_completed']);
  await queryInterface.addIndex('player_finder_matches', ['final_date']);
  await queryInterface.addIndex('player_finder_matches', ['expires_at']);
  await queryInterface.addIndex('player_finder_matches', ['became_friends']);
  await queryInterface.addIndex('player_finder_matches', ['blocked_by_requester']);
  await queryInterface.addIndex('player_finder_matches', ['blocked_by_matched']);
  await queryInterface.addIndex('player_finder_matches', ['distance_km']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('player_finder_matches');
}