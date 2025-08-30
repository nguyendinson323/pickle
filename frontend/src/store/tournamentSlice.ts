import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  Tournament, 
  TournamentState, 
  TournamentSearchFilters,
  TournamentFormData,
  TournamentRegistration
} from '../types/tournament';
import api from '../services/api';

// Initial state
const initialState: TournamentState = {
  tournaments: [],
  selectedTournament: null,
  userRegistrations: [],
  searchFilters: {
    page: 1,
    limit: 10
  },
  isLoading: false,
  error: null
};

// Async thunks
export const fetchTournaments = createAsyncThunk(
  'tournaments/fetchTournaments',
  async (filters: TournamentSearchFilters) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    const response = await api.get(`/tournaments/search?${params.toString()}`);
    return (response as any).data;
  }
);

export const fetchTournament = createAsyncThunk(
  'tournaments/fetchTournament',
  async (tournamentId: number) => {
    const response = await api.get(`/tournaments/${tournamentId}`);
    return (response as any).data.tournament;
  }
);

export const createTournament = createAsyncThunk(
  'tournaments/createTournament',
  async (tournamentData: TournamentFormData) => {
    const response = await api.post('/tournaments', tournamentData);
    return (response as any).data.tournament;
  }
);

export const updateTournament = createAsyncThunk(
  'tournaments/updateTournament',
  async ({ id, updates }: { id: number; updates: Partial<TournamentFormData> }) => {
    const response = await api.put(`/tournaments/${id}`, updates);
    return (response as any).data.tournament;
  }
);

export const deleteTournament = createAsyncThunk(
  'tournaments/deleteTournament',
  async (tournamentId: number) => {
    await api.delete(`/tournaments/${tournamentId}`);
    return tournamentId;
  }
);

export const updateTournamentStatus = createAsyncThunk(
  'tournaments/updateTournamentStatus',
  async ({ id, status }: { id: number; status: string }) => {
    const response = await api.put(`/tournaments/${id}/status`, { status });
    return (response as any).data.tournament;
  }
);

export const fetchUpcomingTournaments = createAsyncThunk(
  'tournaments/fetchUpcomingTournaments',
  async (limit: number = 10) => {
    const response = await api.get(`/tournaments/upcoming?limit=${limit}`);
    return (response as any).data.tournaments;
  }
);

export const fetchActiveTournaments = createAsyncThunk(
  'tournaments/fetchActiveTournaments',
  async () => {
    const response = await api.get('/tournaments/active');
    return (response as any).data.tournaments;
  }
);

export const fetchTournamentsByOrganizer = createAsyncThunk(
  'tournaments/fetchTournamentsByOrganizer',
  async ({ organizerId, status, level }: { 
    organizerId: number; 
    status?: string; 
    level?: string; 
  }) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (level) params.append('level', level);
    
    const response = await api.get(`/tournaments/organizer/${organizerId}?${params.toString()}`);
    return (response as any).data.tournaments;
  }
);

export const fetchUserRegistrations = createAsyncThunk(
  'tournaments/fetchUserRegistrations',
  async () => {
    const response = await api.get('/tournaments/my-registrations');
    return (response as any).data.registrations;
  }
);

export const registerForTournament = createAsyncThunk(
  'tournaments/registerForTournament',
  async ({ 
    tournamentId, 
    registrationData 
  }: { 
    tournamentId: number; 
    registrationData: any;
  }) => {
    const response = await api.post(`/tournaments/${tournamentId}/register`, registrationData);
    return (response as any).data;
  }
);

export const cancelRegistration = createAsyncThunk(
  'tournaments/cancelRegistration',
  async ({ registrationId }: { registrationId: number; reason: string }) => {
    await api.delete(`/tournaments/registrations/${registrationId}`);
    return registrationId;
  }
);

export const confirmRegistrationPayment = createAsyncThunk(
  'tournaments/confirmRegistrationPayment',
  async ({ registrationId, paymentIntentId }: { 
    registrationId: number; 
    paymentIntentId: string; 
  }) => {
    const response = await api.post(`/tournaments/registrations/${registrationId}/confirm-payment`, {
      paymentIntentId
    });
    return (response as any).data;
  }
);

export const signWaiver = createAsyncThunk(
  'tournaments/signWaiver',
  async ({ registrationId, signature }: { registrationId: number; signature: string }) => {
    const response = await api.post(`/tournaments/registrations/${registrationId}/sign-waiver`, {
      signature
    });
    return (response as any).data.registration;
  }
);

export const fetchTournamentCategories = createAsyncThunk(
  'tournaments/fetchTournamentCategories',
  async (tournamentId: number) => {
    const response = await api.get(`/tournaments/${tournamentId}/categories`);
    return (response as any).data.categories;
  }
);

export const createTournamentCategory = createAsyncThunk(
  'tournaments/createTournamentCategory',
  async ({ tournamentId, categoryData }: { 
    tournamentId: number; 
    categoryData: any; 
  }) => {
    const response = await api.post(`/tournaments/${tournamentId}/categories`, categoryData);
    return (response as any).data.category;
  }
);

