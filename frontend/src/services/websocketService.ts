// WebSocket Service for Real-time Frontend-Backend Synchronization
import { WSMessage } from '../types/api';
import cacheService from './cacheService';
import errorService from './errorService';

export type WebSocketEventType = 
  | 'notification' 
  | 'tournament_update' 
  | 'match_result' 
  | 'user_status' 
  | 'system_message'
  | 'payment_status';

export interface WebSocketConfig {
  url: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
  enableAutoReconnect?: boolean;
}

export interface WebSocketListener {
  id: string;
  event: WebSocketEventType;
  callback: (data: any) => void;
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private config: Required<WebSocketConfig>;
  private listeners: Map<WebSocketEventType, WebSocketListener[]> = new Map();
  private reconnectCount = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private isConnecting = false;
  private userId: number | null = null;

  constructor() {
    this.config = {
      url: this.getWebSocketUrl(),
      reconnectInterval: 5000,
      maxReconnectAttempts: 5,
      heartbeatInterval: 30000,
      enableAutoReconnect: true
    };
  }

  private getWebSocketUrl(): string {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    return `${protocol}//${host}/ws`;
  }

  // Initialize WebSocket connection
  async connect(userId: number, token: string): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    if (this.isConnecting) {
      console.log('WebSocket connection already in progress');
      return;
    }

    this.userId = userId;
    this.isConnecting = true;

    try {
      await this.createConnection(token);
    } catch (error) {
      this.isConnecting = false;
      errorService.handleError(error, { userAction: 'WebSocket connection' });
      throw error;
    }
  }

  private async createConnection(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl = `${this.config.url}?token=${token}&userId=${this.userId}`;
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.isConnecting = false;
          this.reconnectCount = 0;
          this.startHeartbeat();
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WSMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason);
          this.cleanup();
          
          if (this.config.enableAutoReconnect && !event.wasClean) {
            this.scheduleReconnect(token);
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.isConnecting = false;
          reject(error);
        };

        // Connection timeout
        setTimeout(() => {
          if (this.ws?.readyState === WebSocket.CONNECTING) {
            this.ws.close();
            reject(new Error('WebSocket connection timeout'));
          }
        }, 10000);

      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  // Handle incoming WebSocket messages
  private handleMessage(message: WSMessage): void {
    console.debug('WebSocket message received:', message);

    // Update cache based on message type
    this.updateCacheFromMessage(message);

    // Notify listeners
    const eventListeners = this.listeners.get(message.type) || [];
    eventListeners.forEach(listener => {
      try {
        listener.callback(message.payload);
      } catch (error) {
        console.error(`Error in WebSocket listener ${listener.id}:`, error);
      }
    });

    // Handle system messages
    if (message.type === 'system_message') {
      this.handleSystemMessage(message.payload);
    }
  }

  // Update cache based on WebSocket messages
  private updateCacheFromMessage(message: WSMessage): void {
    switch (message.type) {
      case 'tournament_update':
        cacheService.invalidateByEntity('tournament');
        break;
      case 'notification':
        cacheService.invalidateByEntity('notification');
        break;
      case 'user_status':
        cacheService.invalidateByEntity('user');
        break;
      case 'payment_status':
        cacheService.invalidateByEntity('payment');
        break;
    }
  }

  // Handle system messages
  private handleSystemMessage(payload: any): void {
    switch (payload.action) {
      case 'reload_page':
        if (confirm('The application has been updated. Reload the page?')) {
          window.location.reload();
        }
        break;
      case 'force_logout':
        this.disconnect();
        localStorage.clear();
        window.location.href = '/login';
        break;
      case 'maintenance_mode':
        errorService.handleError(
          { error: 'The application is currently under maintenance. Please try again later.' },
          { userAction: 'System maintenance' }
        );
        break;
    }
  }

  // Subscribe to WebSocket events
  subscribe(
    event: WebSocketEventType, 
    callback: (data: any) => void,
    id?: string
  ): string {
    const listenerId = id || `listener_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }

    this.listeners.get(event)!.push({
      id: listenerId,
      event,
      callback
    });

    return listenerId;
  }

  // Unsubscribe from WebSocket events
  unsubscribe(event: WebSocketEventType, listenerId: string): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.findIndex(listener => listener.id === listenerId);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  // Send message through WebSocket
  send(type: WebSocketEventType, payload: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const message: WSMessage = {
        type,
        payload,
        timestamp: new Date().toISOString(),
        userId: this.userId || undefined
      };

      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected. Message not sent:', { type, payload });
    }
  }

  // Disconnect WebSocket
  disconnect(): void {
    this.config.enableAutoReconnect = false;
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
    }

    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
    }

    this.cleanup();
  }

  // Check connection status
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  // Get connection state
  getConnectionState(): 'connecting' | 'connected' | 'disconnected' | 'error' {
    if (!this.ws) return 'disconnected';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CLOSING:
      case WebSocket.CLOSED:
        return 'disconnected';
      default:
        return 'error';
    }
  }

  // Schedule reconnection
  private scheduleReconnect(token: string): void {
    if (this.reconnectCount >= this.config.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      errorService.handleError(
        { error: 'Lost connection to server. Please refresh the page.' },
        { userAction: 'WebSocket reconnection failed' }
      );
      return;
    }

    this.reconnectCount++;
    const delay = this.config.reconnectInterval * Math.pow(1.5, this.reconnectCount - 1);

    console.log(`Scheduling WebSocket reconnection in ${delay}ms (attempt ${this.reconnectCount})`);

    this.reconnectTimer = setTimeout(async () => {
      try {
        await this.createConnection(token);
      } catch (error) {
        console.error('Reconnection failed:', error);
      }
    }, delay);
  }

  // Start heartbeat to keep connection alive
  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send('system_message', { action: 'ping' });
      }
    }, this.config.heartbeatInterval);
  }

  // Clean up resources
  private cleanup(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }

    this.ws = null;
    this.isConnecting = false;
  }

  // Get statistics
  getStats(): {
    connected: boolean;
    reconnectCount: number;
    listenersCount: number;
    messagesSent: number;
    messagesReceived: number;
  } {
    const listenersCount = Array.from(this.listeners.values())
      .reduce((total, listeners) => total + listeners.length, 0);

    return {
      connected: this.isConnected(),
      reconnectCount: this.reconnectCount,
      listenersCount,
      messagesSent: 0, // Would need to track this
      messagesReceived: 0 // Would need to track this
    };
  }

  // Configuration methods
  updateConfig(config: Partial<WebSocketConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getConfig(): WebSocketConfig {
    return { ...this.config };
  }
}

export const websocketService = new WebSocketService();
export default websocketService;

// React hook for easy WebSocket usage (import React in components that use this)
export function createWebSocketHook() {
  return function useWebSocket(
    event: WebSocketEventType,
    callback: (data: any) => void,
    deps: any[] = []
  ): { connected: boolean; send: (data: any) => void } {
    // This function should be used in React components with proper React import
    throw new Error('useWebSocket hook must be implemented in component files with React import');
  };
}

// Utility function to check if WebSocket is supported
export function isWebSocketSupported(): boolean {
  return typeof WebSocket !== 'undefined';
}