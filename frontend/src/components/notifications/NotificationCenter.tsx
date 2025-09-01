import React, { useState, useEffect } from 'react';
import {
  BellIcon,
  CheckIcon,
  TrashIcon,
  XMarkIcon,
  EllipsisHorizontalIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import { BellIcon as BellSolidIcon } from '@heroicons/react/24/solid';
import Button from '../ui/Button';
import { NotificationData, notificationService } from '../../services/notificationService';

interface NotificationCenterProps {
  className?: string;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [selectedNotification, setSelectedNotification] = useState<string | null>(null);

  useEffect(() => {
    // Load notifications and set up listeners
    const loadNotifications = () => {
      setNotifications(notificationService.getNotifications());
      setUnreadCount(notificationService.getUnreadCount());
    };

    loadNotifications();

    // Set up event listeners
    const handleNotificationsUpdated = () => {
      setNotifications(notificationService.getNotifications());
      setUnreadCount(notificationService.getUnreadCount());
    };

    const handleNewNotification = (notification: NotificationData) => {
      // Show toast or other immediate feedback
      console.log('New notification:', notification);
    };

    notificationService.on('notifications_updated', handleNotificationsUpdated);
    notificationService.on('notification_received', handleNewNotification);

    return () => {
      notificationService.off('notifications_updated', handleNotificationsUpdated);
      notificationService.off('notification_received', handleNewNotification);
    };
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') {
      return !notification.read;
    }
    return true;
  });

  const getNotificationIcon = (type: NotificationData['type']) => {
    const iconClasses = "w-10 h-10 rounded-full flex items-center justify-center text-white text-lg";
    
    switch (type) {
      case 'tournament':
        return <div className={`${iconClasses} bg-blue-500`}>🏆</div>;
      case 'player_request':
        return <div className={`${iconClasses} bg-green-500`}>👥</div>;
      case 'match':
        return <div className={`${iconClasses} bg-purple-500`}>⚡</div>;
      case 'system':
        return <div className={`${iconClasses} bg-red-500`}>⚙️</div>;
      case 'message':
        return <div className={`${iconClasses} bg-yellow-500`}>💬</div>;
      default:
        return <div className={`${iconClasses} bg-gray-500`}>📢</div>;
    }
  };

  const getPriorityColor = (priority: NotificationData['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-4 border-red-500';
      case 'high':
        return 'border-l-4 border-orange-500';
      case 'medium':
        return 'border-l-4 border-blue-500';
      case 'low':
        return 'border-l-4 border-gray-300';
      default:
        return 'border-l-4 border-gray-300';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const handleNotificationClick = (notification: NotificationData) => {
    if (!notification.read) {
      notificationService.markAsRead(notification.id);
    }

    // Handle action if notification has a primary action
    if (notification.actions && notification.actions[0]?.url) {
      window.location.href = notification.actions[0].url;
    }
  };

  const handleMarkAsRead = (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    notificationService.markAsRead(notificationId);
  };

  const handleDelete = (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    notificationService.deleteNotification(notificationId);
  };

  const handleMarkAllAsRead = () => {
    notificationService.markAllAsRead();
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      notificationService.clearAllNotifications();
    }
  };

  const handleActionClick = (e: React.MouseEvent, action: NotificationData['actions'][0]) => {
    e.stopPropagation();
    
    if (action.handler) {
      action.handler();
    } else if (action.url) {
      window.location.href = action.url;
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
        aria-label="Notifications"
      >
        {unreadCount > 0 ? (
          <BellSolidIcon className="w-6 h-6 text-blue-600" />
        ) : (
          <BellIcon className="w-6 h-6" />
        )}
        
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center min-w-[20px]">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Notification Panel */}
          <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-[600px] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  Notifications
                </h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {/* Open settings */}}
                    className="p-1"
                  >
                    <CogIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="p-1"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-1">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    filter === 'all' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    filter === 'unread' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
              </div>

              {/* Action Buttons */}
              {notifications.length > 0 && (
                <div className="flex gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                    className="flex items-center gap-1 text-xs"
                  >
                    <CheckIcon className="w-3 h-3" />
                    Mark all read
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearAll}
                    className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
                  >
                    <TrashIcon className="w-3 h-3" />
                    Clear all
                  </Button>
                </div>
              )}
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <BellIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">
                    {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors group ${
                        !notification.read ? 'bg-blue-50' : ''
                      } ${getPriorityColor(notification.priority)}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex gap-3">
                        {/* Icon */}
                        <div className="flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className={`text-sm font-medium ${
                                !notification.read ? 'text-gray-900' : 'text-gray-700'
                              }`}>
                                {notification.title}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-2">
                                {formatTimeAgo(notification.createdAt)}
                              </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 ml-2">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => handleMarkAsRead(e, notification.id)}
                                  className="p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Mark as read"
                                >
                                  <CheckIcon className="w-3 h-3" />
                                </Button>
                              )}
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => handleDelete(e, notification.id)}
                                className="p-1 opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700"
                                title="Delete notification"
                              >
                                <TrashIcon className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          {notification.actions && notification.actions.length > 0 && (
                            <div className="flex gap-2 mt-3">
                              {notification.actions.slice(0, 2).map((action, index) => (
                                <Button
                                  key={index}
                                  variant={index === 0 ? 'primary' : 'outline'}
                                  size="sm"
                                  onClick={(e) => handleActionClick(e, action)}
                                  className="text-xs"
                                >
                                  {action.label}
                                </Button>
                              ))}
                              {notification.actions.length > 2 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedNotification(
                                      selectedNotification === notification.id ? null : notification.id
                                    );
                                  }}
                                  className="p-1"
                                >
                                  <EllipsisHorizontalIcon className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          )}

                          {/* Expanded Actions */}
                          {selectedNotification === notification.id && notification.actions && notification.actions.length > 2 && (
                            <div className="flex gap-2 mt-2">
                              {notification.actions.slice(2).map((action, index) => (
                                <Button
                                  key={index + 2}
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => handleActionClick(e, action)}
                                  className="text-xs"
                                >
                                  {action.label}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {filteredNotifications.length > 5 && (
              <div className="p-3 border-t border-gray-200 text-center">
                <Button variant="ghost" size="sm" className="text-xs">
                  View all notifications
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationCenter;