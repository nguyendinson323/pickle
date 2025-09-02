import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ThemeAttributes {
  id: number;
  name: string;
  description?: string;
  previewImage?: string;
  isDefault: boolean;
  isActive: boolean;
  colorScheme: any;
  typography: any;
  layout: any;
  customCss?: string;
  settings: any;
}

interface ThemeCreationAttributes extends Optional<ThemeAttributes, 'id'> {}

class Theme extends Model<ThemeAttributes, ThemeCreationAttributes> implements ThemeAttributes {
  public id!: number;
  public name!: string;
  public description?: string;
  public previewImage?: string;
  public isDefault!: boolean;
  public isActive!: boolean;
  public colorScheme!: any;
  public typography!: any;
  public layout!: any;
  public customCss?: string;
  public settings!: any;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Theme.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  previewImage: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'preview_image'
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_default'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  },
  colorScheme: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {},
    field: 'color_scheme'
  },
  typography: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {}
  },
  layout: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {}
  },
  customCss: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'custom_css'
  },
  settings: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {}
  }
}, {
  sequelize,
  modelName: 'Theme',
  tableName: 'themes',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['name'],
      unique: true
    },
    {
      fields: ['is_default']
    },
    {
      fields: ['is_active']
    }
  ]
});

export default Theme;