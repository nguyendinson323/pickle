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
      onDelete: 'CASCADE'
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    message_type: {
      type: DataTypes.ENUM('text', 'image', 'file', 'system', 'location', 'match_invite'),
      allowNull: false,
      defaultValue: 'text'
    },
    attachments: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    location: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    match_invite: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    is_edited: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    edited_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    read_by: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: []
    },
    reactions: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: []
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
  await queryInterface.addIndex('messages', ['conversation_id']);
  await queryInterface.addIndex('messages', ['sender_id']);
  await queryInterface.addIndex('messages', ['message_type']);
  await queryInterface.addIndex('messages', ['created_at']);
  await queryInterface.addIndex('messages', ['is_deleted']);
  
  // Create GIN indexes for JSONB fields
  await queryInterface.addIndex('messages', ['read_by'], {
    name: 'messages_read_by_gin',
    using: 'gin'
  });
  await queryInterface.addIndex('messages', ['reactions'], {
    name: 'messages_reactions_gin',
    using: 'gin'
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('messages');
}