# Step 3: Role-Based Dashboards and Core UI Components

## Overview
This step creates comprehensive role-based dashboard systems for all user types (Player, Coach, Club, Partner, State Committee, Federation Admin), implements core UI components with modern design and animations, and builds the messaging/notification system. Each dashboard provides role-specific functionality and navigation.

## Objectives
- Create role-specific dashboard layouts with proper navigation
- Build core UI component library with modern design
- Implement messaging and notification system
- Create responsive design with mobile support
- Add animation effects and hover states
- Build inbox and announcement features
- Implement real-time notification badges

## Dashboard Specifications by Role

### Player Dashboard
**Navigation Tabs:**
- **Credential** - Digital federation ID with QR code
- **Account** - Edit personal information and settings
- **Inbox** - Messages, announcements, notifications
- **Connection** - Player finder (premium feature)
- **Documents** - Download certificates, invoices
- **Tournaments** - View and register for tournaments
- **Courts** - Find and book courts

### Coach Dashboard
**Navigation Tabs:**
- **Credential** - Digital coaching credential with QR code
- **Account** - Edit personal and professional information
- **Inbox** - Messages and federation communications
- **Connection** - Find players and other coaches (premium)
- **Certifications** - View courses, diplomas, manage licenses
- **Training** - Schedule training sessions, manage students
- **Match History** - Referee history and statistics

### Club Dashboard
**Navigation Tabs:**
- **Account** - Edit club information and settings
- **Inbox** - Federation and member communications
- **Microsite** - Manage club public page
- **Statistics** - Court usage, member activity, events
- **Documents** - Invoices, agreements, certificates
- **Affiliation** - Membership status and renewal
- **Management** - Create tournaments, manage courts, reservations
- **Member Management** - Register players, assign roles

### Partner Dashboard
**Navigation Tabs:**
- **Account** - Edit business information
- **Inbox** - Federation communications and inquiries
- **Microsite** - Manage business public page
- **Statistics** - Track interactions, bookings, revenue
- **Documents** - Contracts, invoices, reports
- **Affiliation** - Partnership status and payments
- **Management** - Court management, tournament creation

### State Committee Dashboard
**Navigation Tabs:**
- **Account** - Edit organization information
- **Inbox** - Federation and member communications
- **Management** - Create state tournaments, administer region
- **Microsite** - Manage state public page
- **Statistics** - Regional statistics and reports
- **Documents** - Official documents and reports
- **Affiliation** - Committee status and fees
- **Member Management** - Oversee clubs, players, partners

### Federation Admin Dashboard
**Navigation Tabs:**
- **Overview** - System-wide statistics and metrics
- **User Management** - Manage all users and accounts
- **Messaging** - Send announcements to segments
- **Court Registry** - Monitor all registered courts
- **Payments** - Track memberships and transactions
- **Statistics** - Comprehensive platform analytics
- **Microsite Management** - Supervise public content
- **System Settings** - Platform configuration

## Backend Development Tasks

### 1. Dashboard Data Controllers
**Files to Create:**
- `src/controllers/dashboardController.ts` - Dashboard data aggregation
- `src/services/dashboardService.ts` - Dashboard business logic
- `src/services/statisticsService.ts` - Statistics calculation

**Dashboard Methods:**
- `getPlayerDashboard()` - Player-specific dashboard data
- `getCoachDashboard()` - Coach dashboard with training stats
- `getClubDashboard()` - Club statistics and management data
- `getPartnerDashboard()` - Partner business analytics
- `getStateDashboard()` - State-level statistics
- `getAdminDashboard()` - System-wide administrative data

### 2. Messaging System Controllers
**Files to Create:**
- `src/controllers/messageController.ts` - Message management
- `src/services/messageService.ts` - Message business logic
- `src/services/notificationService.ts` - Notification handling

**Message Methods:**
- `sendMessage()` - Send messages/announcements
- `getInbox()` - Get user messages with pagination
- `markAsRead()` - Mark messages as read
- `deleteMessage()` - Delete messages
- `getUnreadCount()` - Get unread message count

### 3. Statistics Controllers
**Files to Create:**
- `src/controllers/statisticsController.ts` - Statistics endpoints
- `src/services/analyticsService.ts` - Analytics calculations

**Statistics Methods:**
- `getUserStats()` - Individual user statistics
- `getOrganizationStats()` - Club/partner statistics
- `getStateStats()` - State-level analytics
- `getSystemStats()` - Platform-wide statistics

### 4. API Endpoints
```
Dashboard Endpoints:
GET /api/dashboard/player/:id
GET /api/dashboard/coach/:id
GET /api/dashboard/club/:id
GET /api/dashboard/partner/:id
GET /api/dashboard/state/:id
GET /api/dashboard/admin

Messaging Endpoints:
GET /api/messages/inbox
POST /api/messages/send
PUT /api/messages/:id/read
DELETE /api/messages/:id
GET /api/messages/unread-count

Statistics Endpoints:
GET /api/statistics/user/:id
GET /api/statistics/organization/:id
GET /api/statistics/state/:id
GET /api/statistics/system

Notification Endpoints:
GET /api/notifications
POST /api/notifications/mark-read/:id
GET /api/notifications/unread-count
```

