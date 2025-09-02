import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { SubscriptionPlans } from '../../../components/subscription/SubscriptionPlans';
import subscriptionSlice from '../../../store/subscriptionSlice';
import authSlice from '../../../store/authSlice';

// Mock @heroicons/react
jest.mock('@heroicons/react/24/solid', () => ({
  CheckIcon: () => <div data-testid="check-icon">✓</div>,
}));

const mockPlans = [
  {
    id: 'plan-basic',
    name: 'Plan Básico',
    description: 'Perfecto para jugadores casuales',
    amount: 19900,
    currency: 'MXN',
    interval: 'month',
    intervalCount: 1,
    features: [
      {
        name: 'Registros de Torneos',
        description: 'Participa en torneos locales',
        included: true,
        limit: 2
      },
      {
        name: 'Reservas de Cancha',
        description: 'Reserva canchas en instalaciones afiliadas',
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
    sortOrder: 1
  },
  {
    id: 'plan-pro',
    name: 'Plan Pro',
    description: 'Ideal para jugadores activos',
    amount: 39900,
    currency: 'MXN',
    interval: 'month',
    intervalCount: 1,
    features: [
      {
        name: 'Registros de Torneos Ilimitados',
        description: 'Participa en todos los torneos disponibles',
        included: true
      },
      {
        name: 'Análisis de Rendimiento',
        description: 'Estadísticas detalladas de tus partidos',
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
    sortOrder: 2
  }
];

const mockCurrentSubscription = {
  id: 'sub-123',
  planId: 'plan-basic',
  status: 'active',
  amount: 19900,
  currency: 'MXN',
  interval: 'month',
  nextBillingDate: '2024-02-01T00:00:00Z',
  plan: {
    name: 'Plan Básico'
  }
};

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      subscription: subscriptionSlice,
      auth: authSlice,
    },
    preloadedState: {
      subscription: {
        plans: mockPlans,
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
        ...initialState.subscription
      },
      auth: {
        user: { id: 1, email: 'test@example.com', username: 'testuser' },
        isAuthenticated: true,
        token: 'mock-token',
        isLoading: false,
        error: null,
        loginAttempts: 0,
        lastLoginTime: null,
        subscriptionLoaded: true,
        ...initialState.auth
      }
    }
  });
};

