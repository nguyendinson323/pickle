import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from './index';
import { State, MembershipPlan } from '@/types/registration';
import api from '@/services/api';

interface DataState {
  states: State[];
  membershipPlans: Record<string, MembershipPlan[]>;
  nrtpLevels: Array<{ value: string; label: string }>;
  genderOptions: Array<{ value: string; label: string }>;
  privacyPolicy: {
    version: string;
    lastUpdated: string;
    title: string;
    content: string;
    downloadUrl: string;
  } | null;
  loading: {
    states: boolean;
    membershipPlans: boolean;
    privacyPolicy: boolean;
    nrtpLevels: boolean;
    genderOptions: boolean;
  };
  error: string | null;
}

const initialState: DataState = {
  states: [],
  membershipPlans: {},
  nrtpLevels: [],
  genderOptions: [],
  privacyPolicy: null,
  loading: {
    states: false,
    membershipPlans: false,
    privacyPolicy: false,
    nrtpLevels: false,
    genderOptions: false
  },
  error: null
};

// Async thunks
export const fetchStates = createAsyncThunk(
  'data/fetchStates',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/data/states');
      return (response as any).data?.data as State[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch states');
    }
  }
);

export const fetchMembershipPlans = createAsyncThunk(
  'data/fetchMembershipPlans',
  async ({ role }: { role?: string } = {}, { rejectWithValue }) => {
    try {
      const url = role ? `/data/membership-plans?role=${role}` : '/data/membership-plans';
      const response = await api.get(url);
      return { role, data: (response as any).data?.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch membership plans');
    }
  }
);

export const fetchPrivacyPolicy = createAsyncThunk(
  'data/fetchPrivacyPolicy',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/data/privacy-policy');
      return (response as any).data?.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch privacy policy');
    }
  }
);

export const fetchNrtpLevels = createAsyncThunk(
  'data/fetchNrtpLevels',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/data/nrtp-levels');
      return (response as any).data?.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch NRTP levels');
    }
  }
);

export const fetchGenderOptions = createAsyncThunk(
  'data/fetchGenderOptions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/data/gender-options');
      return (response as any).data?.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch gender options');
    }
  }
);

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // States
    builder
      .addCase(fetchStates.pending, (state) => {
        state.loading.states = true;
        state.error = null;
      })
      .addCase(fetchStates.fulfilled, (state, action) => {
        state.loading.states = false;
        state.states = action.payload;
      })
      .addCase(fetchStates.rejected, (state, action) => {
        state.loading.states = false;
        state.error = action.payload as string;
      });

    // Membership Plans
    builder
      .addCase(fetchMembershipPlans.pending, (state) => {
        state.loading.membershipPlans = true;
        state.error = null;
      })
      .addCase(fetchMembershipPlans.fulfilled, (state, action) => {
        state.loading.membershipPlans = false;
        const { role, data } = action.payload;
        if (role) {
          state.membershipPlans[role] = data;
        } else {
          state.membershipPlans = data;
        }
      })
      .addCase(fetchMembershipPlans.rejected, (state, action) => {
        state.loading.membershipPlans = false;
        state.error = action.payload as string;
      });

    // Privacy Policy
    builder
      .addCase(fetchPrivacyPolicy.pending, (state) => {
        state.loading.privacyPolicy = true;
        state.error = null;
      })
      .addCase(fetchPrivacyPolicy.fulfilled, (state, action) => {
        state.loading.privacyPolicy = false;
        state.privacyPolicy = action.payload;
      })
      .addCase(fetchPrivacyPolicy.rejected, (state, action) => {
        state.loading.privacyPolicy = false;
        state.error = action.payload as string;
      });

    // NRTP Levels
    builder
      .addCase(fetchNrtpLevels.pending, (state) => {
        state.loading.nrtpLevels = true;
        state.error = null;
      })
      .addCase(fetchNrtpLevels.fulfilled, (state, action) => {
        state.loading.nrtpLevels = false;
        state.nrtpLevels = action.payload;
      })
      .addCase(fetchNrtpLevels.rejected, (state, action) => {
        state.loading.nrtpLevels = false;
        state.error = action.payload as string;
      });

    // Gender Options
    builder
      .addCase(fetchGenderOptions.pending, (state) => {
        state.loading.genderOptions = true;
        state.error = null;
      })
      .addCase(fetchGenderOptions.fulfilled, (state, action) => {
        state.loading.genderOptions = false;
        state.genderOptions = action.payload;
      })
      .addCase(fetchGenderOptions.rejected, (state, action) => {
        state.loading.genderOptions = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearError } = dataSlice.actions;

// Selectors
export const selectStates = (state: RootState) => state.data.states;
export const selectMembershipPlans = (state: RootState) => state.data.membershipPlans;
export const selectNrtpLevels = (state: RootState) => state.data.nrtpLevels;
export const selectGenderOptions = (state: RootState) => state.data.genderOptions;
export const selectPrivacyPolicy = (state: RootState) => state.data.privacyPolicy;
export const selectDataLoading = (state: RootState) => state.data.loading;
export const selectDataError = (state: RootState) => state.data.error;

export default dataSlice.reducer;