import React from 'react';
import { cn, formatDateTime } from '../../utils/helpers';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

interface MessageItemProps {
  message: {
    id: number;
    subject: string;
    content: string;
    senderName: string;
    senderRole: string;
    isRead: boolean;
    isUrgent: boolean;
    sentAt: string;
    attachments?: any[];
  };
  isSelected?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
  onMarkAsRead?: () => void;
  className?: string;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isSelected = false,
  onClick,
  onDelete,
  onMarkAsRead,
  className
}) => {
  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMarkAsRead?.();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <Card
      className={cn(
        'p-4 cursor-pointer transition-all hover:shadow-md border',
        isSelected
          ? 'ring-2 ring-blue-500 border-blue-200'
          : 'hover:border-gray-300',
        !message.isRead && 'bg-blue-50 border-blue-200',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start space-x-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>

        {/* Message Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2 min-w-0">
              <h4 className={cn(
                'text-sm font-medium truncate',
                !message.isRead ? 'text-gray-900' : 'text-gray-700'
              )}>
                {message.senderName}
              </h4>
              
              {!message.isRead && (
                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
              )}
              
              {message.isUrgent && (
                <Badge variant="warning" size="sm" className="flex-shrink-0">
                  Urgent
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
              <span className="text-xs text-gray-500">
                {formatDateTime(message.sentAt)}
              </span>
              
              {/* Read/Unread Icon */}
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

          <h5 className={cn(
            'text-sm mb-1 line-clamp-1',
            !message.isRead ? 'font-medium text-gray-900' : 'text-gray-700'
          )}>
            {message.subject}
          </h5>

          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
            {message.content}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {message.senderRole && (
                <Badge
                  variant={
                    message.senderRole === 'system' ? 'info' :
                    message.senderRole === 'admin' ? 'primary' :
                    'secondary'
                  }
                  size="sm"
                >
                  {message.senderRole === 'system' ? 'System' :
                   message.senderRole === 'admin' ? 'Federation' :
                   message.senderRole}
                </Badge>
              )}
              
              {message.attachments && message.attachments.length > 0 && (
                <div className="flex items-center text-xs text-gray-500">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  {message.attachments.length} file{message.attachments.length > 1 ? 's' : ''}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {!message.isRead && onMarkAsRead && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleMarkAsRead}
                  className="text-xs px-2 py-1"
                >
                  Mark as read
                </Button>
              )}
              
              {onDelete && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleDelete}
                  className="text-red-600 hover:text-red-700 px-2 py-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MessageItem;