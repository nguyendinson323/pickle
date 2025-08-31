import React from 'react';
import LoadingSpinner from '../common/LoadingSpinner';
import Badge from '../ui/Badge';

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

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId?: number;
  currentUserId: number;
  onSelectConversation: (conversationId: number) => void;
  isLoading?: boolean;
  className?: string;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversationId,
  currentUserId,
  onSelectConversation,
  isLoading = false,
  className = ""
}) => {
  const getConversationName = (conversation: Conversation) => {
    if (conversation.name) {
      return conversation.name;
    }

    if (conversation.type === 'direct') {
      // For direct conversations, show the other participant's name
      // This is a simplified version - you'd typically get participant details from the API
      return `Direct Chat`;
    }

    return `Group Conversation`;
  };

  const getLastMessage = (conversation: Conversation) => {
    const lastMessage = conversation.messages?.[0];
    if (!lastMessage) return null;

    const isOwn = lastMessage.sender.id === currentUserId;
    const senderName = isOwn ? 'You' : lastMessage.sender.firstName;
    
    return {
      ...lastMessage,
      senderName,
      preview: lastMessage.content.length > 50 
        ? `${lastMessage.content.substring(0, 50)}...` 
        : lastMessage.content
    };
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Today - show time
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } else if (diffDays === 1) {
      // Yesterday
      return 'Yesterday';
    } else if (diffDays < 7) {
      // This week - show day
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      // Older - show date
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short'
      });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'direct':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'group':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        );
      case 'tournament':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        );
      case 'finder_request':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'tournament':
        return <Badge variant="primary" size="sm">Tournament</Badge>;
      case 'finder_request':
        return <Badge variant="secondary" size="sm">Player</Badge>;
      case 'group':
        return <Badge variant="info" size="sm">Group</Badge>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <LoadingSpinner />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className={`text-center p-8 text-gray-500 ${className}`}>
        <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p className="text-sm">No conversations</p>
        <p className="text-xs text-gray-400 mt-1">
          Start a new conversation to get started
        </p>
      </div>
    );
  }

  return (
    <div className={`divide-y divide-gray-200 ${className}`}>
      {conversations.map((conversation) => {
        const lastMessage = getLastMessage(conversation);
        const isSelected = conversation.id === selectedConversationId;

        return (
          <button
            key={conversation.id}
            onClick={() => onSelectConversation(conversation.id)}
            className={`w-full text-left p-4 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors ${
              isSelected ? 'bg-blue-50 border-r-2 border-blue-500' : ''
            } ${conversation.isArchived ? 'opacity-60' : ''}`}
          >
            <div className="flex items-start space-x-3">
              {/* Icon/Avatar */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
              }`}>
                {getTypeIcon(conversation.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <h3 className={`text-sm font-medium truncate ${
                      isSelected ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {getConversationName(conversation)}
                    </h3>
                    {getTypeBadge(conversation.type)}
                    {conversation.isArchived && (
                      <Badge variant="warning" size="sm">Archived</Badge>
                    )}
                  </div>
                  
                  {lastMessage && (
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {formatTime(lastMessage.createdAt)}
                    </span>
                  )}
                </div>

                {lastMessage ? (
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-600 font-medium">
                      {lastMessage.senderName}:
                    </span>
                    <p className="text-xs text-gray-500 truncate flex-1">
                      {lastMessage.preview}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">
                    No messages
                  </p>
                )}

                {/* Participants count for group conversations */}
                {conversation.type === 'group' && (
                  <div className="flex items-center mt-1">
                    <svg className="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    <span className="text-xs text-gray-400">
                      {conversation.participantIds.length} participants
                    </span>
                  </div>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ConversationList;