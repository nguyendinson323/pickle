import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types
export interface Ranking {
  id: number;
  playerId: number;
  rankingType: string;
  category: string;
  position: number;
  points: number;
  previousPosition: number;
  previousPoints: number;
  stateId?: number;
  ageGroup?: string;
  gender?: string;
  tournamentsPlayed: number;
  lastTournamentDate?: string;
  activityBonus: number;
  decayFactor: number;
  lastCalculated: string;
  isActive: boolean;
  Player?: {
    firstName: string;
    lastName: string;
    nrtpLevel?: string;
    photo?: string;
    birthDate?: string;
    currentRating?: number;
  };
  State?: {
    name: string;
    abbreviation: string;
  };
}

export interface RankingHistory {
  id: number;
  playerId: number;
  rankingType: string;
  category: string;
  oldPosition: number;
  newPosition: number;
  oldPoints: number;
  newPoints: number;
  pointsChange: number;
  positionChange: number;
  changeReason: string;
  changeDate: string;
  tournamentId?: number;
  stateId?: number;
  ageGroup?: string;
  gender?: string;
  Tournament?: {
    name: string;
    level: string;
  };
}

export interface PointCalculation {
  id: number;
  tournamentId: number;
  playerId: number;
  matchId?: number;
  basePoints: number;
  placementMultiplier: number;
  levelMultiplier: number;
  opponentBonus: number;
  activityBonus: number;
  participationBonus: number;
  totalPoints: number;
  finalPlacement: number;
  totalPlayers: number;
  matchesWon: number;
  matchesLost: number;
  averageOpponentRating: number;
  calculationDetails: Record<string, any>;
  calculatedAt: string;
  Tournament?: {
    name: string;
    level: string;
    startDate: string;
  };
}

export interface RankingFilters {
  category: string;
  rankingType: string;
  stateId?: number;
  ageGroup?: string;
  gender?: string;
  limit?: number;
  offset?: number;
}

export interface RankingState {
  // Rankings
  rankings: Ranking[];
  playerRankings: Record<number, Ranking[]>;
  rankingHistory: RankingHistory[];
  pointCalculations: PointCalculation[];
  
  // Filters and pagination
  currentFilters: RankingFilters;
  pagination: {
    total: number;
    limit: number;
    offset: number;
    totalPages: number;
  };
  
  // Loading states
  loading: {
    rankings: boolean;
    playerRankings: boolean;
    history: boolean;
    pointCalculations: boolean;
  };
  
  // Error states
  error: {
    rankings: string | null;
    playerRankings: string | null;
    history: string | null;
    pointCalculations: string | null;
  };
  
  // UI state
  selectedPlayerId: number | null;
  showPlayerProfile: boolean;
}

const initialState: RankingState = {
  rankings: [],
  playerRankings: {},
  rankingHistory: [],
  pointCalculations: [],
  currentFilters: {
    category: 'national',
    rankingType: 'overall',
    limit: 50,
    offset: 0
  },
  pagination: {
    total: 0,
    limit: 50,
    offset: 0,
    totalPages: 0
  },
  loading: {
    rankings: false,
    playerRankings: false,
    history: false,
    pointCalculations: false
  },
  error: {
    rankings: null,
    playerRankings: null,
    history: null,
    pointCalculations: null
  },
  selectedPlayerId: null,
  showPlayerProfile: false
};