## Frontend Development Tasks

### 1. Core UI Components
**Files to Create:**
- `src/components/ui/Button.tsx` - Animated buttons with variants
- `src/components/ui/Card.tsx` - Content cards with hover effects
- `src/components/ui/Modal.tsx` - Modal dialogs with animations
- `src/components/ui/Tabs.tsx` - Tab navigation component
- `src/components/ui/Badge.tsx` - Notification badges
- `src/components/ui/Avatar.tsx` - User avatar component
- `src/components/ui/LoadingSpinner.tsx` - Loading animations
- `src/components/ui/Table.tsx` - Data tables with sorting
- `src/components/ui/Pagination.tsx` - Pagination component
- `src/components/ui/SearchBox.tsx` - Search input with suggestions
- `src/components/ui/DatePicker.tsx` - Date selection component
- `src/components/ui/Chart.tsx` - Chart component for statistics

### 2. Dashboard Components
**Files to Create:**
- `src/components/dashboard/DashboardLayout.tsx` - Common dashboard layout
- `src/components/dashboard/Sidebar.tsx` - Navigation sidebar
- `src/components/dashboard/TopBar.tsx` - Top navigation bar
- `src/components/dashboard/StatCard.tsx` - Statistics display cards
- `src/components/dashboard/QuickActions.tsx` - Quick action buttons
- `src/components/dashboard/RecentActivity.tsx` - Activity feed

### 3. Role-Specific Dashboard Components
**Files to Create:**
- `src/components/dashboards/PlayerDashboard.tsx`
- `src/components/dashboards/CoachDashboard.tsx`
- `src/components/dashboards/ClubDashboard.tsx`
- `src/components/dashboards/PartnerDashboard.tsx`
- `src/components/dashboards/StateDashboard.tsx`
- `src/components/dashboards/AdminDashboard.tsx`

### 4. Messaging Components
**Files to Create:**
- `src/components/messaging/Inbox.tsx` - Message inbox
- `src/components/messaging/MessageList.tsx` - List of messages
- `src/components/messaging/MessageItem.tsx` - Individual message
- `src/components/messaging/ComposeMessage.tsx` - Send message form
- `src/components/messaging/NotificationBell.tsx` - Notification indicator
- `src/components/messaging/AnnouncementBanner.tsx` - Important announcements

### 5. Statistics Components
**Files to Create:**
- `src/components/statistics/StatisticsCard.tsx` - Statistics display
- `src/components/statistics/ChartContainer.tsx` - Chart wrapper
- `src/components/statistics/MetricsGrid.tsx` - Metrics layout
- `src/components/statistics/ActivityChart.tsx` - Activity visualization
- `src/components/statistics/ProgressBar.tsx` - Progress indicators

### 6. Pages
**Files to Create:**
- `src/pages/dashboard/PlayerDashboardPage.tsx`
- `src/pages/dashboard/CoachDashboardPage.tsx`
- `src/pages/dashboard/ClubDashboardPage.tsx`
- `src/pages/dashboard/PartnerDashboardPage.tsx`
- `src/pages/dashboard/StateDashboardPage.tsx`
- `src/pages/dashboard/AdminDashboardPage.tsx`
- `src/pages/InboxPage.tsx`

### 7. Redux State Management
**Files to Create:**
- `src/store/dashboardSlice.ts` - Dashboard state
- `src/store/messageSlice.ts` - Messaging state
- `src/store/notificationSlice.ts` - Notification state
- `src/store/statisticsSlice.ts` - Statistics state

## Type Definitions

### Backend Types
```typescript
// types/dashboard.ts
export interface DashboardData {
  user: UserProfile;
  statistics: DashboardStats;
  recentActivity: ActivityItem[];
  notifications: NotificationItem[];
  quickActions: QuickAction[];
}

export interface DashboardStats {
  totalMembers?: number;
  activeTournaments?: number;
  courtReservations?: number;
  revenue?: number;
  membershipStatus?: 'active' | 'expired' | 'pending';
  nextRenewal?: string;
}

export interface MessageData {
  id: number;
  subject: string;
  content: string;
  senderName: string;
  senderRole: string;
  isRead: boolean;
  isUrgent: boolean;
  sentAt: string;
  attachments?: AttachmentInfo[];
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}
```

### Frontend Types
```typescript
// types/dashboard.ts
export interface DashboardState {
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  activeTab: string;
}

export interface MessageState {
  messages: MessageData[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

export interface UIComponentProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onClick?: () => void;
}
```

## UI Component Specifications

### Button Component
**Variants:**
- Primary: Blue gradient with hover effects
- Secondary: Outline with fill on hover
- Success: Green with checkmark animation
- Warning: Orange with pulse effect
- Error: Red with shake animation
- Ghost: Transparent with subtle hover

**Sizes:**
- Small: 32px height, 12px font
- Medium: 40px height, 14px font
- Large: 48px height, 16px font

