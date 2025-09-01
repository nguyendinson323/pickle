# Test Workflow Document - Frontend-Backend Integration Testing

## Project: Mexican Pickleball Federation Platform
## Test Focus: Seamless Frontend-Backend Integration with Seeded Database Data

---

## Overview

This document provides a comprehensive test workflow for verifying seamless integration between the frontend and backend systems using **ONLY seeded database data**. No mockups, simulations, or random data should be used during testing.

### Test Flow Pattern
```
Frontend Page → Button Function → API Request → Backend Route → Controller → Response → Frontend Receive → Data Type Verification → Update Redux → (Optional) Page Redirect
```

### Critical Testing Requirements
1. **Data Type Verification**: All API requests and responses must match expected TypeScript interfaces
2. **Immediate Error Resolution**: Any errors discovered during testing must be analyzed, fixed, and retested immediately
3. **Code Structure Analysis**: When errors occur, examine the current codebase to identify root causes
4. **UI Element Accessibility**: All mentioned UI elements must be visually present and functional:
   - Header navigation items must appear in the header
   - Sidebar menu items must appear in the sidebar
   - Page buttons must be visible and clickable on their respective pages
   - Users must be able to actually interact with all described functionality

---

## Pre-Test Setup

### 1. Database Seeding
```bash
# Ensure database is seeded with test data
cd backend
npm run db:seed
```

### 2. Start Development Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### 3. Seeded Test Credentials
**All users have password: `a`**

- **Admin**: admin@federacionpickleball.mx
- **Player 1**: player1@federacionpickleball.mx
- **Player 2**: player2@federacionpickleball.mx
- **Player 3**: player3@federacionpickleball.mx
- **Coach 1**: coach1@federacionpickleball.mx
- **Coach 2**: coach2@federacionpickleball.mx
- **Club 1**: club1@federacionpickleball.mx
- **Club 2**: club2@federacionpickleball.mx
- **Partner 1**: partner1@federacionpickleball.mx
- **Partner 2**: partner2@federacionpickleball.mx

---

## Test Scenarios

### 1. Authentication Flow Testing

#### Test 1.1: Login with Seeded Credentials
**Frontend Page**: `/login`

**Steps**:
1. Navigate to login page
2. Enter seeded credentials: `player1@federacionpickleball.mx` / `a`
3. Click "Login" button

**Expected Flow**:
- **Button Function**: `handleLogin` in LoginForm component
- **API Request**: POST `/api/auth/login` with `{ email: string, password: string }`
- **Backend Route**: `router.post('/login', authController.login)` (auth.ts:9)
- **Controller**: `authController.login` validates credentials, generates JWT
- **Response**: `{ token: string, user: { id: number, email: string, role: UserRole, profile?: any } }`
- **Frontend Receive**: LoginForm receives response
- **Data Type Verification**: Response matches `AuthResponse` interface
- **Update Redux**: `authSlice.loginSuccess` action updates auth state
- **Page Redirect**: Based on user role to appropriate dashboard

**Success Criteria**:
- JWT token stored in localStorage
- Redux auth state updated with user data
- Redirect to role-specific dashboard
- No console errors
- **Data types match TypeScript interfaces**
- **UI Elements Present**: Login form with email/password fields and "Login" button visible
- **Header Navigation**: After login, user menu appears in header
- **Sidebar Menu**: Role-appropriate navigation items appear in sidebar

**Error Resolution Process**:
1. If login fails, check current `authController.login` implementation
2. Verify seeded user credentials in database
3. Check password hashing compatibility
4. Ensure JWT secret configuration
5. Fix immediately and retest

#### Test 1.2: Auto-Login on Page Refresh
**Frontend Page**: Any protected page

**Steps**:
1. After successful login, refresh browser
2. Observe auto-login behavior

