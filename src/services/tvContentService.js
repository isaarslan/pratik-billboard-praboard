/**
 * TV Icerik Servisi - Supabase Entegrasyonu
 *
 * Supabase Tablolari:
 *   tv_contents  - Yayinlanacak reklam icerikleri
 *   tv_panels    - Fiziksel pano/TV cihaz durumlari
 *
 * Admin onayladiginda icerik Supabase'e yazilir,
 * TV Display ekrani Realtime subscription ile gercek zamanli dinler.
 */

import { supabase } from '../config/supabase';

// Lokal cache (realtime'dan guncellenir)
let _tvContents = [];
let _tvPanels = [];
let _listeners = [];
let _contentSubscription = null;
let _panelsSubscription = null;
let _snapshotActive = false;
let _retryTimer = null;

// Panel isim → string ID haritasi (hardcoded fallback)
const PANEL_NAME_TO_ID = {
  'Kızılay Meydanı': '1',
  'Tunalı Hilmi Caddesi': '2',
  'Ulus Meydanı': '3',
  'Bahçelievler AVM Girişi': '4',
  'Batıkent Metro Çıkışı': '5',
  'Gölbaşı Sahil Yolu': '6',
};

const notifyListeners = () => _listeners.forEach((fn) => fn());

/** Supabase Realtime aktif mi */
export function isSnapshotActive() {
  return _snapshotActive;
}

// ============================================================
// GERCEK ZAMANLI DINLEME (Supabase Realtime)
// ============================================================

/** Supabase Realtime dinlemelerini baslat */
export function startListening() {
  // TV Content dinle
  if (!_contentSubscription) {
    _contentSubscription = supabase
      .channel('tv_contents_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tv_contents' }, (payload) => {
        handleContentChange(payload);
      })
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          _snapshotActive = true;
          fetchContentsDirectly().catch(() => {});
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.warn('[TVContent] Realtime baglanti basarisiz, lokal veriyle devam ediliyor.');
          _snapshotActive = false;
          // Kanal temizle ki tekrar denemede yeni kanal acilsin
          if (_contentSubscription) {
            supabase.removeChannel(_contentSubscription);
            _contentSubscription = null;
          }
        }
      });
  }

  // TV Panels dinle
  if (!_panelsSubscription) {
    _panelsSubscription = supabase
      .channel('tv_panels_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tv_panels' }, (payload) => {
        handlePanelChange(payload);
      })
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          fetchPanelsDirectly().catch(() => {});
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.warn('[TVPanels] Realtime baglanti basarisiz, lokal veriyle devam ediliyor.');
          if (_panelsSubscription) {
            supabase.removeChannel(_panelsSubscription);
            _panelsSubscription = null;
          }
        }
      });
  }
}

/** Realtime degisiklik handler - tv_contents */
function handleContentChange(payload) {
  // Supabase JS v2: eventType dogrudan payload uzerinde
  const eventType = payload.eventType || payload.type;
  const newRow = payload.new;
  const oldRow = payload.old;

  if (eventType === 'INSERT') {
    const mapped = mapContentRow(newRow);
    if (!_tvContents.find((c) => c.id === mapped.id)) {
      _tvContents = [mapped, ..._tvContents];
    }
  } else if (eventType === 'UPDATE') {
    const mapped = mapContentRow(newRow);
    const exists = _tvContents.find((c) => c.id === mapped.id);
    if (exists) {
      _tvContents = _tvContents.map((c) => (c.id === mapped.id ? mapped : c));
    } else {
      // Bazen UPDATE ilk fetch'ten once gelebilir
      _tvContents = [mapped, ..._tvContents];
    }
  } else if (eventType === 'DELETE') {
    const deleteId = oldRow?.id || newRow?.id;
    if (deleteId) {
      _tvContents = _tvContents.filter((c) => c.id !== deleteId);
    }
  }

  notifyListeners();
}

/** Realtime degisiklik handler - tv_panels */
function handlePanelChange(payload) {
  const eventType = payload.eventType || payload.type;
  const newRow = payload.new;
  const oldRow = payload.old;

  if (eventType === 'INSERT') {
    const mapped = mapPanelRow(newRow);
    if (!_tvPanels.find((p) => p.id === mapped.id)) {
      _tvPanels = [..._tvPanels, mapped];
    }
  } else if (eventType === 'UPDATE') {
    const mapped = mapPanelRow(newRow);
    _tvPanels = _tvPanels.map((p) => (p.id === mapped.id ? mapped : p));
  } else if (eventType === 'DELETE') {
    const deleteId = oldRow?.id || newRow?.id;
    if (deleteId) {
      _tvPanels = _tvPanels.filter((p) => p.id !== deleteId);
    }
  }

  notifyListeners();
}

