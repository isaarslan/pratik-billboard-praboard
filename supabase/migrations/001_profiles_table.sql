-- ============================================================
-- Praboard: Kullanıcı Profilleri Tablosu
-- Supabase Dashboard > SQL Editor'de çalıştırın
-- ============================================================

-- 1) profiles tablosu
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  username TEXT UNIQUE,
  phone TEXT,
  email TEXT,
  avatar_url TEXT,
  bio TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2) username için hızlı arama indexi
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_username
  ON public.profiles (LOWER(username));

-- 3) RLS (Row Level Security) aktif et
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4) RLS Politikaları

-- Herkes profilleri okuyabilir (public profil)
CREATE POLICY "Profiller herkese açık"
  ON public.profiles FOR SELECT
  USING (true);

-- Kullanıcı sadece kendi profilini oluşturabilir
CREATE POLICY "Kullanici kendi profilini olusturur"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Kullanıcı sadece kendi profilini güncelleyebilir
CREATE POLICY "Kullanici kendi profilini gunceller"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 5) Yeni kullanıcı kaydında otomatik profil oluştur (trigger)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: auth.users'a yeni kayıt eklendiğinde tetiklenir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 6) updated_at otomatik güncelle
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;
CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
