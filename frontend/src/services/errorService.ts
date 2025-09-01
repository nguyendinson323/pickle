// Enhanced Error Handling Service for Frontend-Backend Integration
import { ApiError, ValidationError, ValidationResponse } from '../types/api';

export type ErrorLevel = 'info' | 'warning' | 'error' | 'critical';

export interface ErrorInfo {
  message: string;
  level: ErrorLevel;
  code?: string;
  timestamp: Date;
  url?: string;
  userId?: number;
  stackTrace?: string;
  userAction?: string;
  recoverable?: boolean;
}

export interface UserFeedback {
  type: 'toast' | 'modal' | 'banner' | 'inline';
  title: string;
  message: string;
  duration?: number;
  actions?: Array<{
    label: string;
    action: () => void;
    style?: 'primary' | 'secondary' | 'danger';
  }>;
}

class ErrorService {
  private errorHistory: ErrorInfo[] = [];
  private maxHistorySize = 50;
  private onError?: (error: ErrorInfo, feedback: UserFeedback) => void;

  // Set error handler callback
  setErrorHandler(handler: (error: ErrorInfo, feedback: UserFeedback) => void): void {
    this.onError = handler;
  }

  // Process different types of errors
  handleError(error: any, context?: { url?: string; userAction?: string }): UserFeedback {
    const errorInfo = this.analyzeError(error, context);
    const feedback = this.generateUserFeedback(errorInfo);

    // Store in history
    this.addToHistory(errorInfo);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error handled:', errorInfo);
    }

    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.reportError(errorInfo);
    }

    // Call error handler if set
    if (this.onError) {
      this.onError(errorInfo, feedback);
    }

    // Send to notification system if available
    if (typeof window !== 'undefined' && (window as any).showNotification) {
      (window as any).showNotification(feedback);
    }

    return feedback;
  }

  // Analyze error to determine type and severity
  private analyzeError(error: any, context?: { url?: string; userAction?: string }): ErrorInfo {
    const timestamp = new Date();
    const url = context?.url || window.location.pathname;
    const userAction = context?.userAction;

    // API Error
    if (this.isApiError(error)) {
      return {
        message: error.error || 'An error occurred while communicating with the server',
        level: this.determineApiErrorLevel(error),
        code: error.code,
        timestamp,
        url,
        userAction,
        recoverable: this.isRecoverable(error)
      };
    }

    // Validation Error
    if (this.isValidationError(error)) {
      return {
        message: 'Please check your input and try again',
        level: 'warning',
        code: 'VALIDATION_ERROR',
        timestamp,
        url,
        userAction,
        recoverable: true
      };
    }

    // Network Error
    if (this.isNetworkError(error)) {
      return {
        message: 'Unable to connect to server. Please check your internet connection.',
        level: 'error',
        code: 'NETWORK_ERROR',
        timestamp,
        url,
        userAction,
        recoverable: true
      };
    }

    // Authentication Error
    if (this.isAuthError(error)) {
      return {
        message: 'Your session has expired. Please log in again.',
        level: 'warning',
        code: 'AUTH_ERROR',
        timestamp,
        url,
        userAction,
        recoverable: true
      };
    }

    // Generic JavaScript Error
    if (error instanceof Error) {
      return {
        message: error.message || 'An unexpected error occurred',
        level: 'error',
        timestamp,
        url,
        userAction,
        stackTrace: error.stack,
        recoverable: false
      };
    }

    // Unknown error
    return {
      message: 'An unknown error occurred',
      level: 'error',
      timestamp,
      url,
      userAction,
      recoverable: false
    };
  }

  // Generate appropriate user feedback
  private generateUserFeedback(errorInfo: ErrorInfo): UserFeedback {
    const baseTitle = this.getErrorTitle(errorInfo.level);
    
    switch (errorInfo.level) {
      case 'critical':
        return {
          type: 'modal',
          title: baseTitle,
          message: errorInfo.message,
          actions: [
            {
              label: 'Reload Page',
              action: () => window.location.reload(),
              style: 'primary'
            },
            {
              label: 'Contact Support',
              action: () => this.contactSupport(errorInfo),
              style: 'secondary'
            }
          ]
        };

      case 'error':
        return {
          type: errorInfo.recoverable ? 'toast' : 'modal',
          title: baseTitle,
          message: errorInfo.message,
          duration: errorInfo.recoverable ? 5000 : undefined,
          actions: errorInfo.recoverable ? [
            {
              label: 'Retry',
              action: () => this.retryLastAction(),
              style: 'primary'
            }
          ] : [
            {
              label: 'OK',
              action: () => {},
              style: 'primary'
            }
          ]
        };

      case 'warning':
        return {
          type: 'toast',
          title: baseTitle,
          message: errorInfo.message,
          duration: 4000
        };

      case 'info':
      default:
        return {
          type: 'toast',
          title: 'Information',
          message: errorInfo.message,
          duration: 3000
        };
    }
  }

  // Error type detection methods
  private isApiError(error: any): error is ApiError {
    return error && typeof error === 'object' && 'success' in error && error.success === false;
  }

  private isValidationError(error: any): error is ValidationResponse {
    return this.isApiError(error) && 'errors' in error && Array.isArray(error.errors);
  }

  private isNetworkError(error: any): boolean {
    return (
      (error && error.code === 'NETWORK_ERROR') ||
      (error && error.message && error.message.includes('network')) ||
      (error && error.message && error.message.includes('fetch'))
    );
  }

  private isAuthError(error: any): boolean {
    return (
      (error && error.status === 401) ||
      (error && error.code === 'AUTH_ERROR') ||
      (error && error.message && error.message.includes('unauthorized'))
    );
  }

  // Determine API error level based on status code and type
  private determineApiErrorLevel(error: ApiError): ErrorLevel {
    if (error.code === 'VALIDATION_ERROR') return 'warning';
    if (error.code === 'AUTH_ERROR') return 'warning';
    if (error.code === 'NETWORK_ERROR') return 'error';
    if (error.code === 'SERVER_ERROR') return 'critical';
    
    // Default to error level
    return 'error';
  }

  // Check if error is recoverable
  private isRecoverable(error: ApiError): boolean {
    const recoverableCodes = ['VALIDATION_ERROR', 'AUTH_ERROR', 'NETWORK_ERROR'];
    return error.code ? recoverableCodes.includes(error.code) : false;
  }

  // Get user-friendly error title
  private getErrorTitle(level: ErrorLevel): string {
    switch (level) {
      case 'critical':
        return 'Critical Error';
      case 'error':
        return 'Error';
      case 'warning':
        return 'Warning';
      case 'info':
      default:
        return 'Information';
    }
  }

  // Add error to history
  private addToHistory(errorInfo: ErrorInfo): void {
    this.errorHistory.unshift(errorInfo);
    
    // Keep only the most recent errors
    if (this.errorHistory.length > this.maxHistorySize) {
      this.errorHistory = this.errorHistory.slice(0, this.maxHistorySize);
    }
  }

  // Report error to monitoring service
  private reportError(errorInfo: ErrorInfo): void {
    // In production, this would send to a monitoring service like Sentry
    console.warn('Error reported to monitoring service:', errorInfo);
    
    // Example: Send to backend logging endpoint
    // fetch('/api/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(errorInfo)
    // }).catch(() => {
    //   // Silently fail if error reporting fails
    // });
  }

  // Contact support action
  private contactSupport(errorInfo: ErrorInfo): void {
    const subject = encodeURIComponent(`Error Report: ${errorInfo.code || 'Unknown'}`);
    const body = encodeURIComponent(`
Error Details:
- Message: ${errorInfo.message}
- Level: ${errorInfo.level}
- Code: ${errorInfo.code || 'N/A'}
- Time: ${errorInfo.timestamp.toISOString()}
- URL: ${errorInfo.url || 'N/A'}
- Action: ${errorInfo.userAction || 'N/A'}

Please provide additional details about what you were doing when this error occurred.
    `.trim());
    
    window.open(`mailto:support@pickleballfederation.mx?subject=${subject}&body=${body}`);
  }

  // Retry last action (to be implemented based on application needs)
  private retryLastAction(): void {
    // This would need to be implemented based on the specific application context
    console.log('Retry action triggered');
  }

  // Validation error helpers
  handleValidationErrors(errors: ValidationError[]): string[] {
    return errors.map(error => `${error.field}: ${error.message}`);
  }

  formatValidationMessage(errors: ValidationError[]): string {
    if (errors.length === 1) {
      return errors[0].message;
    }
    
    return `Please fix the following issues:\n${errors.map(e => `• ${e.message}`).join('\n')}`;
  }

  // Public methods for error history and debugging
  getErrorHistory(): ErrorInfo[] {
    return [...this.errorHistory];
  }

  clearHistory(): void {
    this.errorHistory = [];
  }

  getErrorStats(): { total: number; byLevel: Record<ErrorLevel, number> } {
    const byLevel = this.errorHistory.reduce((acc, error) => {
      acc[error.level] = (acc[error.level] || 0) + 1;
      return acc;
    }, {} as Record<ErrorLevel, number>);

    return {
      total: this.errorHistory.length,
      byLevel
    };
  }

  // Utility method for consistent error throwing
  throwApiError(message: string, code?: string, level: ErrorLevel = 'error'): never {
    const error: ApiError = {
      success: false,
      error: message,
      ...(code && { details: { code } })
    };
    
    throw error;
  }
}

export const errorService = new ErrorService();
export default errorService;

// Global error handler setup
if (typeof window !== 'undefined') {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    errorService.handleError(event.reason, { 
      userAction: 'Unhandled promise rejection' 
    });
  });

  // Handle JavaScript errors
  window.addEventListener('error', (event) => {
    errorService.handleError(event.error, {
      url: event.filename,
      userAction: 'JavaScript error'
    });
  });
}