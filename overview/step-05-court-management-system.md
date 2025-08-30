# Step 5: Court Management and Reservation System

## Overview
This step implements a comprehensive court management system for clubs and partners, including court registration, availability scheduling, reservation system, payment processing for court rentals, and visual calendar interface. The system handles court availability, booking conflicts, pricing, and revenue tracking.
Don't use any mockup data for frontend.
Do use only database data from backend.
Before rendering a page, all required data for the page should be prepared from backend through API endpoint to store on Redux.
For each page, you must accurately determine whether the functionalities of all dynamic elements, including buttons, are correctly integrated with the backend and accurately reflected in Redux to ensure real-time updates.
There are already data seeded to test in database .
You need to test with only this database seeded data from backend.
Don't use any mockup, simulation or random data for frontend.

## Objectives
- Create court registration system for clubs and partners
- Build visual calendar interface for court availability
- Implement reservation system with conflict detection
- Add payment processing for court rentals
- Create revenue tracking and reporting for court owners
- Build court search and filtering system
- Implement maintenance scheduling and incident reporting

## Court Management Features by Role

### Clubs with Premium Plan
- Register multiple courts with details and photos
- Set availability schedules and pricing
- Manage reservations and payments
- Track court usage and revenue
- Schedule maintenance and repairs
- Handle incident reports

### Partners (All have Premium)
- Same features as premium clubs
- Business-focused revenue analytics
- Customer management tools
- Marketing integration options

### Players
- Search and find courts by location, availability, price
- View court details, photos, amenities
- Make reservations and payments
- View booking history
- Rate and review courts

## Backend Development Tasks

### 1. Court Management Controllers
**Files to Create:**
- `src/controllers/courtController.ts` - Court CRUD operations
- `src/controllers/reservationController.ts` - Reservation management
- `src/controllers/availabilityController.ts` - Schedule management
- `src/services/courtService.ts` - Court business logic
- `src/services/reservationService.ts` - Reservation logic
- `src/services/availabilityService.ts` - Availability calculations

**Court Management Methods:**
```typescript
// Court CRUD
createCourt(courtData: CourtData): Promise<Court>
updateCourt(courtId: number, updates: Partial<CourtData>): Promise<Court>
deleteCourt(courtId: number): Promise<void>
getCourt(courtId: number): Promise<Court>
getCourtsByOwner(ownerId: number, ownerType: string): Promise<Court[]>

// Court Search
searchCourts(filters: CourtSearchFilters): Promise<Court[]>
getCourtsNearLocation(lat: number, lng: number, radius: number): Promise<Court[]>
getAvailableCourts(date: string, startTime: string, endTime: string): Promise<Court[]>
```

### 2. Reservation System
**Files to Create:**
- `src/services/reservationService.ts` - Reservation business logic
- `src/utils/conflictDetection.ts` - Booking conflict detection
- `src/services/paymentService.ts` - Court rental payments

**Reservation Methods:**
```typescript
// Reservation Management
createReservation(reservationData: ReservationData): Promise<Reservation>
checkAvailability(courtId: number, date: string, startTime: string, endTime: string): Promise<boolean>
detectConflicts(courtId: number, date: string, startTime: string, endTime: string): Promise<Conflict[]>
cancelReservation(reservationId: number): Promise<void>
processReservationPayment(reservationId: number, paymentData: PaymentData): Promise<Payment>
```

### 3. Availability Management
**Files to Create:**
- `src/services/scheduleService.ts` - Court schedule management
- `src/utils/timeSlotGenerator.ts` - Generate available time slots

**Schedule Methods:**
```typescript
// Schedule Management
setCourtSchedule(courtId: number, schedule: WeeklySchedule): Promise<void>
getAvailableSlots(courtId: number, date: string): Promise<TimeSlot[]>
blockTimeSlots(courtId: number, date: string, reason: string): Promise<void>
updateOperatingHours(courtId: number, hours: OperatingHours): Promise<void>
```

### 4. Revenue and Analytics
**Files to Create:**
- `src/services/revenueService.ts` - Revenue calculations
- `src/services/courtAnalyticsService.ts` - Usage analytics

**Analytics Methods:**
```typescript
// Revenue Tracking
getCourtRevenue(courtId: number, startDate: string, endDate: string): Promise<Revenue>
getOwnerRevenue(ownerId: number, ownerType: string): Promise<Revenue>
generateRevenueReport(ownerId: number, period: string): Promise<Report>

// Usage Analytics
getCourtUsageStats(courtId: number, period: string): Promise<UsageStats>
getPopularTimeSlots(courtId: number): Promise<TimeSlotStats[]>
getBookingTrends(ownerId: number): Promise<TrendData>
```

