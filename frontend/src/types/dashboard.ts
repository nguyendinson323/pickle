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
  // Additional properties for admin dashboard
  totalUsers?: number;
  openIssues?: number;
  // Additional properties for club dashboard
  members?: number;
  upcomingEvents?: number;
  courts?: number;
  newMembersThisMonth?: number;
  membershipRenewalsDue?: number;
  eventsThisMonth?: number;
  // Additional properties for coach dashboard
  students?: number;
  upcomingSessions?: number;
  sessionsThisMonth?: number;
  totalHours?: number;
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
  type: 'info' | 'success' | 'warning' | 'error';
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
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
}

export interface NotificationState {
  notifications: NotificationItem[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
}

export interface UIComponentProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onClick?: () => void;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
    label?: string;
  };
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray';
  loading?: boolean;
  onClick?: () => void;
}