import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('ranking_history', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
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
    ranking_type: {
      type: DataTypes.ENUM('overall', 'singles', 'doubles', 'mixed_doubles'),
      allowNull: false
    },
    category: {
      type: DataTypes.ENUM('national', 'state', 'age_group', 'gender', 'tournament_level'),
      allowNull: false
    },
    old_position: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    new_position: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    old_points: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    new_points: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    points_change: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    position_change: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    change_reason: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    tournament_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tournaments',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    change_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
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
    age_group: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    gender: {
      type: DataTypes.STRING(10),
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

  // Add indexes exactly as defined in the model
  await queryInterface.addIndex('ranking_history', ['player_id']);
  await queryInterface.addIndex('ranking_history', ['ranking_type', 'category']);
  await queryInterface.addIndex('ranking_history', ['change_date']);
  await queryInterface.addIndex('ranking_history', ['tournament_id']);
  await queryInterface.addIndex('ranking_history', ['state_id']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('ranking_history');
}