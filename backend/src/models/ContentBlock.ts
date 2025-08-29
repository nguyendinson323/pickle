import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ContentBlockAttributes {
  id: number;
  pageId: number;
  type: string;
  content: any;
  sortOrder: number;
  isVisible: boolean;
  settings: any;
  createdAt: Date;
  updatedAt: Date;
}

interface ContentBlockCreationAttributes extends Optional<ContentBlockAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class ContentBlock extends Model<ContentBlockAttributes, ContentBlockCreationAttributes> implements ContentBlockAttributes {
  public id!: number;
  public pageId!: number;
  public type!: string;
  public content!: any;
  public sortOrder!: number;
  public isVisible!: boolean;
  public settings!: any;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ContentBlock.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  pageId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'microsite_pages',
      key: 'id'
    },
    onDelete: 'CASCADE',
    field: 'page_id'
  },
  type: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: [['text', 'image', 'gallery', 'video', 'contact', 'map', 'court_list', 'tournament_list', 'calendar', 'custom_html']]
    }
  },
  content: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'sort_order'
  },
  isVisible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_visible'
  },
  settings: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {}
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
  modelName: 'ContentBlock',
  tableName: 'content_blocks',
  timestamps: true,
  indexes: [
    {
      fields: ['page_id']
    },
    {
      fields: ['page_id', 'sort_order']
    },
    {
      fields: ['type']
    }
  ]
});

export default ContentBlock;