**Expected Flow**:
- **Frontend Function**: `checkAuthStatus` in App.tsx useEffect
- **API Request**: GET `/api/auth/profile` (with token in header)
- **Backend Route**: `router.get('/profile', authMiddleware, authController.getProfile)`
- **Controller**: `authController.getProfile` validates token, returns user
- **Response**: User profile data
- **Frontend Receive**: App component receives user data
- **Update Redux**: Auth state maintained/restored
- **No Redirect**: Stay on current protected page

**Success Criteria**:
- User remains logged in after refresh
- Redux state properly restored
- Protected routes accessible

### 2. Profile Management Testing

#### Test 2.1: View Profile Information
**Frontend Page**: `/profile`

**Steps**:
1. Navigate to profile page while logged in as `player1@federacionpickleball.mx`
2. Verify profile data display

**Expected Flow**:
- **Frontend Function**: Component mount triggers profile fetch
- **API Request**: GET `/api/profile/me` with Authorization header
- **Backend Route**: `router.get('/me', authenticate, profileController.getProfile)` (profile.ts:14)
- **Controller**: `profileController.getProfile` queries User + Player models
- **Response**: Complete profile data from seeded database
- **Frontend Receive**: Profile component receives data
- **Data Type Verification**: Response matches `ProfileData` interface
- **Update Redux**: `profileSlice.setProfile` updates state
- **UI Update**: Profile fields populated with seeded data

**Success Criteria**:
- All seeded profile data displays correctly
- No placeholder or mock data visible
- Profile completion percentage accurate
- **UI Elements Present**: Profile page has visible sections for personal info, contact details, documents
- **Header Navigation**: "Profile" link visible in header navigation
- **Sidebar Menu**: Profile-related menu items appear in sidebar (View Profile, Edit Profile, etc.)

#### Test 2.2: Update Profile Information
**Frontend Page**: `/profile/edit`

**Steps**:
1. Navigate to profile edit page
2. Modify a field (e.g., phone number)
3. Click "Save Changes" button

**Expected Flow**:
- **Button Function**: `handleSaveProfile` in ProfileEditForm
- **API Request**: PUT `/api/profile/me` with `{ field: value, ... }` and Authorization header
- **Backend Route**: `router.put('/me', authenticate, profileController.updateProfile)` (profile.ts:15)
- **Controller**: `profileController.updateProfile` updates database
- **Response**: Updated profile data
- **Frontend Receive**: Form receives success response
- **Data Type Verification**: Response matches updated `ProfileData` interface
- **Update Redux**: Profile state updated with new data
- **Page Redirect**: Back to profile view page with success message

**Success Criteria**:
- Database record actually updated
- Redux state reflects changes
- UI shows updated information
- Success feedback displayed
- **UI Elements Present**: Edit form with all profile fields and "Save Changes" button visible
- **Form Functionality**: All form fields are editable and functional
- **Navigation Elements**: "Edit Profile" accessible from profile page or sidebar menu

### 3. Dashboard Integration Testing

#### Test 3.1: Player Dashboard Data Loading
**Frontend Page**: `/dashboard/player`

**Steps**:
1. Login as `player1@federacionpickleball.mx`
2. Navigate to player dashboard
3. Verify dashboard statistics and data

**Expected Flow**:
- **Frontend Function**: Dashboard component mount
- **API Request**: GET `/api/dashboard/player` with Authorization header
- **Backend Route**: `router.get('/player', authenticate, getPlayerDashboard)` (dashboard.ts:23)
- **Controller**: `getPlayerDashboard` aggregates player data from seeded database
- **Response**: `{ stats: PlayerStats, tournaments: Tournament[], matches: Match[] }`
- **Frontend Receive**: Dashboard receives real metrics
- **Data Type Verification**: Response matches `PlayerDashboardData` interface
- **Update Redux**: `dashboardSlice.setPlayerData`
- **UI Update**: StatCards show real numbers from seeded data

**Success Criteria**:
- Statistics reflect actual seeded data
- Tournament count, match history accurate
- Profile completion percentage correct
- No loading states stuck
- **UI Elements Present**: Dashboard has visible stat cards, charts, and navigation widgets
- **Sidebar Menu**: "Dashboard" is highlighted as active page in sidebar
- **Header Elements**: User name and role displayed in header
- **Interactive Elements**: All dashboard buttons and links are clickable and functional

