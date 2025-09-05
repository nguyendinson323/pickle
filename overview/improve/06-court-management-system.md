# 06. Court Management System - Complete Implementation Guide

## Problem Analysis
The current project lacks a comprehensive court management system essential for clubs and facilities to manage their pickleball courts, bookings, availability, maintenance, and revenue optimization.

## Core Requirements
1. **Court Registration & Management**: Clubs can add and manage their court facilities
2. **Booking System**: Real-time court availability and reservation system
3. **Pricing Management**: Dynamic pricing based on time, demand, and court type
4. **Maintenance Tracking**: Court maintenance schedules and issue reporting
5. **Revenue Analytics**: Booking analytics and revenue reporting
6. **Court Availability Calendar**: Visual availability display for users
7. **Integration with Player Finder**: Courts available for matched players
8. **Multi-location Support**: Manage multiple court facilities

## Step-by-Step Implementation Plan

### Phase 1: Database Schema Design

#### 1.1 Create Court Facility Model (`backend/src/models/CourtFacility.ts`)
```typescript
interface CourtFacility extends Model {
  id: string;
  name: string;
  description: string;
  ownerId: string; // Club or facility owner
  ownerType: 'club' | 'independent'; // Club profile or individual owner
  
  // Location
  address: string;
  city: string;
  state: string;
  postalCode: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  
  // Facility Details
  totalCourts: number;
  facilityType: 'indoor' | 'outdoor' | 'mixed';
  surfaces: string[]; // ['concrete', 'asphalt', 'sport_court', 'wood']
  amenities: string[]; // ['parking', 'restrooms', 'lockers', 'pro_shop', 'cafe']
  
  // Operating Hours
  operatingHours: {
    [day: string]: {
      open: string; // "08:00"
      close: string; // "22:00"
      closed: boolean;
    };
  };
  
  // Policies
  cancellationPolicy: string;
  advanceBookingDays: number; // How many days in advance can book
  minimumBookingDuration: number; // minutes
  maximumBookingDuration: number; // minutes
  
  // Contact & Media
  contactPhone: string;
  contactEmail: string;
  website?: string;
  featuredImage: string;
  gallery: string[];
  
  // Status
  isActive: boolean;
  isVerified: boolean;
  verifiedAt?: Date;
  
  // Ratings
  averageRating: number;
  totalReviews: number;
  
  createdAt: Date;
  updatedAt: Date;
}

CourtFacility.belongsTo(User, { as: 'owner' });
CourtFacility.hasMany(Court);
CourtFacility.hasMany(CourtBooking);
CourtFacility.hasMany(CourtReview);
```

#### 1.2 Create Individual Court Model (`backend/src/models/Court.ts`)
```typescript
interface Court extends Model {
  id: string;
  facilityId: string;
  courtNumber: string; // "Court 1", "Court A", etc.
  name?: string; // Optional custom name
  
  // Court Specifications
  surface: 'concrete' | 'asphalt' | 'sport_court' | 'wood' | 'clay';
  courtType: 'indoor' | 'outdoor';
  lighting: boolean;
  netType: 'permanent' | 'portable' | 'tournament';
  
  // Dimensions (in feet)
  dimensions: {
    length: number; // Standard: 44
    width: number; // Standard: 20
  };
  
  // Features
  features: string[]; // ['windscreen', 'benches', 'scoreboard', 'sound_system']
  
  // Status
  status: 'active' | 'maintenance' | 'closed' | 'reserved';
  maintenanceNotes?: string;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  
  // Booking Settings
  isBookable: boolean;
  hourlyRate: number;
  peakHourRate?: number;
  weekendRate?: number;
  memberRate?: number; // Discount for club members
  
  // Peak Hours Definition
  peakHours: {
    start: string; // "17:00"
    end: string; // "21:00"
    days: string[]; // ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
  };
  
  createdAt: Date;
  updatedAt: Date;
}

Court.belongsTo(CourtFacility, { as: 'facility' });
Court.hasMany(CourtBooking);
Court.hasMany(MaintenanceRecord);
```

#### 1.3 Create Court Booking Model (`backend/src/models/CourtBooking.ts`)
```typescript
interface CourtBooking extends Model {
  id: string;
  courtId: string;
  facilityId: string;
  playerId: string; // Primary booker
  
  // Booking Details
  bookingDate: Date;
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  
  // Participants (for group bookings)
  participants: {
    playerId: string;
    playerName: string;
    confirmed: boolean;
  }[];
  maxParticipants: number;
  
  // Booking Type
  bookingType: 'casual_play' | 'lesson' | 'tournament' | 'league' | 'maintenance';
  recurring?: {
    frequency: 'weekly' | 'biweekly' | 'monthly';
    endDate: Date;
    daysOfWeek: number[]; // [1,3,5] for Mon, Wed, Fri
  };
  
  // Payment
  totalAmount: number;
  currency: 'USD' | 'MXN';
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'cancelled';
  paymentIntentId?: string;
  discountApplied?: {
    type: 'member' | 'promo_code' | 'off_peak';
    amount: number;
  };
  
  // Status
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'no_show';
  bookingSource: 'web' | 'mobile' | 'phone' | 'walk_in';
  
  // Booking Notes
  notes?: string;
  specialRequests?: string;
  
  // Cancellation
  cancelledAt?: Date;
  cancelledBy?: string;
  cancellationReason?: string;
  refundAmount?: number;
  
  // Check-in
  checkedInAt?: Date;
  checkedOutAt?: Date;
  actualDuration?: number;
  
  createdAt: Date;
  updatedAt: Date;
}

CourtBooking.belongsTo(Court);
CourtBooking.belongsTo(CourtFacility, { as: 'facility' });
CourtBooking.belongsTo(User, { as: 'player' });
```

