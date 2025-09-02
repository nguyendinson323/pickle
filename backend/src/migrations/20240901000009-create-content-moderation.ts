import { QueryInterface, DataTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface): Promise<void> => {
  await queryInterface.createTable('content_moderation', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content_type: {
      type: DataTypes.ENUM('user_profile', 'tournament', 'microsite', 'message', 'review', 'media'),
      allowNull: false,
    },
    content_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reported_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    content_data: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    content_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    content_preview: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'flagged', 'escalated'),
      allowNull: false,
      defaultValue: 'pending',
    },
    moderator_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    moderated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    report_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    moderation_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    action_taken: {
      type: DataTypes.ENUM('none', 'warning', 'content_removed', 'account_suspended', 'account_banned'),
      allowNull: true,
    },
    severity: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
      allowNull: false,
      defaultValue: 'medium',
    },
    category: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    ai_flags: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    requires_follow_up: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    follow_up_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  // Create indexes
  await queryInterface.addIndex('content_moderation', ['content_type']);
  await queryInterface.addIndex('content_moderation', ['content_id']);
  await queryInterface.addIndex('content_moderation', ['status']);
  await queryInterface.addIndex('content_moderation', ['severity']);
  await queryInterface.addIndex('content_moderation', ['reported_by']);
  await queryInterface.addIndex('content_moderation', ['moderator_id']);
  await queryInterface.addIndex('content_moderation', ['created_at']);
  await queryInterface.addIndex('content_moderation', ['requires_follow_up', 'follow_up_date']);
  await queryInterface.addIndex('content_moderation', ['content_type', 'content_id']);
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
  await queryInterface.dropTable('content_moderation');
};