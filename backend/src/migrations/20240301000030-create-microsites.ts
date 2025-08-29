import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('microsites', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    owner_type: {
      type: DataTypes.ENUM('player', 'coach', 'club', 'partner', 'state', 'federation'),
      allowNull: false
    },
    theme_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'microsite_themes',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    subdomain: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true
    },
    custom_domain: {
      type: DataTypes.STRING(200),
      allowNull: true,
      unique: true
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    tagline: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    meta_description: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    meta_keywords: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    logo_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    favicon_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    banner_image: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    background_image: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    gallery_images: {
      type: DataTypes.JSON,
      allowNull: true
    },
    social_media_links: {
      type: DataTypes.JSON,
      allowNull: true
    },
    contact_info: {
      type: DataTypes.JSON,
      allowNull: true
    },
    business_hours: {
      type: DataTypes.JSON,
      allowNull: true
    },
    location_info: {
      type: DataTypes.JSON,
      allowNull: true
    },
    services_offered: {
      type: DataTypes.JSON,
      allowNull: true
    },
    pricing_info: {
      type: DataTypes.JSON,
      allowNull: true
    },
    testimonials: {
      type: DataTypes.JSON,
      allowNull: true
    },
    achievements: {
      type: DataTypes.JSON,
      allowNull: true
    },
    certifications: {
      type: DataTypes.JSON,
      allowNull: true
    },
    team_members: {
      type: DataTypes.JSON,
      allowNull: true
    },
    navigation_menu: {
      type: DataTypes.JSON,
      allowNull: true
    },
    page_content: {
      type: DataTypes.JSON,
      allowNull: true
    },
    widgets: {
      type: DataTypes.JSON,
      allowNull: true
    },
    custom_sections: {
      type: DataTypes.JSON,
      allowNull: true
    },
    theme_customizations: {
      type: DataTypes.JSON,
      allowNull: true
    },
    color_overrides: {
      type: DataTypes.JSON,
      allowNull: true
    },
    font_overrides: {
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
    analytics_code: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tracking_codes: {
      type: DataTypes.JSON,
      allowNull: true
    },
    seo_settings: {
      type: DataTypes.JSON,
      allowNull: true
    },
    privacy_settings: {
      type: DataTypes.JSON,
      allowNull: true
    },
    security_settings: {
      type: DataTypes.JSON,
      allowNull: true
    },
    backup_settings: {
      type: DataTypes.JSON,
      allowNull: true
    },
    performance_settings: {
      type: DataTypes.JSON,
      allowNull: true
    },
    mobile_settings: {
      type: DataTypes.JSON,
      allowNull: true
    },
    language: {
      type: DataTypes.STRING(5),
      defaultValue: 'es',
      allowNull: false
    },
    timezone: {
      type: DataTypes.STRING(50),
      defaultValue: 'America/Mexico_City',
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'MXN',
      allowNull: false
    },
    features_enabled: {
      type: DataTypes.JSON,
      allowNull: true
    },
    integrations: {
      type: DataTypes.JSON,
      allowNull: true
    },
    third_party_scripts: {
      type: DataTypes.JSON,
      allowNull: true
    },
    api_settings: {
      type: DataTypes.JSON,
      allowNull: true
    },
    webhook_settings: {
      type: DataTypes.JSON,
      allowNull: true
    },
    notification_settings: {
      type: DataTypes.JSON,
      allowNull: true
    },
    email_settings: {
      type: DataTypes.JSON,
      allowNull: true
    },
    subscription_plan: {
      type: DataTypes.ENUM('free', 'basic', 'premium', 'enterprise'),
      defaultValue: 'free',
      allowNull: false
    },
    plan_expires_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    storage_used_mb: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    storage_limit_mb: {
      type: DataTypes.INTEGER,
      defaultValue: 100,
      allowNull: false
    },
    bandwidth_used_mb: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    bandwidth_limit_mb: {
      type: DataTypes.INTEGER,
      defaultValue: 1000,
      allowNull: false
    },
    page_views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    unique_visitors: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    last_visit_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    last_updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    last_backup_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ssl_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    ssl_certificate: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ssl_expires_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    cdn_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    caching_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    compression_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('draft', 'active', 'inactive', 'suspended', 'archived'),
      defaultValue: 'draft',
      allowNull: false
    },
    is_published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    published_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    is_premium: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    requires_authentication: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    password_protected: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    access_password: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    maintenance_mode: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    maintenance_message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    error_logs: {
      type: DataTypes.JSON,
      allowNull: true
    },
    performance_metrics: {
      type: DataTypes.JSON,
      allowNull: true
    },
    seo_score: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    accessibility_score: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    mobile_friendliness_score: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    loading_speed_score: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    uptime_percentage: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 100.00,
      allowNull: false
    },
    last_health_check: {
      type: DataTypes.DATE,
      allowNull: true
    },
    health_status: {
      type: DataTypes.ENUM('healthy', 'warning', 'critical', 'down'),
      defaultValue: 'healthy',
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true
    },
    metadata: {
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
  await queryInterface.addIndex('microsites', ['owner_id']);
  await queryInterface.addIndex('microsites', ['theme_id']);
  await queryInterface.addIndex('microsites', ['owner_type']);
  await queryInterface.addIndex('microsites', ['slug'], { unique: true });
  await queryInterface.addIndex('microsites', ['subdomain'], { unique: true });
  await queryInterface.addIndex('microsites', ['custom_domain'], { unique: true });
  await queryInterface.addIndex('microsites', ['status']);
  await queryInterface.addIndex('microsites', ['is_published']);
  await queryInterface.addIndex('microsites', ['is_featured']);
  await queryInterface.addIndex('microsites', ['is_premium']);
  await queryInterface.addIndex('microsites', ['subscription_plan']);
  await queryInterface.addIndex('microsites', ['published_at']);
  await queryInterface.addIndex('microsites', ['last_visit_at']);
  await queryInterface.addIndex('microsites', ['health_status']);
  await queryInterface.addIndex('microsites', ['maintenance_mode']);
  await queryInterface.addIndex('microsites', ['ssl_enabled']);
  await queryInterface.addIndex('microsites', ['language']);
  await queryInterface.addIndex('microsites', ['owner_id', 'owner_type']);
  await queryInterface.addIndex('microsites', ['status', 'is_published']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('microsites');
}