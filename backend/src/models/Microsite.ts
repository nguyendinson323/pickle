import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface MicrositeAttributes {
  id: number;
  userId: number;
  name: string;
  subdomain: string;
  title: string;
  description?: string;
  ownerType: 'club' | 'partner' | 'state';
  ownerId: number;
  status: 'draft' | 'published' | 'suspended';
  themeId?: number;
  customCss?: string;
  customJs?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  ogImage?: string;
  faviconUrl?: string;
  logoUrl?: string;
  headerImageUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  socialMedia?: any;
  analytics?: any;
  settings: any;
  publishedAt?: Date;
}

interface MicrositeCreationAttributes extends Optional<MicrositeAttributes, 'id'> {}

class Microsite extends Model<MicrositeAttributes, MicrositeCreationAttributes> implements MicrositeAttributes {
  public id!: number;
  public userId!: number;
  public name!: string;
  public subdomain!: string;
  public title!: string;
  public description?: string;
  public ownerType!: 'club' | 'partner' | 'state';
  public ownerId!: number;
  public status!: 'draft' | 'published' | 'suspended';
  public themeId?: number;
  public customCss?: string;
  public customJs?: string;
  public seoTitle?: string;
  public seoDescription?: string;
  public seoKeywords?: string;
  public ogImage?: string;
  public faviconUrl?: string;
  public logoUrl?: string;
  public headerImageUrl?: string;
  public contactEmail?: string;
  public contactPhone?: string;
  public address?: string;
  public socialMedia?: any;
  public analytics?: any;
  public settings!: any;
  public publishedAt?: Date;
  public slug: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Microsite.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    field: 'user_id'
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
  ownerType: {
    type: DataTypes.ENUM('club', 'partner', 'state'),
    allowNull: false,
    field: 'owner_type'
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'owner_id'
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'suspended'),
    defaultValue: 'draft',
    allowNull: false
  },
  themeId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'microsite_themes',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    field: 'theme_id'
  },
  customCss: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'custom_css'
  },
  customJs: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'custom_js'
  },
  seoTitle: {
    type: DataTypes.STRING(60),
    allowNull: true,
    field: 'seo_title'
  },
  seoDescription: {
    type: DataTypes.STRING(160),
    allowNull: true,
    field: 'seo_description'
  },
  seoKeywords: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'seo_keywords'
  },
  ogImage: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'og_image'
  },
  faviconUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'favicon_url'
  },
  logoUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'logo_url'
  },
  headerImageUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'header_image_url'
  },
  contactEmail: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'contact_email'
  },
  contactPhone: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'contact_phone'
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  socialMedia: {
    type: DataTypes.JSONB,
    allowNull: true,
    field: 'social_media'
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
  publishedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'published_at'
  }
}, {
  sequelize,
  modelName: 'Microsite',
  tableName: 'microsites',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['subdomain'],
      unique: true
    },
    {
      fields: ['owner_type', 'owner_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['theme_id']
    }
  ]
});

export default Microsite;