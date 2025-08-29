import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('court_schedules', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    court_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'courts',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    is_blocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    block_type: {
      type: DataTypes.ENUM('maintenance', 'private_event', 'tournament', 'closed', 'weather', 'other'),
      allowNull: true
    },
    block_reason: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    is_available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    special_rate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    rate_reason: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    recurring: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    recurring_pattern: {
      type: DataTypes.JSON,
      allowNull: true
    },
    recurring_end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    priority: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    approved_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    approval_date: {
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
  await queryInterface.addIndex('court_schedules', ['court_id']);
  await queryInterface.addIndex('court_schedules', ['date']);
  await queryInterface.addIndex('court_schedules', ['start_time']);
  await queryInterface.addIndex('court_schedules', ['end_time']);
  await queryInterface.addIndex('court_schedules', ['is_blocked']);
  await queryInterface.addIndex('court_schedules', ['is_available']);
  await queryInterface.addIndex('court_schedules', ['block_type']);
  await queryInterface.addIndex('court_schedules', ['recurring']);
  await queryInterface.addIndex('court_schedules', ['priority']);
  await queryInterface.addIndex('court_schedules', ['created_by']);
  await queryInterface.addIndex('court_schedules', ['approved_by']);
  await queryInterface.addIndex('court_schedules', ['court_id', 'date', 'start_time']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('court_schedules');
}