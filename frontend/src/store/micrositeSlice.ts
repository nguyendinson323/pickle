import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Basic types for minimal functionality
export interface Theme {
  id: number;
  name: string;
  description?: string;
  isDefault: boolean;
  isActive: boolean;
}

export interface Microsite {
  id: number;
  name: string;
  subdomain: string;
  title: string;
  description?: string;
  status: 'draft' | 'published' | 'suspended';
  themeId?: number;
  pages?: MicrositePage[];
  settings?: any;
}

export interface MicrositePage {
  id: number;
  micrositeId: number;
  title: string;
  slug: string;
  contentBlocks?: ContentBlock[];
}

export interface ContentBlock {
  id: number;
  pageId: number;
  type: string;
  content: any;
  settings?: any;
  isVisible?: boolean;
}

export interface MediaFile {
  id: number;
  micrositeId: number;
  userId: number;
  originalName: string;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
}

export interface MicrositeState {
  microsites: Microsite[];
  selectedMicrosite: Microsite | null;
  pages: MicrositePage[];
  currentPage: MicrositePage | null;
  contentBlocks: ContentBlock[];
  themes: Theme[];
  mediaFiles: MediaFile[];
  loading: boolean;
  saving: boolean;
  error: string | null;
}

const initialState: MicrositeState = {
  microsites: [],
  selectedMicrosite: null,
  pages: [],
  currentPage: null,
  contentBlocks: [],
  themes: [],
  mediaFiles: [],
  loading: false,
  saving: false,
  error: null,
};

// Main async thunks with axios implementation
export const fetchMicrosites = createAsyncThunk(
  'microsite/fetchMicrosites',
  async (ownerType?: string) => {
    const params = ownerType ? `?ownerType=${ownerType}` : '';
    const response = await axios.get(`${API_BASE_URL}/microsites/my${params}`, { headers: getAuthHeaders() });
    return response.data;
  }
);

export const fetchMicrosite = createAsyncThunk(
  'microsite/fetchMicrosite',
  async (id: number) => {
    const response = await axios.get(`${API_BASE_URL}/microsites/${id}`, { headers: getAuthHeaders() });
    return response.data;
  }
);

export const createMicrosite = createAsyncThunk(
  'microsite/createMicrosite',
  async (micrositeData: Partial<Microsite>) => {
    const response = await axios.post(`${API_BASE_URL}/microsites`, micrositeData, { headers: getAuthHeaders() });
    return response.data;
  }
);

export const updateMicrosite = createAsyncThunk(
  'microsite/updateMicrosite',
  async ({ id, data }: { id: number; data: Partial<Microsite> }) => {
    const response = await axios.put(`${API_BASE_URL}/microsites/${id}`, data, { headers: getAuthHeaders() });
    return response.data;
  }
);

export const deleteMicrosite = createAsyncThunk(
  'microsite/deleteMicrosite',
  async (id: number) => {
    await axios.delete(`${API_BASE_URL}/microsites/${id}`, { headers: getAuthHeaders() });
    return id;
  }
);

export const duplicateMicrosite = createAsyncThunk(
  'microsite/duplicateMicrosite',
  async ({ id, subdomain }: { id: number; subdomain: string }) => {
    const response = await axios.post(`${API_BASE_URL}/microsites/${id}/duplicate`, { subdomain }, { headers: getAuthHeaders() });
    return response.data;
  }
);

export const publishMicrosite = createAsyncThunk(
  'microsite/publishMicrosite',
  async (id: number) => {
    const response = await axios.post(`${API_BASE_URL}/microsites/${id}/publish`, {}, { headers: getAuthHeaders() });
    return response.data;
  }
);

export const unpublishMicrosite = createAsyncThunk(
  'microsite/unpublishMicrosite',
  async (id: number) => {
    const response = await axios.post(`${API_BASE_URL}/microsites/${id}/unpublish`, {}, { headers: getAuthHeaders() });
    return response.data;
  }
);

export const fetchThemes = createAsyncThunk(
  'microsite/fetchThemes',
  async () => {
    const response = await axios.get(`${API_BASE_URL}/microsites/themes`, { headers: getAuthHeaders() });
    return response.data;
  }
);

// Create the slice
const micrositeSlice = createSlice({
  name: 'microsite',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedMicrosite: (state) => {
      state.selectedMicrosite = null;
    },
    setCurrentPage: (state, action: PayloadAction<MicrositePage | null>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch microsites
      .addCase(fetchMicrosites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMicrosites.fulfilled, (state, action) => {
        state.loading = false;
        state.microsites = action.payload || [];
      })
      .addCase(fetchMicrosites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch microsites';
      })

      // Fetch single microsite
      .addCase(fetchMicrosite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMicrosite.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedMicrosite = action.payload || null;
        state.pages = action.payload?.pages || [];
      })
      .addCase(fetchMicrosite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch microsite';
      })

      // Create microsite
      .addCase(createMicrosite.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createMicrosite.fulfilled, (state, action) => {
        state.saving = false;
        if (action.payload) {
          state.microsites.push(action.payload);
          state.selectedMicrosite = action.payload;
        }
      })
      .addCase(createMicrosite.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message || 'Failed to create microsite';
      })

      // Update microsite
      .addCase(updateMicrosite.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateMicrosite.fulfilled, (state, action) => {
        state.saving = false;
        if (action.payload) {
          const index = state.microsites.findIndex(m => m.id === action.payload.id);
          if (index !== -1) {
            state.microsites[index] = action.payload;
          }
          if (state.selectedMicrosite?.id === action.payload.id) {
            state.selectedMicrosite = action.payload;
          }
        }
      })
      .addCase(updateMicrosite.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message || 'Failed to update microsite';
      })

      // Delete microsite
      .addCase(deleteMicrosite.fulfilled, (state, action) => {
        state.microsites = state.microsites.filter(m => m.id !== action.payload);
        if (state.selectedMicrosite?.id === action.payload) {
          state.selectedMicrosite = null;
        }
      })

      // Duplicate microsite
      .addCase(duplicateMicrosite.fulfilled, (state, action) => {
        if (action.payload) {
          state.microsites.push(action.payload);
        }
      })

      // Publish/unpublish
      .addCase(publishMicrosite.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.microsites.findIndex(m => m.id === action.payload.id);
          if (index !== -1) {
            state.microsites[index].status = 'published';
          }
          if (state.selectedMicrosite?.id === action.payload.id && state.selectedMicrosite) {
            state.selectedMicrosite.status = 'published';
          }
        }
      })
      .addCase(unpublishMicrosite.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.microsites.findIndex(m => m.id === action.payload.id);
          if (index !== -1) {
            state.microsites[index].status = 'draft';
          }
          if (state.selectedMicrosite?.id === action.payload.id && state.selectedMicrosite) {
            state.selectedMicrosite.status = 'draft';
          }
        }
      })

      // Fetch themes
      .addCase(fetchThemes.fulfilled, (state, action) => {
        state.themes = action.payload || [];
      });
  },
});

export const { clearError, clearSelectedMicrosite, setCurrentPage } = micrositeSlice.actions;

export default micrositeSlice.reducer;