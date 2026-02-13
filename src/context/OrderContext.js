import React, { createContext, useContext, useState, useCallback } from 'react';

const OrderContext = createContext(null);

// Varsayilan siparis verileri (demo icin)
const DEFAULT_ORDERS = [
  {
    id: 'ORD-20260115-001',
    adTitle: 'Premium billboard reklamımız Kızılay Meydanında yayında!',
    adImage: 'https://picsum.photos/seed/myad1/800/500',
    panel: {
      id: '1',
      name: 'Kızılay Meydanı',
      location: 'Kızılay, Ankara',
      size: '3m x 6m',
      price: '1.166 TL/gün',
      image: 'https://picsum.photos/seed/panel1/400/250',
    },
    dates: ['15 Ocak 2026 10:00', '16 Ocak 2026 10:00', '17 Ocak 2026 10:00'],
    adDuration: '15 saniye',
    totalPrice: '3.498 TL',
    status: 'live', // onay_bekliyor, hazirlaniyor, live, completed
    createdAt: '15 Ocak 2026',
    proofPhoto: 'https://picsum.photos/seed/proof1/800/500',
    proofDate: '15 Ocak 2026 10:30',
  },
  {
    id: 'ORD-20260110-002',
    adTitle: 'Tunalı Hilmi Caddesindeki billboard kampanyamız',
    adImage: 'https://picsum.photos/seed/myad2/800/500',
    panel: {
      id: '2',
      name: 'Tunalı Hilmi Caddesi',
      location: 'Çankaya, Ankara',
      size: '4m x 8m',
      price: '2.350 TL/gün',
      image: 'https://picsum.photos/seed/panel2/400/250',
    },
    dates: ['10 Ocak 2026 12:00', '11 Ocak 2026 12:00'],
    adDuration: '20 saniye',
    totalPrice: '4.700 TL',
    status: 'completed',
    createdAt: '10 Ocak 2026',
    proofPhoto: 'https://picsum.photos/seed/proof2/800/500',
    proofDate: '10 Ocak 2026 14:00',
  },
  {
    id: 'ORD-20260205-003',
    adTitle: 'Kış kampanyası billboard reklamı',
    adImage: 'https://picsum.photos/seed/myad3/800/500',
    panel: {
      id: '4',
      name: 'Bahçelievler AVM Girişi',
      location: 'Çankaya, Ankara',
      size: '3m x 4m',
      price: '1.500 TL/gün',
      image: 'https://picsum.photos/seed/panel4/400/250',
    },
    dates: ['5 Şubat 2026 09:00', '6 Şubat 2026 09:00', '7 Şubat 2026 09:00'],
    adDuration: '10 saniye',
    totalPrice: '4.500 TL',
    status: 'hazirlaniyor',
    createdAt: '3 Şubat 2026',
    proofPhoto: null,
    proofDate: null,
  },
];

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
  const [orders, setOrders] = useState(DEFAULT_ORDERS);

  const addOrder = useCallback((orderData) => {
    const id = `ORD-${Date.now()}`;
    const today = new Date();
    const months = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
    const dateStr = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;

    const order = {
      id,
      adTitle: orderData.adTitle,
      adImage: orderData.adImage,
      panel: orderData.panel,
      dates: orderData.dates,
      adDuration: `${orderData.adDuration || 15} saniye`,
      totalPrice: `${(orderData.dates?.length || 1) * (parseInt(orderData.panel?.price) || 1166)} TL`,
      status: 'onay_bekliyor',
      createdAt: dateStr,
      proofPhoto: null,
      proofDate: null,
    };

    setOrders((prev) => [order, ...prev]);
    return order;
  }, []);

  const updateOrderStatus = useCallback((orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  }, []);

  const rejectOrder = useCallback((orderId, reason) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: 'rejected', rejectReason: reason || 'Reklam içeriği uygun bulunmadı.' } : o
      )
    );
  }, []);

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, rejectOrder, STATUS_LABELS, STATUS_COLORS, STATUS_STEPS }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used within OrderProvider');
  return ctx;
}
