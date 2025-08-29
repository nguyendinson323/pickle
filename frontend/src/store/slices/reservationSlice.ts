import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../services/api';

// Types
export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  price: number;
  isBlocked: boolean;
  blockReason?: string;
  reservationId?: number;
}

export interface Reservation {
  id: number;
  courtId: number;
  userId: number;
  reservationDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  baseRate: number;
  peakRateMultiplier: number;
  weekendRateMultiplier: number;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  paymentId?: number;
  status: 'pending' | 'confirmed' | 'checked_in' | 'completed' | 'cancelled';
  notes?: string;
  checkedInAt?: string;
  checkedOutAt?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  refundAmount?: number;
  refundProcessedAt?: string;
  court?: {
    id: number;
    name: string;
    address: string;
    images: string[];
    amenities: string[];
  };
  payment?: {
    id: number;
    status: string;
    totalAmount: number;
    paymentMethod: string;
  };
  review?: {
    id: number;
    overallRating: number;
    comment: string;
    createdAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ReservationFormData {
  courtId: number;
  reservationDate: string;
  startTime: string;
  endTime: string;
  notes?: string;
}

export interface Conflict {
  type: 'reservation' | 'maintenance' | 'operating_hours' | 'advance_booking' | 'duration';
  message: string;
  conflictingReservation?: Reservation;
  blockDetails?: any;
}

interface ReservationState {
  reservations: Reservation[];
  currentReservation: Reservation | null;
  availableSlots: TimeSlot[];
  availability: { [date: string]: TimeSlot[] };
  conflicts: Conflict[];
  loading: boolean;
  error: string | null;
  availabilityLoading: boolean;
  availabilityError: string | null;
  checkingAvailability: boolean;
  pagination: {
    current: number;
    pages: number;
    total: number;
    limit: number;
  };
  selectedDate: string;
  selectedCourtId: number | null;
}

const initialState: ReservationState = {
  reservations: [],
  currentReservation: null,
  availableSlots: [],
  availability: {},
  conflicts: [],
  loading: false,
  error: null,
  availabilityLoading: false,
  availabilityError: null,
  checkingAvailability: false,
  pagination: {
    current: 1,
    pages: 0,
    total: 0,
    limit: 10
  },
  selectedDate: new Date().toISOString().split('T')[0],
  selectedCourtId: null
};

// Async thunks
export const fetchUserReservations = createAsyncThunk(
  'reservations/fetchUserReservations',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) => {
    const response = await api.get(`/api/reservations/my?page=${page}&limit=${limit}`);
    return response.data;
  }
);

export const fetchReservationById = createAsyncThunk(
  'reservations/fetchReservationById',
  async (reservationId: number) => {
    const response = await api.get(`/api/reservations/${reservationId}`);
    return response.data;
  }
);

export const createReservation = createAsyncThunk(
  'reservations/createReservation',
  async (reservationData: ReservationFormData) => {
    const response = await api.post('/api/reservations', reservationData);
    return response.data;
  }
);

export const updateReservation = createAsyncThunk(
  'reservations/updateReservation',
  async ({ id, ...updateData }: { id: number } & Partial<ReservationFormData>) => {
    const response = await api.put(`/api/reservations/${id}`, updateData);
    return response.data;
  }
);

export const cancelReservation = createAsyncThunk(
  'reservations/cancelReservation',
  async ({ id, reason }: { id: number; reason?: string }) => {
    const response = await api.delete(`/api/reservations/${id}/cancel`, {
      data: { reason }
    });
    return id;
  }
);

export const checkInReservation = createAsyncThunk(
  'reservations/checkInReservation',
  async (reservationId: number) => {
    const response = await api.post(`/api/reservations/${reservationId}/checkin`);
    return { reservationId, checkedInAt: response.data.checkedInAt };
  }
);

export const checkOutReservation = createAsyncThunk(
  'reservations/checkOutReservation',
  async (reservationId: number) => {
    const response = await api.post(`/api/reservations/${reservationId}/checkout`);
    return { reservationId, checkedOutAt: response.data.checkedOutAt };
  }
);

export const checkAvailability = createAsyncThunk(
  'reservations/checkAvailability',
  async ({ courtId, date, startTime, endTime }: {
    courtId: number;
    date: string;
    startTime: string;
    endTime: string;
  }) => {
    const response = await api.get(
      `/api/availability/check?courtId=${courtId}&date=${date}&startTime=${startTime}&endTime=${endTime}`
    );
    return response.data.available;
  }
);

export const fetchAvailableSlots = createAsyncThunk(
  'reservations/fetchAvailableSlots',
  async ({ courtId, date }: { courtId: number; date: string }) => {
    const response = await api.get(`/api/availability/slots?courtId=${courtId}&date=${date}`);
    return { date, slots: response.data };
  }
);

export const fetchCourtAvailability = createAsyncThunk(
  'reservations/fetchCourtAvailability',
  async ({ courtId, startDate, endDate }: {
    courtId: number;
    startDate: string;
    endDate: string;
  }) => {
    const response = await api.get(`/api/availability/courts/${courtId}?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  }
);

export const detectConflicts = createAsyncThunk(
  'reservations/detectConflicts',
  async ({ courtId, date, startTime, endTime }: {
    courtId: number;
    date: string;
    startTime: string;
    endTime: string;
  }) => {
    const response = await api.get(
      `/api/conflicts/detect?courtId=${courtId}&date=${date}&startTime=${startTime}&endTime=${endTime}`
    );
    return response.data.conflicts;
  }
);

export const processReservationPayment = createAsyncThunk(
  'reservations/processReservationPayment',
  async ({ reservationId, paymentId }: { reservationId: number; paymentId: number }) => {
    const response = await api.post(`/api/reservations/${reservationId}/payment`, {
      paymentId
    });
    return response.data;
  }
);

export const fetchCourtReservations = createAsyncThunk(
  'reservations/fetchCourtReservations',
  async ({ courtId, date }: { courtId: number; date?: string }) => {
    const params = date ? `?date=${date}` : '';
    const response = await api.get(`/api/courts/${courtId}/reservations${params}`);
    return response.data;
  }
);

// Slice
const reservationSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.availabilityError = null;
    },
    clearCurrentReservation: (state) => {
      state.currentReservation = null;
    },
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
    setSelectedCourtId: (state, action: PayloadAction<number | null>) => {
      state.selectedCourtId = action.payload;
    },
    clearAvailability: (state) => {
      state.availableSlots = [];
      state.availability = {};
      state.conflicts = [];
    },
    clearReservations: (state) => {
      state.reservations = [];
      state.pagination = {
        current: 1,
        pages: 0,
        total: 0,
        limit: 10
      };
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.current = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch user reservations
      .addCase(fetchUserReservations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserReservations.fulfilled, (state, action) => {
        state.loading = false;
        state.reservations = action.payload.data;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchUserReservations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch reservations';
      })

      // Fetch reservation by ID
      .addCase(fetchReservationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReservationById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReservation = action.payload.data;
      })
      .addCase(fetchReservationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch reservation';
      })

      // Create reservation
      .addCase(createReservation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReservation.fulfilled, (state, action) => {
        state.loading = false;
        state.reservations.unshift(action.payload.data);
        state.currentReservation = action.payload.data;
      })
      .addCase(createReservation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create reservation';
      })

      // Update reservation
      .addCase(updateReservation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReservation.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.reservations.findIndex(r => r.id === action.payload.data.id);
        if (index !== -1) {
          state.reservations[index] = action.payload.data;
        }
        if (state.currentReservation?.id === action.payload.data.id) {
          state.currentReservation = action.payload.data;
        }
      })
      .addCase(updateReservation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update reservation';
      })

      // Cancel reservation
      .addCase(cancelReservation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelReservation.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.reservations.findIndex(r => r.id === action.payload);
        if (index !== -1) {
          state.reservations[index].status = 'cancelled';
        }
        if (state.currentReservation?.id === action.payload) {
          state.currentReservation.status = 'cancelled';
        }
      })
      .addCase(cancelReservation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to cancel reservation';
      })

      // Check in reservation
      .addCase(checkInReservation.fulfilled, (state, action) => {
        const { reservationId, checkedInAt } = action.payload;
        const index = state.reservations.findIndex(r => r.id === reservationId);
        if (index !== -1) {
          state.reservations[index].status = 'checked_in';
          state.reservations[index].checkedInAt = checkedInAt;
        }
        if (state.currentReservation?.id === reservationId) {
          state.currentReservation.status = 'checked_in';
          state.currentReservation.checkedInAt = checkedInAt;
        }
      })

      // Check out reservation
      .addCase(checkOutReservation.fulfilled, (state, action) => {
        const { reservationId, checkedOutAt } = action.payload;
        const index = state.reservations.findIndex(r => r.id === reservationId);
        if (index !== -1) {
          state.reservations[index].status = 'completed';
          state.reservations[index].checkedOutAt = checkedOutAt;
        }
        if (state.currentReservation?.id === reservationId) {
          state.currentReservation.status = 'completed';
          state.currentReservation.checkedOutAt = checkedOutAt;
        }
      })

      // Check availability
      .addCase(checkAvailability.pending, (state) => {
        state.checkingAvailability = true;
        state.error = null;
      })
      .addCase(checkAvailability.fulfilled, (state) => {
        state.checkingAvailability = false;
      })
      .addCase(checkAvailability.rejected, (state, action) => {
        state.checkingAvailability = false;
        state.error = action.error.message || 'Failed to check availability';
      })

      // Fetch available slots
      .addCase(fetchAvailableSlots.pending, (state) => {
        state.availabilityLoading = true;
        state.availabilityError = null;
      })
      .addCase(fetchAvailableSlots.fulfilled, (state, action) => {
        state.availabilityLoading = false;
        state.availableSlots = action.payload.slots;
        state.availability[action.payload.date] = action.payload.slots;
      })
      .addCase(fetchAvailableSlots.rejected, (state, action) => {
        state.availabilityLoading = false;
        state.availabilityError = action.error.message || 'Failed to fetch available slots';
      })

      // Fetch court availability
      .addCase(fetchCourtAvailability.pending, (state) => {
        state.availabilityLoading = true;
        state.availabilityError = null;
      })
      .addCase(fetchCourtAvailability.fulfilled, (state, action) => {
        state.availabilityLoading = false;
        state.availability = { ...state.availability, ...action.payload.data };
      })
      .addCase(fetchCourtAvailability.rejected, (state, action) => {
        state.availabilityLoading = false;
        state.availabilityError = action.error.message || 'Failed to fetch court availability';
      })

      // Detect conflicts
      .addCase(detectConflicts.fulfilled, (state, action) => {
        state.conflicts = action.payload;
      })

      // Process reservation payment
      .addCase(processReservationPayment.fulfilled, (state, action) => {
        const reservation = action.payload.data;
        const index = state.reservations.findIndex(r => r.id === reservation.id);
        if (index !== -1) {
          state.reservations[index] = reservation;
        }
        if (state.currentReservation?.id === reservation.id) {
          state.currentReservation = reservation;
        }
      })

      // Fetch court reservations
      .addCase(fetchCourtReservations.fulfilled, (state, action) => {
        // This could be used for admin/owner view to see all reservations for a court
        state.reservations = action.payload.data;
      });
  }
});

export const {
  clearError,
  clearCurrentReservation,
  setSelectedDate,
  setSelectedCourtId,
  clearAvailability,
  clearReservations,
  setCurrentPage
} = reservationSlice.actions;

export default reservationSlice.reducer;