import { Op } from 'sequelize';
import CourtSchedule from '../models/CourtSchedule';
import Court from '../models/Court';
import Reservation from '../models/Reservation';

interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  price: number;
  isBlocked: boolean;
  blockReason?: string;
  reservationId?: number;
}

interface WeeklySchedule {
  [dayOfWeek: number]: {
    isOpen: boolean;
    startTime: string;
    endTime: string;
    specialRates?: TimeBasedRate[];
  };
}

interface TimeBasedRate {
  startTime: string;
  endTime: string;
  rate: number;
}

interface OperatingHours {
  [dayOfWeek: number]: {
    isOpen: boolean;
    startTime: string;
    endTime: string;
  };
}

export class AvailabilityService {

  static async setCourtSchedule(courtId: number, schedule: WeeklySchedule): Promise<void> {
    try {
      const court = await Court.findByPk(courtId);
      if (!court) {
        throw new Error('Court not found');
      }

      // Update court operating hours
      const operatingHours: OperatingHours = {};
      for (const [dayOfWeek, daySchedule] of Object.entries(schedule)) {
        operatingHours[parseInt(dayOfWeek)] = {
          isOpen: daySchedule.isOpen,
          startTime: daySchedule.startTime,
          endTime: daySchedule.endTime
        };
      }

      await court.update({ operatingHours });
    } catch (error: any) {
      throw new Error(`Error setting court schedule: ${error.message}`);
    }
  }

  static async getAvailableSlots(courtId: number, date: string): Promise<TimeSlot[]> {
    try {
      const court = await Court.findByPk(courtId);
      if (!court) {
        throw new Error('Court not found');
      }

      // Get day of week (0 = Sunday, 6 = Saturday)
      const dayOfWeek = new Date(date).getDay();
      const operatingHours = court.operatingHours[dayOfWeek];

      if (!operatingHours || !operatingHours.isOpen) {
        return [];
      }

      // Generate time slots (30-minute intervals)
      const slots = this.generateTimeSlots(
        operatingHours.startTime,
        operatingHours.endTime,
        30 // 30-minute intervals
      );

      // Get existing reservations for this date
      const reservations = await Reservation.findAll({
        where: {
          courtId,
          reservationDate: date,
          status: {
            [Op.in]: ['pending', 'confirmed']
          }
        }
      });

      // Get blocked time slots
      const blocks = await CourtSchedule.findAll({
        where: {
          courtId,
          date,
          isBlocked: true
        }
      });

      // Mark slots as unavailable if they conflict with reservations or blocks
      const availableSlots = slots.map(slot => {
        let isAvailable = true;
        let isBlocked = false;
        let blockReason: string | undefined;
        let reservationId: number | undefined;

        // Check for reservation conflicts
        for (const reservation of reservations) {
          if (this.timesOverlap(slot.startTime, slot.endTime, reservation.startTime, reservation.endTime)) {
            isAvailable = false;
            reservationId = reservation.id;
            break;
          }
        }

        // Check for blocked time slots
        for (const block of blocks) {
          if (this.timesOverlap(slot.startTime, slot.endTime, block.startTime, block.endTime)) {
            isAvailable = false;
            isBlocked = true;
            blockReason = block.blockReason || block.blockType;
            break;
          }
        }

        // Calculate price for this time slot
        const price = this.calculateSlotPrice(court, date, slot.startTime);

        return {
          startTime: slot.startTime,
          endTime: slot.endTime,
          isAvailable,
          price,
          isBlocked,
          blockReason,
          reservationId
        };
      });

      return availableSlots;
    } catch (error: any) {
      throw new Error(`Error getting available slots: ${error.message}`);
    }
  }

  static async blockTimeSlots(
    courtId: number,
    date: string,
    startTime: string,
    endTime: string,
    blockType: 'maintenance' | 'private_event' | 'weather' | 'staff_unavailable' | 'other',
    reason: string
  ): Promise<void> {
    try {
      const court = await Court.findByPk(courtId);
      if (!court) {
        throw new Error('Court not found');
      }

      // Check for existing reservations in the blocked time
      const conflictingReservations = await Reservation.findAll({
        where: {
          courtId,
          reservationDate: date,
          status: {
            [Op.in]: ['pending', 'confirmed']
          }
        }
      });

      for (const reservation of conflictingReservations) {
        if (this.timesOverlap(startTime, endTime, reservation.startTime, reservation.endTime)) {
          throw new Error(
            `Cannot block time slot. Existing reservation found: ${reservation.startTime}-${reservation.endTime}`
          );
        }
      }

      // Create the block
      await CourtSchedule.create({
        courtId,
        date,
        startTime,
        endTime,
        isBlocked: true,
        blockType,
        blockReason: reason
      });
    } catch (error: any) {
      throw new Error(`Error blocking time slots: ${error.message}`);
    }
  }

