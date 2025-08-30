import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../services/api';

// Types
export interface Court {
  id: number;
  name: string;
  description: string;
  surfaceType: 'concrete' | 'asphalt' | 'acrylic' | 'composite';
  ownerType: 'club' | 'partner';
  ownerId: number;
  stateId: number;
  address: string;
  latitude: number;
  longitude: number;
  amenities: string[];
  hourlyRate: number;
  peakHourRate?: number;
  weekendRate?: number;
  images: string[];
  isActive: boolean;
  operatingHours: {
    [dayOfWeek: number]: {
      isOpen: boolean;
      startTime: string;
      endTime: string;
    };
  };
  maxAdvanceBookingDays: number;
  minBookingDuration: number;
  maxBookingDuration: number;
  cancellationPolicy: string;
  averageRating?: number;
  totalReviews?: number;
  state?: {
    id: number;
    name: string;
    code: string;
  };
  clubOwner?: {
    id: number;
    clubName: string;
    contactEmail: string;
  };
  partnerOwner?: {
    id: number;
    businessName: string;
    contactEmail: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CourtSearchFilters {
  search?: string;
  surfaceType?: string;
  stateId?: number;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
  latitude?: number;
  longitude?: number;
  radius?: number;
}

export interface CourtStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  amenityRatings: {
    lighting: number;
    surface: number;
    facilities: number;
    accessibility: number;
  };
}

interface CourtState {
  courts: Court[];
  currentCourt: Court | null;
  courtStats: CourtStats | null;
  loading: boolean;
  error: string | null;
  searchFilters: CourtSearchFilters;
  pagination: {
    current: number;
    pages: number;
    total: number;
    limit: number;
  };
  nearbyCourtLoading: boolean;
  nearbyCourtError: string | null;
}

const initialState: CourtState = {
  courts: [],
  currentCourt: null,
  courtStats: null,
  loading: false,
  error: null,
  searchFilters: {
    page: 1,
    limit: 10,
    sortBy: 'created_at',
    sortOrder: 'DESC'
  },
  pagination: {
    current: 1,
    pages: 0,
    total: 0,
    limit: 10
  },
  nearbyCourtLoading: false,
  nearbyCourtError: null
};

// Async thunks
export const fetchCourts = createAsyncThunk(
  'courts/fetchCourts',
  async (filters: CourtSearchFilters) => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          params.append(key, value.join(','));
        } else {
          params.append(key, String(value));
        }
      }
    });

    const response = await api.get(`/api/courts?${params.toString()}`);
    return (response as any).data;
  }
);

export const fetchCourtById = createAsyncThunk(
  'courts/fetchCourtById',
  async (courtId: number) => {
    const response = await api.get(`/api/courts/${courtId}`);
    return (response as any).data;
  }
);

export const fetchNearbyCourtss = createAsyncThunk(
  'courts/fetchNearbyCourts',
  async ({ latitude, longitude, radius = 25 }: { latitude: number; longitude: number; radius?: number }) => {
    const response = await api.get(`/api/courts/near/location?latitude=${latitude}&longitude=${longitude}&radius=${radius}`);
    return (response as any).data;
  }
);

export const fetchCourtsByOwner = createAsyncThunk(
  'courts/fetchCourtsByOwner',
  async ({ ownerType, ownerId }: { ownerType: 'club' | 'partner'; ownerId: number }) => {
    const response = await api.get(`/api/courts/owner/${ownerType}/${ownerId}`);
    return (response as any).data;
  }
);

export const createCourt = createAsyncThunk(
  'courts/createCourt',
  async (courtData: Partial<Court>) => {
    const response = await api.post('/api/courts', courtData);
    return (response as any).data;
  }
);

export const updateCourt = createAsyncThunk(
  'courts/updateCourt',
  async ({ id, ...courtData }: Partial<Court> & { id: number }) => {
    const response = await api.put(`/api/courts/${id}`, courtData);
    return (response as any).data;
  }
);

export const deleteCourt = createAsyncThunk(
  'courts/deleteCourt',
  async (courtId: number) => {
    await api.delete(`/api/courts/${courtId}`);
    return courtId;
  }
);

