import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('player_rankings', {
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
    ranking_type: {
      type: DataTypes.ENUM('national', 'state', 'regional', 'club', 'age_group', 'gender'),
      allowNull: false
    },
    category: {
      type: DataTypes.ENUM('singles', 'doubles', 'mixed_doubles', 'overall'),
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
    current_rank: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    previous_rank: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    best_rank: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    worst_rank: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rank_change: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    current_points: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    previous_points: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    best_points: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    points_change: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    total_tournaments: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    tournaments_won: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    tournaments_final: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    tournaments_semifinal: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    tournaments_quarterfinal: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    win_percentage: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.00,
      allowNull: false
    },
    total_matches: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    matches_won: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    matches_lost: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    sets_won: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    sets_lost: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    games_won: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    games_lost: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    points_won: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    points_lost: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    current_streak: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    longest_win_streak: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    longest_lose_streak: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    ranking_period: {
      type: DataTypes.ENUM('weekly', 'monthly', 'quarterly', 'annual'),
      defaultValue: 'monthly',
      allowNull: false
    },
    calculation_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    valid_from: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    valid_until: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    is_provisional: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    minimum_tournaments_met: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    minimum_tournaments_required: {
      type: DataTypes.INTEGER,
      defaultValue: 3,
      allowNull: false
    },
    activity_score: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.00,
      allowNull: false
    },
    consistency_score: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.00,
      allowNull: false
    },
    performance_trend: {
      type: DataTypes.ENUM('improving', 'stable', 'declining'),
      defaultValue: 'stable',
      allowNull: false
    },
    last_tournament_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    last_tournament_result: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    next_tournament_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    season_year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    season_points_earned: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    bonus_points: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    penalty_points: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    adjusted_points: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    ranking_algorithm_version: {
      type: DataTypes.STRING(20),
      defaultValue: '1.0',
      allowNull: false
    },
    calculation_details: {
      type: DataTypes.JSON,
      allowNull: true
    },
    historical_data: {
      type: DataTypes.JSON,
      allowNull: true
    },
    achievements: {
      type: DataTypes.JSON,
      allowNull: true
    },
    notable_wins: {
      type: DataTypes.JSON,
      allowNull: true
    },
    records: {
      type: DataTypes.JSON,
      allowNull: true
    },
    statistics: {
      type: DataTypes.JSON,
      allowNull: true
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    verified_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    verified_at: {
      type: DataTypes.DATE,
      allowNull: true
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
  await queryInterface.addIndex('player_rankings', ['user_id']);
  await queryInterface.addIndex('player_rankings', ['state_id']);
  await queryInterface.addIndex('player_rankings', ['verified_by']);
  await queryInterface.addIndex('player_rankings', ['ranking_type']);
  await queryInterface.addIndex('player_rankings', ['category']);
  await queryInterface.addIndex('player_rankings', ['gender']);
  await queryInterface.addIndex('player_rankings', ['age_group']);
  await queryInterface.addIndex('player_rankings', ['current_rank']);
  await queryInterface.addIndex('player_rankings', ['current_points']);
  await queryInterface.addIndex('player_rankings', ['calculation_date']);
  await queryInterface.addIndex('player_rankings', ['valid_from']);
  await queryInterface.addIndex('player_rankings', ['valid_until']);
  await queryInterface.addIndex('player_rankings', ['is_active']);
  await queryInterface.addIndex('player_rankings', ['is_provisional']);
  await queryInterface.addIndex('player_rankings', ['season_year']);
  await queryInterface.addIndex('player_rankings', ['performance_trend']);
  await queryInterface.addIndex('player_rankings', ['verified']);
  await queryInterface.addIndex('player_rankings', ['ranking_type', 'category', 'gender']);
  await queryInterface.addIndex('player_rankings', ['user_id', 'ranking_type', 'category']);
  await queryInterface.addIndex('player_rankings', ['current_rank', 'ranking_type']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('player_rankings');
}