/** Supabase satir → uygulama formati (tv_contents) */
function mapContentRow(row) {
  return {
    id: row.id,
    orderId: row.order_id,
    adTitle: row.ad_title,
    mediaUrl: row.media_url,
    mediaType: row.media_type,
    panelId: row.panel_id,
    panelName: row.panel_name,
    duration: row.duration,
    scheduledDates: row.scheduled_dates || [],
    status: row.status,
    createdAt: row.created_at,
    approvedAt: row.approved_at,
  };
}

/** Supabase satir → uygulama formati (tv_panels) */
function mapPanelRow(row) {
  return {
    id: row.id,
    name: row.name,
    location: row.location,
    status: row.status,
    lastHeartbeat: row.last_heartbeat,
    currentContentId: row.current_content_id,
    resolution: row.resolution,
  };
}

/** Dinlemeleri durdur */
export function stopListening() {
  if (_contentSubscription) {
    supabase.removeChannel(_contentSubscription);
    _contentSubscription = null;
  }
  if (_panelsSubscription) {
    supabase.removeChannel(_panelsSubscription);
    _panelsSubscription = null;
  }
  _snapshotActive = false;
}

// Uygulama basladiginda dinlemeyi otomatik baslat
startListening();

// ============================================================
// PANEL ID COZUMLEME YARDIMCILARI
// ============================================================

/**
 * Panel ismi ile string ID ('1','2',...) arasindaki eslestirmeyi bul.
 * 3 katmanli: Supabase → lokal cache → hardcoded harita
 */
async function resolveToTvPanelId(orderPanel) {
  const panelName = orderPanel?.name;
  if (!panelName) return null;

  const normalizedName = panelName.trim().toLowerCase();

  // 1) Supabase'den sorgula
  try {
    const { data: tvPanel } = await supabase
      .from('tv_panels')
      .select('id, name')
      .eq('name', panelName)
      .limit(1)
      .maybeSingle();

    if (tvPanel) return String(tvPanel.id);

    // Tam esleme bulunamazsa, tum panelleri cek
    const { data: allPanels } = await supabase
      .from('tv_panels')
      .select('id, name');

    if (allPanels && allPanels.length > 0) {
      const match = allPanels.find(
        (p) => p.name && p.name.trim().toLowerCase() === normalizedName
      );
      if (match) return String(match.id);
    }
  } catch (err) {
    console.warn('resolveToTvPanelId DB hatasi:', err.message);
  }

  // 2) Lokal cache'den bul
  const cachedPanel = _tvPanels.find(
    (p) => p.name && p.name.trim().toLowerCase() === normalizedName
  );
  if (cachedPanel) return String(cachedPanel.id);

  // 3) Hardcoded haritadan bul (son care - DB/cache bos olsa bile calisir)
  const hardcodedId = PANEL_NAME_TO_ID[panelName];
  if (hardcodedId) return hardcodedId;

  // Hardcoded haritada case-insensitive ara
  const hardcodedMatch = Object.entries(PANEL_NAME_TO_ID).find(
    ([name]) => name.trim().toLowerCase() === normalizedName
  );
  if (hardcodedMatch) return hardcodedMatch[1];

  return null;
}

/**
 * Bir panelId (string '1','2' vb.) icin panel ismini bul.
 * TV display ekraninda kullanilir.
 */
function getPanelNameById(panelId) {
  const pid = String(panelId);

  // Lokal cache'den
  const panel = _tvPanels.find((p) => String(p.id) === pid);
  if (panel?.name) return panel.name;

  // Hardcoded haritadan (ters cevir)
  const entry = Object.entries(PANEL_NAME_TO_ID).find(([, id]) => id === pid);
  if (entry) return entry[0];

  return null;
}

// ============================================================
// TV ICERIK ISLEMLERI
// ============================================================

