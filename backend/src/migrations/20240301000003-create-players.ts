import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('players', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    birth_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
      allowNull: false
    },
    curp: {
      type: DataTypes.STRING(18),
      allowNull: false,
      unique: true
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    emergency_contact_name: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    emergency_contact_phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    emergency_contact_relationship: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true
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
    postal_code: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    profile_image: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    ntrp_level: {
      type: DataTypes.ENUM('2.0', '2.5', '3.0', '3.5', '4.0', '4.5', '5.0', '5.5', '6.0'),
      allowNull: true
    },
    dominant_hand: {
      type: DataTypes.ENUM('left', 'right'),
      allowNull: true
    },
    playing_style: {
      type: DataTypes.ENUM('aggressive', 'defensive', 'balanced', 'power', 'finesse'),
      allowNull: true
    },
    years_experience: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    preferred_court_surface: {
      type: DataTypes.ENUM('outdoor', 'indoor', 'both'),
      allowNull: true
    },
    availability: {
      type: DataTypes.JSON,
      allowNull: true
    },
    medical_conditions: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    allergies: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    medications: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    insurance_provider: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    insurance_policy_number: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    waiver_signed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    waiver_signed_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    preferred_communication: {
      type: DataTypes.ENUM('email', 'phone', 'whatsapp', 'sms'),
      defaultValue: 'email',
      allowNull: false
    },
    privacy_level: {
      type: DataTypes.ENUM('public', 'private', 'friends_only'),
      defaultValue: 'public',
      allowNull: false
    },
    show_contact_info: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    allow_messages: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    social_media_links: {
      type: DataTypes.JSON,
      allowNull: true
    },
    is_professional: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    achievements: {
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
  await queryInterface.addIndex('players', ['user_id'], { unique: true });
  await queryInterface.addIndex('players', ['curp'], { unique: true });
  await queryInterface.addIndex('players', ['state_id']);
  await queryInterface.addIndex('players', ['ntrp_level']);
  await queryInterface.addIndex('players', ['gender']);
  await queryInterface.addIndex('players', ['is_professional']);
  await queryInterface.addIndex('players', ['birth_date']);
  await queryInterface.addIndex('players', ['city']);
  await queryInterface.addIndex('players', ['postal_code']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('players');
}