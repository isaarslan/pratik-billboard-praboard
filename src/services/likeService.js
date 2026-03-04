import { supabase } from '../config/supabase';

/**
 * Beğeni Servisi
 * - toggleLike: beğen/beğenmekten vazgeç
 * - getLikeCounts: birden fazla reklam için beğeni sayıları
 * - getUserLikes: kullanıcının beğendiği reklamlar
 * - isLikedByUser: tek reklam kontrolü
 */

// Beğen veya beğenmekten vazgeç
export async function toggleLike(userId, adId) {
  if (!userId || !adId) return { liked: false, error: 'Eksik parametre' };

  try {
    // Önce mevcut beğeniyi kontrol et
    const { data: existing } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', userId)
      .eq('ad_id', adId)
      .single();

    if (existing) {
      // Beğeniyi kaldır
      await supabase.from('likes').delete().eq('id', existing.id);
      return { liked: false, error: null };
    } else {
      // Beğeni ekle
      await supabase.from('likes').insert({ user_id: userId, ad_id: adId });
      return { liked: true, error: null };
    }
  } catch (err) {
    console.warn('toggleLike error:', err.message);
    return { liked: false, error: err.message };
  }
}

// Belirli reklamların beğeni sayılarını getir
export async function getLikeCounts(adIds) {
  if (!adIds || adIds.length === 0) return {};

  try {
    const { data, error } = await supabase
      .from('likes')
      .select('ad_id')
      .in('ad_id', adIds);

    if (error) throw error;

    const counts = {};
    adIds.forEach((id) => { counts[id] = 0; });
    (data || []).forEach((row) => {
      counts[row.ad_id] = (counts[row.ad_id] || 0) + 1;
    });
    return counts;
  } catch (err) {
    console.warn('getLikeCounts error:', err.message);
    return {};
  }
}

// Kullanıcının beğendiği reklam ID'leri
export async function getUserLikedAdIds(userId) {
  if (!userId) return [];

  try {
    const { data, error } = await supabase
      .from('likes')
      .select('ad_id')
      .eq('user_id', userId);

    if (error) throw error;
    return (data || []).map((row) => row.ad_id);
  } catch (err) {
    console.warn('getUserLikedAdIds error:', err.message);
    return [];
  }
}

// Tek reklam için beğeni kontrolü
export async function isLikedByUser(userId, adId) {
  if (!userId || !adId) return false;

  try {
    const { data } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', userId)
      .eq('ad_id', adId)
      .single();

    return !!data;
  } catch {
    return false;
  }
}

// Beğeni sayısı (tek reklam)
export async function getLikeCount(adId) {
  if (!adId) return 0;

  try {
    const { count, error } = await supabase
      .from('likes')
      .select('id', { count: 'exact', head: true })
      .eq('ad_id', adId);

    if (error) throw error;
    return count || 0;
  } catch {
    return 0;
  }
}
