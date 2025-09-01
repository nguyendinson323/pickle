# Test-5: Court Management System Integration Testing

## Purpose
Test complete Court Management and Reservation system integration using only seeded database data. Verify court registration, booking system, availability management, payment processing, and role-based access work seamlessly between frontend and backend.

## Critical Testing Requirements
1. **Only seeded database data** - No mockups, simulations, or random data
2. **Data type verification** - All API requests/responses must match TypeScript interfaces
3. **Immediate error resolution** - Analyze code structure, fix immediately, and retest
4. **UI element accessibility** - All elements (calendars, forms, booking interfaces) must be visually present and functional
5. **Complete integration flow** - Frontend → Button → API → Backend → Controller → Response → Frontend → Redux → UI Update

## Setup
```bash
# Start servers and ensure seeded data including courts and facilities
cd backend && npm run seed && npm run dev &
cd frontend && npm run dev &

# Verify court and facility data is seeded
cd backend && npm run seed:courts  # If separate seeder exists
```

## Test Credentials (All password: `a`)
- Club Owner: `club1@federacionpickleball.mx`
- Partner/Facility: `partner1@federacionpickleball.mx`
- Regular Player: `player1@federacionpickleball.mx`
- Admin: `admin@federacionpickleball.mx`

---

## 1. Court Facility Management Tests

### Test 1.1: Create New Court Facility (Club Owner)
**Frontend Page**: `/club/courts` → Add Facility or `/dashboard` → Court Management

**Steps**:
1. Login as `club1@federacionpickleball.mx` / `a`
2. Navigate to court management section
3. Click "Add New Facility" or similar button
4. Fill facility registration form
5. Submit facility details

**Expected Flow**:
- **Frontend Function**: CreateFacilityModal or CreateFacilityPage component
- **Form Validation**: Client-side validation for required fields
- **API Request**: POST `/api/courts/facilities` with facility data
- **Backend Route**: `router.post('/facilities', authenticate, authorizeClub, courtController.createFacility)`
- **Controller**: `courtController.createFacility` validates and creates CourtFacility record
- **Database Operations**: Creates new facility with owner association
- **Response**: `{ success: true, facility: FacilityData }`
- **Frontend Receive**: Facility creation confirmation
- **Data Type Verification**: Response matches `CreateFacilityResponse` interface
- **Update Redux**: New facility added to user's facilities list
- **UI Update**: Success notification and redirect to facility details

**Success Criteria**:
- Club can create facility with complete information
- Form validation prevents incomplete submissions
- Facility properly associated with club owner
- **UI Elements Present**: Full facility form with address, amenities, operating hours
- **Role Authorization**: Only clubs/partners can create facilities
- **Data Persistence**: Facility data saved correctly to database

**Error Resolution Process**:
1. If creation fails, check club authorization and permissions
2. Verify form validation on both frontend and backend
3. Check database constraints and foreign key relationships
4. Fix immediately and retest

### Test 1.2: View and Edit Facility Details
**Frontend Page**: `/club/courts/{facilityId}` or facility management dashboard

**Steps**:
1. Login as facility owner
2. Navigate to facility details page
3. View facility information
4. Edit facility details (operating hours, amenities, etc.)
5. Save changes

**Expected Flow**:
- **Frontend Function**: FacilityDetailsPage component loads facility data
- **API Request**: GET `/api/courts/facilities/{id}` with Authorization header
- **Backend Route**: `router.get('/facilities/:id', authenticate, courtController.getFacility)`
- **Controller**: `courtController.getFacility` returns facility with all details
- **Response**: `{ facility: FacilityData, courts: Court[], bookings: BookingData[] }`
- **Frontend Receive**: Complete facility information loaded
- **Data Type Verification**: Response matches `FacilityDetailsResponse` interface
- **Update Redux**: Facility details stored in court slice
- **UI Update**: Facility page displays with editable sections

**Success Criteria**:
- Facility details display accurately from seeded data
- Owner can edit facility information
- Changes save and persist in database
- **UI Elements Present**: Facility info cards, edit forms, court listings
- **Data Accuracy**: All facility data matches seeded information
- **Edit Functionality**: In-place editing or modal forms work correctly

