// Smart Caching Service for Frontend-Backend Integration
import { ApiResponse } from '../types/api';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
  key: string;
}

interface CacheOptions {
  ttl?: number; // Default TTL in milliseconds
  maxSize?: number; // Maximum number of entries
  enableLocalStorage?: boolean; // Persist to localStorage
  invalidatePattern?: string; // Pattern for cache invalidation
}

class CacheService {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultOptions: Required<CacheOptions> = {
    ttl: 5 * 60 * 1000, // 5 minutes default
    maxSize: 100,
    enableLocalStorage: true,
    invalidatePattern: ''
  };

  private getStorageKey(key: string): string {
    return `cache_${key}`;
  }

  // Generate cache key from URL and params
  private generateKey(url: string, params?: any): string {
    const paramStr = params ? JSON.stringify(params) : '';
    return `${url}${paramStr ? '_' + btoa(paramStr).slice(0, 10) : ''}`;
  }

  // Set data in cache
  set<T>(key: string, data: T, options?: Partial<CacheOptions>): void {
    const opts = { ...this.defaultOptions, ...options };
    
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: opts.ttl,
      key
    };

    // Remove old entries if cache is full
    if (this.cache.size >= opts.maxSize) {
      const oldestKey = Array.from(this.cache.keys())[0];
      this.cache.delete(oldestKey);
      if (opts.enableLocalStorage) {
        localStorage.removeItem(this.getStorageKey(oldestKey));
      }
    }

    this.cache.set(key, entry);

    // Persist to localStorage if enabled
    if (opts.enableLocalStorage) {
      try {
        localStorage.setItem(this.getStorageKey(key), JSON.stringify(entry));
      } catch (error) {
        console.warn('Failed to persist cache to localStorage:', error);
      }
    }
  }

  // Get data from cache
  get<T>(key: string): T | null {
    let entry = this.cache.get(key);

    // Try to get from localStorage if not in memory
    if (!entry && this.defaultOptions.enableLocalStorage) {
      try {
        const stored = localStorage.getItem(this.getStorageKey(key));
        if (stored) {
          entry = JSON.parse(stored) as CacheEntry<T>;
          // Restore to memory cache
          this.cache.set(key, entry);
        }
      } catch (error) {
        console.warn('Failed to retrieve cache from localStorage:', error);
      }
    }

    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.delete(key);
      return null;
    }

    return entry.data;
  }

  // Delete specific cache entry
  delete(key: string): void {
    this.cache.delete(key);
    if (this.defaultOptions.enableLocalStorage) {
      localStorage.removeItem(this.getStorageKey(key));
    }
  }

  // Clear cache by pattern
  invalidate(pattern: string): void {
    const keysToDelete = Array.from(this.cache.keys()).filter(key => 
      key.includes(pattern) || key.match(pattern)
    );

    keysToDelete.forEach(key => this.delete(key));
  }

  // Clear all cache
  clear(): void {
    this.cache.clear();
    if (this.defaultOptions.enableLocalStorage) {
      // Remove all cache entries from localStorage
      const keysToRemove = Object.keys(localStorage).filter(key => 
        key.startsWith('cache_')
      );
      keysToRemove.forEach(key => localStorage.removeItem(key));
    }
  }

  // Check if data is cached and valid
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  // Get cache statistics
  getStats(): { size: number; memorySize: number; storageSize: number } {
    const memorySize = this.cache.size;
    let storageSize = 0;

    if (this.defaultOptions.enableLocalStorage) {
      storageSize = Object.keys(localStorage).filter(key => 
        key.startsWith('cache_')
      ).length;
    }

    return {
      size: memorySize,
      memorySize,
      storageSize
    };
  }

  // Cache-aware API call wrapper
  async cachedFetch<T>(
    fetcher: () => Promise<ApiResponse<T>>,
    cacheKey: string,
    options?: Partial<CacheOptions>
  ): Promise<ApiResponse<T>> {
    // Try to get from cache first
    const cached = this.get<ApiResponse<T>>(cacheKey);
    if (cached) {
      console.debug(`Cache hit for key: ${cacheKey}`);
      return cached;
    }

    console.debug(`Cache miss for key: ${cacheKey}`);

    try {
      // Fetch fresh data
      const response = await fetcher();
      
      // Only cache successful responses
      if (response.success) {
        this.set(cacheKey, response, options);
      }

      return response;
    } catch (error) {
      console.error('Error in cached fetch:', error);
      throw error;
    }
  }

  // Generate cache key for API calls
  createApiKey(method: string, url: string, params?: any): string {
    return this.generateKey(`${method.toUpperCase()}_${url}`, params);
  }

  // Smart invalidation for related data
  invalidateByEntity(entity: 'tournament' | 'user' | 'payment' | 'notification'): void {
    switch (entity) {
      case 'tournament':
        this.invalidate('tournament');
        this.invalidate('search');
        this.invalidate('dashboard');
        break;
      case 'user':
        this.invalidate('user');
        this.invalidate('admin');
        this.invalidate('dashboard');
        break;
      case 'payment':
        this.invalidate('payment');
        this.invalidate('dashboard');
        break;
      case 'notification':
        this.invalidate('notification');
        break;
    }
  }

  // Preload data for common operations
  async preload(keys: Array<{ key: string; fetcher: () => Promise<any> }>): Promise<void> {
    const promises = keys.map(async ({ key, fetcher }) => {
      if (!this.has(key)) {
        try {
          const data = await fetcher();
          this.set(key, data);
        } catch (error) {
          console.warn(`Failed to preload data for key: ${key}`, error);
        }
      }
    });

    await Promise.allSettled(promises);
  }

  // Background refresh for critical data
  scheduleRefresh(
    key: string,
    fetcher: () => Promise<any>,
    interval: number = 5 * 60 * 1000 // 5 minutes
  ): () => void {
    const refreshInterval = setInterval(async () => {
      try {
        console.debug(`Background refresh for key: ${key}`);
        const data = await fetcher();
        this.set(key, data);
      } catch (error) {
        console.warn(`Background refresh failed for key: ${key}`, error);
      }
    }, interval);

    // Return cleanup function
    return () => clearInterval(refreshInterval);
  }

  // Cache warming for user session
  async warmup(userId: number): Promise<void> {
    const commonKeys = [
      {
        key: `user_${userId}_dashboard`,
        fetcher: async () => {
          const { default: apiService } = await import('./api');
          return apiService.get('/dashboard');
        }
      },
      {
        key: `user_${userId}_notifications`,
        fetcher: async () => {
          const { default: apiService } = await import('./api');
          return apiService.get('/notifications');
        }
      }
    ];

    await this.preload(commonKeys);
  }
}

export const cacheService = new CacheService();
export default cacheService;

// Cache decorators for easy integration
export function cached(
  keyGenerator: (...args: any[]) => string,
  options?: Partial<CacheOptions>
) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = keyGenerator(...args);
      
      return cacheService.cachedFetch(
        () => originalMethod.apply(this, args),
        cacheKey,
        options
      );
    };

    return descriptor;
  };
}

// Usage example:
// @cached((userId) => `user_${userId}_profile`, { ttl: 10 * 60 * 1000 })
// async getUserProfile(userId: number) { ... }