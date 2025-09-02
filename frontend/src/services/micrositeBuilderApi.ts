import api from './api';

export interface CreateMicrositeRequest {
  templateId: number;
  name: string;
  slug: string;
  subdomain: string;
  description?: string;
}

export interface UpdateMicrositeRequest {
  name?: string;
  slug?: string;
  subdomain?: string;
  description?: string;
  logo?: string;
  favicon?: string;
  colorScheme?: any;
  customDomain?: string;
  seo?: any;
  features?: any;
  contactInfo?: any;
}

export interface AddPageRequest {
  name: string;
  slug: string;
  title?: string;
  metaDescription?: string;
  components?: any[];
}

export interface UpdatePageRequest {
  name?: string;
  slug?: string;
  title?: string;
  metaDescription?: string;
  components?: any[];
  isPublished?: boolean;
}

export interface UploadMediaRequest {
  file: File;
  alt?: string;
  caption?: string;
  tags?: string[];
  folder?: string;
}

export interface MicrositeResponse {
  success: boolean;
  message?: string;
  data: any;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    [key: string]: T[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

class MicrositeBuilderAPI {
  private baseURL = '/api/microsite-builder';

  // Microsites
  async getMicrosites(params?: Record<string, string>): Promise<PaginatedResponse<any>> {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    const response = await api.get(`${this.baseURL}${queryString}`);
    return response.data;
  }

  async getMicrositeById(id: number): Promise<MicrositeResponse> {
    const response = await api.get(`${this.baseURL}/${id}`);
    return response.data;
  }

  async createMicrosite(data: CreateMicrositeRequest): Promise<MicrositeResponse> {
    const response = await api.post(this.baseURL, data);
    return response.data;
  }

  async updateMicrosite(id: number, data: UpdateMicrositeRequest): Promise<MicrositeResponse> {
    const response = await api.put(`${this.baseURL}/${id}`, data);
    return response.data;
  }

  async deleteMicrosite(id: number): Promise<MicrositeResponse> {
    const response = await api.delete(`${this.baseURL}/${id}`);
    return response.data;
  }

  async publishMicrosite(id: number): Promise<MicrositeResponse> {
    const response = await api.post(`${this.baseURL}/${id}/publish`);
    return response.data;
  }

  async unpublishMicrosite(id: number): Promise<MicrositeResponse> {
    const response = await api.post(`${this.baseURL}/${id}/unpublish`);
    return response.data;
  }

  async duplicateMicrosite(id: number, data: { subdomain: string; name?: string }): Promise<MicrositeResponse> {
    const response = await api.post(`${this.baseURL}/${id}/duplicate`, data);
    return response.data;
  }

  // Pages
  async addPage(micrositeId: number, data: AddPageRequest): Promise<MicrositeResponse> {
    const response = await api.post(`${this.baseURL}/${micrositeId}/pages`, data);
    return response.data;
  }

  async updatePage(micrositeId: number, pageId: string, data: UpdatePageRequest): Promise<MicrositeResponse> {
    const response = await api.put(`${this.baseURL}/${micrositeId}/pages/${pageId}`, data);
    return response.data;
  }

  async deletePage(micrositeId: number, pageId: string): Promise<MicrositeResponse> {
    const response = await api.delete(`${this.baseURL}/${micrositeId}/pages/${pageId}`);
    return response.data;
  }

  // Media Library
  async getMedia(
    micrositeId: number, 
    params?: { 
      category?: string; 
      folder?: string; 
      page?: number; 
      limit?: number; 
    }
  ): Promise<PaginatedResponse<any>> {
    const queryString = params ? '?' + new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined) acc[key] = value.toString();
        return acc;
      }, {} as Record<string, string>)
    ).toString() : '';
    
    const response = await api.get(`${this.baseURL}/${micrositeId}/media${queryString}`);
    return response.data;
  }

  async uploadMedia(micrositeId: number, data: UploadMediaRequest): Promise<MicrositeResponse> {
    const formData = new FormData();
    formData.append('file', data.file);
    
    if (data.alt) formData.append('alt', data.alt);
    if (data.caption) formData.append('caption', data.caption);
    if (data.tags) formData.append('tags', JSON.stringify(data.tags));
    if (data.folder) formData.append('folder', data.folder);

    const response = await api.post(`${this.baseURL}/${micrositeId}/media`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async deleteMedia(micrositeId: number, mediaId: number): Promise<MicrositeResponse> {
    const response = await api.delete(`${this.baseURL}/${micrositeId}/media/${mediaId}`);
    return response.data;
  }

  // Analytics
  async getAnalytics(
    micrositeId: number, 
    params?: { 
      startDate?: string; 
      endDate?: string; 
      period?: string; 
    }
  ): Promise<MicrositeResponse> {
    const queryString = params ? '?' + new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined) acc[key] = value;
        return acc;
      }, {} as Record<string, string>)
    ).toString() : '';
    
    const response = await api.get(`${this.baseURL}/${micrositeId}/analytics${queryString}`);
    return response.data;
  }

  // Templates
  async getTemplates(params?: { category?: string; isPremium?: boolean }): Promise<MicrositeResponse> {
    const queryString = params ? '?' + new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined) acc[key] = value.toString();
        return acc;
      }, {} as Record<string, string>)
    ).toString() : '';
    
    const response = await api.get(`${this.baseURL}/templates${queryString}`);
    return response.data;
  }

  // Public Access
  async getPublicMicrosite(subdomain: string): Promise<MicrositeResponse> {
    const response = await api.get(`${this.baseURL}/public/${subdomain}`);
    return response.data;
  }

  async getSitemap(subdomain: string): Promise<string> {
    const response = await api.get(`${this.baseURL}/public/${subdomain}/sitemap.xml`);
    return response.data;
  }

  // Utility methods for building URLs and handling common operations
  getMicrositeUrl(subdomain: string, customDomain?: string): string {
    return customDomain 
      ? `https://${customDomain}`
      : `https://${subdomain}.pickleballmx.com`;
  }

  getPreviewUrl(micrositeId: number): string {
    return `/microsite-builder/${micrositeId}/preview`;
  }

  getEditUrl(micrositeId: number): string {
    return `/microsite-builder/${micrositeId}/edit`;
  }

  getAnalyticsUrl(micrositeId: number): string {
    return `/microsite-builder/${micrositeId}/analytics`;
  }
}

export const micrositeBuilderApi = new MicrositeBuilderAPI();
export default micrositeBuilderApi;