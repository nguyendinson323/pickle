export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  user?: T;
  token?: string;
  message?: string;
  error?: string;
  details?: any;
}

export interface ApiError {
  success: false;
  error: string;
  details?: any;
}

export interface LoginResponse {
  success: boolean;
  user: import('./auth').UserProfile;
  token: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage?: boolean;
    hasPrevPage?: boolean;
  };
}

// Enhanced Tournament Types
export interface Tournament {
  id: number;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  registrationStart: string;
  registrationEnd: string;
  location: string;
  city: string;
  state: string;
  address: string;
  entryFee: number;
  maxParticipants: number;
  currentParticipants: number;
  skillLevel: string;
  category: string;
  status: 'draft' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  prizeAmount?: number;
  organizedBy: number;
  createdAt: string;
  updatedAt: string;
}

// Search Types
export interface SearchFilters {
  searchTerm: string;
  category?: string;
  skillLevel?: string;
  status?: string;
  location?: {
    state: string;
    city: string;
    radius?: number;
  };
  dateRange?: {
    start: string;
    end: string;
  };
  priceRange?: {
    min: number;
    max: number;
  };
  sortBy?: string;
  page?: number;
  limit?: number;
}

export interface SearchResult {
  id: string;
  type: 'tournament' | 'player' | 'court' | 'event';
  title: string;
  description: string;
  image?: string;
  location: {
    city: string;
    state: string;
  };
  date?: string;
  price?: number;
  rating?: number;
  participants?: number;
  maxParticipants?: number;
  skillLevel?: string;
  status: string;
  tags?: string[];
}

// Payment Types
export interface PaymentRequest {
  amount: number;
  currency: string;
  description: string;
  type: 'tournament_entry' | 'membership' | 'coaching' | 'court_rental';
  userId: string;
  paymentMethodId?: string;
  metadata?: Record<string, any>;
}

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  status: 'completed' | 'pending' | 'failed';
  message?: string;
  paymentUrl?: string;
}

// Notification Types
export interface NotificationData {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  email?: string;
  actionUrl?: string;
}

// Dashboard Types
export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalTournaments: number;
  activeTournaments: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalCourts: number;
  activeCourts: number;
  pendingApprovals: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
}

// Export Types
export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv' | 'json';
  dateRange: {
    start: string;
    end: string;
  };
  filters: {
    status?: string;
    category?: string;
    location?: string;
    skillLevel?: string;
  };
  includeImages?: boolean;
}

// WebSocket Message Types
export interface WSMessage {
  type: 'notification' | 'tournament_update' | 'match_result' | 'system_message';
  payload: any;
  timestamp: string;
  userId?: number;
}

// Validation Error Types
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface ValidationResponse extends ApiResponse {
  errors?: ValidationError[];
}