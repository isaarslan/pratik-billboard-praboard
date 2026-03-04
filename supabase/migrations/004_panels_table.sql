-- ============================================================
-- Faz 1: Panel Yönetimi Tablosu
-- ============================================================

-- Panels tablosu (MOCK_PANELS'dan gerçek veritabanına taşıma)
CREATE TABLE IF NOT EXISTS panels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  size TEXT DEFAULT '',
  price NUMERIC(10, 2) DEFAULT 0,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'full', 'maintenance')),
  image TEXT DEFAULT '',
  lat DOUBLE PRECISION DEFAULT 0,
  lng DOUBLE PRECISION DEFAULT 0,
  owner TEXT DEFAULT '',
  rating NUMERIC(2, 1) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Politikaları
ALTER TABLE panels ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilir (harita, panel listesi vb.)
CREATE POLICY "Panels herkes okuyabilir" ON panels FOR SELECT USING (true);

-- Sadece admin ekleyebilir/düzenleyebilir/silebilir
-- (Admin kontrolü uygulama katmanında yapılır, RLS'de authenticated kullanıcılar izinli)
CREATE POLICY "Panels admin ekleyebilir" ON panels FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Panels admin güncelleyebilir" ON panels FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Panels admin silebilir" ON panels FOR DELETE USING (auth.uid() IS NOT NULL);

-- Indexler
CREATE INDEX IF NOT EXISTS idx_panels_status ON panels(status);
CREATE INDEX IF NOT EXISTS idx_panels_location ON panels(location);

-- Varsayılan paneller (eğer tablo boşsa)
INSERT INTO panels (name, location, size, price, status, image, lat, lng) VALUES
  ('Kızılay Meydanı', 'Ankara, Kızılay', '3m x 6m', 1166, 'available', 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800', 39.9208, 32.8541),
  ('Tunalı Hilmi Caddesi', 'Ankara, Kavaklıdere', '4m x 8m', 2350, 'available', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800', 39.9050, 32.8597),
  ('Ulus Meydanı', 'Ankara, Ulus', '2.5m x 5m', 890, 'full', 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800', 39.9412, 32.8543),
  ('Bahçelievler AVM Girişi', 'Ankara, Bahçelievler', '3m x 4m', 1500, 'available', 'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?w=800', 39.9250, 32.8150),
  ('Batıkent Metro Çıkışı', 'Ankara, Batıkent', '2m x 4m', 750, 'available', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', 39.9700, 32.7300),
  ('Gölbaşı Sahil Yolu', 'Ankara, Gölbaşı', '3m x 6m', 1050, 'full', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800', 39.7856, 32.8087)
ON CONFLICT DO NOTHING;
