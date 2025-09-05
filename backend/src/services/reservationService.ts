import { Op } from 'sequelize';
import Reservation from '../models/Reservation';
import Court from '../models/Court';
import User from '../models/User';
import CourtSchedule from '../models/CourtSchedule';
import Payment from '../models/Payment';
import NotificationService from './notificationService';

interface ReservationData {
  courtId: number;
  userId: number;
  reservationDate: string;
  startTime: string;
  endTime: string;
  notes?: string;
}

interface Conflict {
  type: 'reservation' | 'maintenance' | 'operating_hours' | 'advance_booking' | 'duration';
  message: string;
  conflictingReservation?: Reservation;
  blockDetails?: CourtSchedule;
}

interface PricingBreakdown {
  duration: number; // in minutes
  baseRate: number;
  peakRateMultiplier: number;
  weekendRateMultiplier: number;
  subtotal: number;
  taxAmount: number; // 16% IVA
  totalAmount: number;
}

export class ReservationService {

  static async createReservation(reservationData: ReservationData): Promise<Reservation> {
    try {
      // Check for conflicts first
      const conflicts = await this.detectConflicts(
        reservationData.courtId,
        reservationData.reservationDate,
        reservationData.startTime,
        reservationData.endTime
      );

      if (conflicts.length > 0) {
        throw new Error(`Booking conflicts detected: ${conflicts.map(c => c.message).join(', ')}`);
      }

      // Calculate pricing
      const court = await Court.findByPk(reservationData.courtId);
      if (!court) {
        throw new Error('Court not found');
      }

      const pricing = await this.calculateReservationCost(
        court,
        reservationData.reservationDate,
        reservationData.startTime,
        reservationData.endTime
      );

      // Create reservation
      const reservation = await Reservation.create({
        ...reservationData,
        duration: pricing.duration,
        baseRate: pricing.baseRate,
        peakRateMultiplier: pricing.peakRateMultiplier,
        weekendRateMultiplier: pricing.weekendRateMultiplier,
        subtotal: pricing.subtotal,
        taxAmount: pricing.taxAmount,
        totalAmount: pricing.totalAmount,
        status: 'pending'
      });

      // Send notification
      await new NotificationService().sendNotification({
        userId: reservationData.userId.toString(),
        type: 'booking',
        category: 'success',
        title: 'Reserva Creada',
        message: `Tu reserva para ${court.name} ha sido creada exitosamente.`
      });

      return reservation;
    } catch (error: any) {
      throw new Error(`Error creating reservation: ${error.message}`);
    }
  }

  static async checkAvailability(
    courtId: number,
    date: string,
    startTime: string,
    endTime: string
  ): Promise<boolean> {
    try {
      const conflicts = await this.detectConflicts(courtId, date, startTime, endTime);
      return conflicts.length === 0;
    } catch (error: any) {
      throw new Error(`Error checking availability: ${error.message}`);
    }
  }

