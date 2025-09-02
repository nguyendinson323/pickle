import messageService from '../../../services/messageService';
import conversationService from '../../../services/conversationService';
import notificationService from '../../../services/notificationService';
import { Message, Conversation } from '../../../models';
import { v4 as uuidv4 } from 'uuid';

// Mock dependencies
jest.mock('../../../services/conversationService');
jest.mock('../../../services/notificationService');
jest.mock('../../../models/Message');
jest.mock('../../../models/Conversation');

describe('MessageService', () => {
  const mockConversationService = conversationService as jest.Mocked<typeof conversationService>;
  const mockNotificationService = notificationService as jest.Mocked<typeof notificationService>;

  const mockConversation = {
    id: uuidv4(),
    type: 'direct',
    participants: [
      { userId: 'user1', isActive: true },
      { userId: 'user2', isActive: true }
    ]
  };

  const mockMessage = {
    id: uuidv4(),
    conversationId: mockConversation.id,
    senderId: 'user1',
    content: 'Test message',
    messageType: 'text',
    isEdited: false,
    isDeleted: false,
    readBy: [],
    reactions: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {

    // Mock Conversation.findByPk
    (Conversation.findByPk as jest.Mock).mockResolvedValue(mockConversation);
    
    // Mock Message.create
    (Message.create as jest.Mock).mockResolvedValue(mockMessage);
    
    // Mock Message.findByPk
    (Message.findByPk as jest.Mock).mockResolvedValue(mockMessage);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createMessage', () => {
    it('should create a new message successfully', async () => {
      const messageData = {
        conversationId: mockConversation.id,
        senderId: 'user1',
        content: 'Test message',
        messageType: 'text' as const
      };

      const result = await messageService.createMessage(messageData);

      expect(Conversation.findByPk).toHaveBeenCalledWith(messageData.conversationId);
      expect(Message.create).toHaveBeenCalledWith(
        expect.objectContaining({
          conversationId: messageData.conversationId,
          senderId: messageData.senderId,
          content: messageData.content,
          messageType: messageData.messageType,
          isEdited: false,
          isDeleted: false,
          readBy: [{ userId: messageData.senderId, readAt: expect.any(Date) }],
          reactions: []
        })
      );
      expect(result).toEqual(mockMessage);
    });

    it('should throw error if conversation not found', async () => {
      (Conversation.findByPk as jest.Mock).mockResolvedValue(null);

      const messageData = {
        conversationId: 'non-existent',
        senderId: 'user1',
        content: 'Test message'
      };

      await expect(messageService.createMessage(messageData)).rejects.toThrow('Conversation not found');
    });

    it('should throw error if user is not a participant', async () => {
      const nonParticipantConversation = {
        ...mockConversation,
        participants: [{ userId: 'user2', isActive: true }]
      };
      (Conversation.findByPk as jest.Mock).mockResolvedValue(nonParticipantConversation);

      const messageData = {
        conversationId: mockConversation.id,
        senderId: 'user1',
        content: 'Test message'
      };

      await expect(messageService.createMessage(messageData)).rejects.toThrow('User is not a participant in this conversation');
    });

    it('should create message with attachments', async () => {
      const messageData = {
        conversationId: mockConversation.id,
        senderId: 'user1',
        content: 'Message with attachment',
        messageType: 'file' as const,
        attachments: [{
          type: 'file' as const,
          url: 'https://example.com/file.pdf',
          filename: 'document.pdf',
          size: 1024
        }]
      };

      await messageService.createMessage(messageData);

      expect(Message.create).toHaveBeenCalledWith(
        expect.objectContaining({
          attachments: messageData.attachments
        })
      );
    });

    it('should create message with location', async () => {
      const messageData = {
        conversationId: mockConversation.id,
        senderId: 'user1',
        content: 'Location shared',
        messageType: 'location' as const,
        location: {
          latitude: 40.7128,
          longitude: -74.0060,
          address: 'New York, NY'
        }
      };

      await messageService.createMessage(messageData);

      expect(Message.create).toHaveBeenCalledWith(
        expect.objectContaining({
          location: messageData.location
        })
      );
    });

    it('should create message with match invite', async () => {
      const messageData = {
        conversationId: mockConversation.id,
        senderId: 'user1',
        content: 'Match invitation',
        messageType: 'match_invite' as const,
        matchInvite: {
          courtId: 'court-123',
          facilityId: 'facility-456',
          proposedTime: new Date(),
          duration: 60
        }
      };

      await messageService.createMessage(messageData);

      expect(Message.create).toHaveBeenCalledWith(
        expect.objectContaining({
          matchInvite: messageData.matchInvite
        })
      );
    });
  });

  describe('updateMessage', () => {
    it('should update message successfully', async () => {
      const mockUpdate = jest.fn().mockResolvedValue(mockMessage);
      const messageWithUpdate = { ...mockMessage, update: mockUpdate };
      (Message.findByPk as jest.Mock).mockResolvedValue(messageWithUpdate);

      const updateData = { content: 'Updated content' };
      
      const result = await messageService.updateMessage(mockMessage.id, 'user1', updateData);

      expect(Message.findByPk).toHaveBeenCalledWith(mockMessage.id);
      expect(mockUpdate).toHaveBeenCalledWith({
        ...updateData,
        isEdited: true,
        editedAt: expect.any(Date)
      });
      expect(result).toEqual(messageWithUpdate);
    });

    it('should throw error if message not found', async () => {
      (Message.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(messageService.updateMessage('non-existent', 'user1', { content: 'test' }))
        .rejects.toThrow('Message not found');
    });

    it('should throw error if user is not the sender', async () => {
      await expect(messageService.updateMessage(mockMessage.id, 'user2', { content: 'test' }))
        .rejects.toThrow('Unauthorized to edit this message');
    });

    it('should throw error if message is deleted', async () => {
      const deletedMessage = { ...mockMessage, isDeleted: true };
      (Message.findByPk as jest.Mock).mockResolvedValue(deletedMessage);

      await expect(messageService.updateMessage(mockMessage.id, 'user1', { content: 'test' }))
        .rejects.toThrow('Cannot edit deleted message');
    });
  });

  describe('deleteMessage', () => {
    it('should delete message successfully', async () => {
      const mockUpdate = jest.fn().mockResolvedValue(mockMessage);
      const messageWithUpdate = { ...mockMessage, update: mockUpdate };
      (Message.findByPk as jest.Mock).mockResolvedValue(messageWithUpdate);

      await messageService.deleteMessage(mockMessage.id, 'user1');

      expect(mockUpdate).toHaveBeenCalledWith({
        isDeleted: true,
        deletedAt: expect.any(Date),
        content: '[Message deleted]'
      });
    });

    it('should throw error if message not found', async () => {
      (Message.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(messageService.deleteMessage('non-existent', 'user1'))
        .rejects.toThrow('Message not found');
    });

    it('should throw error if user is not the sender', async () => {
      await expect(messageService.deleteMessage(mockMessage.id, 'user2'))
        .rejects.toThrow('Unauthorized to delete this message');
    });
  });

  describe('markMessageAsRead', () => {
    it('should mark message as read successfully', async () => {
      const mockUpdate = jest.fn();
      const messageWithUpdate = { 
        ...mockMessage, 
        readBy: [],
        update: mockUpdate
      };
      (Message.findByPk as jest.Mock).mockResolvedValue(messageWithUpdate);

      await messageService.markMessageAsRead(mockMessage.id, 'user2');

      expect(mockUpdate).toHaveBeenCalledWith({
        readBy: [{ userId: 'user2', readAt: expect.any(Date) }]
      });
    });

    it('should not update if already read by user', async () => {
      const mockUpdate = jest.fn();
      const messageWithUpdate = { 
        ...mockMessage, 
        readBy: [{ userId: 'user2', readAt: new Date() }],
        update: mockUpdate
      };
      (Message.findByPk as jest.Mock).mockResolvedValue(messageWithUpdate);

      await messageService.markMessageAsRead(mockMessage.id, 'user2');

      expect(mockUpdate).not.toHaveBeenCalled();
    });
  });

  describe('addReaction', () => {
    it('should add reaction successfully', async () => {
      const mockUpdate = jest.fn();
      const messageWithUpdate = { 
        ...mockMessage, 
        reactions: [],
        update: mockUpdate
      };
      (Message.findByPk as jest.Mock).mockResolvedValue(messageWithUpdate);

      await messageService.addReaction(mockMessage.id, 'user2', '👍');

      expect(mockUpdate).toHaveBeenCalledWith({
        reactions: [{ userId: 'user2', emoji: '👍', createdAt: expect.any(Date) }]
      });
    });

    it('should replace existing reaction from same user', async () => {
      const mockUpdate = jest.fn();
      const messageWithUpdate = { 
        ...mockMessage, 
        reactions: [{ userId: 'user2', emoji: '👎', createdAt: new Date() }],
        update: mockUpdate
      };
      (Message.findByPk as jest.Mock).mockResolvedValue(messageWithUpdate);

      await messageService.addReaction(mockMessage.id, 'user2', '👍');

      expect(mockUpdate).toHaveBeenCalledWith({
        reactions: [{ userId: 'user2', emoji: '👍', createdAt: expect.any(Date) }]
      });
    });
  });

  describe('removeReaction', () => {
    it('should remove reaction successfully', async () => {
      const mockUpdate = jest.fn();
      const messageWithUpdate = { 
        ...mockMessage, 
        reactions: [
          { userId: 'user2', emoji: '👍', createdAt: new Date() },
          { userId: 'user3', emoji: '😂', createdAt: new Date() }
        ],
        update: mockUpdate
      };
      (Message.findByPk as jest.Mock).mockResolvedValue(messageWithUpdate);

      await messageService.removeReaction(mockMessage.id, 'user2');

      expect(mockUpdate).toHaveBeenCalledWith({
        reactions: [{ userId: 'user3', emoji: '😂', createdAt: expect.any(Date) }]
      });
    });
  });

  describe('searchMessages', () => {
    it('should search messages successfully', async () => {
      const mockMessages = [mockMessage];
      const mockFindAndCountAll = jest.fn().mockResolvedValue({
        count: 1,
        rows: mockMessages
      });
      (Message.findAndCountAll as jest.Mock) = mockFindAndCountAll;

      const result = await messageService.searchMessages('conversation-id', 'test query');

      expect(mockFindAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            conversationId: 'conversation-id',
            content: { [Symbol.for('ilike')]: '%test query%' },
            isDeleted: false
          }),
          limit: 20,
          offset: 0,
          order: [['createdAt', 'DESC']]
        })
      );

      expect(result).toEqual({
        messages: mockMessages,
        total: 1,
        page: 1,
        totalPages: 1
      });
    });
  });

  describe('getUnreadCount', () => {
    it('should get unread count successfully', async () => {
      const mockMessages = [
        { 
          id: 'msg1', 
          readBy: [{ userId: 'user2', readAt: new Date() }]
        },
        { 
          id: 'msg2', 
          readBy: []
        }
      ];
      (Message.findAll as jest.Mock).mockResolvedValue(mockMessages);

      const result = await messageService.getUnreadCount('user1');

      expect(result).toBe(1); // Only msg2 is unread for user1
    });

    it('should filter by conversation if provided', async () => {
      (Message.findAll as jest.Mock).mockResolvedValue([]);

      await messageService.getUnreadCount('user1', 'conversation-id');

      expect(Message.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            conversationId: 'conversation-id'
          })
        })
      );
    });
  });
});

export default {};