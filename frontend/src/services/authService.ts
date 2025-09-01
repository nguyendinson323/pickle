import apiService from './api';
import { LoginCredentials, UserProfile } from '@/types/auth';
import { ApiResponse } from '@/types/api';
import { STORAGE_KEYS } from '@/utils/constants';

class AuthService {
  async login(credentials: LoginCredentials): Promise<{ user: UserProfile; token: string }> {
    const response = await apiService.post<any>('/auth/login', credentials);
    
    if (response.success && response.user && response.token) {
      const { user, token } = response;
      // Store token and user data
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      
      return { user, token };
    }
    
    throw new Error(response.error || 'Login failed');
  }

  async logout(): Promise<void> {
    try {
      await apiService.post('/auth/logout');
    } catch (error) {
      // Continue with local logout even if server logout fails
      console.warn('Server logout failed:', error);
    }
    
    // Clear local storage
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }

  async getCurrentUser(): Promise<UserProfile> {
    const response = await apiService.get<any>('/auth/me');
    
    if (response.success && response.user) {
      // Update stored user data
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));
      return response.user;
    }
    
    throw new Error(response.error || 'Failed to get current user');
  }

  async verifyToken(): Promise<{ valid: boolean; user?: any }> {
    try {
      const response = await apiService.get<any>('/auth/verify');
      return {
        valid: response.success && response.valid,
        user: response.user,
      };
    } catch (error) {
      return { valid: false };
    }
  }

  async refreshToken(): Promise<string> {
    const response = await apiService.post<ApiResponse<{ token: string }>>('/auth/refresh');
    
    if (response.success && response.data) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
      return response.data.token;
    }
    
    throw new Error(response.error || 'Token refresh failed');
  }

  // Get stored token
  getStoredToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  // Get stored user data
  getStoredUser(): UserProfile | null {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      }
    }
    return null;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getStoredToken();
    const user = this.getStoredUser();
    return !!(token && user);
  }

  // Store token
  storeToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  // Store user data
  storeUser(user: UserProfile): void {
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  }

  // Clear all stored authentication data
  clearStorage(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }

  // Check authentication status on app load
  async checkAuthStatus(): Promise<{ isAuthenticated: boolean; user?: UserProfile }> {
    const token = this.getStoredToken();
    
    if (!token) {
      return { isAuthenticated: false };
    }

    try {
      const verifyResult = await this.verifyToken();
      if (verifyResult.valid && verifyResult.user) {
        // Update stored user data with fresh data from server
        this.storeUser(verifyResult.user);
        return { isAuthenticated: true, user: verifyResult.user };
      } else {
        // Token is invalid, clear storage
        this.clearStorage();
        return { isAuthenticated: false };
      }
    } catch (error) {
      console.error('Auth status check failed:', error);
      this.clearStorage();
      return { isAuthenticated: false };
    }
  }
}

export default new AuthService();