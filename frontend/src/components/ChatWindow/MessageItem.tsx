import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../../types/messaging';

interface MessageItemProps {
  message: Message;
  currentUserId: string;
  isEditing: boolean;
  showAvatar: boolean;
  showTimestamp: boolean;
  onStartEdit: (messageId: string) => void;
  onCancelEdit: () => void;
  onSaveEdit: (messageId: string, content: string) => Promise<void>;
  onDelete: (messageId: string) => Promise<void>;
  onAddReaction: (messageId: string, emoji: string) => Promise<void>;
  onRemoveReaction: (messageId: string) => Promise<void>;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  currentUserId,
  isEditing,
  showAvatar,
  showTimestamp,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
  onAddReaction,
  onRemoveReaction
}) => {
  const [editContent, setEditContent] = useState(message.content);
  const [showActions, setShowActions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const editInputRef = useRef<HTMLTextAreaElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);

  const isOwnMessage = message.senderId === currentUserId;
  const isSystemMessage = message.messageType === 'system';

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.setSelectionRange(editContent.length, editContent.length);
    }
  }, [isEditing, editContent]);

  const formatTime = (date: string | Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editContent.trim() && editContent !== message.content) {
      await onSaveEdit(message.id, editContent.trim());
    } else {
      onCancelEdit();
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEditSubmit(e);
    } else if (e.key === 'Escape') {
      setEditContent(message.content);
      onCancelEdit();
    }
  };

  const handleDelete = async () => {
    if (deleteConfirm) {
      await onDelete(message.id);
      setDeleteConfirm(false);
    } else {
      setDeleteConfirm(true);
      setTimeout(() => setDeleteConfirm(false), 3000);
    }
  };

  const handleReaction = async (emoji: string) => {
    const existingReaction = message.reactions.find(
      reaction => reaction.userId === currentUserId
    );

    if (existingReaction) {
      if (existingReaction.emoji === emoji) {
        await onRemoveReaction(message.id);
      } else {
        await onAddReaction(message.id, emoji);
      }
    } else {
      await onAddReaction(message.id, emoji);
    }
    setShowEmojiPicker(false);
  };

  const getReadReceiptsText = () => {
    const readCount = message.readBy.filter(read => read.userId !== currentUserId).length;
    if (readCount === 0) return '';
    if (readCount === 1) return 'Read by 1 person';
    return `Read by ${readCount} people`;
  };

  const renderMessageContent = () => {
    if (message.isDeleted) {
      return <span className="text-gray-400 italic">{message.content}</span>;
    }

    if (isEditing) {
      return (
        <form onSubmit={handleEditSubmit} className="space-y-2">
          <textarea
            ref={editInputRef}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onKeyDown={handleEditKeyDown}
            className="w-full p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={Math.min(editContent.split('\n').length + 1, 6)}
          />
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onCancelEdit} className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800">
              Cancel
            </button>
            <button type="submit" className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
              Save
            </button>
          </div>
        </form>
      );
    }

    return (
      <div className="break-words">
        {message.content}
        {message.isEdited && (
          <span className="text-xs text-gray-400 ml-2" title={`Edited ${message.editedAt ? formatTime(message.editedAt) : ''}`}>
            (edited)
          </span>
        )}
      </div>
    );
  };

  const renderSpecialContent = () => {
    switch (message.messageType) {
      case 'location':
        return (
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg mt-2">
            <div className="text-2xl">📍</div>
            <div>
              <div className="font-medium text-gray-900">Location shared</div>
              <div className="text-sm text-gray-600">
                {message.location?.address || 'Location coordinates'}
              </div>
            </div>
          </div>
        );

      case 'match_invite':
        return (
          <div className="p-3 bg-green-50 rounded-lg mt-2 border border-green-200">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🎾</div>
              <div className="flex-1">
                <div className="font-medium text-green-900">Match Invitation</div>
                <div className="text-sm text-gray-600">
                  Court booking for {message.matchInvite?.proposedTime ? new Date(message.matchInvite.proposedTime).toLocaleString() : 'TBD'}
                </div>
                <div className="flex space-x-2 mt-2">
                  <button className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600">Accept</button>
                  <button className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Decline</button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isSystemMessage) {
    return (
      <div className="flex justify-center py-2">
        <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600 space-x-2">
          <span>{message.content}</span>
          <span className="text-xs text-gray-400">
            {formatTime(message.createdAt)}
          </span>
        </div>
      </div>
    );
  };

  // Simple MessageAttachments component
  const MessageAttachments = ({ attachments }: { attachments: any[] }) => (
    <div className="mt-2 space-y-2">
      {attachments.map((attachment, index) => (
        <div key={index} className="p-2 bg-gray-100 rounded border">
          <div className="text-sm text-gray-600">{attachment.filename || 'Attachment'}</div>
        </div>
      ))}
    </div>
  );

  // Simple MessageReactions component
  const MessageReactions = ({ reactions, onReaction, currentUserId }: { 
    reactions: any[], 
    onReaction: (emoji: string) => void, 
    currentUserId: string 
  }) => (
    <div className="flex flex-wrap gap-1 mt-2">
      {reactions.map((reaction, index) => (
        <button
          key={index}
          onClick={() => onReaction(reaction.emoji)}
          className={`px-2 py-1 rounded-full text-xs flex items-center space-x-1 ${
            reaction.userId === currentUserId 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <span>{reaction.emoji}</span>
        </button>
      ))}
    </div>
  );

  return (
    <div 
      ref={messageRef}
      className={`flex space-x-2 py-2 group hover:bg-gray-50 ${
        isOwnMessage ? 'flex-row-reverse space-x-reverse' : 'flex-row'
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false);
        setShowEmojiPicker(false);
      }}
    >
      {showAvatar && (
        <div className={`flex-shrink-0 ${isOwnMessage ? 'order-2' : 'order-1'}`}>
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
            {message.sender?.firstName?.[0] || message.sender?.username?.[0] || 'U'}
          </div>
        </div>
      )}

      <div className={`flex-1 max-w-xs ${isOwnMessage ? 'order-1' : 'order-2'}`}>
        {showAvatar && !isOwnMessage && (
          <div className="text-sm font-medium text-gray-900 mb-1">
            {message.sender?.firstName && message.sender?.lastName 
              ? `${message.sender.firstName} ${message.sender.lastName}`
              : message.sender?.username || 'Unknown User'
            }
          </div>
        )}

        <div className={`relative p-3 rounded-lg ${
          isOwnMessage 
            ? 'bg-blue-500 text-white ml-auto' 
            : 'bg-gray-200 text-gray-900'
        }`}>
          {renderMessageContent()}
          {renderSpecialContent()}
          
          {message.attachments && message.attachments.length > 0 && (
            <MessageAttachments attachments={message.attachments} />
          )}

          {message.reactions && message.reactions.length > 0 && (
            <MessageReactions 
              reactions={message.reactions}
              onReaction={handleReaction}
              currentUserId={currentUserId}
            />
          )}

          {(showActions || showEmojiPicker) && !message.isDeleted && (
            <div className={`absolute top-0 -mt-8 flex space-x-1 ${
              isOwnMessage ? 'right-0' : 'left-0'
            }`}>
              <button
                className="p-1 bg-white border border-gray-200 rounded-full shadow hover:bg-gray-50"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                title="Add reaction"
              >
                😊
              </button>

              {isOwnMessage && message.messageType === 'text' && (
                <button
                  className="p-1 bg-white border border-gray-200 rounded-full shadow hover:bg-gray-50"
                  onClick={() => onStartEdit(message.id)}
                  title="Edit message"
                >
                  ✏️
                </button>
              )}

              {isOwnMessage && (
                <button
                  className={`p-1 bg-white border border-gray-200 rounded-full shadow hover:bg-gray-50 ${
                    deleteConfirm ? 'bg-red-100 border-red-300' : ''
                  }`}
                  onClick={handleDelete}
                  title={deleteConfirm ? "Click again to confirm" : "Delete message"}
                >
                  🗑️
                </button>
              )}

              {showEmojiPicker && (
                <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex space-x-1 z-10">
                  {['👍', '👎', '❤️', '😂', '😮', '😢', '😡', '🎉'].map(emoji => (
                    <button
                      key={emoji}
                      className="p-1 hover:bg-gray-100 rounded text-lg"
                      onClick={() => handleReaction(emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {showTimestamp && (
          <div className={`flex items-center space-x-2 mt-1 text-xs text-gray-400 ${
            isOwnMessage ? 'justify-end' : 'justify-start'
          }`}>
            <span>{formatTime(message.createdAt)}</span>
            {isOwnMessage && getReadReceiptsText() && (
              <span>• {getReadReceiptsText()}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;