import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('clubs', {
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
    name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    legal_name: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    logo: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    cover_image: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    state_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'states',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    postal_code: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    website: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    social_media_links: {
      type: DataTypes.JSON,
      allowNull: true
    },
    tax_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true
    },
    registration_number: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true
    },
    founded_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    member_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    court_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    facilities: {
      type: DataTypes.JSON,
      allowNull: true
    },
    amenities: {
      type: DataTypes.JSON,
      allowNull: true
    },
    operating_hours: {
      type: DataTypes.JSON,
      allowNull: true
    },
    membership_fees: {
      type: DataTypes.JSON,
      allowNull: true
    },
    programs_offered: {
      type: DataTypes.JSON,
      allowNull: true
    },
    coaching_staff: {
      type: DataTypes.JSON,
      allowNull: true
    },
    tournament_hosting: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    equipment_rental: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    pro_shop: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    restaurant_bar: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    parking_available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    wheelchair_accessible: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    contact_person_name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    contact_person_title: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    contact_person_phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    contact_person_email: {
      type: DataTypes.STRING(255),
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
    business_license_number: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    business_license_expiry: {
      type: DataTypes.DATEONLY,
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
    safety_protocols: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cancellation_policy: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    refund_policy: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    average_rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true
    },
    total_reviews: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    is_featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    verification_status: {
      type: DataTypes.ENUM('pending', 'verified', 'rejected'),
      defaultValue: 'pending',
      allowNull: false
    },
    verification_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended', 'closed'),
      defaultValue: 'active',
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

  // Add indexes
  await queryInterface.addIndex('clubs', ['user_id'], { unique: true });
  await queryInterface.addIndex('clubs', ['tax_id'], { unique: true });
  await queryInterface.addIndex('clubs', ['registration_number'], { unique: true });
  await queryInterface.addIndex('clubs', ['state_id']);
  await queryInterface.addIndex('clubs', ['city']);
  await queryInterface.addIndex('clubs', ['postal_code']);
  await queryInterface.addIndex('clubs', ['status']);
  await queryInterface.addIndex('clubs', ['is_featured']);
  await queryInterface.addIndex('clubs', ['is_verified']);
  await queryInterface.addIndex('clubs', ['verification_status']);
  await queryInterface.addIndex('clubs', ['average_rating']);
  await queryInterface.addIndex('clubs', ['tournament_hosting']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('clubs');
}