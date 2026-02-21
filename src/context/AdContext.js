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
    image: 'https://picsum.photos/seed/billboard1/800/500',
    sector: 'Perakende',
    isOwn: false,
    campaignDetails: 'Bu kampanya 1-28 Şubat tarihleri arasında geçerlidir. Tüm mağazalarımızda geçerli olan bu indirimde, seçili ürünlerde %50\'ye varan fırsatlar sizi bekliyor. Kart ile ödemelerde ekstra %10 indirim!',
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
    image: 'https://picsum.photos/seed/billboard2/800/500',
    sector: 'Etkinlik',
    isOwn: false,
    campaignDetails: 'Etkinlik 22 Şubat Cumartesi saat 14:00\'te Çankaya Parkı\'nda başlayacaktır. Canlı müzik, yiyecek stantları ve çocuklar için aktiviteler olacak. Giriş ücretsizdir, kayıt için web sitemizi ziyaret edin.',
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
    image: 'https://picsum.photos/seed/billboard3/800/500',
    sector: 'Restoran',
    isOwn: false,
    campaignDetails: 'Etimesgut şubemiz açıldı! Açılışa özel ilk hafta tüm menüde %30 indirim. Aile menülerinde ek %15 indirim fırsatı. Paket siparişlerde ücretsiz teslimat. Adres: Etimesgut Bulvarı No:42.',
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
    image: 'https://picsum.photos/seed/billboard4/800/500',
    sector: 'Spor',
    isOwn: false,
    campaignDetails: 'Doğa yürüyüşü rotası: Keçiören Kalaba Parkı - Atatürk Ormanı (toplam 8 km). Buluşma noktası: Kalaba Parkı girişi, saat 09:00. Yanınızda su ve rahat ayakkabı getirmeyi unutmayın. Her yaş grubuna uygundur.',
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
    image: 'https://picsum.photos/seed/billboard5/800/500',
    sector: 'Teknoloji',
    isOwn: false,
    campaignDetails: 'Ankara Teknoloji Fuarı 2026, 1-3 Mart tarihlerinde ATO Congresium\'da düzenlenecektir. 200\'den fazla teknoloji firması katılacak. Öğrencilere özel ücretsiz giriş. Erken kayıt indirimi 28 Şubat\'a kadar geçerlidir.',
  },
];

// Kullanıcının kendi ilanları (profilde görünecek başlangıç verileri)
const DEFAULT_OWN_ADS = [
  {
    id: 'own-1',
    user: 'İsa Arslan',
    username: 'isaarslan',
    time: '15 Ocak 2026',
    location: 'Kızılay, Ankara',
    likes: '1.890',
    shares: '94',
    description: 'Premium billboard reklamımız Kızılay Meydanında yayında! Markamızı keşfedin.',
    image: 'https://picsum.photos/seed/myad1/800/500',
    sector: 'Reklam',
    isOwn: true,
    totalDays: '30',
    adDuration: '15 saniye',
    publishDate: '15 Ocak 2026',
    campaignDetails: 'Kızılay Meydanı\'ndaki premium billboard kampanyamız 30 gün boyunca yayında kalacaktır. Günde ortalama 50.000 kişiye ulaşılması hedeflenmektedir.',
  },
  {
    id: 'own-2',
    user: 'İsa Arslan',
    username: 'isaarslan',
    time: '10 Ocak 2026',
    location: 'Tunalı, Ankara',
    likes: '756',
    shares: '42',
    description: 'Tunalı Hilmi Caddesindeki billboard kampanyamız devam ediyor.',
    image: 'https://picsum.photos/seed/myad2/800/500',
    sector: 'Moda',
    isOwn: true,
    totalDays: '45',
    adDuration: '20 saniye',
    publishDate: '10 Ocak 2026',
    campaignDetails: 'Yaz koleksiyonu tanıtım kampanyamız Tunalı Hilmi Caddesi\'nin en işlek noktasında 45 gün süreyle yayınlanacaktır. Hedef kitle: 18-35 yaş arası moda tutkunları.',
  },
  {
    id: 'own-3',
    user: 'İsa Arslan',
    username: 'isaarslan',
    time: '5 Ocak 2026',
    location: 'Ulus, Ankara',
    likes: '324',
    shares: '18',
    description: 'Kış kampanyası billboard reklamımız Ulus Meydanında.',
    image: 'https://picsum.photos/seed/myad3/800/500',
    sector: 'Perakende',
    isOwn: true,
    totalDays: '14',
    adDuration: '10 saniye',
    publishDate: '5 Ocak 2026',
    campaignDetails: 'Kış sezonu özel indirimleri kampanyası. 2 hafta süreyle Ulus Meydanı\'nda yayında. Tüm kış ürünlerinde %40\'a varan indirimler.',
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
