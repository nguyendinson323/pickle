import { Op, Transaction, Sequelize } from 'sequelize';
import sequelize from '../config/database';
import CourtFacility from '../models/CourtFacility';
import Court from '../models/Court';
import CourtBooking from '../models/CourtBooking';
import MaintenanceRecord from '../models/MaintenanceRecord';
import CourtReview from '../models/CourtReview';
import User from '../models/User';
import notificationService from './notificationService';

interface SearchFilters {
  location?: {
    latitude: number;
    longitude: number;
    radius: number;
  };
  city?: string;
  state?: string;
  facilityType?: 'indoor' | 'outdoor' | 'mixed';
  courtSurface?: string[];
  amenities?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  availableDate?: string;
  availableTime?: {
    start: string;
    end: string;
  };
  rating?: number;
  hasLights?: boolean;
  accessibility?: boolean;
}

interface BookingData {
  courtId: string;
  userId: number;
  bookingDate: string;
  startTime: string;
  endTime: string;
  participants: {
    userId?: number;
    name: string;
    email?: string;
    phone?: string;
    isGuest: boolean;
  }[];
  equipmentRequests?: string[];
  specialRequests?: string;
  contactInfo: {
    primaryPhone: string;
    secondaryPhone?: string;
    emergencyContact?: {
      name: string;
      phone: string;
      relationship: string;
    };
  };
  paymentMethod?: 'stripe' | 'paypal' | 'cash' | 'transfer';
}

interface AvailabilitySlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  price: number;
  courtId: string;
  courtName?: string;
}

export class CourtService {
  
