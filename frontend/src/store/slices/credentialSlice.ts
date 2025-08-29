import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types
export interface Credential {
  id: string;
  userId: number;
  userType: string;
  federationName: string;
  federationLogo?: string;
  stateName: string;
  stateId: number;
  fullName: string;
  nrtpLevel?: string;
  affiliationStatus: string;
  rankingPosition?: number;
  clubName?: string;
  licenseType?: string;
  qrCode: string;
  federationIdNumber: string;
  nationality: string;
  photo?: string;
  issuedDate: string;
  expirationDate: string;
  status: string;
  verificationUrl: string;
  checksum: string;
  lastVerified?: string;
  verificationCount: number;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  User?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  State?: {
    name: string;
    abbreviation: string;
  };
}

export interface CredentialFilters {
  userType?: string;
  status?: string;
  stateId?: number;
  limit?: number;
  offset?: number;
}

export interface VerificationResult {
  valid: boolean;
  credential?: Credential;
  reason?: string;
}

export interface CredentialStats {
  total: number;
  byStatus: { status: string; count: number }[];
  byType: { userType: string; count: number }[];
  expiringSoon: number;
}

export interface CredentialState {
  // Credentials
  credentials: Credential[];
  userCredentials: Record<number, Credential[]>;
  stateCredentials: Record<number, Credential[]>;
  
  // Statistics
  stats: CredentialStats | null;
  
  // Verification
  verificationHistory: VerificationResult[];
  bulkVerificationResults: { id: string; valid: boolean; credential?: any; reason?: string }[];
  
  // Filters and pagination
  currentFilters: CredentialFilters;
  pagination: {
    total: number;
    limit: number;
    offset: number;
    totalPages: number;
  };
  
  // Loading states
  loading: {
    credentials: boolean;
    userCredentials: boolean;
    stateCredentials: boolean;
    stats: boolean;
    verification: boolean;
    bulkVerification: boolean;
    creation: boolean;
    statusUpdate: boolean;
    renewal: boolean;
  };
  
  // Error states
  error: {
    credentials: string | null;
    userCredentials: string | null;
    stateCredentials: string | null;
    stats: string | null;
    verification: string | null;
    bulkVerification: string | null;
    creation: string | null;
    statusUpdate: string | null;
    renewal: string | null;
  };
  
  // UI state
  selectedCredentialId: string | null;
  showGenerator: boolean;
  showVerifier: boolean;
}

const initialState: CredentialState = {
  credentials: [],
  userCredentials: {},
  stateCredentials: {},
  stats: null,
  verificationHistory: [],
  bulkVerificationResults: [],
  currentFilters: {
    limit: 20,
    offset: 0
  },
  pagination: {
    total: 0,
    limit: 20,
    offset: 0,
    totalPages: 0
  },
  loading: {
    credentials: false,
    userCredentials: false,
    stateCredentials: false,
    stats: false,
    verification: false,
    bulkVerification: false,
    creation: false,
    statusUpdate: false,
    renewal: false
  },
  error: {
    credentials: null,
    userCredentials: null,
    stateCredentials: null,
    stats: null,
    verification: null,
    bulkVerification: null,
    creation: null,
    statusUpdate: null,
    renewal: null
  },
  selectedCredentialId: null,
  showGenerator: false,
  showVerifier: false
};

