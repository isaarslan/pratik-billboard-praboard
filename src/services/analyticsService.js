import { supabase } from '../config/supabase';

/**
 * Analitik Servisi
 * - recordImpression: gösterim kaydet
 * - getAdAnalytics: tek reklam analitikleri
 * - getUserAnalytics: kullanıcının tüm reklamlarının analitikleri
 * - getTopAds: en çok gösterim alan reklamlar
 * - getPanelPerformance: panel bazlı performans
 */

// Gösterim kaydet (TV ekranından çağrılır)
export async function recordImpression({ adId, orderId, panelId, durationMs }) {
  if (!adId || !panelId) return { error: 'Eksik parametre' };

  try {
    const { error } = await supabase
      .from('ad_impressions')
      .insert({
        ad_id: adId,
        order_id: orderId || null,
        panel_id: panelId,
        duration_ms: durationMs || 0,
      });

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.warn('recordImpression error:', err.message);
    return { error: err.message };
  }
}

// Tek reklam analitikleri
export async function getAdAnalytics(adId) {
  if (!adId) return null;

  try {
    const { data, error } = await supabase
      .from('ad_impressions')
      .select('id, panel_id, viewed_at, duration_ms')
      .eq('ad_id', adId)
      .order('viewed_at', { ascending: false });

    if (error) throw error;

    const impressions = data || [];
    const totalViews = impressions.length;
    const totalDuration = impressions.reduce((sum, i) => sum + (i.duration_ms || 0), 0);
    const avgDuration = totalViews > 0 ? Math.round(totalDuration / totalViews) : 0;

    // Panel bazlı dağılım
    const panelCounts = {};
    impressions.forEach((imp) => {
      panelCounts[imp.panel_id] = (panelCounts[imp.panel_id] || 0) + 1;
    });

    // Günlük gösterim (son 7 gün)
    const dailyViews = getDailyBreakdown(impressions, 7);

    return {
      totalViews,
      totalDuration,
      avgDuration,
      panelCounts,
      dailyViews,
      recentImpressions: impressions.slice(0, 10),
    };
  } catch (err) {
    console.warn('getAdAnalytics error:', err.message);
    return null;
  }
}

// Kullanıcının tüm siparişlerinin analitikleri
export async function getUserAnalytics(userId) {
  if (!userId) return getDefaultAnalytics();

  try {
    // Kullanıcının siparişlerini al
    const { data: orders, error: orderErr } = await supabase
      .from('orders')
      .select('id, ad_title, status, created_at')
      .eq('user_id', userId);

    if (orderErr) throw orderErr;

    const orderIds = (orders || []).map((o) => o.id);
    if (orderIds.length === 0) return getDefaultAnalytics();

    // Siparişlere ait gösterimleri al
    const { data: impressions, error: impErr } = await supabase
      .from('ad_impressions')
      .select('id, ad_id, order_id, panel_id, viewed_at, duration_ms')
      .in('order_id', orderIds)
      .order('viewed_at', { ascending: false });

    if (impErr) throw impErr;

    const allImpressions = impressions || [];
    const totalViews = allImpressions.length;
    const totalDuration = allImpressions.reduce((sum, i) => sum + (i.duration_ms || 0), 0);
    const avgDuration = totalViews > 0 ? Math.round(totalDuration / totalViews) : 0;

    // Sipariş bazlı dağılım
    const orderStats = {};
    (orders || []).forEach((o) => {
      orderStats[o.id] = { title: o.ad_title, views: 0, status: o.status };
    });
    allImpressions.forEach((imp) => {
      if (imp.order_id && orderStats[imp.order_id]) {
        orderStats[imp.order_id].views += 1;
      }
    });

    // Panel bazlı dağılım
    const panelCounts = {};
    allImpressions.forEach((imp) => {
      panelCounts[imp.panel_id] = (panelCounts[imp.panel_id] || 0) + 1;
    });

    // Günlük gösterim (son 7 gün)
    const dailyViews = getDailyBreakdown(allImpressions, 7);

    // Beğeni ve paylaşım sayısı
    const { count: likeCount } = await supabase
      .from('likes')
      .select('id', { count: 'exact', head: true })
      .in('ad_id', orderIds.map((id) => `order-${id}`));

    const { count: shareCount } = await supabase
      .from('shares')
      .select('id', { count: 'exact', head: true })
      .in('ad_id', orderIds.map((id) => `order-${id}`));

    return {
      totalViews,
      totalDuration,
      avgDuration,
      totalOrders: orders?.length || 0,
      activeOrders: (orders || []).filter((o) => o.status === 'live').length,
      orderStats: Object.entries(orderStats).map(([id, s]) => ({ id, ...s })),
      panelCounts,
      dailyViews,
      totalLikes: likeCount || 0,
      totalShares: shareCount || 0,
    };
  } catch (err) {
    console.warn('getUserAnalytics error:', err.message);
    return getDefaultAnalytics();
  }
}

// En çok gösterim alan reklamlar (admin için)
export async function getTopAds(limit = 10) {
  try {
    const { data, error } = await supabase
      .from('ad_impressions')
      .select('ad_id, order_id');

    if (error) throw error;

    const counts = {};
    (data || []).forEach((row) => {
      const key = row.order_id || row.ad_id;
      counts[key] = (counts[key] || 0) + 1;
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id, views]) => ({ id, views }));
  } catch (err) {
    console.warn('getTopAds error:', err.message);
    return [];
  }
}

// Panel performansı (admin için)
export async function getPanelPerformance() {
  try {
    const { data, error } = await supabase
      .from('ad_impressions')
      .select('panel_id, duration_ms');

    if (error) throw error;

    const panels = {};
    (data || []).forEach((row) => {
      if (!panels[row.panel_id]) {
        panels[row.panel_id] = { views: 0, totalDuration: 0 };
      }
      panels[row.panel_id].views += 1;
      panels[row.panel_id].totalDuration += row.duration_ms || 0;
    });

    // Panel isimlerini tv_panels tablosundan cek
    const panelIds = Object.keys(panels);
    let panelNames = {};
    if (panelIds.length > 0) {
      const { data: tvPanels } = await supabase
        .from('tv_panels')
        .select('id, name')
        .in('id', panelIds);
      if (tvPanels) {
        tvPanels.forEach((p) => { panelNames[p.id] = p.name; });
      }
    }

    return Object.entries(panels).map(([panelId, stats]) => ({
      panelId,
      panelName: panelNames[panelId] || `Pano ${panelId}`,
      views: stats.views,
      avgDuration: stats.views > 0 ? Math.round(stats.totalDuration / stats.views) : 0,
    }));
  } catch (err) {
    console.warn('getPanelPerformance error:', err.message);
    return [];
  }
}

// Yardımcı: günlük kırılım
function getDailyBreakdown(impressions, days) {
  const result = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayLabel = date.toLocaleDateString('tr-TR', { weekday: 'short' });

    const count = impressions.filter((imp) => {
      const impDate = new Date(imp.viewed_at).toISOString().split('T')[0];
      return impDate === dateStr;
    }).length;

    result.push({ date: dateStr, label: dayLabel, count });
  }

  return result;
}

function getDefaultAnalytics() {
  return {
    totalViews: 0,
    totalDuration: 0,
    avgDuration: 0,
    totalOrders: 0,
    activeOrders: 0,
    orderStats: [],
    panelCounts: {},
    dailyViews: getDailyBreakdown([], 7),
    totalLikes: 0,
    totalShares: 0,
  };
}
