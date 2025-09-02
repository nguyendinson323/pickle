import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

export interface MicrositeComponent {
  id: string;
  type: 'hero' | 'text' | 'image' | 'gallery' | 'contact_form' | 'event_list' | 'member_showcase' | 'stats' | 'testimonials' | 'map';
  position: number;
  settings: Record<string, any>;
  content: Record<string, any>;
  styling: {
    margin?: string;
    padding?: string;
    backgroundColor?: string;
    textColor?: string;
    borderRadius?: string;
    shadow?: boolean;
  };
}

interface MicrositeAttributes {
  id: number;
  ownerId: number;
  ownerType: 'club' | 'state_committee';
  
  // Basic Info
  name: string;
  slug: string; // URL slug (e.g., 'jalisco-pickleball')
  description: string;
  
  // Branding
  logo?: string;
  favicon?: string;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  
  // Domain Settings
  customDomain?: string;
  subdomain: string; // e.g., 'jalisco' for jalisco.pickleballmx.com
  sslEnabled: boolean;
  
  // Template
  templateId: number;
  templateVersion: string;
  
  // Content Structure
  pages: {
    id: string;
    name: string;
    slug: string;
    title: string;
    metaDescription: string;
    components: MicrositeComponent[];
    isPublished: boolean;
    sortOrder: number;
  }[];
  
  // Navigation
  navigation: {
    type: 'header' | 'footer';
    items: {
      label: string;
      url: string;
      pageId?: string;
      isExternal: boolean;
      openInNewTab: boolean;
    }[];
  }[];
  
  // SEO Settings
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage?: string;
    twitterCard?: string;
    customMeta?: { name: string; content: string }[];
  };
  
  // Analytics
  googleAnalyticsId?: string;
  facebookPixelId?: string;
  
  // Status
  status: 'draft' | 'published' | 'archived';
  isPublic: boolean;
  publishedAt?: Date;
  
  // Features
  features: {
    contactForm: boolean;
    eventCalendar: boolean;
    memberDirectory: boolean;
    photoGallery: boolean;
    newsUpdates: boolean;
    socialMedia: boolean;
  };
  
  // Contact Info
  contactInfo: {
    email?: string;
    phone?: string;
    address?: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      coordinates?: { lat: number; lng: number };
    };
    socialMedia?: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
      youtube?: string;
    };
  };
  
  createdAt: Date;
  updatedAt: Date;
}

interface MicrositeCreationAttributes extends Optional<MicrositeAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Microsite extends Model<MicrositeAttributes, MicrositeCreationAttributes> implements MicrositeAttributes {
  public id!: number;
  public ownerId!: number;
  public ownerType!: 'club' | 'state_committee';
  
  // Basic Info
  public name!: string;
  public slug!: string;
  public description!: string;
  
  // Branding
  public logo?: string;
  public favicon?: string;
  public colorScheme!: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  
  // Domain Settings
  public customDomain?: string;
  public subdomain!: string;
  public sslEnabled!: boolean;
  
  // Template
  public templateId!: number;
  public templateVersion!: string;
  
  // Content Structure
  public pages!: {
    id: string;
    name: string;
    slug: string;
    title: string;
    metaDescription: string;
    components: MicrositeComponent[];
    isPublished: boolean;
    sortOrder: number;
  }[];
  
  // Navigation
  public navigation!: {
    type: 'header' | 'footer';
    items: {
      label: string;
      url: string;
      pageId?: string;
      isExternal: boolean;
      openInNewTab: boolean;
    }[];
  }[];
  
  // SEO Settings
  public seo!: {
    title: string;
    description: string;
    keywords: string[];
    ogImage?: string;
    twitterCard?: string;
    customMeta?: { name: string; content: string }[];
  };
  
  // Analytics
  public googleAnalyticsId?: string;
  public facebookPixelId?: string;
  
  // Status
  public status!: 'draft' | 'published' | 'archived';
  public isPublic!: boolean;
  public publishedAt?: Date;
  
  // Features
  public features!: {
    contactForm: boolean;
    eventCalendar: boolean;
    memberDirectory: boolean;
    photoGallery: boolean;
    newsUpdates: boolean;
    socialMedia: boolean;
  };
  
  // Contact Info
  public contactInfo!: {
    email?: string;
    phone?: string;
    address?: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      coordinates?: { lat: number; lng: number };
    };
    socialMedia?: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
      youtube?: string;
    };
  };
  
  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Helper methods
  public getPublicUrl(): string {
    return this.customDomain 
      ? `https://${this.customDomain}`
      : `https://${this.subdomain}.pickleballmx.com`;
  }

  public getPublishedPages() {
    return this.pages.filter(page => page.isPublished).sort((a, b) => a.sortOrder - b.sortOrder);
  }

  public getPageBySlug(slug: string) {
    return this.pages.find(page => page.slug === slug);
  }

  public hasFeature(feature: keyof MicrositeAttributes['features']): boolean {
    return this.features[feature] === true;
  }
}

Microsite.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      field: 'owner_id',
    },
    ownerType: {
      type: DataTypes.ENUM('club', 'state_committee'),
      allowNull: false,
      field: 'owner_type',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: /^[a-z0-9-]+$/i, // Only alphanumeric and hyphens
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '',
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    favicon: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    colorScheme: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {
        primary: '#2563eb',
        secondary: '#64748b',
        accent: '#06b6d4',
        background: '#ffffff',
        text: '#1e293b',
      },
      field: 'color_scheme',
    },
    customDomain: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      field: 'custom_domain',
    },
    subdomain: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: /^[a-z0-9-]+$/i, // Only alphanumeric and hyphens
      },
    },
    sslEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'ssl_enabled',
    },
    templateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'template_id',
      references: {
        model: 'microsite_templates',
        key: 'id',
      },
    },
    templateVersion: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '1.0.0',
      field: 'template_version',
    },
    pages: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    navigation: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    seo: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {
        title: '',
        description: '',
        keywords: [],
      },
    },
    googleAnalyticsId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'google_analytics_id',
    },
    facebookPixelId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'facebook_pixel_id',
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'archived'),
      allowNull: false,
      defaultValue: 'draft',
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_public',
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'published_at',
    },
    features: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {
        contactForm: true,
        eventCalendar: true,
        memberDirectory: false,
        photoGallery: true,
        newsUpdates: true,
        socialMedia: true,
      },
    },
    contactInfo: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
      field: 'contact_info',
    },
  },
  {
    sequelize,
    tableName: 'microsites',
    timestamps: true,
    indexes: [
      {
        fields: ['slug'],
        unique: true,
      },
      {
        fields: ['subdomain'],
        unique: true,
      },
      {
        fields: ['owner_id'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['is_public'],
      },
      {
        fields: ['custom_domain'],
        unique: true,
        where: {
          custom_domain: {
            [sequelize.Op.ne]: null,
          },
        },
      },
    ],
  }
);

// Associations will be defined after all models are loaded

export default Microsite;