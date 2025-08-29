import { Op } from 'sequelize';
import Court from '../models/Court';
import State from '../models/State';
import CourtReview from '../models/CourtReview';
import User from '../models/User';
import sequelize from '../config/database';

interface CourtSearchFilters {
  location?: string;
  latitude?: number;
  longitude?: number;
  radius?: number; // in kilometers
  priceRange?: [number, number];
  amenities?: string[];
  surfaceType?: string;
  date?: string;
  timeRange?: [string, string];
  sortBy?: 'distance' | 'price' | 'rating' | 'name';
  sortOrder?: 'asc' | 'desc';
}

interface CourtData {
  name: string;
  description: string;
  surfaceType: 'indoor' | 'outdoor' | 'concrete' | 'clay' | 'artificial_grass';
  ownerType: 'club' | 'partner';
  ownerId: number;
  stateId: number;
  address: string;
  latitude: number;
  longitude: number;
  amenities: string[];
  hourlyRate: number;
  peakHourRate?: number;
  weekendRate?: number;
  images?: string[];
  operatingHours?: any;
  maxAdvanceBookingDays?: number;
  minBookingDuration?: number;
  maxBookingDuration?: number;
  cancellationPolicy?: string;
}

export class CourtService {
  
  static async createCourt(courtData: CourtData): Promise<Court> {
    try {
      const court = await Court.create(courtData);
      return court;
    } catch (error: any) {
      throw new Error(`Error creating court: ${error.message}`);
    }
  }

  static async updateCourt(courtId: number, updates: Partial<CourtData>): Promise<Court> {
    try {
      const court = await Court.findByPk(courtId);
      if (!court) {
        throw new Error('Court not found');
      }

      await court.update(updates);
      return court;
    } catch (error: any) {
      throw new Error(`Error updating court: ${error.message}`);
    }
  }

  static async deleteCourt(courtId: number): Promise<void> {
    try {
      const court = await Court.findByPk(courtId);
      if (!court) {
        throw new Error('Court not found');
      }

      await court.update({ isActive: false });
    } catch (error: any) {
      throw new Error(`Error deleting court: ${error.message}`);
    }
  }

  static async getCourt(courtId: number): Promise<Court | null> {
    try {
      const court = await Court.findByPk(courtId, {
        include: [
          {
            model: State,
            as: 'state',
            attributes: ['id', 'name', 'code']
          },
          {
            model: CourtReview,
            as: 'reviews',
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['id', 'username']
              }
            ],
            where: { isHidden: false },
            required: false,
            limit: 10,
            order: [['createdAt', 'DESC']]
          }
        ]
      });

      if (court) {
        // Calculate average rating
        const reviews = court.get('reviews') as any[];
        const avgRating = reviews.length > 0 
          ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
          : 0;
        
        (court as any).dataValues.averageRating = Number(avgRating.toFixed(1));
        (court as any).dataValues.totalReviews = reviews.length;
      }

