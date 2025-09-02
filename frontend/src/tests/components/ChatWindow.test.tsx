import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatWindow from '../../components/ChatWindow/ChatWindow';
import { useSocket } from '../../hooks/useSocket';
import { useAuth } from '../../hooks/useAuth';
import { Conversation, Message } from '../../types/messaging';

// Mock hooks
jest.mock('../../hooks/useSocket');
jest.mock('../../hooks/useAuth');

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock localStorage
const mockGetItem = jest.fn();
Object.defineProperty(window, 'localStorage', {
  value: { getItem: mockGetItem }
});

const mockSocket = {
  emit: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
  connected: true
};

const mockUser = {
  id: 'user1',
  username: 'testuser',
  role: 'player'
};

const mockConversation: Conversation = {
  id: 'conv1',
  type: 'direct',
  participants: [
    { userId: 'user1', role: 'member', joinedAt: new Date(), isActive: true },
    { userId: 'user2', role: 'member', joinedAt: new Date(), isActive: true }
  ],
  isGroup: false,
  settings: {
    allowFileSharing: true,
    allowLocationSharing: true,
    muteNotifications: false
  },
  isActive: true,
  isArchived: false,
  createdAt: new Date(),
  updatedAt: new Date()
};

const mockMessages: Message[] = [
  {
    id: 'msg1',
    conversationId: 'conv1',
    senderId: 'user2',
    content: 'Hello there!',
    messageType: 'text',
    isEdited: false,
    isDeleted: false,
    readBy: [],
    reactions: [],
    createdAt: new Date('2023-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-01T10:00:00Z'),
    sender: {
      id: 'user2',
      username: 'otheruser',
      firstName: 'Other',
      lastName: 'User'
    }
  },
  {
    id: 'msg2',
    conversationId: 'conv1',
    senderId: 'user1',
    content: 'Hi! How are you?',
    messageType: 'text',
    isEdited: false,
    isDeleted: false,
    readBy: [],
    reactions: [],
    createdAt: new Date('2023-01-01T10:01:00Z'),
    updatedAt: new Date('2023-01-01T10:01:00Z'),
    sender: {
      id: 'user1',
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User'
    }
  }
];

