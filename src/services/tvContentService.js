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
let _snapshotActive = false; // onSnapshot calisiyor mu?

const notifyListeners = () => _listeners.forEach((fn) => fn());

/** onSnapshot'in aktif olup olmadigini dondur */
export function isSnapshotActive() {
  return _snapshotActive;
}

// ============================================================
// GERCEK ZAMANLI DINLEME (onSnapshot)
// ============================================================

/** Firestore dinlemelerini baslat */
export function startListening() {
  // TV Content dinle
  if (!_unsubContent) {
    try {
      const q = query(tvContentRef, orderBy('createdAt', 'desc'));
      _unsubContent = onSnapshot(q, (snapshot) => {
        _tvContents = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        _snapshotActive = true;
        notifyListeners();
      }, (error) => {
        console.warn('tvContent dinleme hatasi (orderBy):', error);
        _snapshotActive = false;
        // orderBy index yoksa index'siz dene
        _unsubContent = onSnapshot(tvContentRef, (snapshot) => {
          _tvContents = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
          _snapshotActive = true;
          notifyListeners();
        }, (err2) => {
          console.warn('tvContent dinleme hatasi (fallback):', err2);
          _snapshotActive = false;
        });
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
      console.warn('tvPanels dinleme hatasi:', error);
    });
  }
}

/** Dinlemeleri durdur */
export function stopListening() {
  if (_unsubContent) { _unsubContent(); _unsubContent = null; }
  if (_unsubPanels) { _unsubPanels(); _unsubPanels = null; }
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
    // Zaten HTTP URL ise aynen dondur
    if (imageUri.startsWith('http://') || imageUri.startsWith('https://')) {
      return imageUri;
    }
    // Base64 data URI ise direkt Firestore'a kaydet (Storage gereksiz)
    if (imageUri.startsWith('data:')) {
      return imageUri;
    }
    // Blob veya file URI ise Storage'a yukle
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

  try {
    // Ayni panodaki eski playing/approved icerikleri completed yap
    const oldContents = _tvContents.filter(
      (c) => String(c.panelId) === panelId && (c.status === 'playing' || c.status === 'approved')
    );
    for (const old of oldContents) {
      await updateDoc(doc(tvContentRef, old.id), { status: 'completed' }).catch(() => {});
    }

    await setDoc(doc(tvContentRef, contentId), content);

    // Panelin mevcut icerigini ve durumunu guncelle (setDoc+merge: dokuman yoksa olusturur)
    await setDoc(doc(tvPanelsRef, panelId), {
      currentContentId: contentId,
      status: 'online',
      lastHeartbeat: Date.now(),
    }, { merge: true }).catch(() => {});

    // Lokal cache'i hemen guncelle (onSnapshot gecikmesini bekleme)
    _tvContents = _tvContents
      .map((c) => (String(c.panelId) === panelId && (c.status === 'playing' || c.status === 'approved'))
        ? { ...c, status: 'completed' } : c);
    _tvContents = [{ id: contentId, ...content }, ..._tvContents];
    notifyListeners();

    return { id: contentId, ...content };
  } catch (error) {
    console.warn('pushContentToTV hatasi:', error);
    _tvContents = [{ id: contentId, ...content }, ..._tvContents];
    notifyListeners();
    return { id: contentId, ...content };
  }
}

/** Icerigi TV'de oynatmaya basla */
export async function startPlayingContent(contentId) {
  try {
    await updateDoc(doc(tvContentRef, contentId), { status: 'playing' });

    // Icerigin panelini de guncelle
    const content = _tvContents.find((c) => c.id === contentId);
    if (content) {
      await updateDoc(doc(tvPanelsRef, content.panelId), {
        currentContentId: contentId,
        status: 'online',
      }).catch(() => {});
    }
  } catch (error) {
    console.warn('startPlayingContent hatasi:', error);
    _tvContents = _tvContents.map((c) =>
      c.id === contentId ? { ...c, status: 'playing' } : c
    );
    notifyListeners();
  }
}

/** Icerigi tamamla */
export async function completeContent(contentId) {
  try {
    await updateDoc(doc(tvContentRef, contentId), { status: 'completed' });
  } catch (error) {
    console.warn('completeContent hatasi:', error);
    _tvContents = _tvContents.map((c) =>
      c.id === contentId ? { ...c, status: 'completed' } : c
    );
    notifyListeners();
  }
}

/** Icerigi kaldir/iptal et */
export async function removeContent(contentId) {
  try {
    const content = _tvContents.find((c) => c.id === contentId);
    await deleteDoc(doc(tvContentRef, contentId));

    // Panodaki mevcut icerigi temizle
    if (content) {
      await updateDoc(doc(tvPanelsRef, content.panelId), {
        currentContentId: null,
      }).catch(() => {});
    }
  } catch (error) {
    console.warn('removeContent hatasi:', error);
    _tvContents = _tvContents.filter((c) => c.id !== contentId);
    notifyListeners();
  }
}

// ============================================================
// TV PANO ISLEMLERI
// ============================================================

/** Pano kaydet veya guncelle (TV ilk acildiginda) */
export async function registerPanel(panelId, panelData) {
  try {
    await setDoc(doc(tvPanelsRef, panelId), {
      name: panelData.name || `Panel ${panelId}`,
      location: panelData.location || '',
      status: 'online',
      lastHeartbeat: Date.now(),
      currentContentId: null,
      resolution: panelData.resolution || '1920x1080',
      ...panelData,
    }, { merge: true });
  } catch (error) {
    console.warn('registerPanel hatasi:', error);
  }
}

/** Pano heartbeat gonder (TV her 30 saniyede bir cagirsin) */
export async function updatePanelHeartbeat(panelId) {
  try {
    await updateDoc(doc(tvPanelsRef, panelId), {
      status: 'online',
      lastHeartbeat: Date.now(),
    });
  } catch (error) {
    console.warn('updatePanelHeartbeat hatasi:', error);
  }
}

/** Panoya su anda oynatilan icerigi kaydet */
export async function updatePanelCurrentContent(panelId, contentId) {
  try {
    await updateDoc(doc(tvPanelsRef, panelId), {
      currentContentId: contentId,
      lastHeartbeat: Date.now(),
    });
  } catch (error) {
    console.warn('updatePanelCurrentContent hatasi:', error);
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
  if (_panelsInitialized) return;
  _panelsInitialized = true;
  try {
    // Eger onSnapshot zaten panel verisi getirdiyse tekrar sorgu yapma
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
    _panelsInitialized = false; // Hata olursa tekrar denenebilsin
    console.warn('initializeDefaultPanels hatasi:', error);
  }
}

// Uygulama basladiginda varsayilan panolari olustur
initializeDefaultPanels();

// ============================================================
// VERI OKUMA
// ============================================================

/** Firestore'dan direkt oku (snapshot calismiyorsa fallback) */
export async function fetchContentsDirectly() {
  try {
    const snapshot = await getDocs(tvContentRef);
    _tvContents = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    notifyListeners();
    return _tvContents;
  } catch (error) {
    console.warn('fetchContentsDirectly hatasi:', error);
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
