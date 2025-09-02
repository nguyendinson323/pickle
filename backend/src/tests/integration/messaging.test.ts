import request from 'supertest';
import { Server } from 'http';
import { io as Client, Socket } from 'socket.io-client';
import app from '../../app';
import SocketService from '../../services/socketService';
import sequelize from '../../config/database';
import { User, Conversation, Message, Notification } from '../../models';
import NotificationPreferences from '../../models/NotificationPreferences';
import jwt from 'jsonwebtoken';

describe('Messaging Integration Tests', () => {
  let server: Server;
  let socketService: SocketService;
  let testUser1: User;
  let testUser2: User;
  let testUser1Token: string;
  let testUser2Token: string;
  let clientSocket1: Socket;
  let clientSocket2: Socket;
  let testConversation: Conversation;

  beforeAll(async () => {
    // Start server
    server = app.listen(0);
    const port = (server.address() as any).port;
    
    // Initialize socket service
    socketService = new SocketService(server);
    
    // Sync database
    await sequelize.sync({ force: true });

    // Create test users
    testUser1 = await User.create({
      username: 'testuser1',
      email: 'test1@example.com',
      password: 'hashedpassword',
      role: 'player',
      firstName: 'Test',
      lastName: 'User1'
    });

    testUser2 = await User.create({
      username: 'testuser2',
      email: 'test2@example.com',
      password: 'hashedpassword',
      role: 'player',
      firstName: 'Test',
      lastName: 'User2'
    });

    // Create JWT tokens
    testUser1Token = jwt.sign(
      { id: testUser1.id, username: testUser1.username, role: testUser1.role },
      process.env.JWT_SECRET || 'test-secret'
    );

    testUser2Token = jwt.sign(
      { id: testUser2.id, username: testUser2.username, role: testUser2.role },
      process.env.JWT_SECRET || 'test-secret'
    );

    // Connect socket clients
    clientSocket1 = Client(`http://localhost:${port}`, {
      auth: { token: testUser1Token },
      transports: ['websocket']
    });

    clientSocket2 = Client(`http://localhost:${port}`, {
      auth: { token: testUser2Token },
      transports: ['websocket']
    });

    // Wait for connections
    await Promise.all([
      new Promise(resolve => clientSocket1.on('connect', resolve)),
      new Promise(resolve => clientSocket2.on('connect', resolve))
    ]);
  });

  afterAll(async () => {
    // Close socket connections
    clientSocket1.disconnect();
    clientSocket2.disconnect();
    
    // Close server
    await socketService.gracefulShutdown();
    server.close();
    
    // Close database connection
    await sequelize.close();
  });

  describe('Conversation Management', () => {
    it('should create a direct conversation via API', async () => {
      const response = await request(app)
        .post('/api/messaging/conversations')
        .set('Authorization', `Bearer ${testUser1Token}`)
        .send({
          type: 'direct',
          participants: [
            { userId: testUser1.id.toString(), role: 'member' },
            { userId: testUser2.id.toString(), role: 'member' }
          ]
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.type).toBe('direct');
      expect(response.body.data.participants).toHaveLength(2);

      testConversation = response.body.data;
    });

    it('should get user conversations', async () => {
      const response = await request(app)
        .get('/api/messaging/conversations')
        .set('Authorization', `Bearer ${testUser1Token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.conversations).toHaveLength(1);
      expect(response.body.data.conversations[0].id).toBe(testConversation.id);
    });

    it('should join conversation via socket', (done) => {
      clientSocket1.emit('conversation:join', { conversationId: testConversation.id }, (response: any) => {
        expect(response.success).toBe(true);
        done();
      });
    });

    it('should create a group conversation', async () => {
      const response = await request(app)
        .post('/api/messaging/conversations')
        .set('Authorization', `Bearer ${testUser1Token}`)
        .send({
          type: 'group',
          name: 'Test Group',
          description: 'A test group conversation',
          participants: [
            { userId: testUser1.id.toString(), role: 'admin' },
            { userId: testUser2.id.toString(), role: 'member' }
          ]
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.type).toBe('group');
      expect(response.body.data.name).toBe('Test Group');
      expect(response.body.data.isGroup).toBe(true);
    });
  });

  describe('Real-time Messaging', () => {
    let testMessage: Message;

    it('should send message via socket and receive by other user', (done) => {
      const messageContent = 'Hello from socket!';
      
      // User2 listens for new message
      clientSocket2.on('message:new', (data: any) => {
        expect(data.message.content).toBe(messageContent);
        expect(data.message.senderId).toBe(testUser1.id.toString());
        expect(data.message.conversationId).toBe(testConversation.id);
        testMessage = data.message;
        done();
      });

      // User1 sends message
      clientSocket1.emit('message:send', {
        conversationId: testConversation.id,
        content: messageContent,
        messageType: 'text'
      }, (response: any) => {
        expect(response.success).toBe(true);
        expect(response.messageId).toBeDefined();
      });
    });

    it('should edit message via socket', (done) => {
      const editedContent = 'Edited message content';

      clientSocket2.on('message:edited', (data: any) => {
        expect(data.messageId).toBe(testMessage.id);
        expect(data.content).toBe(editedContent);
        done();
      });

      clientSocket1.emit('message:edit', {
        messageId: testMessage.id,
        content: editedContent
      }, (response: any) => {
        expect(response.success).toBe(true);
      });
    });

    it('should add reaction to message', (done) => {
      const emoji = '👍';

      clientSocket1.on('message:reaction_added', (data: any) => {
        expect(data.messageId).toBe(testMessage.id);
        expect(data.userId).toBe(testUser2.id.toString());
        expect(data.emoji).toBe(emoji);
        done();
      });

      clientSocket2.emit('message:react', {
        messageId: testMessage.id,
        emoji
      }, (response: any) => {
        expect(response.success).toBe(true);
      });
    });

    it('should mark message as read', (done) => {
      clientSocket1.on('message:read_by', (data: any) => {
        expect(data.messageId).toBe(testMessage.id);
        expect(data.userId).toBe(testUser2.id.toString());
        done();
      });

      clientSocket2.emit('message:read', {
        messageId: testMessage.id
      }, (response: any) => {
        expect(response.success).toBe(true);
      });
    });

    it('should delete message via socket', (done) => {
      clientSocket2.on('message:deleted', (data: any) => {
        expect(data.messageId).toBe(testMessage.id);
        done();
      });

      clientSocket1.emit('message:delete', {
        messageId: testMessage.id
      }, (response: any) => {
        expect(response.success).toBe(true);
      });
    });
  });

  describe('Typing Indicators', () => {
    it('should broadcast typing indicators', (done) => {
      clientSocket2.on('typing:user_started', (data: any) => {
        expect(data.userId).toBe(testUser1.id.toString());
        expect(data.conversationId).toBe(testConversation.id);
        done();
      });

      clientSocket1.emit('typing:start', {
        conversationId: testConversation.id
      });
    });

    it('should broadcast stop typing', (done) => {
      clientSocket2.on('typing:user_stopped', (data: any) => {
        expect(data.userId).toBe(testUser1.id.toString());
        expect(data.conversationId).toBe(testConversation.id);
        done();
      });

      clientSocket1.emit('typing:stop', {
        conversationId: testConversation.id
      });
    });
  });

  describe('Message API Endpoints', () => {
    it('should get conversation messages', async () => {
      const response = await request(app)
        .get(`/api/messaging/conversations/${testConversation.id}/messages`)
        .set('Authorization', `Bearer ${testUser1Token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.messages)).toBe(true);
    });

    it('should send message via API', async () => {
      const response = await request(app)
        .post(`/api/messaging/conversations/${testConversation.id}/messages`)
        .set('Authorization', `Bearer ${testUser1Token}`)
        .send({
          content: 'API message test',
          messageType: 'text'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.content).toBe('API message test');
    });

    it('should search messages', async () => {
      const response = await request(app)
        .get('/api/messaging/search/messages')
        .query({ q: 'API message', conversationId: testConversation.id })
        .set('Authorization', `Bearer ${testUser1Token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.messages.length).toBeGreaterThan(0);
    });

    it('should get unread message count', async () => {
      const response = await request(app)
        .get('/api/messaging/messages/unread/count')
        .set('Authorization', `Bearer ${testUser2Token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(typeof response.body.data.count).toBe('number');
    });
  });

  describe('Location and Special Messages', () => {
    it('should send location message via socket', (done) => {
      const locationData = {
        latitude: 40.7128,
        longitude: -74.0060,
        address: 'New York, NY'
      };

      clientSocket2.on('message:new', (data: any) => {
        expect(data.message.messageType).toBe('location');
        expect(data.message.location.latitude).toBe(locationData.latitude);
        expect(data.message.location.longitude).toBe(locationData.longitude);
        done();
      });

      clientSocket1.emit('message:send', {
        conversationId: testConversation.id,
        content: 'Location shared',
        messageType: 'location',
        location: locationData
      });
    });

    it('should send match invite message', (done) => {
      const matchInviteData = {
        courtId: 'court-123',
        facilityId: 'facility-456',
        proposedTime: new Date(),
        duration: 60
      };

      clientSocket2.on('message:new', (data: any) => {
        expect(data.message.messageType).toBe('match_invite');
        expect(data.message.matchInvite.courtId).toBe(matchInviteData.courtId);
        done();
      });

      clientSocket1.emit('message:send', {
        conversationId: testConversation.id,
        content: 'Match invitation',
        messageType: 'match_invite',
        matchInvite: matchInviteData
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid conversation ID', async () => {
      const response = await request(app)
        .get('/api/messaging/conversations/invalid-uuid/messages')
        .set('Authorization', `Bearer ${testUser1Token}`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should handle unauthorized access', async () => {
      const response = await request(app)
        .get('/api/messaging/conversations')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
    });

    it('should handle socket authentication error', (done) => {
      const invalidSocket = Client(`http://localhost:${(server.address() as any).port}`, {
        auth: { token: 'invalid-token' },
        transports: ['websocket']
      });

      invalidSocket.on('connect_error', (error) => {
        expect(error.message).toContain('Authentication error');
        invalidSocket.disconnect();
        done();
      });
    });

    it('should handle sending message to non-existent conversation', (done) => {
      clientSocket1.emit('message:send', {
        conversationId: 'non-existent-id',
        content: 'Test message'
      }, (response: any) => {
        expect(response.error).toBeDefined();
        done();
      });
    });
  });

  describe('Presence Management', () => {
    it('should broadcast user online status', (done) => {
      clientSocket2.on('presence:user_status_changed', (data: any) => {
        if (data.userId === testUser1.id.toString()) {
          expect(data.isOnline).toBe(true);
          done();
        }
      });

      clientSocket1.emit('presence:update', { status: 'online' });
    });

    it('should get online users list', (done) => {
      clientSocket1.emit('presence:get_online_users', (response: any) => {
        expect(response.success).toBe(true);
        expect(Array.isArray(response.users)).toBe(true);
        expect(response.users.length).toBeGreaterThan(0);
        done();
      });
    });
  });

  describe('Connection Management', () => {
    it('should handle socket disconnection and reconnection', (done) => {
      let disconnected = false;

      clientSocket1.on('disconnect', () => {
        disconnected = true;
      });

      clientSocket1.on('connect', () => {
        if (disconnected) {
          expect(clientSocket1.connected).toBe(true);
          done();
        }
      });

      // Simulate disconnection
      clientSocket1.disconnect();
      
      // Reconnect after a short delay
      setTimeout(() => {
        clientSocket1.connect();
      }, 100);
    });

    it('should maintain user state across reconnection', async () => {
      // Verify user is still in conversation after reconnection
      const response = await request(app)
        .get('/api/messaging/conversations')
        .set('Authorization', `Bearer ${testUser1Token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.conversations).toHaveLength(2); // direct + group
    });
  });
});

export default {};