/** Medyayi (gorsel veya video) Supabase Storage'a yukle ve public URL'ini dondur */
async function uploadMediaToStorage(mediaUri, contentId, mediaType) {
  try {
    if (!mediaUri) return null;
    if (mediaUri.startsWith('http://') || mediaUri.startsWith('https://')) {
      return mediaUri;
    }
    if (mediaUri.startsWith('data:')) {
      return mediaUri;
    }

    const isVideo = mediaType === 'video';
    const ext = isVideo ? 'mp4' : 'jpg';
    const contentType = isVideo ? 'video/mp4' : 'image/jpeg';

    const response = await fetch(mediaUri);
    const blob = await response.blob();
    const filePath = `${contentId}.${ext}`;

    const { error } = await supabase.storage
      .from('tv-content')
      .upload(filePath, blob, { contentType, upsert: true });

    if (error) {
      console.warn('Supabase Storage yukleme hatasi:', error.message);
      return mediaUri;
    }

    const { data } = supabase.storage
      .from('tv-content')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.warn('Medya yukleme hatasi:', error);
    return mediaUri;
  }
}

/** Onaylanan siparisi TV icin icerik olarak Supabase'e yaz ve direkt oynat */
export async function pushContentToTV(order) {
  const contentId = `tv-${Date.now()}`;
  const orderMediaType = order.mediaType || 'image';
  const mediaUrl = await uploadMediaToStorage(order.adImage, contentId, orderMediaType);

  // Panel UUID'sini tv_panels string ID'sine cevir (ornek: UUID → '1')
  const tvPanelId = await resolveToTvPanelId(order.panel);
  if (!tvPanelId) {
    console.warn('pushContentToTV: tv_panels\'da panel bulunamadi:', order.panel?.name);
  }
  const panelId = tvPanelId || String(order.panel.id);
  const panelName = order.panel?.name || '';

  const content = {
    orderId: order.id,
    adTitle: order.adTitle,
    mediaUrl: mediaUrl || order.adImage,
    mediaType: orderMediaType,
    panelId: panelId,
    panelName: panelName,
    duration: parseInt(order.adDuration) || 15,
    scheduledDates: order.dates || [],
    status: 'playing',
    createdAt: Date.now(),
    approvedAt: Date.now(),
  };

  // Lokal cache'i hemen guncelle (UI aninda gorsun)
  _tvContents = _tvContents
    .map((c) => {
      const samePanel = String(c.panelId) === panelId || (panelName && c.panelName === panelName);
      return (samePanel && (c.status === 'playing' || c.status === 'approved'))
        ? { ...c, status: 'completed' } : c;
    });
  _tvContents = [{ id: contentId, ...content }, ..._tvContents];
  notifyListeners();

  try {
    // ADIM 1: Ayni panodaki TUM eski playing/approved icerikleri completed yap
    // panel_id ile eslestir
    await supabase
      .from('tv_contents')
      .update({ status: 'completed' })
      .eq('panel_id', panelId)
      .in('status', ['playing', 'approved']);

    // panel_name ile de eslestir (farkli panel_id formatinda kaydedilmis eski icerikleri yakala)
    if (panelName) {
      await supabase
        .from('tv_contents')
        .update({ status: 'completed' })
        .eq('panel_name', panelName)
        .in('status', ['playing', 'approved']);
    }

    // ADIM 2: Yeni icerigi ekle (eski iceriklerin completed oldugu kesin)
    const { error: insertError } = await supabase.from('tv_contents').upsert({
      id: contentId,
      order_id: content.orderId,
      ad_title: content.adTitle,
      media_url: content.mediaUrl,
      media_type: content.mediaType,
      panel_id: content.panelId,
      panel_name: content.panelName,
      duration: content.duration,
      scheduled_dates: content.scheduledDates,
      status: 'playing',
      created_at: content.createdAt,
      approved_at: content.approvedAt,
    });

    if (insertError) {
      console.warn('pushContentToTV insert hatasi:', insertError);
    }

    // ADIM 3: tv_panels kaydini guncelle
    if (tvPanelId) {
      await supabase
        .from('tv_panels')
        .update({
          current_content_id: contentId,
          status: 'online',
          last_heartbeat: Date.now(),
        })
        .eq('id', tvPanelId);
    }

    // ADIM 4: DB'den tekrar oku - cache'i DB ile senkronize et
    await fetchContentsDirectly();

    return { id: contentId, ...content };
  } catch (error) {
    console.warn('pushContentToTV hatasi:', error);
    return { id: contentId, ...content };
  }
}

