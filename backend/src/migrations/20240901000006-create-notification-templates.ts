import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('notification_templates', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    category: {
      type: DataTypes.ENUM('tournament', 'booking', 'message', 'system', 'payment'),
      allowNull: false
    },
    templates: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    variables: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: []
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
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
  await queryInterface.addIndex('notification_templates', ['name']);
  await queryInterface.addIndex('notification_templates', ['type']);
  await queryInterface.addIndex('notification_templates', ['category']);
  await queryInterface.addIndex('notification_templates', ['is_active']);
  await queryInterface.addIndex('notification_templates', ['version']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('notification_templates');
}