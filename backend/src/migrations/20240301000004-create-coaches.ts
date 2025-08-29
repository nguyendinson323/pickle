import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('coaches', {
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
    phone: {
      type: DataTypes.STRING(20),
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
    certification_number: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    certification_level: {
      type: DataTypes.ENUM('basic', 'intermediate', 'advanced', 'professional', 'master'),
      allowNull: false
    },
    certification_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    certification_expiry_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    certification_status: {
      type: DataTypes.ENUM('active', 'expired', 'suspended', 'revoked'),
      defaultValue: 'active',
      allowNull: false
    },
    specializations: {
      type: DataTypes.JSON,
      allowNull: true
    },
    years_experience: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    hourly_rate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'MXN',
      allowNull: false
    },
    languages_spoken: {
      type: DataTypes.JSON,
      allowNull: true
    },
    availability: {
      type: DataTypes.JSON,
      allowNull: true
    },
    location_preferences: {
      type: DataTypes.JSON,
      allowNull: true
    },
    max_travel_distance: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    group_lesson_capacity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    accepts_beginners: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    accepts_advanced: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    teaching_philosophy: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    equipment_provided: {
      type: DataTypes.JSON,
      allowNull: true
    },
    social_media_links: {
      type: DataTypes.JSON,
      allowNull: true
    },
    website: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    achievements: {
      type: DataTypes.JSON,
      allowNull: true
    },
    references: {
      type: DataTypes.JSON,
      allowNull: true
    },
    background_check_status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'expired'),
      allowNull: true
    },
    background_check_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    insurance_coverage: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    insurance_provider: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    insurance_policy_number: {
      type: DataTypes.STRING(100),
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
    total_students: {
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
  await queryInterface.addIndex('coaches', ['user_id'], { unique: true });
  await queryInterface.addIndex('coaches', ['certification_number'], { unique: true });
  await queryInterface.addIndex('coaches', ['state_id']);
  await queryInterface.addIndex('coaches', ['certification_level']);
  await queryInterface.addIndex('coaches', ['certification_status']);
  await queryInterface.addIndex('coaches', ['city']);
  await queryInterface.addIndex('coaches', ['is_featured']);
  await queryInterface.addIndex('coaches', ['is_verified']);
  await queryInterface.addIndex('coaches', ['average_rating']);
  await queryInterface.addIndex('coaches', ['hourly_rate']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('coaches');
}