#### Test 3.2: Admin Dashboard Comprehensive View
**Frontend Page**: `/dashboard/admin`

**Steps**:
1. Login as `admin@federacionpickleball.mx`
2. Navigate to admin dashboard
3. Verify comprehensive system statistics

**Expected Flow**:
- **Frontend Function**: AdminDashboard component mount
- **API Request**: GET `/api/dashboard/admin` with Authorization header
- **Backend Route**: `router.get('/admin', authenticate, getAdminDashboard)` (dashboard.ts:28)
- **Controller**: `getAdminDashboard` queries all models for system statistics
- **Response**: `{ users: UserStats, tournaments: TournamentStats, courts: CourtStats, revenue: RevenueStats }`
- **Frontend Receive**: Dashboard receives comprehensive metrics
- **Data Type Verification**: Response matches `AdminDashboardData` interface
- **Update Redux**: Multiple dashboard slices updated
- **UI Update**: Admin overview with real seeded numbers

**Success Criteria**:
- User counts by role accurate (players, coaches, clubs, etc.)
- Tournament and court statistics correct
- Revenue and payment data from seeded transactions
- State-wise distribution accurate

### 4. Player Finder System Testing

#### Test 4.1: Search for Nearby Players
**Frontend Page**: `/player-finder`

**Steps**:
1. Login as `player1@federacionpickleball.mx`
2. Set location preferences
3. Click "Find Players" button

**Expected Flow**:
- **Button Function**: `handlePlayerSearch` in PlayerFinderForm
- **API Request**: POST `/api/location/nearby` with `{ latitude: number, longitude: number, radius: number }`
- **Backend Route**: Currently disabled - location routes commented out (location.ts:10-17)
- **Controller**: `locationController.findNearbyLocations` (not implemented)
- **Response**: Array of nearby players from seeded data
- **Frontend Receive**: Search results component receives players
- **Data Type Verification**: Response matches `NearbyPlayersResponse` interface
- **Update Redux**: `playerFinderSlice.setSearchResults`
- **UI Update**: Player cards display with seeded player information

**⚠️ NOTE**: Player finder API endpoints are currently disabled in the backend. Need to implement location service first.

**Success Criteria**:
- Only players with `canBeFound: true` appear
- Results based on actual seeded location data
- Player information accurate from database
- Distance calculations functional

#### Test 4.2: Send Player Connect Request
**Frontend Page**: `/player-finder` (results view)

**Steps**:
1. After search results loaded
2. Click "Connect" on a player card
3. Verify request creation

**Expected Flow**:
- **Button Function**: `handleConnectRequest` in PlayerCard
- **API Request**: POST `/api/messages` with `{ recipientId: number, type: 'player_connect_request', message: string }`
- **Backend Route**: `router.post('/', authenticate, messageController.sendMessage)` (messages route)
- **Controller**: `messageController.sendMessage` creates message/notification
- **Response**: `{ success: true, messageId: number }`
- **Frontend Receive**: Player card receives confirmation
- **Data Type Verification**: Response matches `MessageSentResponse` interface
- **Update Redux**: Request status updated
- **UI Update**: Button changes to "Request Sent"

**⚠️ NOTE**: Player finder specific routes are disabled. Using messaging system for player connections.

**Success Criteria**:
- Database record created in PlayerFinderRequest table
- Notification sent to target player
- UI state properly updated
- Request visible in sender's requests list

### 5. Court Management Testing

#### Test 5.1: View Available Courts
**Frontend Page**: `/courts`

**Steps**:
1. Login as any user
2. Navigate to courts listing
3. Verify court information display

