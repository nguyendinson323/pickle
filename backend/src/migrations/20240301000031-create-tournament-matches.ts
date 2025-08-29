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
      allowNull: true,
      references: {
        model: 'tournament_brackets',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    round: {
      type: DataTypes.ENUM('qualification', 'round_32', 'round_16', 'quarterfinal', 'semifinal', 'final', 'bronze_match'),
      allowNull: false
    },
    match_number: {
      type: DataTypes.INTEGER,
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
    score: {
      type: DataTypes.JSON,
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
    status: {
      type: DataTypes.ENUM('scheduled', 'in_progress', 'completed', 'walkover', 'retired', 'cancelled', 'postponed'),
      allowNull: false,
      defaultValue: 'scheduled'
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
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    video_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    live_stream_url: {
      type: DataTypes.STRING,
      allowNull: true
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
    prev_match1_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tournament_matches',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    prev_match2_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tournament_matches',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    is_third_place_match: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    court_assignment: {
      type: DataTypes.STRING,
      allowNull: true
    },
    warmup_time: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    estimated_duration: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    spectator_count: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    weather_conditions: {
      type: DataTypes.STRING,
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
  await queryInterface.addIndex('tournament_matches', ['status']);
  await queryInterface.addIndex('tournament_matches', ['scheduled_date', 'scheduled_time']);
  await queryInterface.addIndex('tournament_matches', ['court_id']);
  await queryInterface.addIndex('tournament_matches', ['referee_id']);
  await queryInterface.addIndex('tournament_matches', ['round']);
  await queryInterface.addIndex('tournament_matches', ['bracket_id']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('tournament_matches');
}