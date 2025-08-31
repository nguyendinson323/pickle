import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import LoadingSpinner from '../common/LoadingSpinner';
// Using simple SVG icons instead of Heroicons

interface MessageListProps {
  onMessageSelect?: (messageId: string) => void;
  selectedMessageId?: string;
}

const MessageList: React.FC<MessageListProps> = ({ onMessageSelect, selectedMessageId }) => {
  const dispatch = useAppDispatch();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const handleMessageClick = (messageId: string, isRead: boolean) => {
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
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
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
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
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
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatDate(message.sentAt)}
                      </span>
                      {!message.isRead ? (
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M12 12l-6.75 4.5M12 12l6.75 4.5" />
                        </svg>
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
                    variant="secondary"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle delete message
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
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
          <Button variant="secondary" size="sm">
            Cargar más mensajes
          </Button>
        </div>
      )}
    </div>
  );
};

export default MessageList;