import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  stripePriceId: string;
  stripeProductId: string;
  amount: number;
  currency: 'USD' | 'MXN';
  interval: 'month' | 'year';
  intervalCount: number;
  features: {
    name: string;
    description: string;
    included: boolean;
    limit?: number;
  }[];
  maxTournamentRegistrations?: number;
  maxCourtBookings?: number;
  maxPlayerMatches?: number;
  advancedFilters: boolean;
  prioritySupport: boolean;
  analyticsAccess: boolean;
  customBranding: boolean;
  isActive: boolean;
  isPopular: boolean;
  sortOrder: number;
}

export interface Subscription {
  id: string;
  userId: number;
  planId: string;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  status: 'active' | 'past_due' | 'canceled' | 'unpaid' | 'incomplete' | 'trialing';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  amount: number;
  currency: 'USD' | 'MXN';
  interval: 'month' | 'year';
  intervalCount: number;
  nextBillingDate: string;
  plan?: SubscriptionPlan;
  usage?: {
    tournamentRegistrations: number;
    courtBookings: number;
    playerMatches: number;
    period: {
      start: string;
      end: string;
    };
  };
}

export interface PaymentMethod {
  id: string;
  userId: number;
  stripePaymentMethodId: string;
  type: 'card' | 'bank_account';
  card?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
    funding: 'credit' | 'debit' | 'prepaid' | 'unknown';
    country: string;
  };
  isDefault: boolean;
  isActive: boolean;
  billingDetails: {
    name?: string;
    email?: string;
    phone?: string;
    address?: any;
  };
  createdAt: string;
}

export interface PaymentHistory {
  id: string;
  userId: number;
  amount: number;
  currency: 'USD' | 'MXN';
  type: 'subscription' | 'tournament_entry' | 'court_booking' | 'one_time' | 'refund';
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'canceled' | 'requires_action';
  description?: string;
  createdAt: string;
  paymentMethod: {
    type: string;
    card?: {
      brand: string;
      last4: string;
    };
  };
}

interface SubscriptionState {
  plans: SubscriptionPlan[];
  currentSubscription: Subscription | null;
  paymentMethods: PaymentMethod[];
  paymentHistory: PaymentHistory[];
  setupIntentClientSecret: string | null;
  subscriptionClientSecret: string | null;
  tournamentPaymentClientSecret: string | null;
  bookingPaymentClientSecret: string | null;
  loading: boolean;
  error: string | null;
  upcomingInvoice: any;
}

const initialState: SubscriptionState = {
  plans: [],
  currentSubscription: null,
  paymentMethods: [],
  paymentHistory: [],
  setupIntentClientSecret: null,
  subscriptionClientSecret: null,
  tournamentPaymentClientSecret: null,
  bookingPaymentClientSecret: null,
  loading: false,
  error: null,
  upcomingInvoice: null,
};

// API helper function
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

// Async thunks
export const fetchSubscriptionPlans = createAsyncThunk(
  'subscription/fetchPlans',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/subscriptions/plans`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch subscription plans');
    }
  }
);

export const fetchCurrentSubscription = createAsyncThunk(
  'subscription/fetchCurrent',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/subscriptions/current`, {
        headers: getAuthHeaders(),
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch subscription');
    }
  }
);

export const createSubscription = createAsyncThunk(
  'subscription/create',
  async (data: { planId: string; paymentMethodId?: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/subscriptions/create`, data, {
        headers: getAuthHeaders(),
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create subscription');
    }
  }
);

export const cancelSubscription = createAsyncThunk(
  'subscription/cancel',
  async (data: { immediately?: boolean }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/subscriptions/cancel`, data, {
        headers: getAuthHeaders(),
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to cancel subscription');
    }
  }
);

export const changePlan = createAsyncThunk(
  'subscription/changePlan',
  async (data: { newPlanId: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/subscriptions/change-plan`, data, {
        headers: getAuthHeaders(),
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to change plan');
    }
  }
);

export const reactivateSubscription = createAsyncThunk(
  'subscription/reactivate',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/subscriptions/reactivate`, {}, {
        headers: getAuthHeaders(),
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to reactivate subscription');
    }
  }
);

export const createSetupIntent = createAsyncThunk(
  'subscription/createSetupIntent',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/payments/setup-intent`, {}, {
        headers: getAuthHeaders(),
      });
      return response.data.clientSecret;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create setup intent');
    }
  }
);

export const savePaymentMethod = createAsyncThunk(
  'subscription/savePaymentMethod',
  async (data: { paymentMethodId: string; isDefault?: boolean }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/payments/payment-methods`, data, {
        headers: getAuthHeaders(),
      });
      return response.data.paymentMethod;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to save payment method');
    }
  }
);

