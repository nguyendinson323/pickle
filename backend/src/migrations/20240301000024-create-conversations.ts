import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('conversations', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    type: {
      type: DataTypes.ENUM('direct', 'group', 'tournament', 'club', 'broadcast'),
      defaultValue: 'direct',
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    is_group: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    is_private: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    is_archived: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    is_muted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    participant_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    max_participants: {
      type: DataTypes.INTEGER,
      defaultValue: 50,
      allowNull: false
    },
    message_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    unread_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    last_message_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    last_message_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    last_message_text: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    last_message_sender_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    pinned_message_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    group_image: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    settings: {
      type: DataTypes.JSON,
      allowNull: true
    },
    permissions: {
      type: DataTypes.JSON,
      allowNull: true
    },
    auto_delete_messages_days: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    require_approval: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    allow_file_sharing: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    allow_media_sharing: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    allow_link_sharing: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    moderated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    moderator_ids: {
      type: DataTypes.JSON,
      allowNull: true
    },
    admin_ids: {
      type: DataTypes.JSON,
      allowNull: true
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true
    },
    related_entity_type: {
      type: DataTypes.ENUM('none', 'tournament', 'court', 'club', 'player_finder', 'coaching', 'match'),
      defaultValue: 'none',
      allowNull: false
    },
    related_entity_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    notification_level: {
      type: DataTypes.ENUM('all', 'mentions', 'none'),
      defaultValue: 'all',
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
    status: {
      type: DataTypes.ENUM('active', 'archived', 'deleted', 'suspended'),
      defaultValue: 'active',
      allowNull: false
    },
    archived_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    archived_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
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
  await queryInterface.addIndex('conversations', ['created_by']);
  await queryInterface.addIndex('conversations', ['last_message_sender_id']);
  await queryInterface.addIndex('conversations', ['archived_by']);
  await queryInterface.addIndex('conversations', ['deleted_by']);
  await queryInterface.addIndex('conversations', ['type']);
  await queryInterface.addIndex('conversations', ['is_group']);
  await queryInterface.addIndex('conversations', ['is_private']);
  await queryInterface.addIndex('conversations', ['is_archived']);
  await queryInterface.addIndex('conversations', ['status']);
  await queryInterface.addIndex('conversations', ['last_message_at']);
  await queryInterface.addIndex('conversations', ['related_entity_type']);
  await queryInterface.addIndex('conversations', ['related_entity_id']);
  await queryInterface.addIndex('conversations', ['participant_count']);
  await queryInterface.addIndex('conversations', ['message_count']);
  await queryInterface.addIndex('conversations', ['created_by', 'type']);
  await queryInterface.addIndex('conversations', ['related_entity_type', 'related_entity_id']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('conversations');
}