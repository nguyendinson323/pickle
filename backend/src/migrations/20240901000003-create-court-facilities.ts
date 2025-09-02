import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('court_facilities', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    owner_type: {
      type: DataTypes.ENUM('club', 'independent'),
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(300),
      allowNull: false
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    zip_code: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'Mexico'
    },
    coordinates: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    total_courts: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    facility_type: {
      type: DataTypes.ENUM('indoor', 'outdoor', 'mixed'),
      allowNull: false
    },
    operating_hours: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    amenities: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: []
    },
    parking_spaces: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    has_restrooms: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    has_showers: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    has_pro_shop: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    has_rental: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    contact_phone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    contact_email: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    website: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    social_media: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    verification_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    photos: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: []
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
      defaultValue: 0
    },
    total_reviews: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    policies: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    pricing: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    booking_settings: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    integrations: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    business_hours: {
      type: DataTypes.JSONB,
      allowNull: false
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
  await queryInterface.addIndex('court_facilities', ['owner_id']);
  await queryInterface.addIndex('court_facilities', ['city', 'state']);
  await queryInterface.addIndex('court_facilities', ['is_active', 'is_verified']);
  await queryInterface.addIndex('court_facilities', ['facility_type']);
  await queryInterface.addIndex('court_facilities', ['rating']);
  
  // Create GIN index for coordinates JSONB field
  await queryInterface.addIndex('court_facilities', ['coordinates'], {
    name: 'court_facilities_coordinates_idx',
    using: 'gin'
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('court_facilities');
}