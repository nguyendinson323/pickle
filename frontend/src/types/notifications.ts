// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: 'system' | 'tournament' | 'booking' | 'message' | 'match' | 'payment' | 'maintenance';
  category: 'info' | 'success' | 'warning' | 'error' | 'urgent';
  
  // Notification content
  title: string;
  message: string;
  actionText?: string;
  actionUrl?: string;
  
  // Related data
  relatedEntityType?: string;
  relatedEntityId?: string;
  metadata?: Record<string, any>;
  
  // Status
  isRead: boolean;
  readAt?: Date;
  
  // Delivery channels
  channels: {
    inApp: boolean;
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  
  // Delivery status
  deliveryStatus: {
    inApp: { delivered: boolean; deliveredAt?: Date };
    email: { delivered: boolean; deliveredAt?: Date; error?: string };
    sms: { delivered: boolean; deliveredAt?: Date; error?: string };
    push: { delivered: boolean; deliveredAt?: Date; error?: string };
  };
  
  // Scheduling
  scheduledFor?: Date;
  isScheduled: boolean;
  
  // Expiry
  expiresAt?: Date;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Notification preferences
export interface NotificationPreferences {
  id: string;
  userId: string;
  
  // Global settings
  globalEnabled: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string; // "22:00"
  quietHoursEnd: string; // "08:00"
  
  // Channel preferences
  preferences: {
    // Tournament notifications
    tournaments: {
      registration_open: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      registration_confirmed: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      bracket_released: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      match_scheduled: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      match_reminder: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      results_posted: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
    };
    
    // Court booking notifications
    bookings: {
      booking_confirmed: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      booking_reminder: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      booking_cancelled: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      court_unavailable: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
    };
    
    // Player matching notifications
    matches: {
      match_request: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      match_accepted: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      match_declined: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      court_suggestion: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
    };
    
    // Messaging notifications
    messages: {
      direct_message: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      group_message: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      mention: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
    };
    
    // System notifications
    system: {
      account_security: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      payment_updates: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      maintenance_alerts: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
    };
  };
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Notification template
export interface NotificationTemplate {
  id: string;
  name: string;
  type: string;
  category: 'tournament' | 'booking' | 'message' | 'system' | 'payment';
  
  // Template content
  templates: {
    inApp: {
      title: string;
      message: string;
      actionText?: string;
    };
    email: {
      subject: string;
      htmlContent: string;
      textContent: string;
    };
    sms: {
      message: string;
    };
    push: {
      title: string;
      body: string;
      icon?: string;
    };
  };
  
  // Template variables
  variables: {
    name: string;
    description: string;
    type: 'string' | 'number' | 'date' | 'boolean';
    required: boolean;
  }[];
  
  // Status
  isActive: boolean;
  version: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Create notification data
export interface CreateNotificationData {
  userId: string;
  type: 'system' | 'tournament' | 'booking' | 'message' | 'match' | 'payment' | 'maintenance';
  category: 'info' | 'success' | 'warning' | 'error' | 'urgent';
  templateType?: string;
  data?: Record<string, any>;
  title?: string;
  message?: string;
  actionText?: string;
  actionUrl?: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  scheduledFor?: Date;
  expiresAt?: Date;
  channels?: {
    inApp?: boolean;
    email?: boolean;
    sms?: boolean;
    push?: boolean;
  };
}

// Notification filters
export interface NotificationFilters {
  type?: string;
  category?: string;
  isRead?: boolean;
  fromDate?: Date;
  toDate?: Date;
}

// Notification list state
export interface NotificationListState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
  unreadCount: number;
}

// Notification preferences update data
export interface UpdateNotificationPreferencesData {
  globalEnabled?: boolean;
  quietHoursEnabled?: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  preferences?: Partial<NotificationPreferences['preferences']>;
}

// Batch notification data
export interface BatchNotificationData {
  userIds: string[];
  type: 'system' | 'tournament' | 'booking' | 'message' | 'match' | 'payment' | 'maintenance';
  category: 'info' | 'success' | 'warning' | 'error' | 'urgent';
  title?: string;
  message?: string;
  templateType?: string;
  data?: Record<string, any>;
  actionUrl?: string;
  scheduledFor?: Date;
  expiresAt?: Date;
}

// Test notification data
export interface TestNotificationData {
  userId: string;
  channel: 'inApp' | 'email' | 'sms' | 'push';
  title: string;
  message: string;
}

// API response types
export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  unreadCount: number;
  page: number;
  totalPages: number;
}

export interface NotificationPreferencesResponse {
  preferences: NotificationPreferences;
}

export interface NotificationTemplatesResponse {
  templates: NotificationTemplate[];
  total: number;
  page: number;
  totalPages: number;
}

export interface UnreadNotificationCountResponse {
  count: number;
}

export interface BatchNotificationResponse {
  sent: number;
  total: number;
  message: string;
}

// Socket notification events
export interface NotificationSocketEvents {
  'notification:new': { notification: Notification; timestamp: Date };
  'notification:read': { notificationId: string };
  'notification:read_all': void;
  'notification:get_unread_count': void;
}

// Notification types for different categories
export interface TournamentNotificationData {
  tournamentId: string;
  tournamentName: string;
  registrationDeadline?: Date;
  startDate?: Date;
  matchTime?: Date;
  opponentName?: string;
  court?: string;
  results?: {
    winner: string;
    score: string;
  };
}

export interface BookingNotificationData {
  bookingId: string;
  facilityName: string;
  courtName: string;
  bookingDate: Date;
  startTime: string;
  endTime: string;
  cancellationReason?: string;
}

export interface MessageNotificationData {
  conversationId: string;
  senderName: string;
  conversationName: string;
  messagePreview: string;
}

export interface MatchNotificationData {
  matchId: string;
  opponentName: string;
  requestDate: Date;
  suggestedCourt?: string;
  suggestedTime?: Date;
}

export interface PaymentNotificationData {
  transactionId: string;
  amount: number;
  currency: string;
  description: string;
  paymentMethod: string;
  status: 'success' | 'failed' | 'pending' | 'refunded';
}

export interface SystemNotificationData {
  maintenanceStart?: Date;
  maintenanceEnd?: Date;
  affectedServices?: string[];
  securityIssue?: {
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    actionRequired: boolean;
  };
}

// Notification priority levels
export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

// Notification display settings
export interface NotificationDisplaySettings {
  showInAppBadge: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  showDesktopNotifications: boolean;
  autoHideAfterSeconds?: number;
}

// Notification history
export interface NotificationHistory {
  id: string;
  notificationId: string;
  action: 'created' | 'read' | 'deleted' | 'delivered' | 'failed';
  timestamp: Date;
  channel?: 'inApp' | 'email' | 'sms' | 'push';
  error?: string;
}

// Notification analytics
export interface NotificationAnalytics {
  totalSent: number;
  totalRead: number;
  readRate: number;
  deliveryRate: {
    inApp: number;
    email: number;
    sms: number;
    push: number;
  };
  popularTypes: {
    type: string;
    count: number;
  }[];
  timeDistribution: {
    hour: number;
    count: number;
  }[];
}