### 5. API Endpoints
```
Court Management Endpoints:
POST /api/courts - Create new court
GET /api/courts/:id - Get court details
PUT /api/courts/:id - Update court
DELETE /api/courts/:id - Delete court
GET /api/courts/owner/:id - Get courts by owner
POST /api/courts/:id/images - Upload court images

Court Search Endpoints:
GET /api/courts/search - Search courts with filters
GET /api/courts/nearby - Find courts near location
GET /api/courts/available - Find available courts

Reservation Endpoints:
POST /api/reservations - Create reservation
GET /api/reservations/user/:id - User reservations
GET /api/reservations/court/:id - Court reservations
PUT /api/reservations/:id - Update reservation
DELETE /api/reservations/:id - Cancel reservation
POST /api/reservations/:id/payment - Process payment

Schedule Management:
GET /api/courts/:id/availability - Get court availability
POST /api/courts/:id/schedule - Set court schedule
GET /api/courts/:id/slots - Get available time slots
POST /api/courts/:id/block - Block time slots

Revenue and Analytics:
GET /api/analytics/court/:id/revenue - Court revenue
GET /api/analytics/owner/:id/revenue - Owner revenue  
GET /api/analytics/court/:id/usage - Usage statistics
GET /api/reports/revenue/:ownerId - Revenue reports
```

## Frontend Development Tasks

### 1. Court Management Components
**Files to Create:**
- `src/components/courts/CourtForm.tsx` - Court registration/editing form
- `src/components/courts/CourtCard.tsx` - Court display card
- `src/components/courts/CourtList.tsx` - List of courts
- `src/components/courts/CourtDetails.tsx` - Detailed court view
- `src/components/courts/CourtGallery.tsx` - Court photos gallery
- `src/components/courts/CourtMap.tsx` - Court location map

### 2. Schedule Management Components
**Files to Create:**
- `src/components/schedule/ScheduleEditor.tsx` - Edit court schedule
- `src/components/schedule/WeeklySchedule.tsx` - Weekly schedule view
- `src/components/schedule/TimeSlotGrid.tsx` - Time slot visual grid
- `src/components/schedule/AvailabilityCalendar.tsx` - Calendar view
- `src/components/schedule/BlockTimeModal.tsx` - Block time slots

### 3. Reservation Components
**Files to Create:**
- `src/components/reservations/ReservationForm.tsx` - Make reservation
- `src/components/reservations/ReservationCalendar.tsx` - Visual calendar
- `src/components/reservations/ReservationCard.tsx` - Reservation display
- `src/components/reservations/ReservationHistory.tsx` - Booking history
- `src/components/reservations/CancelReservation.tsx` - Cancellation form

### 4. Search and Filter Components
**Files to Create:**
- `src/components/search/CourtSearch.tsx` - Court search interface
- `src/components/search/CourtFilters.tsx` - Advanced filters
- `src/components/search/LocationSearch.tsx` - Location-based search
- `src/components/search/PriceFilter.tsx` - Price range filter
- `src/components/search/AmenityFilter.tsx` - Amenity selection

### 5. Analytics Components
**Files to Create:**
- `src/components/analytics/RevenueChart.tsx` - Revenue visualization
- `src/components/analytics/UsageChart.tsx` - Usage statistics
- `src/components/analytics/BookingTrends.tsx` - Booking trend charts
- `src/components/analytics/RevenueReport.tsx` - Revenue report display

### 6. Pages
**Files to Create:**
- `src/pages/courts/CourtsPage.tsx` - Court search and browse
- `src/pages/courts/CourtDetailsPage.tsx` - Individual court details
- `src/pages/courts/ManageCourtsPage.tsx` - Owner court management
- `src/pages/courts/AddCourtPage.tsx` - Add new court
- `src/pages/reservations/ReservationsPage.tsx` - User reservations
- `src/pages/reservations/MakeReservationPage.tsx` - Booking interface

### 7. Redux State Management
**Files to Create:**
- `src/store/courtsSlice.ts` - Court state management
- `src/store/reservationsSlice.ts` - Reservation state
- `src/store/scheduleSlice.ts` - Schedule state
- `src/store/searchSlice.ts` - Search filters state

## Type Definitions

### Backend Types
```typescript
// types/court.ts
export interface Court {
  id: number;
  name: string;
  description: string;
  surfaceType: SurfaceType;
  ownerType: 'club' | 'partner';
  ownerId: number;
  stateId: number;
  address: string;
  latitude: number;
  longitude: number;
  amenities: string[];
  hourlyRate: number;
  images: string[];
  isActive: boolean;
  operatingHours: OperatingHours;
}

export interface Reservation {
  id: number;
  courtId: number;
  userId: number;
  reservationDate: string;
  startTime: string;
  endTime: string;
  totalCost: number;
  status: ReservationStatus;
  paymentId?: number;
  notes?: string;
}

export interface WeeklySchedule {
  [dayOfWeek: number]: DaySchedule;
}

export interface DaySchedule {
  isAvailable: boolean;
  startTime: string;
  endTime: string;
  specialRates?: TimeBasedRate[];
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  price: number;
  isBlocked: boolean;
  blockReason?: string;
}
```