/** Icerigi TV'de oynatmaya basla */
export async function startPlayingContent(contentId) {
  _tvContents = _tvContents.map((c) =>
    c.id === contentId ? { ...c, status: 'playing' } : c
  );
  notifyListeners();

  try {
    await supabase
      .from('tv_contents')
      .update({ status: 'playing' })
      .eq('id', contentId);

    const content = _tvContents.find((c) => c.id === contentId);
    if (content) {
      await supabase
        .from('tv_panels')
        .update({ current_content_id: contentId, status: 'online' })
        .eq('id', content.panelId);
    }
  } catch (error) {
    console.warn('startPlayingContent hatasi:', error);
  }
}

/** Icerigi tamamla */
export async function completeContent(contentId) {
  _tvContents = _tvContents.map((c) =>
    c.id === contentId ? { ...c, status: 'completed' } : c
  );
  notifyListeners();

  try {
    await supabase
      .from('tv_contents')
      .update({ status: 'completed' })
      .eq('id', contentId);
  } catch (error) {
    console.warn('completeContent hatasi:', error);
  }
}

/** Icerigi kaldir/iptal et */
export async function removeContent(contentId) {
  const content = _tvContents.find((c) => c.id === contentId);
  _tvContents = _tvContents.filter((c) => c.id !== contentId);
  notifyListeners();

  try {
    await supabase
      .from('tv_contents')
      .delete()
      .eq('id', contentId);

    if (content) {
      await supabase
        .from('tv_panels')
        .update({ current_content_id: null })
        .eq('id', content.panelId);
    }
  } catch (error) {
    console.warn('removeContent hatasi:', error);
  }
}

// ============================================================
// TV PANO ISLEMLERI
// ============================================================

/** Pano kaydet veya guncelle (TV ilk acildiginda, ?tv=1 gibi string ID ile gelir) */
export async function registerPanel(panelId, panelData) {
  try {
    // Sadece mevcut paneli guncelle, asla yeni panel olusturma
    await supabase
      .from('tv_panels')
      .update({
        status: 'online',
        last_heartbeat: Date.now(),
      })
      .eq('id', panelId);
  } catch (error) {
    console.warn('registerPanel hatasi:', error);
  }
}

/** Pano heartbeat gonder */
export async function updatePanelHeartbeat(panelId) {
  try {
    await supabase
      .from('tv_panels')
      .update({ status: 'online', last_heartbeat: Date.now() })
      .eq('id', panelId);
  } catch (error) {
    console.warn('updatePanelHeartbeat hatasi:', error);
  }
}

/** Panoya su anda oynatilan icerigi kaydet */
export async function updatePanelCurrentContent(panelId, contentId) {
  try {
    await supabase
      .from('tv_panels')
      .update({ current_content_id: contentId, last_heartbeat: Date.now() })
      .eq('id', panelId);
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
    if (_tvPanels.length > 0) return;

    const { data, error } = await supabase.from('tv_panels').select('id');
    if (error) throw error;

    if (!data || data.length === 0) {
      const panelRows = DEFAULT_PANELS.map((panel) => ({
        id: panel.id,
        name: panel.name,
        location: panel.location,
        resolution: panel.resolution,
        status: 'offline',
        last_heartbeat: 0,
        current_content_id: null,
      }));

      await supabase.from('tv_panels').upsert(panelRows);
      // Cache'i de guncelle
      _tvPanels = panelRows.map(mapPanelRow);
      notifyListeners();
      console.log('Varsayilan panolar olusturuldu');
    }
  } catch (error) {
    _panelsInitialized = false;
    console.warn('initializeDefaultPanels hatasi:', error);
  }
}

// Panolari 3 saniye gecikmeyle olustur (baslangic yukunu azalt)
setTimeout(() => initializeDefaultPanels(), 3000);

/**
 * Veritabanindaki bozuk verileri temizle:
 * - tv_panels'daki UUID girisleri sil
 * - tv_contents'daki UUID panel_id'li icerikleri dogru panel_id'ye eslestir
 * - Ayni panel icin birden fazla 'playing' icerik varsa sadece en yenisini birak
 */
