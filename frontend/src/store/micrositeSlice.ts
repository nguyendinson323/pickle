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
  contactEmail?: string;
  contactPhone?: string;
  pages?: MicrositePage[];
  settings?: any;
}

export interface MicrositePage {
  id: number;
  micrositeId: number;
  title: string;
  slug: string;
  description?: string;
  template?: string;
  metaTitle?: string;
  metaDescription?: string;
  isPublished: boolean;
  isHomePage?: boolean;
  sortOrder?: number;
  seoSettings?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    noIndex?: boolean;
    noFollow?: boolean;
  };
  settings?: {
    showInNavigation?: boolean;
    requireAuth?: boolean;
    customCSS?: string;
    customJS?: string;
  };
  contentBlocks?: ContentBlock[];
}

export interface ContentBlock {
  id: number;
  pageId: number;
  type: string;
  content: any;
  sortOrder: number;
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
  draggedBlock: ContentBlock | null;
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
  draggedBlock: null,
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

export const updatePage = createAsyncThunk(
  'microsite/updatePage',
  async ({ id, data }: { id: number; data: Partial<MicrositePage> }) => {
    const response = await axios.put(`${API_BASE_URL}/pages/${id}`, data, { headers: getAuthHeaders() });
    return response.data;
  }
);

// Page and content block async thunks
export const fetchPageBlocks = createAsyncThunk(
  'microsite/fetchPageBlocks',
  async (pageId: number) => {
    const response = await axios.get(`${API_BASE_URL}/pages/${pageId}/blocks`, { headers: getAuthHeaders() });
    return response.data;
  }
);

export const createContentBlock = createAsyncThunk(
  'microsite/createContentBlock',
  async ({ pageId, blockData }: { pageId: number; blockData: Omit<ContentBlock, 'id' | 'pageId'> }) => {
    const response = await axios.post(`${API_BASE_URL}/pages/${pageId}/blocks`, blockData, { headers: getAuthHeaders() });
    return response.data;
  }
);

export const updateContentBlock = createAsyncThunk(
  'microsite/updateContentBlock',
  async ({ id, data }: { id: number; data: Partial<ContentBlock> }) => {
    const response = await axios.put(`${API_BASE_URL}/blocks/${id}`, data, { headers: getAuthHeaders() });
    return response.data;
  }
);

export const deleteContentBlock = createAsyncThunk(
  'microsite/deleteContentBlock',
  async (id: number) => {
    await axios.delete(`${API_BASE_URL}/blocks/${id}`, { headers: getAuthHeaders() });
    return id;
  }
);

export const reorderContentBlocks = createAsyncThunk(
  'microsite/reorderContentBlocks',
  async ({ pageId, blockOrders }: { pageId: number; blockOrders: { id: number; sortOrder: number }[] }) => {
    const response = await axios.put(`${API_BASE_URL}/pages/${pageId}/blocks/reorder`, { blockOrders }, { headers: getAuthHeaders() });
    return response.data;
  }
);

export const createPage = createAsyncThunk(
  'microsite/createPage',
  async ({ micrositeId, pageData }: { micrositeId: number; pageData: Partial<MicrositePage> }) => {
    const response = await axios.post(
      `${API_BASE_URL}/microsites/${micrositeId}/pages`,
      pageData,
      { headers: getAuthHeaders() }
    );
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
    setDraggedBlock: (state, action: PayloadAction<ContentBlock | null>) => {
      state.draggedBlock = action.payload;
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
      })

      // Update page
      .addCase(updatePage.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updatePage.fulfilled, (state, action) => {
        state.saving = false;
        if (action.payload) {
          const pageIndex = state.pages.findIndex(p => p.id === action.payload.id);
          if (pageIndex !== -1) {
            state.pages[pageIndex] = action.payload;
          }
          if (state.currentPage?.id === action.payload.id) {
            state.currentPage = action.payload;
          }
          // Update page in selectedMicrosite if it exists
          if (state.selectedMicrosite?.pages) {
            const micrositePageIndex = state.selectedMicrosite.pages.findIndex(p => p.id === action.payload.id);
            if (micrositePageIndex !== -1) {
              state.selectedMicrosite.pages[micrositePageIndex] = action.payload;
            }
          }
        }
      })
      .addCase(updatePage.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message || 'Failed to update page';
      })

      // Fetch page blocks
      .addCase(fetchPageBlocks.fulfilled, (state, action) => {
        state.contentBlocks = action.payload || [];
        // Also update the contentBlocks in currentPage if it exists
        if (state.currentPage) {
          state.currentPage.contentBlocks = action.payload || [];
        }
      })

      // Create content block
      .addCase(createContentBlock.fulfilled, (state, action) => {
        if (action.payload) {
          state.contentBlocks.push(action.payload);
          // Also update the currentPage contentBlocks
          if (state.currentPage && state.currentPage.id === action.payload.pageId) {
            if (!state.currentPage.contentBlocks) {
              state.currentPage.contentBlocks = [];
            }
            state.currentPage.contentBlocks.push(action.payload);
          }
        }
      })

      // Update content block
      .addCase(updateContentBlock.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.contentBlocks.findIndex(b => b.id === action.payload.id);
          if (index !== -1) {
            state.contentBlocks[index] = action.payload;
          }
          // Also update in currentPage if it exists
          if (state.currentPage?.contentBlocks) {
            const pageBlockIndex = state.currentPage.contentBlocks.findIndex(b => b.id === action.payload.id);
            if (pageBlockIndex !== -1) {
              state.currentPage.contentBlocks[pageBlockIndex] = action.payload;
            }
          }
        }
      })

      // Delete content block
      .addCase(deleteContentBlock.fulfilled, (state, action) => {
        state.contentBlocks = state.contentBlocks.filter(b => b.id !== action.payload);
        // Also remove from currentPage if it exists
        if (state.currentPage?.contentBlocks) {
          state.currentPage.contentBlocks = state.currentPage.contentBlocks.filter(b => b.id !== action.payload);
        }
      })

      // Reorder content blocks
      .addCase(reorderContentBlocks.fulfilled, (state, action) => {
        if (action.payload) {
          // Update the contentBlocks array with new order
          state.contentBlocks = action.payload;
          // Also update in currentPage if it exists
          if (state.currentPage) {
            state.currentPage.contentBlocks = action.payload;
          }
        }
      })

      // Create page
      .addCase(createPage.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createPage.fulfilled, (state, action) => {
        state.saving = false;
        if (action.payload && state.selectedMicrosite) {
          if (!state.selectedMicrosite.pages) {
            state.selectedMicrosite.pages = [];
          }
          state.selectedMicrosite.pages.push(action.payload);
          state.pages.push(action.payload);
          state.currentPage = action.payload;
        }
      })
      .addCase(createPage.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message || 'Failed to create page';
      });
  },
});

export const { 
  clearError, 
  clearSelectedMicrosite, 
  setCurrentPage, 
  setDraggedBlock 
} = micrositeSlice.actions;

export default micrositeSlice.reducer;