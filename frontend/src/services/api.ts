import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '@/utils/constants';

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

  // Generic API methods
  async get<T>(url: string, params?: any): Promise<T> {
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
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async put<T>(url: string, data?: any): Promise<T> {
    try {
      const response = await this.api.put<T>(url, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async patch<T>(url: string, data?: any): Promise<T> {
    try {
      const response = await this.api.patch<T>(url, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete<T>(url: string): Promise<T> {
    try {
      const response = await this.api.delete<T>(url);
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
          error: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
        };
      }
    }
    
    // Generic error
    return {
      success: false,
      error: error.message || 'Ha ocurrido un error inesperado',
    };
  }

  // Health check method
  async healthCheck(): Promise<{ success: boolean; message: string }> {
    return this.get('/health');
  }
}

export default new ApiService();

// Type augmentation for Axios config to include _isRetry flag
declare module 'axios' {
  export interface AxiosRequestConfig {
    _isRetry?: boolean;
  }
}