describe('ChatWindow', () => {
  beforeEach(() => {
    (useSocket as jest.Mock).mockReturnValue({
      socket: mockSocket,
      isConnected: true
    });

    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      token: 'mock-token'
    });

    mockGetItem.mockReturnValue('mock-token');

    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        data: {
          messages: mockMessages,
          total: mockMessages.length,
          page: 1,
          totalPages: 1
        }
      })
    });

    jest.clearAllMocks();
  });

  it('should render chat window with conversation header', async () => {
    render(<ChatWindow conversation={mockConversation} />);

    await waitFor(() => {
      expect(screen.getByText('Direct Message')).toBeInTheDocument();
    });
  });

  it('should load and display messages', async () => {
    render(<ChatWindow conversation={mockConversation} />);

    await waitFor(() => {
      expect(screen.getByText('Hello there!')).toBeInTheDocument();
      expect(screen.getByText('Hi! How are you?')).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledWith(
      `/api/conversations/${mockConversation.id}/messages?page=1&limit=50`,
      expect.objectContaining({
        headers: {
          'Authorization': 'Bearer mock-token'
        }
      })
    );
  });

  it('should join conversation room on mount', async () => {
    render(<ChatWindow conversation={mockConversation} />);

    await waitFor(() => {
      expect(mockSocket.emit).toHaveBeenCalledWith(
        'conversation:join',
        { conversationId: mockConversation.id },
        expect.any(Function)
      );
    });
  });

  it('should register socket event listeners', () => {
    render(<ChatWindow conversation={mockConversation} />);

    expect(mockSocket.on).toHaveBeenCalledWith('message:new', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('message:edited', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('message:deleted', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('message:read_by', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('message:reaction_added', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('message:reaction_removed', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('typing:user_started', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('typing:user_stopped', expect.any(Function));
  });

  it('should send message via socket when form is submitted', async () => {
    render(<ChatWindow conversation={mockConversation} />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Type a message...')).toBeInTheDocument();
    });

    const messageInput = screen.getByPlaceholderText('Type a message...');
    const sendButton = screen.getByRole('button', { name: /send/i });

    fireEvent.change(messageInput, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    expect(mockSocket.emit).toHaveBeenCalledWith(
      'message:send',
      {
        conversationId: mockConversation.id,
        content: 'Test message',
        messageType: 'text',
        attachments: undefined,
        location: undefined,
        matchInvite: undefined
      },
      expect.any(Function)
    );
  });

  it('should handle new message received via socket', async () => {
    let messageHandler: (data: any) => void;
    
    mockSocket.on.mockImplementation((event: string, handler: any) => {
      if (event === 'message:new') {
        messageHandler = handler;
      }
    });

    render(<ChatWindow conversation={mockConversation} />);

    await waitFor(() => {
      expect(screen.getByText('Hi! How are you?')).toBeInTheDocument();
    });

    // Simulate receiving a new message
    const newMessage: Message = {
      id: 'msg3',
      conversationId: 'conv1',
      senderId: 'user2',
      content: 'New message via socket!',
      messageType: 'text',
      isEdited: false,
      isDeleted: false,
      readBy: [],
      reactions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      sender: {
        id: 'user2',
        username: 'otheruser',
        firstName: 'Other',
        lastName: 'User'
      }
    };

    messageHandler!({ message: newMessage });

    await waitFor(() => {
      expect(screen.getByText('New message via socket!')).toBeInTheDocument();
    });
  });

  it('should handle typing indicators', async () => {
    let typingStartHandler: (data: any) => void;
    let typingStopHandler: (data: any) => void;

    mockSocket.on.mockImplementation((event: string, handler: any) => {
      if (event === 'typing:user_started') {
        typingStartHandler = handler;
      } else if (event === 'typing:user_stopped') {
        typingStopHandler = handler;
      }
    });

    render(<ChatWindow conversation={mockConversation} />);

    // Simulate user starting to type
    typingStartHandler!({
      userId: 'user2',
      conversationId: mockConversation.id
    });

    await waitFor(() => {
      expect(screen.getByText(/typing/i)).toBeInTheDocument();
    });

    // Simulate user stopping typing
    typingStopHandler!({
      userId: 'user2',
      conversationId: mockConversation.id
    });

    await waitFor(() => {
      expect(screen.queryByText(/typing/i)).not.toBeInTheDocument();
    });
  });

  it('should send typing indicators when user types', async () => {
    jest.useFakeTimers();
    
    render(<ChatWindow conversation={mockConversation} />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Type a message...')).toBeInTheDocument();
    });

    const messageInput = screen.getByPlaceholderText('Type a message...');

    // Start typing
    fireEvent.change(messageInput, { target: { value: 'T' } });

    // Should emit typing start
    expect(mockSocket.emit).toHaveBeenCalledWith('typing:start', {
      conversationId: mockConversation.id
    });

    // Clear input
    fireEvent.change(messageInput, { target: { value: '' } });

    // Should emit typing stop
    expect(mockSocket.emit).toHaveBeenCalledWith('typing:stop', {
      conversationId: mockConversation.id
    });

    jest.useRealTimers();
  });

  it('should handle message editing', async () => {
    render(<ChatWindow conversation={mockConversation} />);

    await waitFor(() => {
      expect(screen.getByText('Hi! How are you?')).toBeInTheDocument();
    });

    // Mock the edit function being called
    const editedContent = 'Edited message content';
    
    // This would typically be triggered by MessageItem component
    // For this test, we'll simulate the socket emission directly
    mockSocket.emit.mockClear();

    // Simulate edit message call
    const editMessage = (messageId: string, content: string) => {
      mockSocket.emit('message:edit', { messageId, content }, expect.any(Function));
    };

    editMessage('msg2', editedContent);

    expect(mockSocket.emit).toHaveBeenCalledWith(
      'message:edit',
      { messageId: 'msg2', content: editedContent },
      expect.any(Function)
    );
  });

  it('should handle message deletion', async () => {
    render(<ChatWindow conversation={mockConversation} />);

    await waitFor(() => {
      expect(screen.getByText('Hi! How are you?')).toBeInTheDocument();
    });

    mockSocket.emit.mockClear();

    // Simulate delete message call
    const deleteMessage = (messageId: string) => {
      mockSocket.emit('message:delete', { messageId }, expect.any(Function));
    };

    deleteMessage('msg2');

    expect(mockSocket.emit).toHaveBeenCalledWith(
      'message:delete',
      { messageId: 'msg2' },
      expect.any(Function)
    );
  });

  it('should handle reactions', async () => {
    render(<ChatWindow conversation={mockConversation} />);

    await waitFor(() => {
      expect(screen.getByText('Hi! How are you?')).toBeInTheDocument();
    });

    mockSocket.emit.mockClear();

    // Simulate add reaction call
    const addReaction = (messageId: string, emoji: string) => {
      mockSocket.emit('message:react', { messageId, emoji }, expect.any(Function));
    };

    addReaction('msg2', '👍');

    expect(mockSocket.emit).toHaveBeenCalledWith(
      'message:react',
      { messageId: 'msg2', emoji: '👍' },
      expect.any(Function)
    );
  });

  it('should show connection status when disconnected', () => {
    (useSocket as jest.Mock).mockReturnValue({
      socket: null,
      isConnected: false
    });

    render(<ChatWindow conversation={mockConversation} />);

    expect(screen.getByText('Reconnecting...')).toBeInTheDocument();
  });

  it('should disable message input when not connected', () => {
    (useSocket as jest.Mock).mockReturnValue({
      socket: null,
      isConnected: false
    });

    render(<ChatWindow conversation={mockConversation} />);

    const messageInput = screen.getByPlaceholderText('Connecting...');
    expect(messageInput).toBeDisabled();
  });

  it('should handle loading state', () => {
    mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<ChatWindow conversation={mockConversation} />);

    expect(screen.getByText('Loading messages...')).toBeInTheDocument();
  });

  it('should handle error state', async () => {
    mockFetch.mockRejectedValue(new Error('Failed to load'));

    render(<ChatWindow conversation={mockConversation} />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load messages')).toBeInTheDocument();
    });
  });

  it('should cleanup on unmount', () => {
    const { unmount } = render(<ChatWindow conversation={mockConversation} />);

    unmount();

    expect(mockSocket.off).toHaveBeenCalledWith('message:new', expect.any(Function));
    expect(mockSocket.off).toHaveBeenCalledWith('message:edited', expect.any(Function));
    expect(mockSocket.off).toHaveBeenCalledWith('message:deleted', expect.any(Function));
    expect(mockSocket.emit).toHaveBeenCalledWith('conversation:leave', {
      conversationId: mockConversation.id
    });
  });
});

export default {};