import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiCall } from '../apiSlice';

// Types
export interface Theme {
  id: number;
  name: string;
  description?: string;
  previewImage?: string;
  isDefault: boolean;
  isActive: boolean;
  colorScheme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
    textSecondary: string;
    borderColor: string;
    successColor: string;
    warningColor: string;
    errorColor: string;
  };
  typography: {
    fontFamily: string;
    fontSize: string;
    fontWeightNormal: string;
    fontWeightBold: string;
    lineHeight: string;
    headingFontFamily: string;
  };
  layout: {
    maxWidth: string;
    sectionPadding: string;
    borderRadius: string;
    boxShadow: string;
  };
  settings: any;
  createdAt: string;
  updatedAt: string;
}

export interface ContentBlock {
  id: number;
  pageId: number;
  type: string;
  content: any;
  sortOrder: number;
  isVisible: boolean;
  settings: any;
  createdAt: string;
  updatedAt: string;
}

export interface MicrositePage {
  id: number;
  micrositeId: number;
  title: string;
  slug: string;
  content?: any;
  metaTitle?: string;
  metaDescription?: string;
  isHomePage: boolean;
  isPublished: boolean;
  sortOrder: number;
  parentPageId?: number;
  template: string;
  settings: any;
  publishedAt?: string;
  contentBlocks?: ContentBlock[];
  createdAt: string;
  updatedAt: string;
}

export interface Microsite {
  id: number;
  userId: number;
  name: string;
  subdomain: string;
  title: string;
  description?: string;
  ownerType: 'club' | 'partner' | 'state';
  ownerId: number;
  status: 'draft' | 'published' | 'suspended';
  themeId?: number;
  customCss?: string;
  customJs?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  ogImage?: string;
  faviconUrl?: string;
  logoUrl?: string;
  headerImageUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  socialMedia?: any;
  analytics?: any;
  settings: any;
  publishedAt?: string;
  theme?: Theme;
  pages?: MicrositePage[];
  createdAt: string;
  updatedAt: string;
}