**Expected Flow**:
- **Frontend Function**: CourtsPage component mount
- **API Request**: GET `/api/courts` with Authorization header
- **Backend Route**: Court routes mounted at `/api` (index.ts:49)
- **Controller**: `courtController.getCourts` queries Court model with Club/Partner relations
- **Response**: `{ courts: Court[], total: number, page: number }`
- **Frontend Receive**: Courts list component receives data
- **Data Type Verification**: Response matches `CourtsListResponse` interface
- **Update Redux**: `courtSlice.setCourts`
- **UI Update**: Court cards show seeded court information

**Success Criteria**:
- Courts from seeded clubs/partners display
- Court details accurate (location, price, amenities)
- Owner information (club/partner) correct
- Availability status functional

#### Test 5.2: Make Court Reservation
**Frontend Page**: `/courts/{id}/book`

**Steps**:
1. Click "Book Court" on a court card
2. Select date and time
3. Click "Confirm Booking"

**Expected Flow**:
- **Button Function**: `handleBooking` in CourtBookingForm
- **API Request**: POST `/api/reservations` with `{ courtId: number, date: string, startTime: string, duration: number }`
- **Backend Route**: Reservation routes mounted at `/api` (index.ts:50)
- **Controller**: `reservationController.createReservation` creates reservation record
- **Response**: `{ reservation: Reservation, paymentRequired: boolean, amount?: number }`
- **Frontend Receive**: Booking form receives confirmation
- **Data Type Verification**: Response matches `ReservationResponse` interface
- **Update Redux**: Booking added to user's bookings
- **Page Redirect**: To booking confirmation page

**Success Criteria**:
- Booking record created in database
- Payment processing initiated (if required)
- Confirmation email sent via SendGrid
- Court availability updated

### 6. Tournament Management Testing

#### Test 6.1: View Tournament List
**Frontend Page**: `/tournaments`

**Steps**:
1. Navigate to tournaments page
2. Verify tournament listings from seeded data

**Expected Flow**:
- **Frontend Function**: TournamentsPage component mount
- **API Request**: GET `/api/tournaments` with Authorization header
- **Backend Route**: `router.get('/', tournamentController.getTournaments)` (tournaments route)
- **Controller**: `tournamentController.getTournaments` queries Tournament model with relations
- **Response**: `{ tournaments: Tournament[], total: number, page: number }`
- **Frontend Receive**: Tournament list receives data
- **Data Type Verification**: Response matches `TournamentsListResponse` interface
- **Update Redux**: `tournamentSlice.setTournaments`
- **UI Update**: Tournament cards with seeded information

**Success Criteria**:
- Tournaments from seeded data display correctly
- Registration status accurate
- Organizer information correct (club/partner/state)
- Date and location information accurate

#### Test 6.2: Tournament Registration
**Frontend Page**: `/tournaments/{id}/register`

**Steps**:
1. Click "Register" on tournament card
2. Fill registration form
3. Submit registration

**Expected Flow**:
- **Button Function**: `handleRegistration` in TournamentRegisterForm
- **API Request**: POST `/api/tournaments/{id}/register` with `{ playerCategory?: string, partnerInfo?: object }`
- **Backend Route**: `router.post('/:id/register', authenticate, tournamentController.registerPlayer)` (tournaments route)
- **Controller**: `tournamentController.registerPlayer` creates TournamentRegistration record
- **Response**: `{ registration: TournamentRegistration, paymentRequired: boolean, amount?: number }`
- **Frontend Receive**: Form receives success response
- **Data Type Verification**: Response matches `TournamentRegistrationResponse` interface
- **Update Redux**: User's tournament registrations updated
- **Page Redirect**: To registration success page

**Success Criteria**:
- Registration record created
- Payment processed if required
- Confirmation email sent
- Tournament participant count updated

### 7. Messaging System Testing

#### Test 7.1: Admin Broadcast Message
**Frontend Page**: `/admin/messaging`

**Steps**:
1. Login as admin
2. Create broadcast message
3. Select recipient groups (players, clubs, etc.)
4. Send message

