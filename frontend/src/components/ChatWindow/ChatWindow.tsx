import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { useAuth } from '../../hooks/useAuth';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ConversationHeader from './ConversationHeader';
import TypingIndicator from './TypingIndicator';
import { Message, Conversation } from '../../types/messaging';
import { debounce } from 'lodash';
import styles from './ChatWindow.module.css';

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
      if (data.message.senderId !== user?.id) {
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
      if (data.conversationId === conversation.id && data.userId !== user?.id) {
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
      <div className={styles.chatWindow}>
        <ConversationHeader 
          conversation={conversation}
          onClose={onClose}
        />
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}>Loading messages...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chatWindow}>
      <ConversationHeader 
        conversation={conversation}
        onClose={onClose}
        isConnected={isConnected}
      />

      {error && (
        <div className={styles.errorBanner}>
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div 
        className={styles.messagesContainer}
        ref={messagesContainerRef}
        onScroll={handleScroll}
      >
        {loading && messages.length > 0 && (
          <div className={styles.loadingMore}>Loading more messages...</div>
        )}

        <MessageList
          messages={messages}
          currentUserId={user?.id || ''}
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
        <div className={styles.connectionStatus}>
          Reconnecting...
        </div>
      )}
    </div>
  );
};

export default ChatWindow;