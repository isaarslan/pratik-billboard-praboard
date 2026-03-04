import { supabase } from '../config/supabase';

/**
 * Bildirim tipleri ve gorsel ayarlari
 */
export const NOTIFICATION_TYPES = {
  order_approved: {
    icon: 'checkmark-circle',
    iconColor: '#27AE60',
    iconBg: '#E8F8EF',
  },
  order_rejected: {
    icon: 'close-circle',
    iconColor: '#C62828',
    iconBg: '#FFEBEE',
  },
  order_preparing: {
    icon: 'construct',
    iconColor: '#1565C0',
    iconBg: '#E3F2FD',
  },
  ad_live: {
    icon: 'megaphone',
    iconColor: '#27AE60',
    iconBg: '#E8F8EF',
  },
  ad_completed: {
    icon: 'flag',
    iconColor: '#6A1B9A',
    iconBg: '#F3E5F5',
  },
  system: {
    icon: 'information-circle',
    iconColor: '#3366FF',
    iconBg: '#EBF0FF',
  },
};

/**
 * Yeni bildirim olustur
 */
export async function createNotification({ userId, type, title, message, data = {} }) {
  try {
    const { data: notification, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        title,
        message,
        data,
        read: false,
      })
      .select()
      .single();

    if (error) throw error;
    return notification;
  } catch (error) {
    console.warn('Bildirim olusturulamadi:', error.message);
    return null;
  }
}

/**
 * Kullanicinin bildirimlerini getir
 */
export async function getUserNotifications(userId) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn('Bildirimler yuklenemedi:', error.message);
    return [];
  }
}

/**
 * Bildirimi okundu olarak isaretle
 */
export async function markAsRead(notificationId) {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) throw error;
  } catch (error) {
    console.warn('Bildirim okundu yapilamadi:', error.message);
  }
}

/**
 * Tum bildirimleri okundu olarak isaretle
 */
export async function markAllAsRead(userId) {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) throw error;
  } catch (error) {
    console.warn('Bildirimler okundu yapilamadi:', error.message);
  }
}

/**
 * Okunmamis bildirim sayisini getir
 */
export async function getUnreadCount(userId) {
  try {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.warn('Okunmamis sayi alinamadi:', error.message);
    return 0;
  }
}

/**
 * Siparis durumu degistiginde bildirim olustur
 */
export async function notifyOrderStatusChange(order, newStatus, rejectReason) {
  if (!order?.userId) return;

  const statusMessages = {
    hazirlaniyor: {
      type: 'order_preparing',
      title: 'Siparişin hazırlanıyor',
      message: `"${order.panelName || 'Billboard'}" siparişin onaylandı ve hazırlanıyor.`,
    },
    live: {
      type: 'ad_live',
      title: 'Reklamın yayında!',
      message: `"${order.panelName || 'Billboard'}" reklamın şu anda yayında. Tebrikler!`,
    },
    completed: {
      type: 'ad_completed',
      title: 'Reklam süresi tamamlandı',
      message: `"${order.panelName || 'Billboard'}" reklamının yayın süresi tamamlandı.`,
    },
    rejected: {
      type: 'order_rejected',
      title: 'Siparişin reddedildi',
      message: rejectReason
        ? `"${order.panelName || 'Billboard'}" siparişin reddedildi. Sebep: ${rejectReason}`
        : `"${order.panelName || 'Billboard'}" siparişin reddedildi.`,
    },
  };

  const config = statusMessages[newStatus];
  if (!config) return;

  return createNotification({
    userId: order.userId,
    type: config.type,
    title: config.title,
    message: config.message,
    data: { orderId: order.id, status: newStatus },
  });
}
