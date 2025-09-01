import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { UserFeedback, ErrorLevel } from '../../services/errorService';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  actions?: Array<{
    label: string;
    action: () => void;
    style?: 'primary' | 'secondary' | 'danger';
  }>;
}

interface NotificationSystemProps {
  maxToasts?: number;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ 
  maxToasts = 5 
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<UserFeedback | null>(null);

  // Add toast notification
  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newToast: Toast = {
      id,
      duration: toast.duration || 5000,
      ...toast
    };

    setToasts(prev => {
      const updated = [newToast, ...prev];
      // Keep only the most recent toasts
      return updated.slice(0, maxToasts);
    });

    // Auto-remove toast after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
  }, [maxToasts]);

  // Remove toast by ID
  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Show modal
  const showModalFeedback = useCallback((feedback: UserFeedback) => {
    setModalContent(feedback);
    setShowModal(true);
  }, []);

  // Hide modal
  const hideModal = useCallback(() => {
    setShowModal(false);
    setModalContent(null);
  }, []);

  // Handle feedback from error service
  const handleFeedback = useCallback((feedback: UserFeedback) => {
    switch (feedback.type) {
      case 'toast':
        addToast({
          type: getToastType(feedback.title),
          title: feedback.title,
          message: feedback.message,
          duration: feedback.duration,
          actions: feedback.actions
        });
        break;
      case 'modal':
        showModalFeedback(feedback);
        break;
      case 'banner':
        // Could implement a banner notification system here
        console.log('Banner notification:', feedback);
        break;
      default:
        addToast({
          type: 'info',
          title: feedback.title,
          message: feedback.message,
          duration: feedback.duration
        });
    }
  }, [addToast, showModalFeedback]);

  // Expose methods globally for error service
  useEffect(() => {
    (window as any).showNotification = handleFeedback;
    
    return () => {
      delete (window as any).showNotification;
    };
  }, [handleFeedback]);

  // Get toast type from feedback title/level
  const getToastType = (title: string): Toast['type'] => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('success') || titleLower.includes('completed')) return 'success';
    if (titleLower.includes('error') || titleLower.includes('critical')) return 'error';
    if (titleLower.includes('warning')) return 'warning';
    return 'info';
  };

  // Get icon for toast type
  const getToastIcon = (type: Toast['type']) => {
    const iconClass = "h-5 w-5";
    switch (type) {
      case 'success':
        return <CheckCircle className={`${iconClass} text-green-500`} />;
      case 'error':
        return <AlertCircle className={`${iconClass} text-red-500`} />;
      case 'warning':
        return <AlertTriangle className={`${iconClass} text-yellow-500`} />;
      case 'info':
      default:
        return <Info className={`${iconClass} text-blue-500`} />;
    }
  };

  // Get toast styling
  const getToastStyling = (type: Toast['type']) => {
    const base = "border-l-4 bg-white shadow-lg rounded-r-lg";
    switch (type) {
      case 'success':
        return `${base} border-green-500`;
      case 'error':
        return `${base} border-red-500`;
      case 'warning':
        return `${base} border-yellow-500`;
      case 'info':
      default:
        return `${base} border-blue-500`;
    }
  };

  // Get button styling
  const getButtonStyling = (style: 'primary' | 'secondary' | 'danger' = 'primary') => {
    const base = "px-3 py-1 rounded text-sm font-medium transition-colors";
    switch (style) {
      case 'primary':
        return `${base} bg-blue-600 text-white hover:bg-blue-700`;
      case 'secondary':
        return `${base} bg-gray-200 text-gray-800 hover:bg-gray-300`;
      case 'danger':
        return `${base} bg-red-600 text-white hover:bg-red-700`;
      default:
        return `${base} bg-blue-600 text-white hover:bg-blue-700`;
    }
  };

  const toastContainer = (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${getToastStyling(toast.type)} p-4 max-w-sm animate-in slide-in-from-right-full duration-300`}
        >
          <div className="flex items-start gap-3">
            {getToastIcon(toast.type)}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">{toast.title}</p>
              <p className="text-sm text-gray-600 mt-1">{toast.message}</p>
              
              {toast.actions && toast.actions.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {toast.actions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        action.action();
                        removeToast(toast.id);
                      }}
                      className={getButtonStyling(action.style)}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const modalElement = showModal && modalContent && (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={hideModal}></div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {modalContent.title}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500 whitespace-pre-line">
                  {modalContent.message}
                </p>
              </div>
            </div>
          </div>
          
          {modalContent.actions && modalContent.actions.length > 0 && (
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              {modalContent.actions.map((action, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    action.action();
                    hideModal();
                  }}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                    action.style === 'danger'
                      ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
                      : action.style === 'secondary'
                      ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:ring-indigo-500'
                      : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
          
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={hideModal}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const container = document.getElementById('notification-root') || document.body;

  return createPortal(
    <>
      {toastContainer}
      {modalElement}
    </>,
    container
  );
};

// Utility functions for easy toast usage
export const showSuccess = (message: string, title = 'Success') => {
  if ((window as any).showNotification) {
    (window as any).showNotification({
      type: 'toast',
      title,
      message,
      duration: 4000
    });
  }
};

export const showError = (message: string, title = 'Error') => {
  if ((window as any).showNotification) {
    (window as any).showNotification({
      type: 'toast',
      title,
      message,
      duration: 6000
    });
  }
};

export const showWarning = (message: string, title = 'Warning') => {
  if ((window as any).showNotification) {
    (window as any).showNotification({
      type: 'toast',
      title,
      message,
      duration: 5000
    });
  }
};

export const showInfo = (message: string, title = 'Info') => {
  if ((window as any).showNotification) {
    (window as any).showNotification({
      type: 'toast',
      title,
      message,
      duration: 4000
    });
  }
};

export default NotificationSystem;