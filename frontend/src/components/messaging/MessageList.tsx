import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { selectMessages, selectMessagesLoading, markAsReadLocally } from '@/store/messageSlice';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import {
  EnvelopeIcon,
  EnvelopeOpenIcon,
  UserIcon,
  ClockIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

interface MessageListProps {
  onMessageSelect?: (messageId: string) => void;
  selectedMessageId?: string;
}

const MessageList: React.FC<MessageListProps> = ({ onMessageSelect, selectedMessageId }) => {
  const dispatch = useAppDispatch();
  const messages = useAppSelector(selectMessages);
  const loading = useAppSelector(selectMessagesLoading);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const handleMessageClick = (messageId: string, isRead: boolean) => {
    if (!isRead) {
      dispatch(markAsReadLocally(parseInt(messageId)));
    }
    onMessageSelect?.(messageId);
  };

  const filteredMessages = messages.filter(message => {
    if (filter === 'unread') return !message.isRead;
    if (filter === 'read') return message.isRead;
    return true;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Hace unos minutos';
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    if (diffInHours < 48) return 'Ayer';
    return date.toLocaleDateString('es-MX', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {[
          { key: 'all', label: 'Todos' },
          { key: 'unread', label: 'No leídos' },
          { key: 'read', label: 'Leídos' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              filter === tab.key
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            {tab.key === 'unread' && (
              <Badge variant="primary" className="ml-2">
                {messages.filter(m => !m.isRead).length}
              </Badge>
            )}
          </button>
        ))}
      </div>

      {/* Messages List */}
      <div className="space-y-2">
        {filteredMessages.length === 0 ? (
          <Card className="p-8 text-center">
            <EnvelopeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'unread' ? 'No hay mensajes sin leer' : 'No hay mensajes'}
            </h3>
            <p className="text-gray-500">
              {filter === 'unread' 
                ? 'Todos tus mensajes han sido leídos.'
                : 'Tu bandeja de entrada está vacía.'}
            </p>
          </Card>
        ) : (
          filteredMessages.map((message) => (
            <Card
              key={message.id}
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedMessageId === message.id.toString() 
                  ? 'ring-2 ring-primary-500 border-primary-200' 
                  : 'hover:border-gray-300'
              } ${
                !message.isRead ? 'bg-blue-50 border-blue-200' : ''
              }`}
              onClick={() => handleMessageClick(message.id.toString(), message.isRead)}
            >
              <div className="flex items-start space-x-3">
                {/* Avatar/Icon */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-gray-500" />
                  </div>
                </div>

                {/* Message Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <h4 className={`text-sm font-medium truncate ${
                        !message.isRead ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {message.senderName || 'Usuario'}
                      </h4>
                      {!message.isRead && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <span className="text-xs text-gray-500 flex items-center">
                        <ClockIcon className="w-3 h-3 mr-1" />
                        {formatDate(message.sentAt)}
                      </span>
                      {!message.isRead ? (
                        <EnvelopeIcon className="w-4 h-4 text-blue-600" />
                      ) : (
                        <EnvelopeOpenIcon className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                  
                  <h5 className={`text-sm mb-1 ${
                    !message.isRead ? 'font-medium text-gray-900' : 'text-gray-700'
                  }`}>
                    {message.subject}
                  </h5>
                  
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {message.content}
                  </p>

                  {/* Message Tags/Category */}
                  {message.senderRole && (
                    <div className="mt-2">
                      <Badge 
                        variant={
                          message.senderRole === 'system' ? 'info' :
                          message.senderRole === 'notification' ? 'warning' :
                          'secondary'
                        }
                        className="text-xs"
                      >
                        {message.senderRole === 'system' ? 'Sistema' :
                         message.senderRole === 'notification' ? 'Notificación' :
                         'Mensaje'}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle delete message
                    }}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Load More Button */}
      {filteredMessages.length > 0 && (
        <div className="text-center pt-4">
          <Button variant="outline" size="sm">
            Cargar más mensajes
          </Button>
        </div>
      )}
    </div>
  );
};

export default MessageList;