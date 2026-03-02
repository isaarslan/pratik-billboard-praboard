import React, { createContext, useContext, useState, useCallback } from 'react';

const AdContext = createContext(null);

export function AdProvider({ children }) {
  const [ads, setAds] = useState([]);
  const [ownAds, setOwnAds] = useState([]);

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

  const allAds = ads;
  const myAds = ownAds;

  return (
    <AdContext.Provider value={{ allAds, myAds, addAd }}>
      {children}
    </AdContext.Provider>
  );
}

export function useAds() {
  const ctx = useContext(AdContext);
  if (!ctx) throw new Error('useAds must be used within AdProvider');
  return ctx;
}
