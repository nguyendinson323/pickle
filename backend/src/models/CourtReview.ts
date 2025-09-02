import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface CourtReviewAttributes {
  id: number;
  courtId: number;
  facilityId: number;
  userId: number;
  bookingId?: number;
  reviewType: 'court' | 'facility' | 'overall';
  ratings: {
    courtCondition: number;
    courtCleanliness: number;
    equipment: number;
    lighting: number;
    accessibility: number;
    facilityAmenities: number;
    staffService: number;
    valueForMoney: number;
    overallExperience: number;
  };
  reviewTitle: string;
  reviewText: string;
  pros: string[];
  cons: string[];
  visitDate: Date;
  visitDuration: number;
  playersCount: number;
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  weatherConditions?: {
    conditions: string;
    temperature: number;
    impact: 'none' | 'minor' | 'moderate' | 'significant';
  };
  photos: string[];
  isVerified: boolean;
  verificationMethod?: 'booking_match' | 'photo_verification' | 'manual_verification';
  helpfulVotes: number;
  unhelpfulVotes: number;
  reportCount: number;
  status: 'active' | 'pending' | 'rejected' | 'hidden';
  moderationNotes?: string;
  responses: {
    responderId: number;
    responderType: 'facility_owner' | 'management' | 'admin';
    responseText: string;
    responseDate: Date;
  }[];
  tags: string[];
  recommendToFriends: boolean;
  wouldPlayAgain: boolean;
  languageCode: 'es' | 'en';
  translatedVersions?: {
    [languageCode: string]: {
      reviewTitle: string;
      reviewText: string;
      translatedAt: Date;
      translator: 'automatic' | 'human';
    };
  };
  metadata: {
    sourceIP?: string;
    userAgent?: string;
    deviceType?: 'mobile' | 'tablet' | 'desktop';
    submissionMethod: 'web' | 'mobile_app' | 'email_link';
  };
  isActive: boolean;
}

interface CourtReviewCreationAttributes extends Optional<CourtReviewAttributes, 'id' | 'bookingId' | 'weatherConditions' | 'verificationMethod' | 'moderationNotes' | 'translatedVersions'> {}

