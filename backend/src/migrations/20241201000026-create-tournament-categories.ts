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
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
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
    skill_level: {
      type: DataTypes.ENUM('beginner', 'intermediate', 'advanced', 'open'),
      allowNull: true
    },
    gender_requirement: {
      type: DataTypes.ENUM('men', 'women', 'mixed', 'open'),
      allowNull: false
    },
    play_format: {
      type: DataTypes.ENUM('singles', 'doubles', 'mixed_doubles'),
      allowNull: false
    },
    entry_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
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
    min_ranking_points: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    max_ranking_points: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    prize_distribution: {
      type: DataTypes.JSON,
      allowNull: true
    },
    special_rules: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    registration_deadline: {
      type: DataTypes.DATEONLY,
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
  await queryInterface.addIndex('tournament_categories', ['play_format']);
  await queryInterface.addIndex('tournament_categories', ['gender_requirement']);
  await queryInterface.addIndex('tournament_categories', ['skill_level']);
  await queryInterface.addIndex('tournament_categories', ['is_active']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('tournament_categories');
}