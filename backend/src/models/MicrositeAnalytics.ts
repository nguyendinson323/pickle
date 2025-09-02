import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface MicrositeAnalyticsAttributes {
  id: number;
  micrositeId: number;
  
  // Date tracking
  date: Date; // Daily aggregated data
  
  // Traffic metrics
  pageViews: number;
  uniqueVisitors: number;
  sessions: number;
  bounceRate: number;
  avgSessionDuration: number; // in seconds
  
  // Page-specific metrics
  pageMetrics: {
    pageId: string;
    slug: string;
    views: number;
    uniqueViews: number;
    avgTimeOnPage: number;
    bounceRate: number;
  }[];
  
  // Traffic sources
  trafficSources: {
    source: string; // 'direct', 'search', 'social', 'referral'
    sessions: number;
    percentage: number;
  }[];
  
  // Device/browser info
  deviceStats: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  
  browserStats: {
    browser: string;
    sessions: number;
  }[];
  
  // Geographic data
  countryStats: {
    country: string;
    sessions: number;
  }[];
  
  // Engagement metrics
  formSubmissions: number;
  downloadClicks: number;
  socialClicks: number;
  externalLinkClicks: number;
}

interface MicrositeAnalyticsCreationAttributes extends Optional<MicrositeAnalyticsAttributes, 'id'> {}

class MicrositeAnalytics extends Model<MicrositeAnalyticsAttributes, MicrositeAnalyticsCreationAttributes> implements MicrositeAnalyticsAttributes {
  public id!: number;
  public micrositeId!: number;
  
  // Date tracking
  public date!: Date;
  
  // Traffic metrics
  public pageViews!: number;
  public uniqueVisitors!: number;
  public sessions!: number;
  public bounceRate!: number;
  public avgSessionDuration!: number;
  
  // Page-specific metrics
  public pageMetrics!: {
    pageId: string;
    slug: string;
    views: number;
    uniqueViews: number;
    avgTimeOnPage: number;
    bounceRate: number;
  }[];
  
  // Traffic sources
  public trafficSources!: {
    source: string;
    sessions: number;
    percentage: number;
  }[];
  
  // Device/browser info
  public deviceStats!: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  
  public browserStats!: {
    browser: string;
    sessions: number;
  }[];
  
  // Geographic data
  public countryStats!: {
    country: string;
    sessions: number;
  }[];
  
  // Engagement metrics
  public formSubmissions!: number;
  public downloadClicks!: number;
  public socialClicks!: number;
  public externalLinkClicks!: number;
  
  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Helper methods
  public getTotalEngagement(): number {
    return this.formSubmissions + this.downloadClicks + this.socialClicks + this.externalLinkClicks;
  }

  public getTopTrafficSource(): string {
    if (this.trafficSources.length === 0) return 'unknown';
    return this.trafficSources.reduce((prev, current) => 
      (prev.sessions > current.sessions) ? prev : current
    ).source;
  }

  public getMobileTrafficPercentage(): number {
    const total = this.deviceStats.desktop + this.deviceStats.mobile + this.deviceStats.tablet;
    return total > 0 ? Math.round((this.deviceStats.mobile / total) * 100) : 0;
  }
}

MicrositeAnalytics.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    micrositeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'microsites',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      field: 'microsite_id'
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    pageViews: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'page_views'
    },
    uniqueVisitors: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'unique_visitors'
    },
    sessions: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    bounceRate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'bounce_rate'
    },
    avgSessionDuration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'avg_session_duration'
    },
    pageMetrics: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      field: 'page_metrics'
    },
    trafficSources: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      field: 'traffic_sources'
    },
    deviceStats: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: { desktop: 0, mobile: 0, tablet: 0 },
      field: 'device_stats'
    },
    browserStats: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      field: 'browser_stats'
    },
    countryStats: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      field: 'country_stats'
    },
    formSubmissions: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'form_submissions'
    },
    downloadClicks: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'download_clicks'
    },
    socialClicks: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'social_clicks'
    },
    externalLinkClicks: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'external_link_clicks'
    }
  },
  {
    sequelize,
    modelName: 'MicrositeAnalytics',
    tableName: 'microsite_analytics',
    timestamps: true,
  underscored: true,
    indexes: [
      {
        fields: ['microsite_id']
      },
      {
        fields: ['date']
      },
      {
        fields: ['microsite_id', 'date'],
        unique: true
      }
    ]
  }
);


export default MicrositeAnalytics;