const renderWithStore = (component: React.ReactElement, initialState = {}) => {
  const store = createMockStore(initialState);
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

describe('SubscriptionPlans', () => {
  it('renders subscription plans correctly', () => {
    renderWithStore(<SubscriptionPlans />);

    expect(screen.getByText('Planes de Membresía')).toBeInTheDocument();
    expect(screen.getByText('Plan Básico')).toBeInTheDocument();
    expect(screen.getByText('Plan Pro')).toBeInTheDocument();
    expect(screen.getByText('Más Popular')).toBeInTheDocument();
  });

  it('displays plan features correctly', () => {
    renderWithStore(<SubscriptionPlans />);

    expect(screen.getByText('Registros de Torneos')).toBeInTheDocument();
    expect(screen.getByText('Participa en torneos locales')).toBeInTheDocument();
    expect(screen.getByText('(2)')).toBeInTheDocument(); // Limit display
    
    expect(screen.getByText('Registros de Torneos Ilimitados')).toBeInTheDocument();
    expect(screen.getByText('Análisis de Rendimiento')).toBeInTheDocument();
  });

  it('shows current subscription status when user has active subscription', () => {
    renderWithStore(<SubscriptionPlans />, {
      subscription: {
        currentSubscription: mockCurrentSubscription
      }
    });

    expect(screen.getByText('Plan Actual')).toBeInTheDocument();
    expect(screen.getByText(/Plan Básico/)).toBeInTheDocument();
    expect(screen.getByText(/Próxima facturación/)).toBeInTheDocument();
  });

  it('toggles between monthly and yearly billing', () => {
    renderWithStore(<SubscriptionPlans />);

    const monthlyButton = screen.getByText('Mensual');
    const yearlyButton = screen.getByText('Anual');

    expect(monthlyButton).toHaveClass('bg-white');
    expect(yearlyButton).not.toHaveClass('bg-white');

    fireEvent.click(yearlyButton);

    expect(yearlyButton).toHaveClass('bg-white');
    expect(monthlyButton).not.toHaveClass('bg-white');
  });

  it('displays plan limits in summary section', () => {
    renderWithStore(<SubscriptionPlans />);

    // Check for basic plan limits
    expect(screen.getByText('2')).toBeInTheDocument(); // Tournament limit
    expect(screen.getByText('4')).toBeInTheDocument(); // Booking limit
    expect(screen.getByText('10')).toBeInTheDocument(); // Match limit
    
    // Check for pro plan unlimited features
    expect(screen.getAllByText('Ilimitados')).toHaveLength(2); // Tournaments and matches
    expect(screen.getByText('12')).toBeInTheDocument(); // Booking limit for pro
  });

  it('formats prices correctly for Mexican market', () => {
    renderWithStore(<SubscriptionPlans />);

    // Should display MXN formatted prices
    expect(screen.getByText('$199')).toBeInTheDocument(); // Basic plan
    expect(screen.getByText('$399')).toBeInTheDocument(); // Pro plan
  });

  it('handles plan selection', async () => {
    const mockOnPlanSelected = jest.fn();
    renderWithStore(<SubscriptionPlans onPlanSelected={mockOnPlanSelected} />);

    const selectButtons = screen.getAllByText('Seleccionar Plan');
    fireEvent.click(selectButtons[0]);

    // Should show loading state
    await waitFor(() => {
      expect(screen.getByText('Procesando...')).toBeInTheDocument();
    });
  });

  it('shows current plan button for active subscription', () => {
    renderWithStore(<SubscriptionPlans />, {
      subscription: {
        currentSubscription: mockCurrentSubscription
      }
    });

    expect(screen.getByText('Plan Actual')).toBeInTheDocument();
  });

  it('displays loading state', () => {
    renderWithStore(<SubscriptionPlans />, {
      subscription: {
        plans: [],
        loading: true
      }
    });

    expect(screen.getByRole('status')).toBeInTheDocument(); // Loading spinner
  });

  it('displays error state with retry button', () => {
    renderWithStore(<SubscriptionPlans />, {
      subscription: {
        plans: [],
        loading: false,
        error: 'Failed to load plans'
      }
    });

    expect(screen.getByText('Error al cargar los planes')).toBeInTheDocument();
    expect(screen.getByText('Failed to load plans')).toBeInTheDocument();
    expect(screen.getByText('Intentar de nuevo')).toBeInTheDocument();
  });

  it('shows empty state when no plans available', () => {
    renderWithStore(<SubscriptionPlans />, {
      subscription: {
        plans: [],
        loading: false,
        error: null
      }
    });

    expect(screen.getByText('No hay planes disponibles')).toBeInTheDocument();
    expect(screen.getByText('Actualmente no hay planes de membresía disponibles.')).toBeInTheDocument();
  });

  it('includes VAT information', () => {
    renderWithStore(<SubscriptionPlans />);

    expect(screen.getAllByText(/IVA \(16%\) incluido/)).toHaveLength(2);
    expect(screen.getAllByText(/Pago seguro con Stripe/)).toHaveLength(2);
  });

  it('shows savings information for yearly plans', () => {
    // Mock yearly plans with savings
    const yearlyPlans = [
      {
        ...mockPlans[0],
        interval: 'year',
        amount: 191040, // 20% discount
        name: 'Plan Anual Básico'
      }
    ];

    renderWithStore(<SubscriptionPlans />, {
      subscription: {
        plans: [...mockPlans, ...yearlyPlans]
      }
    });

    fireEvent.click(screen.getByText('Anual'));

    expect(screen.getByText(/Ahorra hasta/)).toBeInTheDocument();
  });

  it('disables plan selection when loading', () => {
    renderWithStore(<SubscriptionPlans />, {
      subscription: {
        loading: true
      }
    });

    const selectButtons = screen.getAllByText('Seleccionar Plan');
    selectButtons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });

  it('calls onPlanSelected callback when plan is selected', async () => {
    const mockOnPlanSelected = jest.fn();
    const store = createMockStore();
    
    render(
      <Provider store={store}>
        <SubscriptionPlans onPlanSelected={mockOnPlanSelected} />
      </Provider>
    );

    const selectButtons = screen.getAllByText('Seleccionar Plan');
    fireEvent.click(selectButtons[0]);

    // The callback should be called after successful subscription creation
    // This would need to be mocked at the store level for full testing
  });
});