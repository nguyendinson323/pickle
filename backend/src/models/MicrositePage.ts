import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface MicrositePageAttributes {
  id: number;
  micrositeId: number;
  title: string;
  slug: string;
  content?: any;
  metaTitle?: string;
  metaDescription?: string;
  isHomePage: boolean;
  isPublished: boolean;
  sortOrder: number;
  parentPageId?: number;
  template: string;
  settings: any;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface MicrositePageCreationAttributes extends Optional<MicrositePageAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class MicrositePage extends Model<MicrositePageAttributes, MicrositePageCreationAttributes> implements MicrositePageAttributes {
  public id!: number;
  public micrositeId!: number;
  public title!: string;
  public slug!: string;
  public content?: any;
  public metaTitle?: string;
  public metaDescription?: string;
  public isHomePage!: boolean;
  public isPublished!: boolean;
  public sortOrder!: number;
  public parentPageId?: number;
  public template!: string;
  public settings!: any;
  public publishedAt?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MicrositePage.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  micrositeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'microsites',
      key: 'id'
    },
    onDelete: 'CASCADE',
    field: 'microsite_id'
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
  metaTitle: {
    type: DataTypes.STRING(60),
    allowNull: true,
    field: 'meta_title'
  },
  metaDescription: {
    type: DataTypes.STRING(160),
    allowNull: true,
    field: 'meta_description'
  },
  isHomePage: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_home_page'
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_published'
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'sort_order'
  },
  parentPageId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'microsite_pages',
      key: 'id'
    },
    field: 'parent_page_id'
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
  publishedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'published_at'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'updated_at'
  }
}, {
  sequelize,
  modelName: 'MicrositePage',
  tableName: 'microsite_pages',
  timestamps: true,
  indexes: [
    {
      fields: ['microsite_id']
    },
    {
      fields: ['microsite_id', 'slug'],
      unique: true
    },
    {
      fields: ['microsite_id', 'is_home_page']
    },
    {
      fields: ['parent_page_id']
    }
  ]
});

export default MicrositePage;