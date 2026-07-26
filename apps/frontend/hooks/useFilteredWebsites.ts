
import { useUIStore } from '@/stores/uiStore';
import { useWebsiteStore } from '@/stores/websiteStore';
import type { Website } from '@/types';
import { useMemo } from 'react';

export const useFilteredWebsites = () => {
  const websites = useWebsiteStore((state) => state.websites);
  const searchQuery = useUIStore((state) => state.searchQuery);
  const statusFilter = useUIStore((state) => state.statusFilter);

  const getWebsiteStatus = (site: Website) => {
    const latestTick = [...(site.ticks ?? [])].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];

    return latestTick?.status?.toLowerCase() ?? 'unknown';
  };

  return useMemo(() => {
    return websites.filter((site) => {
      const matchesSearch = site.url.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || getWebsiteStatus(site) === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [websites, searchQuery, statusFilter]);
};
