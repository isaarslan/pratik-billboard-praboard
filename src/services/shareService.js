import { Platform, Share, Linking } from 'react-native';
import { supabase } from '../config/supabase';

/**
 * Paylaşım Servisi
 * - shareAd: genel paylaşım (native share / clipboard)
 * - shareToWhatsApp: WhatsApp'ta paylaş
 * - shareToInstagram: Instagram story'de paylaş
 * - shareToTwitter: Twitter/X'te paylaş
 * - getShareCount / getShareCounts: paylaşım sayıları
 * - SHARE_PLATFORMS: paylaşım platform seçenekleri
 */

// Paylaşım platformları
export const SHARE_PLATFORMS = [
  { key: 'whatsapp', label: 'WhatsApp', icon: 'logo-whatsapp', color: '#25D366' },
  { key: 'instagram', label: 'Instagram', icon: 'logo-instagram', color: '#E4405F' },
  { key: 'twitter', label: 'X (Twitter)', icon: 'logo-twitter', color: '#1DA1F2' },
  { key: 'copy', label: 'Link Kopyala', icon: 'copy-outline', color: '#737373' },
  { key: 'more', label: 'Diğer', icon: 'share-social-outline', color: '#FF4B4B' },
];

function buildShareContent(ad) {
  const shareUrl = `https://praboard.vercel.app/ad/${ad.id}`;
  const shareMessage = `${ad.user || 'Praboard'}: ${ad.description || 'Billboard reklamı'}`;
  return { shareUrl, shareMessage };
}

// Paylaşımı Supabase'e kaydet
async function recordShare(userId, adId, platform) {
  if (!userId) return;
  try {
    await supabase.from('shares').insert({
      user_id: userId,
      ad_id: adId,
      platform,
    });
  } catch (err) {
    console.warn('recordShare error:', err.message);
  }
}

// WhatsApp'ta paylaş
export async function shareToWhatsApp(userId, ad) {
  const { shareUrl, shareMessage } = buildShareContent(ad);
  const text = encodeURIComponent(`${shareMessage}\n${shareUrl}`);

  try {
    if (Platform.OS === 'web') {
      window.open(`https://wa.me/?text=${text}`, '_blank');
    } else {
      const whatsappUrl = `whatsapp://send?text=${text}`;
      const canOpen = await Linking.canOpenURL(whatsappUrl);
      if (canOpen) {
        await Linking.openURL(whatsappUrl);
      } else {
        await Linking.openURL(`https://wa.me/?text=${text}`);
      }
    }
    await recordShare(userId, ad.id, 'whatsapp');
    return { shared: true, platform: 'whatsapp' };
  } catch (err) {
    console.warn('shareToWhatsApp error:', err.message);
    return { shared: false, error: err.message };
  }
}

// Instagram'da paylaş (story veya DM linki)
export async function shareToInstagram(userId, ad) {
  const { shareUrl, shareMessage } = buildShareContent(ad);

  try {
    if (Platform.OS === 'web') {
      // Web'de Instagram direct mesaj linki yok, clipboard'a kopyalayıp Instagram'ı aç
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${shareMessage}\n${shareUrl}`);
      }
      window.open('https://www.instagram.com/', '_blank');
    } else {
      // Native'de Instagram uygulamasını aç
      const igUrl = 'instagram://app';
      const canOpen = await Linking.canOpenURL(igUrl);
      if (canOpen) {
        await Linking.openURL(igUrl);
      } else {
        await Linking.openURL('https://www.instagram.com/');
      }
    }
    await recordShare(userId, ad.id, 'instagram');
    return { shared: true, platform: 'instagram' };
  } catch (err) {
    console.warn('shareToInstagram error:', err.message);
    return { shared: false, error: err.message };
  }
}

// Twitter/X'te paylaş
export async function shareToTwitter(userId, ad) {
  const { shareUrl, shareMessage } = buildShareContent(ad);
  const text = encodeURIComponent(shareMessage);
  const url = encodeURIComponent(shareUrl);

  try {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    if (Platform.OS === 'web') {
      window.open(twitterUrl, '_blank');
    } else {
      await Linking.openURL(twitterUrl);
    }
    await recordShare(userId, ad.id, 'twitter');
    return { shared: true, platform: 'twitter' };
  } catch (err) {
    console.warn('shareToTwitter error:', err.message);
    return { shared: false, error: err.message };
  }
}

// Link kopyala
export async function copyShareLink(userId, ad) {
  const { shareUrl, shareMessage } = buildShareContent(ad);

  try {
    if (Platform.OS === 'web' && navigator.clipboard) {
      await navigator.clipboard.writeText(`${shareMessage}\n${shareUrl}`);
    }
    await recordShare(userId, ad.id, 'clipboard');
    return { shared: true, platform: 'clipboard' };
  } catch (err) {
    console.warn('copyShareLink error:', err.message);
    return { shared: false, error: err.message };
  }
}

// Genel paylaşım (native share dialog veya clipboard)
export async function shareAd(userId, ad, platformKey) {
  // Platform-spesifik paylaşım
  if (platformKey === 'whatsapp') return shareToWhatsApp(userId, ad);
  if (platformKey === 'instagram') return shareToInstagram(userId, ad);
  if (platformKey === 'twitter') return shareToTwitter(userId, ad);
  if (platformKey === 'copy') return copyShareLink(userId, ad);

  // 'more' veya belirtilmemişse genel paylaşım
  const { shareUrl, shareMessage } = buildShareContent(ad);
  let platform = 'unknown';

  try {
    if (Platform.OS === 'web') {
      if (navigator.share) {
        await navigator.share({
          title: ad.user || 'Praboard Reklam',
          text: shareMessage,
          url: shareUrl,
        });
        platform = 'web-share';
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${shareMessage}\n${shareUrl}`);
        platform = 'clipboard';
      }
    } else {
      const result = await Share.share({
        message: `${shareMessage}\n${shareUrl}`,
        title: ad.user || 'Praboard Reklam',
      });
      platform = result.action === Share.sharedAction ? 'native' : 'dismissed';
      if (platform === 'dismissed') return { shared: false };
    }

    await recordShare(userId, ad.id, platform);
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
