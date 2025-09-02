import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('system_alerts', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    type: {
      type: DataTypes.ENUM('performance', 'security', 'error', 'maintenance', 'business', 'user_behavior'),
      allowNull: false
    },
    severity: {
      type: DataTypes.ENUM('info', 'warning', 'error', 'critical'),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    details: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    source: {
      type: DataTypes.ENUM('system', 'monitoring', 'user_report', 'automated_check'),
      allowNull: false
    },
    source_data: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    threshold: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('open', 'acknowledged', 'investigating', 'resolved', 'false_positive'),
      allowNull: false,
      defaultValue: 'open'
    },
    acknowledged_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    acknowledged_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    resolved_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    resolved_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    resolution_notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    actions_taken: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    is_escalated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    escalated_to: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    escalated_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_recurring: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    related_alerts: {
      type: DataTypes.JSONB,
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
  await queryInterface.addIndex('system_alerts', ['type']);
  await queryInterface.addIndex('system_alerts', ['severity']);
  await queryInterface.addIndex('system_alerts', ['status']);
  await queryInterface.addIndex('system_alerts', ['source']);
  await queryInterface.addIndex('system_alerts', ['is_escalated']);
  await queryInterface.addIndex('system_alerts', ['is_recurring']);
  await queryInterface.addIndex('system_alerts', ['created_at']);
  await queryInterface.addIndex('system_alerts', ['acknowledged_by']);
  await queryInterface.addIndex('system_alerts', ['resolved_by']);
  await queryInterface.addIndex('system_alerts', ['escalated_to']);
  await queryInterface.addIndex('system_alerts', ['status', 'severity']);
  await queryInterface.addIndex('system_alerts', ['type', 'severity']);

  // Add GIN indexes for JSONB fields
  await queryInterface.addIndex('system_alerts', ['details'], {
    using: 'gin'
  });
  await queryInterface.addIndex('system_alerts', ['source_data'], {
    using: 'gin'
  });
  await queryInterface.addIndex('system_alerts', ['threshold'], {
    using: 'gin'
  });
  await queryInterface.addIndex('system_alerts', ['actions_taken'], {
    using: 'gin'
  });
  await queryInterface.addIndex('system_alerts', ['related_alerts'], {
    using: 'gin'
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('system_alerts');
}