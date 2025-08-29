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
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
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
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    amenity_ratings: {
      type: DataTypes.JSON,
      allowNull: true
    },
    is_verified_booking: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    is_recommended: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    owner_response: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    owner_response_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_hidden: {
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
  await queryInterface.addIndex('court_reviews', ['court_id']);
  await queryInterface.addIndex('court_reviews', ['user_id']);
  await queryInterface.addIndex('court_reviews', ['rating']);
  await queryInterface.addIndex('court_reviews', ['is_verified_booking']);
  await queryInterface.addIndex('court_reviews', ['created_at']);
  await queryInterface.addIndex('court_reviews', ['court_id', 'user_id', 'reservation_id'], { 
    unique: true,
    name: 'court_reviews_unique_constraint'
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('court_reviews');
}