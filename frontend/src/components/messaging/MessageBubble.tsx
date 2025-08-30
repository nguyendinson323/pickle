import React, { useState } from 'react';

interface MessageReaction {
  id: number;
  reaction: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
  };
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
  reactions?: MessageReaction[];
  readStatus?: Array<{
    id: number;
    userId: number;
    readAt: string;
  }>;
  attachments?: string[];
  metadata?: Record<string, any>;
}

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showSender?: boolean;
  currentUserId: number;
  onReact?: (messageId: number, reaction: string) => void;
  onReply?: (message: Message) => void;
  onEdit?: (message: Message) => void;
  onDelete?: (messageId: number) => void;
  className?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  showSender = true,
  currentUserId,
  onReact,
  onReply,
  onEdit,
  onDelete,
  className = ""
}) => {
  const [showActions, setShowActions] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  const quickReactions = ['👍', '❤️', '😂', '😮', '😢', '👎'];

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return formatTime(dateString);
    } else if (diffDays === 1) {
      return `Ayer ${formatTime(dateString)}`;
    } else {
      return date.toLocaleDateString('es-MX', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    }
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'file':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        );
      case 'location':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case 'system':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getReactionCounts = () => {
    if (!message.reactions?.length) return {};
    
    const counts: Record<string, { count: number; users: string[], hasCurrentUser: boolean }> = {};
    
    message.reactions.forEach(reaction => {
      if (!counts[reaction.reaction]) {
        counts[reaction.reaction] = { count: 0, users: [], hasCurrentUser: false };
      }
      counts[reaction.reaction].count++;
      counts[reaction.reaction].users.push(`${reaction.user.firstName} ${reaction.user.lastName}`);
      if (reaction.user.id === currentUserId) {
        counts[reaction.reaction].hasCurrentUser = true;
      }
    });

    return counts;
  };

  const handleReaction = (reaction: string) => {
    if (onReact) {
      onReact(message.id, reaction);
    }
    setShowReactionPicker(false);
  };

  const renderAttachments = () => {
    if (!message.attachments?.length) return null;

    return (
      <div className="mt-2 space-y-2">
        {message.attachments.map((attachment, index) => {
          const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(attachment);
          
          if (isImage) {
            return (
              <img
                key={index}
                src={attachment}
                alt="Imagen adjunta"
                className="max-w-xs rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => window.open(attachment, '_blank')}
              />
            );
          } else {
            return (
              <a
                key={index}
                href={attachment}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors max-w-xs"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                <span className="text-sm text-gray-700 truncate">
                  {attachment.split('/').pop()}
                </span>
              </a>
            );
          }
        })}
      </div>
    );
  };

  const reactionCounts = getReactionCounts();
  const hasReactions = Object.keys(reactionCounts).length > 0;

  return (
    <div 
      className={`group flex ${isOwn ? 'justify-end' : 'justify-start'} ${className}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false);
        setShowReactionPicker(false);
      }}
    >
      <div className={`max-w-xs md:max-w-md lg:max-w-lg ${isOwn ? 'order-2' : 'order-1'}`}>
        {/* Sender info */}
        {!isOwn && showSender && (
          <div className="flex items-center mb-1">
            {message.sender.profileImageUrl ? (
              <img
                src={message.sender.profileImageUrl}
                alt={`${message.sender.firstName} ${message.sender.lastName}`}
                className="w-6 h-6 rounded-full mr-2"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center mr-2">
                <span className="text-xs font-medium text-gray-600">
                  {message.sender.firstName.charAt(0)}
                </span>
              </div>
            )}
            <span className="text-xs text-gray-600 font-medium">
              {message.sender.firstName} {message.sender.lastName}
            </span>
          </div>
        )}

        {/* Reply context */}
        {message.replyTo && (
          <div className={`mb-2 p-2 rounded-lg border-l-3 ${
            isOwn ? 'bg-blue-50 border-blue-400' : 'bg-gray-50 border-gray-400'
          }`}>
            <div className="text-xs text-gray-600 font-medium mb-1">
              Respondiendo a {message.replyTo.sender.firstName}
            </div>
            <div className="text-xs text-gray-700 line-clamp-2">
              {message.replyTo.content}
            </div>
          </div>
        )}

        {/* Message bubble */}
        <div className={`relative rounded-2xl px-4 py-2 ${
          message.messageType === 'system' 
            ? 'bg-gray-100 text-gray-700 text-center text-sm italic'
            : isOwn 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-900'
        }`}>
          {/* Message type indicator */}
          {message.messageType !== 'text' && message.messageType !== 'system' && (
            <div className="flex items-center gap-1 mb-1 text-xs opacity-70">
              {getMessageTypeIcon(message.messageType)}
              <span className="capitalize">{message.messageType}</span>
            </div>
          )}

          {/* Message content */}
          <div className="break-words">
            {message.content}
          </div>

          {/* Attachments */}
          {renderAttachments()}

          {/* Message info */}
          <div className={`flex items-center justify-between text-xs mt-1 ${
            isOwn ? 'text-blue-100' : 'text-gray-500'
          }`}>
            <span>{formatDate(message.createdAt)}</span>
            <div className="flex items-center gap-1">
              {message.isEdited && (
                <span className="opacity-70">editado</span>
              )}
              {isOwn && (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* Reactions */}
        {hasReactions && (
          <div className="flex flex-wrap gap-1 mt-1">
            {Object.entries(reactionCounts).map(([reaction, data]) => (
              <button
                key={reaction}
                onClick={() => handleReaction(reaction)}
                className={`px-2 py-1 rounded-full text-xs border transition-colors ${
                  data.hasCurrentUser
                    ? 'bg-blue-100 border-blue-300 text-blue-800'
                    : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                }`}
                title={data.users.join(', ')}
              >
                {reaction} {data.count}
              </button>
            ))}
          </div>
        )}

        {/* Action buttons */}
        {(showActions || showReactionPicker) && message.messageType !== 'system' && (
          <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            {/* Reaction picker */}
            {showReactionPicker && (
              <div className="flex items-center gap-1 p-1 bg-white border rounded-lg shadow-lg">
                {quickReactions.map(reaction => (
                  <button
                    key={reaction}
                    onClick={() => handleReaction(reaction)}
                    className="p-1 hover:bg-gray-100 rounded text-sm"
                  >
                    {reaction}
                  </button>
                ))}
              </div>
            )}

            {/* Action buttons */}
            {!showReactionPicker && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {onReact && (
                  <button
                    onClick={() => setShowReactionPicker(true)}
                    className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-gray-700"
                    title="Reaccionar"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                )}

                {onReply && (
                  <button
                    onClick={() => onReply(message)}
                    className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-gray-700"
                    title="Responder"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                  </button>
                )}

                {isOwn && onEdit && (
                  <button
                    onClick={() => onEdit(message)}
                    className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-gray-700"
                    title="Editar"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                )}

                {isOwn && onDelete && (
                  <button
                    onClick={() => onDelete(message.id)}
                    className="p-1 hover:bg-gray-200 rounded text-red-500 hover:text-red-700"
                    title="Eliminar"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;