import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('maintenance_records', {
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
      onDelete: 'CASCADE'
    },
    facility_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'court_facilities',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    maintenance_type: {
      type: DataTypes.ENUM('scheduled', 'emergency', 'preventive', 'repair', 'inspection', 'cleaning'),
      allowNull: false
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
      allowNull: false,
      defaultValue: 'medium'
    },
    status: {
      type: DataTypes.ENUM('scheduled', 'in_progress', 'completed', 'cancelled', 'postponed'),
      allowNull: false,
      defaultValue: 'scheduled'
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    scheduled_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    scheduled_start_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    scheduled_end_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    estimated_duration: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    actual_start_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    actual_end_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    actual_duration: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    assigned_to: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    work_performed: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    cost: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    quality_check: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    affected_bookings: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    preventive_schedule: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    warranty: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    before_photos: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: []
    },
    after_photos: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: []
    },
    documents: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: []
    },
    weather_conditions: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    safety_measures: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    approvals: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    feedback: {
      type: DataTypes.JSONB,
      allowNull: true
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

  // Add indexes exactly as defined in the model
  await queryInterface.addIndex('maintenance_records', ['court_id']);
  await queryInterface.addIndex('maintenance_records', ['facility_id']);
  await queryInterface.addIndex('maintenance_records', ['maintenance_type']);
  await queryInterface.addIndex('maintenance_records', ['priority']);
  await queryInterface.addIndex('maintenance_records', ['status']);
  await queryInterface.addIndex('maintenance_records', ['scheduled_date']);
  await queryInterface.addIndex('maintenance_records', ['is_active']);
  await queryInterface.addIndex('maintenance_records', ['scheduled_date', 'scheduled_start_time', 'scheduled_end_time']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('maintenance_records');
}