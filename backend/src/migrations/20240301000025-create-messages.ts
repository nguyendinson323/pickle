import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('messages', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    conversation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'conversations',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    message_type: {
      type: DataTypes.ENUM('text', 'image', 'file', 'location', 'contact', 'system', 'reaction', 'reply'),
      defaultValue: 'text',
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    formatted_content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    reply_to_message_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'messages',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    thread_root_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'messages',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    attachments: {
      type: DataTypes.JSON,
      allowNull: true
    },
    media_files: {
      type: DataTypes.JSON,
      allowNull: true
    },
    location_data: {
      type: DataTypes.JSON,
      allowNull: true
    },
    contact_data: {
      type: DataTypes.JSON,
      allowNull: true
    },
    mentioned_users: {
      type: DataTypes.JSON,
      allowNull: true
    },
    hashtags: {
      type: DataTypes.JSON,
      allowNull: true
    },
    links: {
      type: DataTypes.JSON,
      allowNull: true
    },
    reactions: {
      type: DataTypes.JSON,
      allowNull: true
    },
    reaction_counts: {
      type: DataTypes.JSON,
      allowNull: true
    },
    is_edited: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    edited_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    edit_history: {
      type: DataTypes.JSON,
      allowNull: true
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deleted_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    is_pinned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    pinned_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    pinned_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    is_system_message: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    system_message_type: {
      type: DataTypes.ENUM('user_joined', 'user_left', 'user_added', 'user_removed', 'group_created', 'group_updated', 'admin_promoted', 'admin_demoted'),
      allowNull: true
    },
    system_message_data: {
      type: DataTypes.JSON,
      allowNull: true
    },
    priority: {
      type: DataTypes.ENUM('low', 'normal', 'high', 'urgent'),
      defaultValue: 'normal',
      allowNull: false
    },
    is_announcement: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    read_by: {
      type: DataTypes.JSON,
      allowNull: true
    },
    read_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    delivered_to: {
      type: DataTypes.JSON,
      allowNull: true
    },
    delivery_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    failed_delivery_to: {
      type: DataTypes.JSON,
      allowNull: true
    },
    notification_sent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    notification_sent_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    client_id: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    message_sequence: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    encryption_key_id: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    is_encrypted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    language: {
      type: DataTypes.STRING(5),
      defaultValue: 'es',
      allowNull: false
    },
    sentiment_score: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true
    },
    moderation_status: {
      type: DataTypes.ENUM('none', 'pending', 'approved', 'rejected', 'flagged'),
      defaultValue: 'none',
      allowNull: false
    },
    moderated_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    moderated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    moderation_notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    search_vector: {
      type: DataTypes.TEXT,
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
  await queryInterface.addIndex('messages', ['conversation_id']);
  await queryInterface.addIndex('messages', ['sender_id']);
  await queryInterface.addIndex('messages', ['reply_to_message_id']);
  await queryInterface.addIndex('messages', ['thread_root_id']);
  await queryInterface.addIndex('messages', ['deleted_by']);
  await queryInterface.addIndex('messages', ['pinned_by']);
  await queryInterface.addIndex('messages', ['moderated_by']);
  await queryInterface.addIndex('messages', ['message_type']);
  await queryInterface.addIndex('messages', ['is_deleted']);
  await queryInterface.addIndex('messages', ['is_pinned']);
  await queryInterface.addIndex('messages', ['is_system_message']);
  await queryInterface.addIndex('messages', ['system_message_type']);
  await queryInterface.addIndex('messages', ['priority']);
  await queryInterface.addIndex('messages', ['is_announcement']);
  await queryInterface.addIndex('messages', ['expires_at']);
  await queryInterface.addIndex('messages', ['moderation_status']);
  await queryInterface.addIndex('messages', ['created_at']);
  await queryInterface.addIndex('messages', ['conversation_id', 'created_at']);
  await queryInterface.addIndex('messages', ['sender_id', 'created_at']);
  await queryInterface.addIndex('messages', ['message_sequence']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('messages');
}