-- ============================================================
-- Praboard: Siparisler Tablosu
-- Supabase Dashboard > SQL Editor'de calistirin
-- ============================================================

-- 1) orders tablosu
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ad_title TEXT NOT NULL,
  ad_image TEXT,
  media_type TEXT DEFAULT 'image',
  panel_id TEXT,
  panel_name TEXT,
  panel_location TEXT,
  panel_size TEXT,
  panel_price TEXT,
  panel_image TEXT,
  dates JSONB DEFAULT '[]'::jsonb,
  ad_duration TEXT,
  total_price TEXT,
  campaign_details TEXT,
  status TEXT NOT NULL DEFAULT 'onay_bekliyor'
    CHECK (status IN ('onay_bekliyor', 'hazirlaniyor', 'live', 'completed', 'rejected')),
  reject_reason TEXT,
  proof_photo TEXT,
  proof_date TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2) RLS aktif et
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 3) RLS Politikalari

-- Herkes siparisleri okuyabilir (admin paneli icin)
CREATE POLICY "Orders herkes okuyabilir"
  ON public.orders FOR SELECT
  USING (true);

-- Giris yapmis kullanicilar siparis olusturabilir
CREATE POLICY "Kullanicilar siparis olusturabilir"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Herkes guncelleme yapabilir (admin islemleri icin)
CREATE POLICY "Orders herkes guncelleyebilir"
  ON public.orders FOR UPDATE
  USING (true);

-- 4) updated_at otomatik guncelle
CREATE TRIGGER on_order_updated
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 5) Realtime aktif et
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
