import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('microsite_themes', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    version: {
      type: DataTypes.STRING(20),
      defaultValue: '1.0',
      allowNull: false
    },
    category: {
      type: DataTypes.ENUM('business', 'sport', 'modern', 'classic', 'minimal', 'professional', 'creative'),
      defaultValue: 'sport',
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('free', 'premium', 'custom'),
      defaultValue: 'free',
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'MXN',
      allowNull: false
    },
    preview_image: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    screenshots: {
      type: DataTypes.JSON,
      allowNull: true
    },
    demo_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    color_scheme: {
      type: DataTypes.JSON,
      allowNull: true
    },
    primary_color: {
      type: DataTypes.STRING(7),
      defaultValue: '#007bff',
      allowNull: false
    },
    secondary_color: {
      type: DataTypes.STRING(7),
      defaultValue: '#6c757d',
      allowNull: false
    },
    accent_color: {
      type: DataTypes.STRING(7),
      defaultValue: '#17a2b8',
      allowNull: false
    },
    background_color: {
      type: DataTypes.STRING(7),
      defaultValue: '#ffffff',
      allowNull: false
    },
    text_color: {
      type: DataTypes.STRING(7),
      defaultValue: '#212529',
      allowNull: false
    },
    font_family: {
      type: DataTypes.STRING(100),
      defaultValue: 'Arial, sans-serif',
      allowNull: false
    },
    font_sizes: {
      type: DataTypes.JSON,
      allowNull: true
    },
    layout_settings: {
      type: DataTypes.JSON,
      allowNull: true
    },
    header_settings: {
      type: DataTypes.JSON,
      allowNull: true
    },
    footer_settings: {
      type: DataTypes.JSON,
      allowNull: true
    },
    sidebar_settings: {
      type: DataTypes.JSON,
      allowNull: true
    },
    navigation_settings: {
      type: DataTypes.JSON,
      allowNull: true
    },
    button_styles: {
      type: DataTypes.JSON,
      allowNull: true
    },
    card_styles: {
      type: DataTypes.JSON,
      allowNull: true
    },
    form_styles: {
      type: DataTypes.JSON,
      allowNull: true
    },
    custom_css: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    custom_js: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    supported_features: {
      type: DataTypes.JSON,
      allowNull: true
    },
    required_plugins: {
      type: DataTypes.JSON,
      allowNull: true
    },
    responsive_breakpoints: {
      type: DataTypes.JSON,
      allowNull: true
    },
    mobile_optimized: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    tablet_optimized: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    desktop_optimized: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    rtl_support: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    accessibility_features: {
      type: DataTypes.JSON,
      allowNull: true
    },
    seo_optimized: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    performance_score: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    browser_compatibility: {
      type: DataTypes.JSON,
      allowNull: true
    },
    template_files: {
      type: DataTypes.JSON,
      allowNull: true
    },
    asset_files: {
      type: DataTypes.JSON,
      allowNull: true
    },
    documentation_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    support_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    changelog: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    installation_guide: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    customization_guide: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    author: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    author_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    license: {
      type: DataTypes.STRING(100),
      defaultValue: 'MIT',
      allowNull: false
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true
    },
    ratings: {
      type: DataTypes.JSON,
      allowNull: true
    },
    average_rating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0.00,
      allowNull: false
    },
    total_ratings: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    downloads: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    active_installations: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    is_featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    requires_approval: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    approved_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('draft', 'active', 'deprecated', 'disabled'),
      defaultValue: 'draft',
      allowNull: false
    },
    published_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deprecated_at: {
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

  // Add indexes (removed approved_by and replacement_theme_id indexes)
  await queryInterface.addIndex('microsite_themes', ['slug'], { unique: true });
  await queryInterface.addIndex('microsite_themes', ['category']);
  await queryInterface.addIndex('microsite_themes', ['type']);
  await queryInterface.addIndex('microsite_themes', ['price']);
  await queryInterface.addIndex('microsite_themes', ['status']);
  await queryInterface.addIndex('microsite_themes', ['is_active']);
  await queryInterface.addIndex('microsite_themes', ['is_featured']);
  await queryInterface.addIndex('microsite_themes', ['is_default']);
  await queryInterface.addIndex('microsite_themes', ['approved']);
  await queryInterface.addIndex('microsite_themes', ['average_rating']);
  await queryInterface.addIndex('microsite_themes', ['downloads']);
  await queryInterface.addIndex('microsite_themes', ['active_installations']);
  await queryInterface.addIndex('microsite_themes', ['mobile_optimized']);
  await queryInterface.addIndex('microsite_themes', ['seo_optimized']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('microsite_themes');
}