### Frontend Types
```typescript
// types/court.ts
export interface CourtState {
  courts: Court[];
  selectedCourt: Court | null;
  isLoading: boolean;
  error: string | null;
  searchFilters: CourtSearchFilters;
  userLocation: Location | null;
}

export interface ReservationState {
  reservations: Reservation[];
  currentReservation: Partial<Reservation> | null;
  selectedSlots: TimeSlot[];
  isProcessing: boolean;
  error: string | null;
}

export interface CourtSearchFilters {
  location?: string;
  radius?: number;
  priceRange?: [number, number];
  amenities?: string[];
  surfaceType?: SurfaceType;
  date?: string;
  timeRange?: [string, string];
}
```

## Court Registration Form Specifications

### Basic Court Information
**Fields:**
- Court Name (text, required)
- Description (textarea, required)
- Surface Type (select: Indoor, Outdoor, Concrete, Clay, Artificial Grass)
- Address (text with autocomplete, required)
- Location (map picker for coordinates)

### Amenities and Features
**Checkboxes:**
- Parking Available
- Restrooms
- Changing Rooms
- Equipment Rental
- Pro Shop
- Lighting (Night Play)
- Air Conditioning (Indoor)
- Spectator Seating
- Food/Beverages
- Wi-Fi

### Pricing and Schedule
**Fields:**
- Base Hourly Rate (number, required)
- Peak Hours Rate (optional)
- Weekend Rate (optional)
- Operating Hours (time pickers for each day)
- Seasonal Availability
- Special Holiday Rates

### Photos and Media
**Features:**
- Multiple image upload (max 10 photos)
- Image cropping and optimization
- Court layout diagram (optional)
- 360° virtual tour (optional)

## Reservation Calendar Interface

