import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getTvContents,
  getTvPanels,
  pushContentToTV,
  startPlayingContent,
  completeContent,
  removeContent,
  subscribe,
} from '../services/tvContentService';

const TVContentContext = createContext(null);

const TV_STATUS_LABELS = {
  pending: 'Bekliyor',
  approved: 'Onaylandı',
  playing: 'Yayında',
  completed: 'Tamamlandı',
  rejected: 'Reddedildi',
};

const TV_STATUS_COLORS = {
  pending: { bg: '#FFF3E0', text: '#E65100' },
  approved: { bg: '#E3F2FD', text: '#1565C0' },
  playing: { bg: '#E8F5E9', text: '#2E7D32' },
  completed: { bg: '#F3E5F5', text: '#6A1B9A' },
  rejected: { bg: '#FFEBEE', text: '#C62828' },
};

export function TVContentProvider({ children }) {
  const [tvContents, setTvContents] = useState(getTvContents());
  const [tvPanels, setTvPanels] = useState(getTvPanels());

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setTvContents(getTvContents());
      setTvPanels(getTvPanels());
    });
    return unsubscribe;
  }, []);

  // Async - Supabase'e yazar
  const pushToTV = useCallback(async (order) => {
    return await pushContentToTV(order);
  }, []);

  const startPlaying = useCallback(async (contentId) => {
    await startPlayingContent(contentId);
  }, []);

  const markComplete = useCallback(async (contentId) => {
    await completeContent(contentId);
  }, []);

  const remove = useCallback(async (contentId) => {
    await removeContent(contentId);
  }, []);

  const onlinePanels = tvPanels.filter((p) => p.status === 'online').length;
  const playingCount = tvContents.filter((c) => c.status === 'playing').length;
  const approvedCount = tvContents.filter((c) => c.status === 'approved').length;

  return (
    <TVContentContext.Provider
      value={{
        tvContents,
        tvPanels,
        pushToTV,
        startPlaying,
        markComplete,
        remove,
        onlinePanels,
        playingCount,
        approvedCount,
        TV_STATUS_LABELS,
        TV_STATUS_COLORS,
      }}
    >
      {children}
    </TVContentContext.Provider>
  );
}

export function useTVContent() {
  const ctx = useContext(TVContentContext);
  if (!ctx) throw new Error('useTVContent must be used within TVContentProvider');
  return ctx;
}
