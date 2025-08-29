import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';
import { DashboardData, DashboardState } from '@/types/dashboard';
import { UserRole } from '@/types/registration';

const initialState: DashboardState = {
  data: null,
  isLoading: false,
  error: null,
  activeTab: 'credential'
};

// Async thunks
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      const userRole = state.auth.user?.role;
      const userId = state.auth.user?.id;

      if (!token || !userRole || !userId) {
        throw new Error('Authentication required');
      }

      const response = await fetch('/api/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch dashboard data');
      }

      const result = await response.json();
      return result.data as DashboardData;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }
);

export const fetchRoleSpecificDashboard = createAsyncThunk(
  'dashboard/fetchRoleSpecific',
  async (params: { role: UserRole; userId: number }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`/api/dashboard/${params.role}/${params.userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch dashboard data');
      }

      const result = await response.json();
      return result.data as DashboardData;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    clearDashboard: (state) => {
      state.data = null;
      state.error = null;
      state.activeTab = 'credential';
    },
    updateStatistics: (state, action: PayloadAction<Partial<DashboardData['statistics']>>) => {
      if (state.data) {
        state.data.statistics = { ...state.data.statistics, ...action.payload };
      }
    }
  },
  extraReducers: (builder) => {
    // Fetch dashboard data
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch role-specific dashboard data
    builder
      .addCase(fetchRoleSpecificDashboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRoleSpecificDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchRoleSpecificDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

// Actions
export const { setActiveTab, clearDashboard, updateStatistics } = dashboardSlice.actions;

// Selectors
export const selectDashboardData = (state: RootState) => state.dashboard.data;
export const selectDashboardLoading = (state: RootState) => state.dashboard.isLoading;
export const selectDashboardError = (state: RootState) => state.dashboard.error;
export const selectActiveTab = (state: RootState) => state.dashboard.activeTab;
export const selectDashboardStatistics = (state: RootState) => state.dashboard.data?.statistics;
export const selectQuickActions = (state: RootState) => state.dashboard.data?.quickActions;
export const selectRecentActivity = (state: RootState) => state.dashboard.data?.recentActivity;

export default dashboardSlice.reducer;