---

## 2. Individual Court Management Tests

### Test 2.1: Add Courts to Facility
**Frontend Page**: `/club/courts/{facilityId}/courts` → Add Court

**Steps**:
1. Login as facility owner
2. Navigate to facility courts section
3. Click "Add Court" button
4. Fill court details form
5. Submit new court

**Expected Flow**:
- **Frontend Function**: AddCourtModal with court specification form
- **Form Fields**: Court number, surface type, lighting, net type, dimensions
- **API Request**: POST `/api/courts/facilities/{facilityId}/courts` with court data
- **Backend Route**: `router.post('/facilities/:facilityId/courts', authenticate, courtController.addCourt)`
- **Controller**: `courtController.addCourt` creates Court record linked to facility
- **Database Operations**: New court associated with facility
- **Response**: `{ success: true, court: CourtData }`
- **Frontend Receive**: Court creation confirmation
- **Data Type Verification**: Response matches `CreateCourtResponse` interface
- **Update Redux**: New court added to facility's courts list
- **UI Update**: Court appears in facility's court list

**Success Criteria**:
- Courts can be added with detailed specifications
- Court numbers/names are unique within facility
- Courts properly linked to parent facility
- **UI Elements Present**: Court form with all specification fields
- **Data Validation**: Court specifications validated properly
- **List Updates**: New courts appear immediately in facility view

### Test 2.2: Set Court Pricing and Availability
**Frontend Page**: `/club/courts/{courtId}/settings` or court management interface

**Steps**:
1. Navigate to individual court settings
2. Set operating hours and availability
3. Configure pricing structure
4. Set booking policies
5. Save configuration

**Expected Flow**:
- **Frontend Function**: CourtSettingsPage with pricing and schedule forms
- **Pricing Configuration**: Peak/off-peak rates, hourly pricing, special rates
- **Schedule Setup**: Weekly schedule, blocked times, maintenance windows
- **API Request**: PUT `/api/courts/{courtId}/settings` with configuration data
- **Backend Route**: `router.put('/:courtId/settings', authenticate, courtController.updateCourtSettings)`
- **Controller**: `courtController.updateCourtSettings` saves court configuration
- **Response**: `{ success: true, court: UpdatedCourtData }`
- **Data Type Verification**: Pricing and schedule data properly structured
- **Update Redux**: Court settings updated in state
- **UI Update**: Settings form reflects saved configuration

**Success Criteria**:
- Court pricing configurable with different rate structures
- Operating hours and availability properly set
- Booking policies (cancellation, advance booking) configured
- **UI Elements Present**: Pricing forms, schedule calendar, policy settings
- **Business Logic**: Peak/off-peak pricing calculations work
- **Schedule Management**: Availability rules properly applied

---

## 3. Court Booking System Tests

### Test 3.1: Search Available Courts (Player)
**Frontend Page**: `/courts` or `/book-court`

**Steps**:
1. Login as `player1@federacionpickleball.mx` / `a`
2. Navigate to court booking section
3. Search for courts by location and time
4. View available courts and details

**Expected Flow**:
- **Frontend Function**: CourtSearchPage with search filters
- **Search Filters**: Location, date, time range, court type, price range
- **API Request**: GET `/api/courts/search` with search parameters
- **Backend Route**: `router.get('/search', courtController.searchCourts)`
- **Controller**: `courtController.searchCourts` finds available courts matching criteria
- **Database Query**: Complex query joining facilities, courts, and checking availability
- **Response**: `{ courts: CourtSearchResult[], total: number, filters: FilterOptions }`
- **Frontend Receive**: Available courts list with details
- **Data Type Verification**: Search results match `CourtSearchResponse` interface
- **Update Redux**: Search results and filters stored
- **UI Update**: Court cards display with availability and pricing

