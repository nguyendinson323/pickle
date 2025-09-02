import React, { useState, useRef, useEffect } from 'react';
import { useMessaging } from '../../contexts/MessagingContext';
import { useAppSelector } from '../../store';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

interface NotificationBellProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ 
  className = '', 
  size = 'md' 
}) => {
  const navigate = useNavigate();
  const { unreadNotifications, markNotificationAsRead } = useMessaging();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = unreadNotifications.length;
  
  // Size configurations
  const sizeClasses = {
    sm: {
      button: 'w-8 h-8',
      icon: 'w-4 h-4',
      badge: 'w-4 h-4 text-xs',
      dropdown: 'w-80'
    },
    md: {
      button: 'w-10 h-10',
      icon: 'w-5 h-5',
      badge: 'w-5 h-5 text-xs',
      dropdown: 'w-96'
    },
    lg: {
      button: 'w-12 h-12',
      icon: 'w-6 h-6',
      badge: 'w-6 h-6 text-sm',
      dropdown: 'w-96'
    }
  };

  const sizes = sizeClasses[size];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  // Don't render if user is not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const handleNotificationClick = async (notification: any) => {
    // Mark as read
    try {
      await markNotificationAsRead(notification.id);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }

    // Navigate based on notification type
    if (notification.actionUrl) {
      if (notification.actionUrl.startsWith('/')) {
        navigate(notification.actionUrl);
      } else {
        window.open(notification.actionUrl, '_blank');
      }
    } else {
      // Default navigation based on type
      switch (notification.type) {
        case 'message':
          navigate(ROUTES.MESSAGING);
          break;
        case 'tournament':
          navigate(ROUTES.TOURNAMENTS);
          break;
        case 'booking':
          navigate(ROUTES.COURTS);
          break;
        default:
          navigate(ROUTES.DASHBOARD);
      }
    }
    
    setShowDropdown(false);
  };

  const handleViewAllNotifications = () => {
    navigate('/notifications');
    setShowDropdown(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'urgent':
        return 'text-red-600 bg-red-50';
      case 'warning':
        return 'text-orange-600 bg-orange-50';
      case 'success':
        return 'text-green-600 bg-green-50';
      case 'error':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'urgent':
        return '🚨';
      case 'warning':
        return '⚠️';
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - notificationDate.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`
          ${sizes.button} 
          relative inline-flex items-center justify-center
          rounded-full bg-gray-100 hover:bg-gray-200 
          text-gray-600 hover:text-gray-800
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        `}
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
      >
        {/* Bell Icon */}
        <svg 
          className={sizes.icon} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 17h5l-5 5v-5zM4 17h6M4 8h8M4 12h8" 
          />
        </svg>

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span 
            className={`
              ${sizes.badge}
              absolute -top-1 -right-1
              inline-flex items-center justify-center
              bg-red-500 text-white font-bold rounded-full
            `}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div className={`
          ${sizes.dropdown}
          absolute right-0 top-full mt-2 
          bg-white rounded-lg shadow-lg border border-gray-200
          z-50 max-h-96 overflow-hidden
        `}>
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="text-xs text-gray-500">
                  {unreadCount} unread
                </span>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {unreadNotifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <div className="text-gray-400 text-4xl mb-2">🔔</div>
                <p className="text-sm text-gray-500">
                  No new notifications
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {unreadNotifications.slice(0, 10).map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      {/* Category Icon */}
                      <div className={`
                        flex-shrink-0 w-8 h-8 rounded-full 
                        flex items-center justify-center text-sm
                        ${getCategoryColor(notification.category)}
                      `}>
                        {getCategoryIcon(notification.category)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {getTimeAgo(notification.createdAt)}
                        </p>
                      </div>

                      {/* Action indicator */}
                      {notification.actionUrl && (
                        <div className="flex-shrink-0">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {unreadNotifications.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleViewAllNotifications}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View All Notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;