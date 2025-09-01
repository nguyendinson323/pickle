import { io, Socket } from 'socket.io-client';

export interface NotificationData {
  id: string;
  type: 'tournament' | 'player_request' | 'match' | 'system' | 'message';
  title: string;
  message: string;
  data?: any;
  userId: number;
  read: boolean;
  createdAt: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actions?: Array<{
    type: 'view' | 'accept' | 'reject' | 'join' | 'custom';
    label: string;
    url?: string;
    handler?: () => void;
  }>;
}

export interface NotificationSettings {
  tournaments: boolean;
  playerRequests: boolean;
  matches: boolean;
  messages: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  sound: boolean;
}

class NotificationService {
  private socket: Socket | null = null;
  private listeners: Map<string, Array<(data: any) => void>> = new Map();
  private notifications: NotificationData[] = [];
  private settings: NotificationSettings = {
    tournaments: true,
    playerRequests: true,
    matches: true,
    messages: true,
    emailNotifications: true,
    pushNotifications: true,
    sound: true
  };

  // Initialize WebSocket connection
  init(userId: number, token: string): void {
    if (this.socket?.connected) {
      return;
    }

    // In production, this would connect to your WebSocket server
    const socketUrl = process.env.NODE_ENV === 'production' 
      ? 'wss://your-api-domain.com' 
      : 'ws://localhost:3001';

    this.socket = io(socketUrl, {
      auth: {
        token,
        userId
      },
      transports: ['websocket', 'polling']
    });

    this.setupSocketListeners();
    this.loadNotifications();
  }