**Success Criteria**:
- Court search returns accurate results from seeded data
- Search filters work correctly (location, time, price)
- Available courts show real-time availability
- **UI Elements Present**: Search form, filters, court result cards
- **Search Accuracy**: Results match search criteria exactly
- **Real-time Data**: Availability reflects current booking status

### Test 3.2: Make Court Reservation (Player)
**Frontend Page**: `/courts/{courtId}/book` or court booking interface

**Steps**:
1. Select specific court and time slot
2. Fill booking form with player details
3. Review booking summary and pricing
4. Complete reservation (with or without payment)
5. Receive booking confirmation

**Expected Flow**:
- **Frontend Function**: CourtBookingPage with time slot selection
- **Time Slot Selection**: Available slots displayed in calendar/grid format
- **Booking Form**: Player information, duration, special requests
- **API Request**: POST `/api/courts/{courtId}/book` with booking data
- **Backend Route**: `router.post('/:courtId/book', authenticate, reservationController.createBooking)`
- **Controller**: `reservationController.createBooking` validates availability and creates booking
- **Conflict Detection**: Check for booking conflicts before confirming
- **Database Operations**: Create reservation record with payment tracking
- **Response**: `{ success: true, booking: BookingData, paymentRequired: boolean }`
- **Frontend Receive**: Booking confirmation with payment details
- **Data Type Verification**: Booking response includes all required fields
- **Update Redux**: User's bookings updated with new reservation
- **UI Update**: Confirmation page with booking details and next steps

**Success Criteria**:
- Booking process completes without conflicts
- Pricing calculated correctly based on court settings
- Confirmation includes all booking details
- **UI Elements Present**: Time picker, booking form, confirmation display
- **Conflict Prevention**: Double-booking prevented by backend validation
- **Payment Integration**: Payment process triggers when required

---

## 4. Court Availability Management Tests

### Test 4.1: View Court Calendar (Facility Owner)
**Frontend Page**: `/club/courts/{courtId}/calendar` or management dashboard

**Steps**:
1. Login as facility owner
2. Navigate to court calendar view
3. View daily/weekly court schedule
4. Check booking details and availability

**Expected Flow**:
- **Frontend Function**: CourtCalendarPage with calendar component
- **Calendar Display**: Week/month view showing bookings and availability
- **API Request**: GET `/api/courts/{courtId}/calendar` with date range parameters
- **Backend Route**: `router.get('/:courtId/calendar', authenticate, courtController.getCourtCalendar)`
- **Controller**: `courtController.getCourtCalendar` returns bookings and availability for date range
- **Response**: `{ bookings: BookingData[], availability: AvailabilitySlot[], revenue: RevenueData }`
- **Frontend Receive**: Calendar data with bookings and open slots
- **Data Type Verification**: Calendar data properly structured for display
- **Update Redux**: Calendar data cached for performance
- **UI Update**: Visual calendar showing bookings, blocked times, and availability

**Success Criteria**:
- Calendar displays accurate booking information from seeded data
- Different booking statuses clearly differentiated
- Revenue information calculated correctly
- **UI Elements Present**: Interactive calendar, booking details, legend
- **Data Visualization**: Clear visual representation of court usage
- **Real-time Updates**: Calendar reflects current booking status

### Test 4.2: Block Court Time for Maintenance
**Frontend Page**: Court management interface

**Steps**:
1. Login as facility owner
2. Select court and time period
3. Create maintenance block
4. Specify maintenance reason and duration
5. Save maintenance schedule

**Expected Flow**:
- **Frontend Function**: MaintenanceScheduling component
- **Time Selection**: Select specific date/time range for maintenance
- **API Request**: POST `/api/courts/{courtId}/maintenance` with maintenance data
- **Backend Route**: `router.post('/:courtId/maintenance', authenticate, courtController.scheduleMaintenance)`
- **Controller**: `courtController.scheduleMaintenance` blocks time and creates maintenance record
- **Availability Update**: Blocked times excluded from booking availability
- **Response**: `{ success: true, maintenanceBlock: MaintenanceData }`
- **Frontend Receive**: Maintenance block confirmation
- **Update Redux**: Court availability updated to reflect blocked times
- **UI Update**: Calendar shows maintenance blocks differently from bookings

