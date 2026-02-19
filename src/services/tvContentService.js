/**
 * TV Icerik Servisi - Firebase Firestore Entegrasyonu
 *
 * Firestore Yapisi:
 *   tvContent/{contentId}  - Yayinlanacak reklam icerikleri
 *   tvPanels/{panelId}     - Fiziksel pano/TV cihaz durumlari
 *
 * Admin onayladiginda icerik Firestore'a yazilir,
 * TV Display ekrani onSnapshot ile gercek zamanli dinler.
 */

import { db, storage } from '../config/firebase';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Koleksiyon referanslari
const tvContentRef = collection(db, 'tvContent');
const tvPanelsRef = collection(db, 'tvPanels');

// Lokal cache (snapshot'lardan guncellenir)
let _tvContents = [];
let _tvPanels = [];
let _listeners = [];
let _unsubContent = null;
let _unsubPanels = null;
let _snapshotActive = false;
let _quotaExceeded = false;
let _retryTimer = null;

const notifyListeners = () => _listeners.forEach((fn) => fn());

/** Hata quota hatasi mi kontrol et */
function isQuotaError(error) {
  const msg = String(error?.message || error?.code || '');
  return msg.includes('resource-exhausted') || msg.includes('quota') || msg.includes('Quota');
}

/** Quota asildiginda tum dinlemeleri durdur ve gecikmeli tekrar dene */
function handleQuotaExceeded() {
  if (_quotaExceeded) return;
  _quotaExceeded = true;
  console.warn('Firebase kotasi asildi - 2 dakika sonra tekrar denenecek');
  stopListening();
  if (_retryTimer) clearTimeout(_retryTimer);
  _retryTimer = setTimeout(() => {
    _quotaExceeded = false;
    console.log('Firebase baglantisi tekrar deneniyor...');
    startListening();
  }, 120000); // 2 dakika bekle
}

/** onSnapshot'in aktif olup olmadigini dondur */
export function isSnapshotActive() {
  return _snapshotActive;
}

// ============================================================
// GERCEK ZAMANLI DINLEME (onSnapshot)
// ============================================================

/** Firestore dinlemelerini baslat */
export function startListening() {
  if (_quotaExceeded) return;

  // TV Content dinle
  if (!_unsubContent) {
    try {
      // Basit sorgu ile basla (index gerektirmez)
      _unsubContent = onSnapshot(tvContentRef, (snapshot) => {
        _tvContents = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        _snapshotActive = true;
        _quotaExceeded = false;
        notifyListeners();
      }, (error) => {
        console.warn('tvContent dinleme hatasi:', error.message);
        _snapshotActive = false;

        if (isQuotaError(error)) {
          handleQuotaExceeded();
          return;
        }

        // Hata durumunda direkt okuma yap (tek seferlik)
        fetchContentsDirectly().catch(() => {});
      });
    } catch (e) {
      console.warn('tvContent listener kurulum hatasi:', e);
      _snapshotActive = false;
    }
  }

  // TV Panels dinle
  if (!_unsubPanels) {
    _unsubPanels = onSnapshot(tvPanelsRef, (snapshot) => {
      _tvPanels = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      notifyListeners();
    }, (error) => {
      console.warn('tvPanels dinleme hatasi:', error.message);
      if (isQuotaError(error)) handleQuotaExceeded();
    });
  }
}

/** Dinlemeleri durdur */
export function stopListening() {
  if (_unsubContent) { _unsubContent(); _unsubContent = null; }
  if (_unsubPanels) { _unsubPanels(); _unsubPanels = null; }
  _snapshotActive = false;
}

// Uygulama basladiginda dinlemeyi otomatik baslat
startListening();

// ============================================================
// TV ICERIK ISLEMLERI
// ============================================================

/** Resmi Firebase Storage'a yukle ve download URL'ini dondur */
async function uploadImageToStorage(imageUri, contentId) {
  try {
    if (!imageUri) return null;
    if (imageUri.startsWith('http://') || imageUri.startsWith('https://')) {
      return imageUri;
    }
    if (imageUri.startsWith('data:')) {
      return imageUri;
    }
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const storageRef = ref(storage, `tvContent/${contentId}.jpg`);
    await uploadBytes(storageRef, blob);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  } catch (error) {
    console.warn('Resim yukleme hatasi:', error);
    return imageUri;
  }
}