  static async detectConflicts(
    courtId: number,
    date: string,
    startTime: string,
    endTime: string
  ): Promise<Conflict[]> {
    const conflicts: Conflict[] = [];

    try {
      const court = await Court.findByPk(courtId);
      if (!court) {
        throw new Error('Court not found');
      }

      // Check operating hours
      const dayOfWeek = new Date(date).getDay();
      const operatingHours = court.operatingHours[dayOfWeek];
      
      if (!operatingHours?.isOpen) {
        conflicts.push({
          type: 'operating_hours',
          message: `Court is closed on this day`
        });
      } else {
        if (startTime < operatingHours.startTime || endTime > operatingHours.endTime) {
          conflicts.push({
            type: 'operating_hours',
            message: `Booking time is outside operating hours (${operatingHours.startTime} - ${operatingHours.endTime})`
          });
        }
      }

      // Check advance booking limit
      const bookingDate = new Date(date);
      const today = new Date();
      const daysDifference = Math.ceil((bookingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDifference > court.advanceBookingDays) {
        conflicts.push({
          type: 'advance_booking',
          message: `Cannot book more than ${court.advanceBookingDays} days in advance`
        });
      }

      // Check minimum and maximum duration
      const startMinutes = this.timeToMinutes(startTime);
      const endMinutes = this.timeToMinutes(endTime);
      const duration = endMinutes - startMinutes;

      if (duration < court.minimumBookingDuration) {
        conflicts.push({
          type: 'duration',
          message: `Minimum booking duration is ${court.minimumBookingDuration} minutes`
        });
      }

      if (duration > court.maximumBookingDuration) {
        conflicts.push({
          type: 'duration',
          message: `Maximum booking duration is ${court.maximumBookingDuration} minutes`
        });
      }

      // Check existing reservations
      const existingReservations = await Reservation.findAll({
        where: {
          courtId,
          reservationDate: date,
          status: {
            [Op.in]: ['pending', 'confirmed']
          }
        }
      });

      for (const reservation of existingReservations) {
        if (this.timesOverlap(startTime, endTime, reservation.startTime, reservation.endTime)) {
          conflicts.push({
            type: 'reservation',
            message: `Court already reserved ${reservation.startTime}-${reservation.endTime}`,
            conflictingReservation: reservation
          });
        }
      }

      // Check maintenance blocks
      const maintenanceBlocks = await CourtSchedule.findAll({
        where: {
          courtId,
          date,
          isBlocked: true
        }
      });

      for (const block of maintenanceBlocks) {
        if (this.timesOverlap(startTime, endTime, block.startTime, block.endTime)) {
          conflicts.push({
            type: 'maintenance',
            message: `Court blocked for ${block.blockReason || block.blockType} ${block.startTime}-${block.endTime}`,
            blockDetails: block
          });
        }
      }

      return conflicts;
    } catch (error: any) {
      throw new Error(`Error detecting conflicts: ${error.message}`);
    }
  }

  static async cancelReservation(reservationId: number, reason?: string): Promise<void> {
    try {
      const reservation = await Reservation.findByPk(reservationId, {
        include: [
          {
            model: Court,
            as: 'court'
          }
        ]
      });

      if (!reservation) {
        throw new Error('Reservation not found');
      }

      if (reservation.status === 'cancelled') {
        throw new Error('Reservation already cancelled');
      }

      // Calculate refund amount based on cancellation policy
      const refundAmount = await this.calculateRefund(reservation);

      await reservation.update({
        status: 'cancelled',
        cancellationReason: reason,
        cancelledAt: new Date(),
        refundAmount
      });

      // Process refund if payment exists
      if (reservation.paymentId && refundAmount > 0) {
        // TODO: Process refund through payment service
        await reservation.update({
          refundProcessedAt: new Date()
        });
      }

      // Send notification
      await new NotificationService().sendNotification({
        userId: reservation.userId.toString(),
        type: 'booking',
        category: 'info',
        title: 'Reserva Cancelada',
        message: `Tu reserva para ${(reservation as any).court.name} ha sido cancelada.`
      });
    } catch (error: any) {
      throw new Error(`Error cancelling reservation: ${error.message}`);
    }
  }

  static async processReservationPayment(reservationId: number, paymentId: number): Promise<Reservation> {
    try {
      const reservation = await Reservation.findByPk(reservationId);
      if (!reservation) {
        throw new Error('Reservation not found');
      }

      await reservation.update({
        paymentId,
        status: 'confirmed'
      });

      // Send confirmation notification
      await new NotificationService().sendNotification({
        userId: reservation.userId.toString(),
        type: 'payment',
        category: 'success',
        title: 'Reserva Confirmada',
        message: 'Tu pago ha sido procesado y tu reserva está confirmada.'
      });

      return reservation;
    } catch (error: any) {
      throw new Error(`Error processing payment: ${error.message}`);
    }
  }

  static async getUserReservations(userId: number, page: number = 1, limit: number = 10): Promise<{
    reservations: Reservation[],
    total: number,
    pages: number,
    currentPage: number
  }> {
    try {
      const offset = (page - 1) * limit;
      
      const { rows: reservations, count: total } = await Reservation.findAndCountAll({
        where: { userId },
        include: [
          {
            model: Court,
            as: 'court',
            attributes: ['id', 'name', 'address', 'images']
          },
          {
            model: Payment,
            as: 'payment',
            attributes: ['id', 'status', 'totalAmount']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset
      });

      return {
        reservations,
        total,
        pages: Math.ceil(total / limit),
        currentPage: page
      };
    } catch (error: any) {
      throw new Error(`Error fetching user reservations: ${error.message}`);
    }
  }

  static async getCourtReservations(courtId: number, date?: string): Promise<Reservation[]> {
    try {
      const whereCondition: any = { courtId };
      
      if (date) {
        whereCondition.reservationDate = date;
      }

      const reservations = await Reservation.findAll({
        where: whereCondition,
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'email']
          }
        ],
        order: [['reservationDate', 'ASC'], ['startTime', 'ASC']]
      });

      return reservations;
    } catch (error: any) {
      throw new Error(`Error fetching court reservations: ${error.message}`);
    }
  }

  private static async calculateReservationCost(
    court: Court,
    date: string,
    startTime: string,
    endTime: string
  ): Promise<PricingBreakdown> {
    const duration = this.timeToMinutes(endTime) - this.timeToMinutes(startTime);
    const durationHours = duration / 60;
    
    let baseRate = court.hourlyRate;
    
    // Check for peak hours (6-8 AM, 6-10 PM)
    const startHour = parseInt(startTime.split(':')[0]);
    const isPeakTime = (startHour >= 6 && startHour < 8) || (startHour >= 18 && startHour < 22);
    const peakRateMultiplier = isPeakTime && court.peakHourRate ? (court.peakHourRate / court.hourlyRate) : 1;
    
    // Check for weekend rates
    const dayOfWeek = new Date(date).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const weekendRateMultiplier = isWeekend ? (court.peakHourRate / court.hourlyRate) : 1;
    
    const subtotal = durationHours * baseRate * peakRateMultiplier * weekendRateMultiplier;
    const taxAmount = subtotal * 0.16; // 16% IVA in Mexico
    const totalAmount = subtotal + taxAmount;
    
    return {
      duration,
      baseRate,
      peakRateMultiplier,
      weekendRateMultiplier,
      subtotal: Number(subtotal.toFixed(2)),
      taxAmount: Number(taxAmount.toFixed(2)),
      totalAmount: Number(totalAmount.toFixed(2))
    };
  }

  private static async calculateRefund(reservation: Reservation): Promise<number> {
    const now = new Date();
    const reservationDateTime = new Date(`${reservation.reservationDate} ${reservation.startTime}`);
    const hoursUntilReservation = (reservationDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    // Full refund if cancelled 24+ hours in advance
    if (hoursUntilReservation >= 24) {
      return reservation.totalAmount;
    }
    
    // 50% refund if cancelled 2-24 hours in advance
    if (hoursUntilReservation >= 2) {
      return reservation.totalAmount * 0.5;
    }
    
    // No refund if cancelled less than 2 hours in advance
    return 0;
  }

  private static timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private static timesOverlap(start1: string, end1: string, start2: string, end2: string): boolean {
    const start1Minutes = this.timeToMinutes(start1);
    const end1Minutes = this.timeToMinutes(end1);
    const start2Minutes = this.timeToMinutes(start2);
    const end2Minutes = this.timeToMinutes(end2);
    
    return start1Minutes < end2Minutes && end1Minutes > start2Minutes;
  }
}