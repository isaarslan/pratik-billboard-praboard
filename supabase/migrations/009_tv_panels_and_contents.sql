-- ============================================================
-- TV Panels ve TV Contents Tablolari
-- ============================================================

-- TV Panelleri (Fiziksel billboard/TV cihazlari)
CREATE TABLE IF NOT EXISTS tv_panels (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT DEFAULT '',
  status TEXT DEFAULT 'offline',
  last_heartbeat BIGINT DEFAULT 0,
  current_content_id TEXT,
  resolution TEXT DEFAULT '1920x1080',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- TV Icerikleri (Yayinlanacak reklam icerikleri)
CREATE TABLE IF NOT EXISTS tv_contents (
  id TEXT PRIMARY KEY,
  order_id TEXT,
  ad_title TEXT,
  media_url TEXT,
  media_type TEXT DEFAULT 'image',
  panel_id TEXT,
  panel_name TEXT,
  duration INTEGER DEFAULT 15,
  scheduled_dates JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'pending',
  created_at BIGINT DEFAULT 0,
  approved_at BIGINT DEFAULT 0
);

-- RLS Politikalari
ALTER TABLE tv_panels ENABLE ROW LEVEL SECURITY;
ALTER TABLE tv_contents ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilir (TV ekranlarinin veri cekebilmesi icin)
CREATE POLICY "tv_panels herkes okuyabilir" ON tv_panels FOR SELECT USING (true);
CREATE POLICY "tv_panels authenticated yazabilir" ON tv_panels FOR ALL USING (true);

CREATE POLICY "tv_contents herkes okuyabilir" ON tv_contents FOR SELECT USING (true);
CREATE POLICY "tv_contents authenticated yazabilir" ON tv_contents FOR ALL USING (true);

-- Indexler
CREATE INDEX IF NOT EXISTS idx_tv_contents_panel_id ON tv_contents(panel_id);
CREATE INDEX IF NOT EXISTS idx_tv_contents_panel_name ON tv_contents(panel_name);
CREATE INDEX IF NOT EXISTS idx_tv_contents_status ON tv_contents(status);

-- Varsayilan paneller
INSERT INTO tv_panels (id, name, location, resolution, status, last_heartbeat, current_content_id) VALUES
  ('1', 'Kızılay Meydanı', 'Kızılay, Ankara', '1920x1080', 'offline', 0, NULL),
  ('2', 'Tunalı Hilmi Caddesi', 'Çankaya, Ankara', '1920x1080', 'offline', 0, NULL),
  ('3', 'Ulus Meydanı', 'Altındağ, Ankara', '1920x1080', 'offline', 0, NULL),
  ('4', 'Bahçelievler AVM Girişi', 'Çankaya, Ankara', '1920x1080', 'offline', 0, NULL),
  ('5', 'Batıkent Metro Çıkışı', 'Yenimahalle, Ankara', '1920x1080', 'offline', 0, NULL),
  ('6', 'Gölbaşı Sahil Yolu', 'Gölbaşı, Ankara', '1920x1080', 'offline', 0, NULL)
ON CONFLICT (id) DO NOTHING;
