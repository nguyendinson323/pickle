import React from 'react';
import { useSubscriptionAlerts, useSubscription } from '../../hooks/useSubscription';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import {
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ExclamationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface SubscriptionAlertsProps {
  showDismiss?: boolean;
  onDismiss?: (alertType: string) => void;
  className?: string;
}

/**
 * Component that displays subscription-related alerts and notifications
 */
export const SubscriptionAlerts: React.FC<SubscriptionAlertsProps> = ({
  showDismiss = true,
  onDismiss,
  className = ''
}) => {
  const alerts = useSubscriptionAlerts();
  const navigate = useNavigate();

  const handleAction = (action: string) => {
    switch (action) {
      case 'update-payment':
        navigate('/subscription?tab=payment-methods');
        break;
      case 'complete-payment':
        navigate('/subscription?tab=overview');
        break;
      case 'reactivate':
        navigate('/subscription?tab=overview');
        break;
      case 'subscribe':
        navigate('/subscription?tab=plans');
        break;
      case 'view-billing':
        navigate('/subscription?tab=overview');
        break;
      default:
        navigate('/subscription');
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getAlertStyles = (type: string) => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getButtonStyles = (type: string) => {
    switch (type) {
      case 'error':
        return 'bg-red-600 hover:bg-red-700 text-white';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700 text-white';
      case 'info':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      default:
        return 'bg-gray-600 hover:bg-gray-700 text-white';
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case 'update-payment':
        return 'Actualizar método de pago';
      case 'complete-payment':
        return 'Completar pago';
      case 'reactivate':
        return 'Reactivar suscripción';
      case 'subscribe':
        return 'Suscribirse ahora';
      case 'view-billing':
        return 'Ver facturación';
      default:
        return 'Ver detalles';
    }
  };

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {alerts.map((alert, index) => (
        <div
          key={index}
          className={`rounded-lg border p-4 ${getAlertStyles(alert.type)}`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {getAlertIcon(alert.type)}
            </div>
            <div className="ml-3 flex-1">
              <h4 className="text-sm font-medium">
                {alert.title}
              </h4>
              <p className="text-sm mt-1 opacity-90">
                {alert.message}
              </p>
              <div className="mt-3 flex items-center space-x-3">
                <Button
                  onClick={() => handleAction(alert.action)}
                  size="sm"
                  className={`text-xs ${getButtonStyles(alert.type)}`}
                >
                  {getActionText(alert.action)}
                </Button>
              </div>
            </div>
            {showDismiss && onDismiss && (
              <div className="flex-shrink-0 ml-4">
                <button
                  onClick={() => onDismiss(alert.action)}
                  className="rounded-md p-1.5 hover:bg-black hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-gray-600"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Compact subscription status banner for navigation bars
 */
export const SubscriptionBanner: React.FC = () => {
  const { status, needsAttention, planName, nextBillingDate } = useSubscription();
  const navigate = useNavigate();

  if (!needsAttention) {
    return null;
  }

  const getMessage = () => {
    switch (status) {
      case 'past_due':
        return 'Tu suscripción tiene un pago pendiente';
      case 'incomplete':
        return 'Completa el proceso de suscripción';
      case 'unpaid':
        return 'Actualiza tu método de pago';
      default:
        return 'Revisa el estado de tu suscripción';
    }
  };

  return (
    <div className="bg-yellow-400 text-yellow-900 px-4 py-2">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <span className="text-sm font-medium">
            {getMessage()}
          </span>
        </div>
        <Button
          onClick={() => navigate('/subscription')}
          size="sm"
          variant="secondary"
          className="bg-yellow-500 hover:bg-yellow-600 text-yellow-900 border-yellow-600"
        >
          Resolver
        </Button>
      </div>
    </div>
  );
};

/**
 * Usage indicator component for showing limits
 */
interface UsageIndicatorProps {
  feature: 'tournaments' | 'bookings' | 'matches';
  showDetails?: boolean;
  className?: string;
}

export const UsageIndicator: React.FC<UsageIndicatorProps> = ({
  feature,
  showDetails = true,
  className = ''
}) => {
  const { current, limit, percentage, isUnlimited, remaining } = useUsageLimit(feature);
  
  const getFeatureLabel = () => {
    switch (feature) {
      case 'tournaments':
        return 'Torneos';
      case 'bookings':
        return 'Reservas';
      case 'matches':
        return 'Búsquedas';
      default:
        return 'Uso';
    }
  };

  if (isUnlimited) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <span className="text-sm text-gray-600">{getFeatureLabel()}:</span>
        <span className="text-sm font-medium text-green-600">Ilimitado</span>
      </div>
    );
  }

  const getProgressColor = () => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">{getFeatureLabel()}</span>
        {showDetails && (
          <span className="text-xs text-gray-500">
            {current} / {limit}
          </span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${getProgressColor()}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      {showDetails && remaining !== 'unlimited' && (
        <p className="text-xs text-gray-500">
          {remaining} restantes este período
        </p>
      )}
    </div>
  );
};