**Success Criteria**:
- Maintenance blocks prevent new bookings during specified times
- Existing bookings handled according to policy
- Maintenance schedule visible in calendar
- **UI Elements Present**: Maintenance scheduling form, calendar blocks
- **Booking Prevention**: Blocked times unavailable for reservations
- **Schedule Management**: Maintenance periods properly tracked

---

## 5. Payment Processing Tests

### Test 5.1: Process Court Rental Payment
**Frontend Page**: Court booking checkout or payment interface

**Steps**:
1. Complete court booking with payment required
2. Enter payment information
3. Process payment through system
4. Verify booking confirmation and payment receipt

**Expected Flow**:
- **Frontend Function**: PaymentPage with Stripe integration
- **Payment Form**: Credit card details, billing information
- **API Request**: POST `/api/payments/court-booking` with payment data
- **Backend Route**: `router.post('/court-booking', authenticate, paymentController.processCourtPayment)`
- **Controller**: `paymentController.processCourtPayment` integrates with Stripe
- **Stripe Integration**: Payment processed through Stripe API
- **Database Update**: Payment record created, booking status updated
- **Response**: `{ success: true, payment: PaymentData, booking: ConfirmedBooking }`
- **Frontend Receive**: Payment confirmation
- **Data Type Verification**: Payment response includes transaction details
- **Update Redux**: Booking status updated to confirmed
- **UI Update**: Payment success page with booking details

**Success Criteria**:
- Payment processing integrates correctly with Stripe
- Booking confirmed only after successful payment
- Payment records properly stored for accounting
- **UI Elements Present**: Payment form, processing indicators, confirmation
- **Transaction Security**: Payment data handled securely
- **Error Handling**: Payment failures handled gracefully

### Test 5.2: Refund Cancellation Payment
**Frontend Page**: User bookings or cancellation interface

**Steps**:
1. Login as player with confirmed booking
2. Cancel booking within refund period
3. Process refund according to cancellation policy
4. Verify refund processing

**Expected Flow**:
- **Frontend Function**: BookingCancellation component
- **Cancellation Form**: Reason for cancellation, refund request
- **API Request**: POST `/api/bookings/{bookingId}/cancel` with cancellation data
- **Backend Route**: `router.post('/:bookingId/cancel', authenticate, reservationController.cancelBooking)`
- **Controller**: `reservationController.cancelBooking` processes cancellation and refund
- **Policy Check**: Verify cancellation within allowed timeframe
- **Refund Processing**: Stripe refund API called if applicable
- **Response**: `{ success: true, cancellation: CancellationData, refund: RefundData }`
- **Frontend Receive**: Cancellation confirmation
- **Update Redux**: Booking status updated to cancelled
- **UI Update**: Cancellation confirmation with refund details

**Success Criteria**:
- Cancellation policy properly enforced
- Refunds processed according to facility rules
- Both player and facility notified of cancellation
- **UI Elements Present**: Cancellation form, policy display, confirmation
- **Policy Enforcement**: Refund amounts calculated per facility policy
- **Status Updates**: All parties notified of cancellation status

---

## 6. Revenue Analytics and Reporting Tests

### Test 6.1: Facility Revenue Dashboard
**Frontend Page**: `/club/courts/analytics` or revenue dashboard

**Steps**:
1. Login as facility owner
2. Navigate to revenue analytics
3. View booking statistics and revenue reports
4. Filter reports by date range and court

**Expected Flow**:
- **Frontend Function**: RevenueAnalyticsPage with charts and statistics
- **API Request**: GET `/api/courts/analytics/revenue` with date range parameters
- **Backend Route**: `router.get('/analytics/revenue', authenticate, analyticsController.getRevenueAnalytics)`
- **Controller**: `analyticsController.getRevenueAnalytics` calculates revenue metrics from booking data
- **Data Aggregation**: Bookings grouped by court, time period, revenue calculations
- **Response**: `{ totalRevenue: number, bookingStats: BookingStats, courtUtilization: UtilizationData }`
- **Frontend Receive**: Analytics data for visualization
- **Data Type Verification**: Analytics data properly structured for charts
- **Update Redux**: Analytics data cached for performance
- **UI Update**: Charts, graphs, and statistics display revenue information