**Expected Flow**:
- **Button Function**: `handleBroadcast` in AdminMessagingForm
- **API Request**: POST `/api/admin/messages/broadcast`
- **Backend Route**: `router.post('/messages/broadcast', authMiddleware, adminController.broadcastMessage)`
- **Controller**: `adminController.broadcastMessage` creates messages for recipients
- **Response**: Success with recipient count
- **Frontend Receive**: Form receives confirmation
- **Update Redux**: Sent messages count updated
- **UI Update**: Success notification displayed

**Success Criteria**:
- Messages created for all recipients in selected groups
- Email notifications sent via SendGrid
- Message history recorded
- Recipient filters work correctly

#### Test 7.2: User Inbox Functionality
**Frontend Page**: `/inbox`

**Steps**:
1. Login as regular user (player/coach/club)
2. Navigate to inbox
3. View received messages

**Expected Flow**:
- **Frontend Function**: InboxPage component mount
- **API Request**: GET `/api/messages/inbox`
- **Backend Route**: `router.get('/inbox', authMiddleware, messageController.getInbox)`
- **Controller**: `messageController.getInbox` queries user's messages
- **Response**: Array of messages for user
- **Frontend Receive**: Inbox receives messages
- **Update Redux**: `messageSlice.setInbox`
- **UI Update**: Message list displays

**Success Criteria**:
- Only messages for logged-in user appear
- Message status (read/unread) accurate
- Sender information correct
- Message content displays properly

### 8. Payment System Testing

#### Test 8.1: Membership Payment
**Frontend Page**: `/membership/payment`

**Steps**:
1. Login as user needing membership renewal
2. Navigate to membership payment
3. Process payment with test Stripe data

**Expected Flow**:
- **Button Function**: `handlePayment` in PaymentForm
- **API Request**: POST `/api/payments/membership`
- **Backend Route**: `router.post('/membership', authMiddleware, paymentController.processMembership)`
- **Controller**: `paymentController.processMembership` integrates with Stripe
- **Response**: Payment success with transaction ID
- **Frontend Receive**: Payment form receives confirmation
- **Update Redux**: User's membership status updated
- **Page Redirect**: To payment success page

**Success Criteria**:
- Stripe test payment processed
- User's membership renewed in database
- Payment record created
- Confirmation email sent
- Membership status updated in UI

### 9. File Upload Testing

#### Test 9.1: Profile Photo Upload
**Frontend Page**: `/profile/edit`

**Steps**:
1. Login as any user
2. Navigate to profile edit
3. Upload new profile photo
4. Save changes

**Expected Flow**:
- **Button Function**: `handlePhotoUpload` in PhotoUpload component
- **API Request**: POST `/api/upload/profile-photo` (with FormData)
- **Backend Route**: `router.post('/profile-photo', authMiddleware, uploadController.uploadProfilePhoto)`
- **Controller**: `uploadController.uploadProfilePhoto` uploads to Cloudinary
- **Response**: Cloudinary URL for uploaded image
- **Frontend Receive**: Upload component receives URL
- **Update Redux**: User profile updated with new photo URL
- **UI Update**: New photo displays immediately

**Success Criteria**:
- File uploaded to Cloudinary
- Database updated with new photo URL
- UI shows new photo immediately
- Old photo URL replaced

### 10. Error Handling Testing

#### Test 10.1: Network Error Handling
**Frontend Page**: Any page with API calls

**Steps**:
1. Disconnect internet or stop backend server
2. Attempt API operations
3. Verify error handling

**Expected Flow**:
- **Button Function**: Any API-calling function
- **API Request**: Fails due to network/server issue
- **Frontend Receive**: Axios catches error
- **Update Redux**: Error state updated
- **UI Update**: User-friendly error message displayed

**Success Criteria**:
- No console errors crash the app
- User receives meaningful error messages
- Retry mechanisms available
- App remains functional for offline-capable features

#### Test 10.2: Validation Error Handling
**Frontend Page**: Any form page

**Steps**:
1. Submit form with invalid data
2. Verify server-side validation
3. Check error display

