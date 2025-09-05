import { Request, Response } from 'express';
import { CourtReview, Reservation, Court, User } from '../models';

const createReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courtId, reservationId, rating, title, comment, isRecommended, amenityRatings } = req.body;
    const userId = (req as any).user.userId;

    const reservation = await Reservation.findOne({ where: { id: reservationId, userId, courtId, status: 'completed' } });
    if (!reservation) {
      res.status(400).json({ success: false, message: 'Reserva no encontrada o no completada' });
      return;
    }

    const existingReview = await CourtReview.findOne({ where: { bookingId: reservationId } });
    if (existingReview) {
      res.status(400).json({ success: false, message: 'Ya existe una reseña para esta reserva' });
      return;
    }

    const review = await CourtReview.create({
      userId,
      courtId: parseInt(courtId),
      bookingId: parseInt(reservationId),
      ratings: rating,
      reviewTitle: title,
      reviewText: comment,
      recommendToFriends: isRecommended || false,
      isVerified: true,
      status: 'active'
    });

    res.status(201).json({ success: true, message: 'Reseña creada exitosamente', data: review });
  } catch (error: any) {
    console.error('Error creating review:', error);
    res.status(400).json({ success: false, message: error.message || 'Error al crear la reseña' });
  }
};

const getCourtReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courtId } = req.params;
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const { rows: reviews, count: total } = await CourtReview.findAndCountAll({
      where: { courtId, status: 'active' },
      include: [
        { model: User, as: 'user', attributes: ['id', 'username'] },
        { model: Reservation, as: 'reservation', attributes: ['id', 'reservationDate'] }
      ],
      order: [[sortBy as string, sortOrder as string]],
      limit: parseInt(limit as string),
      offset
    });

    const avgRatings = await calculateAverageRatings(parseInt(courtId));

    res.json({
      success: true,
      data: {
        reviews,
        averageRatings: avgRatings,
        pagination: {
          total,
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          totalPages: Math.ceil(total / parseInt(limit as string))
        }
      }
    });
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ success: false, message: 'Error al obtener las reseñas' });
  }
};

const getUserReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const { page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const { rows: reviews, count: total } = await CourtReview.findAndCountAll({
      where: { userId },
      include: [
        { model: Court, as: 'court', attributes: ['id', 'name'] },
        { model: Reservation, as: 'reservation', attributes: ['id', 'reservationDate'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit as string),
      offset
    });

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          total,
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          totalPages: Math.ceil(total / parseInt(limit as string))
        }
      }
    });
  } catch (error: any) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ success: false, message: 'Error al obtener las reseñas del usuario' });
  }
};

const updateReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;
    const updates = req.body;

    const review = await CourtReview.findOne({ where: { id, userId } });
    if (!review) {
      res.status(404).json({ success: false, message: 'Reseña no encontrada' });
      return;
    }

    const daysSinceCreation = (Date.now() - review.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceCreation > 30) {
      res.status(400).json({ success: false, message: 'No se pueden editar reseñas después de 30 días' });
      return;
    }

    await review.update(updates);
    res.json({ success: true, message: 'Reseña actualizada exitosamente', data: review });
  } catch (error: any) {
    console.error('Error updating review:', error);
    res.status(400).json({ success: false, message: error.message || 'Error al actualizar la reseña' });
  }
};

const deleteReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;

    const review = await CourtReview.findOne({ where: { id, userId } });
    if (!review) {
      res.status(404).json({ success: false, message: 'Reseña no encontrada' });
      return;
    }

    const daysSinceCreation = (Date.now() - review.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceCreation > 7) {
      res.status(400).json({ success: false, message: 'No se pueden eliminar reseñas después de 7 días' });
      return;
    }

    await review.destroy();
    res.json({ success: true, message: 'Reseña eliminada exitosamente' });
  } catch (error: any) {
    console.error('Error deleting review:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar la reseña' });
  }
};

const respondToReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { response } = req.body;
    const userId = (req as any).user.userId;

    const review = await CourtReview.findByPk(id, {
      include: [{ model: Court, as: 'court' }]
    });

    if (!review) {
      res.status(404).json({ success: false, message: 'Reseña no encontrada' });
      return;
    }

    const court = (review as any).court;
    if (court.ownerId !== userId) {
      res.status(403).json({ success: false, message: 'No autorizado para responder a esta reseña' });
      return;
    }

    // Add response to responses array
    const updatedResponses = [...(review.responses || []), {
      responderId: userId,
      responderType: 'facility_owner' as const,
      responseText: response,
      responseDate: new Date()
    }];
    
    await review.update({
      responses: updatedResponses
    });

    res.json({ success: true, message: 'Respuesta agregada exitosamente', data: review });
  } catch (error: any) {
    console.error('Error responding to review:', error);
    res.status(500).json({ success: false, message: 'Error al responder a la reseña' });
  }
};

const calculateAverageRatings = async (courtId: number) => {
  const reviews = await CourtReview.findAll({ 
    where: { courtId, status: 'active' } 
  });

  if (reviews.length === 0) {
    return {
      overall: 0,
      totalReviews: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      recommendationRate: 0
    };
  }

  const ratingSum = reviews.reduce((sum, review) => {
    const overallRating = review.ratings.overallExperience || 0;
    return sum + overallRating;
  }, 0);
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  
  reviews.forEach(review => {
    const overallRating = review.ratings.overallExperience || 0;
    if (overallRating >= 1 && overallRating <= 5) {
      distribution[Math.floor(overallRating) as keyof typeof distribution]++;
    }
  });

  const recommendCount = reviews.filter(review => review.recommendToFriends).length;

  return {
    overall: parseFloat((ratingSum / reviews.length).toFixed(1)),
    totalReviews: reviews.length,
    distribution,
    recommendationRate: parseFloat(((recommendCount / reviews.length) * 100).toFixed(1))
  };
};

const flagReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const review = await CourtReview.findByPk(id);
    if (!review) {
      res.status(404).json({ success: false, message: 'Reseña no encontrada' });
      return;
    }

    // Here you would typically create a report record in a separate table
    // For now, we'll just hide the review and log the reason
    console.log(`Review flagged with reason: ${reason}`);
    await review.update({ status: 'hidden' });

    res.json({ success: true, message: 'Reseña reportada exitosamente' });
  } catch (error: any) {
    console.error('Error flagging review:', error);
    res.status(500).json({ success: false, message: 'Error al reportar la reseña' });
  }
};

export default {
  createReview,
  getCourtReviews,
  getUserReviews,
  updateReview,
  deleteReview,
  respondToReview,
  flagReview
};