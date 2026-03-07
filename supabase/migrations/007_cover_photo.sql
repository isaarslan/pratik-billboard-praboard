-- ============================================================
-- Praboard: Kapak Fotoğrafı (Cover Photo) Desteği
-- Supabase Dashboard > SQL Editor'de çalıştırın
-- ============================================================

-- profiles tablosuna cover_url alanı ekle
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS cover_url TEXT;
