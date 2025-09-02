import Message from '../models/Message';
import Conversation from '../models/Conversation';
import sequelize from '../config/database';

describe('Basic Messaging System Test', () => {
  beforeAll(async () => {
    // Sync database
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should create a basic conversation', async () => {
    const conversation = await Conversation.create({
      id: 'test-conv-1',
      type: 'direct',
      participants: [
        { userId: 'user1', role: 'member', joinedAt: new Date(), isActive: true },
        { userId: 'user2', role: 'member', joinedAt: new Date(), isActive: true }
      ],
      settings: {
        allowFileSharing: true,
        allowLocationSharing: true,
        muteNotifications: false
      }
    });

    expect(conversation).toBeDefined();
    expect(conversation.id).toBe('test-conv-1');
    expect(conversation.type).toBe('direct');
    expect(conversation.participants).toHaveLength(2);
  });

  it('should create a text message', async () => {
    const message = await Message.create({
      id: 'test-msg-1',
      conversationId: 'test-conv-1',
      senderId: 'user1',
      content: 'Hello, this is a test message!',
      messageType: 'text'
    });

    expect(message).toBeDefined();
    expect(message.id).toBe('test-msg-1');
    expect(message.content).toBe('Hello, this is a test message!');
    expect(message.messageType).toBe('text');
  });

  it('should retrieve the message', async () => {
    const message = await Message.findByPk('test-msg-1');
    
    expect(message).toBeDefined();
    expect(message?.conversationId).toBe('test-conv-1');
    expect(message?.senderId).toBe('user1');
  });

  it('should create message with attachments', async () => {
    const messageWithAttachment = await Message.create({
      id: 'test-msg-2',
      conversationId: 'test-conv-1',
      senderId: 'user2',
      content: 'Check out this image!',
      messageType: 'image',
      attachments: [
        {
          type: 'image',
          url: 'https://example.com/image.jpg',
          filename: 'image.jpg',
          size: 1024000
        }
      ]
    });

    expect(messageWithAttachment).toBeDefined();
    expect(messageWithAttachment.messageType).toBe('image');
    expect(messageWithAttachment.attachments).toHaveLength(1);
    expect(messageWithAttachment.attachments?.[0].type).toBe('image');
  });

  it('should list all messages in conversation', async () => {
    const messages = await Message.findAll({
      where: { conversationId: 'test-conv-1' },
      order: [['createdAt', 'ASC']]
    });

    expect(messages).toHaveLength(2);
    expect(messages[0].id).toBe('test-msg-1');
    expect(messages[1].id).toBe('test-msg-2');
  });
});