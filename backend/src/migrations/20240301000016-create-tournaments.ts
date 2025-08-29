import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('tournaments', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    organizer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    organizer_type: {
      type: DataTypes.ENUM('federation', 'state', 'club', 'partner'),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(250),
      allowNull: true,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tournament_type: {
      type: DataTypes.ENUM('championship', 'open', 'invitational', 'league', 'friendly', 'clinic', 'exhibition'),
      allowNull: false
    },
    level: {
      type: DataTypes.ENUM('international', 'national', 'regional', 'state', 'municipal', 'local', 'club'),
      allowNull: false
    },
    format: {
      type: DataTypes.ENUM('single_elimination', 'double_elimination', 'round_robin', 'swiss', 'ladder', 'other'),
      defaultValue: 'single_elimination',
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
      type: DataTypes.STRING(200),
      allowNull: false
    },
    venue_address: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    venue_city: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    venue_state: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    venue_postal_code: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    venue_latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true
    },
    venue_longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true
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
    early_bird_end: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    entry_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    early_bird_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    late_registration_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'MXN',
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
    min_participants: {
      type: DataTypes.INTEGER,
      defaultValue: 8,
      allowNull: false
    },
    waiting_list_size: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('draft', 'open', 'closed', 'full', 'cancelled', 'in_progress', 'completed'),
      defaultValue: 'draft',
      allowNull: false
    },
    prize_pool: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true
    },
    prize_distribution: {
      type: DataTypes.JSON,
      allowNull: true
    },
    sponsors: {
      type: DataTypes.JSON,
      allowNull: true
    },
    sponsor_logos: {
      type: DataTypes.JSON,
      allowNull: true
    },
    images: {
      type: DataTypes.JSON,
      allowNull: true
    },
    banner_image: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    rules_document: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    schedule_document: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    requires_ranking: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    min_ranking_points: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    max_ranking_points: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    requires_membership: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    membership_types: {
      type: DataTypes.JSON,
      allowNull: true
    },
    age_restrictions: {
      type: DataTypes.JSON,
      allowNull: true
    },
    gender_restrictions: {
      type: DataTypes.ENUM('none', 'male_only', 'female_only', 'mixed_required'),
      defaultValue: 'none',
      allowNull: false
    },
    skill_level_restrictions: {
      type: DataTypes.JSON,
      allowNull: true
    },
    allow_late_registration: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    enable_waiting_list: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    auto_accept_registrations: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    require_payment_on_registration: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    refund_policy: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cancellation_policy: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    registration_message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    special_instructions: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    equipment_provided: {
      type: DataTypes.JSON,
      allowNull: true
    },
    equipment_required: {
      type: DataTypes.JSON,
      allowNull: true
    },
    refreshments_included: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    lunch_included: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    accommodation_info: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    transportation_info: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    weather_contingency: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    contact_email: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    contact_phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    website_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    social_media_links: {
      type: DataTypes.JSON,
      allowNull: true
    },
    live_streaming_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    results_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    photos_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    published_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    view_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    registration_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    metadata: {
      type: DataTypes.JSON,
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
  await queryInterface.addIndex('tournaments', ['organizer_id']);
  await queryInterface.addIndex('tournaments', ['organizer_type']);
  await queryInterface.addIndex('tournaments', ['state_id']);
  await queryInterface.addIndex('tournaments', ['slug'], { unique: true });
  await queryInterface.addIndex('tournaments', ['tournament_type']);
  await queryInterface.addIndex('tournaments', ['level']);
  await queryInterface.addIndex('tournaments', ['status']);
  await queryInterface.addIndex('tournaments', ['start_date']);
  await queryInterface.addIndex('tournaments', ['end_date']);
  await queryInterface.addIndex('tournaments', ['registration_start']);
  await queryInterface.addIndex('tournaments', ['registration_end']);
  await queryInterface.addIndex('tournaments', ['featured']);
  await queryInterface.addIndex('tournaments', ['verified']);
  await queryInterface.addIndex('tournaments', ['published']);
  await queryInterface.addIndex('tournaments', ['venue_city']);
  await queryInterface.addIndex('tournaments', ['venue_state']);
  await queryInterface.addIndex('tournaments', ['entry_fee']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('tournaments');
}