import React, { useState, useEffect } from 'react';
import { useAppSelector } from '@/store';
import { selectUser } from '@/store/authSlice';
import { XMarkIcon, BellIcon, CheckIcon, TrashIcon } from '@heroicons/react/24/outline';
import { 
  ExclamationTriangleIcon, 
  InformationCircleIcon, 
  CheckCircleIcon,
  UserGroupIcon,
  TrophyIcon,
  ChatBubbleLeftIcon,
  DocumentTextIcon
} from '@heroicons/react/24/solid';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'message' | 'tournament' | 'membership' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionRequired?: boolean;
  actions?: Array<{
    label: string;
    action: () => void;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  }>;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const user = useAppSelector(selectUser);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'important'>('all');
  const [loading, setLoading] = useState(false);

  // Mock notifications - in real implementation, fetch from API
  useEffect(() => {
    if (isOpen && user) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const mockNotifications: Notification[] = [
          {
            id: '1',
            type: 'tournament',
            title: 'Tournament Registration Open',
            message: 'Registration is now open for the Mexico National Championship 2024. Early bird pricing ends in 3 days.',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            read: false,
            actionRequired: true,
            actions: [
              { label: 'Register Now', action: () => {}, variant: 'primary' },
              { label: 'View Details', action: () => {}, variant: 'secondary' }
            ]
          },
          {
            id: '2',
            type: 'message',
            title: 'New Message from Coach Martinez',
            message: 'Your training schedule for next week has been updated. Please review the changes.',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
            read: false,
            actions: [
              { label: 'View Message', action: () => {}, variant: 'primary' }
            ]
          },
          {
            id: '3',
            type: 'success',
            title: 'Profile Updated',
            message: 'Your player profile has been successfully updated with new NRTP level.',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
            read: true
          },
          {
            id: '4',
            type: 'warning',
            title: 'Membership Renewal Reminder',
            message: 'Your admin membership expires in 30 days. Renew now to avoid service interruption.',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            read: false,
            actionRequired: true,
            actions: [
              { label: 'Renew Now', action: () => {}, variant: 'warning' },
              { label: 'Learn More', action: () => {}, variant: 'secondary' }
            ]
          },
          {
            id: '5',
            type: 'info',
            title: 'New Court Available',
            message: 'Club Deportivo Mexicali has added 2 new courts to their facility.',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
            read: true
          },
          {
            id: '6',
            type: 'system',
            title: 'Platform Maintenance',
            message: 'Scheduled maintenance will occur on Sunday, March 15th from 2:00 AM to 4:00 AM PST.',
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
            read: true
          }
        ];
        setNotifications(mockNotifications);
        setLoading(false);
      }, 500);
    }
  }, [isOpen, user]);

  const getNotificationIcon = (type: Notification['type']) => {
    const iconClasses = "h-5 w-5";
    
    switch (type) {
      case 'success':
        return <CheckCircleIcon className={`${iconClasses} text-green-500`} />;
      case 'warning':
        return <ExclamationTriangleIcon className={`${iconClasses} text-yellow-500`} />;
      case 'error':
        return <ExclamationTriangleIcon className={`${iconClasses} text-red-500`} />;
      case 'message':
        return <ChatBubbleLeftIcon className={`${iconClasses} text-blue-500`} />;
      case 'tournament':
        return <TrophyIcon className={`${iconClasses} text-purple-500`} />;
      case 'membership':
        return <UserGroupIcon className={`${iconClasses} text-indigo-500`} />;
      case 'system':
        return <DocumentTextIcon className={`${iconClasses} text-gray-500`} />;
      default:
        return <InformationCircleIcon className={`${iconClasses} text-blue-500`} />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else if (days < 7) {
      return `${days}d ago`;
    } else {
      return timestamp.toLocaleDateString();
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.read;
      case 'important':
        return notification.actionRequired;
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 overflow-hidden z-50">
      <div className="absolute inset-0 overflow-hidden">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-25 transition-opacity"
          onClick={onClose}
        />

        {/* Slide-over panel */}
        <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
          <div className="w-screen max-w-md">
            <div className="h-full flex flex-col bg-white shadow-xl">
              {/* Header */}
              <div className="flex-shrink-0 px-4 py-6 bg-gradient-to-r from-primary-600 to-primary-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BellIcon className="h-6 w-6 text-white mr-3" />
                    <div>
                      <h2 className="text-lg font-medium text-white">Notifications</h2>
                      {unreadCount > 0 && (
                        <p className="text-sm text-primary-100">
                          {unreadCount} unread
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-primary-200 hover:text-white transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Filter tabs */}
                <div className="flex space-x-4 mt-4">
                  {[
                    { key: 'all', label: 'All' },
                    { key: 'unread', label: 'Unread', count: unreadCount },
                    { key: 'important', label: 'Important', count: notifications.filter(n => n.actionRequired).length }
                  ].map(({ key, label, count }) => (
                    <button
                      key={key}
                      onClick={() => setFilter(key as any)}
                      className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        filter === key
                          ? 'bg-white/20 text-white'
                          : 'text-primary-200 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span>{label}</span>
                      {count !== undefined && count > 0 && (
                        <Badge variant="error" size="sm" className="text-xs">
                          {count}
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              {notifications.length > 0 && unreadCount > 0 && (
                <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={markAllAsRead}
                    className="w-full"
                  >
                    <CheckIcon className="h-4 w-4 mr-2" />
                    Mark All as Read
                  </Button>
                </div>
              )}

              {/* Notifications list */}
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  </div>
                ) : filteredNotifications.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {filter === 'unread' ? "You're all caught up!" : "You don't have any notifications yet."}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-gray-50 transition-colors ${
                          !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className={`text-sm font-medium ${
                                  !notification.read ? 'text-gray-900' : 'text-gray-700'
                                }`}>
                                  {notification.title}
                                </p>
                                <p className="mt-1 text-sm text-gray-600">
                                  {notification.message}
                                </p>
                                <p className="mt-2 text-xs text-gray-500">
                                  {formatTimestamp(notification.timestamp)}
                                </p>
                              </div>
                              
                              <div className="flex items-center space-x-2 ml-3">
                                {!notification.read && (
                                  <button
                                    onClick={() => markAsRead(notification.id)}
                                    className="text-blue-600 hover:text-blue-800"
                                    title="Mark as read"
                                  >
                                    <CheckIcon className="h-4 w-4" />
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteNotification(notification.id)}
                                  className="text-gray-400 hover:text-red-500"
                                  title="Delete"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </div>

                            {/* Action buttons */}
                            {notification.actions && notification.actions.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {notification.actions.map((action, index) => (
                                  <Button
                                    key={index}
                                    variant={action.variant || 'secondary'}
                                    size="sm"
                                    onClick={action.action}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;