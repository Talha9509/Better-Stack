// store/websiteStore.ts
import { create } from 'zustand';
import { apiClient } from '@/lib/AxiosHandling';
import { Website, WebsitesResponse, AddWebsiteResponse } from '@/types';

interface WebsiteState {
  websites: Website[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchWebsites: () => Promise<void>;
  addWebsite: (url: string) => Promise<void>;
  refreshWebsites: () => Promise<void>;
}

export const useWebsiteStore = create<WebsiteState>((set, get) => ({
  websites: [],
  loading: false,
  error: null,

  fetchWebsites: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get<WebsitesResponse>('/websites');
      console.log(response)
      set({ websites: response.data.websites, loading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch websites',
        loading: false 
      });
    }
  },

  addWebsite: async (url: string) => {
    try {
      const response = await apiClient.post<AddWebsiteResponse>('/website', { url });
      // Refresh the list after adding
      await get().fetchWebsites();
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to add website');
    }
  },

  refreshWebsites: async () => {
    await get().fetchWebsites();
  },
}));
