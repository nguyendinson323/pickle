import React, { useState } from 'react';
import MessageItem from './MessageItem';
import { Message } from '../../types/messaging';

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
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <div className="text-4xl mb-4">💬</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
        <p className="text-sm text-gray-500">Start the conversation by sending a message!</p>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col space-y-4 p-4">
      {Object.entries(messageGroups).map(([date, dateMessages]) => (
        <div key={date} className="space-y-2">
          <div className="flex justify-center">
            <span className="px-3 py-1 bg-gray-100 text-xs font-medium text-gray-600 rounded-full">
              {formatDate(date)}
            </span>
          </div>
          
          <div className="space-y-1">
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
        </div>
      ))}
    </div>
  );
};

export default MessageList;