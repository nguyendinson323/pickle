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
      type: DataTypes.STRING,
      allowNull: false
    },
    bracket_type: {
      type: DataTypes.ENUM('single_elimination', 'double_elimination', 'round_robin', 'swiss', 'pool_play'),
      allowNull: false
    },
    seeding_method: {
      type: DataTypes.ENUM('ranking', 'random', 'manual', 'regional'),
      allowNull: false
    },
    total_rounds: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    current_round: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    is_complete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    winner_player_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    runner_up_player_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    third_place_player_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    fourth_place_player_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    bracket_data: {
      type: DataTypes.JSON,
      allowNull: false
    },
    seeding_data: {
      type: DataTypes.JSON,
      allowNull: true
    },
    settings: {
      type: DataTypes.JSON,
      allowNull: false
    },
    generated_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    finalized_date: {
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
  await queryInterface.addIndex('tournament_brackets', ['tournament_id']);
  await queryInterface.addIndex('tournament_brackets', ['category_id']);
  await queryInterface.addIndex('tournament_brackets', ['bracket_type']);
  await queryInterface.addIndex('tournament_brackets', ['is_complete']);
  await queryInterface.addIndex('tournament_brackets', ['generated_date']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('tournament_brackets');
}