-- ============================================================
-- Praboard: Avatar Storage Bucket ve Politikaları
-- Supabase Dashboard > SQL Editor'de çalıştırın
-- ============================================================

-- 1) avatars bucket oluştur (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 2) Herkes avatar görebilir (public bucket)
CREATE POLICY "Avatar resimleri herkese acik"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- 3) Giriş yapmış kullanıcılar kendi klasörlerine yükleyebilir
CREATE POLICY "Kullanici kendi avatarini yukler"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 4) Kullanıcı kendi avatarını güncelleyebilir (upsert için)
CREATE POLICY "Kullanici kendi avatarini gunceller"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 5) Kullanıcı kendi eski avatarını silebilir
CREATE POLICY "Kullanici kendi avatarini siler"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
