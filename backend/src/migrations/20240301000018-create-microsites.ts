import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('microsites', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    subdomain: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    owner_type: {
      type: DataTypes.ENUM('club', 'partner', 'state'),
      allowNull: false
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'suspended'),
      defaultValue: 'draft',
      allowNull: false
    },
    theme_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'microsite_themes',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    custom_css: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    custom_js: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    seo_title: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    seo_description: {
      type: DataTypes.STRING(160),
      allowNull: true
    },
    seo_keywords: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    og_image: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    favicon_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    logo_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    header_image_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    contact_email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    contact_phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    social_media: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    analytics: {
      type: DataTypes.JSONB,
      allowNull: true
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

  // Add indexes
  await queryInterface.addIndex('microsites', ['user_id']);
  await queryInterface.addIndex('microsites', ['subdomain'], { unique: true });
  await queryInterface.addIndex('microsites', ['owner_type', 'owner_id']);
  await queryInterface.addIndex('microsites', ['status']);
  await queryInterface.addIndex('microsites', ['theme_id']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('microsites');
}