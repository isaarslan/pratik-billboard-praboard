import React, { createContext, useContext, useState, useCallback } from 'react';

const AdContext = createContext(null);

const EMPTY_FILTERS = {
  searchText: '',
  topics: [],
  adTypes: [],
};

export function AdProvider({ children }) {
  const [ads, setAds] = useState([]);
  const [ownAds, setOwnAds] = useState([]);
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const addAd = useCallback((newAd) => {
    const id = `own-${Date.now()}`;
    const today = new Date();
    const dateStr = `${today.getDate()} ${['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'][today.getMonth()]} ${today.getFullYear()}`;

    const ad = {
      id,
      user: 'İsa Arslan',
      username: 'isaarslan',
      time: 'Az önce',
      location: 'Ankara',
      likes: '0',
      shares: '0',
      description: newAd.title,
      image: newAd.image || `https://picsum.photos/seed/${id}/800/500`,
      sector: 'Genel',
      isOwn: true,
      totalDays: String(newAd.dates?.length || 1),
      adDuration: `${newAd.duration || 15} saniye`,
      publishDate: dateStr,
      campaignDetails: newAd.campaignDetails || '',
      mediaType: newAd.mediaType || 'image',
    };

    setOwnAds((prev) => [ad, ...prev]);
    setAds((prev) => [ad, ...prev]);

    return ad;
  }, []);

  const applyFilters = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS);
  }, []);

  const activeFilterCount = (filters.topics?.length || 0) + (filters.adTypes?.length || 0) + (filters.searchText ? 1 : 0);

  const allAds = ads;
  const myAds = ownAds;

  return (
    <AdContext.Provider value={{ allAds, myAds, addAd, filters, applyFilters, clearFilters, activeFilterCount }}>
      {children}
    </AdContext.Provider>
  );
}

export function useAds() {
  const ctx = useContext(AdContext);
  if (!ctx) throw new Error('useAds must be used within AdProvider');
  return ctx;
}
