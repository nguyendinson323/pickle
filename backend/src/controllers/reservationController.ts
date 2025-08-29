import { Request, Response } from 'express';
import { ReservationService } from '../services/reservationService';
import { AvailabilityService } from '../services/availabilityService';
import Reservation from '../models/Reservation';
import Court from '../models/Court';
import User from '../models/User';
import Payment from '../models/Payment';
import CourtReview from '../models/CourtReview';

export class ReservationController {

  static async createReservation(req: Request, res: Response): Promise<void> {
    try {
      const {
        courtId,
        reservationDate,
        startTime,
        endTime,
        notes
      } = req.body;

      const userId = (req as any).user.id;

      const reservation = await ReservationService.createReservation({
        courtId: parseInt(courtId),
        userId,
        reservationDate,
        startTime,
        endTime,
        notes
      });

      res.status(201).json({
        success: true,
        message: 'Reserva creada exitosamente',
        data: reservation
      });
    } catch (error: any) {
      console.error('Error creating reservation:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al crear la reserva'
      });
    }
  }

  static async getUserReservations(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const { page = 1, limit = 10 } = req.query;

      const result = await ReservationService.getUserReservations(
        userId,
        parseInt(page as string),
        parseInt(limit as string)
      );

      res.json({
        success: true,
        data: result.reservations,
        pagination: {
          current: result.currentPage,
          pages: result.pages,
          total: result.total,
          limit
        }
      });
    } catch (error: any) {
      console.error('Error fetching user reservations:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error interno del servidor'
      });
    }
  }

  static async getReservationById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;

      const reservation = await Reservation.findOne({
        where: { id, userId },
        include: [
          {
            model: Court,
            as: 'court',
            attributes: ['id', 'name', 'address', 'images', 'amenities']
          },
          {
            model: Payment,
            as: 'payment',
            attributes: ['id', 'status', 'totalAmount', 'paymentMethod']
          },
          {
            model: CourtReview,
            as: 'review',
            attributes: ['id', 'overallRating', 'comment', 'createdAt']
          }
        ]
      });

      if (!reservation) {
        res.status(404).json({
          success: false,
          message: 'Reserva no encontrada'
        });
        return;
      }

      res.json({
        success: true,
        data: reservation
      });
    } catch (error: any) {
      console.error('Error fetching reservation:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error interno del servidor'
      });
    }
  }

  static async cancelReservation(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const userId = (req as any).user.id;

      // Verify ownership
      const reservation = await Reservation.findOne({
        where: { id, userId }
      });

      if (!reservation) {
        res.status(404).json({
          success: false,
          message: 'Reserva no encontrada'
        });
        return;
      }

      if (reservation.status === 'cancelled') {
        res.status(400).json({
          success: false,
          message: 'La reserva ya está cancelada'
        });
        return;
      }

      await ReservationService.cancelReservation(parseInt(id), reason);

      res.json({
        success: true,
        message: 'Reserva cancelada exitosamente'
      });
    } catch (error: any) {
      console.error('Error cancelling reservation:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al cancelar la reserva'
      });
    }
  }

  static async processReservationPayment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { paymentId } = req.body;

      const reservation = await ReservationService.processReservationPayment(
        parseInt(id),
        parseInt(paymentId)
      );

      res.json({
        success: true,
        message: 'Pago procesado exitosamente',
        data: reservation
      });
    } catch (error: any) {
      console.error('Error processing payment:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al procesar el pago'
      });
    }
  }

  static async checkAvailability(req: Request, res: Response): Promise<void> {
    try {
      const { courtId, date, startTime, endTime } = req.query;

      if (!courtId || !date || !startTime || !endTime) {
        res.status(400).json({
          success: false,
          message: 'Todos los parámetros son requeridos (courtId, date, startTime, endTime)'
        });
        return;
      }

      const isAvailable = await ReservationService.checkAvailability(
        parseInt(courtId as string),
        date as string,
        startTime as string,
        endTime as string
      );

      res.json({
        success: true,
        data: { available: isAvailable }
      });
    } catch (error: any) {
      console.error('Error checking availability:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error interno del servidor'
      });
    }
  }

  static async getAvailableSlots(req: Request, res: Response): Promise<void> {
    try {
      const { courtId, date } = req.query;

      if (!courtId || !date) {
        res.status(400).json({
          success: false,
          message: 'Court ID y fecha son requeridos'
        });
        return;
      }

      const slots = await AvailabilityService.getAvailableSlots(
        parseInt(courtId as string),
        date as string
      );

      res.json({
        success: true,
        data: slots
      });
    } catch (error: any) {
      console.error('Error fetching available slots:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error interno del servidor'
      });
    }
  }

  static async getCourtAvailability(req: Request, res: Response): Promise<void> {
    try {
      const { courtId } = req.params;
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        res.status(400).json({
          success: false,
          message: 'Fechas de inicio y fin son requeridas'
        });
        return;
      }

      const availability = await AvailabilityService.getCourtAvailability(
        parseInt(courtId),
        startDate as string,
        endDate as string
      );

      res.json({
        success: true,
        data: availability
      });
    } catch (error: any) {
      console.error('Error fetching court availability:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error interno del servidor'
      });
    }
  }

  static async detectConflicts(req: Request, res: Response): Promise<void> {
    try {
      const { courtId, date, startTime, endTime } = req.query;

      if (!courtId || !date || !startTime || !endTime) {
        res.status(400).json({
          success: false,
          message: 'Todos los parámetros son requeridos'
        });
        return;
      }

      const conflicts = await ReservationService.detectConflicts(
        parseInt(courtId as string),
        date as string,
        startTime as string,
        endTime as string
      );

      res.json({
        success: true,
        data: { conflicts }
      });
    } catch (error: any) {
      console.error('Error detecting conflicts:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error interno del servidor'
      });
    }
  }

  static async getCourtReservations(req: Request, res: Response): Promise<void> {
    try {
      const { courtId } = req.params;
      const { date } = req.query;

      const reservations = await ReservationService.getCourtReservations(
        parseInt(courtId),
        date as string
      );

      res.json({
        success: true,
        data: reservations
      });
    } catch (error: any) {
      console.error('Error fetching court reservations:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error interno del servidor'
      });
    }
  }

  static async updateReservation(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      const updateData = req.body;

      // Remove sensitive fields that shouldn't be updated directly
      delete updateData.userId;
      delete updateData.totalAmount;
      delete updateData.paymentId;
      delete updateData.status;

      const reservation = await Reservation.findOne({
        where: { id, userId }
      });

      if (!reservation) {
        res.status(404).json({
          success: false,
          message: 'Reserva no encontrada'
        });
        return;
      }

      if (reservation.status !== 'pending') {
        res.status(400).json({
          success: false,
          message: 'Solo se pueden actualizar reservas pendientes'
        });
        return;
      }

      await reservation.update(updateData);

      res.json({
        success: true,
        message: 'Reserva actualizada exitosamente',
        data: reservation
      });
    } catch (error: any) {
      console.error('Error updating reservation:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al actualizar la reserva'
      });
    }
  }

  static async checkInReservation(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;

      const reservation = await Reservation.findOne({
        where: { id, userId, status: 'confirmed' }
      });

      if (!reservation) {
        res.status(404).json({
          success: false,
          message: 'Reserva confirmada no encontrada'
        });
        return;
      }

      // Check if it's within check-in time window (30 minutes before to 15 minutes after start time)
      const now = new Date();
      const reservationDateTime = new Date(`${reservation.reservationDate} ${reservation.startTime}`);
      const checkInWindow = 30 * 60 * 1000; // 30 minutes in ms
      const lateWindow = 15 * 60 * 1000; // 15 minutes in ms

      if (now < new Date(reservationDateTime.getTime() - checkInWindow)) {
        res.status(400).json({
          success: false,
          message: 'Check-in disponible 30 minutos antes del inicio'
        });
        return;
      }

      if (now > new Date(reservationDateTime.getTime() + lateWindow)) {
        res.status(400).json({
          success: false,
          message: 'Tiempo de check-in expirado'
        });
        return;
      }

      await reservation.update({
        checkedInAt: now,
        status: 'checked_in'
      });

      res.json({
        success: true,
        message: 'Check-in realizado exitosamente',
        data: { checkedInAt: now }
      });
    } catch (error: any) {
      console.error('Error checking in reservation:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error interno del servidor'
      });
    }
  }

  static async checkOutReservation(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;

      const reservation = await Reservation.findOne({
        where: { id, userId, status: 'checked_in' }
      });

      if (!reservation) {
        res.status(404).json({
          success: false,
          message: 'Reserva con check-in no encontrada'
        });
        return;
      }

      await reservation.update({
        checkedOutAt: new Date(),
        status: 'completed'
      });

      res.json({
        success: true,
        message: 'Check-out realizado exitosamente',
        data: { checkedOutAt: new Date() }
      });
    } catch (error: any) {
      console.error('Error checking out reservation:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error interno del servidor'
      });
    }
  }
}