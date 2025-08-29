import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface MembershipPlan {
  id: number;
  name: string;
  role: string;
  planType: 'basic' | 'premium';
  annualFee: number;
  monthlyFee: number;
  features: string[];
  stripePriceId: string;
  description: string;
  isActive: boolean;
}

export interface Payment {
  id: number;
  userId: number;
  membershipPlanId?: number;
  paymentType: string;
  status: string;
  amount: number;
  currency: string;
  stripePaymentIntentId: string;
  stripeCustomerId?: string;
  stripeChargeId?: string;
  paymentMethod: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  description: string;
  paidAt?: string;
  createdAt: string;
  plan?: MembershipPlan;
}

export interface PaymentIntent {
  clientSecret: string;
  paymentId: number;
  amount: number;
}

interface PaymentState {
  plans: MembershipPlan[];
  payments: Payment[];
  currentPayment: Payment | null;
  paymentIntent: PaymentIntent | null;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
  };
}

const initialState: PaymentState = {
  plans: [],
  payments: [],
  currentPayment: null,
  paymentIntent: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0,
  },
};

// Async thunks
export const fetchMembershipPlans = createAsyncThunk(
  'payment/fetchMembershipPlans',
  async (role?: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const params = role ? `?role=${role}` : '';
      const response = await axios.get(`${API_BASE_URL}/payments/plans${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.plans;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch membership plans');
    }
  }
);

export const createPaymentIntent = createAsyncThunk(
  'payment/createPaymentIntent',
  async (data: { membershipPlanId: number; paymentMethod?: string }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/payments/payment-intent`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create payment intent');
    }
  }
);

export const confirmPayment = createAsyncThunk(
  'payment/confirmPayment',
  async (paymentId: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/payments/confirm/${paymentId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to confirm payment');
    }
  }
);

export const fetchPayments = createAsyncThunk(
  'payment/fetchPayments',
  async (params: { page?: number; limit?: number; status?: string } = {}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.status) queryParams.append('status', params.status);
      
      const response = await axios.get(`${API_BASE_URL}/payments/history?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch payments');
    }
  }
);

export const cancelPayment = createAsyncThunk(
  'payment/cancelPayment',
  async (paymentId: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/payments/cancel/${paymentId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { paymentId, ...response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to cancel payment');
    }
  }
);

export const refundPayment = createAsyncThunk(
  'payment/refundPayment',
  async (data: { paymentId: number; reason?: string }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/payments/refund/${data.paymentId}`, 
        { reason: data.reason }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { paymentId: data.paymentId, ...response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to refund payment');
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearPaymentIntent: (state) => {
      state.paymentIntent = null;
    },
    setCurrentPayment: (state, action: PayloadAction<Payment | null>) => {
      state.currentPayment = action.payload;
    },
    updatePaymentStatus: (state, action: PayloadAction<{ paymentId: number; status: string }>) => {
      const payment = state.payments.find(p => p.id === action.payload.paymentId);
      if (payment) {
        payment.status = action.payload.status;
      }
      if (state.currentPayment?.id === action.payload.paymentId) {
        state.currentPayment.status = action.payload.status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch membership plans
      .addCase(fetchMembershipPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMembershipPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(fetchMembershipPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create payment intent
      .addCase(createPaymentIntent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentIntent = action.payload;
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Confirm payment
      .addCase(confirmPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmPayment.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.payment) {
          const existingIndex = state.payments.findIndex(p => p.id === action.payload.payment.id);
          if (existingIndex >= 0) {
            state.payments[existingIndex] = action.payload.payment;
          } else {
            state.payments.unshift(action.payload.payment);
          }
        }
        state.paymentIntent = null;
      })
      .addCase(confirmPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch payments
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload.payments;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.pages,
          total: action.payload.total,
        };
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Cancel payment
      .addCase(cancelPayment.fulfilled, (state, action) => {
        const payment = state.payments.find(p => p.id === action.payload.paymentId);
        if (payment) {
          payment.status = 'cancelled';
        }
      })
      // Refund payment
      .addCase(refundPayment.fulfilled, (state, action) => {
        const payment = state.payments.find(p => p.id === action.payload.paymentId);
        if (payment) {
          payment.status = 'refunded';
        }
      });
  },
});

export const { 
  clearError, 
  clearPaymentIntent, 
  setCurrentPayment, 
  updatePaymentStatus 
} = paymentSlice.actions;

export default paymentSlice.reducer;