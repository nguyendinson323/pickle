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
  };
}