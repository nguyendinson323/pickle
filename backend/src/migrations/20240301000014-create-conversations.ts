import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('conversations', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    type: {
      type: DataTypes.ENUM('direct', 'group', 'tournament', 'court_booking'),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    participants: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    is_group: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    group_icon: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    related_entity_type: {
      type: DataTypes.ENUM('tournament', 'court_booking', 'player_match'),
      allowNull: true
    },
    related_entity_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    last_message_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'messages',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    last_message_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    last_message_preview: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    settings: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {
        allowFileSharing: true,
        allowLocationSharing: true,
        muteNotifications: false
      }
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    is_archived: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    archived_at: {
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
  await queryInterface.addIndex('conversations', ['type']);
  await queryInterface.addIndex('conversations', ['is_active']);
  await queryInterface.addIndex('conversations', ['is_archived']);
  await queryInterface.addIndex('conversations', ['last_message_at']);
  await queryInterface.addIndex('conversations', ['related_entity_type', 'related_entity_id']);
  
  // Create GIN index for JSONB participants field
  await queryInterface.addIndex('conversations', ['participants'], {
    name: 'conversations_participants_gin',
    using: 'gin'
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('conversations');
}