// Async thunks
export const fetchRankings = createAsyncThunk(
  'rankings/fetchRankings',
  async (filters: RankingFilters, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        limit: (filters.limit || 50).toString(),
        offset: (filters.offset || 0).toString()
      });

      if (filters.stateId) params.append('stateId', filters.stateId.toString());
      if (filters.ageGroup) params.append('ageGroup', filters.ageGroup);
      if (filters.gender) params.append('gender', filters.gender);

      const response = await fetch(
        `/api/rankings/category/${filters.category}/${filters.rankingType}?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch rankings');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPlayerRankings = createAsyncThunk(
  'rankings/fetchPlayerRankings',
  async (playerId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/rankings/player/${playerId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch player rankings');
      }

      const data = await response.json();
      return { playerId, rankings: data.data };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPlayerHistory = createAsyncThunk(
  'rankings/fetchPlayerHistory',
  async (params: { playerId: number; rankingType?: string; category?: string; limit?: number }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.rankingType) queryParams.append('rankingType', params.rankingType);
      if (params.category) queryParams.append('category', params.category);
      if (params.limit) queryParams.append('limit', params.limit.toString());

      const response = await fetch(
        `/api/rankings/history/${params.playerId}?${queryParams}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch player history');
      }

      const data = await response.json();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const calculateTournamentPoints = createAsyncThunk(
  'rankings/calculateTournamentPoints',
  async (params: {
    playerId: number;
    tournamentId: number;
    finalPlacement: number;
    totalPlayers: number;
    matchesWon?: number;
    matchesLost?: number;
    averageOpponentRating?: number;
  }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/rankings/calculate-points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        throw new Error('Failed to calculate tournament points');
      }

      const data = await response.json();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTournamentRankings = createAsyncThunk(
  'rankings/updateTournamentRankings',
  async (tournamentId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/rankings/update-tournament/${tournamentId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to update tournament rankings');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const recalculatePositions = createAsyncThunk(
  'rankings/recalculatePositions',
  async (params: {
    rankingType: string;
    category: string;
    stateId?: number;
    ageGroup?: string;
    gender?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/rankings/recalculate-positions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        throw new Error('Failed to recalculate positions');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const rankingSlice = createSlice({
  name: 'rankings',
  initialState,
  reducers: {
    setCurrentFilters: (state, action: PayloadAction<Partial<RankingFilters>>) => {
      state.currentFilters = { ...state.currentFilters, ...action.payload };
    },
    
    clearRankings: (state) => {
      state.rankings = [];
      state.pagination = initialState.pagination;
    },
    
    clearPlayerRankings: (state, action: PayloadAction<number>) => {
      delete state.playerRankings[action.payload];
    },
    
    clearHistory: (state) => {
      state.rankingHistory = [];
    },
    
    clearPointCalculations: (state) => {
      state.pointCalculations = [];
    },
    
    setSelectedPlayer: (state, action: PayloadAction<number | null>) => {
      state.selectedPlayerId = action.payload;
    },
    
    setShowPlayerProfile: (state, action: PayloadAction<boolean>) => {
      state.showPlayerProfile = action.payload;
    },
    
    clearErrors: (state) => {
      state.error = {
        rankings: null,
        playerRankings: null,
        history: null,
        pointCalculations: null
      };
    },
    
    updateRankingInPlace: (state, action: PayloadAction<Ranking>) => {
      const index = state.rankings.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.rankings[index] = action.payload;
      }
    },
    
    addRankingHistory: (state, action: PayloadAction<RankingHistory>) => {
      state.rankingHistory.unshift(action.payload);
      // Keep only the latest 50 history records in memory
      if (state.rankingHistory.length > 50) {
        state.rankingHistory = state.rankingHistory.slice(0, 50);
      }
    }
  },
  
  extraReducers: (builder) => {
    // Fetch Rankings
    builder
      .addCase(fetchRankings.pending, (state) => {
        state.loading.rankings = true;
        state.error.rankings = null;
      })
      .addCase(fetchRankings.fulfilled, (state, action) => {
        state.loading.rankings = false;
        state.rankings = action.payload.data;
        state.pagination = action.payload.pagination;
        state.currentFilters = { ...state.currentFilters, ...action.meta.arg };
      })
      .addCase(fetchRankings.rejected, (state, action) => {
        state.loading.rankings = false;
        state.error.rankings = action.payload as string;
      });

    // Fetch Player Rankings
    builder
      .addCase(fetchPlayerRankings.pending, (state) => {
        state.loading.playerRankings = true;
        state.error.playerRankings = null;
      })
      .addCase(fetchPlayerRankings.fulfilled, (state, action) => {
        state.loading.playerRankings = false;
        state.playerRankings[action.payload.playerId] = action.payload.rankings;
      })
      .addCase(fetchPlayerRankings.rejected, (state, action) => {
        state.loading.playerRankings = false;
        state.error.playerRankings = action.payload as string;
      });

    // Fetch Player History
    builder
      .addCase(fetchPlayerHistory.pending, (state) => {
        state.loading.history = true;
        state.error.history = null;
      })
      .addCase(fetchPlayerHistory.fulfilled, (state, action) => {
        state.loading.history = false;
        state.rankingHistory = action.payload;
      })
      .addCase(fetchPlayerHistory.rejected, (state, action) => {
        state.loading.history = false;
        state.error.history = action.payload as string;
      });

    // Calculate Tournament Points
    builder
      .addCase(calculateTournamentPoints.pending, (state) => {
        state.loading.pointCalculations = true;
        state.error.pointCalculations = null;
      })
      .addCase(calculateTournamentPoints.fulfilled, (state, action) => {
        state.loading.pointCalculations = false;
        state.pointCalculations.unshift(action.payload);
      })
      .addCase(calculateTournamentPoints.rejected, (state, action) => {
        state.loading.pointCalculations = false;
        state.error.pointCalculations = action.payload as string;
      });

    // Update Tournament Rankings
    builder
      .addCase(updateTournamentRankings.pending, (state) => {
        state.loading.rankings = true;
      })
      .addCase(updateTournamentRankings.fulfilled, (state) => {
        state.loading.rankings = false;
        // Optionally trigger a refresh of current rankings
      })
      .addCase(updateTournamentRankings.rejected, (state, action) => {
        state.loading.rankings = false;
        state.error.rankings = action.payload as string;
      });

    // Recalculate Positions
    builder
      .addCase(recalculatePositions.pending, (state) => {
        state.loading.rankings = true;
      })
      .addCase(recalculatePositions.fulfilled, (state) => {
        state.loading.rankings = false;
      })
      .addCase(recalculatePositions.rejected, (state, action) => {
        state.loading.rankings = false;
        state.error.rankings = action.payload as string;
      });
  }
});

export const {
  setCurrentFilters,
  clearRankings,
  clearPlayerRankings,
  clearHistory,
  clearPointCalculations,
  setSelectedPlayer,
  setShowPlayerProfile,
  clearErrors,
  updateRankingInPlace,
  addRankingHistory
} = rankingSlice.actions;

export default rankingSlice.reducer;