// stores/uiStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UIState {
  searchQuery: string;
  statusFilter: 'all' | 'up' | 'down';
  isModalOpen: boolean;
  

  setSearchQuery: (query: string) => void;
  setStatusFilter: (filter: 'all' | 'up' | 'down') => void;
  openModal: () => void;
  closeModal: () => void;
  resetFilters: () => void;
}

export const useUIStore = create<UIState>()(
  devtools((set) => ({
    searchQuery: '',
    statusFilter: 'all',
    isModalOpen: false,

    setSearchQuery: (query) => set({ searchQuery: query }),
    setStatusFilter: (filter) => set({ statusFilter: filter }),
    openModal: () => set({ isModalOpen: true }),
    closeModal: () => set({ isModalOpen: false }),
    resetFilters: () => set({ searchQuery: '', statusFilter: 'all' }),
  }))
);
