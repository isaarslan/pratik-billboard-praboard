-- ============================================================
-- Praboard: Avatar Storage Bucket ve Politikaları
-- Supabase Dashboard > SQL Editor'de çalıştırın
-- ============================================================

-- 1) avatars bucket oluştur (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 2) Eski policy'leri temizle (varsa)
DROP POLICY IF EXISTS "Avatar resimleri herkese acik" ON storage.objects;
DROP POLICY IF EXISTS "Kullanici kendi avatarini yukler" ON storage.objects;
DROP POLICY IF EXISTS "Kullanici kendi avatarini gunceller" ON storage.objects;
DROP POLICY IF EXISTS "Kullanici kendi avatarini siler" ON storage.objects;

-- 3) Herkes avatar görebilir (public bucket)
CREATE POLICY "Avatar resimleri herkese acik"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- 4) Giriş yapmış kullanıcılar kendi klasörlerine yükleyebilir
--    Dosya yolu: {user_id}/avatar_xxx.jpg
--    name sütunu zaten tam yolu içerir, ilk segment = user_id
CREATE POLICY "Kullanici kendi avatarini yukler"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid() IS NOT NULL
    AND SPLIT_PART(name, '/', 1) = auth.uid()::text
  );

-- 5) Kullanıcı kendi avatarını güncelleyebilir (upsert için)
CREATE POLICY "Kullanici kendi avatarini gunceller"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.uid() IS NOT NULL
    AND SPLIT_PART(name, '/', 1) = auth.uid()::text
  );

-- 6) Kullanıcı kendi eski avatarını silebilir
CREATE POLICY "Kullanici kendi avatarini siler"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND auth.uid() IS NOT NULL
    AND SPLIT_PART(name, '/', 1) = auth.uid()::text
  );
