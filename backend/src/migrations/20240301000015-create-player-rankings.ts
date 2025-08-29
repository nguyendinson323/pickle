import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('rankings', {
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
    position: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    points: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    previous_position: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    previous_points: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
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
    tournaments_played: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    last_tournament_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    activity_bonus: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0
    },
    decay_factor: {
      type: DataTypes.DECIMAL(5, 4),
      allowNull: false,
      defaultValue: 1.0
    },
    last_calculated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
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
  await queryInterface.addIndex('rankings', ['player_id']);
  await queryInterface.addIndex('rankings', ['ranking_type', 'category']);
  await queryInterface.addIndex('rankings', ['category', 'position']);
  await queryInterface.addIndex('rankings', ['state_id']);
  await queryInterface.addIndex('rankings', ['age_group']);
  await queryInterface.addIndex('rankings', ['gender']);
  await queryInterface.addIndex('rankings', ['points']);
  await queryInterface.addIndex('rankings', ['is_active']);
  await queryInterface.addIndex('rankings', ['player_id', 'ranking_type', 'category', 'state_id', 'age_group', 'gender'], { 
    unique: true,
    name: 'rankings_unique_constraint'
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('rankings');
}