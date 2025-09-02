import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../../types/messaging';
import MessageReactions from './MessageReactions';
import MessageAttachments from './MessageAttachments';
import styles from './MessageItem.module.css';

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

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
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
      return <span className={styles.deletedMessage}>{message.content}</span>;
    }

    if (isEditing) {
      return (
        <form onSubmit={handleEditSubmit} className={styles.editForm}>
          <textarea
            ref={editInputRef}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onKeyDown={handleEditKeyDown}
            className={styles.editInput}
            rows={Math.min(editContent.split('\n').length + 1, 6)}
          />
          <div className={styles.editActions}>
            <button type="button" onClick={onCancelEdit} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" className={styles.saveButton}>
              Save
            </button>
          </div>
        </form>
      );
    }

    return (
      <div className={styles.messageContent}>
        {message.content}
        {message.isEdited && (
          <span className={styles.editedIndicator} title={`Edited ${formatTime(message.editedAt!)}`}>
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
          <div className={styles.locationMessage}>
            <div className={styles.locationIcon}>📍</div>
            <div>
              <div className={styles.locationLabel}>Location shared</div>
              <div className={styles.locationAddress}>
                {message.location?.address || 'Location coordinates'}
              </div>
            </div>
          </div>
        );

      case 'match_invite':
        return (
          <div className={styles.matchInviteMessage}>
            <div className={styles.matchInviteIcon}>🎾</div>
            <div>
              <div className={styles.matchInviteLabel}>Match Invitation</div>
              <div className={styles.matchInviteDetails}>
                Court booking for {new Date(message.matchInvite?.proposedTime).toLocaleString()}
              </div>
              <div className={styles.matchInviteActions}>
                <button className={styles.acceptButton}>Accept</button>
                <button className={styles.declineButton}>Decline</button>
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
      <div className={styles.systemMessage}>
        <span className={styles.systemMessageText}>{message.content}</span>
        <span className={styles.systemMessageTime}>
          {formatTime(message.createdAt)}
        </span>
      </div>
    );
  }

  return (
    <div 
      ref={messageRef}
      className={`${styles.messageItem} ${isOwnMessage ? styles.ownMessage : styles.otherMessage}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false);
        setShowEmojiPicker(false);
      }}
    >
      {showAvatar && (
        <div className={styles.avatar}>
          <div className={styles.avatarCircle}>
            {message.sender?.firstName?.[0] || message.sender?.username?.[0] || 'U'}
          </div>
        </div>
      )}

      <div className={styles.messageBody}>
        {showAvatar && !isOwnMessage && (
          <div className={styles.senderName}>
            {message.sender?.firstName && message.sender?.lastName 
              ? `${message.sender.firstName} ${message.sender.lastName}`
              : message.sender?.username || 'Unknown User'
            }
          </div>
        )}

        <div className={styles.messageBubble}>
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
        </div>

        {showTimestamp && (
          <div className={styles.messageFooter}>
            <span className={styles.timestamp}>
              {formatTime(message.createdAt)}
            </span>
            {isOwnMessage && getReadReceiptsText() && (
              <span className={styles.readReceipts}>
                • {getReadReceiptsText()}
              </span>
            )}
          </div>
        )}

        {(showActions || showEmojiPicker) && !message.isDeleted && (
          <div className={`${styles.messageActions} ${isOwnMessage ? styles.ownActions : styles.otherActions}`}>
            <button
              className={styles.actionButton}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              title="Add reaction"
            >
              😊
            </button>

            {isOwnMessage && message.messageType === 'text' && (
              <button
                className={styles.actionButton}
                onClick={() => onStartEdit(message.id)}
                title="Edit message"
              >
                ✏️
              </button>
            )}

            {isOwnMessage && (
              <button
                className={`${styles.actionButton} ${deleteConfirm ? styles.confirmDelete : ''}`}
                onClick={handleDelete}
                title={deleteConfirm ? "Click again to confirm" : "Delete message"}
              >
                🗑️
              </button>
            )}

            {showEmojiPicker && (
              <div className={styles.emojiPicker}>
                {['👍', '👎', '❤️', '😂', '😮', '😢', '😡', '🎉'].map(emoji => (
                  <button
                    key={emoji}
                    className={styles.emojiButton}
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
    </div>
  );
};

export default MessageItem;