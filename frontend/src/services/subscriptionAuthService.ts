import { store } from '../store';
import { 
  updateUserSubscription, 
  updateSubscriptionFeatures, 
  updateSubscriptionUsage 
} from '../store/authSlice';
import { fetchCurrentSubscription } from '../store/subscriptionSlice';
import type { UserSubscription, SubscriptionFeatures } from '../types/auth';

/**
 * Service to integrate subscription data with authentication state
 */
class SubscriptionAuthService {
  /**
   * Load and sync user subscription data with auth state
   */
  async syncUserSubscription(): Promise<void> {
    try {
      const state = store.getState();
      const { user, isAuthenticated } = state.auth;
      
      if (!isAuthenticated || !user) {
        return;
      }

      // Fetch current subscription from API
      const result = await store.dispatch(fetchCurrentSubscription());
      
      if (fetchCurrentSubscription.fulfilled.match(result)) {
        const subscription = result.payload;
        
        if (subscription) {
          // Convert subscription data to user subscription format
          const userSubscription: UserSubscription = {
            id: subscription.id,
            planId: subscription.planId,
            planName: subscription.plan?.name || 'Unknown Plan',
            status: subscription.status,
            currentPeriodStart: subscription.currentPeriodStart,
            currentPeriodEnd: subscription.currentPeriodEnd,
            cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
            amount: subscription.amount,
            currency: subscription.currency,
            interval: subscription.interval,
            nextBillingDate: subscription.nextBillingDate,
          };

          // Update auth state with subscription
          store.dispatch(updateUserSubscription(userSubscription));

          // Update subscription features
          if (subscription.plan) {
            const features: SubscriptionFeatures = {
              maxTournamentRegistrations: subscription.plan.maxTournamentRegistrations,
              maxCourtBookings: subscription.plan.maxCourtBookings,
              maxPlayerMatches: subscription.plan.maxPlayerMatches,
              advancedFilters: subscription.plan.advancedFilters,
              prioritySupport: subscription.plan.prioritySupport,
              analyticsAccess: subscription.plan.analyticsAccess,
              customBranding: subscription.plan.customBranding,
              currentUsage: subscription.usage ? {
                tournamentRegistrations: subscription.usage.tournamentRegistrations,
                courtBookings: subscription.usage.courtBookings,
                playerMatches: subscription.usage.playerMatches,
              } : undefined,
            };

            store.dispatch(updateSubscriptionFeatures(features));
          }
        } else {
          // No subscription found
          store.dispatch(updateUserSubscription(null));
        }
      }
    } catch (error) {
      console.error('Failed to sync user subscription:', error);
    }
  }

  /**
   * Update subscription usage in auth state
   */
  updateUsage(usage: { tournamentRegistrations?: number; courtBookings?: number; playerMatches?: number }) {
    store.dispatch(updateSubscriptionUsage(usage));
  }

  /**
   * Check if user has access to a specific feature
   */
  hasFeatureAccess(feature: string): boolean {
    const state = store.getState();
    const { user } = state.auth;
    
    if (!user?.subscriptionFeatures) {
      return false;
    }

    const features = user.subscriptionFeatures;

    switch (feature) {
      case 'advanced-filters':
        return features.advancedFilters;
      case 'analytics':
        return features.analyticsAccess;
      case 'priority-support':
        return features.prioritySupport;
      case 'custom-branding':
        return features.customBranding;
      case 'unlimited-tournaments':
        return !features.maxTournamentRegistrations;
      case 'unlimited-bookings':
        return !features.maxCourtBookings;
      case 'unlimited-matches':
        return !features.maxPlayerMatches;
      default:
        return false;
    }
  }

  /**
   * Check if user has reached usage limit for a feature
   */
  hasReachedLimit(feature: 'tournaments' | 'bookings' | 'matches'): boolean {
    const state = store.getState();
    const { user } = state.auth;
    
    if (!user?.subscriptionFeatures) {
      return true; // No subscription = limited access
    }

    const features = user.subscriptionFeatures;
    const usage = features.currentUsage || {
      tournamentRegistrations: 0,
      courtBookings: 0,
      playerMatches: 0,
    };

    switch (feature) {
      case 'tournaments':
        if (!features.maxTournamentRegistrations) return false; // Unlimited
        return usage.tournamentRegistrations >= features.maxTournamentRegistrations;
        
      case 'bookings':
        if (!features.maxCourtBookings) return false; // Unlimited
        return usage.courtBookings >= features.maxCourtBookings;
        
      case 'matches':
        if (!features.maxPlayerMatches) return false; // Unlimited
        return usage.playerMatches >= features.maxPlayerMatches;
        
      default:
        return false;
    }
  }

  /**
   * Get remaining usage for a feature
   */
  getRemainingUsage(feature: 'tournaments' | 'bookings' | 'matches'): number | 'unlimited' {
    const state = store.getState();
    const { user } = state.auth;
    
    if (!user?.subscriptionFeatures) {
      return 0;
    }

    const features = user.subscriptionFeatures;
    const usage = features.currentUsage || {
      tournamentRegistrations: 0,
      courtBookings: 0,
      playerMatches: 0,
    };

    switch (feature) {
      case 'tournaments':
        if (!features.maxTournamentRegistrations) return 'unlimited';
        return Math.max(0, features.maxTournamentRegistrations - usage.tournamentRegistrations);
        
      case 'bookings':
        if (!features.maxCourtBookings) return 'unlimited';
        return Math.max(0, features.maxCourtBookings - usage.courtBookings);
        
      case 'matches':
        if (!features.maxPlayerMatches) return 'unlimited';
        return Math.max(0, features.maxPlayerMatches - usage.playerMatches);
        
      default:
        return 0;
    }
  }

  /**
   * Check if user has active subscription
   */
  hasActiveSubscription(): boolean {
    const state = store.getState();
    const { user } = state.auth;
    
    return user?.subscriptionStatus === 'active';
  }

  /**
   * Get subscription status display text
   */
  getSubscriptionStatusText(): string {
    const state = store.getState();
    const { user } = state.auth;
    
    if (!user?.subscription) {
      return 'Sin suscripción';
    }

    switch (user.subscriptionStatus) {
      case 'active':
        return 'Activo';
      case 'past_due':
        return 'Pago vencido';
      case 'canceled':
        return 'Cancelado';
      case 'trialing':
        return 'Período de prueba';
      case 'unpaid':
        return 'No pagado';
      case 'incomplete':
        return 'Incompleto';
      default:
        return 'Desconocido';
    }
  }

  /**
   * Get user's plan name
   */
  getPlanName(): string {
    const state = store.getState();
    const { user } = state.auth;
    
    return user?.subscription?.planName || 'Sin plan';
  }

  /**
   * Check if subscription needs attention (payment issues, etc.)
   */
  needsAttention(): boolean {
    const state = store.getState();
    const { user } = state.auth;
    
    if (!user?.subscription) {
      return false;
    }

    return ['past_due', 'unpaid', 'incomplete'].includes(user.subscriptionStatus || '');
  }

  /**
   * Get next billing date
   */
  getNextBillingDate(): Date | null {
    const state = store.getState();
    const { user } = state.auth;
    
    if (!user?.subscription?.nextBillingDate) {
      return null;
    }

    return new Date(user.subscription.nextBillingDate);
  }

  /**
   * Check if subscription is scheduled for cancellation
   */
  isCancellingAtPeriodEnd(): boolean {
    const state = store.getState();
    const { user } = state.auth;
    
    return user?.subscription?.cancelAtPeriodEnd || false;
  }
}

export default new SubscriptionAuthService();