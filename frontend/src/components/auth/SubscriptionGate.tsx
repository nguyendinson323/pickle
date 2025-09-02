import React from 'react';
import { useSubscription, useFeatureAccess, useUsageLimit } from '../../hooks/useSubscription';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { useNavigate } from 'react-router-dom';
import { 
  ExclamationTriangleIcon, 
  LockClosedIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline';

interface SubscriptionGateProps {
  children: React.ReactNode;
  feature?: string;
  usageFeature?: 'tournaments' | 'bookings' | 'matches';
  requiresActive?: boolean;
  fallback?: React.ReactNode;
  showUpgrade?: boolean;
}

/**
 * Component that controls access based on subscription status and features
 */
export const SubscriptionGate: React.FC<SubscriptionGateProps> = ({
  children,
  feature,
  usageFeature,
  requiresActive = false,
  fallback,
  showUpgrade = true,
}) => {
  const navigate = useNavigate();
  const { isActive, isLoaded, hasActiveSubscription } = useSubscription();
  const featureAccess = useFeatureAccess(feature || '');
  const usageLimit = useUsageLimit(usageFeature || 'tournaments');

  // Show loading state if subscription data isn't loaded yet
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check if requires active subscription
  if (requiresActive && !hasActiveSubscription()) {
    if (fallback) return <>{fallback}</>;
    
    return (
      <SubscriptionRequired
        title="Suscripción requerida"
        message="Necesitas una suscripción activa para acceder a esta función."
        showUpgrade={showUpgrade}
      />
    );
  }

  // Check specific feature access
  if (feature && !featureAccess.hasAccess) {
    if (fallback) return <>{fallback}</>;
    
    return (
      <FeatureUpgradePrompt
        feature={feature}
        showUpgrade={showUpgrade}
      />
    );
  }

  // Check usage limits
  if (usageFeature && usageLimit.hasReachedLimit) {
    if (fallback) return <>{fallback}</>;
    
    return (
      <UsageLimitReached
        feature={usageFeature}
        limit={usageLimit}
        showUpgrade={showUpgrade}
      />
    );
  }

  return <>{children}</>;
};

/**
 * Component shown when subscription is required
 */
const SubscriptionRequired: React.FC<{
  title: string;
  message: string;
  showUpgrade: boolean;
}> = ({ title, message, showUpgrade }) => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-12 px-6">
      <LockClosedIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {message}
      </p>
      {showUpgrade && (
        <div className="space-y-3">
          <Button
            onClick={() => navigate('/subscription')}
            variant="primary"
          >
            Ver planes de suscripción
          </Button>
          <p className="text-xs text-gray-500">
            Elige el plan que mejor se adapte a tus necesidades
          </p>
        </div>
      )}
    </div>
  );
};

/**
 * Component shown when specific feature access is needed
 */
const FeatureUpgradePrompt: React.FC<{
  feature: string;
  showUpgrade: boolean;
}> = ({ feature, showUpgrade }) => {
  const navigate = useNavigate();
  
  const getFeatureInfo = (feature: string) => {
    switch (feature) {
      case 'advanced-filters':
        return {
          title: 'Filtros Avanzados',
          description: 'Encuentra jugadores con criterios específicos y filtros detallados.'
        };
      case 'analytics':
        return {
          title: 'Análisis Avanzado',
          description: 'Accede a estadísticas detalladas y reportes de rendimiento.'
        };
      case 'priority-support':
        return {
          title: 'Soporte Prioritario',
          description: 'Recibe atención personalizada y respuesta rápida a tus consultas.'
        };
      case 'custom-branding':
        return {
          title: 'Marca Personalizada',
          description: 'Personaliza tu perfil con tu logo y colores corporativos.'
        };
      default:
        return {
          title: 'Función Premium',
          description: 'Esta función está disponible en planes premium.'
        };
    }
  };

  const featureInfo = getFeatureInfo(feature);

  return (
    <div className="text-center py-12 px-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
        <ChartBarIcon className="h-8 w-8 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {featureInfo.title}
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {featureInfo.description}
      </p>
      <Badge variant="info" className="mb-6">
        Disponible en Plan Pro y Elite
      </Badge>
      {showUpgrade && (
        <div className="space-y-3">
          <Button
            onClick={() => navigate('/subscription')}
            variant="primary"
          >
            Actualizar plan
          </Button>
          <p className="text-xs text-gray-500">
            Desbloquea todas las funciones premium
          </p>
        </div>
      )}
    </div>
  );
};

/**
 * Component shown when usage limit is reached
 */
const UsageLimitReached: React.FC<{
  feature: 'tournaments' | 'bookings' | 'matches';
  limit: any;
  showUpgrade: boolean;
}> = ({ feature, limit, showUpgrade }) => {
  const navigate = useNavigate();
  
  const getFeatureInfo = (feature: string) => {
    switch (feature) {
      case 'tournaments':
        return {
          title: 'Límite de Torneos Alcanzado',
          icon: '🏆',
          description: 'Has alcanzado tu límite mensual de registros en torneos.'
        };
      case 'bookings':
        return {
          title: 'Límite de Reservas Alcanzado',
          icon: '📅',
          description: 'Has alcanzado tu límite mensual de reservas de canchas.'
        };
      case 'matches':
        return {
          title: 'Límite de Búsquedas Alcanzado',
          icon: '👥',
          description: 'Has alcanzado tu límite mensual de búsquedas de jugadores.'
        };
      default:
        return {
          title: 'Límite Alcanzado',
          icon: '⚠️',
          description: 'Has alcanzado tu límite mensual para esta función.'
        };
    }
  };

  const featureInfo = getFeatureInfo(feature);

  return (
    <div className="text-center py-12 px-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
      <div className="text-4xl mb-4">{featureInfo.icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {featureInfo.title}
      </h3>
      <p className="text-gray-600 mb-4">
        {featureInfo.description}
      </p>
      
      <div className="bg-white rounded-lg p-4 mb-6 inline-block">
        <div className="text-2xl font-bold text-gray-900">
          {limit.current} / {limit.limit || '∞'}
        </div>
        <p className="text-sm text-gray-500">Este período</p>
      </div>

      {showUpgrade && (
        <div className="space-y-3">
          <Button
            onClick={() => navigate('/subscription')}
            variant="primary"
          >
            Actualizar para uso ilimitado
          </Button>
          <p className="text-xs text-gray-500">
            Los planes Pro y Elite incluyen uso ilimitado
          </p>
        </div>
      )}
    </div>
  );
};

/**
 * Higher-order component for protecting routes based on subscription
 */
export const withSubscriptionGate = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  gateProps: Omit<SubscriptionGateProps, 'children'>
) => {
  return (props: P) => (
    <SubscriptionGate {...gateProps}>
      <WrappedComponent {...props} />
    </SubscriptionGate>
  );
};

/**
 * Simple subscription status indicator
 */
export const SubscriptionStatus: React.FC = () => {
  const { status, statusText, planName, needsAttention } = useSubscription();
  
  if (!status) return null;

  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return 'success';
      case 'trialing':
        return 'info';
      case 'past_due':
      case 'unpaid':
        return 'error';
      case 'canceled':
        return 'secondary';
      default:
        return 'warning';
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Badge variant={getStatusColor() as any}>
        {statusText}
      </Badge>
      <span className="text-sm text-gray-600">
        {planName}
      </span>
      {needsAttention && (
        <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />
      )}
    </div>
  );
};