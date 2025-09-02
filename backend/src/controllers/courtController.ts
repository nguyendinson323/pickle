import { Request, Response } from 'express';
import { CourtService } from '../services/courtService';
import CourtFacility from '../models/CourtFacility';
import Court from '../models/Court';
import CourtBooking from '../models/CourtBooking';
import MaintenanceRecord from '../models/MaintenanceRecord';
import CourtReview from '../models/CourtReview';
import User from '../models/User';

// FACILITY MANAGEMENT ENDPOINTS

// Search facilities with advanced filters
const searchFacilities = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10,
      city,
      state,
      facilityType,
      courtSurface,
      amenities,
      minPrice,
      maxPrice,
      rating,
      hasLights,
      accessibility,
      latitude,
      longitude,
      radius
    } = req.query;

    const filters: any = {};

    if (city) filters.city = city as string;
    if (state) filters.state = state as string;
    if (facilityType) filters.facilityType = facilityType as 'indoor' | 'outdoor' | 'mixed';
    if (courtSurface) filters.courtSurface = (courtSurface as string).split(',');
    if (amenities) filters.amenities = (amenities as string).split(',');
    if (rating) filters.rating = parseFloat(rating as string);
    if (hasLights) filters.hasLights = (hasLights as string) === 'true';
    if (accessibility) filters.accessibility = (accessibility as string) === 'true';

    if (minPrice || maxPrice) {
      filters.priceRange = {
        min: minPrice ? parseFloat(minPrice as string) : 0,
        max: maxPrice ? parseFloat(maxPrice as string) : 10000
      };
    }

    if (latitude && longitude) {
      filters.location = {
        latitude: parseFloat(latitude as string),
        longitude: parseFloat(longitude as string),
        radius: radius ? parseFloat(radius as string) : 25
      };
    }

    const result = await CourtService.searchFacilities(
      filters,
      parseInt(page as string),
      parseInt(limit as string)
    );

    res.json({
      success: true,
      data: result.facilities,
      pagination: {
        current: result.page,
        pages: result.totalPages,
        total: result.total,
        limit: parseInt(limit as string)
      }
    });
  } catch (error: any) {
    console.error('Error searching facilities:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error interno del servidor'
    });
  }
};

// Get facility by ID with complete details
const getFacilityById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const facility = await CourtFacility.findByPk(id, {
      include: [
        {
          model: Court,
          as: 'courts',
          where: { isActive: true },
          required: false,
          include: [
            {
              model: CourtReview,
              as: 'reviews',
              where: { status: 'active' },
              required: false,
              limit: 5,
              order: [['createdAt', 'DESC']],
              include: [
                {
                  model: User,
                  as: 'user',
                  attributes: ['id', 'username']
                }
              ]
            }
          ]
        },
        {
          model: CourtReview,
          as: 'reviews',
          where: { status: 'active' },
          required: false,
          limit: 10,
          order: [['createdAt', 'DESC']],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username']
            }
          ]
        }
      ]
    });

    if (!facility) {
      res.status(404).json({
        success: false,
        message: 'Instalación no encontrada'
      });
      return;
    }

    res.json({
      success: true,
      data: facility
    });
  } catch (error: any) {
    console.error('Error fetching facility:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error interno del servidor'
    });
  }
};

// AVAILABILITY AND BOOKING ENDPOINTS

// Check court availability for specific date and time
const checkCourtAvailability = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courtId, date, startTime, endTime } = req.query;

    if (!courtId || !date || !startTime || !endTime) {
      res.status(400).json({
        success: false,
        message: 'Parámetros requeridos: courtId, date, startTime, endTime'
      });
      return;
    }

    const availability = await CourtService.checkCourtAvailability(
      courtId as string,
      date as string,
      startTime as string,
      endTime as string
    );

    res.json({
      success: true,
      data: availability
    });
  } catch (error: any) {
    console.error('Error checking availability:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error interno del servidor'
    });
  }
};

// Get available time slots for a court on specific date
const getAvailableSlots = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courtId, date } = req.query;

    if (!courtId || !date) {
      res.status(400).json({
        success: false,
        message: 'Parámetros requeridos: courtId, date'
      });
      return;
    }

    const slots = await CourtService.getAvailableSlots(
      courtId as string,
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
};

// Calculate booking price
const calculateBookingPrice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courtId, date, startTime, endTime } = req.query;

    if (!courtId || !date || !startTime || !endTime) {
      res.status(400).json({
        success: false,
        message: 'Parámetros requeridos: courtId, date, startTime, endTime'
      });
      return;
    }

    const pricing = await CourtService.calculateBookingPrice(
      courtId as string,
      date as string,
      startTime as string,
      endTime as string
    );

    res.json({
      success: true,
      data: pricing
    });
  } catch (error: any) {
    console.error('Error calculating price:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error interno del servidor'
    });
  }
};

