import { supabase } from '../config/supabase';

/**
 * Admin Servisi
 * - Kullanıcı yönetimi (listeleme, arama, rol değiştirme)
 * - Genel istatistikler (dashboard)
 * - Son aktiviteler
 */

// Tüm kullanıcıları getir
export async function getUsers({ search = '', limit = 50, offset = 0 } = {}) {
  try {
    let query = supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.or(`username.ilike.%${search}%,full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, count, error } = await query;
    if (error) throw error;
    return { users: data || [], total: count || 0 };
  } catch (err) {
    console.warn('getUsers error:', err.message);
    return { users: [], total: 0 };
  }
}

// Tek kullanıcı detayı
export async function getUserDetail(userId) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('getUserDetail error:', err.message);
    return null;
  }
}

// Kullanıcı rolünü değiştir
export async function updateUserRole(userId, newRole) {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.warn('updateUserRole error:', err.message);
    return { success: false, error: err.message };
  }
}

// Dashboard istatistikleri
export async function getDashboardStats() {
  try {
    const [usersRes, ordersRes, likesRes, sharesRes] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('orders').select('id, status, total_price', { count: 'exact' }),
      supabase.from('likes').select('id', { count: 'exact', head: true }),
      supabase.from('shares').select('id', { count: 'exact', head: true }),
    ]);

    const orders = ordersRes.data || [];
    const totalRevenue = orders
      .filter((o) => o.status === 'completed' || o.status === 'live')
      .reduce((sum, o) => sum + (parseFloat(o.total_price) || 0), 0);

    const pendingOrders = orders.filter((o) => o.status === 'onay_bekliyor').length;
    const liveOrders = orders.filter((o) => o.status === 'live').length;

    return {
      totalUsers: usersRes.count || 0,
      totalOrders: ordersRes.count || 0,
      pendingOrders,
      liveOrders,
      totalRevenue,
      totalLikes: likesRes.count || 0,
      totalShares: sharesRes.count || 0,
    };
  } catch (err) {
    console.warn('getDashboardStats error:', err.message);
    return {
      totalUsers: 0,
      totalOrders: 0,
      pendingOrders: 0,
      liveOrders: 0,
      totalRevenue: 0,
      totalLikes: 0,
      totalShares: 0,
    };
  }
}

// Son aktiviteler (son siparişler + durum değişiklikleri)
export async function getRecentActivities(limit = 10) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('id, status, created_at, ad_title, panel_name')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data || []).map((order) => ({
      id: order.id,
      type: 'order',
      title: order.ad_title || order.id,
      subtitle: order.panel_name || '',
      status: order.status,
      createdAt: order.created_at,
    }));
  } catch (err) {
    console.warn('getRecentActivities error:', err.message);
    return [];
  }
}

// Kullanıcının sipariş sayısı
export async function getUserOrderCount(userId) {
  try {
    const { count, error } = await supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error) throw error;
    return count || 0;
  } catch {
    return 0;
  }
}
