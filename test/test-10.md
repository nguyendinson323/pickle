# Phase 10: Admin Dashboard System - Integration Testing Document

## Test Environment Setup

### Prerequisites
```bash
# Ensure backend server is running on localhost:3000
cd backend && npm run dev

# Ensure frontend server is running on localhost:5173  
cd frontend && npm run dev

# Verify PostgreSQL database is running and properly seeded
PGPASSWORD=a psql -h localhost -U postgres -d pickleball_federation -c "SELECT COUNT(*) FROM users WHERE role = 'admin';"
```

### Test Credentials
- **Federation Admin**: `federation_admin@example.com` / `password123`
- **State Admin**: `state_admin@example.com` / `password123`  
- **Player Test User**: `player_test@example.com` / `password123`
- **Club Test User**: `club_test@example.com` / `password123`

### Test Data Requirements
All testing must use only seeded database data from the existing user, tournament, court, and payment tables. No mock data or simulations allowed.

## Integration Test Flow Pattern

**Frontend Page → Button/Action → API Request → Backend Route → Controller → Service → Database → Response → Frontend Update → State Management**

## Test Scenarios

### T10.1: Admin Dashboard Overview Integration

#### T10.1.1: Federation Admin Dashboard Access
**Test Flow:**
1. **Frontend Action**: Navigate to `/admin/dashboard` as admin admin
2. **API Request**: `GET /api/admin/dashboard/overview`
   - **Headers**: `Authorization: Bearer <federation_token>`
   - **Expected Request**: `{ }`
3. **Backend Route**: `adminRoutes.get('/dashboard/overview', authenticateToken, requireRole('admin'), adminDashboardController.getDashboardOverview)`
4. **Controller**: `adminDashboardController.getDashboardOverview()` 
5. **Service**: `adminDashboardService.getDashboardOverview(adminId)`
6. **Database Query**: Aggregate statistics from users, tournaments, payments tables
7. **Response**: 
   ```typescript
   {
     success: true,
     data: {
       overview: {
         totalUsers: number,
         activeUsers: number,
         totalTournaments: number,
         totalRevenue: number,
         pendingModerations: number,
         systemAlerts: number,
         systemUptime: number
       },
       growthMetrics: {
         userGrowth: number,
         tournamentGrowth: number,
         revenueGrowth: number,
         engagementGrowth: number
       },
       recentActivity: AdminLog[],
       alerts: SystemAlert[]
     }
   }
   ```
8. **Frontend Update**: Render dashboard with live statistics and metrics
9. **State Management**: Update admin dashboard state with real data

**Success Criteria:**
- Dashboard displays real user count from database
- Revenue shows actual payment totals from seeded data
- Tournament count matches database records
- Growth metrics calculate from historical data
- UI elements are clickable and functional

#### T10.1.2: Role-Based Dashboard Access Control
**Test Flow:**
1. **Frontend Action**: Attempt to access `/admin/dashboard` as player user
2. **API Request**: `GET /api/admin/dashboard/overview` 
   - **Headers**: `Authorization: Bearer <player_token>`
3. **Backend Route**: Authentication middleware checks user role
4. **Expected Response**: 
   ```typescript
   {
     success: false,
     error: "Insufficient permissions for admin dashboard"
   }
   ```
5. **Frontend Update**: Redirect to login or show access denied message

### T10.2: User Management System Integration

#### T10.2.1: User List and Filtering
**Test Flow:**
1. **Frontend Action**: Navigate to `/admin/users` and apply role filter "player"
2. **API Request**: `GET /api/admin/users?role=player&page=1&limit=50`
   - **Headers**: `Authorization: Bearer <federation_token>`
3. **Backend Route**: `adminRoutes.get('/users', authenticateToken, requireRole('admin'), adminDashboardController.getUserManagement)`
4. **Controller**: `adminDashboardController.getUserManagement(req, res)`
5. **Service**: `adminDashboardService.getUserManagement(filters)`
6. **Database Query**: 
   ```sql
   SELECT users.*, subscriptions.status as subscriptionStatus 
   FROM users LEFT JOIN subscriptions ON users.id = subscriptions.userId 
   WHERE role = 'player' 
   ORDER BY createdAt DESC 
   LIMIT 50 OFFSET 0
   ```
7. **Response**:
   ```typescript
   {
     success: true,
     data: {
       users: User[],
       pagination: {
         page: 1,
         limit: 50,
         total: number,
         totalPages: number
       }
     }
   }
   ```
