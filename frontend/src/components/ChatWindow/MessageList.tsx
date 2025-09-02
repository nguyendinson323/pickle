import React, { useState } from 'react';
import MessageItem from './MessageItem';
import { Message } from '../../types/messaging';
import styles from './MessageList.module.css';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  onEditMessage: (messageId: string, content: string) => Promise<void>;
  onDeleteMessage: (messageId: string) => Promise<void>;
  onAddReaction: (messageId: string, emoji: string) => Promise<void>;
  onRemoveReaction: (messageId: string) => Promise<void>;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  onEditMessage,
  onDeleteMessage,
  onAddReaction,
  onRemoveReaction
}) => {
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

  const handleStartEdit = (messageId: string) => {
    setEditingMessageId(messageId);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
  };

  const handleSaveEdit = async (messageId: string, content: string) => {
    try {
      await onEditMessage(messageId, content);
      setEditingMessageId(null);
    } catch (error) {
      console.error('Failed to edit message:', error);
    }
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [date: string]: Message[] } = {};
    
    messages.forEach(message => {
      const date = new Date(message.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });

    return groups;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  const shouldShowAvatar = (currentMessage: Message, previousMessage?: Message) => {
    if (!previousMessage) return true;
    
    return (
      currentMessage.senderId !== previousMessage.senderId ||
      new Date(currentMessage.createdAt).getTime() - new Date(previousMessage.createdAt).getTime() > 5 * 60 * 1000 // 5 minutes
    );
  };

  const shouldShowTimestamp = (currentMessage: Message, nextMessage?: Message) => {
    if (!nextMessage) return true;
    
    return (
      currentMessage.senderId !== nextMessage.senderId ||
      new Date(nextMessage.createdAt).getTime() - new Date(currentMessage.createdAt).getTime() > 5 * 60 * 1000 // 5 minutes
    );
  };

  if (messages.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>💬</div>
        <h3>No messages yet</h3>
        <p>Start the conversation by sending a message!</p>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className={styles.messageList}>
      {Object.entries(messageGroups).map(([date, dateMessages]) => (
        <div key={date} className={styles.dateGroup}>
          <div className={styles.dateDivider}>
            <span className={styles.dateLabel}>{formatDate(date)}</span>
          </div>
          
          {dateMessages.map((message, index) => (
            <MessageItem
              key={message.id}
              message={message}
              currentUserId={currentUserId}
              isEditing={editingMessageId === message.id}
              showAvatar={shouldShowAvatar(message, dateMessages[index - 1])}
              showTimestamp={shouldShowTimestamp(message, dateMessages[index + 1])}
              onStartEdit={handleStartEdit}
              onCancelEdit={handleCancelEdit}
              onSaveEdit={handleSaveEdit}
              onDelete={onDeleteMessage}
              onAddReaction={onAddReaction}
              onRemoveReaction={onRemoveReaction}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default MessageList;