  static async unblockTimeSlots(scheduleId: number): Promise<void> {
    try {
      const schedule = await CourtSchedule.findByPk(scheduleId);
      if (!schedule) {
        throw new Error('Schedule block not found');
      }

      await schedule.destroy();
    } catch (error: any) {
      throw new Error(`Error unblocking time slots: ${error.message}`);
    }
  }

  static async updateOperatingHours(courtId: number, hours: OperatingHours): Promise<void> {
    try {
      const court = await Court.findByPk(courtId);
      if (!court) {
        throw new Error('Court not found');
      }

      await court.update({ operatingHours: hours });
    } catch (error: any) {
      throw new Error(`Error updating operating hours: ${error.message}`);
    }
  }

  static async getCourtAvailability(courtId: number, startDate: string, endDate: string): Promise<{
    [date: string]: TimeSlot[]
  }> {
    try {
      const availability: { [date: string]: TimeSlot[] } = {};
      
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // Generate availability for each day in the range
      for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
        const dateString = date.toISOString().split('T')[0];
        availability[dateString] = await this.getAvailableSlots(courtId, dateString);
      }

      return availability;
    } catch (error: any) {
      throw new Error(`Error getting court availability: ${error.message}`);
    }
  }

  static async getBlockedSlots(courtId: number, date: string): Promise<CourtSchedule[]> {
    try {
      const blocks = await CourtSchedule.findAll({
        where: {
          courtId,
          date,
          isBlocked: true
        },
        order: [['startTime', 'ASC']]
      });

      return blocks;
    } catch (error: any) {
      throw new Error(`Error getting blocked slots: ${error.message}`);
    }
  }

  static async updateSpecialRates(
    courtId: number,
    date: string,
    startTime: string,
    endTime: string,
    rate: number
  ): Promise<void> {
    try {
      await CourtSchedule.create({
        courtId,
        date,
        startTime,
        endTime,
        isBlocked: false,
        specialRate: rate,
        notes: `Special rate: $${rate}/hour`
      });
    } catch (error: any) {
      throw new Error(`Error setting special rates: ${error.message}`);
    }
  }

  private static generateTimeSlots(startTime: string, endTime: string, intervalMinutes: number): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const start = this.timeToMinutes(startTime);
    const end = this.timeToMinutes(endTime);

    for (let minutes = start; minutes < end; minutes += intervalMinutes) {
      const slotStart = this.minutesToTime(minutes);
      const slotEnd = this.minutesToTime(minutes + intervalMinutes);

      // Don't create slots that extend beyond operating hours
      if (minutes + intervalMinutes <= end) {
        slots.push({
          startTime: slotStart,
          endTime: slotEnd,
          isAvailable: true,
          price: 0, // Will be calculated later
          isBlocked: false
        });
      }
    }

    return slots;
  }

  private static calculateSlotPrice(court: Court, date: string, startTime: string): number {
    let baseRate = court.hourlyRate;
    
    // Check for peak hours
    const startHour = parseInt(startTime.split(':')[0]);
    const isPeakTime = (startHour >= 6 && startHour < 8) || (startHour >= 18 && startHour < 22);
    
    if (isPeakTime && court.peakHourRate) {
      baseRate = court.peakHourRate;
    }
    
    // Check for weekend rates
    const dayOfWeek = new Date(date).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    if (isWeekend && court.weekendRate) {
      baseRate = court.weekendRate;
    }
    
    // Convert to 30-minute slot rate
    return baseRate / 2; // Half hour rate
  }

  private static timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private static minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  private static timesOverlap(start1: string, end1: string, start2: string, end2: string): boolean {
    const start1Minutes = this.timeToMinutes(start1);
    const end1Minutes = this.timeToMinutes(end1);
    const start2Minutes = this.timeToMinutes(start2);
    const end2Minutes = this.timeToMinutes(end2);
    
    return start1Minutes < end2Minutes && end1Minutes > start2Minutes;
  }
}