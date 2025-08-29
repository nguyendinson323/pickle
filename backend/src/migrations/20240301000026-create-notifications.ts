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
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    type: {
      type: DataTypes.ENUM('message', 'tournament', 'match', 'payment', 'reservation', 'player_finder', 'system', 'marketing', 'reminder', 'alert'),
      allowNull: false
    },
    subtype: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    short_message: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    priority: {
      type: DataTypes.ENUM('low', 'normal', 'high', 'urgent'),
      defaultValue: 'normal',
      allowNull: false
    },
    category: {
      type: DataTypes.ENUM('info', 'success', 'warning', 'error', 'promotion'),
      defaultValue: 'info',
      allowNull: false
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    read_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_delivered: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    delivered_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_clicked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    clicked_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_dismissed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    dismissed_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    action_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    action_type: {
      type: DataTypes.ENUM('none', 'navigate', 'api_call', 'download', 'external_link'),
      defaultValue: 'none',
      allowNull: false
    },
    action_data: {
      type: DataTypes.JSON,
      allowNull: true
    },
    related_entity_type: {
      type: DataTypes.ENUM('none', 'user', 'tournament', 'match', 'reservation', 'payment', 'conversation', 'message', 'court', 'club'),
      defaultValue: 'none',
      allowNull: false
    },
    related_entity_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    icon: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    color: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    sound: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    vibration_pattern: {
      type: DataTypes.JSON,
      allowNull: true
    },
    channels: {
      type: DataTypes.JSON,
      allowNull: true
    },
    push_notification_sent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    push_notification_sent_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    push_notification_id: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    push_notification_status: {
      type: DataTypes.ENUM('none', 'sent', 'delivered', 'failed', 'clicked'),
      defaultValue: 'none',
      allowNull: false
    },
    email_notification_sent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    email_notification_sent_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    email_notification_id: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    email_notification_status: {
      type: DataTypes.ENUM('none', 'sent', 'delivered', 'opened', 'clicked', 'failed'),
      defaultValue: 'none',
      allowNull: false
    },
    sms_notification_sent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    sms_notification_sent_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    sms_notification_id: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    sms_notification_status: {
      type: DataTypes.ENUM('none', 'sent', 'delivered', 'failed'),
      defaultValue: 'none',
      allowNull: false
    },
    whatsapp_notification_sent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    whatsapp_notification_sent_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    whatsapp_notification_id: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    whatsapp_notification_status: {
      type: DataTypes.ENUM('none', 'sent', 'delivered', 'read', 'failed'),
      defaultValue: 'none',
      allowNull: false
    },
    in_app_displayed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    in_app_displayed_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    retry_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    max_retries: {
      type: DataTypes.INTEGER,
      defaultValue: 3,
      allowNull: false
    },
    next_retry_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    failure_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    user_preferences: {
      type: DataTypes.JSON,
      allowNull: true
    },
    personalization_data: {
      type: DataTypes.JSON,
      allowNull: true
    },
    ab_test_variant: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    campaign_id: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    source: {
      type: DataTypes.ENUM('system', 'user', 'admin', 'automation', 'third_party'),
      defaultValue: 'system',
      allowNull: false
    },
    language: {
      type: DataTypes.STRING(5),
      defaultValue: 'es',
      allowNull: false
    },
    timezone: {
      type: DataTypes.STRING(50),
      defaultValue: 'America/Mexico_City',
      allowNull: false
    },
    device_tokens: {
      type: DataTypes.JSON,
      allowNull: true
    },
    tracking_data: {
      type: DataTypes.JSON,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSON,
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
  await queryInterface.addIndex('notifications', ['user_id']);
  await queryInterface.addIndex('notifications', ['sender_id']);
  await queryInterface.addIndex('notifications', ['type']);
  await queryInterface.addIndex('notifications', ['subtype']);
  await queryInterface.addIndex('notifications', ['priority']);
  await queryInterface.addIndex('notifications', ['category']);
  await queryInterface.addIndex('notifications', ['is_read']);
  await queryInterface.addIndex('notifications', ['is_delivered']);
  await queryInterface.addIndex('notifications', ['is_clicked']);
  await queryInterface.addIndex('notifications', ['is_dismissed']);
  await queryInterface.addIndex('notifications', ['expires_at']);
  await queryInterface.addIndex('notifications', ['related_entity_type']);
  await queryInterface.addIndex('notifications', ['related_entity_id']);
  await queryInterface.addIndex('notifications', ['push_notification_status']);
  await queryInterface.addIndex('notifications', ['email_notification_status']);
  await queryInterface.addIndex('notifications', ['sms_notification_status']);
  await queryInterface.addIndex('notifications', ['created_at']);
  await queryInterface.addIndex('notifications', ['user_id', 'is_read']);
  await queryInterface.addIndex('notifications', ['user_id', 'created_at']);
  await queryInterface.addIndex('notifications', ['related_entity_type', 'related_entity_id']);
  await queryInterface.addIndex('notifications', ['campaign_id']);
  await queryInterface.addIndex('notifications', ['source']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('notifications');
}