**Success Criteria**:
- Revenue calculations accurate based on seeded booking data
- Court utilization metrics calculated correctly
- Analytics filterable by date range and court
- **UI Elements Present**: Revenue charts, statistics cards, filter controls
- **Data Accuracy**: All calculations match booking records
- **Visualization**: Clear charts showing revenue trends and patterns

### Test 6.2: Export Revenue Reports
**Frontend Page**: Revenue analytics with export functionality

**Steps**:
1. Navigate to revenue analytics
2. Select report parameters (date range, format)
3. Generate and download report
4. Verify report content and formatting

**Expected Flow**:
- **Frontend Function**: ReportExport component with format options
- **Report Options**: PDF, CSV, Excel formats with date range selection
- **API Request**: POST `/api/courts/analytics/export` with export parameters
- **Backend Route**: `router.post('/analytics/export', authenticate, analyticsController.exportReport)`
- **Controller**: `analyticsController.exportReport` generates formatted report
- **Report Generation**: Data formatted into requested format (PDF/CSV/Excel)
- **Response**: File download or download URL
- **Frontend Receive**: Report download initiated
- **File Download**: Report downloaded to user's device
- **Report Content**: Comprehensive revenue and booking data

**Success Criteria**:
- Reports generate in multiple formats correctly
- All revenue and booking data included accurately
- Reports downloadable and properly formatted
- **UI Elements Present**: Export options, format selection, download buttons
- **Report Quality**: Professional formatting and complete data
- **File Handling**: Clean download process without errors

---

## 7. Court Search and Discovery Tests

### Test 7.1: Location-Based Court Search
**Frontend Page**: `/courts` with location search

**Steps**:
1. Search for courts near specific location
2. Use map interface to browse courts
3. Filter by distance, amenities, price
4. View court details and availability

**Expected Flow**:
- **Frontend Function**: CourtMapSearch with interactive map
- **Location Search**: Address or coordinates input for location-based search
- **API Request**: GET `/api/courts/nearby` with location and radius parameters
- **Backend Route**: `router.get('/nearby', courtController.getNearByCourts)`
- **Controller**: `courtController.getNearByCourts` uses geospatial queries to find courts
- **Distance Calculation**: Haversine formula calculates distances from search location
- **Response**: `{ courts: NearbyCourtData[], searchLocation: LocationData, radius: number }`
- **Frontend Receive**: Nearby courts with distance information
- **Map Integration**: Courts displayed on map with markers
- **Update Redux**: Search results and map data stored
- **UI Update**: Map view with court markers and list view

**Success Criteria**:
- Location-based search returns accurate results
- Distance calculations correct for Mexican locations
- Map integration displays courts properly
- **UI Elements Present**: Map component, search controls, court markers
- **Geographic Accuracy**: Court locations accurate on map
- **Search Performance**: Fast search results with proper filtering

### Test 7.2: Advanced Court Filtering
**Frontend Page**: Court search with advanced filters

**Steps**:
1. Apply multiple search filters simultaneously
2. Filter by surface type, amenities, price range
3. Sort results by distance, price, rating
4. Verify filtered results accuracy

**Expected Flow**:
- **Frontend Function**: AdvancedFilters component with multiple filter options
- **Filter Combination**: Multiple filters applied simultaneously
- **API Request**: GET `/api/courts/search` with complex filter parameters
- **Backend Route**: Court search with advanced WHERE clauses
- **Query Optimization**: Efficient database queries with multiple conditions
- **Response**: Filtered court results matching all criteria
- **Result Sorting**: Courts sorted by specified criteria
- **Update Redux**: Filtered results replace previous search results
- **UI Update**: Court list updates to show only matching courts

