import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import ConversationList from '../../components/messaging/ConversationList';
import MessageBubble from '../../components/messaging/MessageBubble';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/ui/Badge';

interface Conversation {
  id: number;
  name?: string;
  type: string;
  participantIds: number[];
  lastMessageAt?: string;
  isArchived: boolean;
  messages?: Array<{
    id: number;
    content: string;
    createdAt: string;
    sender: {
      id: number;
      firstName: string;
      lastName: string;
      profileImageUrl?: string;
    };
  }>;
}

interface Message {
  id: number;
  content: string;
  messageType: string;
  isEdited: boolean;
  editedAt?: string;
  createdAt: string;
  sender: {
    id: number;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
  };
  replyTo?: {
    id: number;
    content: string;
    sender: {
      firstName: string;
      lastName: string;
    };
  };
  reactions?: Array<{
    id: number;
    reaction: string;
    user: {
      id: number;
      firstName: string;
      lastName: string;
    };
  }>;
  readStatus?: Array<{
    id: number;
    userId: number;
    readAt: string;
  }>;
  attachments?: string[];
  metadata?: Record<string, any>;
}

const MessagesPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const [showArchived, setShowArchived] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchConversations();
  }, [showArchived]);

  useEffect(() => {
    if (selectedConversationId) {
      fetchMessages(selectedConversationId);
    }
  }, [selectedConversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    setIsLoadingConversations(true);
    
    try {
      const params = new URLSearchParams();
      if (showArchived) params.append('isArchived', 'true');
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/conversations?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const result = await response.json();

      if (result.success) {
        setConversations(result.data);
        
        // Auto-select first conversation if none selected
        if (!selectedConversationId && result.data.length > 0) {
          setSelectedConversationId(result.data[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setIsLoadingConversations(false);
    }
  };

  const fetchMessages = async (conversationId: number) => {
    setIsLoadingMessages(true);
    
    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const result = await response.json();

      if (result.success) {
        setMessages(result.data);
        
        // Mark messages as read
        await fetch(`/api/conversations/${conversationId}/read`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversationId) return;

    setIsSending(true);
    
    try {
      const response = await fetch(`/api/conversations/${selectedConversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          content: newMessage,
          replyToId: replyingTo?.id
        })
      });

      const result = await response.json();

      if (result.success) {
        setNewMessage('');
        setReplyingTo(null);
        fetchMessages(selectedConversationId);
        fetchConversations(); // Update last message info
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleReaction = async (messageId: number, reaction: string) => {
    try {
      await fetch(`/api/conversations/messages/${messageId}/reactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ reaction })
      });

      if (selectedConversationId) {
        fetchMessages(selectedConversationId);
      }
    } catch (err) {
      console.error('Error adding reaction:', err);
    }
  };

  const handleReply = (message: Message) => {
    setReplyingTo(message);
    messageInputRef.current?.focus();
  };

  const handleEdit = (message: Message) => {
    setEditingMessage(message);
    setNewMessage(message.content);
    messageInputRef.current?.focus();
  };

  const handleDelete = async (messageId: number) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este mensaje?')) {
      return;
    }

    try {
      await fetch(`/api/conversations/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (selectedConversationId) {
        fetchMessages(selectedConversationId);
      }
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  const saveEdit = async () => {
    if (!editingMessage || !newMessage.trim()) return;

    try {
      await fetch(`/api/conversations/messages/${editingMessage.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content: newMessage })
      });

      setEditingMessage(null);
      setNewMessage('');
      
      if (selectedConversationId) {
        fetchMessages(selectedConversationId);
      }
    } catch (err) {
      console.error('Error editing message:', err);
    }
  };

  const cancelEdit = () => {
    setEditingMessage(null);
    setNewMessage('');
  };

  const getSelectedConversation = () => {
    return conversations.find(conv => conv.id === selectedConversationId);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Conversations */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">
              Mensajes
            </h1>
            <Button
              variant="primary"
              size="sm"
              className="flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nuevo
            </Button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Buscar conversaciones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <Button
              variant={!showArchived ? "primary" : "outline"}
              size="sm"
              onClick={() => setShowArchived(false)}
            >
              Activos
            </Button>
            <Button
              variant={showArchived ? "primary" : "outline"}
              size="sm"
              onClick={() => setShowArchived(true)}
            >
              Archivados
            </Button>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          <ConversationList
            conversations={conversations}
            selectedConversationId={selectedConversationId || undefined}
            currentUserId={user?.id || 0}
            onSelectConversation={setSelectedConversationId}
            isLoading={isLoadingConversations}
          />
        </div>
      </div>

      {/* Main Content - Messages */}
      <div className="flex-1 flex flex-col">
        {selectedConversationId ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {getSelectedConversation()?.name || 'Conversación'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {getSelectedConversation()?.participantIds.length} participantes
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {isLoadingMessages ? (
                <div className="flex justify-center items-center h-32">
                  <LoadingSpinner />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-gray-500">No hay mensajes en esta conversación</p>
                </div>
              ) : (
                messages.map((message, index) => {
                  const isOwn = message.sender.id === user?.id;
                  const prevMessage = messages[index - 1];
                  const showSender = !prevMessage || prevMessage.sender.id !== message.sender.id;

                  return (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isOwn={isOwn}
                      showSender={showSender}
                      currentUserId={user?.id || 0}
                      onReact={handleReaction}
                      onReply={handleReply}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply Context */}
            {replyingTo && (
              <div className="bg-gray-50 border-t border-gray-200 px-4 py-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                    <span className="text-sm text-gray-600">
                      Respondiendo a <strong>{replyingTo.sender.firstName}</strong>: {replyingTo.content.substring(0, 50)}...
                    </span>
                  </div>
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-end space-x-3">
                <div className="flex-1">
                  <textarea
                    ref={messageInputRef}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Escribe un mensaje..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={1}
                    style={{ minHeight: '40px', maxHeight: '120px' }}
                    disabled={isSending}
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  {editingMessage ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={cancelEdit}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={saveEdit}
                        disabled={!newMessage.trim()}
                      >
                        Guardar
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={sendMessage}
                      disabled={!newMessage.trim() || isSending}
                      className="flex items-center gap-2"
                    >
                      {isSending ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      )}
                      Enviar
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          /* No conversation selected */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Selecciona una conversación
              </h3>
              <p className="text-gray-600">
                Elige una conversación de la lista para comenzar a chatear
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;