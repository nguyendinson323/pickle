import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface MicrositeTemplateAttributes {
  id: number;
  name: string;
  description: string;
  category: 'club' | 'state' | 'general';
  
  // Preview
  thumbnailUrl: string;
  previewUrl: string;
  
  structure: any;
  
  features: any;
  
  isPremium: boolean;
  requiredPlan?: string;
  isActive: boolean;
  version: string;
}

interface MicrositeTemplateCreationAttributes extends Optional<MicrositeTemplateAttributes, 'id'> {}

class MicrositeTemplate extends Model<MicrositeTemplateAttributes, MicrositeTemplateCreationAttributes> implements MicrositeTemplateAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public category!: 'club' | 'state' | 'general';
  public thumbnailUrl!: string;
  public previewUrl!: string;
  public structure!: any;
  public features!: any;
  public isPremium!: boolean;
  public requiredPlan?: string;
  public isActive!: boolean;
  public version!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MicrositeTemplate.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('club', 'state', 'general'),
    allowNull: false,
    defaultValue: 'general'
  },
  thumbnailUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'thumbnail_url'
  },
  previewUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'preview_url'
  },
  structure: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {
      colorScheme: {
        primary: '#2563eb',
        secondary: '#64748b',
        accent: '#06b6d4',
        background: '#ffffff',
        text: '#1e293b'
      },
      pages: [],
      availableComponents: []
    }
  },
  features: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: []
  },
  isPremium: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_premium'
  },
  requiredPlan: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'required_plan'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active'
  },
  version: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '1.0.0'
  }
}, {
  sequelize,
  modelName: 'MicrositeTemplate',
  tableName: 'microsite_templates',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['category']
    },
    {
      fields: ['is_active']
    },
    {
      fields: ['is_premium']
    }
  ]
});

export default MicrositeTemplate;