**Success Criteria**:
- Multiple filters work correctly in combination
- Filter options reflect available court attributes
- Results accurately match all applied filters
- **UI Elements Present**: Filter panels, sort options, result counts
- **Filter Logic**: Correct boolean logic for multiple filter combinations
- **Performance**: Fast filtering even with complex criteria

---

## 8. Court Reviews and Ratings Tests

### Test 8.1: Submit Court Review (Player)
**Frontend Page**: `/courts/{courtId}` after completing booking

**Steps**:
1. Login as player who has used the court
2. Navigate to court details page
3. Submit rating and written review
4. Verify review appears on court page

**Expected Flow**:
- **Frontend Function**: CourtReviewForm component
- **Review Eligibility**: Check if user has completed booking at court
- **API Request**: POST `/api/courts/{courtId}/reviews` with review data
- **Backend Route**: `router.post('/:courtId/reviews', authenticate, courtController.submitReview)`
- **Controller**: `courtController.submitReview` validates and creates review record
- **Validation**: Verify user has booking history at court
- **Database Operations**: Create review, update court average rating
- **Response**: `{ success: true, review: ReviewData, newAverageRating: number }`
- **Frontend Receive**: Review submission confirmation
- **Data Type Verification**: Review response includes rating updates
- **Update Redux**: Court rating and reviews updated
- **UI Update**: Review appears in court reviews section

**Success Criteria**:
- Only users with booking history can review courts
- Reviews update court average rating correctly
- Review content properly validated and stored
- **UI Elements Present**: Review form, rating stars, text area
- **Authorization**: Review permissions properly enforced
- **Rating Calculation**: Average ratings calculated correctly

### Test 8.2: View Court Reviews and Ratings
**Frontend Page**: `/courts/{courtId}` court details page

**Steps**:
1. Navigate to court details page
2. View all reviews and ratings for court
3. Check review filtering and sorting options
4. Verify rating distribution display

**Expected Flow**:
- **Frontend Function**: CourtReviewsSection displays reviews list
- **API Request**: GET `/api/courts/{courtId}/reviews` for court reviews
- **Backend Route**: `router.get('/:courtId/reviews', courtController.getCourtReviews)`
- **Controller**: `courtController.getCourtReviews` returns paginated reviews
- **Response**: `{ reviews: ReviewData[], averageRating: number, ratingDistribution: RatingStats }`
- **Frontend Receive**: All reviews and rating statistics
- **Data Display**: Reviews with user names, ratings, dates, content
- **Update Redux**: Court reviews cached for performance
- **UI Update**: Reviews list with sorting and filtering options

**Success Criteria**:
- All reviews display with accurate rating information
- Rating distribution shows breakdown by star level
- Reviews sortable by date, rating, helpfulness
- **UI Elements Present**: Review cards, rating displays, sort controls
- **Data Integrity**: All review data matches database records
- **User Experience**: Easy to read and navigate review section

---

## 9. Mobile and Responsive Design Tests

### Test 9.1: Mobile Court Booking Experience
**Device**: Mobile browser or responsive design testing

**Steps**:
1. Access court booking system on mobile device
2. Search for courts using mobile interface
3. Complete booking process on mobile
4. Verify all functionality works on small screens

**Expected Flow**:
- **Responsive Design**: All components adapt to mobile screen sizes
- **Touch Interface**: All buttons and forms work with touch input
- **Mobile Navigation**: Easy navigation between booking steps
- **Performance**: Fast loading and smooth interactions

**Success Criteria**:
- Complete booking process works smoothly on mobile
- All UI elements properly sized for touch interaction
- Court search and filtering accessible on mobile
- **Mobile UX**: Intuitive mobile user experience
- **Performance**: Good performance on mobile devices
- **Accessibility**: Mobile accessibility standards met

---

## 10. Integration with Other Systems Tests

### Test 10.1: Player Finder Court Integration
**Prerequisites**: Complete Player Finder system implementation

**Steps**:
1. Use Player Finder to match with nearby players
2. Search for courts near matched players
3. Book court for matched player session
4. Verify integration between systems