/** Onaylanan siparisi TV icin icerik olarak Firestore'a yaz ve direkt oynat */
export async function pushContentToTV(order) {
  const contentId = `tv-${Date.now()}`;
  const mediaUrl = await uploadImageToStorage(order.adImage, contentId);
  const panelId = String(order.panel.id);
  const content = {
    orderId: order.id,
    adTitle: order.adTitle,
    mediaUrl: mediaUrl || order.adImage,
    mediaType: 'image',
    panelId: panelId,
    panelName: order.panel.name,
    duration: parseInt(order.adDuration) || 15,
    scheduledDates: order.dates || [],
    status: 'playing',
    createdAt: Date.now(),
    approvedAt: Date.now(),
  };

  // Lokal cache'i hemen guncelle (UI aninda gorsun)
  _tvContents = _tvContents
    .map((c) => (String(c.panelId) === panelId && (c.status === 'playing' || c.status === 'approved'))
      ? { ...c, status: 'completed' } : c);
  _tvContents = [{ id: contentId, ...content }, ..._tvContents];
  notifyListeners();

  try {
    // Ayni panodaki eski playing/approved icerikleri completed yap
    const oldContents = _tvContents.filter(
      (c) => c.id !== contentId && String(c.panelId) === panelId && (c.status === 'playing' || c.status === 'approved')
    );
    for (const old of oldContents) {
      await updateDoc(doc(tvContentRef, old.id), { status: 'completed' }).catch(() => {});
    }

    await setDoc(doc(tvContentRef, contentId), content);

    // Panelin mevcut icerigini ve durumunu guncelle
    await setDoc(doc(tvPanelsRef, panelId), {
      currentContentId: contentId,
      status: 'online',
      lastHeartbeat: Date.now(),
    }, { merge: true }).catch(() => {});

    return { id: contentId, ...content };
  } catch (error) {
    console.warn('pushContentToTV hatasi:', error);
    if (isQuotaError(error)) handleQuotaExceeded();
    // Lokal cache zaten guncellendi, Firestore yazamasa bile UI calisir
    return { id: contentId, ...content };
  }
}

/** Icerigi TV'de oynatmaya basla */
export async function startPlayingContent(contentId) {
  // Lokal cache hemen guncelle
  _tvContents = _tvContents.map((c) =>
    c.id === contentId ? { ...c, status: 'playing' } : c
  );
  notifyListeners();

  try {
    await updateDoc(doc(tvContentRef, contentId), { status: 'playing' });
    const content = _tvContents.find((c) => c.id === contentId);
    if (content) {
      await updateDoc(doc(tvPanelsRef, content.panelId), {
        currentContentId: contentId,
        status: 'online',
      }).catch(() => {});
    }
  } catch (error) {
    console.warn('startPlayingContent hatasi:', error);
    if (isQuotaError(error)) handleQuotaExceeded();
  }
}

/** Icerigi tamamla */
export async function completeContent(contentId) {
  _tvContents = _tvContents.map((c) =>
    c.id === contentId ? { ...c, status: 'completed' } : c
  );
  notifyListeners();

  try {
    await updateDoc(doc(tvContentRef, contentId), { status: 'completed' });
  } catch (error) {
    console.warn('completeContent hatasi:', error);
    if (isQuotaError(error)) handleQuotaExceeded();
  }
}

/** Icerigi kaldir/iptal et */
export async function removeContent(contentId) {
  const content = _tvContents.find((c) => c.id === contentId);
  _tvContents = _tvContents.filter((c) => c.id !== contentId);
  notifyListeners();

  try {
    await deleteDoc(doc(tvContentRef, contentId));
    if (content) {
      await updateDoc(doc(tvPanelsRef, content.panelId), {
        currentContentId: null,
      }).catch(() => {});
    }
  } catch (error) {
    console.warn('removeContent hatasi:', error);
    if (isQuotaError(error)) handleQuotaExceeded();
  }
}

// ============================================================
// TV PANO ISLEMLERI
// ============================================================

/** Pano kaydet veya guncelle (TV ilk acildiginda) */
export async function registerPanel(panelId, panelData) {
  if (_quotaExceeded) return;
  try {
    // currentContentId'yi silmeyelim - admin atamis olabilir
    const data = {
      name: panelData.name || `Panel ${panelId}`,
      location: panelData.location || '',
      status: 'online',
      lastHeartbeat: Date.now(),
      resolution: panelData.resolution || '1920x1080',
      ...panelData,
    };
    await setDoc(doc(tvPanelsRef, panelId), data, { merge: true });
  } catch (error) {
    console.warn('registerPanel hatasi:', error);
    if (isQuotaError(error)) handleQuotaExceeded();
  }
}