export const fetchPaymentMethods = createAsyncThunk(
  'subscription/fetchPaymentMethods',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/payments/payment-methods`, {
        headers: getAuthHeaders(),
      });
      return response.data.paymentMethods;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch payment methods');
    }
  }
);

export const removePaymentMethod = createAsyncThunk(
  'subscription/removePaymentMethod',
  async (paymentMethodId: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/payments/payment-methods/${paymentMethodId}`, {
        headers: getAuthHeaders(),
      });
      return paymentMethodId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to remove payment method');
    }
  }
);

export const fetchPaymentHistory = createAsyncThunk(
  'subscription/fetchPaymentHistory',
  async (params: { limit?: number; offset?: number; type?: string } = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.offset) queryParams.append('offset', params.offset.toString());
      if (params.type) queryParams.append('type', params.type);

      const response = await axios.get(`${API_BASE_URL}/subscriptions/payments?${queryParams}`, {
        headers: getAuthHeaders(),
      });
      return response.data.data.payments;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch payment history');
    }
  }
);

export const createTournamentPayment = createAsyncThunk(
  'subscription/createTournamentPayment',
  async (data: { tournamentId: string; amount: number; currency?: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/subscriptions/tournament-payment`, data, {
        headers: getAuthHeaders(),
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create tournament payment');
    }
  }
);

export const createBookingPayment = createAsyncThunk(
  'subscription/createBookingPayment',
  async (data: { bookingId: string; amount: number; currency?: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/subscriptions/booking-payment`, data, {
        headers: getAuthHeaders(),
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create booking payment');
    }
  }
);

export const fetchUpcomingInvoice = createAsyncThunk(
  'subscription/fetchUpcomingInvoice',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/subscriptions/upcoming-invoice`, {
        headers: getAuthHeaders(),
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch upcoming invoice');
    }
  }
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSetupIntent: (state) => {
      state.setupIntentClientSecret = null;
    },
    clearPaymentSecrets: (state) => {
      state.subscriptionClientSecret = null;
      state.tournamentPaymentClientSecret = null;
      state.bookingPaymentClientSecret = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch plans
      .addCase(fetchSubscriptionPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(fetchSubscriptionPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch current subscription
      .addCase(fetchCurrentSubscription.fulfilled, (state, action) => {
        state.currentSubscription = action.payload;
      })
      // Create subscription
      .addCase(createSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSubscription = action.payload.subscription;
        state.subscriptionClientSecret = action.payload.clientSecret;
      })
      .addCase(createSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Cancel subscription
      .addCase(cancelSubscription.fulfilled, (state, action) => {
        state.currentSubscription = action.payload;
      })
      // Change plan
      .addCase(changePlan.fulfilled, (state, action) => {
        state.currentSubscription = action.payload;
      })
      // Reactivate subscription
      .addCase(reactivateSubscription.fulfilled, (state, action) => {
        state.currentSubscription = action.payload;
      })
      // Setup intent
      .addCase(createSetupIntent.fulfilled, (state, action) => {
        state.setupIntentClientSecret = action.payload;
      })
      // Save payment method
      .addCase(savePaymentMethod.fulfilled, (state, action) => {
        const existingIndex = state.paymentMethods.findIndex(pm => pm.id === action.payload.id);
        if (existingIndex >= 0) {
          state.paymentMethods[existingIndex] = action.payload;
        } else {
          state.paymentMethods.unshift(action.payload);
        }
        // If this is set as default, update others
        if (action.payload.isDefault) {
          state.paymentMethods.forEach(pm => {
            if (pm.id !== action.payload.id) {
              pm.isDefault = false;
            }
          });
        }
      })
      // Fetch payment methods
      .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
        state.paymentMethods = action.payload;
      })
      // Remove payment method
      .addCase(removePaymentMethod.fulfilled, (state, action) => {
        state.paymentMethods = state.paymentMethods.filter(pm => pm.id !== action.payload);
      })
      // Fetch payment history
      .addCase(fetchPaymentHistory.fulfilled, (state, action) => {
        state.paymentHistory = action.payload;
      })
      // Tournament payment
      .addCase(createTournamentPayment.fulfilled, (state, action) => {
        state.tournamentPaymentClientSecret = action.payload.clientSecret;
      })
      // Booking payment
      .addCase(createBookingPayment.fulfilled, (state, action) => {
        state.bookingPaymentClientSecret = action.payload.clientSecret;
      })
      // Upcoming invoice
      .addCase(fetchUpcomingInvoice.fulfilled, (state, action) => {
        state.upcomingInvoice = action.payload;
      });
  },
});

export const { clearError, clearSetupIntent, clearPaymentSecrets } = subscriptionSlice.actions;

export default subscriptionSlice.reducer;