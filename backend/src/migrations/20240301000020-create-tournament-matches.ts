import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('tournament_matches', {
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
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tournament_categories',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    bracket_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tournament_brackets',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
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
    match_number: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    round_number: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    match_position: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    player1_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    player1_partner_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    player2_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    player2_partner_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    team1_name: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    team2_name: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    team1_seed: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    team2_seed: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    scheduled_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    scheduled_time: {
      type: DataTypes.TIME,
      allowNull: true
    },
    actual_start_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    actual_end_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    duration_minutes: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    court_assignment: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    referee_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    line_judge_ids: {
      type: DataTypes.JSON,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('scheduled', 'in_progress', 'completed', 'cancelled', 'postponed', 'forfeited', 'no_contest'),
      defaultValue: 'scheduled',
      allowNull: false
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
    winner_partner_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    loser_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    loser_partner_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    team1_score: {
      type: DataTypes.JSON,
      allowNull: true
    },
    team2_score: {
      type: DataTypes.JSON,
      allowNull: true
    },
    final_score: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    sets_won_team1: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    sets_won_team2: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    games_won_team1: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    games_won_team2: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    points_won_team1: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    points_won_team2: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
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
    timeout_team1: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    timeout_team2: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    medical_timeout_team1: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    medical_timeout_team2: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    weather_conditions: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    temperature: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    wind_speed: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    humidity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    court_conditions: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    incidents: {
      type: DataTypes.JSON,
      allowNull: true
    },
    injuries: {
      type: DataTypes.JSON,
      allowNull: true
    },
    penalties: {
      type: DataTypes.JSON,
      allowNull: true
    },
    code_violations: {
      type: DataTypes.JSON,
      allowNull: true
    },
    challenges_team1: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    challenges_team2: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    successful_challenges_team1: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    successful_challenges_team2: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    forfeit_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    postpone_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    reschedule_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    reschedule_time: {
      type: DataTypes.TIME,
      allowNull: true
    },
    live_scoring: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    live_streaming_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    video_recording_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    match_photos: {
      type: DataTypes.JSON,
      allowNull: true
    },
    match_highlights: {
      type: DataTypes.JSON,
      allowNull: true
    },
    post_match_interview: {
      type: DataTypes.JSON,
      allowNull: true
    },
    statistics: {
      type: DataTypes.JSON,
      allowNull: true
    },
    play_by_play: {
      type: DataTypes.JSON,
      allowNull: true
    },
    referee_notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    admin_notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    spectator_count: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ticket_revenue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    broadcast_audience: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    social_media_mentions: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    next_match_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tournament_matches',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    loser_next_match_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tournament_matches',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    is_featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    is_final: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    is_semifinal: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    is_quarterfinal: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    score_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    score_verified_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    score_verified_at: {
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
  await queryInterface.addIndex('tournament_matches', ['tournament_id']);
  await queryInterface.addIndex('tournament_matches', ['category_id']);
  await queryInterface.addIndex('tournament_matches', ['bracket_id']);
  await queryInterface.addIndex('tournament_matches', ['court_id']);
  await queryInterface.addIndex('tournament_matches', ['player1_id']);
  await queryInterface.addIndex('tournament_matches', ['player2_id']);
  await queryInterface.addIndex('tournament_matches', ['player1_partner_id']);
  await queryInterface.addIndex('tournament_matches', ['player2_partner_id']);
  await queryInterface.addIndex('tournament_matches', ['winner_id']);
  await queryInterface.addIndex('tournament_matches', ['referee_id']);
  await queryInterface.addIndex('tournament_matches', ['status']);
  await queryInterface.addIndex('tournament_matches', ['scheduled_date']);
  await queryInterface.addIndex('tournament_matches', ['scheduled_time']);
  await queryInterface.addIndex('tournament_matches', ['round_number']);
  await queryInterface.addIndex('tournament_matches', ['match_number']);
  await queryInterface.addIndex('tournament_matches', ['is_featured']);
  await queryInterface.addIndex('tournament_matches', ['is_final']);
  await queryInterface.addIndex('tournament_matches', ['is_semifinal']);
  await queryInterface.addIndex('tournament_matches', ['score_verified']);
  await queryInterface.addIndex('tournament_matches', ['next_match_id']);
  await queryInterface.addIndex('tournament_matches', ['loser_next_match_id']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('tournament_matches');
}