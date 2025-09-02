import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('microsite_pages', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    microsite_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'microsites',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    content: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    meta_title: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    meta_description: {
      type: DataTypes.STRING(160),
      allowNull: true
    },
    is_home_page: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    sort_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    parent_page_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'microsite_pages',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    template: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'default'
    },
    settings: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {}
    },
    published_at: {
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

  // Add indexes exactly as defined in the model
  await queryInterface.addIndex('microsite_pages', ['microsite_id']);
  await queryInterface.addIndex('microsite_pages', ['microsite_id', 'slug'], { unique: true });
  await queryInterface.addIndex('microsite_pages', ['microsite_id', 'is_home_page']);
  await queryInterface.addIndex('microsite_pages', ['parent_page_id']);

  // Add GIN indexes for JSONB fields
  await queryInterface.addIndex('microsite_pages', ['content'], {
    using: 'gin'
  });
  await queryInterface.addIndex('microsite_pages', ['settings'], {
    using: 'gin'
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('microsite_pages');
}