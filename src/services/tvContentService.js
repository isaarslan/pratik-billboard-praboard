/**
 * TV Icerik Servisi
 *
 * Mobil/Web'den reklam icerigini Firebase'e yukler,
 * Android TV cihazlari icin Firestore'da planlama kayitlari olusturur.
 *
 * Firestore Yapisi:
 *   tvContent/{contentId}  - Yayinlanacak reklam icerikleri
 *   tvPanels/{panelId}     - Fiziksel pano/TV cihaz durumlari
 *
 * Firebase kurulmadan once lokal mock veri ile calisir.
 */

import { db, storage } from '../config/firebase';

let firebaseReady = false;
try {
  // Firebase config gecerli mi kontrol et
  if (db && storage) firebaseReady = true;
} catch {
  firebaseReady = false;
}

// ============================================================
// LOKAL MOCK STORE (Firebase kurulmadan MVP demo icin)
// ============================================================
let mockTvContents = [
  {
    id: 'tv-001',
    orderId: 'ORD-20260115-001',
    adTitle: 'Premium billboard reklamımız Kızılay Meydanında yayında!',
    mediaUrl: 'https://picsum.photos/seed/myad1/1920/1080',
    mediaType: 'image',
    panelId: '1',
    panelName: 'Kızılay Meydanı',
    duration: 15,
    scheduledDates: ['15 Ocak 2026 10:00', '16 Ocak 2026 10:00', '17 Ocak 2026 10:00'],
    status: 'playing', // pending, approved, playing, completed, rejected
    createdAt: Date.now() - 86400000,
    approvedAt: Date.now() - 80000000,
  },
];

let mockTvPanels = [
  {
    id: '1',
    name: 'Kızılay Meydanı',
    location: 'Kızılay, Ankara',
    status: 'online',
    lastHeartbeat: Date.now(),
    currentContentId: 'tv-001',
    resolution: '1920x1080',
  },
  {
    id: '2',
    name: 'Tunalı Hilmi Caddesi',
    location: 'Çankaya, Ankara',
    status: 'online',
    lastHeartbeat: Date.now(),
    currentContentId: null,
    resolution: '1920x1080',
  },
  {
    id: '4',
    name: 'Bahçelievler AVM Girişi',
    location: 'Çankaya, Ankara',
    status: 'offline',
    lastHeartbeat: Date.now() - 3600000,
    currentContentId: null,
    resolution: '1920x1080',
  },
];

let _listeners = [];
const notifyListeners = () => _listeners.forEach((fn) => fn());

// ============================================================
// TV ICERIK ISLEMLERI
// ============================================================

/** Onaylanan siparisi TV icin icerik olarak ekle */
export function pushContentToTV(order) {
  const contentId = `tv-${Date.now()}`;
  const content = {
    id: contentId,
    orderId: order.id,
    adTitle: order.adTitle,
    mediaUrl: order.adImage,
    mediaType: 'image',
    panelId: order.panel.id,
    panelName: order.panel.name,
    duration: parseInt(order.adDuration) || 15,
    scheduledDates: order.dates || [],
    status: 'approved',
    createdAt: Date.now(),
    approvedAt: Date.now(),
  };

  mockTvContents = [content, ...mockTvContents];
  notifyListeners();
  return content;
}

/** Icerigi TV'de oynatmaya basla */
export function startPlayingContent(contentId) {
  mockTvContents = mockTvContents.map((c) =>
    c.id === contentId ? { ...c, status: 'playing' } : c
  );

  // Panoya atanmis icerigi guncelle
  const content = mockTvContents.find((c) => c.id === contentId);
  if (content) {
    mockTvPanels = mockTvPanels.map((p) =>
      p.id === content.panelId ? { ...p, currentContentId: contentId, status: 'online' } : p
    );
  }
  notifyListeners();
}

/** Icerigi tamamla */
export function completeContent(contentId) {
  mockTvContents = mockTvContents.map((c) =>
    c.id === contentId ? { ...c, status: 'completed' } : c
  );
  notifyListeners();
}

/** Icerigi kaldir/iptal et */
export function removeContent(contentId) {
  const content = mockTvContents.find((c) => c.id === contentId);
  mockTvContents = mockTvContents.filter((c) => c.id !== contentId);

  // Panodaki mevcut icerigi temizle
  if (content) {
    mockTvPanels = mockTvPanels.map((p) =>
      p.currentContentId === contentId ? { ...p, currentContentId: null } : p
    );
  }
  notifyListeners();
}

// ============================================================
// TV PANO ISLEMLERI
// ============================================================

/** Pano durumunu guncelle (TV cihazindan heartbeat) */
export function updatePanelHeartbeat(panelId) {
  mockTvPanels = mockTvPanels.map((p) =>
    p.id === panelId ? { ...p, status: 'online', lastHeartbeat: Date.now() } : p
  );
  notifyListeners();
}

// ============================================================
// VERI OKUMA
// ============================================================

/** Tum TV iceriklerini getir */
export function getTvContents() {
  return [...mockTvContents];
}

/** Belirli panoya ait icerikleri getir */
export function getContentsByPanel(panelId) {
  return mockTvContents.filter((c) => c.panelId === panelId);
}

/** Tum pano durumlarini getir */
export function getTvPanels() {
  return mockTvPanels.map((p) => {
    // 5 dakikadan fazla heartbeat yoksa offline say
    const isOnline = Date.now() - p.lastHeartbeat < 300000;
    return { ...p, status: isOnline ? 'online' : 'offline' };
  });
}

/** Degisiklikleri dinle (basit observer pattern) */
export function subscribe(listener) {
  _listeners.push(listener);
  return () => {
    _listeners = _listeners.filter((fn) => fn !== listener);
  };
}