      return court;
    } catch (error: any) {
      throw new Error(`Error fetching court: ${error.message}`);
    }
  }

  static async getCourtsByOwner(ownerId: number, ownerType: string): Promise<Court[]> {
    try {
      const courts = await Court.findAll({
        where: {
          ownerId,
          ownerType,
          isActive: true
        },
        include: [
          {
            model: State,
            as: 'state',
            attributes: ['id', 'name', 'code']
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      return courts;
    } catch (error: any) {
      throw new Error(`Error fetching owner courts: ${error.message}`);
    }
  }

  static async searchCourts(filters: CourtSearchFilters): Promise<Court[]> {
    try {
      const whereConditions: any = {
        isActive: true
      };

      // Filter by surface type
      if (filters.surfaceType) {
        whereConditions.surfaceType = filters.surfaceType;
      }

      // Filter by price range
      if (filters.priceRange) {
        whereConditions.hourlyRate = {
          [Op.between]: filters.priceRange
        };
      }

      // Filter by amenities
      if (filters.amenities && filters.amenities.length > 0) {
        whereConditions.amenities = {
          [Op.overlap]: filters.amenities
        };
      }

      let query: any = {
        where: whereConditions,
        include: [
          {
            model: State,
            as: 'state',
            attributes: ['id', 'name', 'code']
          }
        ]
      };

      // Location-based search
      if (filters.latitude && filters.longitude && filters.radius) {
        const radiusInDegrees = filters.radius / 111; // Approximate conversion
        
        whereConditions.latitude = {
          [Op.between]: [filters.latitude - radiusInDegrees, filters.latitude + radiusInDegrees]
        };
        whereConditions.longitude = {
          [Op.between]: [filters.longitude - radiusInDegrees, filters.longitude + radiusInDegrees]
        };
        
        // Add distance calculation
        query.attributes = [
          '*',
          [
            sequelize.literal(`(
              6371 * acos(
                cos(radians(${filters.latitude})) * 
                cos(radians(latitude)) * 
                cos(radians(longitude) - radians(${filters.longitude})) + 
                sin(radians(${filters.latitude})) * 
                sin(radians(latitude))
              )
            )`),
            'distance'
          ]
        ];

        // Sort by distance if specified
        if (filters.sortBy === 'distance') {
          query.order = [[sequelize.literal('distance'), filters.sortOrder || 'asc']];
        }
      }

      // Location name search
      if (filters.location && !filters.latitude) {
        query.include.push({
          model: State,
          as: 'state',
          where: {
            name: {
              [Op.iLike]: `%${filters.location}%`
            }
          },
          attributes: ['id', 'name', 'code']
        });
      }

      // Sorting
      if (!query.order) {
        let orderField = 'createdAt';
        if (filters.sortBy === 'price') orderField = 'hourlyRate';
        if (filters.sortBy === 'name') orderField = 'name';
        
        query.order = [[orderField, filters.sortOrder || 'desc']];
      }

      const courts = await Court.findAll(query);

      // Add rating information
      for (const court of courts) {
        const reviews = await CourtReview.findAll({
          where: {
            courtId: court.id,
            isHidden: false
          },
          attributes: ['rating']
        });

        const avgRating = reviews.length > 0 
          ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
          : 0;

        (court as any).dataValues.averageRating = Number(avgRating.toFixed(1));
        (court as any).dataValues.totalReviews = reviews.length;
      }

      return courts;
    } catch (error: any) {
      throw new Error(`Error searching courts: ${error.message}`);
    }
  }

  static async getCourtsNearLocation(
    lat: number, 
    lng: number, 
    radius: number
  ): Promise<Court[]> {
    try {
      const radiusInDegrees = radius / 111;
      
      const courts = await Court.findAll({
        where: {
          isActive: true,
          latitude: {
            [Op.between]: [lat - radiusInDegrees, lat + radiusInDegrees]
          },
          longitude: {
            [Op.between]: [lng - radiusInDegrees, lng + radiusInDegrees]
          }
        },
        attributes: [
          '*',
          [
            sequelize.literal(`(
              6371 * acos(
                cos(radians(${lat})) * 
                cos(radians(latitude)) * 
                cos(radians(longitude) - radians(${lng})) + 
                sin(radians(${lat})) * 
                sin(radians(latitude))
              )
            )`),
            'distance'
          ]
        ],
        order: [[sequelize.literal('distance'), 'asc']],
        include: [
          {
            model: State,
            as: 'state',
            attributes: ['id', 'name', 'code']
          }
        ]
      });

      return courts;
    } catch (error: any) {
      throw new Error(`Error finding nearby courts: ${error.message}`);
    }
  }

  static async getAvailableCourts(
    date: string,
    startTime: string,
    endTime: string
  ): Promise<Court[]> {
    try {
      // This is a simplified version - full implementation would check reservations and schedules
      const courts = await Court.findAll({
        where: {
          isActive: true
        },
        include: [
          {
            model: State,
            as: 'state',
            attributes: ['id', 'name', 'code']
          }
        ]
      });

      // TODO: Filter out courts that have conflicting reservations
      // This would require checking the Reservation model for conflicts
      
      return courts;
    } catch (error: any) {
      throw new Error(`Error finding available courts: ${error.message}`);
    }
  }

  static async uploadCourtImages(courtId: number, imageUrls: string[]): Promise<Court> {
    try {
      const court = await Court.findByPk(courtId);
      if (!court) {
        throw new Error('Court not found');
      }

      const currentImages = court.images || [];
      const updatedImages = [...currentImages, ...imageUrls];

      await court.update({ images: updatedImages });
      return court;
    } catch (error: any) {
      throw new Error(`Error uploading court images: ${error.message}`);
    }
  }

  static async removeCourtImage(courtId: number, imageUrl: string): Promise<Court> {
    try {
      const court = await Court.findByPk(courtId);
      if (!court) {
        throw new Error('Court not found');
      }

      const updatedImages = court.images.filter(img => img !== imageUrl);
      await court.update({ images: updatedImages });
      return court;
    } catch (error: any) {
      throw new Error(`Error removing court image: ${error.message}`);
    }
  }

  static async getCourtStats(courtId: number, period: string = '30d'): Promise<any> {
    try {
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      
      switch (period) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          break;
        default:
          startDate.setDate(endDate.getDate() - 30);
      }

      // This would integrate with reservation statistics
      // For now, return basic court info
      const court = await Court.findByPk(courtId);
      if (!court) {
        throw new Error('Court not found');
      }

      return {
        court,
        period,
        // TODO: Add reservation statistics
        totalReservations: 0,
        totalRevenue: 0,
        averageRating: 0,
        occupancyRate: 0
      };
    } catch (error: any) {
      throw new Error(`Error getting court stats: ${error.message}`);
    }
  }
}