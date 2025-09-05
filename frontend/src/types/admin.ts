export interface AdminDashboardOverview {
  users: {
    total: number;
    new_today: number;
    active: number;
    by_role: {
      player: number;
      coach: number;
      club: number;
      partner: number;
      state: number;
      admin: number;
    };
  };
  tournaments: {
    total: number;
    active: number;
    completed: number;
    revenue: number;
  };
  content_moderation: {
    pending: number;
    approved_today: number;
    rejected_today: number;
    flagged: number;
  };
  system_alerts: {
    critical: number;
    warning: number;
    info: number;
    open: number;
  };
  financial: {
    total_revenue: number;
    monthly_revenue: number;
    subscription_revenue: number;
    transaction_count: number;
  };
  platform_health: {
    uptime: number;
    response_time: number;
    error_rate: number;
    active_sessions: number;
  };
}

export interface UserManagementFilters {
  page: number;
  limit: number;
  role?: string;
  status?: string;
  search?: string;
}

export interface UserManagementResponse {
  users: Array<{
    id: number;
    username: string;
    email: string;
    role: string;
    status: string;
    created_at: string;
    last_login: string | null;
    profile_completion: number;
  }>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface ContentModerationFilters {
  page: number;
  limit: number;
  status?: string;
  severity?: string;
  contentType?: string;
}

export interface ContentModerationItem {
  id: number;
  contentType: string;
  contentId: string;
  contentPreview: string;
  status: 'pending' | 'approved' | 'rejected' | 'flagged' | 'escalated';
  severity: 'low' | 'medium' | 'high' | 'critical';
  reportedBy?: number;
  reportReason?: string;
  aiFlags?: {
    toxicity: number;
    spam: number;
    inappropriate: number;
    confidence: number;
  };
  createdAt: string;
  moderatedAt?: string;
}

export interface ContentModerationResponse {
  items: ContentModerationItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface SystemAlertFilters {
  page: number;
  limit: number;
  severity?: string;
  status?: string;
  type?: string;
}

export interface SystemAlert {
  id: number;
  type: 'performance' | 'security' | 'error' | 'maintenance' | 'business' | 'user_behavior';
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  status: 'open' | 'acknowledged' | 'investigating' | 'resolved' | 'false_positive';
  source: 'system' | 'monitoring' | 'user_report' | 'automated_check';
  createdAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
}

export interface SystemAlertsResponse {
  alerts: SystemAlert[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface FinancialOverview {
  summary: {
    totalRevenue: number;
    monthlyRevenue: number;
    subscriptionRevenue: number;
    transactionCount: number;
    averageTransactionValue: number;
    revenueGrowth: number;
  };
  revenueBreakdown: Array<{
    source: string;
    amount: number;
    percentage: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    revenue: number;
    transactions: number;
  }>;
  topClubs: Array<{
    id: number;
    name: string;
    revenue: number;
    transactions: number;
  }>;
}

export interface BroadcastAnnouncementData {
  title: string;
  message: string;
  targetAudience: 'all' | 'players' | 'coaches' | 'clubs' | 'partners' | 'state_committees';
  priority: 'low' | 'medium' | 'high';
  scheduledFor?: Date;
}

export interface AdminLogFilters {
  page: number;
  limit: number;
  category?: string;
  severity?: string;
  startDate?: string;
  endDate?: string;
  adminUserId?: number;
}

export interface AdminLog {
  id: number;
  adminId: number;
  adminUsername: string;
  action: string;
  category: 'user_management' | 'content_moderation' | 'system_config' | 'financial' | 'tournament' | 'communication';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'success' | 'failed' | 'partial';
  ipAddress: string;
  createdAt: string;
}

export interface AdminLogsResponse {
  logs: AdminLog[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface ReportGenerationRequest {
  reportType: 'user_activity' | 'financial' | 'tournament' | 'content_moderation' | 'system_health';
  startDate: string;
  endDate: string;
  format: 'json' | 'csv' | 'pdf';
  filters?: Record<string, any>;
}

export interface PlatformStatisticsFilters {
  startDate?: string;
  endDate?: string;
  granularity: 'daily' | 'weekly' | 'monthly';
}

export interface PlatformStatistic {
  date: string;
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  usersByRole: {
    player: number;
    coach: number;
    club: number;
    partner: number;
    state: number;
    admin: number;
  };
  totalTournaments: number;
  newTournaments: number;
  activeTournaments: number;
  completedTournaments: number;
  totalRevenue: number;
  systemUptime: number;
  averageResponseTime: number;
  errorRate: number;
}

export interface PlatformStatisticsResponse {
  statistics: PlatformStatistic[];
  summary: {
    totalPeriods: number;
    averageUsers: number;
    totalRevenue: number;
    averageUptime: number;
    averageResponseTime: number;
    averageErrorRate: number;
  };
}