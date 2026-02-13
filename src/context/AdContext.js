import React, { createContext, useContext, useState, useCallback } from 'react';

const AdContext = createContext(null);

// Varsayılan ilanlar (mock data)
const DEFAULT_ADS = [
  {
    id: '1',
    user: 'Ahmet Yılmaz',
    username: 'ahmetyilmaz',
    time: '7 gün önce',
    location: 'Gölbaşı, Ankara',
    likes: '2.345',
    shares: '117',
    description: 'Yeni sezon indirimlerimiz başladı! Tüm ürünlerde %50ye varan fırsatları kaçırmayın.',
    image: 'https://picsum.photos/seed/ad1/600/400',
    sector: 'Perakende',
    isOwn: false,
  },
  {
    id: '2',
    user: 'Sıla Torun',
    username: 'silatorun',
    time: '3 gün önce',
    location: 'Çankaya, Ankara',
    likes: '1.203',
    shares: '89',
    description: 'Hafta sonu etkinliğimize herkesi bekliyoruz!',
    image: 'https://picsum.photos/seed/ad2/600/400',
    sector: 'Etkinlik',
    isOwn: false,
  },
  {
    id: '3',
    user: 'Mehmet Kaya',
    username: 'mehmetkaya',
    time: '1 gün önce',
    location: 'Etimesgut, Ankara',
    likes: '567',
    shares: '34',
    description: 'Yeni açılan şubemize özel kampanyalar devam ediyor.',
    image: 'https://picsum.photos/seed/ad3/600/400',
    sector: 'Restoran',
    isOwn: false,
  },
  {
    id: '4',
    user: 'Elif Demir',
    username: 'elifdemir',
    time: '5 saat önce',
    location: 'Keçiören, Ankara',
    likes: '890',
    shares: '56',
    description: 'Doğa yürüyüşü etkinliğimiz bu cumartesi! Katılım ücretsiz.',
    image: 'https://picsum.photos/seed/ad4/600/400',
    sector: 'Spor',
    isOwn: false,
  },
  {
    id: '5',
    user: 'Can Özkan',
    username: 'canozkan',
    time: '2 saat önce',
    location: 'Mamak, Ankara',
    likes: '432',
    shares: '21',
    description: 'Teknoloji fuarı için son kayıt tarihi yarın!',
    image: 'https://picsum.photos/seed/ad5/600/400',
    sector: 'Teknoloji',
    isOwn: false,
  },
];

// Kullanıcının kendi ilanları (profilde görünecek başlangıç verileri)
const DEFAULT_OWN_ADS = [
  {
    id: 'own-1',
    user: 'Günay Akay',
    username: 'gunayakay',
    time: '15 Ocak 2026',
    location: 'Kızılay, Ankara',
    likes: '1.890',
    shares: '94',
    description: 'Premium billboard reklamımız Kızılay Meydanında yayında! Markamızı keşfedin.',
    image: 'https://picsum.photos/seed/own1/600/400',
    sector: 'Reklam',
    isOwn: true,
    totalDays: '30',
    adDuration: '15 saniye',
    publishDate: '15 Ocak 2026',
  },
  {
    id: 'own-2',
    user: 'Günay Akay',
    username: 'gunayakay',
    time: '10 Ocak 2026',
    location: 'Tunalı, Ankara',
    likes: '756',
    shares: '42',
    description: 'Tunalı Hilmi Caddesindeki billboard kampanyamız devam ediyor.',
    image: 'https://picsum.photos/seed/own2/600/400',
    sector: 'Moda',
    isOwn: true,
    totalDays: '45',
    adDuration: '20 saniye',
    publishDate: '10 Ocak 2026',
  },
  {
    id: 'own-3',
    user: 'Günay Akay',
    username: 'gunayakay',
    time: '5 Ocak 2026',
    location: 'Ulus, Ankara',
    likes: '324',
    shares: '18',
    description: 'Kış kampanyası billboard reklamımız Ulus Meydanında.',
    image: 'https://picsum.photos/seed/own3/600/400',
    sector: 'Perakende',
    isOwn: true,
    totalDays: '14',
    adDuration: '10 saniye',
    publishDate: '5 Ocak 2026',
  },
];

export function AdProvider({ children }) {
  const [ads, setAds] = useState(DEFAULT_ADS);
  const [ownAds, setOwnAds] = useState(DEFAULT_OWN_ADS);

  const addAd = useCallback((newAd) => {
    const id = `own-${Date.now()}`;
    const today = new Date();
    const dateStr = `${today.getDate()} ${['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'][today.getMonth()]} ${today.getFullYear()}`;

    const ad = {
      id,
      user: 'Günay Akay',
      username: 'gunayakay',
      time: 'Az önce',
      location: 'Ankara',
      likes: '0',
      shares: '0',
      description: newAd.title,
      image: newAd.image || `https://picsum.photos/seed/${id}/600/400`,
      sector: 'Genel',
      isOwn: true,
      totalDays: String(newAd.dates?.length || 1),
      adDuration: `${newAd.duration || 15} saniye`,
      publishDate: dateStr,
    };

    setOwnAds((prev) => [ad, ...prev]);
    setAds((prev) => [ad, ...prev]);

    return ad;
  }, []);

  // Tüm feed ilanları (yeni + eski)
  const allAds = ads;
  // Sadece kullanıcının kendi ilanları
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