class CourtReview extends Model<CourtReviewAttributes, CourtReviewCreationAttributes> implements CourtReviewAttributes {
  public id!: number;
  public courtId!: number;
  public facilityId!: number;
  public userId!: number;
  public bookingId?: number;
  public reviewType!: 'court' | 'facility' | 'overall';
  public ratings!: {
    courtCondition: number;
    courtCleanliness: number;
    equipment: number;
    lighting: number;
    accessibility: number;
    facilityAmenities: number;
    staffService: number;
    valueForMoney: number;
    overallExperience: number;
  };
  public reviewTitle!: string;
  public reviewText!: string;
  public pros!: string[];
  public cons!: string[];
  public visitDate!: Date;
  public visitDuration!: number;
  public playersCount!: number;
  public skillLevel!: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  public weatherConditions?: {
    conditions: string;
    temperature: number;
    impact: 'none' | 'minor' | 'moderate' | 'significant';
  };
  public photos!: string[];
  public isVerified!: boolean;
  public verificationMethod?: 'booking_match' | 'photo_verification' | 'manual_verification';
  public helpfulVotes!: number;
  public unhelpfulVotes!: number;
  public reportCount!: number;
  public status!: 'active' | 'pending' | 'rejected' | 'hidden';
  public moderationNotes?: string;
  public responses!: {
    responderId: number;
    responderType: 'facility_owner' | 'management' | 'admin';
    responseText: string;
    responseDate: Date;
  }[];
  public tags!: string[];
  public recommendToFriends!: boolean;
  public wouldPlayAgain!: boolean;
  public languageCode!: 'es' | 'en';
  public translatedVersions?: {
    [languageCode: string]: {
      reviewTitle: string;
      reviewText: string;
      translatedAt: Date;
      translator: 'automatic' | 'human';
    };
  };
  public metadata!: {
    sourceIP?: string;
    userAgent?: string;
    deviceType?: 'mobile' | 'tablet' | 'desktop';
    submissionMethod: 'web' | 'mobile_app' | 'email_link';
  };
  public isActive!: boolean;
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
    references: {
      model: 'courts',
      key: 'id'
    },
    onDelete: 'CASCADE',
    field: 'court_id'
  },
  facilityId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'court_facilities',
      key: 'id'
    },
    onDelete: 'CASCADE',
    field: 'facility_id'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    field: 'user_id'
  },
  bookingId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'court_bookings',
      key: 'id'
    },
    field: 'booking_id'
  },
  reviewType: {
    type: DataTypes.ENUM('court', 'facility', 'overall'),
    allowNull: false,
    defaultValue: 'overall',
    field: 'review_type'
  },
  ratings: {
    type: DataTypes.JSONB,
    allowNull: false,
    validate: {
      isValidRatings(value: any) {
        if (!value || typeof value !== 'object') {
          throw new Error('Ratings must be an object');
        }
        const requiredRatings = [
          'courtCondition', 'courtCleanliness', 'equipment', 'lighting', 
          'accessibility', 'facilityAmenities', 'staffService', 'valueForMoney', 
          'overallExperience'
        ];
        for (const rating of requiredRatings) {
          if (typeof value[rating] !== 'number' || value[rating] < 1 || value[rating] > 5) {
            throw new Error(`${rating} must be a number between 1 and 5`);
          }
        }
      }
    }
  },
  reviewTitle: {
    type: DataTypes.STRING(200),
    allowNull: false,
    field: 'review_title',
    validate: {
      notEmpty: true,
      len: [5, 200]
    }
  },
  reviewText: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'review_text',
    validate: {
      notEmpty: true,
      len: [20, 2000]
    }
  },
  pros: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: [],
    validate: {
      isValidPros(value: any) {
        if (!Array.isArray(value)) {
          throw new Error('Pros must be an array');
        }
        if (value.length > 10) {
          throw new Error('Maximum 10 pros allowed');
        }
        for (const pro of value) {
          if (typeof pro !== 'string' || pro.length > 100) {
            throw new Error('Each pro must be a string with maximum 100 characters');
          }
        }
      }
    }
  },
  cons: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: [],
    validate: {
      isValidCons(value: any) {
        if (!Array.isArray(value)) {
          throw new Error('Cons must be an array');
        }
        if (value.length > 10) {
          throw new Error('Maximum 10 cons allowed');
        }
        for (const con of value) {
          if (typeof con !== 'string' || con.length > 100) {
            throw new Error('Each con must be a string with maximum 100 characters');
          }
        }
      }
    }
  },
  visitDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'visit_date',
    validate: {
      isBefore: new Date().toDateString()
    }
  },
  visitDuration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'visit_duration',
    validate: {
      min: 30,
      max: 480
    }
  },
  playersCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'players_count',
    validate: {
      min: 1,
      max: 4
    }
  },
  skillLevel: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced', 'professional'),
    allowNull: false,
    field: 'skill_level'
  },
  weatherConditions: {
    type: DataTypes.JSONB,
    allowNull: true,
    field: 'weather_conditions',
    validate: {
      isValidWeather(value: any) {
        if (value && typeof value === 'object') {
          if (!value.conditions || typeof value.conditions !== 'string') {
            throw new Error('Weather conditions must include conditions string');
          }
          if (typeof value.temperature !== 'number') {
            throw new Error('Weather conditions must include temperature number');
          }
          if (!['none', 'minor', 'moderate', 'significant'].includes(value.impact)) {
            throw new Error('Weather impact must be none, minor, moderate, or significant');
          }
        }
      }
    }
  },
  photos: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: [],
    validate: {
      isValidPhotos(value: any) {
        if (!Array.isArray(value)) {
          throw new Error('Photos must be an array');
        }
        if (value.length > 10) {
          throw new Error('Maximum 10 photos allowed');
        }
      }
    }
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_verified'
  },
  verificationMethod: {
    type: DataTypes.ENUM('booking_match', 'photo_verification', 'manual_verification'),
    allowNull: true,
    field: 'verification_method'
  },
  helpfulVotes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'helpful_votes',
    validate: {
      min: 0
    }
  },
  unhelpfulVotes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'unhelpful_votes',
    validate: {
      min: 0
    }
  },
  reportCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'report_count',
    validate: {
      min: 0
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'pending', 'rejected', 'hidden'),
    allowNull: false,
    defaultValue: 'pending'
  },
  moderationNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'moderation_notes'
  },
  responses: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: [],
    validate: {
      isValidResponses(value: any) {
        if (!Array.isArray(value)) {
          throw new Error('Responses must be an array');
        }
        for (const response of value) {
          if (!response.responderId || typeof response.responderId !== 'number') {
            throw new Error('Each response must have a responder ID');
          }
          if (!['facility_owner', 'management', 'admin'].includes(response.responderType)) {
            throw new Error('Responder type must be facility_owner, management, or admin');
          }
          if (!response.responseText || typeof response.responseText !== 'string') {
            throw new Error('Each response must have response text');
          }
        }
      }
    }
  },
  tags: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: [],
    validate: {
      isValidTags(value: any) {
        if (!Array.isArray(value)) {
          throw new Error('Tags must be an array');
        }
        if (value.length > 20) {
          throw new Error('Maximum 20 tags allowed');
        }
        for (const tag of value) {
          if (typeof tag !== 'string' || tag.length > 30) {
            throw new Error('Each tag must be a string with maximum 30 characters');
          }
        }
      }
    }
  },
  recommendToFriends: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    field: 'recommend_to_friends'
  },
  wouldPlayAgain: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    field: 'would_play_again'
  },
  languageCode: {
    type: DataTypes.ENUM('es', 'en'),
    allowNull: false,
    defaultValue: 'es',
    field: 'language_code'
  },
  translatedVersions: {
    type: DataTypes.JSONB,
    allowNull: true,
    field: 'translated_versions'
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: false,
    validate: {
      isValidMetadata(value: any) {
        if (!value || typeof value !== 'object') {
          throw new Error('Metadata must be an object');
        }
        if (!['web', 'mobile_app', 'email_link'].includes(value.submissionMethod)) {
          throw new Error('Submission method must be web, mobile_app, or email_link');
        }
        if (value.deviceType && !['mobile', 'tablet', 'desktop'].includes(value.deviceType)) {
          throw new Error('Device type must be mobile, tablet, or desktop');
        }
      }
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active'
  }
}, {
  sequelize,
  modelName: 'CourtReview',
  tableName: 'court_reviews',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['court_id']
    },
    {
      fields: ['facility_id']
    },
    {
      fields: ['user_id']
    },
    {
      fields: ['booking_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['review_type']
    },
    {
      fields: ['visit_date']
    },
    {
      fields: ['is_verified']
    },
    {
      fields: ['language_code']
    },
    {
      fields: ['is_active']
    },
    {
      fields: ['helpful_votes']
    },
    {
      fields: ['created_at']
    },
    {
      name: 'court_reviews_ratings_gin',
      fields: ['ratings'],
      using: 'gin'
    },
    {
      name: 'court_reviews_tags_gin',
      fields: ['tags'],
      using: 'gin'
    }
  ]
});

export default CourtReview;