  private setupSocketListeners(): void {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('Notification service connected');
      this.emit('connected', true);
    });

    this.socket.on('disconnect', () => {
      console.log('Notification service disconnected');
      this.emit('connected', false);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.emit('error', error);
    });

    // Notification events
    this.socket.on('notification', (data: NotificationData) => {
      this.handleNewNotification(data);
    });

    this.socket.on('notification_read', (notificationId: string) => {
      this.markAsRead(notificationId, false);
    });

    this.socket.on('bulk_notifications', (notifications: NotificationData[]) => {
      this.notifications = notifications;
      this.emit('notifications_updated', this.notifications);
    });

    // Tournament-specific events
    this.socket.on('tournament_created', (data) => {
      this.createNotification({
        type: 'tournament',
        title: 'New Tournament Available',
        message: `${data.tournament.name} is now open for registration`,
        data: data.tournament,
        priority: 'medium',
        actions: [
          { type: 'view', label: 'View Tournament', url: `/tournaments/${data.tournament.id}` },
          { type: 'join', label: 'Register Now', url: `/tournaments/${data.tournament.id}/register` }
        ]
      });
    });

    this.socket.on('tournament_started', (data) => {
      this.createNotification({
        type: 'tournament',
        title: 'Tournament Started',
        message: `${data.tournament.name} has begun. Check your bracket position.`,
        data: data.tournament,
        priority: 'high',
        actions: [
          { type: 'view', label: 'View Bracket', url: `/tournaments/${data.tournament.id}/bracket` }
        ]
      });
    });

    this.socket.on('match_scheduled', (data) => {
      this.createNotification({
        type: 'match',
        title: 'Match Scheduled',
        message: `Your match against ${data.opponent} is scheduled for ${data.scheduledTime}`,
        data: data,
        priority: 'high',
        actions: [
          { type: 'view', label: 'View Match Details', url: `/tournaments/${data.tournamentId}/match/${data.matchId}` }
        ]
      });
    });

    // Player connection events
    this.socket.on('player_request_received', (data) => {
      this.createNotification({
        type: 'player_request',
        title: 'New Player Connection Request',
        message: `${data.player.name} wants to connect with you`,
        data: data,
        priority: 'medium',
        actions: [
          { type: 'accept', label: 'Accept' },
          { type: 'reject', label: 'Decline' },
          { type: 'view', label: 'View Profile', url: `/players/${data.player.id}` }
        ]
      });
    });

    this.socket.on('player_request_accepted', (data) => {
      this.createNotification({
        type: 'player_request',
        title: 'Connection Request Accepted',
        message: `${data.player.name} accepted your connection request`,
        data: data,
        priority: 'medium',
        actions: [
          { type: 'view', label: 'Start Chat', url: `/messages/${data.player.id}` }
        ]
      });
    });

    // System notifications
    this.socket.on('system_maintenance', (data) => {
      this.createNotification({
        type: 'system',
        title: 'Scheduled Maintenance',
        message: data.message,
        data: data,
        priority: 'urgent'
      });
    });
  }

  private async loadNotifications(): Promise<void> {
    try {
      // In a real implementation, this would fetch from your API
      const mockNotifications: NotificationData[] = [
        {
          id: '1',
          type: 'tournament',
          title: 'Mexico City Open Registration',
          message: 'Registration is now open for the Mexico City Open Championship',
          userId: 1,
          read: false,
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          priority: 'medium',
          actions: [
            { type: 'view', label: 'View Tournament', url: '/tournaments/1' },
            { type: 'join', label: 'Register', url: '/tournaments/1/register' }
          ]
        },
        {
          id: '2',
          type: 'player_request',
          title: 'New Connection Request',
          message: 'Carlos Martinez wants to connect with you',
          userId: 1,
          read: false,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          priority: 'high',
          actions: [
            { type: 'accept', label: 'Accept' },
            { type: 'reject', label: 'Decline' }
          ]
        },
        {
          id: '3',
          type: 'match',
          title: 'Match Reminder',
          message: 'Your quarter-final match starts in 30 minutes',
          userId: 1,
          read: true,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          priority: 'urgent'
        }
      ];

      this.notifications = mockNotifications;
      this.emit('notifications_loaded', this.notifications);
    } catch (error) {
      console.error('Failed to load notifications:', error);
      this.emit('error', error);
    }
  }

  private handleNewNotification(notification: NotificationData): void {
    // Check if notifications are enabled for this type
    if (!this.shouldShowNotification(notification.type)) {
      return;
    }

    this.notifications.unshift(notification);
    this.emit('notification_received', notification);
    this.emit('notifications_updated', this.notifications);

    // Show browser notification if enabled
    if (this.settings.pushNotifications && 'Notification' in window) {
      this.showBrowserNotification(notification);
    }

    // Play sound if enabled
    if (this.settings.sound) {
      this.playNotificationSound(notification.priority);
    }
  }

  private shouldShowNotification(type: NotificationData['type']): boolean {
    switch (type) {
      case 'tournament':
        return this.settings.tournaments;
      case 'player_request':
        return this.settings.playerRequests;
      case 'match':
        return this.settings.matches;
      case 'message':
        return this.settings.messages;
      case 'system':
        return true; // Always show system notifications
      default:
        return true;
    }
  }

  private showBrowserNotification(notification: NotificationData): void {
    if (Notification.permission === 'granted') {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/logo-192x192.png',
        badge: '/logo-192x192.png',
        tag: notification.id,
        requireInteraction: notification.priority === 'urgent',
        silent: !this.settings.sound
      });

      browserNotification.onclick = () => {
        window.focus();
        if (notification.actions?.[0]?.url) {
          window.location.href = notification.actions[0].url;
        }
        browserNotification.close();
      };

      // Auto-close after 5 seconds (except urgent notifications)
      if (notification.priority !== 'urgent') {
        setTimeout(() => browserNotification.close(), 5000);
      }
    }
  }

  private playNotificationSound(priority: NotificationData['priority']): void {
    try {
      const audio = new Audio();
      switch (priority) {
        case 'urgent':
          audio.src = '/sounds/urgent.mp3';
          break;
        case 'high':
          audio.src = '/sounds/high.mp3';
          break;
        default:
          audio.src = '/sounds/default.mp3';
          break;
      }
      audio.play().catch(() => {
        // Silently fail if audio can't play
      });
    } catch (error) {
      // Silently fail if audio is not supported
    }
  }

  private createNotification(partial: Partial<NotificationData>): void {
    const notification: NotificationData = {
      id: Date.now().toString(),
      userId: 0, // Will be set by the server
      read: false,
      createdAt: new Date().toISOString(),
      priority: 'medium',
      ...partial
    } as NotificationData;

    this.handleNewNotification(notification);
  }

  // Public methods
  getNotifications(): NotificationData[] {
    return this.notifications;
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  markAsRead(notificationId: string, syncToServer: boolean = true): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.emit('notifications_updated', this.notifications);

      if (syncToServer && this.socket) {
        this.socket.emit('mark_notification_read', notificationId);
      }
    }
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
    this.emit('notifications_updated', this.notifications);

    if (this.socket) {
      this.socket.emit('mark_all_notifications_read');
    }
  }

  deleteNotification(notificationId: string): void {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.emit('notifications_updated', this.notifications);

    if (this.socket) {
      this.socket.emit('delete_notification', notificationId);
    }
  }

  clearAllNotifications(): void {
    this.notifications = [];
    this.emit('notifications_updated', this.notifications);

    if (this.socket) {
      this.socket.emit('clear_all_notifications');
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      return 'denied';
    }

    if (Notification.permission === 'default') {
      return await Notification.requestPermission();
    }

    return Notification.permission;
  }

  updateSettings(newSettings: Partial<NotificationSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    
    if (this.socket) {
      this.socket.emit('update_notification_settings', this.settings);
    }

    // Save to localStorage
    localStorage.setItem('notification_settings', JSON.stringify(this.settings));
  }

  getSettings(): NotificationSettings {
    // Load from localStorage if available
    const stored = localStorage.getItem('notification_settings');
    if (stored) {
      try {
        this.settings = { ...this.settings, ...JSON.parse(stored) };
      } catch (error) {
        // Use default settings if parsing fails
      }
    }
    return this.settings;
  }

  // Event system
  on(event: string, callback: (data: any) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: (data: any) => void): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in notification event listener:', error);
        }
      });
    }
  }

  // Cleanup
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.listeners.clear();
  }

  // Test methods (for development)
  sendTestNotification(type: NotificationData['type'] = 'system'): void {
    const testNotifications = {
      tournament: {
        title: 'Test Tournament Notification',
        message: 'This is a test tournament notification',
        priority: 'medium' as const
      },
      player_request: {
        title: 'Test Player Request',
        message: 'This is a test player connection request',
        priority: 'high' as const
      },
      match: {
        title: 'Test Match Notification',
        message: 'This is a test match notification',
        priority: 'urgent' as const
      },
      system: {
        title: 'Test System Notification',
        message: 'This is a test system notification',
        priority: 'medium' as const
      },
      message: {
        title: 'Test Message Notification',
        message: 'This is a test message notification',
        priority: 'low' as const
      }
    };

    this.createNotification({
      type,
      ...testNotifications[type]
    });
  }
}

// Singleton instance
export const notificationService = new NotificationService();
export default notificationService;