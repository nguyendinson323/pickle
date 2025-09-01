import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '@/utils/constants';
import cacheService from './cacheService';
import { ApiResponse } from '../types/api';

export interface ApiError {
  success: false;
  error: string;
  details?: any;
}

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Important for cookies (refresh tokens)
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && originalRequest && !originalRequest._isRetry) {
          originalRequest._isRetry = true;
          
          try {
            // Try to refresh the token
            const response = await this.api.post('/auth/refresh');
            const { token } = response.data;
            
            // Update token in localStorage
            localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
            
            // Update the authorization header
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            
            // Retry the original request
            return this.api(originalRequest);
          } catch (refreshError) {
            // Refresh failed, redirect to login
            this.handleAuthFailure();
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  private handleAuthFailure() {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    window.location.href = '/login';
  }

  // Generic API methods with caching support
  async get<T>(url: string, params?: any, useCache: boolean = true): Promise<T> {
    const cacheKey = cacheService.createApiKey('GET', url, params);
    
    if (useCache) {
      return cacheService.cachedFetch(
        async () => {
          try {
            const response = await this.api.get<T>(url, { params });
            return { success: true, data: response.data } as ApiResponse<T>;
          } catch (error) {
            throw this.handleError(error);
          }
        },
        cacheKey,
        { ttl: 5 * 60 * 1000 } // 5 minutes default cache
      ).then(result => result.data || result as any);
    }

    try {
      const response = await this.api.get<T>(url, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async post<T>(url: string, data?: any): Promise<T> {
    try {
      const response = await this.api.post<T>(url, data);
      
      // Invalidate relevant caches after successful POST
      this.invalidateRelatedCache(url);
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async put<T>(url: string, data?: any): Promise<T> {
    try {
      const response = await this.api.put<T>(url, data);
      
      // Invalidate relevant caches after successful PUT
      this.invalidateRelatedCache(url);
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async patch<T>(url: string, data?: any): Promise<T> {
    try {
      const response = await this.api.patch<T>(url, data);
      
      // Invalidate relevant caches after successful PATCH
      this.invalidateRelatedCache(url);
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete<T>(url: string): Promise<T> {
    try {
      const response = await this.api.delete<T>(url);
      
      // Invalidate relevant caches after successful DELETE
      this.invalidateRelatedCache(url);
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // File upload method
  async uploadFile<T>(url: string, file: File, fieldName: string = 'file'): Promise<T> {
    try {
      const formData = new FormData();
      formData.append(fieldName, file);
      
      const response = await this.api.post<T>(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): ApiError {
    if (axios.isAxiosError(error)) {
      // Server responded with error
      if (error.response?.data) {
        return {
          success: false,
          error: error.response.data.error || 'An error occurred',
          details: error.response.data.details,
        };
      }
      
      // Network error
      if (error.request) {
        return {
          success: false,
          error: 'Unable to connect to server. Please check your internet connection.',
        };
      }
    }
    
    // Generic error
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    };
  }

  // Cache invalidation logic
  private invalidateRelatedCache(url: string): void {
    if (url.includes('/tournament')) {
      cacheService.invalidateByEntity('tournament');
    } else if (url.includes('/user') || url.includes('/auth') || url.includes('/profile')) {
      cacheService.invalidateByEntity('user');
    } else if (url.includes('/payment')) {
      cacheService.invalidateByEntity('payment');
    } else if (url.includes('/notification')) {
      cacheService.invalidateByEntity('notification');
    }
  }

  // Cache management methods
  clearCache(): void {
    cacheService.clear();
  }

  invalidateCache(pattern: string): void {
    cacheService.invalidate(pattern);
  }

  getCacheStats(): any {
    return cacheService.getStats();
  }

  // Health check method
  async healthCheck(): Promise<{ success: boolean; message: string }> {
    return this.get('/health', undefined, false); // Don't cache health checks
  }

  // Initialize user session cache
  async initializeUserCache(userId: number): Promise<void> {
    await cacheService.warmup(userId);
  }
}

export default new ApiService();

// Type augmentation for Axios config to include _isRetry flag
declare module 'axios' {
  export interface AxiosRequestConfig {
    _isRetry?: boolean;
  }
}