**Expected Flow**:
- **System Integration**: Player Finder suggests nearby courts for matches
- **Cross-System Data**: Court availability considered in player matching
- **Booking Integration**: Seamless booking from player finder results
- **Data Consistency**: Consistent court data across both systems

**Success Criteria**:
- Player Finder integration suggests relevant courts
- Court booking accessible from player finder interface
- Data consistency maintained across systems
- **Feature Integration**: Smooth workflow between player finding and court booking
- **Data Sharing**: Proper data sharing between system components

---

## Error Testing Scenarios

### 1. Booking Conflict Prevention
**Test Cases**:
- Double booking attempts on same court/time
- Booking during maintenance windows
- Booking outside operating hours
- Cancellation of non-existent bookings

**Expected Behavior**:
- Clear error messages for booking conflicts
- Alternative time suggestions when conflicts occur
- Proper validation prevents impossible bookings
- Graceful handling of edge cases

### 2. Payment Processing Errors
**Test Cases**:
- Credit card declined scenarios
- Network timeouts during payment
- Partial payment failures
- Refund processing errors

**Expected Behavior**:
- Clear payment error messages for users
- Booking status properly managed during payment failures
- Failed payments don't create confirmed bookings
- Retry mechanisms for temporary payment issues

### 3. Data Validation Errors
**Test Cases**:
- Invalid court configurations
- Impossible scheduling scenarios
- Malformed pricing data
- Invalid facility information

**Expected Behavior**:
- Comprehensive form validation prevents bad data
- Clear error messages guide users to correct issues
- Data integrity maintained despite user errors
- Admin tools available to fix data issues

---

## Performance Testing

### 1. Court Search Performance
**Test Cases**:
- Large facility with many courts
- Peak booking times with high concurrency
- Complex search filters with multiple criteria
- Geographic searches over large areas

**Success Criteria**:
- Search results return within 2-3 seconds
- System handles concurrent booking attempts gracefully
- Database queries optimized for performance
- Map rendering performs well with many court markers

### 2. Booking System Performance
**Test Cases**:
- Multiple simultaneous booking attempts
- High-frequency availability checks
- Peak usage scenarios
- Large booking history queries

**Success Criteria**:
- Booking conflicts detected reliably under load
- Real-time availability updates without performance degradation
- Payment processing completes within acceptable time limits
- Historical data queries remain fast with large datasets

---

## Integration Verification Checklist

For each court management system test:
- [ ] Correct HTTP status codes returned for all API calls
- [ ] Response data matches TypeScript interfaces exactly
- [ ] All data comes from seeded database (verify specific facilities, courts, bookings)
- [ ] Role-based authorization works correctly (club owners, partners, players)
- [ ] Booking conflicts properly prevented and detected
- [ ] Payment processing integrates correctly with Stripe
- [ ] Calendar displays accurate availability and booking information
- [ ] Geographic searches work correctly for Mexican locations
- [ ] Revenue calculations accurate based on booking data
- [ ] UI elements are present, functional, and responsive
- [ ] Error handling provides meaningful user feedback
- [ ] Real-time updates function across all booking scenarios
- [ ] Mobile responsiveness works for all court management features

**Key Requirements Verification**:
1. **Only seeded data used** - Verify by checking specific values from seeded facilities and courts
2. **Data type matching** - All API responses must match defined TypeScript interfaces
3. **UI element accessibility** - All mentioned calendars, forms, booking interfaces must be functional
4. **Complete integration flow** - Each court management action must successfully complete entire frontend→backend→frontend cycle
5. **Role-based access control** - Verify different user types have appropriate access levels
6. **Booking conflict prevention** - Ensure double-booking is impossible through proper backend validation
7. **Payment integration** - Verify Stripe integration works correctly for all payment scenarios
8. **Immediate error resolution** - Any discovered errors must be analyzed, fixed, and retested before proceeding

This test document focuses exclusively on verifying that the complete Court Management system works with seeded database data, provides proper role-based access control, prevents booking conflicts, integrates payment processing correctly, and maintains data integrity across all court management operations.