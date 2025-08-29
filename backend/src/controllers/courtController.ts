import { Request, Response } from 'express';
import { CourtService } from '../services/courtService';
import Court from '../models/Court';
import CourtReview from '../models/CourtReview';
import User from '../models/User';
import State from '../models/State';
import Club from '../models/Club';
import Partner from '../models/Partner';

export class CourtController {

  static async createCourt(req: Request, res: Response): Promise<void> {
    try {
      const {
        name,
        description,
        surfaceType,
        ownerType,
        ownerId,
        stateId,
        address,
        latitude,
        longitude,
        amenities,
        hourlyRate,
        peakHourRate,
        weekendRate,
        operatingHours,
        maxAdvanceBookingDays,
        minBookingDuration,
        maxBookingDuration,
        cancellationPolicy,
        images
      } = req.body;

      const court = await CourtService.createCourt({
        name,
        description,
        surfaceType,
        ownerType,
        ownerId,
        stateId,
        address,
        latitude,
        longitude,
        amenities,
        hourlyRate,
        peakHourRate,
        weekendRate,
        operatingHours,
        maxAdvanceBookingDays,
        minBookingDuration,
        maxBookingDuration,
        cancellationPolicy,
        images
      });

      res.status(201).json({
        success: true,
        message: 'Cancha creada exitosamente',
        data: court
      });
    } catch (error: any) {
      console.error('Error creating court:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error interno del servidor'
      });
    }
  }

  static async getCourts(req: Request, res: Response): Promise<void> {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        surfaceType,
        stateId,
        minPrice,
        maxPrice,
        amenities,
        sortBy = 'created_at',
        sortOrder = 'DESC'
      } = req.query;

      const filters = {
        search: search as string,
        surfaceType: surfaceType as string,
        stateId: stateId ? parseInt(stateId as string) : undefined,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        amenities: amenities ? (amenities as string).split(',') : undefined,
        sortBy: sortBy as 'distance' | 'price' | 'rating' | 'name' | undefined,
        sortOrder: ((sortOrder as string)?.toLowerCase() === 'desc' ? 'desc' : 'asc') as 'asc' | 'desc',
        page: parseInt(page as string),
        limit: parseInt(limit as string)
      };

      const courts = await CourtService.searchCourts(filters);

      res.json({
        success: true,
        data: courts,
        pagination: {
          current: filters.page,
          pages: Math.ceil(courts.length / filters.limit),
          total: courts.length,
          limit: filters.limit
        }
      });
    } catch (error: any) {
      console.error('Error fetching courts:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error interno del servidor'
      });
    }
  }

  static async getCourtById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const court = await Court.findByPk(id, {
        include: [
          {
            model: State,
            as: 'state',
            attributes: ['id', 'name', 'code']
          },
          {
            model: Club,
            as: 'clubOwner',
            attributes: ['id', 'clubName', 'contactEmail']
          },
          {
            model: Partner,
            as: 'partnerOwner',
            attributes: ['id', 'businessName', 'contactEmail']
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
            order: [['createdAt', 'DESC']],
            limit: 10
          }
        ]
      });

      if (!court) {
        res.status(404).json({
          success: false,
          message: 'Cancha no encontrada'
        });
        return;
      }

      // Calculate average rating
      const reviews = await CourtReview.findAll({
        where: { courtId: id },
        attributes: ['rating']
      });

      const averageRating = reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0;

      const courtData = court.toJSON();
      (courtData as any).averageRating = Math.round(averageRating * 10) / 10;
      (courtData as any).totalReviews = reviews.length;

      res.json({
        success: true,
        data: courtData
      });
    } catch (error: any) {
      console.error('Error fetching court:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error interno del servidor'
      });
    }
  }

  static async updateCourt(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const court = await Court.findByPk(id);
      if (!court) {
        res.status(404).json({
          success: false,
          message: 'Cancha no encontrada'
        });
        return;
      }

      await court.update(updateData);

      res.json({
        success: true,
        message: 'Cancha actualizada exitosamente',
        data: court
      });
    } catch (error: any) {
      console.error('Error updating court:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error interno del servidor'
      });
    }
  }

  static async deleteCourt(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const court = await Court.findByPk(id);
      if (!court) {
        res.status(404).json({
          success: false,
          message: 'Cancha no encontrada'
        });
        return;
      }

      await court.update({ isActive: false });

      res.json({
        success: true,
        message: 'Cancha desactivada exitosamente'
      });
    } catch (error: any) {
      console.error('Error deleting court:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error interno del servidor'
      });
    }
  }

  static async getCourtsNearLocation(req: Request, res: Response): Promise<void> {
    try {
      const { latitude, longitude, radius = 25 } = req.query;

      if (!latitude || !longitude) {
        res.status(400).json({
          success: false,
          message: 'Latitud y longitud son requeridas'
        });
        return;
      }

      const courts = await CourtService.getCourtsNearLocation(
        parseFloat(latitude as string),
        parseFloat(longitude as string),
        parseFloat(radius as string)
      );

      res.json({
        success: true,
        data: courts
      });
    } catch (error: any) {
      console.error('Error fetching nearby courts:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error interno del servidor'
      });
    }
  }

  static async getCourtsByOwner(req: Request, res: Response): Promise<void> {
    try {
      const { ownerType, ownerId } = req.params;
      
      if (!['club', 'partner'].includes(ownerType)) {
        res.status(400).json({
          success: false,
          message: 'Tipo de propietario inválido'
        });
        return;
      }

      const courts = await Court.findAll({
        where: {
          ownerType,
          ownerId: parseInt(ownerId),
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

      // Calculate ratings for each court
      const courtsWithRatings = await Promise.all(
        courts.map(async (court) => {
          const reviews = await CourtReview.findAll({
            where: { courtId: court.id },
            attributes: ['rating']
          });

          const averageRating = reviews.length > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
            : 0;

          const courtData = court.toJSON();
          (courtData as any).averageRating = Math.round(averageRating * 10) / 10;
          (courtData as any).totalReviews = reviews.length;
          
          return courtData;
        })
      );

      res.json({
        success: true,
        data: courtsWithRatings
      });
    } catch (error: any) {
      console.error('Error fetching owner courts:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error interno del servidor'
      });
    }
  }

  static async updateCourtImages(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { images } = req.body;

      if (!Array.isArray(images)) {
        res.status(400).json({
          success: false,
          message: 'Las imágenes deben ser un array de URLs'
        });
        return;
      }

      const court = await Court.findByPk(id);
      if (!court) {
        res.status(404).json({
          success: false,
          message: 'Cancha no encontrada'
        });
        return;
      }

      await court.update({ images });

      res.json({
        success: true,
        message: 'Imágenes actualizadas exitosamente',
        data: { images: court.images }
      });
    } catch (error: any) {
      console.error('Error updating court images:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error interno del servidor'
      });
    }
  }

  static async getCourtStats(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const court = await Court.findByPk(id);
      if (!court) {
        res.status(404).json({
          success: false,
          message: 'Cancha no encontrada'
        });
        return;
      }

      // Get reviews statistics
      const reviews = await CourtReview.findAll({
        where: { courtId: id }
      });

      const stats = {
        totalReviews: reviews.length,
        averageRating: reviews.length > 0
          ? Math.round((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length) * 10) / 10
          : 0,
        ratingDistribution: {
          5: reviews.filter(r => r.rating === 5).length,
          4: reviews.filter(r => r.rating === 4).length,
          3: reviews.filter(r => r.rating === 3).length,
          2: reviews.filter(r => r.rating === 2).length,
          1: reviews.filter(r => r.rating === 1).length
        },
        amenityRatings: {
          cleanliness: reviews.length > 0 
            ? Math.round((reviews.reduce((sum, review) => sum + (review.amenityRatings?.cleanliness || 0), 0) / reviews.length) * 10) / 10
            : 0,
          equipment: reviews.length > 0 
            ? Math.round((reviews.reduce((sum, review) => sum + (review.amenityRatings?.equipment || 0), 0) / reviews.length) * 10) / 10
            : 0,
          facilities: reviews.length > 0 
            ? Math.round((reviews.reduce((sum, review) => sum + (review.amenityRatings?.facilities || 0), 0) / reviews.length) * 10) / 10
            : 0,
          location: reviews.length > 0 
            ? Math.round((reviews.reduce((sum, review) => sum + (review.amenityRatings?.location || 0), 0) / reviews.length) * 10) / 10
            : 0
        }
      };

      res.json({
        success: true,
        data: stats
      });
    } catch (error: any) {
      console.error('Error fetching court stats:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error interno del servidor'
      });
    }
  }
}