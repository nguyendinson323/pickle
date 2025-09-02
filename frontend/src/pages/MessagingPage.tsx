import React, { useState, useEffect } from 'react';
import { useMessaging } from '../contexts/MessagingContext';
import { ChatWindow } from '../components/ChatWindow/ChatWindow';
import { NotificationCenter } from '../components/NotificationCenter/NotificationCenter';
import { useAppSelector } from '../store';
import LoadingSpinner from '../components/common/LoadingSpinner';

interface ConversationListProps {
  conversations: any[];
  activeConversation: any;
  onSelectConversation: (conversation: any) => void;
  onCreateConversation: () => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeConversation,
  onSelectConversation,
  onCreateConversation
}) => {
  const { userPresence } = useMessaging();

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
        <button
          onClick={onCreateConversation}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="New conversation"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm">No conversations yet</p>
            <button
              onClick={onCreateConversation}
              className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Start a conversation
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {conversations.map((conversation) => {
              const isActive = activeConversation?.id === conversation.id;
              const otherParticipant = conversation.participants?.find((p: any) => p.userId !== conversation.currentUserId);
              const isOnline = otherParticipant && userPresence[otherParticipant.userId]?.status === 'online';
              
              return (
                <div
                  key={conversation.id}
                  onClick={() => onSelectConversation(conversation)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    isActive ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        {conversation.type === 'direct' ? (
                          <span className="text-sm font-medium text-gray-600">
                            {conversation.name?.charAt(0) || otherParticipant?.name?.charAt(0) || '?'}
                          </span>
                        ) : (
                          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        )}
                      </div>
                      {isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {conversation.name || (conversation.type === 'direct' ? otherParticipant?.name : `${conversation.type} chat`)}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {conversation.lastMessageAt && new Date(conversation.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 truncate mt-1">
                        {conversation.lastMessage || 'No messages yet'}
                      </p>
                      
                      {conversation.unreadCount > 0 && (
                        <div className="mt-1">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-500 text-white">
                            {conversation.unreadCount}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const MessagingLayout: React.FC = () => {
  const { 
    conversations, 
    activeConversation, 
    setActiveConversation,
    joinConversation,
    createConversation,
    isConnected,
    connectionError,
    isLoading
  } = useMessaging();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Auto-select first conversation if none selected
  useEffect(() => {
    if (conversations.length > 0 && !activeConversation) {
      setActiveConversation(conversations[0]);
    }
  }, [conversations, activeConversation, setActiveConversation]);

  // Join conversation when selected
  useEffect(() => {
    if (activeConversation) {
      joinConversation(activeConversation.id);
    }
  }, [activeConversation, joinConversation]);

  const handleSelectConversation = (conversation: any) => {
    setActiveConversation(conversation);
  };

  const handleCreateConversation = () => {
    setShowCreateDialog(true);
  };

  // Connection status
  if (!isConnected && !isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-600 text-6xl mb-4">📡</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-4">
            {connectionError || 'Unable to connect to messaging service'}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Conversation List */}
      <ConversationList
        conversations={conversations}
        activeConversation={activeConversation}
        onSelectConversation={handleSelectConversation}
        onCreateConversation={handleCreateConversation}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <ChatWindow
            conversation={activeConversation}
            onClose={() => setActiveConversation(null)}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md mx-auto p-6">
              <div className="text-gray-400 text-6xl mb-4">💬</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Select a conversation</h2>
              <p className="text-gray-600 mb-4">
                Choose a conversation from the sidebar to start messaging, or create a new one.
              </p>
              <button
                onClick={handleCreateConversation}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                New Conversation
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Notification Panel */}
      {showNotifications && (
        <div className="w-80 bg-white border-l border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            <button
              onClick={() => setShowNotifications(false)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <NotificationCenter />
        </div>
      )}

      {/* Floating notification toggle */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 17h6M4 8h8M4 12h8" />
        </svg>
      </button>

      {/* Create Conversation Dialog */}
      {showCreateDialog && (
        <CreateConversationDialog
          onClose={() => setShowCreateDialog(false)}
          onCreate={(type, participantIds, name) => {
            createConversation(type, participantIds, name);
            setShowCreateDialog(false);
          }}
        />
      )}
    </div>
  );
};

interface CreateConversationDialogProps {
  onClose: () => void;
  onCreate: (type: string, participantIds: string[], name?: string) => void;
}

const CreateConversationDialog: React.FC<CreateConversationDialogProps> = ({ onClose, onCreate }) => {
  const [conversationType, setConversationType] = useState('direct');
  const [conversationName, setConversationName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUsers.length === 0) return;

    onCreate(
      conversationType,
      selectedUsers,
      conversationType === 'group' ? conversationName : undefined
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">New Conversation</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Conversation Type
            </label>
            <select
              value={conversationType}
              onChange={(e) => setConversationType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="direct">Direct Message</option>
              <option value="group">Group Chat</option>
            </select>
          </div>

          {conversationType === 'group' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group Name
              </label>
              <input
                type="text"
                value={conversationName}
                onChange={(e) => setConversationName(e.target.value)}
                placeholder="Enter group name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Participants
            </label>
            <div className="text-sm text-gray-600 mb-2">
              Search and select users to add to the conversation
            </div>
            {/* This would be a user search/select component */}
            <div className="border border-gray-300 rounded-md p-4 min-h-[100px] bg-gray-50">
              <p className="text-sm text-gray-500">User selection component would go here</p>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={selectedUsers.length === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              Create Conversation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MessagingPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Please log in to access messaging.</p>
        </div>
      </div>
    );
  }

  return <MessagingLayout />;
};

export default MessagingPage;