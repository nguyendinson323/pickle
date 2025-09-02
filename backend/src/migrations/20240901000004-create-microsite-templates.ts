import { QueryInterface, DataTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface): Promise<void> => {
  await queryInterface.createTable('microsite_templates', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    version: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '1.0.0',
    },
    category: {
      type: DataTypes.ENUM('club', 'state_committee', 'general'),
      allowNull: false,
    },
    thumbnail_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    preview_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    structure: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    is_premium: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    required_plan: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tags: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    sort_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    usage_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
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

  // Create indexes for performance
  await queryInterface.addIndex('microsite_templates', ['category']);
  await queryInterface.addIndex('microsite_templates', ['is_premium']);
  await queryInterface.addIndex('microsite_templates', ['is_active']);
  await queryInterface.addIndex('microsite_templates', ['sort_order']);
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
  await queryInterface.dropTable('microsite_templates');
};