### Card Component
**Features:**
- Shadow elevation on hover
- Smooth transition animations
- Optional header and footer
- Loading state with skeleton
- Interactive hover effects

### Modal Component
**Features:**
- Backdrop blur effect
- Slide-in animation from center
- Auto-focus management
- Escape key handling
- Mobile-responsive design

## Design System

### Color Palette
```css
/* Primary Colors */
--primary-50: #eff6ff;
--primary-500: #3b82f6;
--primary-600: #2563eb;
--primary-700: #1d4ed8;

/* Secondary Colors */
--secondary-50: #f8fafc;
--secondary-500: #64748b;
--secondary-600: #475569;

/* Success Colors */
--success-50: #f0fdf4;
--success-500: #10b981;
--success-600: #059669;

/* Warning Colors */
--warning-50: #fffbeb;
--warning-500: #f59e0b;
--warning-600: #d97706;

/* Error Colors */
--error-50: #fef2f2;
--error-500: #ef4444;
--error-600: #dc2626;
```

### Typography
```css
/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Animations
```css
/* Transitions */
--transition-fast: 150ms ease-in-out;
--transition-base: 200ms ease-in-out;
--transition-slow: 300ms ease-in-out;

/* Hover Effects */
.hover-lift {
  transition: transform var(--transition-base);
}
.hover-lift:hover {
  transform: translateY(-2px);
}

/* Loading Animation */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

## Dashboard Layout Structure

### Common Layout Elements
```
┌─────────────────────────────────────────────────────────┐
│ TopBar: Logo, User Menu, Notifications, Search         │
├─────────────────┬───────────────────────────────────────┤
│ Sidebar         │ Main Content Area                     │
│ - Navigation    │ ┌─────────────────────────────────┐   │
│ - Quick Actions │ │ Tab Navigation                  │   │
│ - User Info     │ ├─────────────────────────────────┤   │
│                 │ │ Tab Content                     │   │
│                 │ │ - Statistics Cards              │   │
│                 │ │ - Data Tables                   │   │
│                 │ │ - Action Buttons                │   │
│                 │ │ - Recent Activity               │   │
│                 │ └─────────────────────────────────┘   │
└─────────────────┴───────────────────────────────────────┘
```

### Mobile Layout (Responsive)
```
┌─────────────────────────────────────┐
│ Mobile Header with Menu Toggle      │
├─────────────────────────────────────┤
│ Tab Navigation (Horizontal Scroll)  │
├─────────────────────────────────────┤
│ Content Area                        │
│ - Stacked Statistics Cards          │
│ - Mobile-optimized Tables           │
│ - Touch-friendly Buttons            │
└─────────────────────────────────────┘
```

## Responsive Design Breakpoints
```css
/* Mobile First Approach */
--breakpoint-sm: 640px;   /* Small devices */
--breakpoint-md: 768px;   /* Medium devices */
--breakpoint-lg: 1024px;  /* Large devices */
--breakpoint-xl: 1280px;  /* Extra large devices */
--breakpoint-2xl: 1536px; /* 2X large devices */
```

## Testing Requirements

### Backend Testing
```bash
# Test dashboard endpoints
GET /api/dashboard/player/1
GET /api/dashboard/admin

# Test messaging
GET /api/messages/inbox
POST /api/messages/send

# Test statistics
GET /api/statistics/user/1
```

### Frontend Testing
- Test all dashboard layouts
- Verify responsive design on mobile
- Test tab navigation
- Verify statistics display
- Test messaging functionality
- Test notification badges
- Verify animations and hover effects

### Integration Testing
- Complete dashboard loading for each role
- Message sending and receiving
- Real-time notification updates
- Statistics data accuracy
- Mobile responsiveness

## Performance Optimization

### Backend Optimization
- Dashboard data caching (Redis)
- Statistics calculation optimization
- Efficient database queries
- Pagination for large datasets

### Frontend Optimization
- Component lazy loading
- Image optimization
- Bundle size optimization
- Virtual scrolling for large lists
- Memoization for expensive calculations

## Success Criteria
✅ All role-based dashboards render correctly
✅ Navigation works smoothly between tabs
✅ Statistics display accurate data
✅ Messaging system functions properly
✅ Notification badges update in real-time
✅ Mobile responsive design works
✅ Animations and hover effects work
✅ UI components are reusable and consistent
✅ Loading states display properly
✅ Error handling works correctly
✅ Search and filtering work
✅ Data tables support sorting and pagination

## Commands to Test
```bash
# Test dashboard loading
curl -X GET http://localhost:5000/api/dashboard/player/1 \
  -H "Authorization: Bearer <token>"

# Test messaging
curl -X GET http://localhost:5000/api/messages/inbox \
  -H "Authorization: Bearer <token>"

# Test statistics
curl -X GET http://localhost:5000/api/statistics/user/1 \
  -H "Authorization: Bearer <token>"

# Frontend testing
npm run test
npm run test:e2e
```

## Next Steps
After completing this step, you should have:
- Complete role-based dashboard system
- Modern UI component library
- Messaging and notification system
- Responsive design across all devices
- Foundation for specific feature modules

The next step will focus on membership management and payment integration with Stripe.