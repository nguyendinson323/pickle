// Main Integration Service - Connects all frontend-backend services
import apiService from './api';
import cacheService from './cacheService';
import errorService from './errorService';
import websocketService from './websocketService';
import { showSuccess, showError, showWarning, showInfo } from '../components/common/NotificationSystem';

export interface IntegrationConfig {
  enableWebSocket?: boolean;
  enableCache?: boolean;
  enableErrorHandling?: boolean;
  webSocketUrl?: string;
  cacheOptions?: {
    maxSize?: number;
    defaultTTL?: number;
  };
}

class IntegrationService {
  private initialized = false;
  private config: Required<IntegrationConfig> = {
    enableWebSocket: true,
    enableCache: true,
    enableErrorHandling: true,
    webSocketUrl: this.getWebSocketUrl(),
    cacheOptions: {
      maxSize: 100,
      defaultTTL: 5 * 60 * 1000 // 5 minutes
    }
  };

  private getWebSocketUrl(): string {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    return `${protocol}//${host}/ws`;
  }

  // Initialize all services with user session
  async initialize(config?: Partial<IntegrationConfig>): Promise<void> {
    if (this.initialized) {
      console.warn('Integration service already initialized');
      return;
    }

    // Update configuration
    if (config) {
      this.config = { ...this.config, ...config };
    }

    console.log('🚀 Initializing Frontend-Backend Integration Services...');

    try {
      // Initialize error handling first
      if (this.config.enableErrorHandling) {
        this.initializeErrorHandling();
        console.log('✅ Error handling service initialized');
      }

      // Initialize cache service
      if (this.config.enableCache) {
        this.initializeCache();
        console.log('✅ Cache service initialized');
      }

      // Check backend connectivity (non-blocking with short timeout)
      try {
        const healthPromise = this.checkBackendHealth();
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Backend health check timeout')), 3000); // 3 second timeout
        });
        
        await Promise.race([healthPromise, timeoutPromise]);
        console.log('✅ Backend connection verified');
      } catch (error) {
        console.warn('⚠️ Backend health check failed, continuing with offline mode:', error);
        // Continue initialization even if backend is not available
      }

      // Initialize WebSocket if user is authenticated
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');
      
      if (token && userData && this.config.enableWebSocket) {
        try {
          const user = JSON.parse(userData);
          await this.initializeWebSocket(user.id, token);
          console.log('✅ WebSocket service initialized');
        } catch (error) {
          console.warn('⚠️ WebSocket initialization failed:', error);
          // Don't fail overall initialization for WebSocket issues
        }
      }

      // Setup global notification methods
      this.setupGlobalNotifications();
      
      // Setup performance monitoring
      this.setupPerformanceMonitoring();