  // Search facilities with advanced filters
  static async searchFacilities(filters: SearchFilters, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    let whereClause: any = { isActive: true, isVerified: true };
    let havingClause: any = {};

    // Location-based search
    if (filters.location) {
      const { latitude, longitude, radius } = filters.location;
      whereClause[Op.and] = [
        Sequelize.where(
          Sequelize.fn(
            'ST_DWithin',
            Sequelize.fn('ST_GeogFromText', 
              Sequelize.fn('CONCAT', 'POINT(', 
                Sequelize.col('coordinates.longitude'), ' ', 
                Sequelize.col('coordinates.latitude'), ')'
              )
            ),
            Sequelize.fn('ST_GeogFromText', `POINT(${longitude} ${latitude})`),
            radius * 1000 // Convert km to meters
          ),
          true
        )
      ];
    }

    // City/State filters
    if (filters.city) {
      whereClause.city = { [Op.iLike]: `%${filters.city}%` };
    }
    if (filters.state) {
      whereClause.state = { [Op.iLike]: `%${filters.state}%` };
    }

    // Facility type filter
    if (filters.facilityType) {
      whereClause.facilityType = filters.facilityType;
    }

    // Rating filter
    if (filters.rating) {
      havingClause.rating = { [Op.gte]: filters.rating };
    }

    // Amenities filter
    if (filters.amenities && filters.amenities.length > 0) {
      whereClause.amenities = {
        [Op.contains]: filters.amenities
      };
    }

    const facilities = await CourtFacility.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Court,
          as: 'courts',
          where: { isActive: true, isAvailableForBooking: true },
          include: [
            {
              model: CourtReview,
              as: 'reviews',
              attributes: ['ratings', 'status'],
              where: { status: 'active' },
              required: false
            }
          ],
          required: true
        }
      ],
      having: Object.keys(havingClause).length > 0 ? havingClause : undefined,
      order: [['rating', 'DESC'], ['totalReviews', 'DESC']],
      limit,
      offset,
      distinct: true
    });

    // Apply court-specific filters
    const filteredFacilities = facilities.rows.filter(facility => {
      const courts = (facility as any).courts || [];
      
      return courts.some(court => {
        // Surface filter
        if (filters.courtSurface && !filters.courtSurface.includes(court.surface)) {
          return false;
        }

        // Lighting filter
        if (filters.hasLights !== undefined && court.hasLights !== filters.hasLights) {
          return false;
        }

        // Accessibility filter
        if (filters.accessibility && !court.accessibility.wheelchairAccessible) {
          return false;
        }

        // Price range filter
        if (filters.priceRange) {
          const price = court.hourlyRate;
          if (price < filters.priceRange.min || price > filters.priceRange.max) {
            return false;
          }
        }

        return true;
      });
    });

    return {
      facilities: filteredFacilities,
      total: filteredFacilities.length,
      page,
      totalPages: Math.ceil(filteredFacilities.length / limit)
    };
  }

  // Check availability for specific court and time
  static async checkCourtAvailability(courtId: string, date: string, startTime: string, endTime: string) {
    const court = await Court.findByPk(courtId, {
      include: [{ model: CourtFacility, as: 'facility' }]
    });

    if (!court) {
      throw new Error('Court not found');
    }

    // Check if court is active and available for booking
    if (!court.isActive || !court.isAvailableForBooking) {
      return { available: false, reason: 'Court not available for booking' };
    }

    // Check operating hours
    const dayOfWeek = new Date(date).toLocaleDateString('en', { weekday: 'long' }).toLowerCase();
    const operatingHours = court.operatingHours[dayOfWeek];
    
    if (!operatingHours || operatingHours.closed) {
      return { available: false, reason: 'Court closed on this day' };
    }

    if (startTime < operatingHours.open || endTime > operatingHours.close) {
      return { available: false, reason: 'Requested time outside operating hours' };
    }

    // Check for existing bookings
    const conflictingBookings = await CourtBooking.findAll({
      where: {
        courtId,
        bookingDate: date,
        bookingStatus: ['confirmed', 'pending'],
        isActive: true,
        [Op.or]: [
          {
            startTime: { [Op.lt]: endTime },
            endTime: { [Op.gt]: startTime }
          }
        ]
      }
    });

    if (conflictingBookings.length > 0) {
      return { available: false, reason: 'Time slot already booked' };
    }

    // Check for maintenance schedules
    const maintenanceConflicts = await MaintenanceRecord.findAll({
      where: {
        courtId,
        scheduledDate: date,
        status: ['scheduled', 'in_progress'],
        isActive: true,
        [Op.or]: [
          {
            scheduledStartTime: { [Op.lt]: endTime },
            scheduledEndTime: { [Op.gt]: startTime }
          }
        ]
      }
    });

    if (maintenanceConflicts.length > 0) {
      return { available: false, reason: 'Court scheduled for maintenance' };
    }

    // Calculate pricing
    const pricing = await this.calculateBookingPrice(courtId, date, startTime, endTime);

    return {
      available: true,
      pricing,
      court: {
        id: court.id,
        name: court.name || `Court ${court.courtNumber}`,
        surface: court.surface,
        hasLights: court.hasLights
      }
    };
  }

  // Get available time slots for a court on a specific date
  static async getAvailableSlots(courtId: string, date: string): Promise<AvailabilitySlot[]> {
    const court = await Court.findByPk(courtId);
    if (!court) {
      throw new Error('Court not found');
    }

    const dayOfWeek = new Date(date).toLocaleDateString('en', { weekday: 'long' }).toLowerCase();
    const operatingHours = court.operatingHours[dayOfWeek];
    
    if (!operatingHours || operatingHours.closed) {
      return [];
    }

    // Generate all possible time slots (30-minute intervals)
    const slots: AvailabilitySlot[] = [];
    const startHour = parseInt(operatingHours.open.split(':')[0]);
    const startMinute = parseInt(operatingHours.open.split(':')[1]);
    const endHour = parseInt(operatingHours.close.split(':')[0]);
    const endMinute = parseInt(operatingHours.close.split(':')[1]);

    const totalStartMinutes = startHour * 60 + startMinute;
    const totalEndMinutes = endHour * 60 + endMinute;

    for (let minutes = totalStartMinutes; minutes < totalEndMinutes - 30; minutes += 30) {
      const slotStartHour = Math.floor(minutes / 60);
      const slotStartMinute = minutes % 60;
      const slotEndHour = Math.floor((minutes + court.minimumBookingDuration) / 60);
      const slotEndMinute = (minutes + court.minimumBookingDuration) % 60;

      const startTime = `${slotStartHour.toString().padStart(2, '0')}:${slotStartMinute.toString().padStart(2, '0')}`;
      const endTime = `${slotEndHour.toString().padStart(2, '0')}:${slotEndMinute.toString().padStart(2, '0')}`;

      const availability = await this.checkCourtAvailability(courtId, date, startTime, endTime);
      
      slots.push({
        startTime,
        endTime,
        isAvailable: availability.available,
        price: availability.available ? availability.pricing.totalAmount : 0,
        courtId,
        courtName: court.name
      });
    }

    return slots;
  }

  // Calculate booking price with dynamic pricing
  static async calculateBookingPrice(courtId: string, date: string, startTime: string, endTime: string) {
    const court = await Court.findByPk(courtId, {
      include: [{ model: CourtFacility, as: 'facility' }]
    });

    if (!court) {
      throw new Error('Court not found');
    }

    const bookingDate = new Date(date);
    const isWeekend = bookingDate.getDay() === 0 || bookingDate.getDay() === 6;
    
    // Calculate duration in hours
    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);
    const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

    let baseRate = court.hourlyRate;
    let multiplier = 1;

    // Apply peak hour pricing (6-10 PM)
    const startHour = parseInt(startTime.split(':')[0]);
    if (startHour >= 18 && startHour < 22) {
      multiplier *= (court as any).facility?.pricing.peakHourMultiplier || 1.2;
    }

    // Apply weekend pricing
    if (isWeekend) {
      multiplier *= (court as any).facility?.pricing.weekendMultiplier || 1.3;
    }

    const subtotal = baseRate * duration * multiplier;
    const taxRate = 0.16; // 16% IVA in Mexico
    const taxAmount = subtotal * taxRate;
    const serviceFee = subtotal * 0.03; // 3% service fee
    const totalAmount = subtotal + taxAmount + serviceFee;

    return {
      baseRate,
      duration,
      subtotal,
      peakHourMultiplier: startHour >= 18 && startHour < 22 ? (court as any).facility?.pricing.peakHourMultiplier || 1.2 : 1,
      weekendMultiplier: isWeekend ? (court as any).facility?.pricing.weekendMultiplier || 1.3 : 1,
      taxAmount,
      serviceFee,
      totalAmount,
      currency: 'MXN'
    };
  }

  // Create a new booking
  static async createBooking(bookingData: BookingData, transaction?: Transaction) {
    return await sequelize.transaction(async (t) => {
      const txn = transaction || t;

      // Verify availability one more time
      const availability = await this.checkCourtAvailability(
        bookingData.courtId,
        bookingData.bookingDate,
        bookingData.startTime,
        bookingData.endTime
      );

      if (!availability.available) {
        throw new Error(`Booking not available: ${availability.reason}`);
      }

      // Calculate duration
      const start = new Date(`${bookingData.bookingDate}T${bookingData.startTime}`);
      const end = new Date(`${bookingData.bookingDate}T${bookingData.endTime}`);
      const duration = (end.getTime() - start.getTime()) / (1000 * 60);

      // Create booking
      const booking = await CourtBooking.create({
        courtId: Number(bookingData.courtId),
        userId: bookingData.userId,
        bookingDate: new Date(bookingData.bookingDate),
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        duration,
        totalAmount: availability.pricing.totalAmount,
        currency: 'MXN',
        paymentMethod: bookingData.paymentMethod,
        participantCount: bookingData.participants.length,
        participants: bookingData.participants,
        equipmentRequests: bookingData.equipmentRequests || [],
        additionalServices: [],
        specialRequests: bookingData.specialRequests,
        pricing: {
          baseRate: availability.pricing.baseRate,
          peakHourMultiplier: availability.pricing.peakHourMultiplier,
          weekendMultiplier: availability.pricing.weekendMultiplier,
          memberDiscount: 0,
          promoDiscount: 0,
          taxAmount: availability.pricing.taxAmount,
          serviceFee: availability.pricing.serviceFee
        },
        contactInfo: bookingData.contactInfo,
        remindersSent: {
          confirmation: false,
          dayBefore: false,
          hourBefore: false
        },
        bookingStatus: 'pending',
        paymentStatus: 'pending'
      }, { transaction: txn });

      // Generate access code and QR code
      const accessCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const qrCodeData = JSON.stringify({
        bookingId: booking.id,
        courtId: bookingData.courtId,
        date: bookingData.bookingDate,
        time: `${bookingData.startTime}-${bookingData.endTime}`,
        accessCode
      });

      await booking.update({
        accessCode,
        qrCode: qrCodeData
      }, { transaction: txn });

      // Send booking confirmation notification
      const court = await Court.findByPk(bookingData.courtId, {
        include: [{ model: CourtFacility, as: 'facility' }]
      });

      const notificationServiceInstance = new notificationService();
      await notificationServiceInstance.sendNotification({
        userId: bookingData.userId.toString(),
        type: 'booking',
        category: 'info',
        title: 'Booking Confirmation',
        message: `Your court booking has been confirmed for ${bookingData.bookingDate}`,
        data: {
          courtName: court?.name || 'Court',
          facilityName: (court as any)?.facility?.name || 'Facility',
          bookingDate: bookingData.bookingDate,
          startTime: bookingData.startTime,
          endTime: bookingData.endTime,
          totalAmount: availability.pricing.totalAmount,
          accessCode
        }
      });

      return booking;
    });
  }

  // Cancel a booking
  static async cancelBooking(bookingId: string, userId: number, reason: string) {
    return await sequelize.transaction(async (t) => {
      const booking = await CourtBooking.findByPk(bookingId, { transaction: t });
      
      if (!booking) {
        throw new Error('Booking not found');
      }

      if (booking.userId !== userId) {
        throw new Error('Unauthorized to cancel this booking');
      }

      if (booking.bookingStatus === 'cancelled') {
        throw new Error('Booking already cancelled');
      }

      // Check cancellation deadline
      const bookingDateTime = new Date(`${booking.bookingDate}T${booking.startTime}`);
      const now = new Date();
      const courtInfo = await Court.findByPk(booking.courtId);
      const hoursUntilBooking = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (hoursUntilBooking < (courtInfo?.cancellationDeadlineHours || 24)) {
        throw new Error('Cancellation deadline has passed');
      }

      // Calculate refund amount
      let refundAmount = booking.totalAmount;
      if (hoursUntilBooking < 48) {
        refundAmount *= 0.8; // 80% refund for cancellations within 48 hours
      }

      await booking.update({
        bookingStatus: 'cancelled',
        cancellation: {
          cancelledAt: new Date(),
          cancelledBy: userId,
          reason,
          refundAmount,
          refundProcessed: false
        }
      }, { transaction: t });

      // Send cancellation confirmation notification
      const courtWithFacility = await Court.findByPk(booking.courtId, {
        include: [{ model: CourtFacility, as: 'facility' }]
      });

      const notificationServiceInstance2 = new notificationService();
      await notificationServiceInstance2.sendNotification({
        userId: booking.userId.toString(),
        type: 'booking',
        category: 'warning',
        title: 'Booking Cancelled',
        message: `Your court booking for ${booking.bookingDate} has been cancelled`,
        data: {
          courtName: courtWithFacility?.name || 'Court',
          facilityName: (courtWithFacility as any)?.facility?.name || 'Facility',
          bookingDate: booking.bookingDate,
          startTime: booking.startTime,
          endTime: booking.endTime,
          refundAmount,
          reason
        }
      });

      return booking;
    });
  }

  // Check-in for a booking
  static async checkInBooking(bookingId: string, userId: number) {
    const booking = await CourtBooking.findByPk(bookingId);
    
    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new Error('Unauthorized to check-in for this booking');
    }

    if (booking.bookingStatus !== 'confirmed') {
      throw new Error('Booking not confirmed');
    }

    const now = new Date();
    const bookingDateTime = new Date(`${booking.bookingDate}T${booking.startTime}`);
    const minutesEarly = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60);
    const minutesLate = (now.getTime() - bookingDateTime.getTime()) / (1000 * 60);

    await booking.update({
      checkIn: {
        checkedInAt: now,
        checkedInBy: userId,
        lateArrival: minutesLate > 15,
        minutesLate: minutesLate > 0 ? Math.round(minutesLate) : undefined
      }
    });

    return booking;
  }

  // Get facility analytics
  static async getFacilityAnalytics(facilityId: string, startDate: string, endDate: string) {
    const bookings = await CourtBooking.findAll({
      include: [
        {
          model: Court,
          as: 'court',
          where: { facilityId },
          attributes: ['id', 'courtNumber', 'name']
        }
      ],
      where: {
        bookingDate: {
          [Op.between]: [startDate, endDate]
        },
        bookingStatus: ['confirmed', 'completed']
      }
    });

    const totalRevenue = bookings.reduce((sum, booking) => sum + parseFloat(booking.totalAmount.toString()), 0);
    const totalBookings = bookings.length;
    const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;

    // Court utilization
    const courtUtilization = await this.calculateCourtUtilization(facilityId, startDate, endDate);

    // Peak hours analysis
    const peakHours = this.analyzePeakHours(bookings);

    // Revenue by court
    const revenueByCourt = bookings.reduce((acc, booking) => {
      const courtKey = (booking as any).court?.courtNumber || 'Unknown';
      acc[courtKey] = (acc[courtKey] || 0) + parseFloat(booking.totalAmount.toString());
      return acc;
    }, {} as Record<string, number>);

    return {
      totalRevenue,
      totalBookings,
      averageBookingValue,
      courtUtilization,
      peakHours,
      revenueByCourt
    };
  }

  // Calculate court utilization
  private static async calculateCourtUtilization(facilityId: string, startDate: string, endDate: string) {
    const courts = await Court.findAll({
      where: { facilityId, isActive: true }
    });

    const totalCourts = courts.length;
    const dateRange = this.getDateRange(startDate, endDate);
    
    let totalAvailableHours = 0;
    let totalBookedHours = 0;

    for (const court of courts) {
      for (const date of dateRange) {
        const dayOfWeek = new Date(date).toLocaleDateString('en', { weekday: 'long' }).toLowerCase();
        const operatingHours = court.operatingHours[dayOfWeek];
        
        if (!operatingHours?.closed) {
          const openTime = parseInt(operatingHours.open.split(':')[0]);
          const closeTime = parseInt(operatingHours.close.split(':')[0]);
          totalAvailableHours += (closeTime - openTime);

          const dayBookings = await CourtBooking.findAll({
            where: {
              courtId: court.id,
              bookingDate: date,
              bookingStatus: ['confirmed', 'completed']
            }
          });

          totalBookedHours += dayBookings.reduce((sum, booking) => sum + booking.duration / 60, 0);
        }
      }
    }

    return {
      utilizationRate: totalAvailableHours > 0 ? (totalBookedHours / totalAvailableHours) * 100 : 0,
      totalAvailableHours,
      totalBookedHours
    };
  }

  // Analyze peak hours
  private static analyzePeakHours(bookings: CourtBooking[]) {
    const hourlyBookings = bookings.reduce((acc, booking) => {
      const hour = parseInt(booking.startTime.split(':')[0]);
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const peakHour = Object.entries(hourlyBookings)
      .reduce((max, [hour, count]) => count > max.count ? { hour: parseInt(hour), count } : max, { hour: 0, count: 0 });

    return {
      peakHour: peakHour.hour,
      peakHourBookings: peakHour.count,
      hourlyDistribution: hourlyBookings
    };
  }

  // Helper method to generate date range
  private static getDateRange(startDate: string, endDate: string): string[] {
    const dates = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
  }

  // Get booking history for a user
  static async getUserBookingHistory(userId: number, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const bookings = await CourtBooking.findAndCountAll({
      where: { userId },
      include: [
        {
          model: Court,
          as: 'court',
          include: [
            {
              model: CourtFacility,
              as: 'facility',
              attributes: ['name', 'address', 'city']
            }
          ]
        }
      ],
      order: [['bookingDate', 'DESC'], ['startTime', 'DESC']],
      limit,
      offset
    });

    return {
      bookings: bookings.rows,
      total: bookings.count,
      page,
      totalPages: Math.ceil(bookings.count / limit)
    };
  }

  // Send booking reminders (to be called by a scheduled job)
  static async sendBookingReminders() {
    try {
      const now = new Date();
      const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

      // Get bookings that need day-before reminders
      const dayBeforeBookings = await CourtBooking.findAll({
        where: {
          bookingStatus: 'confirmed',
          'remindersSent.dayBefore': false,
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn('DATE', Sequelize.col('bookingDate')),
              '=',
              oneDayFromNow.toISOString().split('T')[0]
            )
          ]
        },
        include: [
          {
            model: Court,
            as: 'court',
            include: [{ model: CourtFacility, as: 'facility' }]
          }
        ]
      });

      // Send day-before reminders
      for (const booking of dayBeforeBookings) {
        const notificationServiceInstance3 = new notificationService();
        await notificationServiceInstance3.sendNotification({
          userId: booking.userId.toString(),
          type: 'booking',
          category: 'info',
          title: 'Booking Reminder',
          message: `Reminder: You have a court booking tomorrow at ${booking.startTime}`,
          data: {
            courtName: (booking as any).court?.name || 'Court',
            facilityName: (booking as any).court?.facility?.name || 'Facility',
            bookingDate: booking.bookingDate,
            startTime: booking.startTime,
            endTime: booking.endTime,
            accessCode: booking.accessCode
          }
        });

        await booking.update({
          remindersSent: { ...booking.remindersSent, dayBefore: true }
        });
      }

      // Get bookings that need hour-before reminders
      const hourBeforeBookings = await CourtBooking.findAll({
        where: {
          bookingStatus: 'confirmed',
          'remindersSent.hourBefore': false,
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn('DATETIME', 
                Sequelize.fn('CONCAT', 
                  Sequelize.col('bookingDate'), 
                  ' ', 
                  Sequelize.col('startTime')
                )
              ),
              '<=',
              oneHourFromNow.toISOString().replace('T', ' ').slice(0, 19)
            ),
            Sequelize.where(
              Sequelize.fn('DATETIME', 
                Sequelize.fn('CONCAT', 
                  Sequelize.col('bookingDate'), 
                  ' ', 
                  Sequelize.col('startTime')
                )
              ),
              '>',
              now.toISOString().replace('T', ' ').slice(0, 19)
            )
          ]
        },
        include: [
          {
            model: Court,
            as: 'court',
            include: [{ model: CourtFacility, as: 'facility' }]
          }
        ]
      });

      // Send hour-before reminders
      for (const booking of hourBeforeBookings) {
        const notificationServiceInstance4 = new notificationService();
        await notificationServiceInstance4.sendNotification({
          userId: booking.userId.toString(),
          type: 'booking',
          category: 'info',
          title: 'Booking Reminder',
          message: `Reminder: Your court booking starts in 1 hour at ${booking.startTime}`,
          data: {
            courtName: (booking as any).court?.name || 'Court',
            facilityName: (booking as any).court?.facility?.name || 'Facility',
            bookingDate: booking.bookingDate,
            startTime: booking.startTime,
            endTime: booking.endTime,
            accessCode: booking.accessCode
          }
        });

        await booking.update({
          remindersSent: { ...booking.remindersSent, hourBefore: true }
        });
      }

      console.log(`Sent ${dayBeforeBookings.length} day-before and ${hourBeforeBookings.length} hour-before booking reminders`);
    } catch (error: any) {
      console.error('Failed to send booking reminders:', error.message);
    }
  }
}