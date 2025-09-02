import { QueryInterface, DataTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface): Promise<void> => {
  await queryInterface.createTable('microsites', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    owner_type: {
      type: DataTypes.ENUM('club', 'state_committee'),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
    color_scheme: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {
        primary: '#2563eb',
        secondary: '#64748b',
        accent: '#06b6d4',
        background: '#ffffff',
        text: '#1e293b',
      },
    },
    custom_domain: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    subdomain: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    ssl_enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    template_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'microsite_templates',
        key: 'id',
      },
    },
    template_version: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '1.0.0',
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
    google_analytics_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    facebook_pixel_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'archived'),
      allowNull: false,
      defaultValue: 'draft',
    },
    is_public: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    published_at: {
      type: DataTypes.DATE,
      allowNull: true,
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
    contact_info: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
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
  await queryInterface.addIndex('microsites', ['slug'], { unique: true });
  await queryInterface.addIndex('microsites', ['subdomain'], { unique: true });
  await queryInterface.addIndex('microsites', ['owner_id']);
  await queryInterface.addIndex('microsites', ['status']);
  await queryInterface.addIndex('microsites', ['is_public']);
  await queryInterface.addIndex('microsites', ['custom_domain'], {
    unique: true,
    where: { custom_domain: { [queryInterface.sequelize.Op.ne]: null } }
  });
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
  await queryInterface.dropTable('microsites');
};