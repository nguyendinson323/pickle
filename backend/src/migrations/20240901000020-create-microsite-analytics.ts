import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('microsite_analytics', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    microsite_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'microsites',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    page_views: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    unique_visitors: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    sessions: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    bounce_rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0
    },
    avg_session_duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    page_metrics: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: []
    },
    traffic_sources: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: []
    },
    device_stats: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: { desktop: 0, mobile: 0, tablet: 0 }
    },
    browser_stats: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: []
    },
    country_stats: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: []
    },
    form_submissions: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    download_clicks: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    social_clicks: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    external_link_clicks: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    }
  });

  // Add indexes exactly as defined in the model
  await queryInterface.addIndex('microsite_analytics', ['microsite_id']);
  await queryInterface.addIndex('microsite_analytics', ['date']);
  await queryInterface.addIndex('microsite_analytics', ['microsite_id', 'date'], { unique: true });

  // Add GIN indexes for JSONB fields
  await queryInterface.addIndex('microsite_analytics', ['page_metrics'], {
    using: 'gin'
  });
  await queryInterface.addIndex('microsite_analytics', ['traffic_sources'], {
    using: 'gin'
  });
  await queryInterface.addIndex('microsite_analytics', ['device_stats'], {
    using: 'gin'
  });
  await queryInterface.addIndex('microsite_analytics', ['browser_stats'], {
    using: 'gin'
  });
  await queryInterface.addIndex('microsite_analytics', ['country_stats'], {
    using: 'gin'
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('microsite_analytics');
}