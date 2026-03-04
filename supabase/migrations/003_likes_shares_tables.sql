-- ============================================================
-- Faz 3: Beğeni ve Paylaşım Tabloları
-- ============================================================

-- Likes tablosu
CREATE TABLE IF NOT EXISTS likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ad_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, ad_id)
);

-- Shares tablosu
CREATE TABLE IF NOT EXISTS shares (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ad_id TEXT NOT NULL,
  platform TEXT DEFAULT 'clipboard',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Politikaları
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE shares ENABLE ROW LEVEL SECURITY;

-- Likes: herkes okuyabilir, giriş yapmış kullanıcılar ekleyip silebilir
CREATE POLICY "Likes herkes okuyabilir" ON likes FOR SELECT USING (true);
CREATE POLICY "Likes kullanıcı ekleyebilir" ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Likes kullanıcı silebilir" ON likes FOR DELETE USING (auth.uid() = user_id);

-- Shares: herkes okuyabilir, giriş yapmış kullanıcılar ekleyebilir
CREATE POLICY "Shares herkes okuyabilir" ON shares FOR SELECT USING (true);
CREATE POLICY "Shares kullanıcı ekleyebilir" ON shares FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Indexler
CREATE INDEX IF NOT EXISTS idx_likes_ad_id ON likes(ad_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_shares_ad_id ON shares(ad_id);