// Create a new booking
const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
      return;
    }

    const bookingData = {
      ...req.body,
      userId
    };

    // Validate required fields
    const requiredFields = ['courtId', 'bookingDate', 'startTime', 'endTime', 'participants', 'contactInfo'];
    for (const field of requiredFields) {
      if (!bookingData[field]) {
        res.status(400).json({
          success: false,
          message: `Campo requerido: ${field}`
        });
        return;
      }
    }

    const booking = await CourtService.createBooking(bookingData);

    res.status(201).json({
      success: true,
      message: 'Reserva creada exitosamente',
      data: booking
    });
  } catch (error: any) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error interno del servidor'
    });
  }
};

// Cancel a booking
const cancelBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
      return;
    }

    if (!reason) {
      res.status(400).json({
        success: false,
        message: 'Motivo de cancelación requerido'
      });
      return;
    }

    const booking = await CourtService.cancelBooking(id, userId, reason);

    res.json({
      success: true,
      message: 'Reserva cancelada exitosamente',
      data: booking
    });
  } catch (error: any) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error interno del servidor'
    });
  }
};

// Check-in for a booking
const checkInBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
      return;
    }

    const booking = await CourtService.checkInBooking(id, userId);

    res.json({
      success: true,
      message: 'Check-in realizado exitosamente',
      data: booking
    });
  } catch (error: any) {
    console.error('Error checking in:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error interno del servidor'
    });
  }
};

// Get user's booking history
const getUserBookingHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
      return;
    }

    const { page = 1, limit = 10 } = req.query;

    const result = await CourtService.getUserBookingHistory(
      userId,
      parseInt(page as string),
      parseInt(limit as string)
    );

    res.json({
      success: true,
      data: result.bookings,
      pagination: {
        current: result.page,
        pages: result.totalPages,
        total: result.total,
        limit: parseInt(limit as string)
      }
    });
  } catch (error: any) {
    console.error('Error fetching booking history:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error interno del servidor'
    });
  }
};

// Get booking by ID
const getBookingById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;

    const booking = await CourtBooking.findByPk(id, {
      include: [
        {
          model: Court,
          as: 'court',
          include: [
            {
              model: CourtFacility,
              as: 'facility',
              attributes: ['name', 'address', 'city', 'contactPhone', 'contactEmail']
            }
          ]
        }
      ]
    });

    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Reserva no encontrada'
      });
      return;
    }

    // Check if user owns the booking or is admin
    if (booking.userId !== userId && !(req as any).user?.role?.includes('admin')) {
      res.status(403).json({
        success: false,
        message: 'No autorizado para ver esta reserva'
      });
      return;
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error: any) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error interno del servidor'
    });
  }
};

// ANALYTICS ENDPOINTS

// Get facility analytics
const getFacilityAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { facilityId } = req.params;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({
        success: false,
        message: 'Fechas de inicio y fin requeridas'
      });
      return;
    }

    const analytics = await CourtService.getFacilityAnalytics(
      facilityId,
      startDate as string,
      endDate as string
    );

    res.json({
      success: true,
      data: analytics
    });
  } catch (error: any) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error interno del servidor'
    });
  }
};

// COURT SPECIFIC ENDPOINTS

// Get court details by ID
const getCourtById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const court = await Court.findByPk(id, {
      include: [
        {
          model: CourtFacility,
          as: 'facility',
          attributes: [
            'name', 'description', 'address', 'city', 'state',
            'contactPhone', 'contactEmail', 'amenities', 'photos',
            'rating', 'totalReviews', 'policies', 'operatingHours'
          ]
        },
        {
          model: CourtReview,
          as: 'reviews',
          where: { status: 'active' },
          required: false,
          limit: 10,
          order: [['createdAt', 'DESC']],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username']
            }
          ]
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

    res.json({
      success: true,
      data: court
    });
  } catch (error: any) {
    console.error('Error fetching court:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error interno del servidor'
    });
  }
};

// Get courts by facility
const getCourtsByFacility = async (req: Request, res: Response): Promise<void> => {
  try {
    const { facilityId } = req.params;

    const courts = await Court.findAll({
      where: {
        facilityId,
        isActive: true,
        isAvailableForBooking: true
      },
      include: [
        {
          model: CourtReview,
          as: 'reviews',
          where: { status: 'active' },
          required: false,
          attributes: ['ratings']
        }
      ],
      order: [['courtNumber', 'ASC']]
    });

    res.json({
      success: true,
      data: courts
    });
  } catch (error: any) {
    console.error('Error fetching courts:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error interno del servidor'
    });
  }
};

export {
  // Facility endpoints
  searchFacilities,
  getFacilityById,
  getFacilityAnalytics,
  
  // Court endpoints
  getCourtById,
  getCourtsByFacility,
  
  // Availability endpoints
  checkCourtAvailability,
  getAvailableSlots,
  calculateBookingPrice,
  
  // Booking endpoints
  createBooking,
  cancelBooking,
  checkInBooking,
  getBookingById,
  getUserBookingHistory
};
