import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface SubscriptionPlanAttributes {
  id: number;
  name: string;
  description: string;
  stripePriceId: string;
  stripeProductId: string;
  
  // Pricing
  amount: number; // in cents
  currency: 'USD' | 'MXN';
  interval: 'month' | 'year';
  intervalCount: number;
  
  // Trial
  trialPeriodDays?: number;
  
  // Features
  features: {
    name: string;
    description: string;
    included: boolean;
    limit?: number; // null means unlimited
  }[];
  
  // Limits for pickleball platform
  maxTournamentRegistrations?: number; // per month
  maxCourtBookings?: number; // per month
  maxPlayerMatches?: number; // per month
  advancedFilters: boolean;
  prioritySupport: boolean;
  analyticsAccess: boolean;
  customBranding: boolean; // for clubs
  
  // Status
  isActive: boolean;
  isPopular: boolean;
  sortOrder: number;
}

interface SubscriptionPlanCreationAttributes extends Optional<SubscriptionPlanAttributes, 'id' | 'trialPeriodDays' | 'maxTournamentRegistrations' | 'maxCourtBookings' | 'maxPlayerMatches'> {}

class SubscriptionPlan extends Model<SubscriptionPlanAttributes, SubscriptionPlanCreationAttributes> implements SubscriptionPlanAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public stripePriceId!: string;
  public stripeProductId!: string;
  
  public amount!: number;
  public currency!: 'USD' | 'MXN';
  public interval!: 'month' | 'year';
  public intervalCount!: number;
  
  public trialPeriodDays?: number;
  
  public features!: {
    name: string;
    description: string;
    included: boolean;
    limit?: number;
  }[];
  
  public maxTournamentRegistrations?: number;
  public maxCourtBookings?: number;
  public maxPlayerMatches?: number;
  public advancedFilters!: boolean;
  public prioritySupport!: boolean;
  public analyticsAccess!: boolean;
  public customBranding!: boolean;
  
  public isActive!: boolean;
  public isPopular!: boolean;
  public sortOrder!: number;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Association properties
  public subscriptions?: any[];
}

SubscriptionPlan.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  stripePriceId: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    field: 'stripe_price_id'
  },
  stripeProductId: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'stripe_product_id'
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    },
    comment: 'Amount in cents'
  },
  currency: {
    type: DataTypes.ENUM('USD', 'MXN'),
    allowNull: false,
    defaultValue: 'USD'
  },
  interval: {
    type: DataTypes.ENUM('month', 'year'),
    allowNull: false,
    defaultValue: 'month'
  },
  intervalCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1
    },
    field: 'interval_count'
  },
  trialPeriodDays: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    },
    field: 'trial_period_days'
  },
  features: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: [],
    validate: {
      isValidFeatures(value: any) {
        if (!Array.isArray(value)) {
          throw new Error('Features must be an array');
        }
        
        for (const feature of value) {
          if (!feature.name || !feature.description || typeof feature.included !== 'boolean') {
            throw new Error('Each feature must have name, description, and included properties');
          }
        }
      }
    }
  },
  maxTournamentRegistrations: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    },
    field: 'max_tournament_registrations'
  },
  maxCourtBookings: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    },
    field: 'max_court_bookings'
  },
  maxPlayerMatches: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    },
    field: 'max_player_matches'
  },
  advancedFilters: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'advanced_filters'
  },
  prioritySupport: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'priority_support'
  },
  analyticsAccess: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'analytics_access'
  },
  customBranding: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'custom_branding'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active'
  },
  isPopular: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_popular'
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    },
    field: 'sort_order'
  }
}, {
  sequelize,
  modelName: 'SubscriptionPlan',
  tableName: 'subscription_plans',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['stripe_price_id'],
      unique: true
    },
    {
      fields: ['stripe_product_id']
    },
    {
      fields: ['is_active']
    },
    {
      fields: ['is_popular']
    },
    {
      fields: ['sort_order']
    },
    {
      fields: ['amount']
    },
    {
      fields: ['interval']
    }
  ]
});

export default SubscriptionPlan;