import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { useAuth } from '../../hooks/useAuth';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ConversationHeader from './ConversationHeader';
import { Message, Conversation } from '../../types/messaging';

// Simple debounce implementation
function debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

interface ChatWindowProps {
  conversation: Conversation;
  onClose?: () => void;
  onUpdateConversation?: (conversation: Conversation) => void;
}

interface TypingUser {
  userId: string;
  username: string;
  timestamp: Date;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  onClose,
  onUpdateConversation
}) => {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Load messages
  const loadMessages = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    try {
      const response = await fetch(
        `/api/conversations/${conversation.id}/messages?page=${pageNum}&limit=50`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to load messages');
      }

      const data = await response.json();
      const newMessages = data.data.messages;

      if (append) {
        setMessages(prev => [...newMessages, ...prev]);
      } else {
        setMessages(newMessages);
        scrollToBottom();
      }

      setHasMoreMessages(newMessages.length === 50);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load messages:', error);
      setError('Failed to load messages');
      setLoading(false);
    }
  }, [conversation.id]);

  // Join conversation and load messages
  useEffect(() => {
    if (socket && isConnected && conversation.id) {
      // Join conversation room
      socket.emit('conversation:join', { conversationId: conversation.id }, (response: any) => {
        if (response.error) {
          console.error('Failed to join conversation:', response.error);
          setError('Failed to join conversation');
        }
      });

      // Load initial messages
      loadMessages();
    }

    return () => {
      if (socket && conversation.id) {
        socket.emit('conversation:leave', { conversationId: conversation.id });
      }
    };
  }, [socket, isConnected, conversation.id, loadMessages]);

  // Socket event handlers
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data: { message: Message }) => {
      setMessages(prev => [...prev, data.message]);
      scrollToBottom();
      
      // Mark message as read if not from current user
      if (data.message.senderId !== String(user?.id)) {
        markMessageAsRead(data.message.id);
      }
    };

    const handleMessageEdited = (data: { messageId: string; content: string; editedAt: Date }) => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === data.messageId 
            ? { ...msg, content: data.content, isEdited: true, editedAt: data.editedAt }
            : msg
        )
      );
    };

    const handleMessageDeleted = (data: { messageId: string }) => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === data.messageId 
            ? { ...msg, isDeleted: true, content: '[Message deleted]' }
            : msg
        )
      );
    };

    const handleMessageReadBy = (data: { messageId: string; userId: string; readAt: Date }) => {
      setMessages(prev => 
        prev.map(msg => {
          if (msg.id === data.messageId) {
            const updatedReadBy = msg.readBy.filter(read => read.userId !== data.userId);
            updatedReadBy.push({ userId: data.userId, readAt: data.readAt });
            return { ...msg, readBy: updatedReadBy };
          }
          return msg;
        })
      );
    };

    const handleReactionAdded = (data: { messageId: string; userId: string; emoji: string }) => {
      setMessages(prev => 
        prev.map(msg => {
          if (msg.id === data.messageId) {
            const updatedReactions = msg.reactions.filter(
              reaction => reaction.userId !== data.userId
            );
            updatedReactions.push({
              userId: data.userId,
              emoji: data.emoji,
              createdAt: new Date()
            });
            return { ...msg, reactions: updatedReactions };
          }
          return msg;
        })
      );
    };

    const handleReactionRemoved = (data: { messageId: string; userId: string }) => {
      setMessages(prev => 
        prev.map(msg => {
          if (msg.id === data.messageId) {
            const updatedReactions = msg.reactions.filter(
              reaction => reaction.userId !== data.userId
            );
            return { ...msg, reactions: updatedReactions };
          }
          return msg;
        })
      );
    };

    const handleTypingStarted = (data: { userId: string; conversationId: string }) => {
      if (data.conversationId === conversation.id && data.userId !== String(user?.id)) {
        setTypingUsers(prev => {
          const existing = prev.find(u => u.userId === data.userId);
          if (!existing) {
            return [...prev, {
              userId: data.userId,
              username: 'User', // Would normally get from user data
              timestamp: new Date()
            }];
          }
          return prev.map(u => 
            u.userId === data.userId 
              ? { ...u, timestamp: new Date() }
              : u
          );
        });
      }
    };

    const handleTypingStopped = (data: { userId: string; conversationId: string }) => {
      if (data.conversationId === conversation.id) {
        setTypingUsers(prev => prev.filter(u => u.userId !== data.userId));
      }
    };

    const handleConversationUpdated = (data: any) => {
      if (data.conversationId === conversation.id) {
        onUpdateConversation?.({
          ...conversation,
          lastMessageAt: data.lastMessageAt,
          lastMessagePreview: data.lastMessagePreview
        });
      }
    };

    // Register event listeners
    socket.on('message:new', handleNewMessage);
    socket.on('message:edited', handleMessageEdited);
    socket.on('message:deleted', handleMessageDeleted);
    socket.on('message:read_by', handleMessageReadBy);
    socket.on('message:reaction_added', handleReactionAdded);
    socket.on('message:reaction_removed', handleReactionRemoved);
    socket.on('typing:user_started', handleTypingStarted);
    socket.on('typing:user_stopped', handleTypingStopped);
    socket.on('conversation:updated', handleConversationUpdated);

    return () => {
      socket.off('message:new', handleNewMessage);
      socket.off('message:edited', handleMessageEdited);
      socket.off('message:deleted', handleMessageDeleted);
      socket.off('message:read_by', handleMessageReadBy);
      socket.off('message:reaction_added', handleReactionAdded);
      socket.off('message:reaction_removed', handleReactionRemoved);
      socket.off('typing:user_started', handleTypingStarted);
      socket.off('typing:user_stopped', handleTypingStopped);
      socket.off('conversation:updated', handleConversationUpdated);
    };
  }, [socket, conversation.id, user?.id, onUpdateConversation]);

  // Clean up typing users periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setTypingUsers(prev => 
        prev.filter(user => 
          Date.now() - user.timestamp.getTime() < 5000 // Remove after 5 seconds
        )
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const markMessageAsRead = async (messageId: string) => {
    try {
      await fetch(`/api/messages/${messageId}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
    } catch (error) {
      console.error('Failed to mark message as read:', error);
    }
  };

  const sendMessage = async (content: string, messageType: string = 'text', attachments?: any[], location?: any, matchInvite?: any) => {
    if (!socket || !isConnected || sending) return;

    setSending(true);
    setError(null);

    try {
      socket.emit('message:send', {
        conversationId: conversation.id,
        content,
        messageType,
        attachments,
        location,
        matchInvite
      }, (response: any) => {
        if (response.error) {
          setError(response.error);
        }
        setSending(false);
      });

      // Stop typing
      handleStopTyping();

    } catch (error) {
      console.error('Failed to send message:', error);
      setError('Failed to send message');
      setSending(false);
    }
  };

  const editMessage = async (messageId: string, content: string) => {
    if (!socket || !isConnected) return;

    socket.emit('message:edit', {
      messageId,
      content
    }, (response: any) => {
      if (response.error) {
        setError(response.error);
      }
    });
  };

  const deleteMessage = async (messageId: string) => {
    if (!socket || !isConnected) return;

    socket.emit('message:delete', {
      messageId
    }, (response: any) => {
      if (response.error) {
        setError(response.error);
      }
    });
  };

  const addReaction = async (messageId: string, emoji: string) => {
    if (!socket || !isConnected) return;

    socket.emit('message:react', {
      messageId,
      emoji
    }, (response: any) => {
      if (response.error) {
        setError(response.error);
      }
    });
  };

  const removeReaction = async (messageId: string) => {
    if (!socket || !isConnected) return;

    socket.emit('message:unreact', {
      messageId
    }, (response: any) => {
      if (response.error) {
        setError(response.error);
      }
    });
  };

  const debouncedStopTyping = useCallback(
    debounce(() => {
      if (socket && isConnected && isTyping) {
        socket.emit('typing:stop', { conversationId: conversation.id });
        setIsTyping(false);
      }
    }, 1000),
    [socket, isConnected, isTyping, conversation.id]
  );

  const handleStartTyping = () => {
    if (socket && isConnected && !isTyping) {
      socket.emit('typing:start', { conversationId: conversation.id });
      setIsTyping(true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping();
    }, 3000);

    debouncedStopTyping();
  };

  const handleStopTyping = () => {
    if (socket && isConnected && isTyping) {
      socket.emit('typing:stop', { conversationId: conversation.id });
      setIsTyping(false);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const loadMoreMessages = async () => {
    if (!hasMoreMessages || loading) return;
    
    const nextPage = page + 1;
    setPage(nextPage);
    await loadMessages(nextPage, true);
  };

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.currentTarget;
    
    // Load more messages when scrolled to top
    if (scrollTop === 0 && hasMoreMessages && !loading) {
      loadMoreMessages();
    }
  }, [hasMoreMessages, loading, loadMoreMessages]);

  if (loading && messages.length === 0) {
    return (
      <div className="flex flex-col h-full bg-white">
        <ConversationHeader 
          conversationId={conversation.id}
          title={conversation.name || 'Conversation'}
          participants={conversation.participants.map(p => ({
            id: p.userId,
            name: `User ${p.userId}`, // Would normally fetch user details
            avatar: undefined
          }))}
        />
        <div className="flex items-center justify-center flex-1">
          <div className="text-gray-500">Loading messages...</div>
        </div>
      </div>
    );
  }

  // Simple TypingIndicator component
  const TypingIndicator = ({ users }: { users: TypingUser[] }) => {
    if (users.length === 0) return null;
    
    const usernames = users.map(u => u.username).join(', ');
    return (
      <div className="px-4 py-2 text-sm text-gray-500 italic">
        {usernames} {users.length === 1 ? 'is' : 'are'} typing...
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="relative">
        <ConversationHeader 
          conversationId={conversation.id}
          title={conversation.name || 'Conversation'}
          participants={conversation.participants.map(p => ({
            id: p.userId,
            name: `User ${p.userId}`, // Would normally fetch user details
            avatar: undefined
          }))}
          isOnline={isConnected}
        />
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            title="Close chat"
          >
            ✕
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 flex justify-between items-center">
          {error}
          <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900">×</button>
        </div>
      )}

      <div 
        className="flex-1 overflow-y-auto p-4"
        ref={messagesContainerRef}
        onScroll={handleScroll}
      >
        {loading && messages.length > 0 && (
          <div className="text-center py-2 text-gray-500">Loading more messages...</div>
        )}

        <MessageList
          messages={messages}
          currentUserId={String(user?.id || '')}
          onEditMessage={editMessage}
          onDeleteMessage={deleteMessage}
          onAddReaction={addReaction}
          onRemoveReaction={removeReaction}
        />

        <TypingIndicator users={typingUsers} />
        
        <div ref={messagesEndRef} />
      </div>

      <MessageInput
        onSendMessage={sendMessage}
        onStartTyping={handleStartTyping}
        onStopTyping={handleStopTyping}
        disabled={!isConnected || sending}
        sending={sending}
      />

      {!isConnected && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 text-center">
          Reconnecting...
        </div>
      )}
    </div>
  );
};

export default ChatWindow;