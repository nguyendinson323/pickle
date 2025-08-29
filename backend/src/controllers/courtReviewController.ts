import { Request, Response } from 'express';
import CourtReview from '../models/CourtReview';
import Reservation from '../models/Reservation';
import Court from '../models/Court';
import User from '../models/User';

export class CourtReviewController {

  static async createReview(req: Request, res: Response): Promise<void> {
    try {
      const {
        courtId,
        reservationId,
        overallRating,
        lightingRating,
        surfaceRating,
        facilitiesRating,
        accessibilityRating,
        comment,
        wouldRecommend
      } = req.body;

      const userId = (req as any).user.id;

      // Verify the reservation exists and belongs to the user
      const reservation = await Reservation.findOne({
        where: { 
          id: reservationId,
          userId,
          courtId,
          status: 'completed'
        }
      });

      if (!reservation) {
        res.status(400).json({
          success: false,
          message: 'Reserva no encontrada o no completada'
        });
        return;
      }

      // Check if review already exists for this reservation
      const existingReview = await CourtReview.findOne({
        where: { reservationId }
      });

      if (existingReview) {
        res.status(400).json({
          success: false,
          message: 'Ya existe una reseña para esta reserva'
        });
        return;
      }

      const review = await CourtReview.create({
        userId,
        courtId: parseInt(courtId),
        reservationId: parseInt(reservationId),
        overallRating,
        lightingRating,
        surfaceRating,
        facilitiesRating,
        accessibilityRating,
        comment,
        wouldRecommend: wouldRecommend || false,
        isVerified: true
      });

      res.status(201).json({
        success: true,
        message: 'Reseña creada exitosamente',
        data: review
      });
    } catch (error: any) {
      console.error('Error creating review:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al crear la reseña'
      });
    }
  }

  static async getCourtReviews(req: Request, res: Response): Promise<void> {
    try {
      const { courtId } = req.params;
      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;

      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

      const { rows: reviews, count: total } = await CourtReview.findAndCountAll({
        where: { courtId },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username']
          },
          {
            model: Reservation,
            as: 'reservation',
            attributes: ['id', 'reservationDate']
          }
        ],
        order: [[sortBy as string, sortOrder as string]],
        limit: parseInt(limit as string),
        offset
      });

      const pages = Math.ceil(total / parseInt(limit as string));

      res.json({
        success: true,
        data: reviews,
        pagination: {
          current: parseInt(page as string),
          pages,
          total,
          limit: parseInt(limit as string)
        }
      });
    } catch (error: any) {
      console.error('Error fetching court reviews:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error interno del servidor'
      });
    }
  }

  static async getUserReviews(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const { page = 1, limit = 10 } = req.query;

      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

      const { rows: reviews, count: total } = await CourtReview.findAndCountAll({
        where: { userId },
        include: [
          {
            model: Court,
            as: 'court',
            attributes: ['id', 'name', 'address']
          },
          {
            model: Reservation,
            as: 'reservation',
            attributes: ['id', 'reservationDate']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit as string),
        offset
      });

      const pages = Math.ceil(total / parseInt(limit as string));

      res.json({
        success: true,
        data: reviews,
        pagination: {
          current: parseInt(page as string),
          pages,
          total,
          limit: parseInt(limit as string)
        }
      });
    } catch (error: any) {
      console.error('Error fetching user reviews:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error interno del servidor'
      });
    }
  }

  static async updateReview(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      const updateData = req.body;

      // Remove fields that shouldn't be updated
      delete updateData.userId;
      delete updateData.courtId;
      delete updateData.reservationId;
      delete updateData.isVerified;

      const review = await CourtReview.findOne({
        where: { id, userId }
      });

      if (!review) {
        res.status(404).json({
          success: false,
          message: 'Reseña no encontrada'
        });
        return;
      }

      // Check if review is within edit time limit (24 hours)
      const now = new Date();
      const reviewDate = new Date(review.createdAt);
      const hoursDifference = (now.getTime() - reviewDate.getTime()) / (1000 * 60 * 60);

      if (hoursDifference > 24) {
        res.status(400).json({
          success: false,
          message: 'Las reseñas solo pueden editarse dentro de las primeras 24 horas'
        });
        return;
      }

      await review.update(updateData);

      res.json({
        success: true,
        message: 'Reseña actualizada exitosamente',
        data: review
      });
    } catch (error: any) {
      console.error('Error updating review:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al actualizar la reseña'
      });
    }
  }

  static async deleteReview(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;

      const review = await CourtReview.findOne({
        where: { id, userId }
      });

      if (!review) {
        res.status(404).json({
          success: false,
          message: 'Reseña no encontrada'
        });
        return;
      }

      // Check if review is within delete time limit (48 hours)
      const now = new Date();
      const reviewDate = new Date(review.createdAt);
      const hoursDifference = (now.getTime() - reviewDate.getTime()) / (1000 * 60 * 60);

      if (hoursDifference > 48) {
        res.status(400).json({
          success: false,
          message: 'Las reseñas solo pueden eliminarse dentro de las primeras 48 horas'
        });
        return;
      }

      await review.destroy();

      res.json({
        success: true,
        message: 'Reseña eliminada exitosamente'
      });
    } catch (error: any) {
      console.error('Error deleting review:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error interno del servidor'
      });
    }
  }

  static async getReviewById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const review = await CourtReview.findByPk(id, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username']
          },
          {
            model: Court,
            as: 'court',
            attributes: ['id', 'name', 'address']
          },
          {
            model: Reservation,
            as: 'reservation',
            attributes: ['id', 'reservationDate']
          }
        ]
      });

      if (!review) {
        res.status(404).json({
          success: false,
          message: 'Reseña no encontrada'
        });
        return;
      }

      res.json({
        success: true,
        data: review
      });
    } catch (error: any) {
      console.error('Error fetching review:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error interno del servidor'
      });
    }
  }

  static async getCourtRatingsSummary(req: Request, res: Response): Promise<void> {
    try {
      const { courtId } = req.params;

      const reviews = await CourtReview.findAll({
        where: { courtId },
        attributes: [
          'overallRating',
          'lightingRating',
          'surfaceRating',
          'facilitiesRating',
          'accessibilityRating',
          'wouldRecommend'
        ]
      });

      if (reviews.length === 0) {
        res.json({
          success: true,
          data: {
            totalReviews: 0,
            averageRating: 0,
            ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
            aspectRatings: {
              lighting: 0,
              surface: 0,
              facilities: 0,
              accessibility: 0
            },
            recommendationRate: 0
          }
        });
        return;
      }

      const totalReviews = reviews.length;
      const averageRating = reviews.reduce((sum, review) => sum + review.overallRating, 0) / totalReviews;

      // Calculate rating distribution
      const ratingDistribution = reviews.reduce((acc, review) => {
        acc[review.overallRating] = (acc[review.overallRating] || 0) + 1;
        return acc;
      }, {} as { [key: number]: number });

      // Fill missing ratings with 0
      for (let i = 1; i <= 5; i++) {
        if (!ratingDistribution[i]) ratingDistribution[i] = 0;
      }

      // Calculate aspect ratings averages
      const aspectRatings = {
        lighting: reviews
          .filter(r => r.lightingRating !== null)
          .reduce((sum, review) => sum + (review.lightingRating || 0), 0) / 
          reviews.filter(r => r.lightingRating !== null).length || 0,
        
        surface: reviews
          .filter(r => r.surfaceRating !== null)
          .reduce((sum, review) => sum + (review.surfaceRating || 0), 0) / 
          reviews.filter(r => r.surfaceRating !== null).length || 0,
        
        facilities: reviews
          .filter(r => r.facilitiesRating !== null)
          .reduce((sum, review) => sum + (review.facilitiesRating || 0), 0) / 
          reviews.filter(r => r.facilitiesRating !== null).length || 0,
        
        accessibility: reviews
          .filter(r => r.accessibilityRating !== null)
          .reduce((sum, review) => sum + (review.accessibilityRating || 0), 0) / 
          reviews.filter(r => r.accessibilityRating !== null).length || 0
      };

      // Round aspect ratings to 1 decimal place
      Object.keys(aspectRatings).forEach(key => {
        aspectRatings[key as keyof typeof aspectRatings] = 
          Math.round(aspectRatings[key as keyof typeof aspectRatings] * 10) / 10;
      });

      // Calculate recommendation rate
      const recommendationCount = reviews.filter(review => review.wouldRecommend).length;
      const recommendationRate = Math.round((recommendationCount / totalReviews) * 100);

      const summary = {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        ratingDistribution,
        aspectRatings,
        recommendationRate
      };

      res.json({
        success: true,
        data: summary
      });
    } catch (error: any) {
      console.error('Error fetching court ratings summary:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error interno del servidor'
      });
    }
  }

  static async respondToReview(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { ownerResponse } = req.body;
      const userRole = (req as any).user.role;

      // Only allow club owners, partners, or federation to respond
      if (!['club', 'partner', 'federation'].includes(userRole)) {
        res.status(403).json({
          success: false,
          message: 'No tienes permisos para responder reseñas'
        });
        return;
      }

      const review = await CourtReview.findByPk(id);
      if (!review) {
        res.status(404).json({
          success: false,
          message: 'Reseña no encontrada'
        });
        return;
      }

      await review.update({
        ownerResponse,
        ownerResponseAt: new Date()
      });

      res.json({
        success: true,
        message: 'Respuesta agregada exitosamente',
        data: { ownerResponse, ownerResponseAt: new Date() }
      });
    } catch (error: any) {
      console.error('Error responding to review:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al responder la reseña'
      });
    }
  }
}