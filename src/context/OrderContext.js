import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';
import * as orderService from '../services/orderService';
import { notifyOrderStatusChange } from '../services/notificationService';

const OrderContext = createContext(null);

const STATUS_LABELS = {
  onay_bekliyor: 'Onay Bekliyor',
  hazirlaniyor: 'Hazırlanıyor',
  live: 'Yayında',
  completed: 'Tamamlandı',
  rejected: 'Reddedildi',
};

const STATUS_COLORS = {
  onay_bekliyor: { bg: '#FFF3E0', text: '#E65100' },
  hazirlaniyor: { bg: '#E3F2FD', text: '#1565C0' },
  live: { bg: '#E8F5E9', text: '#2E7D32' },
  completed: { bg: '#F3E5F5', text: '#6A1B9A' },
  rejected: { bg: '#FFEBEE', text: '#C62828' },
};

const STATUS_STEPS = ['onay_bekliyor', 'hazirlaniyor', 'live', 'completed'];

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Siparisleri Supabase'den yukle
  const loadOrders = useCallback(async () => {
    try {
      const data = await orderService.fetchOrders();
      setOrders(data);
    } catch (error) {
      console.warn('Siparisler yuklenemedi:', error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Ilk yukleme ve Realtime dinleme
  useEffect(() => {
    loadOrders();

    const channel = supabase
      .channel('orders_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        loadOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadOrders]);

  const addOrder = useCallback(async (orderData) => {
    try {
      const order = await orderService.createOrder(orderData);
      setOrders((prev) => [order, ...prev]);
      return order;
    } catch (error) {
      console.warn('Siparis olusturulamadi:', error.message);
      throw error;
    }
  }, []);

  const updateOrderStatus = useCallback(async (orderId, newStatus) => {
    const order = orders.find((o) => o.id === orderId);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      // Kullaniciya bildirim gonder
      if (order) {
        notifyOrderStatusChange(order, newStatus);
      }
    } catch (error) {
      console.warn('Siparis durumu guncellenemedi:', error.message);
      loadOrders();
    }
  }, [loadOrders, orders]);

  const rejectOrder = useCallback(async (orderId, reason) => {
    const order = orders.find((o) => o.id === orderId);
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: 'rejected', rejectReason: reason || 'Reklam içeriği uygun bulunmadı.' } : o
      )
    );
    try {
      await orderService.rejectOrderInDB(orderId, reason);
      // Kullaniciya red bildirimi gonder
      if (order) {
        notifyOrderStatusChange(order, 'rejected', reason);
      }
    } catch (error) {
      console.warn('Siparis reddedilemedi:', error.message);
      loadOrders();
    }
  }, [loadOrders, orders]);

  return (
    <OrderContext.Provider value={{ orders, loading, addOrder, updateOrderStatus, rejectOrder, STATUS_LABELS, STATUS_COLORS, STATUS_STEPS }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used within OrderProvider');
  return ctx;
}
