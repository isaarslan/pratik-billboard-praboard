-- ============================================================
-- Praboard: Bildirimler Tablosu
-- Supabase Dashboard > SQL Editor'de çalıştırın
-- ============================================================

-- 1) notifications tablosu
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'system',
  title TEXT NOT NULL,
  message TEXT,
  data JSONB DEFAULT '{}',
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2) Indexler
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- 3) RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Kullanıcı sadece kendi bildirimlerini görebilir
CREATE POLICY "Kullanici kendi bildirimlerini gorur"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Sistem (service_role) bildirim oluşturabilir, kullanıcı da kendi bildirimi oluşturabilir
CREATE POLICY "Bildirim olusturma"
  ON public.notifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Kullanıcı sadece kendi bildirimlerini güncelleyebilir (okundu işaretleme)
CREATE POLICY "Kullanici bildirimlerini gunceller"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4) Realtime aktif et
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
