import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useSubscription, useFeatureAccess, useUsageLimit } from '../../hooks/useSubscription';
import subscriptionSlice from '../../store/subscriptionSlice';
import authSlice from '../../store/authSlice';
import React from 'react';

const mockUser = {
  id: 1,
  email: 'test@example.com',
  username: 'testuser',
  role: 'player' as const,
  isActive: true,
  profile: null,
  subscription: {
    id: 'sub-123',
    planId: 'plan-pro',
    planName: 'Plan Pro',
    status: 'active' as const,
    currentPeriodStart: '2024-01-01T00:00:00Z',
    currentPeriodEnd: '2024-02-01T00:00:00Z',
    cancelAtPeriodEnd: false,
    amount: 39900,
    currency: 'MXN' as const,
    interval: 'month' as const,
    nextBillingDate: '2024-02-01T00:00:00Z'
  },
  subscriptionStatus: 'active' as const,
  subscriptionFeatures: {
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
  }
};

const mockBasicUser = {
  ...mockUser,
  subscription: {
    ...mockUser.subscription,
    planName: 'Plan Básico'
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

const createMockStore = (user = mockUser, subscriptionLoaded = true) => {
  return configureStore({
    reducer: {
      subscription: subscriptionSlice,
      auth: authSlice,
    },
    preloadedState: {
      subscription: {
        plans: [],
        currentSubscription: null,
        loading: false,
        error: null,
        paymentMethods: [],
        paymentHistory: [],
        setupIntentClientSecret: null,
        subscriptionClientSecret: null,
        tournamentPaymentClientSecret: null,
        bookingPaymentClientSecret: null,
        upcomingInvoice: null,
      },
      auth: {
        user,
        isAuthenticated: !!user,
        token: user ? 'mock-token' : null,
        isLoading: false,
        error: null,
        loginAttempts: 0,
        lastLoginTime: null,
        subscriptionLoaded,
      }
    }
  });
};

const wrapper = ({ children, store }: { children: React.ReactNode; store: any }) => (
  <Provider store={store}>{children}</Provider>
);

describe('useSubscription', () => {
  it('returns subscription data for active user', () => {
    const store = createMockStore(mockUser);
    const { result } = renderHook(() => useSubscription(), {
      wrapper: ({ children }) => wrapper({ children, store })
    });

    expect(result.current.subscription).toEqual(mockUser.subscription);
    expect(result.current.features).toEqual(mockUser.subscriptionFeatures);
    expect(result.current.status).toBe('active');
    expect(result.current.isActive).toBe(true);
    expect(result.current.isLoaded).toBe(true);
    expect(result.current.planName).toBe('Plan Pro');
  });

  it('returns empty state for user without subscription', () => {
    const userWithoutSub = { ...mockUser, subscription: null, subscriptionStatus: null };
    const store = createMockStore(userWithoutSub);
    const { result } = renderHook(() => useSubscription(), {
      wrapper: ({ children }) => wrapper({ children, store })
    });

    expect(result.current.subscription).toBeNull();
    expect(result.current.isActive).toBe(false);
    expect(result.current.planName).toBe('Sin plan');
    expect(result.current.hasActiveSubscription()).toBe(false);
  });

  it('returns usage and limits correctly', () => {
    const store = createMockStore(mockUser);
    const { result } = renderHook(() => useSubscription(), {
      wrapper: ({ children }) => wrapper({ children, store })
    });

    expect(result.current.usage).toEqual({
      tournamentRegistrations: 5,
      courtBookings: 8,
      playerMatches: 25
    });

    expect(result.current.limits).toEqual({
      tournaments: undefined, // Unlimited
      bookings: 12,
      matches: undefined // Unlimited
    });

    expect(result.current.hasReachedLimit('tournaments')).toBe(false);
    expect(result.current.hasReachedLimit('bookings')).toBe(false);
    expect(result.current.getRemainingUsage('tournaments')).toBe('unlimited');
    expect(result.current.getRemainingUsage('bookings')).toBe(4); // 12 - 8
  });

  it('detects when limits are reached', () => {
    const userAtLimit = {
      ...mockBasicUser,
      subscriptionFeatures: {
        ...mockBasicUser.subscriptionFeatures,
        currentUsage: {
          tournamentRegistrations: 2, // At limit
          courtBookings: 4, // At limit
          playerMatches: 10 // At limit
        }
      }
    };

    const store = createMockStore(userAtLimit);
    const { result } = renderHook(() => useSubscription(), {
      wrapper: ({ children }) => wrapper({ children, store })
    });

    expect(result.current.hasReachedLimit('tournaments')).toBe(true);
    expect(result.current.hasReachedLimit('bookings')).toBe(true);
    expect(result.current.hasReachedLimit('matches')).toBe(true);

    expect(result.current.getRemainingUsage('tournaments')).toBe(0);
    expect(result.current.getRemainingUsage('bookings')).toBe(0);
    expect(result.current.getRemainingUsage('matches')).toBe(0);
  });

  it('handles subscription status correctly', () => {
    const pastDueUser = {
      ...mockUser,
      subscriptionStatus: 'past_due' as const
    };

    const store = createMockStore(pastDueUser);
    const { result } = renderHook(() => useSubscription(), {
      wrapper: ({ children }) => wrapper({ children, store })
    });

    expect(result.current.status).toBe('past_due');
    expect(result.current.isActive).toBe(false);
    expect(result.current.statusText).toBe('Pago vencido');
    expect(result.current.needsAttention).toBe(true);
  });

  it('handles cancellation scheduling', () => {
    const cancellingUser = {
      ...mockUser,
      subscription: {
        ...mockUser.subscription,
        cancelAtPeriodEnd: true
      }
    };

    const store = createMockStore(cancellingUser);
    const { result } = renderHook(() => useSubscription(), {
      wrapper: ({ children }) => wrapper({ children, store })
    });

    expect(result.current.isCancellingAtPeriodEnd).toBe(true);
    expect(result.current.nextBillingDate).toEqual(new Date('2024-02-01T00:00:00Z'));
  });

  it('returns loading state when subscription not loaded', () => {
    const store = createMockStore(mockUser, false); // subscriptionLoaded = false
    const { result } = renderHook(() => useSubscription(), {
      wrapper: ({ children }) => wrapper({ children, store })
    });

    expect(result.current.isLoaded).toBe(false);
  });
});

describe('useFeatureAccess', () => {
  it('returns access for available features', () => {
    const store = createMockStore(mockUser);
    const { result } = renderHook(() => useFeatureAccess('analytics'), {
      wrapper: ({ children }) => wrapper({ children, store })
    });

    expect(result.current.hasAccess).toBe(true);
    expect(result.current.isSubscribed).toBe(true);
    expect(result.current.needsUpgrade).toBe(false);
  });

  it('denies access for unavailable features', () => {
    const store = createMockStore(mockBasicUser);
    const { result } = renderHook(() => useFeatureAccess('analytics'), {
      wrapper: ({ children }) => wrapper({ children, store })
    });

    expect(result.current.hasAccess).toBe(false);
    expect(result.current.isSubscribed).toBe(true);
    expect(result.current.needsUpgrade).toBe(true);
  });

  it('denies access for users without subscription', () => {
    const userWithoutSub = { ...mockUser, subscription: null, subscriptionStatus: null, subscriptionFeatures: null };
    const store = createMockStore(userWithoutSub);
    const { result } = renderHook(() => useFeatureAccess('analytics'), {
      wrapper: ({ children }) => wrapper({ children, store })
    });

    expect(result.current.hasAccess).toBe(false);
    expect(result.current.isSubscribed).toBe(false);
    expect(result.current.needsUpgrade).toBe(true);
  });
});

describe('useUsageLimit', () => {
  it('returns correct usage data for limited feature', () => {
    const store = createMockStore(mockBasicUser);
    const { result } = renderHook(() => useUsageLimit('tournaments'), {
      wrapper: ({ children }) => wrapper({ children, store })
    });

    expect(result.current.hasReachedLimit).toBe(false);
    expect(result.current.remaining).toBe(1); // 2 - 1
    expect(result.current.current).toBe(1);
    expect(result.current.limit).toBe(2);
    expect(result.current.isUnlimited).toBe(false);
    expect(result.current.percentage).toBe(50); // 1/2 * 100
  });

  it('returns unlimited data for unlimited feature', () => {
    const store = createMockStore(mockUser);
    const { result } = renderHook(() => useUsageLimit('tournaments'), {
      wrapper: ({ children }) => wrapper({ children, store })
    });

    expect(result.current.hasReachedLimit).toBe(false);
    expect(result.current.remaining).toBe('unlimited');
    expect(result.current.current).toBe(5);
    expect(result.current.limit).toBeUndefined();
    expect(result.current.isUnlimited).toBe(true);
    expect(result.current.percentage).toBe(0);
  });

  it('detects when limit is reached', () => {
    const userAtLimit = {
      ...mockBasicUser,
      subscriptionFeatures: {
        ...mockBasicUser.subscriptionFeatures,
        currentUsage: {
          ...mockBasicUser.subscriptionFeatures.currentUsage,
          tournamentRegistrations: 2 // At limit
        }
      }
    };

    const store = createMockStore(userAtLimit);
    const { result } = renderHook(() => useUsageLimit('tournaments'), {
      wrapper: ({ children }) => wrapper({ children, store })
    });

    expect(result.current.hasReachedLimit).toBe(true);
    expect(result.current.remaining).toBe(0);
    expect(result.current.percentage).toBe(100);
  });

  it('handles court bookings usage correctly', () => {
    const store = createMockStore(mockUser);
    const { result } = renderHook(() => useUsageLimit('bookings'), {
      wrapper: ({ children }) => wrapper({ children, store })
    });

    expect(result.current.current).toBe(8);
    expect(result.current.limit).toBe(12);
    expect(result.current.remaining).toBe(4);
    expect(result.current.percentage).toBe(67); // Math.round(8/12 * 100)
  });

  it('handles player matches usage correctly', () => {
    const store = createMockStore(mockUser);
    const { result } = renderHook(() => useUsageLimit('matches'), {
      wrapper: ({ children }) => wrapper({ children, store })
    });

    expect(result.current.current).toBe(25);
    expect(result.current.isUnlimited).toBe(true);
    expect(result.current.remaining).toBe('unlimited');
  });
});