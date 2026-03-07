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
 * blob: URI'sini base64'e çevir (web ortamı için)
 */
function blobUriToBase64(uri) {
  return new Promise((resolve, reject) => {
    fetch(uri)
      .then((res) => res.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      })
      .catch(reject);
  });
}

/**
 * base64 data URL'den Uint8Array oluştur
 */
function base64ToUint8Array(dataUrl) {
  const base64 = dataUrl.split(',')[1];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Profil fotoğrafı yükle
 */
export async function uploadAvatar(userId, fileUri) {
  const fileName = `${userId}/avatar_${Date.now()}.jpg`;

  let fileData;
  if (fileUri.startsWith('blob:') || fileUri.startsWith('data:')) {
    // Web: blob URI → base64 → Uint8Array
    const dataUrl = fileUri.startsWith('data:') ? fileUri : await blobUriToBase64(fileUri);
    fileData = base64ToUint8Array(dataUrl);
  } else {
    // Native: doğrudan fetch ile arrayBuffer
    const response = await fetch(fileUri);
    fileData = await response.arrayBuffer();
  }

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, fileData, { contentType: 'image/jpeg', upsert: true });
  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);

  await updateProfile(userId, { avatar_url: publicUrl });
  return publicUrl;
}

/**
 * Kapak fotoğrafı yükle
 */
export async function uploadCover(userId, fileUri) {
  const fileName = `${userId}/cover_${Date.now()}.jpg`;

  let fileData;
  if (fileUri.startsWith('blob:') || fileUri.startsWith('data:')) {
    const dataUrl = fileUri.startsWith('data:') ? fileUri : await blobUriToBase64(fileUri);
    fileData = base64ToUint8Array(dataUrl);
  } else {
    const response = await fetch(fileUri);
    fileData = await response.arrayBuffer();
  }

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, fileData, { contentType: 'image/jpeg', upsert: true });
  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);

  await updateProfile(userId, { cover_url: publicUrl });
  return publicUrl;
}