**Expected Flow**:
- **Button Function**: Form submission handler
- **API Request**: POST with invalid data
- **Backend Route**: Validation middleware catches errors
- **Controller**: Returns 400 with validation errors
- **Response**: Error object with field-specific messages
- **Frontend Receive**: Form catches validation response
- **Update Redux**: Form errors state updated
- **UI Update**: Field-specific error messages display

**Success Criteria**:
- Server-side validation prevents invalid data
- Field-specific error messages displayed
- Form maintains user input
- Clear error messaging

---

## Test Execution Checklist

### Pre-Testing Verification
- [ ] Database seeded with complete test data
- [ ] Backend server running on correct port
- [ ] Frontend server running and accessible
- [ ] All environment variables configured
- [ ] SendGrid and Stripe test keys configured

### Authentication Tests
- [ ] Login with all seeded user types
- [ ] Auto-login functionality
- [ ] Token persistence across sessions
- [ ] Logout functionality
- [ ] Protected route access

### Profile Management Tests
- [ ] Profile data display from seeded database
- [ ] Profile updates save to database
- [ ] File uploads to Cloudinary
- [ ] Profile completion calculations

### Dashboard Tests
- [ ] Role-specific dashboard data loading
- [ ] Statistics reflect seeded data
- [ ] Real-time data updates
- [ ] Admin comprehensive view

### Feature-Specific Tests
- [ ] Player finder with seeded locations
- [ ] Court booking system
- [ ] Tournament registration
- [ ] Messaging system
- [ ] Payment processing

### Integration Tests
- [ ] Redux state management across features
- [ ] Cross-component data consistency
- [ ] Real-time updates between users
- [ ] Email notifications via SendGrid

### Error Handling Tests
- [ ] Network error recovery
- [ ] Validation error display
- [ ] Server error handling
- [ ] User-friendly error messages

---

## Success Criteria

### Technical Requirements
1. **Zero Mock Data**: All testing uses only seeded database data
2. **Seamless Integration**: Frontend-backend communication without errors
3. **Redux Consistency**: State management reflects database state accurately
4. **Real-time Updates**: Changes propagate immediately across components
5. **Error Handling**: Graceful error handling and user feedback

### User Experience Requirements
1. **Intuitive Navigation**: Users can complete tasks without confusion
2. **Responsive Design**: All pages work across device sizes
3. **Performance**: Pages load quickly with real data
4. **Feedback**: Users receive clear confirmation of actions
5. **Accessibility**: Components meet accessibility standards

### Production Readiness Requirements
1. **Security**: Authentication and authorization working correctly
2. **Data Integrity**: Database operations maintain consistency
3. **Scalability**: System performs well with seeded data volume
4. **Monitoring**: Errors logged appropriately
5. **Documentation**: All tested features documented

---

## Testing Timeline

### Phase 1: Core Authentication (Days 1-2)
- Authentication flow testing
- Profile management testing
- Role-based access verification

### Phase 2: Dashboard Integration (Days 3-4)
- Dashboard data loading for all roles
- Statistics accuracy verification
- Real-time update testing

### Phase 3: Feature Integration (Days 5-7)
- Player finder system
- Court management
- Tournament system
- Messaging system

### Phase 4: Payment & File Upload (Days 8-9)
- Stripe integration testing
- Cloudinary file upload testing
- Payment flow verification

### Phase 5: Error Handling & Polish (Days 10-11)
- Comprehensive error testing
- User experience refinement
- Performance optimization verification

### Phase 6: Production Readiness (Days 12-13)
- Security audit
- Final integration testing
- Documentation completion

---

## Test Reporting

### Daily Test Reports
Document daily progress with:
- Tests completed successfully
- Issues discovered and resolution status
- Performance metrics
- User experience observations

### Final Test Report
Comprehensive report including:
- All test scenarios executed
- Success/failure rates
- Known issues and workarounds
- Production readiness assessment
- Recommendations for deployment

---

This test workflow ensures comprehensive verification of the Mexican Pickleball Federation platform using only seeded database data, maintaining the seamless frontend-backend integration that is crucial for production success.