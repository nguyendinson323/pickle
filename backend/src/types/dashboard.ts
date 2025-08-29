export interface DashboardData {
  user: any;
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
  totalPlayers?: number;
  totalCoaches?: number;
  totalClubs?: number;
  totalPartners?: number;
  totalStates?: number;
  trainingHours?: number;
  matchesRefereed?: number;
  studentsCount?: number;
  certificationLevel?: string;
  clubRating?: number;
  eventsCreated?: number;
  partnershipTier?: string;
  sponsorshipValue?: number;
  regionsManaged?: number;
  regionalEvents?: number;
}

export interface ActivityItem {
  id: number;
  title: string;
  description: string;
  type: 'tournament' | 'training' | 'registration' | 'payment' | 'message' | 'certification';
  timestamp: string;
  iconType: string;
  actionUrl?: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'payment_success' | 'payment_failed' | 'payment_refunded' | 'payment_disputed' | 'subscription_created' | 'subscription_updated' | 'subscription_cancelled' | 'subscription_renewed' | 'membership_cancelled';
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  actionType: 'navigate' | 'modal' | 'external';
  actionUrl?: string;
  actionData?: any;
  isAvailable: boolean;
  isPremium?: boolean;
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

export interface AttachmentInfo {
  id: number;
  filename: string;
  fileSize: number;
  fileType: string;
  downloadUrl: string;
}