// Async thunks
export const fetchUserCredentials = createAsyncThunk(
  'credentials/fetchUserCredentials',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/credentials/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user credentials');
      }

      const data = await response.json();
      return { userId, credentials: data.data };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchStateCredentials = createAsyncThunk(
  'credentials/fetchStateCredentials',
  async (params: { stateId: number; filters: CredentialFilters }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams({
        limit: (params.filters.limit || 20).toString(),
        offset: (params.filters.offset || 0).toString()
      });

      if (params.filters.userType) queryParams.append('userType', params.filters.userType);
      if (params.filters.status) queryParams.append('status', params.filters.status);

      const response = await fetch(
        `/api/credentials/state/${params.stateId}?${queryParams}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch state credentials');
      }

      const data = await response.json();
      return { stateId: params.stateId, ...data };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCredentialStats = createAsyncThunk(
  'credentials/fetchCredentialStats',
  async (stateId?: number, { rejectWithValue }) => {
    try {
      const params = stateId ? `?stateId=${stateId}` : '';
      const response = await fetch(`/api/credentials/stats${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch credential statistics');
      }

      const data = await response.json();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCredential = createAsyncThunk(
  'credentials/createCredential',
  async (credentialData: {
    userId: number;
    userType: string;
    fullName: string;
    stateId: number;
    stateName: string;
    nrtpLevel?: string;
    rankingPosition?: number;
    clubName?: string;
    licenseType?: string;
    federationIdNumber: string;
    nationality?: string;
    photo?: string;
    expirationDate?: string;
    metadata?: Record<string, any>;
  }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/credentials/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(credentialData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create credential');
      }

      const data = await response.json();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const verifyCredential = createAsyncThunk(
  'credentials/verifyCredential',
  async (credentialId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/credentials/verify/${credentialId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to verify credential');
      }

      const data = await response.json();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const bulkVerifyCredentials = createAsyncThunk(
  'credentials/bulkVerifyCredentials',
  async (credentialIds: string[], { rejectWithValue }) => {
    try {
      const response = await fetch('/api/credentials/verify-bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ credentialIds })
      });

      if (!response.ok) {
        throw new Error('Failed to verify credentials');
      }

      const data = await response.json();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCredentialStatus = createAsyncThunk(
  'credentials/updateCredentialStatus',
  async (params: { credentialId: string; status: string; reason?: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/credentials/${params.credentialId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: params.status, reason: params.reason })
      });

      if (!response.ok) {
        throw new Error('Failed to update credential status');
      }

      const data = await response.json();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const renewCredential = createAsyncThunk(
  'credentials/renewCredential',
  async (params: { credentialId: string; extensionMonths?: number }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/credentials/${params.credentialId}/renew`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ extensionMonths: params.extensionMonths || 12 })
      });

      if (!response.ok) {
        throw new Error('Failed to renew credential');
      }

      const data = await response.json();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchExpiringCredentials = createAsyncThunk(
  'credentials/fetchExpiringCredentials',
  async (days: number = 30, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/credentials/expiring?days=${days}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch expiring credentials');
      }

      const data = await response.json();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const credentialSlice = createSlice({
  name: 'credentials',
  initialState,
  reducers: {
    setCurrentFilters: (state, action: PayloadAction<Partial<CredentialFilters>>) => {
      state.currentFilters = { ...state.currentFilters, ...action.payload };
    },
    
    clearCredentials: (state) => {
      state.credentials = [];
      state.pagination = initialState.pagination;
    },
    
    clearUserCredentials: (state, action: PayloadAction<number>) => {
      delete state.userCredentials[action.payload];
    },
    
    clearStateCredentials: (state, action: PayloadAction<number>) => {
      delete state.stateCredentials[action.payload];
    },
    
    clearVerificationHistory: (state) => {
      state.verificationHistory = [];
    },
    
    clearBulkVerificationResults: (state) => {
      state.bulkVerificationResults = [];
    },
    
    setSelectedCredential: (state, action: PayloadAction<string | null>) => {
      state.selectedCredentialId = action.payload;
    },
    
    setShowGenerator: (state, action: PayloadAction<boolean>) => {
      state.showGenerator = action.payload;
    },
    
    setShowVerifier: (state, action: PayloadAction<boolean>) => {
      state.showVerifier = action.payload;
    },
    
    clearErrors: (state) => {
      state.error = {
        credentials: null,
        userCredentials: null,
        stateCredentials: null,
        stats: null,
        verification: null,
        bulkVerification: null,
        creation: null,
        statusUpdate: null,
        renewal: null
      };
    },
    
    updateCredentialInPlace: (state, action: PayloadAction<Credential>) => {
      // Update credential in various arrays
      const updateCredential = (credentials: Credential[]) => {
        const index = credentials.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          credentials[index] = action.payload;
        }
      };

      updateCredential(state.credentials);
      
      // Update in user credentials
      Object.values(state.userCredentials).forEach(updateCredential);
      
      // Update in state credentials
      Object.values(state.stateCredentials).forEach(updateCredential);
    },
    
    removeCredential: (state, action: PayloadAction<string>) => {
      const credentialId = action.payload;
      
      state.credentials = state.credentials.filter(c => c.id !== credentialId);
      
      // Remove from user credentials
      Object.keys(state.userCredentials).forEach(userId => {
        state.userCredentials[Number(userId)] = state.userCredentials[Number(userId)].filter(c => c.id !== credentialId);
      });
      
      // Remove from state credentials
      Object.keys(state.stateCredentials).forEach(stateId => {
        state.stateCredentials[Number(stateId)] = state.stateCredentials[Number(stateId)].filter(c => c.id !== credentialId);
      });
    },
    
    addVerificationToHistory: (state, action: PayloadAction<VerificationResult>) => {
      state.verificationHistory.unshift(action.payload);
      // Keep only the latest 20 verification results
      if (state.verificationHistory.length > 20) {
        state.verificationHistory = state.verificationHistory.slice(0, 20);
      }
    }
  },
  
  extraReducers: (builder) => {
    // Fetch User Credentials
    builder
      .addCase(fetchUserCredentials.pending, (state) => {
        state.loading.userCredentials = true;
        state.error.userCredentials = null;
      })
      .addCase(fetchUserCredentials.fulfilled, (state, action) => {
        state.loading.userCredentials = false;
        state.userCredentials[action.payload.userId] = action.payload.credentials;
      })
      .addCase(fetchUserCredentials.rejected, (state, action) => {
        state.loading.userCredentials = false;
        state.error.userCredentials = action.payload as string;
      });

    // Fetch State Credentials
    builder
      .addCase(fetchStateCredentials.pending, (state) => {
        state.loading.stateCredentials = true;
        state.error.stateCredentials = null;
      })
      .addCase(fetchStateCredentials.fulfilled, (state, action) => {
        state.loading.stateCredentials = false;
        state.stateCredentials[action.payload.stateId] = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchStateCredentials.rejected, (state, action) => {
        state.loading.stateCredentials = false;
        state.error.stateCredentials = action.payload as string;
      });

    // Fetch Credential Stats
    builder
      .addCase(fetchCredentialStats.pending, (state) => {
        state.loading.stats = true;
        state.error.stats = null;
      })
      .addCase(fetchCredentialStats.fulfilled, (state, action) => {
        state.loading.stats = false;
        state.stats = action.payload;
      })
      .addCase(fetchCredentialStats.rejected, (state, action) => {
        state.loading.stats = false;
        state.error.stats = action.payload as string;
      });

    // Create Credential
    builder
      .addCase(createCredential.pending, (state) => {
        state.loading.creation = true;
        state.error.creation = null;
      })
      .addCase(createCredential.fulfilled, (state, action) => {
        state.loading.creation = false;
        // Add to relevant arrays
        state.credentials.unshift(action.payload);
        
        if (state.userCredentials[action.payload.userId]) {
          state.userCredentials[action.payload.userId].unshift(action.payload);
        }
        
        if (state.stateCredentials[action.payload.stateId]) {
          state.stateCredentials[action.payload.stateId].unshift(action.payload);
        }
        
        // Update stats
        if (state.stats) {
          state.stats.total += 1;
        }
      })
      .addCase(createCredential.rejected, (state, action) => {
        state.loading.creation = false;
        state.error.creation = action.payload as string;
      });

    // Verify Credential
    builder
      .addCase(verifyCredential.pending, (state) => {
        state.loading.verification = true;
        state.error.verification = null;
      })
      .addCase(verifyCredential.fulfilled, (state, action) => {
        state.loading.verification = false;
        state.verificationHistory.unshift(action.payload);
        
        // Update verification count if credential exists in state
        if (action.payload.valid && action.payload.credential) {
          const updateVerificationCount = (credentials: Credential[]) => {
            const credential = credentials.find(c => c.id === action.payload.credential!.id);
            if (credential) {
              credential.verificationCount = action.payload.credential!.verificationCount;
              credential.lastVerified = new Date().toISOString();
            }
          };

          updateVerificationCount(state.credentials);
          Object.values(state.userCredentials).forEach(updateVerificationCount);
          Object.values(state.stateCredentials).forEach(updateVerificationCount);
        }
      })
      .addCase(verifyCredential.rejected, (state, action) => {
        state.loading.verification = false;
        state.error.verification = action.payload as string;
      });

    // Bulk Verify Credentials
    builder
      .addCase(bulkVerifyCredentials.pending, (state) => {
        state.loading.bulkVerification = true;
        state.error.bulkVerification = null;
      })
      .addCase(bulkVerifyCredentials.fulfilled, (state, action) => {
        state.loading.bulkVerification = false;
        state.bulkVerificationResults = action.payload;
      })
      .addCase(bulkVerifyCredentials.rejected, (state, action) => {
        state.loading.bulkVerification = false;
        state.error.bulkVerification = action.payload as string;
      });

    // Update Credential Status
    builder
      .addCase(updateCredentialStatus.pending, (state) => {
        state.loading.statusUpdate = true;
        state.error.statusUpdate = null;
      })
      .addCase(updateCredentialStatus.fulfilled, (state, action) => {
        state.loading.statusUpdate = false;
        // Update credential status in all relevant arrays
        const updateStatus = (credentials: Credential[]) => {
          const credential = credentials.find(c => c.id === action.payload.id);
          if (credential) {
            credential.status = action.payload.status;
            credential.metadata = action.payload.metadata;
            credential.updatedAt = action.payload.updatedAt;
          }
        };

        updateStatus(state.credentials);
        Object.values(state.userCredentials).forEach(updateStatus);
        Object.values(state.stateCredentials).forEach(updateStatus);
      })
      .addCase(updateCredentialStatus.rejected, (state, action) => {
        state.loading.statusUpdate = false;
        state.error.statusUpdate = action.payload as string;
      });

    // Renew Credential
    builder
      .addCase(renewCredential.pending, (state) => {
        state.loading.renewal = true;
        state.error.renewal = null;
      })
      .addCase(renewCredential.fulfilled, (state, action) => {
        state.loading.renewal = false;
        // Update credential in all relevant arrays
        const updateCredential = (credentials: Credential[]) => {
          const index = credentials.findIndex(c => c.id === action.payload.id);
          if (index !== -1) {
            credentials[index] = action.payload;
          }
        };

        updateCredential(state.credentials);
        Object.values(state.userCredentials).forEach(updateCredential);
        Object.values(state.stateCredentials).forEach(updateCredential);
      })
      .addCase(renewCredential.rejected, (state, action) => {
        state.loading.renewal = false;
        state.error.renewal = action.payload as string;
      });

    // Fetch Expiring Credentials
    builder
      .addCase(fetchExpiringCredentials.pending, (state) => {
        state.loading.credentials = true;
        state.error.credentials = null;
      })
      .addCase(fetchExpiringCredentials.fulfilled, (state, action) => {
        state.loading.credentials = false;
        state.credentials = action.payload;
      })
      .addCase(fetchExpiringCredentials.rejected, (state, action) => {
        state.loading.credentials = false;
        state.error.credentials = action.payload as string;
      });
  }
});

export const {
  setCurrentFilters,
  clearCredentials,
  clearUserCredentials,
  clearStateCredentials,
  clearVerificationHistory,
  clearBulkVerificationResults,
  setSelectedCredential,
  setShowGenerator,
  setShowVerifier,
  clearErrors,
  updateCredentialInPlace,
  removeCredential,
  addVerificationToHistory
} = credentialSlice.actions;

export default credentialSlice.reducer;