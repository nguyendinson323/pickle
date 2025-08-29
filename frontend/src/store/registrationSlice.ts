import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';
import { 
  UserRole, 
  RegistrationState, 
  PlayerRegistrationData,
  CoachRegistrationData,
  ClubRegistrationData,
  PartnerRegistrationData,
  StateCommitteeRegistrationData,
  RegistrationResponse
} from '@/types/registration';
import api from '@/services/api';

const initialState: RegistrationState = {
  selectedRole: null,
  isSubmitting: false,
  error: null,
  success: false,
  completedSteps: []
};

// Async thunks for registration
export const registerPlayer = createAsyncThunk(
  'registration/registerPlayer',
  async (data: PlayerRegistrationData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
      // Add text fields
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'profilePhoto' && key !== 'idDocument' && value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      
      // Add files
      if (data.profilePhoto) {
        formData.append('profilePhoto', data.profilePhoto);
      }
      if (data.idDocument) {
        formData.append('idDocument', data.idDocument);
      }

      const response = await api.post('/registration/player', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data as RegistrationResponse;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Registration failed');
    }
  }
);

export const registerCoach = createAsyncThunk(
  'registration/registerCoach',
  async (data: CoachRegistrationData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'profilePhoto' && key !== 'idDocument' && value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      
      if (data.profilePhoto) {
        formData.append('profilePhoto', data.profilePhoto);
      }
      if (data.idDocument) {
        formData.append('idDocument', data.idDocument);
      }

      const response = await api.post('/registration/coach', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data as RegistrationResponse;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Registration failed');
    }
  }
);

export const registerClub = createAsyncThunk(
  'registration/registerClub',
  async (data: ClubRegistrationData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'logo' && key !== 'socialMedia' && value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      
      if (data.socialMedia) {
        formData.append('socialMedia', JSON.stringify(data.socialMedia));
      }
      if (data.logo) {
        formData.append('logo', data.logo);
      }

      const response = await api.post('/registration/club', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data as RegistrationResponse;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Registration failed');
    }
  }
);

export const registerPartner = createAsyncThunk(
  'registration/registerPartner',
  async (data: PartnerRegistrationData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'logo' && key !== 'socialMedia' && value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      
      if (data.socialMedia) {
        formData.append('socialMedia', JSON.stringify(data.socialMedia));
      }
      if (data.logo) {
        formData.append('logo', data.logo);
      }

      const response = await api.post('/registration/partner', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data as RegistrationResponse;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Registration failed');
    }
  }
);

export const registerStateCommittee = createAsyncThunk(
  'registration/registerStateCommittee',
  async (data: StateCommitteeRegistrationData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'logo' && key !== 'socialMedia' && value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      
      if (data.socialMedia) {
        formData.append('socialMedia', JSON.stringify(data.socialMedia));
      }
      if (data.logo) {
        formData.append('logo', data.logo);
      }

      const response = await api.post('/registration/state-committee', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data as RegistrationResponse;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Registration failed');
    }
  }
);

const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    setSelectedRole: (state, action: PayloadAction<UserRole | null>) => {
      state.selectedRole = action.payload;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetRegistration: (state) => {
      state.selectedRole = null;
      state.isSubmitting = false;
      state.error = null;
      state.success = false;
      state.completedSteps = [];
    },
    addCompletedStep: (state, action: PayloadAction<string>) => {
      if (!state.completedSteps.includes(action.payload)) {
        state.completedSteps.push(action.payload);
      }
    }
  },
  extraReducers: (builder) => {
    // Player registration
    builder
      .addCase(registerPlayer.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(registerPlayer.fulfilled, (state) => {
        state.isSubmitting = false;
        state.success = true;
        state.error = null;
      })
      .addCase(registerPlayer.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });

    // Coach registration
    builder
      .addCase(registerCoach.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(registerCoach.fulfilled, (state) => {
        state.isSubmitting = false;
        state.success = true;
        state.error = null;
      })
      .addCase(registerCoach.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });

    // Club registration
    builder
      .addCase(registerClub.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(registerClub.fulfilled, (state) => {
        state.isSubmitting = false;
        state.success = true;
        state.error = null;
      })
      .addCase(registerClub.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });

    // Partner registration
    builder
      .addCase(registerPartner.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(registerPartner.fulfilled, (state) => {
        state.isSubmitting = false;
        state.success = true;
        state.error = null;
      })
      .addCase(registerPartner.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });

    // State committee registration
    builder
      .addCase(registerStateCommittee.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(registerStateCommittee.fulfilled, (state) => {
        state.isSubmitting = false;
        state.success = true;
        state.error = null;
      })
      .addCase(registerStateCommittee.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });
  }
});

export const { 
  setSelectedRole, 
  clearError, 
  resetRegistration,
  addCompletedStep 
} = registrationSlice.actions;

// Selectors
export const selectRegistrationState = (state: RootState) => state.registration;
export const selectSelectedRole = (state: RootState) => state.registration.selectedRole;
export const selectIsSubmitting = (state: RootState) => state.registration.isSubmitting;
export const selectRegistrationError = (state: RootState) => state.registration.error;
export const selectRegistrationSuccess = (state: RootState) => state.registration.success;

export default registrationSlice.reducer;