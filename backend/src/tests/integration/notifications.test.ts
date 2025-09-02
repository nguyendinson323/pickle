import request from 'supertest';
import { Server } from 'http';
import { io as Client, Socket } from 'socket.io-client';
import app from '../../app';
import SocketService from '../../services/socketService';
import NotificationService from '../../services/notificationService';
import { sequelize } from '../../config/database';
import { User, Notification, NotificationPreferences, NotificationTemplate } from '../../models';
import jwt from 'jsonwebtoken';

describe('Notifications Integration Tests', () => {
  let server: Server;
  let socketService: SocketService;
  let notificationService: NotificationService;
  let testUser: User;
  let adminUser: User;
  let testUserToken: string;
  let adminToken: string;
  let clientSocket: Socket;
  let testNotification: Notification;
  let testPreferences: NotificationPreferences;

  beforeAll(async () => {
    // Start server
    server = app.listen(0);
    const port = (server.address() as any).port;
    
    // Initialize services
    socketService = new SocketService(server);
    notificationService = new NotificationService();
    
    // Sync database
    await sequelize.sync({ force: true });

    // Create test users
    testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword',
      role: 'player',
      firstName: 'Test',
      lastName: 'User'
    });

    adminUser = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'hashedpassword',
      role: 'admin',
      firstName: 'Admin',
      lastName: 'User'
    });

    // Create JWT tokens
    testUserToken = jwt.sign(
      { id: testUser.id, username: testUser.username, role: testUser.role },
      process.env.JWT_SECRET || 'test-secret'
    );

    adminToken = jwt.sign(
      { id: adminUser.id, username: adminUser.username, role: adminUser.role },
      process.env.JWT_SECRET || 'test-secret'
    );

    // Connect socket client
    clientSocket = Client(`http://localhost:${port}`, {
      auth: { token: testUserToken },
      transports: ['websocket']
    });

    // Wait for connection
    await new Promise(resolve => clientSocket.on('connect', resolve));

    // Create notification template
    await NotificationTemplate.create({
      name: 'Test Template',
      type: 'tournament_reminder',
      category: 'tournament',
      templates: {
        inApp: {
          title: 'Tournament Reminder',
          message: 'Your tournament {{tournamentName}} starts at {{startTime}}',
          actionText: 'View Tournament'
        },
        email: {
          subject: 'Tournament Reminder - {{tournamentName}}',
          htmlContent: '<p>Your tournament {{tournamentName}} starts at {{startTime}}</p>',
          textContent: 'Your tournament {{tournamentName}} starts at {{startTime}}'
        },
        sms: {
          message: 'Tournament {{tournamentName}} starts at {{startTime}}'
        },
        push: {
          title: 'Tournament Reminder',
          body: 'Your tournament {{tournamentName}} starts soon!'
        }
      },
      variables: [
        {
          name: 'tournamentName',
          description: 'Name of the tournament',
          type: 'string',
          required: true
        },
        {
          name: 'startTime',
          description: 'Tournament start time',
          type: 'date',
          required: true
        }
      ],
      isActive: true,
      version: 1
    });
  });

  afterAll(async () => {
    clientSocket.disconnect();
    await socketService.gracefulShutdown();
    server.close();
    await sequelize.close();
  });

  describe('Notification Preferences', () => {
    it('should create default notification preferences for new user', async () => {
      const preferences = await notificationService.getUserPreferences(testUser.id.toString());
      
      expect(preferences).toBeDefined();
      expect(preferences.globalEnabled).toBe(true);
      expect(preferences.quietHoursEnabled).toBe(false);
      expect(preferences.preferences).toBeDefined();
      expect(preferences.preferences.tournaments).toBeDefined();
      
      testPreferences = preferences;
    });

    it('should get notification preferences via API', async () => {
      const response = await request(app)
        .get('/api/notifications/preferences')
        .set('Authorization', `Bearer ${testUserToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.globalEnabled).toBe(true);
    });

    it('should update notification preferences via API', async () => {
      const response = await request(app)
        .put('/api/notifications/preferences')
        .set('Authorization', `Bearer ${testUserToken}`)
        .send({
          quietHoursEnabled: true,
          quietHoursStart: '23:00',
          quietHoursEnd: '07:00',
          preferences: {
            tournaments: {
              registration_open: { inApp: true, email: false, sms: true, push: true }
            }
          }
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.quietHoursEnabled).toBe(true);
      expect(response.body.data.quietHoursStart).toBe('23:00');
    });
  });

  describe('Notification Creation and Delivery', () => {
    it('should send notification via service with template', async () => {
      const notification = await notificationService.sendNotification({
        userId: testUser.id.toString(),
        type: 'tournament',
        category: 'info',
        templateType: 'tournament_reminder',
        data: {
          tournamentName: 'Spring Championship',
          startTime: '10:00 AM'
        },
        actionUrl: '/tournaments/123',
        relatedEntityType: 'tournament',
        relatedEntityId: '123'
      });

      expect(notification).toBeDefined();
      expect(notification.title).toContain('Tournament Reminder');
      expect(notification.message).toContain('Spring Championship');
      expect(notification.message).toContain('10:00 AM');
      
      testNotification = notification;
    });

    it('should receive real-time notification via socket', (done) => {
      clientSocket.on('notification:new', (data: any) => {
        expect(data.notification.type).toBe('system');
        expect(data.notification.title).toBe('Test Real-time Notification');
        done();
      });

      // Send notification that should trigger socket event
      notificationService.sendNotification({
        userId: testUser.id.toString(),
        type: 'system',
        category: 'info',
        title: 'Test Real-time Notification',
        message: 'This is a test notification'
      });
    });

    it('should send notification via API (admin only)', async () => {
      const response = await request(app)
        .post('/api/notifications')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          userId: testUser.id.toString(),
          type: 'system',
          category: 'warning',
          title: 'API Test Notification',
          message: 'This notification was sent via API',
          actionUrl: '/dashboard'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('API Test Notification');
    });

    it('should reject notification creation for non-admin users', async () => {
      const response = await request(app)
        .post('/api/notifications')
        .set('Authorization', `Bearer ${testUserToken}`)
        .send({
          userId: testUser.id.toString(),
          type: 'system',
          category: 'info',
          title: 'Unauthorized',
          message: 'This should fail'
        });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Insufficient permissions');
    });
  });

  describe('Notification Management', () => {
    it('should get user notifications via API', async () => {
      const response = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${testUserToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.notifications.length).toBeGreaterThan(0);
      expect(response.body.data.unreadCount).toBeGreaterThan(0);
    });

    it('should filter notifications by type', async () => {
      const response = await request(app)
        .get('/api/notifications')
        .query({ type: 'tournament' })
        .set('Authorization', `Bearer ${testUserToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      
      response.body.data.notifications.forEach((notification: any) => {
        expect(notification.type).toBe('tournament');
      });
    });

    it('should mark notification as read via API', async () => {
      const response = await request(app)
        .post(`/api/notifications/${testNotification.id}/read`)
        .set('Authorization', `Bearer ${testUserToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should mark notification as read via socket', (done) => {
      clientSocket.emit('notification:read', {
        notificationId: testNotification.id
      }, (response: any) => {
        expect(response.success).toBe(true);
        done();
      });
    });

    it('should mark all notifications as read', async () => {
      const response = await request(app)
        .post('/api/notifications/read-all')
        .set('Authorization', `Bearer ${testUserToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should get unread notifications count', async () => {
      const response = await request(app)
        .get('/api/notifications/unread/count')
        .set('Authorization', `Bearer ${testUserToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(typeof response.body.data.count).toBe('number');
    });

    it('should get unread count via socket', (done) => {
      clientSocket.emit('notification:get_unread_count', (response: any) => {
        expect(response.success).toBe(true);
        expect(typeof response.count).toBe('number');
        done();
      });
    });

    it('should delete notification', async () => {
      const response = await request(app)
        .delete(`/api/notifications/${testNotification.id}`)
        .set('Authorization', `Bearer ${testUserToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('Batch Operations', () => {
    it('should send batch notifications (admin only)', async () => {
      const response = await request(app)
        .post('/api/notifications/batch')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          userIds: [testUser.id.toString()],
          type: 'system',
          category: 'info',
          title: 'Batch Notification',
          message: 'This is a batch notification test'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.sent).toBe(1);
      expect(response.body.data.total).toBe(1);
    });

    it('should process scheduled notifications (admin only)', async () => {
      // Create a scheduled notification
      const scheduledTime = new Date(Date.now() - 1000); // 1 second ago
      
      await notificationService.sendNotification({
        userId: testUser.id.toString(),
        type: 'system',
        category: 'info',
        title: 'Scheduled Notification',
        message: 'This notification was scheduled',
        scheduledFor: scheduledTime
      });

      const response = await request(app)
        .post('/api/notifications/process-scheduled')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should cleanup expired notifications (admin only)', async () => {
      // Create an expired notification
      const expiredTime = new Date(Date.now() - 1000); // 1 second ago
      
      await notificationService.sendNotification({
        userId: testUser.id.toString(),
        type: 'system',
        category: 'info',
        title: 'Expired Notification',
        message: 'This notification should be cleaned up',
        expiresAt: expiredTime
      });

      const response = await request(app)
        .post('/api/notifications/cleanup-expired')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('expired notifications cleaned up');
    });
  });

  describe('Notification Templates', () => {
    it('should get notification templates (admin only)', async () => {
      const response = await request(app)
        .get('/api/notifications/templates')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should reject template access for non-admin', async () => {
      const response = await request(app)
        .get('/api/notifications/templates')
        .set('Authorization', `Bearer ${testUserToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });

  describe('Test Notifications', () => {
    it('should send test notification (admin only)', async () => {
      const response = await request(app)
        .post('/api/notifications/test')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          userId: testUser.id.toString(),
          channel: 'inApp',
          title: 'Test Notification',
          message: 'This is a test notification'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Test notification sent via inApp');
    });

    it('should test email channel', async () => {
      const response = await request(app)
        .post('/api/notifications/test')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          userId: testUser.id.toString(),
          channel: 'email',
          title: 'Email Test',
          message: 'This is an email test'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Test notification sent via email');
    });
  });

  describe('Quiet Hours Functionality', () => {
    it('should respect quiet hours for scheduled notifications', async () => {
      // Set quiet hours from 22:00 to 08:00
      await testPreferences.update({
        quietHoursEnabled: true,
        quietHoursStart: '22:00',
        quietHoursEnd: '08:00'
      });

      // Mock current time to be during quiet hours (e.g., 23:00)
      const originalDate = Date;
      const mockDate = new Date();
      mockDate.setHours(23, 0, 0, 0);
      
      global.Date = jest.fn(() => mockDate) as any;
      global.Date.now = jest.fn(() => mockDate.getTime());

      const notification = await notificationService.sendNotification({
        userId: testUser.id.toString(),
        type: 'tournament',
        category: 'info',
        title: 'Quiet Hours Test',
        message: 'This should be scheduled for later'
      });

      expect(notification.isScheduled).toBe(true);
      expect(notification.scheduledFor).toBeDefined();

      // Restore original Date
      global.Date = originalDate;
    });
  });

  describe('Notification Channels', () => {
    it('should send notification to specific channels only', async () => {
      const notification = await notificationService.sendNotification({
        userId: testUser.id.toString(),
        type: 'system',
        category: 'info',
        title: 'Channel Test',
        message: 'Testing specific channels',
        channels: {
          inApp: true,
          email: true,
          sms: false,
          push: false
        }
      });

      expect(notification.channels.inApp).toBe(true);
      expect(notification.channels.email).toBe(true);
      expect(notification.channels.sms).toBe(false);
      expect(notification.channels.push).toBe(false);
    });

    it('should track delivery status for each channel', async () => {
      const notification = await notificationService.sendNotification({
        userId: testUser.id.toString(),
        type: 'system',
        category: 'info',
        title: 'Delivery Test',
        message: 'Testing delivery tracking',
        channels: {
          inApp: true,
          email: true,
          sms: true,
          push: true
        }
      });

      // Check initial delivery status
      expect(notification.deliveryStatus.inApp.delivered).toBe(true); // In-app is delivered immediately
      expect(notification.deliveryStatus.email.delivered).toBe(true); // Simulated delivery
      expect(notification.deliveryStatus.sms.delivered).toBe(true); // Simulated delivery
      expect(notification.deliveryStatus.push.delivered).toBe(true); // Simulated delivery
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid notification ID', async () => {
      const response = await request(app)
        .post('/api/notifications/invalid-uuid/read')
        .set('Authorization', `Bearer ${testUserToken}`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should handle unauthorized notification access', async () => {
      const response = await request(app)
        .get('/api/notifications')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
    });

    it('should handle missing required fields in notification creation', async () => {
      const response = await request(app)
        .post('/api/notifications')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          type: 'system',
          category: 'info'
          // Missing userId, title, and message
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should handle invalid time format in preferences', async () => {
      const response = await request(app)
        .put('/api/notifications/preferences')
        .set('Authorization', `Bearer ${testUserToken}`)
        .send({
          quietHoursStart: 'invalid-time',
          quietHoursEnd: '08:00'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});

export default {};