/** Pano heartbeat gonder */
export async function updatePanelHeartbeat(panelId) {
  if (_quotaExceeded) return;
  try {
    await updateDoc(doc(tvPanelsRef, panelId), {
      status: 'online',
      lastHeartbeat: Date.now(),
    });
  } catch (error) {
    console.warn('updatePanelHeartbeat hatasi:', error);
    if (isQuotaError(error)) handleQuotaExceeded();
  }
}

/** Panoya su anda oynatilan icerigi kaydet */
export async function updatePanelCurrentContent(panelId, contentId) {
  if (_quotaExceeded) return;
  try {
    await updateDoc(doc(tvPanelsRef, panelId), {
      currentContentId: contentId,
      lastHeartbeat: Date.now(),
    });
  } catch (error) {
    console.warn('updatePanelCurrentContent hatasi:', error);
    if (isQuotaError(error)) handleQuotaExceeded();
  }
}

// ============================================================
// VARSAYILAN PANOLARI OLUSTUR (ilk kurulumda)
// ============================================================

const DEFAULT_PANELS = [
  { id: '1', name: 'Kızılay Meydanı', location: 'Kızılay, Ankara', resolution: '1920x1080' },
  { id: '2', name: 'Tunalı Hilmi Caddesi', location: 'Çankaya, Ankara', resolution: '1920x1080' },
  { id: '3', name: 'Ulus Meydanı', location: 'Altındağ, Ankara', resolution: '1920x1080' },
  { id: '4', name: 'Bahçelievler AVM Girişi', location: 'Çankaya, Ankara', resolution: '1920x1080' },
  { id: '5', name: 'Batıkent Metro Çıkışı', location: 'Yenimahalle, Ankara', resolution: '1920x1080' },
  { id: '6', name: 'Gölbaşı Sahil Yolu', location: 'Gölbaşı, Ankara', resolution: '1920x1080' },
];

let _panelsInitialized = false;
export async function initializeDefaultPanels() {
  if (_panelsInitialized || _quotaExceeded) return;
  _panelsInitialized = true;
  try {
    if (_tvPanels.length > 0) return;
    const snapshot = await getDocs(tvPanelsRef);
    if (snapshot.empty) {
      for (const panel of DEFAULT_PANELS) {
        await setDoc(doc(tvPanelsRef, panel.id), {
          ...panel,
          status: 'offline',
          lastHeartbeat: 0,
          currentContentId: null,
        });
      }
      console.log('Varsayilan panolar olusturuldu');
    }
  } catch (error) {
    _panelsInitialized = false;
    console.warn('initializeDefaultPanels hatasi:', error);
    if (isQuotaError(error)) handleQuotaExceeded();
  }
}

// Panolari 3 saniye gecikmeyle olustur (baslangic yukunu azalt)
setTimeout(() => initializeDefaultPanels(), 3000);

// ============================================================
// VERI OKUMA
// ============================================================

/** Firestore'dan direkt oku (snapshot calismiyorsa fallback) */
export async function fetchContentsDirectly() {
  if (_quotaExceeded) return _tvContents;
  try {
    const snapshot = await getDocs(tvContentRef);
    _tvContents = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    notifyListeners();
    return _tvContents;
  } catch (error) {
    console.warn('fetchContentsDirectly hatasi:', error);
    if (isQuotaError(error)) handleQuotaExceeded();
    return _tvContents;
  }
}

/** Tum TV iceriklerini getir (cache'den) */
export function getTvContents() {
  return [..._tvContents];
}

/** Belirli panoya ait icerikleri getir */
export function getContentsByPanel(panelId) {
  const pid = String(panelId);
  return _tvContents.filter((c) => String(c.panelId) === pid);
}

/** Belirli panoya ait aktif (oynatilacak) icerikleri getir */
export function getActiveContentsByPanel(panelId) {
  const pid = String(panelId);
  return _tvContents.filter(
    (c) => String(c.panelId) === pid && (c.status === 'approved' || c.status === 'playing')
  );
}

/** Tum pano durumlarini getir (cache'den) */
export function getTvPanels() {
  return _tvPanels.map((p) => {
    const isOnline = Date.now() - (p.lastHeartbeat || 0) < 300000;
    return { ...p, status: isOnline ? 'online' : 'offline' };
  });
}

/** Degisiklikleri dinle (basit observer pattern - UI icin) */
export function subscribe(listener) {
  _listeners.push(listener);
  return () => {
    _listeners = _listeners.filter((fn) => fn !== listener);
  };
}
