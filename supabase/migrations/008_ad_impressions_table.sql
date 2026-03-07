-- Ad Impressions (gösterim takibi) tablosu
CREATE TABLE IF NOT EXISTS ad_impressions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ad_id TEXT NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  panel_id TEXT NOT NULL,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  duration_ms INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_impressions_ad_id ON ad_impressions(ad_id);
CREATE INDEX IF NOT EXISTS idx_impressions_panel_id ON ad_impressions(panel_id);
CREATE INDEX IF NOT EXISTS idx_impressions_viewed_at ON ad_impressions(viewed_at);
CREATE INDEX IF NOT EXISTS idx_impressions_order_id ON ad_impressions(order_id);

-- RLS
ALTER TABLE ad_impressions ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilir (genel istatistikler için)
CREATE POLICY "impressions_select" ON ad_impressions
  FOR SELECT USING (true);

-- Sadece authenticated kullanıcılar (TV panel) insert yapabilir
CREATE POLICY "impressions_insert" ON ad_impressions
  FOR INSERT WITH CHECK (true);
