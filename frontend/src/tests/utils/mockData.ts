import { SubscriptionPlan, UserSubscription, UserSubscriptionFeatures } from '../../types/auth';

export const mockSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'plan-basic',
    name: 'Plan Básico',
    description: 'Perfecto para jugadores casuales',
    stripePriceId: 'price_basic123',
    stripeProductId: 'prod_basic123',
    amount: 19900,
    currency: 'MXN',
    interval: 'month',
    intervalCount: 1,
    features: [
      {
        name: 'Torneos',
        description: 'Participa en torneos locales',
        included: true,
        limit: 2
      },
      {
        name: 'Reservas',
        description: 'Reserva canchas',
        included: true,
        limit: 4
      }
    ],
    maxTournamentRegistrations: 2,
    maxCourtBookings: 4,
    maxPlayerMatches: 10,
    advancedFilters: false,
    prioritySupport: false,
    analyticsAccess: false,
    customBranding: false,
    isActive: true,
    isPopular: false,
    sortOrder: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'plan-pro',
    name: 'Plan Pro',
    description: 'Ideal para jugadores activos',
    stripePriceId: 'price_pro123',
    stripeProductId: 'prod_pro123',
    amount: 39900,
    currency: 'MXN',
    interval: 'month',
    intervalCount: 1,
    features: [
      {
        name: 'Torneos Ilimitados',
        description: 'Participa en todos los torneos',
        included: true
      },
      {
        name: 'Análisis Avanzado',
        description: 'Estadísticas detalladas',
        included: true
      }
    ],
    maxTournamentRegistrations: null,
    maxCourtBookings: 12,
    maxPlayerMatches: null,
    advancedFilters: true,
    prioritySupport: true,
    analyticsAccess: true,
    customBranding: false,
    isActive: true,
    isPopular: true,
    sortOrder: 2,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export const mockUserSubscription: UserSubscription = {
  id: 'sub-123',
  planId: 'plan-pro',
  planName: 'Plan Pro',
  status: 'active',
  currentPeriodStart: '2024-01-01T00:00:00Z',
  currentPeriodEnd: '2024-02-01T00:00:00Z',
  cancelAtPeriodEnd: false,
  amount: 39900,
  currency: 'MXN',
  interval: 'month',
  nextBillingDate: '2024-02-01T00:00:00Z'
};

export const mockSubscriptionFeatures: UserSubscriptionFeatures = {
  maxTournamentRegistrations: undefined, // Unlimited
  maxCourtBookings: 12,
  maxPlayerMatches: undefined, // Unlimited
  advancedFilters: true,
  prioritySupport: true,
  analyticsAccess: true,
  customBranding: false,
  currentUsage: {
    tournamentRegistrations: 5,
    courtBookings: 8,
    playerMatches: 25
  }
};

export const mockUserWithSubscription = {
  id: 1,
  email: 'test@example.com',
  username: 'testuser',
  role: 'player' as const,
  isActive: true,
  profile: null,
  subscription: mockUserSubscription,
  subscriptionStatus: 'active' as const,
  subscriptionFeatures: mockSubscriptionFeatures
};

export const mockUserWithoutSubscription = {
  id: 2,
  email: 'noplan@example.com',
  username: 'noplanuser',
  role: 'player' as const,
  isActive: true,
  profile: null,
  subscription: null,
  subscriptionStatus: null as const,
  subscriptionFeatures: null
};

export const mockBasicUser = {
  ...mockUserWithSubscription,
  subscription: {
    ...mockUserSubscription,
    planId: 'plan-basic',
    planName: 'Plan Básico',
    amount: 19900
  },
  subscriptionFeatures: {
    maxTournamentRegistrations: 2,
    maxCourtBookings: 4,
    maxPlayerMatches: 10,
    advancedFilters: false,
    prioritySupport: false,
    analyticsAccess: false,
    customBranding: false,
    currentUsage: {
      tournamentRegistrations: 1,
      courtBookings: 3,
      playerMatches: 8
    }
  }
};

export const mockPaymentMethods = [
  {
    id: 'pm_123',
    type: 'card',
    card: {
      brand: 'visa',
      last4: '4242',
      exp_month: 12,
      exp_year: 2025
    },
    billingDetails: {
      name: 'Test User',
      email: 'test@example.com'
    },
    isDefault: true,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

export const mockPaymentHistory = [
  {
    id: 'payment-123',
    subscriptionId: 'sub-123',
    stripePaymentIntentId: 'pi_123',
    amount: 39900,
    currency: 'MXN',
    status: 'succeeded',
    type: 'subscription',
    relatedEntityId: null,
    description: 'Plan Pro - Pago mensual',
    metadata: {},
    paymentMethodSnapshot: {
      type: 'card',
      card: {
        brand: 'visa',
        last4: '4242'
      }
    },
    fees: {
      stripe: 1197, // 3%
      platform: 0
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];