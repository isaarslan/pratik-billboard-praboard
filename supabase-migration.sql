-- ============================================================
-- Praboard - Supabase Migration
-- Bu SQL'i Supabase Dashboard > SQL Editor'de calistirin
-- ============================================================

-- 1. TV Contents tablosu (Firestore tvContent koleksiyonunun karsiligi)
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
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'playing', 'completed', 'rejected')),
  created_at BIGINT DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
  approved_at BIGINT
);

-- 2. TV Panels tablosu (Firestore tvPanels koleksiyonunun karsiligi)
CREATE TABLE IF NOT EXISTS tv_panels (
  id TEXT PRIMARY KEY,
  name TEXT,
  location TEXT DEFAULT '',
  status TEXT DEFAULT 'offline' CHECK (status IN ('online', 'offline')),
  last_heartbeat BIGINT DEFAULT 0,
  current_content_id TEXT,
  resolution TEXT DEFAULT '1920x1080'
);

-- 3. Storage bucket olustur (reklam gorselleri icin)
INSERT INTO storage.buckets (id, name, public)
VALUES ('tv-content', 'tv-content', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Storage politikasi - herkes okuyabilsin
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'tv-content');

-- 5. Storage politikasi - anon kullanicilar yukleyebilsin
CREATE POLICY "Anon upload access" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'tv-content');

-- 6. RLS (Row Level Security) - suan icin herkese acik
ALTER TABLE tv_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tv_panels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read tv_contents" ON tv_contents FOR SELECT USING (true);
CREATE POLICY "Public insert tv_contents" ON tv_contents FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update tv_contents" ON tv_contents FOR UPDATE USING (true);
CREATE POLICY "Public delete tv_contents" ON tv_contents FOR DELETE USING (true);

CREATE POLICY "Public read tv_panels" ON tv_panels FOR SELECT USING (true);
CREATE POLICY "Public insert tv_panels" ON tv_panels FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update tv_panels" ON tv_panels FOR UPDATE USING (true);
CREATE POLICY "Public delete tv_panels" ON tv_panels FOR DELETE USING (true);

-- 7. Realtime yayin aktif et (onSnapshot yerine)
ALTER PUBLICATION supabase_realtime ADD TABLE tv_contents;
ALTER PUBLICATION supabase_realtime ADD TABLE tv_panels;

-- 8. Profiles tablosuna role sutunu ekle (admin paneli icin gerekli)
-- Eger profiles tablosu Supabase Auth trigger ile olusturulduysa, role sutunu olmayabilir.
-- Bu komut role sutununu ekler. Varsayilan deger 'user' olur.
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- 9. Kendinizi admin yapmak icin asagidaki SQL'i calistirin
-- (email adresinizi degistirin)
-- UPDATE profiles SET role = 'admin' WHERE id = (
--   SELECT id FROM auth.users WHERE email = 'sizin@email.com'
-- );
