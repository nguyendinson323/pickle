import { useEffect, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../store';
import subscriptionAuthService from '../services/subscriptionAuthService';

/**
 * Custom hook for accessing subscription data and utilities
 */
export const useSubscription = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, subscriptionLoaded } = useAppSelector(state => state.auth);
  
  // Load subscription data when user logs in
  useEffect(() => {
    if (isAuthenticated && user && !subscriptionLoaded) {
      subscriptionAuthService.syncUserSubscription();
    }
  }, [isAuthenticated, user, subscriptionLoaded]);

  const subscription = user?.subscription;
  const features = user?.subscriptionFeatures;
  const status = user?.subscriptionStatus;

  return useMemo(() => ({
    // Basic subscription info
    subscription,
    features,
    status,
    isActive: status === 'active',
    isLoaded: subscriptionLoaded,
    
    // Plan info
    planName: subscriptionAuthService.getPlanName(),
    statusText: subscriptionAuthService.getSubscriptionStatusText(),
    needsAttention: subscriptionAuthService.needsAttention(),
    nextBillingDate: subscriptionAuthService.getNextBillingDate(),
    isCancellingAtPeriodEnd: subscriptionAuthService.isCancellingAtPeriodEnd(),
    
    // Feature access
    hasFeatureAccess: (feature: string) => subscriptionAuthService.hasFeatureAccess(feature),
    hasActiveSubscription: () => subscriptionAuthService.hasActiveSubscription(),
    
    // Usage limits
    hasReachedLimit: (feature: 'tournaments' | 'bookings' | 'matches') => 
      subscriptionAuthService.hasReachedLimit(feature),
    getRemainingUsage: (feature: 'tournaments' | 'bookings' | 'matches') => 
      subscriptionAuthService.getRemainingUsage(feature),
    
    // Usage stats
    usage: features?.currentUsage || {
      tournamentRegistrations: 0,
      courtBookings: 0,
      playerMatches: 0,
    },
    
    // Limits
    limits: {
      tournaments: features?.maxTournamentRegistrations,
      bookings: features?.maxCourtBookings,
      matches: features?.maxPlayerMatches,
    },
  }), [subscription, features, status, subscriptionLoaded, user]);
};

/**
 * Hook for feature-based access control
 */
export const useFeatureAccess = (feature: string) => {
  const { hasFeatureAccess, isActive } = useSubscription();
  
  return useMemo(() => ({
    hasAccess: hasFeatureAccess(feature),
    isSubscribed: isActive,
    needsUpgrade: !hasFeatureAccess(feature),
  }), [hasFeatureAccess, feature, isActive]);
};

/**
 * Hook for usage limits
 */
export const useUsageLimit = (feature: 'tournaments' | 'bookings' | 'matches') => {
  const { hasReachedLimit, getRemainingUsage, usage, limits } = useSubscription();
  
  return useMemo(() => {
    const remaining = getRemainingUsage(feature);
    const limit = limits[feature];
    const current = usage[feature === 'tournaments' ? 'tournamentRegistrations' : 
                         feature === 'bookings' ? 'courtBookings' : 'playerMatches'];
    
    return {
      hasReachedLimit: hasReachedLimit(feature),
      remaining,
      current,
      limit,
      isUnlimited: remaining === 'unlimited',
      percentage: limit && remaining !== 'unlimited' ? 
        Math.round((current / limit) * 100) : 0,
    };
  }, [hasReachedLimit, getRemainingUsage, usage, limits, feature]);
};

/**
 * Hook for subscription status alerts
 */
export const useSubscriptionAlerts = () => {
  const { 
    needsAttention, 
    status, 
    nextBillingDate, 
    isCancellingAtPeriodEnd,
    isActive 
  } = useSubscription();
  
  return useMemo(() => {
    const alerts = [];
    
    if (status === 'past_due') {
      alerts.push({
        type: 'error' as const,
        title: 'Pago vencido',
        message: 'Tu suscripción tiene un pago pendiente. Actualiza tu método de pago para mantener el acceso.',
        action: 'update-payment'
      });
    }
    
    if (status === 'incomplete') {
      alerts.push({
        type: 'warning' as const,
        title: 'Suscripción incompleta',
        message: 'Tu suscripción necesita completar el proceso de pago.',
        action: 'complete-payment'
      });
    }
    
    if (isCancellingAtPeriodEnd && nextBillingDate) {
      alerts.push({
        type: 'info' as const,
        title: 'Suscripción programada para cancelación',
        message: `Tu suscripción se cancelará el ${nextBillingDate.toLocaleDateString('es-MX')}.`,
        action: 'reactivate'
      });
    }
    
    if (!isActive) {
      alerts.push({
        type: 'info' as const,
        title: 'Sin suscripción activa',
        message: 'Suscríbete para acceder a todas las funciones de la plataforma.',
        action: 'subscribe'
      });
    }
    
    // Billing reminder (7 days before)
    if (nextBillingDate && isActive) {
      const daysUntilBilling = Math.ceil((nextBillingDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilBilling <= 7 && daysUntilBilling > 0) {
        alerts.push({
          type: 'info' as const,
          title: 'Próxima facturación',
          message: `Tu suscripción se renovará en ${daysUntilBilling} días.`,
          action: 'view-billing'
        });
      }
    }
    
    return alerts;
  }, [needsAttention, status, nextBillingDate, isCancellingAtPeriodEnd, isActive]);
};