export const exportTournamentData = createAsyncThunk(
  'tournaments/exportTournamentData',
  async ({ tournamentId, format }: { tournamentId: number; format: string }) => {
    const response = await api.get(`/tournaments/${tournamentId}/export?format=${format}`, {
      responseType: format === 'csv' ? 'blob' : 'json'
    });
    return (response as any).data;
  }
);

// Slice
const tournamentSlice = createSlice({
  name: 'tournaments',
  initialState,
  reducers: {
    setSearchFilters: (state, action: PayloadAction<Partial<TournamentSearchFilters>>) => {
      state.searchFilters = { ...state.searchFilters, ...action.payload };
    },
    clearSelectedTournament: (state) => {
      state.selectedTournament = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateTournamentInList: (state, action: PayloadAction<Tournament>) => {
      const index = state.tournaments.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tournaments[index] = action.payload;
      }
    },
    addTournamentToList: (state, action: PayloadAction<Tournament>) => {
      state.tournaments.unshift(action.payload);
    },
    removeTournamentFromList: (state, action: PayloadAction<number>) => {
      state.tournaments = state.tournaments.filter(t => t.id !== action.payload);
    },
    updateRegistrationInList: (state, action: PayloadAction<TournamentRegistration>) => {
      const index = state.userRegistrations.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.userRegistrations[index] = action.payload;
      } else {
        state.userRegistrations.push(action.payload);
      }
    },
    removeRegistrationFromList: (state, action: PayloadAction<number>) => {
      state.userRegistrations = state.userRegistrations.filter(r => r.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch tournaments
      .addCase(fetchTournaments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTournaments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tournaments = action.payload.tournaments;
      })
      .addCase(fetchTournaments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch tournaments';
      })

      // Fetch single tournament
      .addCase(fetchTournament.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTournament.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedTournament = action.payload;
      })
      .addCase(fetchTournament.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch tournament';
      })

      // Create tournament
      .addCase(createTournament.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTournament.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tournaments.unshift(action.payload);
        state.selectedTournament = action.payload;
      })
      .addCase(createTournament.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create tournament';
      })

      // Update tournament
      .addCase(updateTournament.fulfilled, (state, action) => {
        const index = state.tournaments.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.tournaments[index] = action.payload;
        }
        if (state.selectedTournament?.id === action.payload.id) {
          state.selectedTournament = action.payload;
        }
      })

      // Delete tournament
      .addCase(deleteTournament.fulfilled, (state, action) => {
        state.tournaments = state.tournaments.filter(t => t.id !== action.payload);
        if (state.selectedTournament?.id === action.payload) {
          state.selectedTournament = null;
        }
      })

      // Update tournament status
      .addCase(updateTournamentStatus.fulfilled, (state, action) => {
        const index = state.tournaments.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.tournaments[index] = action.payload;
        }
        if (state.selectedTournament?.id === action.payload.id) {
          state.selectedTournament = action.payload;
        }
      })

      // Fetch upcoming tournaments
      .addCase(fetchUpcomingTournaments.fulfilled, (state, action) => {
        // Could store in separate field if needed
        state.tournaments = action.payload;
      })

      // Fetch active tournaments
      .addCase(fetchActiveTournaments.fulfilled, (state, action) => {
        // Could store in separate field if needed
        state.tournaments = action.payload;
      })

      // Fetch tournaments by organizer
      .addCase(fetchTournamentsByOrganizer.fulfilled, (state, action) => {
        state.tournaments = action.payload;
      })

      // Fetch user registrations
      .addCase(fetchUserRegistrations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserRegistrations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userRegistrations = action.payload;
      })
      .addCase(fetchUserRegistrations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch registrations';
      })

      // Register for tournament
      .addCase(registerForTournament.fulfilled, (state, action) => {
        state.userRegistrations.push(action.payload.registration);
      })

      // Cancel registration
      .addCase(cancelRegistration.fulfilled, (state, action) => {
        state.userRegistrations = state.userRegistrations.filter(
          r => r.id !== action.payload
        );
      })

      // Confirm registration payment
      .addCase(confirmRegistrationPayment.fulfilled, (state, action) => {
        const index = state.userRegistrations.findIndex(
          r => r.id === action.payload.registration.id
        );
        if (index !== -1) {
          state.userRegistrations[index] = action.payload.registration;
        }
      })

      // Sign waiver
      .addCase(signWaiver.fulfilled, (state, action) => {
        const index = state.userRegistrations.findIndex(
          r => r.id === action.payload.id
        );
        if (index !== -1) {
          state.userRegistrations[index] = action.payload;
        }
      });
  }
});

export const {
  setSearchFilters,
  clearSelectedTournament,
  clearError,
  updateTournamentInList,
  addTournamentToList,
  removeTournamentFromList,
  updateRegistrationInList,
  removeRegistrationFromList
} = tournamentSlice.actions;

export default tournamentSlice.reducer;