### Visual Calendar Layout
```
┌─────────────────────────────────────────────────────┐
│ << March 2024 >>                    Today   Week    │
├─────────────────────────────────────────────────────┤
│ Mo  Tu  We  Th  Fr  Sa  Su                          │
│  1   2   3   4   5   6   7                          │
│  8   9  10  11  12  13  14                          │
│ 15  16  17 [18] 19  20  21  ← Selected              │
│ 22  23  24  25  26  27  28                          │
│ 29  30  31                                          │
├─────────────────────────────────────────────────────┤
│ Time Slots for March 18, 2024                       │
│ ┌──────┬──────────────────────────────────────────┐ │
│ │ 6:00 │ Available - $50/hr                       │ │
│ │ 7:00 │ Available - $50/hr                       │ │
│ │ 8:00 │ [BOOKED] - Reserved by Juan P.           │ │
│ │ 9:00 │ [BOOKED] - Reserved by Maria G.          │ │
│ │10:00 │ Available - $60/hr (Peak)                │ │
│ │11:00 │ Available - $60/hr (Peak)                │ │
│ │12:00 │ [BLOCKED] - Maintenance                  │ │
│ └──────┴──────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

### Mobile Calendar Interface
```
┌─────────────────────┐
│ < March 18, 2024 >  │
├─────────────────────┤
│ Available Times:    │
│                     │
│ ┌─────────────────┐ │
│ │ 6:00 AM $50/hr  │ │
│ │ 7:00 AM $50/hr  │ │
│ │ 10:00AM $60/hr  │ │
│ │ 11:00AM $60/hr  │ │
│ └─────────────────┘ │
│                     │
│ [Book Selected]     │
└─────────────────────┘
```

## Search and Filter System

### Court Search Interface
```typescript
// Search parameters
interface CourtSearchParams {
  query?: string;           // Court name or location
  latitude?: number;        // User location
  longitude?: number;       
  radius?: number;          // Search radius in km
  date?: string;            // Availability date
  startTime?: string;       // Start time filter
  endTime?: string;         // End time filter
  minPrice?: number;        // Price range
  maxPrice?: number;
  amenities?: string[];     // Required amenities
  surfaceType?: string;     // Court surface
  sortBy?: 'distance' | 'price' | 'rating';
  sortOrder?: 'asc' | 'desc';
}
```

### Filter Components
- **Location Filter**: Map-based or address search with radius
- **Date/Time Filter**: Date picker with time range selector
- **Price Filter**: Range slider for hourly rates
- **Amenity Filter**: Checkbox list of court features
- **Surface Filter**: Radio buttons for surface types
- **Availability Filter**: Only show courts with open slots

## Conflict Detection System

### Booking Conflict Rules
1. **Time Overlaps**: New booking cannot overlap existing reservations
2. **Maintenance Blocks**: Cannot book during scheduled maintenance
3. **Operating Hours**: Must be within court operating hours
4. **Advance Booking**: Cannot book too far in advance (configurable)
5. **Minimum Duration**: Reservations must meet minimum time requirements

### Conflict Detection Algorithm
```typescript
const detectConflicts = (
  courtId: number,
  date: string,
  startTime: string,
  endTime: string
): Conflict[] => {
  const conflicts: Conflict[] = [];
  
  // Check existing reservations
  const existingReservations = getReservations(courtId, date);
  existingReservations.forEach(reservation => {
    if (timesOverlap(startTime, endTime, reservation.startTime, reservation.endTime)) {
      conflicts.push({
        type: 'reservation',
        message: `Court already reserved ${reservation.startTime}-${reservation.endTime}`,
        conflictingReservation: reservation
      });
    }
  });
  
  // Check maintenance blocks
  const maintenanceBlocks = getMaintenanceBlocks(courtId, date);
  // ... additional checks
  
  return conflicts;
};
```

## Payment Integration for Court Rentals

### Reservation Payment Flow
1. **Select Court and Time**: User chooses court and time slots
2. **Calculate Total**: System calculates total cost including taxes
3. **Payment Form**: Stripe Elements for secure payment
4. **Confirmation**: Booking confirmed after successful payment
5. **Notifications**: Email confirmations to user and court owner

### Pricing Calculations
```typescript
const calculateReservationCost = (
  court: Court,
  date: string,
  startTime: string,
  endTime: string
): PricingBreakdown => {
  const duration = calculateDuration(startTime, endTime);
  const baseRate = court.hourlyRate;
  const peakMultiplier = isPeakTime(date, startTime) ? 1.2 : 1;
  const weekendMultiplier = isWeekend(date) ? 1.1 : 1;
  
  const subtotal = duration * baseRate * peakMultiplier * weekendMultiplier;
  const tax = subtotal * 0.16; // 16% IVA in Mexico
  const total = subtotal + tax;
  
  return { subtotal, tax, total, duration };
};
```

## Revenue Tracking and Analytics

### Revenue Reports for Court Owners
- **Daily Revenue**: Income per day with breakdown by court
- **Monthly Trends**: Revenue trends over months
- **Peak Analysis**: Most profitable times and days
- **Occupancy Rates**: Court utilization percentages
- **Customer Analytics**: Top customers and booking patterns

### Analytics Dashboard Components
```typescript
// Revenue metrics
interface RevenueMetrics {
  totalRevenue: number;
  totalBookings: number;
  averageBookingValue: number;
  occupancyRate: number;
  topPerformingCourts: Court[];
  peakHours: TimeSlot[];
  customerRetentionRate: number;
}
```

## Testing Requirements

### Backend Testing
```bash
# Test court creation
curl -X POST http://localhost:5000/api/courts \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Court 1","surfaceType":"outdoor",...}'

# Test court search
curl -X GET "http://localhost:5000/api/courts/search?location=Mexico City&radius=10" \
  -H "Authorization: Bearer <token>"

# Test reservation
curl -X POST http://localhost:5000/api/reservations \
  -H "Authorization: Bearer <token>" \
  -d '{"courtId":1,"date":"2024-03-18","startTime":"10:00",...}'
```

### Frontend Testing
- Test court registration form
- Verify calendar interface functionality
- Test reservation booking flow
- Verify payment processing
- Test search and filtering
- Verify mobile responsiveness

### Integration Testing
- Complete court registration to booking flow
- Payment processing for reservations
- Conflict detection accuracy
- Email notification delivery
- Revenue calculation accuracy

## Success Criteria
✅ Court registration system works for clubs and partners
✅ Visual calendar shows accurate availability
✅ Reservation booking handles conflicts correctly
✅ Payment processing works for court rentals
✅ Search and filtering return accurate results
✅ Location-based search functions properly
✅ Revenue analytics display correctly
✅ Mobile interface is fully functional
✅ Email notifications are sent properly
✅ Court owners can manage their facilities
✅ Maintenance scheduling works
✅ Pricing calculations are accurate

## Commands to Test
```bash
# Test court creation
npm run test:courts:create

# Test reservation system
npm run test:reservations

# Test payment processing
npm run test:court-payments

# Start development server
docker-compose up -d

# Run comprehensive tests
npm run test:court-system
```

## Next Steps
After completing this step, you should have:
- Complete court management system
- Reservation and booking functionality
- Payment processing for court rentals
- Search and discovery features
- Revenue tracking and analytics
- Mobile-responsive interface

The next step will focus on tournament management system for organizing competitions at various levels.