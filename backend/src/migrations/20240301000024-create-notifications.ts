import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('notifications', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.ENUM('system', 'tournament', 'booking', 'message', 'match', 'payment', 'maintenance'),
      allowNull: false,
      defaultValue: 'system'
    },
    category: {
      type: DataTypes.ENUM('info', 'success', 'warning', 'error', 'urgent'),
      allowNull: false,
      defaultValue: 'info'
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    action_text: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    action_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    related_entity_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    related_entity_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {}
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    read_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    channels: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {
        inApp: true,
        email: false,
        sms: false,
        push: false
      }
    },
    delivery_status: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {
        inApp: { delivered: false },
        email: { delivered: false },
        sms: { delivered: false },
        push: { delivered: false }
      }
    },
    scheduled_for: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_scheduled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    expires_at: {
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

  // Add indexes exactly as defined in the model
  await queryInterface.addIndex('notifications', ['user_id']);
  await queryInterface.addIndex('notifications', ['type']);
  await queryInterface.addIndex('notifications', ['category']);
  await queryInterface.addIndex('notifications', ['is_read']);
  await queryInterface.addIndex('notifications', ['is_scheduled']);
  await queryInterface.addIndex('notifications', ['scheduled_for']);
  await queryInterface.addIndex('notifications', ['expires_at']);
  await queryInterface.addIndex('notifications', ['created_at']);
  await queryInterface.addIndex('notifications', ['related_entity_type', 'related_entity_id']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('notifications');
}