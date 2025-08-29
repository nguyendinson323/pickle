import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('tournaments', {
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
    organizer_type: {
      type: DataTypes.ENUM('federation', 'state', 'club', 'partner'),
      allowNull: false
    },
    organizer_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tournament_type: {
      type: DataTypes.ENUM('championship', 'league', 'open', 'friendly'),
      allowNull: false
    },
    level: {
      type: DataTypes.ENUM('national', 'state', 'municipal', 'local'),
      allowNull: false
    },
    state_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'states',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    venue_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    venue_address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    venue_city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    venue_state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    registration_start: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    registration_end: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    entry_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    max_participants: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    current_participants: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('draft', 'open', 'registration_closed', 'in_progress', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'draft'
    },
    prize_pool: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    rules_document: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    images: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: []
    },
    requires_ranking: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    min_ranking_points: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    max_ranking_points: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    allow_late_registration: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    enable_waiting_list: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    registration_message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    sponsor_logos: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    contact_email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    contact_phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    website_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    social_media_links: {
      type: DataTypes.JSON,
      allowNull: true
    },
    special_instructions: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    weather_contingency: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    transportation_info: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    accommodation_info: {
      type: DataTypes.TEXT,
      allowNull: true
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

  // Add indexes
  await queryInterface.addIndex('tournaments', ['organizer_type', 'organizer_id']);
  await queryInterface.addIndex('tournaments', ['level']);
  await queryInterface.addIndex('tournaments', ['state_id']);
  await queryInterface.addIndex('tournaments', ['status']);
  await queryInterface.addIndex('tournaments', ['start_date']);
  await queryInterface.addIndex('tournaments', ['tournament_type']);
  await queryInterface.addIndex('tournaments', ['registration_start', 'registration_end']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('tournaments');
}