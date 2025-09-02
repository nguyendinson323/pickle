import Message from '../models/Message';
import Conversation from '../models/Conversation';
import sequelize from '../config/database';

describe('Simple Messaging System Test', () => {
  beforeAll(async () => {
    // Sync database
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should create a conversation', async () => {
    const conversation = await Conversation.create({
      id: 'test-conv-1',
      type: 'direct',
      name: 'Test Conversation',
      participants: [
        { userId: 'user1', role: 'member', joinedAt: new Date(), isActive: true },
        { userId: 'user2', role: 'member', joinedAt: new Date(), isActive: true }
      ],
      settings: {
        allowFileSharing: true,
        allowLocationSharing: true,
        muteNotifications: false
      },
      isArchived: false,
      lastMessageAt: new Date(),
      unreadCount: {}
    });

    expect(conversation).toBeDefined();
    expect(conversation.id).toBe('test-conv-1');
    expect(conversation.type).toBe('direct');
  });

  it('should create a message', async () => {
    const message = await Message.create({
      id: 'test-msg-1',
      conversationId: 'test-conv-1',
      senderId: 'user1',
      content: 'Hello, this is a test message!',
      messageType: 'text',
      attachments: [],
      isEdited: false,
      isDeleted: false,
      readBy: [{ userId: 'user1', readAt: new Date() }],
      reactions: []
    });

    expect(message).toBeDefined();
    expect(message.id).toBe('test-msg-1');
    expect(message.content).toBe('Hello, this is a test message!');
    expect(message.messageType).toBe('text');
  });

  it('should update message with reaction', async () => {
    const message = await Message.findByPk('test-msg-1');
    if (message) {
      const reactions = [
        { userId: 'user2', emoji: '👍', createdAt: new Date() }
      ];
      
      await message.update({ reactions });
      
      const updatedMessage = await Message.findByPk('test-msg-1');
      expect(updatedMessage?.reactions).toHaveLength(1);
      expect(updatedMessage?.reactions[0].emoji).toBe('👍');
    }
  });

  it('should retrieve messages for a conversation', async () => {
    const messages = await Message.findAll({
      where: { conversationId: 'test-conv-1' },
      order: [['createdAt', 'DESC']]
    });

    expect(messages).toHaveLength(1);
    expect(messages[0].conversationId).toBe('test-conv-1');
  });
});