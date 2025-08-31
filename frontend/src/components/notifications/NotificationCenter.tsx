import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { 
  selectNotifications, 
  selectNotificationsLoading, 
  markNotificationAsRead,
  dismissNotification
} from '@/store/notificationSlice';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import {
  BellIcon,
  XMarkIcon,
  CheckIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectNotifications);
  const loading = useAppSelector(selectNotificationsLoading);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = notifications.filter(notification => 
    filter === 'all' || !notification.isRead
  );

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <InformationCircleIcon className="w-5 h-5 text-blue-500" />;
    }
  };

  const getNotificationVariant = (type: string) => {
    switch (type) {
      case 'success': return 'success' as const;
      case 'warning': return 'warning' as const;
      case 'error': return 'error' as const;
      default: return 'info' as const;
    }
  };

  const formatNotificationDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const handleMarkAsRead = (notificationId: string) => {
    dispatch(markNotificationAsRead(notificationId));
  };

  const handleDismiss = (notificationId: string) => {
    dispatch(dismissNotification(notificationId));
  };

  const handleMarkAllAsRead = () => {
    notifications
      .filter(n => !n.isRead)
      .forEach(n => dispatch(markNotificationAsRead(n.id)));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
        onClick={onClose}
      />
      
      {/* Notification Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md">
          <Card className="h-full flex flex-col shadow-xl">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BellIcon className="w-6 h-6 text-gray-700" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Notifications
                  </h2>
                  {unreadCount > 0 && (
                    <Badge variant="primary">
                      {unreadCount}
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                >
                  <XMarkIcon className="w-5 h-5" />
                </Button>
              </div>
              
              {/* Filter Tabs */}
              <div className="mt-4 flex space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setFilter('all')}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                    filter === 'all'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                    filter === 'unread'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Unread {unreadCount > 0 && `(${unreadCount})`}
                </button>
              </div>
            </div>

            {/* Actions */}
            {unreadCount > 0 && (
              <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  leftIcon={<CheckIcon className="w-4 h-4" />}
                >
                  Mark all as read
                </Button>
              </div>
            )}

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <LoadingSpinner size="md" />
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <BellIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
                  </h3>
                  <p className="text-gray-500">
                    {filter === 'unread' 
                      ? 'All your notifications have been read.'
                      : 'We\'ll notify you when you have something new.'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition-colors ${
                        !notification.isRead ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {/* Icon */}
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className={`text-sm font-medium truncate ${
                              !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </p>
                            <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                              <span className="text-xs text-gray-500">
                                {formatNotificationDate(notification.createdAt)}
                              </span>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              )}
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">
                            {notification.message}
                          </p>

                          {/* Notification Type Badge */}
                          <div className="flex items-center justify-between">
                            <Badge 
                              variant={getNotificationVariant(notification.type)}
                              className="text-xs"
                            >
                              {notification.type === 'success' ? 'Success' :
                               notification.type === 'warning' ? 'Warning' :
                               notification.type === 'error' ? 'Error' :
                               'Information'}
                            </Badge>
                            
                            {/* Actions */}
                            <div className="flex space-x-1">
                              {!notification.isRead && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className="text-xs px-2 py-1"
                                >
                                  Mark read
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDismiss(notification.id)}
                                className="text-xs px-2 py-1 text-red-600 hover:text-red-700"
                              >
                                <XMarkIcon className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="text-center">
                <Button variant="outline" size="sm" onClick={onClose}>
                  Close Notification Center
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;