export interface MediaFile {
  id: number;
  micrositeId: number;
  userId: number;
  originalName: string;
  fileName: string;
  filePath: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  alt?: string;
  title?: string;
  description?: string;
  tags?: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MicrositeState {
  microsites: Microsite[];
  currentMicrosite: Microsite | null;
  currentPage: MicrositePage | null;
  themes: Theme[];
  mediaFiles: MediaFile[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  selectedTheme: Theme | null;
  previewMode: boolean;
  draggedBlock: ContentBlock | null;
}

const initialState: MicrositeState = {
  microsites: [],
  currentMicrosite: null,
  currentPage: null,
  themes: [],
  mediaFiles: [],
  loading: false,
  saving: false,
  error: null,
  selectedTheme: null,
  previewMode: false,
  draggedBlock: null,
};

// Async thunks
export const fetchMicrosites = createAsyncThunk(
  'microsite/fetchMicrosites',
  async (ownerType?: string) => {
    const params = ownerType ? `?ownerType=${ownerType}` : '';
    const response = await apiCall(`/microsites/my${params}`);
    return response.data;
  }
);

export const fetchMicrosite = createAsyncThunk(
  'microsite/fetchMicrosite',
  async (id: number) => {
    const response = await apiCall(`/microsites/${id}`);
    return response.data;
  }
);

export const createMicrosite = createAsyncThunk(
  'microsite/createMicrosite',
  async (micrositeData: Partial<Microsite>) => {
    const response = await apiCall('/microsites', {
      method: 'POST',
      data: micrositeData,
    });
    return response.data;
  }
);

export const updateMicrosite = createAsyncThunk(
  'microsite/updateMicrosite',
  async ({ id, data }: { id: number; data: Partial<Microsite> }) => {
    const response = await apiCall(`/microsites/${id}`, {
      method: 'PUT',
      data,
    });
    return response.data;
  }
);

export const publishMicrosite = createAsyncThunk(
  'microsite/publishMicrosite',
  async (id: number) => {
    const response = await apiCall(`/microsites/${id}/publish`, {
      method: 'POST',
    });
    return response.data;
  }
);

export const unpublishMicrosite = createAsyncThunk(
  'microsite/unpublishMicrosite',
  async (id: number) => {
    const response = await apiCall(`/microsites/${id}/unpublish`, {
      method: 'POST',
    });
    return response.data;
  }
);

export const duplicateMicrosite = createAsyncThunk(
  'microsite/duplicateMicrosite',
  async ({ id, subdomain }: { id: number; subdomain: string }) => {
    const response = await apiCall(`/microsites/${id}/duplicate`, {
      method: 'POST',
      data: { subdomain },
    });
    return response.data;
  }
);

export const deleteMicrosite = createAsyncThunk(
  'microsite/deleteMicrosite',
  async (id: number) => {
    await apiCall(`/microsites/${id}`, {
      method: 'DELETE',
    });
    return id;
  }
);

// Pages
export const fetchMicrositePages = createAsyncThunk(
  'microsite/fetchMicrositePages',
  async (micrositeId: number) => {
    const response = await apiCall(`/microsites/${micrositeId}/pages`);
    return response.data;
  }
);

export const createPage = createAsyncThunk(
  'microsite/createPage',
  async ({ micrositeId, pageData }: { micrositeId: number; pageData: Partial<MicrositePage> }) => {
    const response = await apiCall(`/microsites/${micrositeId}/pages`, {
      method: 'POST',
      data: pageData,
    });
    return response.data;
  }
);

export const updatePage = createAsyncThunk(
  'microsite/updatePage',
  async ({ id, data }: { id: number; data: Partial<MicrositePage> }) => {
    const response = await apiCall(`/microsites/pages/${id}`, {
      method: 'PUT',
      data,
    });
    return response.data;
  }
);

export const publishPage = createAsyncThunk(
  'microsite/publishPage',
  async (id: number) => {
    const response = await apiCall(`/microsites/pages/${id}/publish`, {
      method: 'POST',
    });
    return response.data;
  }
);

export const unpublishPage = createAsyncThunk(
  'microsite/unpublishPage',
  async (id: number) => {
    const response = await apiCall(`/microsites/pages/${id}/unpublish`, {
      method: 'POST',
    });
    return response.data;
  }
);

export const duplicatePage = createAsyncThunk(
  'microsite/duplicatePage',
  async (id: number) => {
    const response = await apiCall(`/microsites/pages/${id}/duplicate`, {
      method: 'POST',
    });
    return response.data;
  }
);

export const deletePage = createAsyncThunk(
  'microsite/deletePage',
  async (id: number) => {
    await apiCall(`/microsites/pages/${id}`, {
      method: 'DELETE',
    });
    return id;
  }
);

export const reorderPages = createAsyncThunk(
  'microsite/reorderPages',
  async ({ micrositeId, pageOrders }: { micrositeId: number; pageOrders: Array<{ id: number; sortOrder: number }> }) => {
    const response = await apiCall(`/microsites/${micrositeId}/pages/reorder`, {
      method: 'PUT',
      data: { pageOrders },
    });
    return response.data;
  }
);

// Content Blocks
export const fetchPageBlocks = createAsyncThunk(
  'microsite/fetchPageBlocks',
  async (pageId: number) => {
    const response = await apiCall(`/microsites/pages/${pageId}/blocks`);
    return { pageId, blocks: response.data };
  }
);

export const createContentBlock = createAsyncThunk(
  'microsite/createContentBlock',
  async ({ pageId, blockData }: { pageId: number; blockData: Partial<ContentBlock> }) => {
    const response = await apiCall(`/microsites/pages/${pageId}/blocks`, {
      method: 'POST',
      data: blockData,
    });
    return response.data;
  }
);

export const updateContentBlock = createAsyncThunk(
  'microsite/updateContentBlock',
  async ({ id, data }: { id: number; data: Partial<ContentBlock> }) => {
    const response = await apiCall(`/microsites/blocks/${id}`, {
      method: 'PUT',
      data,
    });
    return response.data;
  }
);

export const deleteContentBlock = createAsyncThunk(
  'microsite/deleteContentBlock',
  async (id: number) => {
    await apiCall(`/microsites/blocks/${id}`, {
      method: 'DELETE',
    });
    return id;
  }
);

export const duplicateContentBlock = createAsyncThunk(
  'microsite/duplicateContentBlock',
  async (id: number) => {
    const response = await apiCall(`/microsites/blocks/${id}/duplicate`, {
      method: 'POST',
    });
    return response.data;
  }
);

export const reorderContentBlocks = createAsyncThunk(
  'microsite/reorderContentBlocks',
  async ({ pageId, blockOrders }: { pageId: number; blockOrders: Array<{ id: number; sortOrder: number }> }) => {
    const response = await apiCall(`/microsites/pages/${pageId}/blocks/reorder`, {
      method: 'PUT',
      data: { blockOrders },
    });
    return response.data;
  }
);

export const toggleBlockVisibility = createAsyncThunk(
  'microsite/toggleBlockVisibility',
  async (id: number) => {
    const response = await apiCall(`/microsites/blocks/${id}/toggle-visibility`, {
      method: 'POST',
    });
    return response.data;
  }
);

// Themes
export const fetchThemes = createAsyncThunk(
  'microsite/fetchThemes',
  async () => {
    const response = await apiCall('/microsites/themes');
    return response.data;
  }
);

export const generateThemeCSS = createAsyncThunk(
  'microsite/generateThemeCSS',
  async ({ themeId, customizations }: { themeId: number; customizations?: any }) => {
    const response = await apiCall(`/microsites/themes/${themeId}/css`, {
      method: 'POST',
      data: customizations || {},
    });
    return response.data;
  }
);

// Media
export const fetchMediaFiles = createAsyncThunk(
  'microsite/fetchMediaFiles',
  async ({ micrositeId, type, search }: { micrositeId: number; type?: string; search?: string }) => {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (search) params.append('search', search);
    const response = await apiCall(`/microsites/${micrositeId}/media?${params}`);
    return response.data;
  }
);

export const uploadMediaFile = createAsyncThunk(
  'microsite/uploadMediaFile',
  async ({ micrositeId, file, metadata }: { micrositeId: number; file: File; metadata?: any }) => {
    const formData = new FormData();
    formData.append('file', file);
    if (metadata) {
      Object.keys(metadata).forEach(key => {
        formData.append(key, metadata[key]);
      });
    }
    
    const response = await apiCall(`/microsites/${micrositeId}/media/upload`, {
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
);

export const updateMediaFile = createAsyncThunk(
  'microsite/updateMediaFile',
  async ({ id, data }: { id: number; data: Partial<MediaFile> }) => {
    const response = await apiCall(`/microsites/media/${id}`, {
      method: 'PUT',
      data,
    });
    return response.data;
  }
);

export const deleteMediaFile = createAsyncThunk(
  'microsite/deleteMediaFile',
  async (id: number) => {
    await apiCall(`/microsites/media/${id}`, {
      method: 'DELETE',
    });
    return id;
  }
);

// Slice
const micrositeSlice = createSlice({
  name: 'microsite',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentMicrosite: (state, action: PayloadAction<Microsite | null>) => {
      state.currentMicrosite = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<MicrositePage | null>) => {
      state.currentPage = action.payload;
    },
    setSelectedTheme: (state, action: PayloadAction<Theme | null>) => {
      state.selectedTheme = action.payload;
    },
    togglePreviewMode: (state) => {
      state.previewMode = !state.previewMode;
    },
    setDraggedBlock: (state, action: PayloadAction<ContentBlock | null>) => {
      state.draggedBlock = action.payload;
    },
    updateBlockInPage: (state, action: PayloadAction<ContentBlock>) => {
      if (state.currentPage?.contentBlocks) {
        const index = state.currentPage.contentBlocks.findIndex(block => block.id === action.payload.id);
        if (index !== -1) {
          state.currentPage.contentBlocks[index] = action.payload;
        }
      }
    },
    addBlockToPage: (state, action: PayloadAction<ContentBlock>) => {
      if (state.currentPage) {
        if (!state.currentPage.contentBlocks) {
          state.currentPage.contentBlocks = [];
        }
        state.currentPage.contentBlocks.push(action.payload);
      }
    },
    removeBlockFromPage: (state, action: PayloadAction<number>) => {
      if (state.currentPage?.contentBlocks) {
        state.currentPage.contentBlocks = state.currentPage.contentBlocks.filter(
          block => block.id !== action.payload
        );
      }
    },
    reorderBlocksInPage: (state, action: PayloadAction<ContentBlock[]>) => {
      if (state.currentPage) {
        state.currentPage.contentBlocks = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    // Microsites
    builder
      .addCase(fetchMicrosites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMicrosites.fulfilled, (state, action) => {
        state.loading = false;
        state.microsites = action.payload;
      })
      .addCase(fetchMicrosites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch microsites';
      })
      .addCase(fetchMicrosite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMicrosite.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMicrosite = action.payload;
      })
      .addCase(fetchMicrosite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch microsite';
      })
      .addCase(createMicrosite.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createMicrosite.fulfilled, (state, action) => {
        state.saving = false;
        state.microsites.unshift(action.payload);
        state.currentMicrosite = action.payload;
      })
      .addCase(createMicrosite.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message || 'Failed to create microsite';
      })
      .addCase(updateMicrosite.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateMicrosite.fulfilled, (state, action) => {
        state.saving = false;
        const index = state.microsites.findIndex(ms => ms.id === action.payload.id);
        if (index !== -1) {
          state.microsites[index] = action.payload;
        }
        if (state.currentMicrosite?.id === action.payload.id) {
          state.currentMicrosite = action.payload;
        }
      })
      .addCase(updateMicrosite.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message || 'Failed to update microsite';
      })
      .addCase(publishMicrosite.fulfilled, (state, action) => {
        const index = state.microsites.findIndex(ms => ms.id === action.payload.id);
        if (index !== -1) {
          state.microsites[index] = action.payload;
        }
        if (state.currentMicrosite?.id === action.payload.id) {
          state.currentMicrosite = action.payload;
        }
      })
      .addCase(unpublishMicrosite.fulfilled, (state, action) => {
        const index = state.microsites.findIndex(ms => ms.id === action.payload.id);
        if (index !== -1) {
          state.microsites[index] = action.payload;
        }
        if (state.currentMicrosite?.id === action.payload.id) {
          state.currentMicrosite = action.payload;
        }
      })
      .addCase(duplicateMicrosite.fulfilled, (state, action) => {
        state.microsites.unshift(action.payload);
      })
      .addCase(deleteMicrosite.fulfilled, (state, action) => {
        state.microsites = state.microsites.filter(ms => ms.id !== action.payload);
        if (state.currentMicrosite?.id === action.payload) {
          state.currentMicrosite = null;
        }
      })
      // Pages
      .addCase(fetchMicrositePages.fulfilled, (state, action) => {
        if (state.currentMicrosite) {
          state.currentMicrosite.pages = action.payload;
        }
      })
      .addCase(createPage.fulfilled, (state, action) => {
        if (state.currentMicrosite?.pages) {
          state.currentMicrosite.pages.push(action.payload);
        }
      })
      .addCase(updatePage.fulfilled, (state, action) => {
        if (state.currentMicrosite?.pages) {
          const index = state.currentMicrosite.pages.findIndex(p => p.id === action.payload.id);
          if (index !== -1) {
            state.currentMicrosite.pages[index] = action.payload;
          }
        }
        if (state.currentPage?.id === action.payload.id) {
          state.currentPage = action.payload;
        }
      })
      .addCase(deletePage.fulfilled, (state, action) => {
        if (state.currentMicrosite?.pages) {
          state.currentMicrosite.pages = state.currentMicrosite.pages.filter(p => p.id !== action.payload);
        }
        if (state.currentPage?.id === action.payload) {
          state.currentPage = null;
        }
      })
      // Content Blocks
      .addCase(fetchPageBlocks.fulfilled, (state, action) => {
        if (state.currentPage?.id === action.payload.pageId) {
          state.currentPage.contentBlocks = action.payload.blocks;
        }
      })
      .addCase(createContentBlock.fulfilled, (state, action) => {
        if (state.currentPage && (!state.currentPage.contentBlocks)) {
          state.currentPage.contentBlocks = [];
        }
        if (state.currentPage?.id === action.payload.pageId) {
          state.currentPage.contentBlocks!.push(action.payload);
        }
      })
      .addCase(updateContentBlock.fulfilled, (state, action) => {
        if (state.currentPage?.contentBlocks) {
          const index = state.currentPage.contentBlocks.findIndex(block => block.id === action.payload.id);
          if (index !== -1) {
            state.currentPage.contentBlocks[index] = action.payload;
          }
        }
      })
      .addCase(deleteContentBlock.fulfilled, (state, action) => {
        if (state.currentPage?.contentBlocks) {
          state.currentPage.contentBlocks = state.currentPage.contentBlocks.filter(
            block => block.id !== action.payload
          );
        }
      })
      .addCase(duplicateContentBlock.fulfilled, (state, action) => {
        if (state.currentPage?.contentBlocks) {
          state.currentPage.contentBlocks.push(action.payload);
        }
      })
      .addCase(reorderContentBlocks.fulfilled, (state, action) => {
        if (state.currentPage) {
          state.currentPage.contentBlocks = action.payload;
        }
      })
      .addCase(toggleBlockVisibility.fulfilled, (state, action) => {
        if (state.currentPage?.contentBlocks) {
          const index = state.currentPage.contentBlocks.findIndex(block => block.id === action.payload.id);
          if (index !== -1) {
            state.currentPage.contentBlocks[index] = action.payload;
          }
        }
      })
      // Themes
      .addCase(fetchThemes.fulfilled, (state, action) => {
        state.themes = action.payload;
      })
      // Media
      .addCase(fetchMediaFiles.fulfilled, (state, action) => {
        state.mediaFiles = action.payload.files;
      })
      .addCase(uploadMediaFile.fulfilled, (state, action) => {
        state.mediaFiles.unshift(action.payload);
      })
      .addCase(updateMediaFile.fulfilled, (state, action) => {
        const index = state.mediaFiles.findIndex(file => file.id === action.payload.id);
        if (index !== -1) {
          state.mediaFiles[index] = action.payload;
        }
      })
      .addCase(deleteMediaFile.fulfilled, (state, action) => {
        state.mediaFiles = state.mediaFiles.filter(file => file.id !== action.payload);
      });
  },
});

export const {
  clearError,
  setCurrentMicrosite,
  setCurrentPage,
  setSelectedTheme,
  togglePreviewMode,
  setDraggedBlock,
  updateBlockInPage,
  addBlockToPage,
  removeBlockFromPage,
  reorderBlocksInPage,
} = micrositeSlice.actions;

export default micrositeSlice.reducer;