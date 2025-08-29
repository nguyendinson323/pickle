import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('court_reviews', {
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
    court_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'courts',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    reservation_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'reservations',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    overall_rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    surface_rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5
      }
    },
    lighting_rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5
      }
    },
    facilities_rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5
      }
    },
    accessibility_rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5
      }
    },
    cleanliness_rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5
      }
    },
    staff_rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5
      }
    },
    value_rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5
      }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    pros: {
      type: DataTypes.JSON,
      allowNull: true
    },
    cons: {
      type: DataTypes.JSON,
      allowNull: true
    },
    would_recommend: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    would_return: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    visit_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    visit_time: {
      type: DataTypes.TIME,
      allowNull: true
    },
    game_type: {
      type: DataTypes.ENUM('singles', 'doubles', 'mixed_doubles', 'practice', 'lesson', 'tournament', 'other'),
      allowNull: true
    },
    weather_conditions: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    court_condition: {
      type: DataTypes.ENUM('excellent', 'good', 'fair', 'poor', 'terrible'),
      allowNull: true
    },
    crowd_level: {
      type: DataTypes.ENUM('empty', 'quiet', 'moderate', 'busy', 'crowded'),
      allowNull: true
    },
    noise_level: {
      type: DataTypes.ENUM('very_quiet', 'quiet', 'moderate', 'loud', 'very_loud'),
      allowNull: true
    },
    parking_experience: {
      type: DataTypes.ENUM('excellent', 'good', 'fair', 'poor', 'terrible'),
      allowNull: true
    },
    booking_experience: {
      type: DataTypes.ENUM('excellent', 'good', 'fair', 'poor', 'terrible'),
      allowNull: true
    },
    images: {
      type: DataTypes.JSON,
      allowNull: true
    },
    helpful_votes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    total_votes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    verification_method: {
      type: DataTypes.ENUM('reservation', 'check_in', 'payment', 'manual'),
      allowNull: true
    },
    is_featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    is_flagged: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    flag_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    moderated_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    moderated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'hidden'),
      defaultValue: 'pending',
      allowNull: false
    },
    language: {
      type: DataTypes.STRING(5),
      defaultValue: 'es',
      allowNull: false
    },
    response_from_owner: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    owner_response_date: {
      type: DataTypes.DATE,
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
  await queryInterface.addIndex('court_reviews', ['user_id']);
  await queryInterface.addIndex('court_reviews', ['court_id']);
  await queryInterface.addIndex('court_reviews', ['reservation_id']);
  await queryInterface.addIndex('court_reviews', ['overall_rating']);
  await queryInterface.addIndex('court_reviews', ['visit_date']);
  await queryInterface.addIndex('court_reviews', ['is_verified']);
  await queryInterface.addIndex('court_reviews', ['is_featured']);
  await queryInterface.addIndex('court_reviews', ['is_flagged']);
  await queryInterface.addIndex('court_reviews', ['status']);
  await queryInterface.addIndex('court_reviews', ['helpful_votes']);
  await queryInterface.addIndex('court_reviews', ['would_recommend']);
  await queryInterface.addIndex('court_reviews', ['moderated_by']);
  await queryInterface.addIndex('court_reviews', ['court_id', 'overall_rating']);
  await queryInterface.addIndex('court_reviews', ['user_id', 'court_id']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('court_reviews');
}