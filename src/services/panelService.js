import { supabase } from '../config/supabase';

/**
 * Panel Servisi
 * - CRUD operasyonları (listele, ekle, düzenle, sil)
 * - Durum değiştirme (Müsait/Dolu/Bakımda)
 * - Supabase panels tablosu ile çalışır
 */

// Varsayılan paneller (Supabase boşsa kullanılır)
const DEFAULT_PANELS = [
  {
    name: 'Kızılay Meydanı',
    location: 'Ankara, Kızılay',
    size: '3m x 6m',
    price: 1166,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800',
    lat: 39.9208,
    lng: 32.8541,
  },
  {
    name: 'Tunalı Hilmi Caddesi',
    location: 'Ankara, Kavaklıdere',
    size: '4m x 8m',
    price: 2350,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800',
    lat: 39.9050,
    lng: 32.8597,
  },
  {
    name: 'Ulus Meydanı',
    location: 'Ankara, Ulus',
    size: '2.5m x 5m',
    price: 890,
    status: 'full',
    image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800',
    lat: 39.9412,
    lng: 32.8543,
  },
  {
    name: 'Bahçelievler AVM Girişi',
    location: 'Ankara, Bahçelievler',
    size: '3m x 4m',
    price: 1500,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?w=800',
    lat: 39.9250,
    lng: 32.8150,
  },
  {
    name: 'Batıkent Metro Çıkışı',
    location: 'Ankara, Batıkent',
    size: '2m x 4m',
    price: 750,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    lat: 39.9700,
    lng: 32.7300,
  },
  {
    name: 'Gölbaşı Sahil Yolu',
    location: 'Ankara, Gölbaşı',
    size: '3m x 6m',
    price: 1050,
    status: 'full',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800',
    lat: 39.7856,
    lng: 32.8087,
  },
];

const PANEL_STATUS_MAP = {
  available: 'Müsait',
  full: 'Dolu',
  maintenance: 'Bakımda',
};

const PANEL_STATUS_COLORS = {
  available: { bg: '#E8F5E9', text: '#2E7D32' },
  full: { bg: '#FFF3E0', text: '#E65100' },
  maintenance: { bg: '#FFEBEE', text: '#C62828' },
};

export { PANEL_STATUS_MAP, PANEL_STATUS_COLORS };

// Tüm panelleri getir (tablo boşsa varsayılan panelleri seed'le)
export async function getPanels() {
  try {
    const { data, error } = await supabase
      .from('panels')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Tablo boşsa varsayılan panelleri yükle
    if (!data || data.length === 0) {
      const seedResult = await seedDefaultPanels();
      if (seedResult.seeded) {
        // Yeni eklenen panelleri tekrar çek
        const { data: seededData } = await supabase
          .from('panels')
          .select('*')
          .order('created_at', { ascending: false });
        return seededData || [];
      }
      return [];
    }

    return data;
  } catch (err) {
    console.warn('getPanels error:', err.message);
    return [];
  }
}

// Tek panel getir
export async function getPanel(panelId) {
  try {
    const { data, error } = await supabase
      .from('panels')
      .select('*')
      .eq('id', panelId)
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('getPanel error:', err.message);
    return null;
  }
}

// Panel ekle
export async function createPanel(panelData) {
  try {
    const { data, error } = await supabase
      .from('panels')
      .insert({
        name: panelData.name,
        location: panelData.location,
        size: panelData.size,
        price: parseFloat(panelData.price) || 0,
        status: panelData.status || 'available',
        image: panelData.image || '',
        lat: parseFloat(panelData.lat) || 0,
        lng: parseFloat(panelData.lng) || 0,
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, panel: data };
  } catch (err) {
    console.warn('createPanel error:', err.message);
    return { success: false, error: err.message };
  }
}

// Panel güncelle
export async function updatePanel(panelId, updates) {
  try {
    const { data, error } = await supabase
      .from('panels')
      .update({
        ...updates,
        price: updates.price ? parseFloat(updates.price) : undefined,
        lat: updates.lat ? parseFloat(updates.lat) : undefined,
        lng: updates.lng ? parseFloat(updates.lng) : undefined,
      })
      .eq('id', panelId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, panel: data };
  } catch (err) {
    console.warn('updatePanel error:', err.message);
    return { success: false, error: err.message };
  }
}

// Panel sil
export async function deletePanel(panelId) {
  try {
    const { error } = await supabase
      .from('panels')
      .delete()
      .eq('id', panelId);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.warn('deletePanel error:', err.message);
    return { success: false, error: err.message };
  }
}

// Panel durumunu değiştir
export async function updatePanelStatus(panelId, newStatus) {
  return updatePanel(panelId, { status: newStatus });
}

// Panel sayısı istatistikleri
export async function getPanelStats() {
  try {
    const { data, error } = await supabase
      .from('panels')
      .select('status');

    if (error) throw error;

    const panels = data || [];
    return {
      total: panels.length,
      available: panels.filter((p) => p.status === 'available').length,
      full: panels.filter((p) => p.status === 'full').length,
      maintenance: panels.filter((p) => p.status === 'maintenance').length,
    };
  } catch (err) {
    console.warn('getPanelStats error:', err.message);
    return { total: 0, available: 0, full: 0, maintenance: 0 };
  }
}

// Varsayılan panelleri Supabase'e yükle (ilk kurulum için)
export async function seedDefaultPanels() {
  try {
    const { data: existing } = await supabase
      .from('panels')
      .select('id')
      .limit(1);

    if (existing && existing.length > 0) {
      return { seeded: false, message: 'Paneller zaten mevcut' };
    }

    const { error } = await supabase.from('panels').insert(DEFAULT_PANELS);
    if (error) throw error;
    return { seeded: true };
  } catch (err) {
    console.warn('seedDefaultPanels error:', err.message);
    return { seeded: false, error: err.message };
  }
}
