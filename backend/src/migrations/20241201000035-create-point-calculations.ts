import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('point_calculations', {
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
    player_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'players',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    match_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tournament_matches',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    base_points: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false
    },
    placement_multiplier: {
      type: DataTypes.DECIMAL(5, 4),
      allowNull: false
    },
    level_multiplier: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false
    },
    opponent_bonus: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
      defaultValue: 0
    },
    activity_bonus: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
      defaultValue: 0
    },
    participation_bonus: {
      type: DataTypes.DECIMAL(5, 4),
      allowNull: false,
      defaultValue: 1.0
    },
    total_points: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    final_placement: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_players: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    matches_won: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    matches_lost: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    average_opponent_rating: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
      defaultValue: 0
    },
    calculation_details: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {}
    },
    calculated_at: {
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
  await queryInterface.addIndex('point_calculations', ['tournament_id']);
  await queryInterface.addIndex('point_calculations', ['player_id']);
  await queryInterface.addIndex('point_calculations', ['match_id']);
  await queryInterface.addIndex('point_calculations', ['calculated_at']);
  await queryInterface.addIndex('point_calculations', ['tournament_id', 'player_id'], { unique: true });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('point_calculations');
}