#### 1.4 Create Maintenance Record Model (`backend/src/models/MaintenanceRecord.ts`)
```typescript
interface MaintenanceRecord extends Model {
  id: string;
  courtId: string;
  facilityId: string;
  
  // Maintenance Details
  maintenanceType: 'routine' | 'repair' | 'deep_clean' | 'equipment_check' | 'surface_repair';
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Scheduling
  scheduledDate: Date;
  completedDate?: Date;
  estimatedDuration: number; // in minutes
  actualDuration?: number;
  
  // Personnel
  assignedTo?: string; // Staff member or vendor
  completedBy?: string;
  
  // Status
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'deferred';
  
  // Costs
  estimatedCost?: number;
  actualCost?: number;
  
  // Documentation
  beforePhotos?: string[];
  afterPhotos?: string[];
  notes?: string;
  
  // Issues Found
  issuesFound?: string[];
  followUpRequired?: boolean;
  followUpDate?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

MaintenanceRecord.belongsTo(Court);
MaintenanceRecord.belongsTo(CourtFacility, { as: 'facility' });
```

#### 1.5 Create Court Review Model (`backend/src/models/CourtReview.ts`)
```typescript
interface CourtReview extends Model {
  id: string;
  facilityId: string;
  courtId?: string; // Optional: review specific court or entire facility
  playerId: string;
  bookingId?: string; // Link to the booking that prompted this review
  
  // Rating (1-5 stars)
  overallRating: number;
  courtConditionRating: number;
  facilitiesRating: number;
  staffRating: number;
  valueRating: number;
  
  // Review Content
  title?: string;
  reviewText: string;
  pros?: string[];
  cons?: string[];
  
  // Visit Info
  visitDate: Date;
  playedWith: 'solo' | 'partner' | 'group';
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  
  // Photos
  photos?: string[];
  
  // Status
  isVerified: boolean;
  isPublished: boolean;
  
  // Moderation
  flaggedForReview?: boolean;
  moderatorNotes?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

CourtReview.belongsTo(CourtFacility, { as: 'facility' });
CourtReview.belongsTo(Court);
CourtReview.belongsTo(User, { as: 'player' });
CourtReview.belongsTo(CourtBooking, { as: 'booking' });
```

### Phase 2: Court Management Services

