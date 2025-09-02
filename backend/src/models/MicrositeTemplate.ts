import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { MicrositeComponent } from './Microsite';

interface MicrositeTemplateAttributes {
  id: number;
  name: string;
  description: string;
  category: 'club' | 'state_committee' | 'general';
  
  // Preview
  thumbnailUrl: string;
  previewUrl: string;
  
  // Template Structure
  structure: {
    colorScheme: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
    };
    
    // Default pages
    pages: {
      name: string;
      slug: string;
      title: string;
      components: MicrositeComponent[];
    }[];
    
    // Available components for this template
    availableComponents: {
      type: string;
      name: string;
      description: string;
      icon: string;
      defaultSettings: Record<string, any>;
      defaultContent: Record<string, any>;
    }[];
  };
  
  // Features
  features: string[]; // List of features this template supports
  
  // Pricing
  isPremium: boolean;
  requiredPlan?: string; // Subscription plan required
  
  // Status
  isActive: boolean;
  version: string;
  
  createdAt: Date;
  updatedAt: Date;
}

interface MicrositeTemplateCreationAttributes extends Optional<MicrositeTemplateAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class MicrositeTemplate extends Model<MicrositeTemplateAttributes, MicrositeTemplateCreationAttributes> implements MicrositeTemplateAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public category!: 'club' | 'state_committee' | 'general';
  
  // Preview
  public thumbnailUrl!: string;
  public previewUrl!: string;
  
  // Template Structure
  public structure!: {
    colorScheme: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
    };
    
    // Default pages
    pages: {
      name: string;
      slug: string;
      title: string;
      components: MicrositeComponent[];
    }[];
    
    // Available components for this template
    availableComponents: {
      type: string;
      name: string;
      description: string;
      icon: string;
      defaultSettings: Record<string, any>;
      defaultContent: Record<string, any>;
    }[];
  };
  
  // Features
  public features!: string[];
  
  // Pricing
  public isPremium!: boolean;
  public requiredPlan?: string;
  
  // Status
  public isActive!: boolean;
  public version!: string;
  
  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Helper methods
  public isAvailableForCategory(category: string): boolean {
    return this.category === 'general' || this.category === category;
  }

  public supportsFeature(feature: string): boolean {
    return this.features.includes(feature);
  }

  public getAvailableComponents() {
    return this.structure.availableComponents;
  }

  public getDefaultPages() {
    return this.structure.pages;
  }
}

MicrositeTemplate.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM('club', 'state_committee', 'general'),
      allowNull: false,
      defaultValue: 'general',
    },
    thumbnailUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'thumbnail_url',
    },
    previewUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'preview_url',
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
          text: '#1e293b',
        },
        pages: [],
        availableComponents: [],
      },
    },
    features: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    isPremium: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_premium',
    },
    requiredPlan: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'required_plan',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active',
    },
    version: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '1.0.0',
    },
  },
  {
    sequelize,
    tableName: 'microsite_templates',
    timestamps: true,
    indexes: [
      {
        fields: ['category'],
      },
      {
        fields: ['is_active'],
      },
      {
        fields: ['is_premium'],
      },
    ],
  }
);

export default MicrositeTemplate;