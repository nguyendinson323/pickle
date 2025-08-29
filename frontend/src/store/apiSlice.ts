import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ApiState {
  loading: Record<string, boolean>;
  errors: Record<string, string | null>;
  lastFetch: Record<string, number>;
}

const initialState: ApiState = {
  loading: {},
  errors: {},
  lastFetch: {},
};

const apiSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {
    startLoading: (state, action: PayloadAction<string>) => {
      state.loading[action.payload] = true;
      state.errors[action.payload] = null;
    },
    stopLoading: (state, action: PayloadAction<string>) => {
      state.loading[action.payload] = false;
    },
    setError: (state, action: PayloadAction<{ key: string; error: string }>) => {
      state.loading[action.payload.key] = false;
      state.errors[action.payload.key] = action.payload.error;
    },
    clearError: (state, action: PayloadAction<string>) => {
      state.errors[action.payload] = null;
    },
    setLastFetch: (state, action: PayloadAction<{ key: string; timestamp: number }>) => {
      state.lastFetch[action.payload.key] = action.payload.timestamp;
    },
    clearApiState: (state, action: PayloadAction<string>) => {
      delete state.loading[action.payload];
      delete state.errors[action.payload];
      delete state.lastFetch[action.payload];
    },
  },
});

export const {
  startLoading,
  stopLoading,
  setError,
  clearError,
  setLastFetch,
  clearApiState,
} = apiSlice.actions;

// Selectors
export const selectLoading = (key: string) => (state: { api: ApiState }) => 
  state.api.loading[key] || false;

export const selectError = (key: string) => (state: { api: ApiState }) => 
  state.api.errors[key] || null;

export const selectLastFetch = (key: string) => (state: { api: ApiState }) => 
  state.api.lastFetch[key] || 0;

export default apiSlice.reducer;