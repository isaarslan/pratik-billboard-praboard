import { supabase } from '../config/supabase';

/**
 * Kullanıcı profilini getir
 */
export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

/**
 * Kullanıcı profilini güncelle
 */
export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * Kullanıcı adı müsait mi kontrol et
 * @returns {boolean} true = kullanılabilir
 */
export async function checkUsernameAvailable(username) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .ilike('username', username)
    .maybeSingle();
  if (error) throw error;
  return !data; // data yoksa müsait
}

/**
 * Kullanıcı adı kaydet
 */
export async function setUsername(userId, username) {
  return updateProfile(userId, { username });
}

/**
 * Profil fotoğrafı yükle
 */
export async function uploadAvatar(userId, fileUri) {
  const fileName = `${userId}/avatar_${Date.now()}.jpg`;

  const response = await fetch(fileUri);
  const arrayBuffer = await response.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, arrayBuffer, { contentType: 'image/jpeg', upsert: true });
  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);

  await updateProfile(userId, { avatar_url: publicUrl });
  return publicUrl;
}
