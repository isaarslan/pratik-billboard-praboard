import { Platform, Share } from 'react-native';
import { supabase } from '../config/supabase';

/**
 * Paylaşım Servisi
 * - shareAd: native share dialog veya clipboard
 * - getShareCount: tek reklam paylaşım sayısı
 * - getShareCounts: birden fazla reklam paylaşım sayıları
 */

// Reklam paylaş
export async function shareAd(userId, ad) {
  const shareUrl = `https://praboard.vercel.app/ad/${ad.id}`;
  const shareMessage = `${ad.user || 'Praboard'}: ${ad.description || 'Billboard reklamı'}`;

  let platform = 'unknown';

  try {
    if (Platform.OS === 'web') {
      // Web: clipboard'a kopyala
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${shareMessage}\n${shareUrl}`);
        platform = 'clipboard';
      } else if (navigator.share) {
        await navigator.share({
          title: ad.user || 'Praboard Reklam',
          text: shareMessage,
          url: shareUrl,
        });
        platform = 'web-share';
      }
    } else {
      // Native: Share dialog
      const result = await Share.share({
        message: `${shareMessage}\n${shareUrl}`,
        title: ad.user || 'Praboard Reklam',
      });
      platform = result.action === Share.sharedAction ? 'native' : 'dismissed';

      if (platform === 'dismissed') return { shared: false };
    }

    // Paylaşımı kaydet
    if (userId) {
      await supabase.from('shares').insert({
        user_id: userId,
        ad_id: ad.id,
        platform,
      });
    }

    return { shared: true, platform };
  } catch (err) {
    console.warn('shareAd error:', err.message);
    return { shared: false, error: err.message };
  }
}

// Tek reklam paylaşım sayısı
export async function getShareCount(adId) {
  if (!adId) return 0;

  try {
    const { count, error } = await supabase
      .from('shares')
      .select('id', { count: 'exact', head: true })
      .eq('ad_id', adId);

    if (error) throw error;
    return count || 0;
  } catch {
    return 0;
  }
}

// Birden fazla reklam paylaşım sayıları
export async function getShareCounts(adIds) {
  if (!adIds || adIds.length === 0) return {};

  try {
    const { data, error } = await supabase
      .from('shares')
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
    console.warn('getShareCounts error:', err.message);
    return {};
  }
}