8. **Frontend Update**: Display filtered user list with pagination controls
9. **State Management**: Update user management state with filtered results

#### T10.2.2: User Status Update
**Test Flow:**
1. **Frontend Action**: Click "Deactivate" button for a specific player user
2. **API Request**: `PUT /api/admin/users/:userId/status`
   - **Headers**: `Authorization: Bearer <federation_token>`
   - **Body**: `{ isActive: false, reason: "Policy violation" }`
3. **Backend Route**: `adminRoutes.put('/users/:userId/status', authenticateToken, requireRole('admin'), adminDashboardController.updateUserStatus)`
4. **Controller**: `adminDashboardController.updateUserStatus(req, res)`
5. **Service**: Update user record and create admin log entry
6. **Database Updates**:
   - Update users table: `UPDATE users SET isActive = false WHERE id = :userId`
   - Insert admin log: `INSERT INTO admin_logs (...)`
   - Create notification record
7. **Response**: `{ success: true, message: "User deactivated successfully" }`
8. **Frontend Update**: Refresh user list showing updated status
9. **State Management**: Update user status in admin state

### T10.3: Content Moderation Integration

#### T10.3.1: Moderation Queue Display
**Test Flow:**
1. **Frontend Action**: Navigate to `/admin/moderation` page
2. **API Request**: `GET /api/admin/moderation?status=pending`
3. **Backend Processing**: Query content_moderation table for pending items
4. **Response**: List of pending moderation items with content previews
5. **Frontend Display**: Show moderation queue with action buttons
6. **Expected Elements**: Content preview, severity indicators, action buttons

#### T10.3.2: Content Moderation Action
**Test Flow:**
1. **Frontend Action**: Click "Approve" on a pending content item
2. **API Request**: `PUT /api/admin/moderation/:moderationId`
   - **Body**: 
   ```typescript
   {
     status: 'approved',
     reason: 'Content reviewed and approved',
     actionTaken: 'none',
     notes: 'Tournament content meets guidelines'
   }
   ```
3. **Backend Processing**: 
   - Update moderation record
   - Log admin action
   - Send notification to content owner if applicable
4. **Response**: `{ success: true, message: "Content moderation action completed successfully" }`
5. **Frontend Update**: Remove item from pending queue
6. **State Management**: Update moderation queue state

### T10.4: System Monitoring Integration

#### T10.4.1: System Alerts Dashboard
**Test Flow:**
1. **Frontend Action**: Navigate to `/admin/alerts` page
2. **API Request**: `GET /api/admin/alerts?severity=critical&status=open`
3. **Backend Processing**: Query system_alerts table
4. **Response**: List of active system alerts with severity levels
5. **Frontend Display**: Alert dashboard with color-coded severity
6. **UI Elements**: Acknowledge buttons, escalation options

#### T10.4.2: Alert Acknowledgment
**Test Flow:**
1. **Frontend Action**: Click "Acknowledge" on critical alert
2. **API Request**: `PUT /api/admin/alerts/:alertId/acknowledge`
3. **Backend Processing**: Update alert status and log admin action
4. **Response**: Confirmation of acknowledgment
5. **Frontend Update**: Update alert status display
6. **State Management**: Remove from unacknowledged alerts count

### T10.5: Financial Overview Integration

#### T10.5.1: Revenue Dashboard
**Test Flow:**
1. **Frontend Action**: Navigate to `/admin/financial` with date range selection
2. **API Request**: `GET /api/admin/financial/overview?startDate=2024-01-01&endDate=2024-12-31`
3. **Backend Processing**: 
   - Query payments table for subscription revenue
   - Query tournament entries for tournament revenue  
   - Query court bookings for booking revenue
   - Calculate totals and growth metrics
4. **Response**:
   ```typescript
   {
     success: true,
     data: {
       totalRevenue: number,
       subscriptionRevenue: number,
       tournamentRevenue: number,
       courtBookingRevenue: number,
       totalTransactions: number,
       revenueByDate: Array<{date: string, amount: number}>,
       topPayingUsers: Array<{userId: string, username: string, totalSpent: number}>
     }
   }
   ```
5. **Frontend Display**: Revenue charts, metrics cards, trend graphs
6. **State Management**: Update financial dashboard state

### T10.6: Broadcast Messaging Integration