#### 2.1 Court Service (`backend/src/services/courtService.ts`)
```typescript
class CourtService {
  async createFacility(ownerId: string, facilityData: CreateFacilityRequest) {
    // Verify owner permissions
    const owner = await User.findByPk(ownerId);
    if (!['club', 'admin', 'state_committee'].includes(owner.role)) {
      throw new Error('Insufficient permissions to create court facilities');
    }

    // Geocode address
    const coordinates = await this.geocodeAddress({
      address: facilityData.address,
      city: facilityData.city,
      state: facilityData.state,
      postalCode: facilityData.postalCode
    });

    const facility = await CourtFacility.create({
      ...facilityData,
      ownerId,
      coordinates,
      isActive: true,
      isVerified: false,
      averageRating: 0,
      totalReviews: 0
    });

    // Create individual courts
    for (let i = 1; i <= facilityData.totalCourts; i++) {
      await Court.create({
        facilityId: facility.id,
        courtNumber: `Court ${i}`,
        surface: facilityData.defaultSurface || 'concrete',
        courtType: facilityData.facilityType === 'mixed' ? 'outdoor' : facilityData.facilityType,
        lighting: facilityData.hasLighting || false,
        netType: 'permanent',
        dimensions: { length: 44, width: 20 },
        features: [],
        status: 'active',
        isBookable: true,
        hourlyRate: facilityData.defaultHourlyRate || 25,
        peakHours: {
          start: '17:00',
          end: '21:00',
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
        }
      });
    }

    return facility;
  }

  async getAvailableCourts(facilityId: string, searchCriteria: CourtAvailabilitySearch) {
    const { date, startTime, endTime, courtType, features } = searchCriteria;
    
    // Get all courts for facility
    const courts = await Court.findAll({
      where: {
        facilityId,
        isBookable: true,
        status: 'active',
        ...(courtType && { courtType }),
        ...(features && features.length > 0 && {
          features: { [Op.overlap]: features }
        })
      },
      include: [{
        model: CourtFacility,
        as: 'facility'
      }]
    });

    // Check availability for each court
    const availableCourts = [];
    
    for (const court of courts) {
      const isAvailable = await this.isCourtAvailable(
        court.id,
        new Date(`${date} ${startTime}`),
        new Date(`${date} ${endTime}`)
      );
      
      if (isAvailable) {
        const rate = await this.calculateRate(court, date, startTime, endTime);
        availableCourts.push({
          ...court.toJSON(),
          rate,
          totalCost: rate * (this.calculateDurationHours(startTime, endTime))
        });
      }
    }

    return availableCourts.sort((a, b) => a.rate - b.rate);
  }

  async bookCourt(playerId: string, bookingData: CourtBookingRequest) {
    const { courtId, bookingDate, startTime, endTime, participants } = bookingData;
    
    // Validate court availability
    const startDateTime = new Date(`${bookingDate} ${startTime}`);
    const endDateTime = new Date(`${bookingDate} ${endTime}`);
    
    const isAvailable = await this.isCourtAvailable(courtId, startDateTime, endDateTime);
    if (!isAvailable) {
      throw new Error('Court is not available for selected time slot');
    }

    // Get court and calculate pricing
    const court = await Court.findByPk(courtId, {
      include: [{ model: CourtFacility, as: 'facility' }]
    });
    
    const duration = this.calculateDuration(startDateTime, endDateTime);
    const rate = await this.calculateRate(court, bookingDate, startTime, endTime);
    const totalAmount = rate * (duration / 60); // Convert minutes to hours

    // Create booking
    const booking = await CourtBooking.create({
      courtId,
      facilityId: court.facilityId,
      playerId,
      bookingDate: new Date(bookingDate),
      startTime: startDateTime,
      endTime: endDateTime,
      duration,
      participants: participants || [],
      maxParticipants: bookingData.maxParticipants || 4,
      bookingType: bookingData.bookingType || 'casual_play',
      totalAmount,
      currency: 'USD',
      paymentStatus: totalAmount > 0 ? 'pending' : 'paid',
      status: 'pending',
      bookingSource: 'web',
      notes: bookingData.notes
    });

    // Create payment intent if payment required
    if (totalAmount > 0) {
      const paymentIntent = await this.createPaymentIntent(totalAmount, 'USD', booking.id);
      await booking.update({ paymentIntentId: paymentIntent.id });
    }

    // Send confirmation notifications
    await this.sendBookingConfirmation(booking);

    return booking;
  }

  async scheduleRecurringBooking(playerId: string, recurringData: RecurringBookingRequest) {
    const { 
      courtId, 
      startDate, 
      endDate, 
      startTime, 
      endTime, 
      daysOfWeek, 
      frequency 
    } = recurringData;

    const bookings = [];
    let currentDate = new Date(startDate);
    const finalDate = new Date(endDate);

    while (currentDate <= finalDate) {
      // Check if current date matches required day of week
      if (daysOfWeek.includes(currentDate.getDay())) {
        try {
          const booking = await this.bookCourt(playerId, {
            courtId,
            bookingDate: currentDate.toISOString().split('T')[0],
            startTime,
            endTime,
            bookingType: 'recurring',
            ...recurringData
          });
          
          // Link to recurring series
          await booking.update({
            recurring: {
              frequency,
              endDate: finalDate,
              daysOfWeek
            }
          });
          
          bookings.push(booking);
        } catch (error) {
          console.warn(`Failed to book ${currentDate.toDateString()}: ${error.message}`);
        }
      }

      // Move to next occurrence based on frequency
      if (frequency === 'weekly') {
        currentDate.setDate(currentDate.getDate() + 7);
      } else if (frequency === 'biweekly') {
        currentDate.setDate(currentDate.getDate() + 14);
      } else if (frequency === 'monthly') {
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    }

    return bookings;
  }

  async cancelBooking(bookingId: string, cancelledBy: string, reason?: string) {
    const booking = await CourtBooking.findByPk(bookingId, {
      include: [
        { model: Court, include: [{ model: CourtFacility, as: 'facility' }] },
        { model: User, as: 'player' }
      ]
    });

    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.status === 'cancelled') {
      throw new Error('Booking already cancelled');
    }

    // Check cancellation policy
    const hoursUntilBooking = (booking.startTime.getTime() - new Date().getTime()) / (1000 * 60 * 60);
    const facility = booking.court.facility;
    
    let refundAmount = 0;
    if (this.isRefundEligible(hoursUntilBooking, facility.cancellationPolicy)) {
      refundAmount = await this.calculateRefundAmount(booking, hoursUntilBooking);
    }

    // Update booking status
    await booking.update({
      status: 'cancelled',
      cancelledAt: new Date(),
      cancelledBy,
      cancellationReason: reason,
      refundAmount
    });

    // Process refund if applicable
    if (refundAmount > 0 && booking.paymentIntentId) {
      await this.processRefund(booking.paymentIntentId, refundAmount);
      await booking.update({ paymentStatus: 'refunded' });
    }

    // Send cancellation notification
    await this.sendCancellationNotification(booking);

    return booking;
  }

  async scheduleMaintenance(facilityId: string, maintenanceData: MaintenanceScheduleRequest) {
    const { courtId, maintenanceType, description, scheduledDate, estimatedDuration } = maintenanceData;
    
    // Block court for maintenance period
    const startTime = new Date(scheduledDate);
    const endTime = new Date(startTime.getTime() + estimatedDuration * 60000);
    
    // Check for existing bookings
    const conflictingBookings = await CourtBooking.findAll({
      where: {
        courtId,
        status: ['confirmed', 'pending'],
        [Op.or]: [
          {
            startTime: { [Op.between]: [startTime, endTime] }
          },
          {
            endTime: { [Op.between]: [startTime, endTime] }
          },
          {
            [Op.and]: [
              { startTime: { [Op.lte]: startTime } },
              { endTime: { [Op.gte]: endTime } }
            ]
          }
        ]
      }
    });

    if (conflictingBookings.length > 0) {
      throw new Error('Cannot schedule maintenance: conflicting bookings exist');
    }

    // Create maintenance record
    const maintenance = await MaintenanceRecord.create({
      courtId,
      facilityId,
      maintenanceType,
      description,
      scheduledDate: startTime,
      estimatedDuration,
      priority: maintenanceData.priority || 'medium',
      status: 'scheduled'
    });

    // Update court status
    await Court.update(
      { status: 'maintenance', maintenanceNotes: description },
      { where: { id: courtId } }
    );

    return maintenance;
  }

  async getCourtAnalytics(facilityId: string, dateRange: { startDate: Date; endDate: Date }) {
    const { startDate, endDate } = dateRange;
    
    // Booking statistics
    const bookings = await CourtBooking.findAll({
      where: {
        facilityId,
        bookingDate: { [Op.between]: [startDate, endDate] }
      },
      include: [{ model: Court }]
    });

    const analytics = {
      totalBookings: bookings.length,
      totalRevenue: bookings.reduce((sum, booking) => sum + booking.totalAmount, 0),
      averageBookingDuration: bookings.reduce((sum, booking) => sum + booking.duration, 0) / bookings.length,
      
      // Booking status breakdown
      statusBreakdown: {
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        completed: bookings.filter(b => b.status === 'completed').length,
        cancelled: bookings.filter(b => b.status === 'cancelled').length,
        no_show: bookings.filter(b => b.status === 'no_show').length
      },
      
      // Peak hours analysis
      hourlyDistribution: this.analyzeHourlyDistribution(bookings),
      
      // Court utilization
      courtUtilization: await this.calculateCourtUtilization(facilityId, startDate, endDate),
      
      // Revenue by court
      revenueByDate: this.groupRevenueByDate(bookings),
      
      // Popular time slots
      popularTimeSlots: this.analyzePopularTimeSlots(bookings)
    };

    return analytics;
  }

  private async isCourtAvailable(courtId: string, startTime: Date, endTime: Date): Promise<boolean> {
    // Check for existing bookings
    const conflictingBookings = await CourtBooking.count({
      where: {
        courtId,
        status: ['confirmed', 'pending'],
        [Op.or]: [
          {
            startTime: { [Op.between]: [startTime, endTime] }
          },
          {
            endTime: { [Op.between]: [startTime, endTime] }
          },
          {
            [Op.and]: [
              { startTime: { [Op.lte]: startTime } },
              { endTime: { [Op.gte]: endTime } }
            ]
          }
        ]
      }
    });

    if (conflictingBookings > 0) return false;

    // Check court status
    const court = await Court.findByPk(courtId);
    if (!court || !court.isBookable || court.status !== 'active') {
      return false;
    }

    // Check facility operating hours
    const facility = await CourtFacility.findByPk(court.facilityId);
    const dayOfWeek = startTime.toLocaleDateString('en', { weekday: 'lowercase' });
    const operatingHours = facility.operatingHours[dayOfWeek];
    
    if (operatingHours?.closed) return false;
    
    const startTimeStr = startTime.toTimeString().slice(0, 5);
    const endTimeStr = endTime.toTimeString().slice(0, 5);
    
    if (startTimeStr < operatingHours.open || endTimeStr > operatingHours.close) {
      return false;
    }

    return true;
  }

  private async calculateRate(court: Court, date: string, startTime: string, endTime: string): Promise<number> {
    let baseRate = court.hourlyRate;
    
    const bookingDate = new Date(date);
    const dayOfWeek = bookingDate.toLocaleDateString('en', { weekday: 'lowercase' });
    
    // Weekend pricing
    if (['saturday', 'sunday'].includes(dayOfWeek) && court.weekendRate) {
      baseRate = court.weekendRate;
    }
    
    // Peak hours pricing
    const peakHours = court.peakHours;
    if (peakHours && peakHours.days.includes(dayOfWeek)) {
      if (startTime >= peakHours.start && startTime <= peakHours.end && court.peakHourRate) {
        baseRate = court.peakHourRate;
      }
    }
    
    return baseRate;
  }

  private calculateDuration(startTime: Date, endTime: Date): number {
    return (endTime.getTime() - startTime.getTime()) / (1000 * 60); // minutes
  }

  private calculateDurationHours(startTime: string, endTime: string): number {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    return (endMinutes - startMinutes) / 60;
  }
}
```

