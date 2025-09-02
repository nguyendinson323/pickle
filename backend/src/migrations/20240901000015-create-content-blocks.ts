import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('content_blocks', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    page_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'microsite_pages',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    content: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    sort_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    is_visible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    settings: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {}
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
  await queryInterface.addIndex('content_blocks', ['page_id']);
  await queryInterface.addIndex('content_blocks', ['page_id', 'sort_order']);
  await queryInterface.addIndex('content_blocks', ['type']);

  // Add GIN indexes for JSONB fields for better query performance
  await queryInterface.addIndex('content_blocks', ['content'], {
    using: 'gin'
  });
  await queryInterface.addIndex('content_blocks', ['settings'], {
    using: 'gin'
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('content_blocks');
}