#### T10.6.1: System Announcement
**Test Flow:**
1. **Frontend Action**: Navigate to `/admin/broadcast` and create announcement
2. **Form Data**: 
   ```typescript
   {
     title: "Platform Maintenance Notice",
     message: "Scheduled maintenance on Sunday 2-4 AM",
     targetAudience: { roles: ['player', 'coach'], states: ['all'] },
     channels: { inApp: true, email: true, sms: false, push: true },
     scheduledFor: null // immediate
   }
   ```
3. **API Request**: `POST /api/admin/broadcast`
4. **Backend Processing**: 
   - Determine target users based on criteria
   - Create notifications for each target user
   - Log broadcast action
5. **Response**: `{ success: true, message: "Announcement broadcast successfully" }`
6. **Frontend Update**: Show broadcast confirmation
7. **Verification**: Check notifications were created in database

### T10.7: Analytics and Reporting Integration

#### T10.7.1: User Activity Report Generation
**Test Flow:**
1. **Frontend Action**: Navigate to `/admin/reports` and select "User Activity Report"
2. **Report Parameters**: 
   ```typescript
   {
     reportType: 'user_activity',
     dateRange: { startDate: '2024-01-01', endDate: '2024-12-31' },
     roles: ['player', 'coach'],
     metrics: ['sessions', 'tournaments_played', 'courts_booked']
   }
   ```
3. **API Request**: `POST /api/admin/reports/user_activity`
4. **Backend Processing**: 
   - Query user engagement metrics
   - Calculate activity statistics
   - Generate report data
5. **Response**: Detailed user activity report with charts data
6. **Frontend Display**: Interactive report with downloadable format
7. **State Management**: Store report data for further analysis

### T10.8: Admin Activity Logging Integration

#### T10.8.1: Admin Action Audit Trail
**Test Flow:**
1. **Frontend Action**: Navigate to `/admin/logs` page  
2. **API Request**: `GET /api/admin/logs?category=user_management&severity=high`
3. **Backend Processing**: Query admin_logs table with filters
4. **Response**: 
   ```typescript
   {
     success: true,
     data: {
       logs: AdminLog[],
       pagination: PaginationInfo
     }
   }
   ```
5. **Frontend Display**: Audit log table with admin actions, timestamps, targets
6. **Filtering**: Admin name, action type, severity, date range filters functional

## Error Handling Tests

### E10.1: Permission Validation
- Non-admin users cannot access admin endpoints
- Invalid tokens rejected with 401 status
- Missing required parameters return 400 errors

### E10.2: Data Validation  
- Invalid user IDs in requests return 404 errors
- Malformed request bodies return validation errors
- SQL injection attempts properly sanitized

### E10.3: System Recovery
- Database connection failures handled gracefully
- External service timeouts don't crash admin functions
- Error messages logged for debugging

## Performance Tests

### P10.1: Dashboard Load Times
- Admin dashboard loads within 3 seconds with real data
- User management page handles 1000+ users efficiently
- Report generation completes within reasonable timeframes

### P10.2: Concurrent Admin Actions
- Multiple admins can perform actions simultaneously
- Admin logs maintain data integrity under concurrent access
- Database locks prevent data corruption

## Data Integrity Verification

### D10.1: Admin Action Logging
- Every administrative action creates corresponding audit log
- Log entries contain all required metadata (IP, user agent, timestamps)
- Sensitive data properly redacted in logs

### D10.2: Role-Based Data Access
- Federation admins see all data across platform
- State admins limited to their state data only
- Data filtering properly implemented at database level

## Success Criteria Checklist

- [ ] Admin dashboard displays real metrics from seeded database
- [ ] User management allows filtering, searching, status updates
- [ ] Content moderation workflow functions end-to-end
- [ ] System alerts properly categorized and actionable
- [ ] Financial overview shows accurate revenue calculations
- [ ] Broadcast messaging reaches target audiences correctly
- [ ] Report generation produces accurate data analysis
- [ ] Admin activity fully logged and auditable
- [ ] All UI elements functional and accessible
- [ ] Error handling graceful and informative
- [ ] Performance acceptable under realistic load
- [ ] Role-based permissions strictly enforced
- [ ] Data types validated between frontend and backend
- [ ] Database queries optimized for admin operations

## Test Completion Notes

This comprehensive admin dashboard system testing ensures the Mexican Pickleball Federation platform has robust administrative capabilities for user management, content moderation, system monitoring, and platform governance. All tests use real seeded data and verify complete integration flows from frontend interactions through backend processing to database operations and state management updates.