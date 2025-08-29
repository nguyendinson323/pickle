import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface CourtReviewAttributes {
  id: number;
  courtId: number;
  userId: number;
  reservationId?: number;
  rating: number; // 1-5 stars
  title?: string;
  comment?: string;
  amenityRatings?: {
    cleanliness?: number;
    equipment?: number;
    staff?: number;
    facilities?: number;
    location?: number;
  };
  isVerifiedBooking: boolean;
  isRecommended: boolean;
  ownerResponse?: string;
  ownerResponseAt?: Date;
  isHidden: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface CourtReviewCreationAttributes extends Optional<CourtReviewAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class CourtReview extends Model<CourtReviewAttributes, CourtReviewCreationAttributes> implements CourtReviewAttributes {
  public id!: number;
  public courtId!: number;
  public userId!: number;
  public reservationId?: number;
  public rating!: number;
  public title?: string;
  public comment?: string;
  public amenityRatings?: {
    cleanliness?: number;
    equipment?: number;
    staff?: number;
    facilities?: number;
    location?: number;
  };
  public isVerifiedBooking!: boolean;
  public isRecommended!: boolean;
  public ownerResponse?: string;
  public ownerResponseAt?: Date;
  public isHidden!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CourtReview.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  courtId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'courts', key: 'id' },
    field: 'court_id'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
    field: 'user_id'
  },
  reservationId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'reservations', key: 'id' },
    field: 'reservation_id'
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [3, 100]
    }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  amenityRatings: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'amenity_ratings'
  },
  isVerifiedBooking: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_verified_booking'
  },
  isRecommended: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_recommended'
  },
  ownerResponse: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'owner_response'
  },
  ownerResponseAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'owner_response_at'
  },
  isHidden: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_hidden'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'updated_at'
  }
}, {
  sequelize,
  modelName: 'CourtReview',
  tableName: 'court_reviews',
  timestamps: true,
  indexes: [
    {
      fields: ['court_id']
    },
    {
      fields: ['user_id']
    },
    {
      fields: ['rating']
    },
    {
      fields: ['is_verified_booking']
    },
    {
      fields: ['created_at']
    },
    {
      unique: true,
      fields: ['court_id', 'user_id', 'reservation_id']
    }
  ]
});

export default CourtReview;