### Phase 3: Court Controllers

#### 3.1 Court Controller (`backend/src/controllers/courtController.ts`)
```typescript
export class CourtController {
  async createFacility(req: Request, res: Response) {
    try {
      const facility = await courtService.createFacility(req.user.id, req.body);
      
      res.status(201).json({
        success: true,
        data: facility,
        message: 'Court facility created successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getFacilities(req: Request, res: Response) {
    try {
      const { 
        city, 
        state, 
        latitude, 
        longitude, 
        radius = 25,
        courtType,
        amenities,
        minRating,
        page = 1,
        limit = 10
      } = req.query;

      let whereClause: any = { isActive: true };
      
      if (city) whereClause.city = { [Op.iLike]: `%${city}%` };
      if (state) whereClause.state = state;
      if (minRating) whereClause.averageRating = { [Op.gte]: parseFloat(minRating as string) };

      // Location-based search
      if (latitude && longitude) {
        whereClause = {
          ...whereClause,
          [Op.and]: [
            sequelize.where(
              sequelize.fn(
                'ST_DWithin',
                sequelize.fn(
                  'ST_MakePoint',
                  sequelize.col('coordinates.longitude'),
                  sequelize.col('coordinates.latitude')
                ),
                sequelize.fn('ST_MakePoint', parseFloat(longitude as string), parseFloat(latitude as string)),
                parseFloat(radius as string) * 1609.34 // Convert miles to meters
              ),
              true
            )
          ]
        };
      }

      const facilities = await CourtFacility.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Court,
            where: courtType ? { courtType } : undefined,
            required: courtType ? true : false
          },
          {
            model: User,
            as: 'owner',
            attributes: ['id', 'username', 'email']
          }
        ],
        limit: Number(limit),
        offset: (Number(page) - 1) * Number(limit),
        order: [['averageRating', 'DESC'], ['totalReviews', 'DESC']]
      });

      res.json({
        success: true,
        data: facilities.rows,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: facilities.count,
          totalPages: Math.ceil(facilities.count / Number(limit))
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getCourtAvailability(req: Request, res: Response) {
    try {
      const { facilityId } = req.params;
      const { date, startTime, endTime, courtType, features } = req.query;

      const availableCourts = await courtService.getAvailableCourts(facilityId, {
        date: date as string,
        startTime: startTime as string,
        endTime: endTime as string,
        courtType: courtType as string,
        features: features ? (features as string).split(',') : undefined
      });

      res.json({
        success: true,
        data: availableCourts
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async bookCourt(req: Request, res: Response) {
    try {
      const booking = await courtService.bookCourt(req.user.id, req.body);
      
      res.status(201).json({
        success: true,
        data: booking,
        message: 'Court booked successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getMyBookings(req: Request, res: Response) {
    try {
      const { status, startDate, endDate, page = 1, limit = 10 } = req.query;

      let whereClause: any = { playerId: req.user.id };
      
      if (status) whereClause.status = status;
      if (startDate || endDate) {
        whereClause.bookingDate = {};
        if (startDate) whereClause.bookingDate[Op.gte] = new Date(startDate as string);
        if (endDate) whereClause.bookingDate[Op.lte] = new Date(endDate as string);
      }

      const bookings = await CourtBooking.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Court,
            include: [
              { model: CourtFacility, as: 'facility' }
            ]
          }
        ],
        limit: Number(limit),
        offset: (Number(page) - 1) * Number(limit),
        order: [['bookingDate', 'DESC'], ['startTime', 'DESC']]
      });

      res.json({
        success: true,
        data: bookings.rows,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: bookings.count,
          totalPages: Math.ceil(bookings.count / Number(limit))
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async cancelBooking(req: Request, res: Response) {
    try {
      const { bookingId } = req.params;
      const { reason } = req.body;

      const booking = await courtService.cancelBooking(bookingId, req.user.id, reason);

      res.json({
        success: true,
        data: booking,
        message: 'Booking cancelled successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async scheduleMaintenance(req: Request, res: Response) {
    try {
      const { facilityId } = req.params;
      
      // Verify facility ownership
      const facility = await CourtFacility.findOne({
        where: { id: facilityId, ownerId: req.user.id }
      });
      
      if (!facility) {
        return res.status(403).json({
          success: false,
          error: 'Access denied: not facility owner'
        });
      }

      const maintenance = await courtService.scheduleMaintenance(facilityId, req.body);

      res.status(201).json({
        success: true,
        data: maintenance,
        message: 'Maintenance scheduled successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getFacilityAnalytics(req: Request, res: Response) {
    try {
      const { facilityId } = req.params;
      const { startDate, endDate } = req.query;

      // Verify facility ownership
      const facility = await CourtFacility.findOne({
        where: { id: facilityId, ownerId: req.user.id }
      });
      
      if (!facility) {
        return res.status(403).json({
          success: false,
          error: 'Access denied: not facility owner'
        });
      }

      const analytics = await courtService.getCourtAnalytics(facilityId, {
        startDate: new Date(startDate as string),
        endDate: new Date(endDate as string)
      });

      res.json({
        success: true,
        data: analytics
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async createReview(req: Request, res: Response) {
    try {
      const { facilityId } = req.params;
      const { courtId, bookingId, ratings, reviewText, title, pros, cons, photos } = req.body;

      // Verify user has booking at this facility
      const booking = await CourtBooking.findOne({
        where: {
          id: bookingId,
          playerId: req.user.id,
          facilityId,
          status: 'completed'
        }
      });

      if (!booking) {
        return res.status(400).json({
          success: false,
          error: 'You can only review facilities where you have completed bookings'
        });
      }

      const review = await CourtReview.create({
        facilityId,
        courtId,
        playerId: req.user.id,
        bookingId,
        overallRating: ratings.overall,
        courtConditionRating: ratings.courtCondition,
        facilitiesRating: ratings.facilities,
        staffRating: ratings.staff,
        valueRating: ratings.value,
        reviewText,
        title,
        pros,
        cons,
        photos,
        visitDate: booking.bookingDate,
        playedWith: req.body.playedWith || 'solo',
        skillLevel: req.user.skillLevel || 'intermediate',
        isVerified: true,
        isPublished: true
      });

      // Update facility average rating
      await this.updateFacilityRating(facilityId);

      res.status(201).json({
        success: true,
        data: review,
        message: 'Review submitted successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  private async updateFacilityRating(facilityId: string) {
    const reviews = await CourtReview.findAll({
      where: { facilityId, isPublished: true },
      attributes: ['overallRating']
    });

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? reviews.reduce((sum, review) => sum + review.overallRating, 0) / totalReviews
      : 0;

    await CourtFacility.update(
      { averageRating, totalReviews },
      { where: { id: facilityId } }
    );
  }
}
```

