import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('tournament_brackets', {
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
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    bracket_type: {
      type: DataTypes.ENUM('main', 'consolation', 'qualifying', 'playoff', 'loser', 'winner'),
      defaultValue: 'main',
      allowNull: false
    },
    format: {
      type: DataTypes.ENUM('single_elimination', 'double_elimination', 'round_robin', 'swiss', 'ladder'),
      allowNull: false
    },
    total_rounds: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    current_round: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false
    },
    participants_count: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    matches_count: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    completed_matches: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    bracket_data: {
      type: DataTypes.JSON,
      allowNull: true
    },
    seeding_completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    seeding_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    bracket_generated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    bracket_generated_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'active', 'paused', 'completed', 'cancelled'),
      defaultValue: 'pending',
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    end_date: {
      type: DataTypes.DATE,
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
    fourth_place_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    consolation_winner_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    finals_court: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    finals_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    semifinals_courts: {
      type: DataTypes.JSON,
      allowNull: true
    },
    semifinals_times: {
      type: DataTypes.JSON,
      allowNull: true
    },
    display_settings: {
      type: DataTypes.JSON,
      allowNull: true
    },
    publish_bracket: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    publish_results: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    live_scoring: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    allow_score_updates: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    auto_advance_winners: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    require_score_verification: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
  await queryInterface.addIndex('tournament_brackets', ['tournament_id']);
  await queryInterface.addIndex('tournament_brackets', ['category_id']);
  await queryInterface.addIndex('tournament_brackets', ['bracket_type']);
  await queryInterface.addIndex('tournament_brackets', ['format']);
  await queryInterface.addIndex('tournament_brackets', ['status']);
  await queryInterface.addIndex('tournament_brackets', ['current_round']);
  await queryInterface.addIndex('tournament_brackets', ['winner_id']);
  await queryInterface.addIndex('tournament_brackets', ['runner_up_id']);
  await queryInterface.addIndex('tournament_brackets', ['seeding_completed']);
  await queryInterface.addIndex('tournament_brackets', ['bracket_generated']);
  await queryInterface.addIndex('tournament_brackets', ['publish_bracket']);
  await queryInterface.addIndex('tournament_brackets', ['publish_results']);
  await queryInterface.addIndex('tournament_brackets', ['start_date']);
  await queryInterface.addIndex('tournament_brackets', ['end_date']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('tournament_brackets');
}