      this.initialized = true;
      console.log('🎉 All integration services initialized successfully');

    } catch (error) {
      console.error('❌ Integration service initialization failed:', error);
      // Still mark as initialized to prevent infinite loops
      this.initialized = true;
      console.warn('⚠️ Marked as initialized despite errors to prevent loops');
      errorService.handleError(error, { userAction: 'System initialization' });
      // Don't throw - allow app to continue with degraded functionality
    }
  }

  // Initialize error handling system
  private initializeErrorHandling(): void {
    // Set up global error handler
    errorService.setErrorHandler((errorInfo, feedback) => {
      console.debug('Error handled:', errorInfo, feedback);
    });

    // Enhanced API error handling
    // apiService.setupInterceptors?.();
  }

  // Initialize cache system
  private initializeCache(): void {
    const { maxSize, defaultTTL } = this.config.cacheOptions;
    // Cache is already initialized with good defaults
    console.debug('Cache service ready with max size:', maxSize, 'default TTL:', defaultTTL);
  }

  // Initialize WebSocket connection
  private async initializeWebSocket(userId: number, token: string): Promise<void> {
    await websocketService.connect(userId, token);

    // Set up common WebSocket listeners
    this.setupWebSocketListeners();

    // Initialize user cache warmup
    await apiService.initializeUserCache(userId);
  }

  // Setup WebSocket event listeners
  private setupWebSocketListeners(): void {
    // Tournament updates
    websocketService.subscribe('tournament_update', (data) => {
      showInfo('Tournament information has been updated', 'Tournament Update');
      // Invalidate tournament cache
      cacheService.invalidateByEntity('tournament');
    });

    // New notifications
    websocketService.subscribe('notification', (data) => {
      if (data.type === 'info') {
        showInfo(data.message, data.title || 'New Notification');
      } else if (data.type === 'success') {
        showSuccess(data.message, data.title || 'Success');
      } else if (data.type === 'warning') {
        showWarning(data.message, data.title || 'Warning');
      } else {
        showError(data.message, data.title || 'Error');
      }
      
      // Invalidate notification cache
      cacheService.invalidateByEntity('notification');
    });

    // Payment status updates
    websocketService.subscribe('payment_status', (data) => {
      if (data.status === 'completed') {
        showSuccess('Payment processed successfully', 'Payment Complete');
      } else if (data.status === 'failed') {
        showError('Payment processing failed', 'Payment Error');
      }
      
      // Invalidate payment cache
      cacheService.invalidateByEntity('payment');
    });

    // System messages
    websocketService.subscribe('system_message', (data) => {
      switch (data.type) {
        case 'maintenance':
          showWarning('System maintenance scheduled. Please save your work.', 'Maintenance Notice');
          break;
        case 'update_available':
          showInfo('A new version is available. Refresh to update.', 'Update Available');
          break;
        default:
          console.log('System message received:', data);
      }
    });
  }

  // Check backend health
  private async checkBackendHealth(): Promise<void> {
    try {
      const health = await apiService.healthCheck();
      if (!health.success) {
        throw new Error('Backend health check failed');
      }
    } catch (error) {
      throw new Error('Cannot connect to backend services');
    }
  }

  // Setup global notification methods
  private setupGlobalNotifications(): void {
    // Make notification methods globally available
    (window as any).showSuccess = showSuccess;
    (window as any).showError = showError;
    (window as any).showWarning = showWarning;
    (window as any).showInfo = showInfo;
  }

  // Setup performance monitoring
  private setupPerformanceMonitoring(): void {
    // Monitor API response times
    let apiCallCount = 0;
    let totalResponseTime = 0;

    const originalGet = apiService.get;
    const originalPost = apiService.post;
    const originalPut = apiService.put;
    const originalDelete = apiService.delete;

    const wrapMethod = (method: any, methodName: string) => {
      return async function (...args: any[]) {
        const startTime = Date.now();
        try {
          const result = await method.apply(apiService, args);
          const endTime = Date.now();
          const responseTime = endTime - startTime;
          
          apiCallCount++;
          totalResponseTime += responseTime;
          
          console.debug(`API ${methodName} call took ${responseTime}ms`);
          
          // Log slow requests
          if (responseTime > 3000) {
            console.warn(`Slow API call detected: ${methodName} took ${responseTime}ms`);
          }
          
          return result;
        } catch (error) {
          const endTime = Date.now();
          const responseTime = endTime - startTime;
          console.error(`API ${methodName} failed after ${responseTime}ms:`, error);
          throw error;
        }
      };
    };

    // Wrap API methods with performance monitoring
    (apiService as any).get = wrapMethod(originalGet, 'GET');
    (apiService as any).post = wrapMethod(originalPost, 'POST');
    (apiService as any).put = wrapMethod(originalPut, 'PUT');
    (apiService as any).delete = wrapMethod(originalDelete, 'DELETE');
  }

  // User authentication integration
  async handleUserLogin(userId: number, token: string): Promise<void> {
    // Store authentication data
    localStorage.setItem('auth_token', token);
    
    // Initialize WebSocket for real-time updates
    if (this.config.enableWebSocket) {
      try {
        await this.initializeWebSocket(userId, token);
        console.log('✅ User session WebSocket initialized');
      } catch (error) {
        console.warn('⚠️ WebSocket initialization failed for user session:', error);
      }
    }

    // Warm up cache with user data
    if (this.config.enableCache) {
      await apiService.initializeUserCache(userId);
      console.log('✅ User cache warmed up');
    }

    showSuccess('Successfully logged in', 'Welcome!');
  }

  // User logout integration
  async handleUserLogout(): Promise<void> {
    // Disconnect WebSocket
    if (websocketService.isConnected()) {
      websocketService.disconnect();
      console.log('✅ WebSocket disconnected');
    }

    // Clear cache
    cacheService.clear();
    console.log('✅ Cache cleared');

    // Clear authentication data
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');

    showInfo('Successfully logged out', 'Goodbye!');
  }

  // Data synchronization - force refresh all cached data
  async syncAllData(): Promise<void> {
    console.log('🔄 Synchronizing all data with backend...');
    
    try {
      // Clear all caches
      cacheService.clear();
      
      // Trigger data refresh for critical endpoints
      const userData = localStorage.getItem('user_data');
      if (userData) {
        const user = JSON.parse(userData);
        await apiService.initializeUserCache(user.id);
      }
      
      showSuccess('Data synchronized successfully', 'Sync Complete');
      console.log('✅ Data synchronization completed');
    } catch (error) {
      showError('Failed to synchronize data', 'Sync Error');
      console.error('❌ Data synchronization failed:', error);
    }
  }

  // Get system status and statistics
  getSystemStatus(): {
    initialized: boolean;
    services: {
      api: { connected: boolean; stats?: any };
      cache: { enabled: boolean; stats?: any };
      webSocket: { connected: boolean; stats?: any };
      errorHandling: { enabled: boolean; stats?: any };
    };
  } {
    return {
      initialized: this.initialized,
      services: {
        api: {
          connected: true, // API service is always available if initialized
          stats: apiService.getCacheStats?.()
        },
        cache: {
          enabled: this.config.enableCache,
          stats: this.config.enableCache ? cacheService.getStats() : null
        },
        webSocket: {
          connected: websocketService.isConnected(),
          stats: websocketService.getStats()
        },
        errorHandling: {
          enabled: this.config.enableErrorHandling,
          stats: this.config.enableErrorHandling ? errorService.getErrorStats() : null
        }
      }
    };
  }

  // Cleanup all services
  cleanup(): void {
    console.log('🧹 Cleaning up integration services...');
    
    // Disconnect WebSocket
    websocketService.disconnect();
    
    // Clear cache
    cacheService.clear();
    
    // Clear error history
    errorService.clearHistory();
    
    // Remove global methods
    delete (window as any).showSuccess;
    delete (window as any).showError;
    delete (window as any).showWarning;
    delete (window as any).showInfo;
    delete (window as any).showNotification;
    
    this.initialized = false;
    console.log('✅ Integration services cleanup completed');
  }

  // Configuration management
  updateConfig(config: Partial<IntegrationConfig>): void {
    this.config = { ...this.config, ...config };
    console.log('Integration config updated:', this.config);
  }

  getConfig(): IntegrationConfig {
    return { ...this.config };
  }

  // Health check for all services
  async healthCheck(): Promise<{
    overall: 'healthy' | 'degraded' | 'unhealthy';
    services: Record<string, 'healthy' | 'unhealthy' | 'disabled'>;
    issues: string[];
  }> {
    const issues: string[] = [];
    const services: Record<string, 'healthy' | 'unhealthy' | 'disabled'> = {};

    // Check API service
    try {
      await apiService.healthCheck();
      services.api = 'healthy';
    } catch (error) {
      services.api = 'unhealthy';
      issues.push('API service not responding');
    }

    // Check cache service
    services.cache = this.config.enableCache ? 'healthy' : 'disabled';

    // Check WebSocket service
    if (this.config.enableWebSocket) {
      services.webSocket = websocketService.isConnected() ? 'healthy' : 'unhealthy';
      if (!websocketService.isConnected()) {
        issues.push('WebSocket connection lost');
      }
    } else {
      services.webSocket = 'disabled';
    }

    // Check error handling
    services.errorHandling = this.config.enableErrorHandling ? 'healthy' : 'disabled';

    // Determine overall health
    const unhealthyServices = Object.values(services).filter(status => status === 'unhealthy').length;
    const overall = unhealthyServices === 0 ? 'healthy' : 
                   unhealthyServices <= 1 ? 'degraded' : 'unhealthy';

    return {
      overall,
      services,
      issues
    };
  }
}

export const integrationService = new IntegrationService();
export default integrationService;

// React hook for integration status (to be used in components with React import)
export function createIntegrationStatusHook() {
  return function useIntegrationStatus() {
    // This should be implemented in React components with proper React import
    return integrationService.getSystemStatus();
  };
}

// Utility functions for common operations
export const syncData = () => integrationService.syncAllData();
export const getSystemHealth = () => integrationService.healthCheck();
export const getSystemStatus = () => integrationService.getSystemStatus();