export const updateCourtImages = createAsyncThunk(
  'courts/updateCourtImages',
  async ({ courtId, images }: { courtId: number; images: string[] }) => {
    const response = await api.put(`/api/courts/${courtId}/images`, { images });
    return { courtId, images: (response as any).data.images };
  }
);

export const fetchCourtStats = createAsyncThunk(
  'courts/fetchCourtStats',
  async (courtId: number) => {
    const response = await api.get(`/api/courts/${courtId}/stats`);
    return (response as any).data;
  }
);

// Slice
const courtSlice = createSlice({
  name: 'courts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.nearbyCourtError = null;
    },
    clearCurrentCourt: (state) => {
      state.currentCourt = null;
      state.courtStats = null;
    },
    updateSearchFilters: (state, action: PayloadAction<Partial<CourtSearchFilters>>) => {
      state.searchFilters = { ...state.searchFilters, ...action.payload };
    },
    resetSearchFilters: (state) => {
      state.searchFilters = {
        page: 1,
        limit: 10,
        sortBy: 'created_at',
        sortOrder: 'DESC'
      };
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.searchFilters.page = action.payload;
      state.pagination.current = action.payload;
    },
    clearCourts: (state) => {
      state.courts = [];
      state.pagination = {
        current: 1,
        pages: 0,
        total: 0,
        limit: 10
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch courts
      .addCase(fetchCourts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourts.fulfilled, (state, action) => {
        state.loading = false;
        state.courts = action.payload.data;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchCourts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch courts';
      })
      
      // Fetch court by ID
      .addCase(fetchCourtById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourtById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourt = action.payload.data;
      })
      .addCase(fetchCourtById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch court details';
      })
      
      // Fetch nearby courts
      .addCase(fetchNearbyCourtss.pending, (state) => {
        state.nearbyCourtLoading = true;
        state.nearbyCourtError = null;
      })
      .addCase(fetchNearbyCourtss.fulfilled, (state, action) => {
        state.nearbyCourtLoading = false;
        state.courts = action.payload.data;
      })
      .addCase(fetchNearbyCourtss.rejected, (state, action) => {
        state.nearbyCourtLoading = false;
        state.nearbyCourtError = action.error.message || 'Failed to fetch nearby courts';
      })
      
      // Fetch courts by owner
      .addCase(fetchCourtsByOwner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourtsByOwner.fulfilled, (state, action) => {
        state.loading = false;
        state.courts = action.payload.data;
      })
      .addCase(fetchCourtsByOwner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch owner courts';
      })
      
      // Create court
      .addCase(createCourt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCourt.fulfilled, (state, action) => {
        state.loading = false;
        state.courts.unshift(action.payload.data);
      })
      .addCase(createCourt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create court';
      })
      
      // Update court
      .addCase(updateCourt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCourt.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.courts.findIndex(court => court.id === action.payload.data.id);
        if (index !== -1) {
          state.courts[index] = action.payload.data;
        }
        if (state.currentCourt && state.currentCourt.id === action.payload.data.id) {
          state.currentCourt = action.payload.data;
        }
      })
      .addCase(updateCourt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update court';
      })
      
      // Delete court
      .addCase(deleteCourt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCourt.fulfilled, (state, action) => {
        state.loading = false;
        state.courts = state.courts.filter(court => court.id !== action.payload);
        if (state.currentCourt && state.currentCourt.id === action.payload) {
          state.currentCourt = null;
        }
      })
      .addCase(deleteCourt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete court';
      })
      
      // Update court images
      .addCase(updateCourtImages.fulfilled, (state, action) => {
        const { courtId, images } = action.payload;
        const index = state.courts.findIndex(court => court.id === courtId);
        if (index !== -1) {
          state.courts[index].images = images;
        }
        if (state.currentCourt && state.currentCourt.id === courtId) {
          state.currentCourt.images = images;
        }
      })
      
      // Fetch court stats
      .addCase(fetchCourtStats.fulfilled, (state, action) => {
        state.courtStats = action.payload.data;
      });
  }
});

export const {
  clearError,
  clearCurrentCourt,
  updateSearchFilters,
  resetSearchFilters,
  setCurrentPage,
  clearCourts
} = courtSlice.actions;

export default courtSlice.reducer;