import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('court_reviews', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    court_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'courts',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    facility_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'court_facilities',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    booking_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'court_bookings',
        key: 'id'
      }
    },
    review_type: {
      type: DataTypes.ENUM('court', 'facility', 'overall'),
      allowNull: false,
      defaultValue: 'overall'
    },
    ratings: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    review_title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    review_text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    pros: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: []
    },
    cons: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: []
    },
    visit_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    visit_duration: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    players_count: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    skill_level: {
      type: DataTypes.ENUM('beginner', 'intermediate', 'advanced', 'professional'),
      allowNull: false
    },
    weather_conditions: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    photos: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: []
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    verification_method: {
      type: DataTypes.ENUM('booking_match', 'photo_verification', 'manual_verification'),
      allowNull: true
    },
    helpful_votes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    unhelpful_votes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    report_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('active', 'pending', 'rejected', 'hidden'),
      allowNull: false,
      defaultValue: 'pending'
    },
    moderation_notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    responses: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: []
    },
    tags: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: []
    },
    recommend_to_friends: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    would_play_again: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    language_code: {
      type: DataTypes.ENUM('es', 'en'),
      allowNull: false,
      defaultValue: 'es'
    },
    translated_versions: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
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
  await queryInterface.addIndex('court_reviews', ['court_id']);
  await queryInterface.addIndex('court_reviews', ['facility_id']);
  await queryInterface.addIndex('court_reviews', ['user_id']);
  await queryInterface.addIndex('court_reviews', ['booking_id']);
  await queryInterface.addIndex('court_reviews', ['status']);
  await queryInterface.addIndex('court_reviews', ['review_type']);
  await queryInterface.addIndex('court_reviews', ['visit_date']);
  await queryInterface.addIndex('court_reviews', ['is_verified']);
  await queryInterface.addIndex('court_reviews', ['language_code']);
  await queryInterface.addIndex('court_reviews', ['is_active']);
  await queryInterface.addIndex('court_reviews', ['helpful_votes']);
  await queryInterface.addIndex('court_reviews', ['created_at']);
  
  // Create GIN indexes for JSONB fields
  await queryInterface.addIndex('court_reviews', ['ratings'], {
    name: 'court_reviews_ratings_gin',
    using: 'gin'
  });
  await queryInterface.addIndex('court_reviews', ['tags'], {
    name: 'court_reviews_tags_gin',
    using: 'gin'
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('court_reviews');
}