### Phase 4: Frontend Court Components

#### 4.1 Court Search & Booking (`frontend/src/components/courts/CourtSearch.tsx`)
```typescript
interface CourtSearchFilters {
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  courtType: 'indoor' | 'outdoor' | 'all';
  maxDistance: number;
  amenities: string[];
  maxPrice: number;
  minRating: number;
}

const CourtSearch: React.FC = () => {
  const [filters, setFilters] = useState<CourtSearchFilters>({
    location: '',
    date: '',
    startTime: '08:00',
    endTime: '10:00',
    courtType: 'all',
    maxDistance: 25,
    amenities: [],
    maxPrice: 100,
    minRating: 0
  });
  
  const [facilities, setFacilities] = useState<CourtFacility[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Geolocation error:', error);
        }
      );
    }
  };

  const searchFacilities = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (filters.location) params.append('city', filters.location);
      if (filters.courtType !== 'all') params.append('courtType', filters.courtType);
      if (filters.minRating > 0) params.append('minRating', filters.minRating.toString());
      
      if (userLocation && !filters.location) {
        params.append('latitude', userLocation.lat.toString());
        params.append('longitude', userLocation.lng.toString());
        params.append('radius', filters.maxDistance.toString());
      }

      const response = await api.get(`/courts/facilities?${params}`);
      setFacilities(response.data.data);
    } catch (error) {
      console.error('Error searching facilities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filters.location || userLocation) {
      searchFacilities();
    }
  }, [filters.location, filters.courtType, filters.minRating, userLocation]);

  const checkAvailability = async (facilityId: string) => {
    if (!filters.date || !filters.startTime || !filters.endTime) {
      alert('Please select date and time to check availability');
      return [];
    }

    try {
      const response = await api.get(`/courts/facilities/${facilityId}/availability`, {
        params: {
          date: filters.date,
          startTime: filters.startTime,
          endTime: filters.endTime,
          courtType: filters.courtType !== 'all' ? filters.courtType : undefined
        }
      });
      
      return response.data.data;
    } catch (error) {
      console.error('Error checking availability:', error);
      return [];
    }
  };

  return (
    <div className="court-search bg-white rounded-lg shadow-lg">
      {/* Search Filters */}
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold mb-4">Find Courts</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Location (city, state)"
            value={filters.location}
            onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
            className="p-3 border rounded-lg"
          />
          
          <input
            type="date"
            value={filters.date}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
            className="p-3 border rounded-lg"
          />
          
          <input
            type="time"
            value={filters.startTime}
            onChange={(e) => setFilters(prev => ({ ...prev, startTime: e.target.value }))}
            className="p-3 border rounded-lg"
          />
          
          <input
            type="time"
            value={filters.endTime}
            onChange={(e) => setFilters(prev => ({ ...prev, endTime: e.target.value }))}
            className="p-3 border rounded-lg"
          />
        </div>

        {/* Advanced Filters */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filters.courtType}
            onChange={(e) => setFilters(prev => ({ ...prev, courtType: e.target.value as any }))}
            className="p-3 border rounded-lg"
          >
            <option value="all">Any Court Type</option>
            <option value="indoor">Indoor Only</option>
            <option value="outdoor">Outdoor Only</option>
          </select>
          
          <div>
            <label className="block text-sm font-medium mb-1">Max Distance: {filters.maxDistance} miles</label>
            <input
              type="range"
              min="1"
              max="50"
              value={filters.maxDistance}
              onChange={(e) => setFilters(prev => ({ ...prev, maxDistance: parseInt(e.target.value) }))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Min Rating: {filters.minRating} stars</label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={filters.minRating}
              onChange={(e) => setFilters(prev => ({ ...prev, minRating: parseFloat(e.target.value) }))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="p-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Searching for courts...</p>
          </div>
        ) : facilities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No courts found. Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {facilities.map((facility) => (
              <FacilityCard
                key={facility.id}
                facility={facility}
                onCheckAvailability={() => checkAvailability(facility.id)}
                searchFilters={filters}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const FacilityCard: React.FC<{
  facility: CourtFacility;
  onCheckAvailability: () => Promise<Court[]>;
  searchFilters: CourtSearchFilters;
}> = ({ facility, onCheckAvailability, searchFilters }) => {
  const [availableCourts, setAvailableCourts] = useState<Court[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);

  const handleCheckAvailability = async () => {
    const courts = await onCheckAvailability();
    setAvailableCourts(courts);
  };

  const handleBookCourt = (court: Court) => {
    setSelectedCourt(court);
    setShowBookingModal(true);
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Facility Image */}
      {facility.featuredImage && (
        <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${facility.featuredImage})` }} />
      )}
      
      <div className="p-4">
        {/* Facility Info */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">{facility.name}</h3>
          {facility.averageRating > 0 && (
            <div className="flex items-center">
              <span className="text-yellow-500">★</span>
              <span className="ml-1 text-sm font-medium">{facility.averageRating.toFixed(1)}</span>
              <span className="ml-1 text-sm text-gray-500">({facility.totalReviews})</span>
            </div>
          )}
        </div>
        
        <p className="text-gray-600 mb-2">{facility.city}, {facility.state}</p>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
            {facility.totalCourts} courts
          </span>
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs capitalize">
            {facility.facilityType}
          </span>
          {facility.amenities?.slice(0, 3).map(amenity => (
            <span key={amenity} className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs capitalize">
              {amenity.replace('_', ' ')}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleCheckAvailability}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            Check Availability
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            View Details
          </button>
        </div>

        {/* Available Courts */}
        {availableCourts.length > 0 && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">Available Courts</h4>
            <div className="space-y-2">
              {availableCourts.map((court) => (
                <div key={court.id} className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{court.name || court.courtNumber}</span>
                    <span className="text-sm text-gray-600 ml-2">
                      ${court.rate}/hour • {court.courtType}
                    </span>
                  </div>
                  <button
                    onClick={() => handleBookCourt(court)}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                  >
                    Book ${court.totalCost?.toFixed(2)}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedCourt && (
        <CourtBookingModal
          court={selectedCourt}
          facility={facility}
          searchFilters={searchFilters}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedCourt(null);
          }}
        />
      )}
    </div>
  );
};
```

#### 4.2 Court Booking Modal (`frontend/src/components/courts/CourtBookingModal.tsx`)
```typescript
const CourtBookingModal: React.FC<{
  court: Court;
  facility: CourtFacility;
  searchFilters: CourtSearchFilters;
  onClose: () => void;
}> = ({ court, facility, searchFilters, onClose }) => {
  const [bookingData, setBookingData] = useState({
    participants: [],
    maxParticipants: 4,
    notes: '',
    emergencyContact: {
      name: '',
      phone: ''
    }
  });
  
  const [loading, setLoading] = useState(false);

  const calculateTotal = () => {
    const duration = calculateDurationHours(searchFilters.startTime, searchFilters.endTime);
    return court.rate * duration;
  };

  const handleBooking = async () => {
    setLoading(true);
    try {
      const bookingPayload = {
        courtId: court.id,
        bookingDate: searchFilters.date,
        startTime: searchFilters.startTime,
        endTime: searchFilters.endTime,
        ...bookingData
      };

      const response = await api.post('/courts/bookings', bookingPayload);
      
      if (response.data.data.totalAmount > 0) {
        // Redirect to payment
        window.location.href = response.data.paymentUrl;
      } else {
        alert('Booking confirmed!');
        onClose();
      }
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Book Court</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Booking Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium mb-2">Booking Summary</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Facility:</span>
                <span className="font-medium">{facility.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Court:</span>
                <span className="font-medium">{court.name || court.courtNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span className="font-medium">{new Date(searchFilters.date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Time:</span>
                <span className="font-medium">{searchFilters.startTime} - {searchFilters.endTime}</span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span className="font-medium">{calculateDurationHours(searchFilters.startTime, searchFilters.endTime)} hours</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2 mt-2">
                <span>Total:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Maximum Participants</label>
              <select
                value={bookingData.maxParticipants}
                onChange={(e) => setBookingData(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))}
                className="w-full p-3 border rounded-lg"
              >
                <option value={2}>2 players (Singles)</option>
                <option value={4}>4 players (Doubles)</option>
                <option value={6}>6 players (Training)</option>
                <option value={8}>8 players (Group)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Emergency Contact Name</label>
              <input
                type="text"
                value={bookingData.emergencyContact.name}
                onChange={(e) => setBookingData(prev => ({
                  ...prev,
                  emergencyContact: { ...prev.emergencyContact, name: e.target.value }
                }))}
                className="w-full p-3 border rounded-lg"
                placeholder="Emergency contact name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Emergency Contact Phone</label>
              <input
                type="tel"
                value={bookingData.emergencyContact.phone}
                onChange={(e) => setBookingData(prev => ({
                  ...prev,
                  emergencyContact: { ...prev.emergencyContact, phone: e.target.value }
                }))}
                className="w-full p-3 border rounded-lg"
                placeholder="Emergency contact phone"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Special Requests (Optional)</label>
              <textarea
                value={bookingData.notes}
                onChange={(e) => setBookingData(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full p-3 border rounded-lg h-24"
                placeholder="Any special requests or notes..."
              />
            </div>
          </div>

          {/* Facility Policies */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">Booking Policies</h4>
            <div className="text-sm text-yellow-700">
              <p className="mb-1">• Cancellation: {facility.cancellationPolicy}</p>
              <p className="mb-1">• Advance booking: Up to {facility.advanceBookingDays} days</p>
              <p>• Please arrive 10 minutes early for check-in</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleBooking}
              disabled={loading || !bookingData.emergencyContact.name || !bookingData.emergencyContact.phone}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : `Book Court - $${calculateTotal().toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const calculateDurationHours = (startTime: string, endTime: string): number => {
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  
  return (endMinutes - startMinutes) / 60;
};
```

### Phase 5: Testing & Quality Assurance

#### 5.1 Court System Tests
```typescript
// backend/tests/court.test.ts
describe('Court Management System', () => {
  describe('Facility Creation', () => {
    it('should create facility with courts', async () => {
      const facilityData = {
        name: 'Test Courts',
        totalCourts: 4,
        defaultHourlyRate: 30,
        address: '123 Main St',
        city: 'Test City',
        state: 'CA'
      };

      const response = await request(app)
        .post('/api/courts/facilities')
        .set('Authorization', `Bearer ${clubToken}`)
        .send(facilityData)
        .expect(201);

      expect(response.body.data.name).toBe('Test Courts');
      expect(response.body.data.totalCourts).toBe(4);
    });
  });

  describe('Court Booking', () => {
    it('should book available court', async () => {
      const bookingData = {
        courtId: 'court-id',
        bookingDate: '2024-12-01',
        startTime: '10:00',
        endTime: '12:00',
        maxParticipants: 4
      };

      const response = await request(app)
        .post('/api/courts/bookings')
        .set('Authorization', `Bearer ${playerToken}`)
        .send(bookingData)
        .expect(201);

      expect(response.body.success).toBe(true);
    });

    it('should prevent double booking', async () => {
      // First booking
      await request(app)
        .post('/api/courts/bookings')
        .set('Authorization', `Bearer ${playerToken}`)
        .send(bookingData);

      // Second booking should fail
      await request(app)
        .post('/api/courts/bookings')
        .set('Authorization', `Bearer ${player2Token}`)
        .send(bookingData)
        .expect(400);
    });
  });

  describe('Court Availability', () => {
    it('should return available courts for time slot', async () => {
      const response = await request(app)
        .get(`/api/courts/facilities/${facilityId}/availability`)
        .query({
          date: '2024-12-01',
          startTime: '14:00',
          endTime: '16:00'
        })
        .expect(200);

      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('Facility Analytics', () => {
    it('should return booking analytics for facility owner', async () => {
      const response = await request(app)
        .get(`/api/courts/facilities/${facilityId}/analytics`)
        .set('Authorization', `Bearer ${facilityOwnerToken}`)
        .query({
          startDate: '2024-11-01',
          endDate: '2024-11-30'
        })
        .expect(200);

      expect(response.body.data.totalBookings).toBeDefined();
      expect(response.body.data.totalRevenue).toBeDefined();
    });
  });
});
```

## Implementation Priority
1. **CRITICAL**: Database schema and models (Phase 1)
2. **CRITICAL**: Court service layer (Phase 2)
3. **HIGH**: Court controllers and API endpoints (Phase 3)
4. **HIGH**: Court search and booking UI (Phase 4.1-4.2)
5. **MEDIUM**: Analytics and reporting features
6. **MEDIUM**: Maintenance scheduling system
7. **LOW**: Comprehensive testing (Phase 5)

## Expected Results
After implementation:
- Complete court facility management system
- Real-time booking availability and reservations
- Dynamic pricing based on time and demand
- Maintenance scheduling and tracking
- Revenue analytics for facility owners
- Review and rating system for courts
- Integration with existing player finder system
- Mobile-responsive court booking interface

## Files to Create/Modify
- `backend/src/models/CourtFacility.ts`
- `backend/src/models/Court.ts`
- `backend/src/models/CourtBooking.ts`
- `backend/src/models/MaintenanceRecord.ts`
- `backend/src/models/CourtReview.ts`
- `backend/src/services/courtService.ts`
- `backend/src/controllers/courtController.ts`
- `backend/src/routes/courtRoutes.ts`
- `frontend/src/components/courts/CourtSearch.tsx`
- `frontend/src/components/courts/CourtBookingModal.tsx`
- `frontend/src/components/courts/FacilityManagement.tsx`
- `frontend/src/pages/CourtManagementPage.tsx`
- `frontend/src/store/courtSlice.ts`