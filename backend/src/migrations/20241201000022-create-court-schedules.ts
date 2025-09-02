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
      type: DataTypes.ENUM('maintenance', 'private_event', 'weather', 'staff_unavailable', 'other'),
      allowNull: true
    },
    block_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    special_rate: {
      type: DataTypes.DECIMAL(10, 2),
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
  await queryInterface.addIndex('court_schedules', ['court_id']);
  await queryInterface.addIndex('court_schedules', ['date']);
  await queryInterface.addIndex('court_schedules', ['court_id', 'date']);
  await queryInterface.addIndex('court_schedules', ['is_blocked']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('court_schedules');
}