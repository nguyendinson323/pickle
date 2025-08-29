import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('messages', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
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
    receiver_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    subject: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    is_urgent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    message_type: {
      type: DataTypes.ENUM('personal', 'announcement', 'system'),
      defaultValue: 'personal',
      allowNull: false
    },
    attachments: {
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
  await queryInterface.addIndex('messages', ['receiver_id']);
  await queryInterface.addIndex('messages', ['sender_id']);
  await queryInterface.addIndex('messages', ['is_read']);
  await queryInterface.addIndex('messages', ['created_at']);
  await queryInterface.addIndex('messages', ['message_type']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('messages');
}