export async function cleanupOrphanedPanels() {
  const results = { deletedPanels: 0, fixedContents: 0, completedDuplicates: 0, errors: [] };
  try {
    // 1) tv_panels'daki tum kayitlari cek
    const { data: allPanels, error: pErr } = await supabase.from('tv_panels').select('*');
    if (pErr) throw pErr;

    // UUID formatindaki (bozuk) panelleri bul
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const orphanedPanels = (allPanels || []).filter((p) => uuidRegex.test(p.id));

    // Gecerli panelleri isim → id haritasina cevir
    const validPanels = (allPanels || []).filter((p) => !uuidRegex.test(p.id));
    const nameToId = {};
    validPanels.forEach((p) => { nameToId[p.name] = String(p.id); });

    // 2) Bozuk panellerin iceriklerini dogru panel_id'ye tasi
    for (const orphan of orphanedPanels) {
      const correctId = nameToId[orphan.name];
      if (correctId) {
        const { error: updateErr } = await supabase
          .from('tv_contents')
          .update({ panel_id: correctId })
          .eq('panel_id', orphan.id);
        if (!updateErr) results.fixedContents++;
      }

      // Bozuk paneli sil
      const { error: delErr } = await supabase
        .from('tv_panels')
        .delete()
        .eq('id', orphan.id);
      if (!delErr) results.deletedPanels++;
      else results.errors.push(delErr.message);
    }

    // 3) tv_contents'daki UUID panel_id'leri duzelt (panel_name uzerinden)
    const { data: allContents } = await supabase.from('tv_contents').select('*');
    for (const content of (allContents || [])) {
      if (uuidRegex.test(content.panel_id) && content.panel_name) {
        const correctId = nameToId[content.panel_name] || PANEL_NAME_TO_ID[content.panel_name];
        if (correctId && correctId !== content.panel_id) {
          await supabase
            .from('tv_contents')
            .update({ panel_id: correctId })
            .eq('id', content.id);
          results.fixedContents++;
        }
      }
    }

    // 4) Ayni panel icin birden fazla 'playing' icerik varsa sadece en yenisini birak
    const { data: playingContents } = await supabase
      .from('tv_contents')
      .select('*')
      .in('status', ['playing', 'approved'])
      .order('created_at', { ascending: false });

    if (playingContents && playingContents.length > 0) {
      // Panel bazinda grupla (hem panel_id hem panel_name ile)
      const seenPanels = new Set();
      for (const content of playingContents) {
        const panelKey = content.panel_name || content.panel_id;
        if (seenPanels.has(panelKey)) {
          // Bu panelin daha yeni bir icerigi zaten var, bunu completed yap
          await supabase
            .from('tv_contents')
            .update({ status: 'completed' })
            .eq('id', content.id);
          results.completedDuplicates++;
        } else {
          seenPanels.add(panelKey);
        }
      }
    }

    // Cache'i yenile
    await fetchContentsDirectly();
    await fetchPanelsDirectly();

    console.log('cleanupOrphanedPanels sonuc:', results);
    return results;
  } catch (error) {
    console.warn('cleanupOrphanedPanels hatasi:', error);
    results.errors.push(error.message);
    return results;
  }
}

// ============================================================
// VERI OKUMA
// ============================================================

/** Supabase'den direkt oku (realtime calismiyorsa fallback) */
export async function fetchContentsDirectly() {
  try {
    const { data, error } = await supabase
      .from('tv_contents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    _tvContents = (data || []).map(mapContentRow);
    notifyListeners();
    return _tvContents;
  } catch (error) {
    console.warn('fetchContentsDirectly hatasi:', error);
    return _tvContents;
  }
}

/** Supabase'den panolari direkt oku */
export async function fetchPanelsDirectly() {
  try {
    const { data, error } = await supabase.from('tv_panels').select('*');
    if (error) throw error;
    _tvPanels = (data || []).map(mapPanelRow);
    notifyListeners();
    return _tvPanels;
  } catch (error) {
    console.warn('fetchPanelsDirectly hatasi:', error);
    return _tvPanels;
  }
}

/** Tum TV iceriklerini getir (cache'den) */
export function getTvContents() {
  return [..._tvContents];
}

/** Belirli panoya ait icerikleri getir */
export function getContentsByPanel(panelId) {
  const pid = String(panelId);
  const panelName = getPanelNameById(pid);

  return _tvContents.filter((c) => {
    if (String(c.panelId) === pid) return true;
    if (panelName && c.panelName === panelName) return true;
    return false;
  });
}

/** Belirli panoya ait aktif (oynatilacak) icerikleri getir */
export function getActiveContentsByPanel(panelId) {
  const pid = String(panelId);
  const panelName = getPanelNameById(pid);

  return _tvContents.filter((c) => {
    if (c.status !== 'approved' && c.status !== 'playing') return false;
    // Panel ID ile veya panel ismi ile eslestir
    if (String(c.panelId) === pid) return true;
    if (panelName && c.panelName === panelName) return true;
    return false;
  });
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
