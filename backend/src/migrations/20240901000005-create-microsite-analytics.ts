import { QueryInterface, DataTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface): Promise<void> => {
  await queryInterface.createTable('microsite_analytics', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    microsite_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'microsites',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    page_views: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    unique_visitors: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    sessions: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    bounce_rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
    },
    avg_session_duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    page_metrics: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    traffic_sources: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    device_stats: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: { desktop: 0, mobile: 0, tablet: 0 },
    },
    browser_stats: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    country_stats: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    form_submissions: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    download_clicks: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    social_clicks: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    external_link_clicks: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
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
  await queryInterface.addIndex('microsite_analytics', ['microsite_id']);
  await queryInterface.addIndex('microsite_analytics', ['date']);
  await queryInterface.addIndex('microsite_analytics', ['microsite_id', 'date'], { unique: true });
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
  await queryInterface.dropTable('microsite_analytics');
};