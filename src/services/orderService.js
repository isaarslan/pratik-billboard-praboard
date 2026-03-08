import { supabase } from '../config/supabase';

/**
 * Medyayi (gorsel/video) Supabase Storage'a yukle, public URL dondur.
 * blob: ve data: URI'leri web'de gecerli, ama sayfa yenilenince kaybolur.
 * Bu yuzden Storage'a yukluyoruz.
 */
export async function uploadAdMedia(fileUri, mediaType = 'image') {
  try {
    if (!fileUri) return null;
    // Zaten public URL ise tekrar yukleme
    if (fileUri.startsWith('http://') || fileUri.startsWith('https://')) {
      return fileUri;
    }

    const isVideo = mediaType === 'video';
    const ext = isVideo ? 'mp4' : 'jpg';
    const contentType = isVideo ? 'video/mp4' : 'image/jpeg';
    const filePath = `ads/ad-${Date.now()}.${ext}`;

    let fileData;
    if (fileUri.startsWith('data:')) {
      // base64 data URI → Uint8Array
      const base64 = fileUri.split(',')[1];
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      fileData = bytes;
    } else {
      // blob: URI veya file URI → fetch → blob
      const response = await fetch(fileUri);
      fileData = await response.blob();
    }

    const { error } = await supabase.storage
      .from('tv-content')
      .upload(filePath, fileData, { contentType, upsert: true });

    if (error) {
      console.warn('Ad media yukleme hatasi:', error.message);
      return fileUri; // fallback: orijinal URI
    }

    const { data } = supabase.storage
      .from('tv-content')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (err) {
    console.warn('Ad media yukleme hatasi:', err);
    return fileUri;
  }
}

/**
 * Supabase satir → uygulama formati
 */
function mapOrderRow(row) {
  return {
    id: row.id,
    userId: row.user_id,
    adTitle: row.ad_title,
    adImage: row.ad_image,
    mediaType: row.media_type || 'image',
    panel: {
      id: row.panel_id,
      name: row.panel_name,
      location: row.panel_location,
      size: row.panel_size,
      price: row.panel_price,
      image: row.panel_image,
    },
    dates: row.dates || [],
    adDuration: row.ad_duration,
    totalPrice: row.total_price,
    campaignDetails: row.campaign_details,
    status: row.status,
    rejectReason: row.reject_reason,
    proofPhoto: row.proof_photo,
    proofDate: row.proof_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Tum siparisleri getir (admin icin)
 */
export async function fetchOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapOrderRow);
}

/**
 * Belirli kullanicinin siparislerini getir
 */
export async function fetchUserOrders(userId) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapOrderRow);
}

/**
 * Yeni siparis olustur
 */
export async function createOrder(orderData) {
  const id = `ORD-${Date.now()}`;

  const row = {
    id,
    user_id: orderData.userId || null,
    ad_title: orderData.adTitle,
    ad_image: orderData.adImage,
    media_type: orderData.mediaType || 'image',
    panel_id: orderData.panel?.id || null,
    panel_name: orderData.panel?.name || null,
    panel_location: orderData.panel?.location || null,
    panel_size: orderData.panel?.size || null,
    panel_price: orderData.panel?.price || null,
    panel_image: orderData.panel?.image || null,
    dates: orderData.dates || [],
    ad_duration: `${orderData.adDuration || 15} saniye`,
    total_price: `${(orderData.dates?.length || 1) * (parseInt(orderData.panel?.price) || 1166)} TL`,
    campaign_details: orderData.campaignDetails || null,
    status: 'onay_bekliyor',
  };

  const { data, error } = await supabase
    .from('orders')
    .insert(row)
    .select()
    .single();

  if (error) throw error;
  return mapOrderRow(data);
}

/**
 * Siparis durumunu guncelle
 */
export async function updateOrderStatus(orderId, newStatus) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw error;
  return mapOrderRow(data);
}

/**
 * Siparisi reddet
 */
export async function rejectOrderInDB(orderId, reason) {
  const { data, error } = await supabase
    .from('orders')
    .update({
      status: 'rejected',
      reject_reason: reason || 'Reklam icerigi uygun bulunmadi.',
    })
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw error;
  return mapOrderRow(data);
}
