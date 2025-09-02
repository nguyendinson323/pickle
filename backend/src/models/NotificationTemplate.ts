import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface NotificationTemplateAttributes {
  id: number;
  name: string;
  type: string; // 'tournament_reminder', 'booking_confirmation', etc.
  category: 'tournament' | 'booking' | 'message' | 'system' | 'payment';
  
  // Template content
  templates: {
    inApp: {
      title: string;
      message: string;
      actionText?: string;
    };
    email: {
      subject: string;
      htmlContent: string;
      textContent: string;
    };
    sms: {
      message: string;
    };
    push: {
      title: string;
      body: string;
      icon?: string;
    };
  };
  
  // Template variables
  variables: {
    name: string;
    description: string;
    type: 'string' | 'number' | 'date' | 'boolean';
    required: boolean;
  }[];
  
  // Status
  isActive: boolean;
  version: number;
}

interface NotificationTemplateCreationAttributes extends Optional<NotificationTemplateAttributes, 'id' | 'isActive' | 'version'> {}

class NotificationTemplate extends Model<NotificationTemplateAttributes, NotificationTemplateCreationAttributes> implements NotificationTemplateAttributes {
  public id!: number;
  public name!: string;
  public type!: string;
  public category!: 'tournament' | 'booking' | 'message' | 'system' | 'payment';
  
  public templates!: {
    inApp: {
      title: string;
      message: string;
      actionText?: string;
    };
    email: {
      subject: string;
      htmlContent: string;
      textContent: string;
    };
    sms: {
      message: string;
    };
    push: {
      title: string;
      body: string;
      icon?: string;
    };
  };
  
  public variables!: {
    name: string;
    description: string;
    type: 'string' | 'number' | 'date' | 'boolean';
    required: boolean;
  }[];
  
  public isActive!: boolean;
  public version!: number;
}

NotificationTemplate.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [1, 100]
    }
  },
  type: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 50]
    }
  },
  category: {
    type: DataTypes.ENUM('tournament', 'booking', 'message', 'system', 'payment'),
    allowNull: false
  },
  templates: {
    type: DataTypes.JSONB,
    allowNull: false,
    validate: {
      isValidTemplates(value: any) {
        if (!value || typeof value !== 'object') {
          throw new Error('Templates must be an object');
        }
        
        const requiredChannels = ['inApp', 'email', 'sms', 'push'];
        for (const channel of requiredChannels) {
          if (!value[channel] || typeof value[channel] !== 'object') {
            throw new Error(`Template for ${channel} is required and must be an object`);
          }
        }

        // Validate inApp template
        if (!value.inApp.title || !value.inApp.message) {
          throw new Error('inApp template must have title and message');
        }

        // Validate email template
        if (!value.email.subject || !value.email.htmlContent || !value.email.textContent) {
          throw new Error('Email template must have subject, htmlContent, and textContent');
        }

        // Validate SMS template
        if (!value.sms.message) {
          throw new Error('SMS template must have message');
        }
        if (value.sms.message.length > 160) {
          throw new Error('SMS message must be 160 characters or less');
        }

        // Validate push template
        if (!value.push.title || !value.push.body) {
          throw new Error('Push template must have title and body');
        }
      }
    }
  },
  variables: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: [],
    validate: {
      isValidVariables(value: any) {
        if (!Array.isArray(value)) {
          throw new Error('Variables must be an array');
        }
        
        for (const variable of value) {
          if (!variable.name || !variable.description || !variable.type) {
            throw new Error('Each variable must have name, description, and type');
          }
          
          if (!['string', 'number', 'date', 'boolean'].includes(variable.type)) {
            throw new Error('Variable type must be string, number, date, or boolean');
          }
          
          if (typeof variable.required !== 'boolean') {
            throw new Error('Variable required must be a boolean');
          }
        }
      }
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active'
  },
  version: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1
    }
  }
}, {
  sequelize,
  modelName: 'NotificationTemplate',
  tableName: 'notification_templates',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['name']
    },
    {
      fields: ['type']
    },
    {
      fields: ['category']
    },
    {
      fields: ['is_active']
    },
    {
      fields: ['version']
    }
  ]
});

export default NotificationTemplate;