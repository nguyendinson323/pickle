import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('admin_logs', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },
    category: {
      type: DataTypes.ENUM('user_management', 'content_moderation', 'system_config', 'financial', 'tournament', 'communication'),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    target_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    target_type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    previous_data: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    new_data: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    ip_address: {
      type: DataTypes.INET,
      allowNull: false
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    session_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    severity: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
      allowNull: false,
      defaultValue: 'medium'
    },
    affected_users: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('success', 'failed', 'partial'),
      allowNull: false,
      defaultValue: 'success'
    },
    error_message: {
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

  // Add indexes exactly as defined in the model
  await queryInterface.addIndex('admin_logs', ['admin_id']);
  await queryInterface.addIndex('admin_logs', ['action']);
  await queryInterface.addIndex('admin_logs', ['category']);
  await queryInterface.addIndex('admin_logs', ['severity']);
  await queryInterface.addIndex('admin_logs', ['status']);
  await queryInterface.addIndex('admin_logs', ['created_at']);
  await queryInterface.addIndex('admin_logs', ['target_id', 'target_type']);

  // Add GIN indexes for JSONB fields
  await queryInterface.addIndex('admin_logs', ['previous_data'], {
    using: 'gin'
  });
  await queryInterface.addIndex('admin_logs', ['new_data'], {
    using: 'gin'
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('admin_logs');
}