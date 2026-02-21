import { Platform } from 'react-native';

/**
 * Video URI'den thumbnail (ilk kare) cikarir.
 * Web: Canvas API ile - blob: URL'ler icin CORS sorunu yok
 * Native: expo-video-thumbnails kullanir
 */
export async function extractThumbnail(videoUri) {
  if (Platform.OS === 'web') {
    return extractThumbnailWeb(videoUri);
  }
  return extractThumbnailNative(videoUri);
}

function extractThumbnailWeb(videoUri) {
  return new Promise((resolve) => {
    let resolved = false;
    const done = (result) => {
      if (resolved) return;
      resolved = true;
      resolve(result);
    };

    try {
      const video = document.createElement('video');
      video.muted = true;
      video.playsInline = true;
      // blob: URL'ler icin crossOrigin gerekli degil, sadece remote icin
      if (!videoUri.startsWith('blob:')) {
        video.crossOrigin = 'anonymous';
      }
      video.preload = 'auto';
      video.src = videoUri;

      video.onloadeddata = () => {
        // 0.1 saniyeye atla (kisa videolar icin guvenli)
        video.currentTime = 0.1;
      };

      video.onseeked = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth || 1280;
          canvas.height = video.videoHeight || 720;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          // Temizlik
          video.pause();
          video.removeAttribute('src');
          video.load();
          done(dataUrl);
        } catch {
          done(null);
        }
      };

      video.onerror = () => done(null);

      // 8 saniye timeout
      setTimeout(() => done(null), 8000);
    } catch {
      done(null);
    }
  });
}

async function extractThumbnailNative(videoUri) {
  try {
    const VideoThumbnails = require('expo-video-thumbnails');
    const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
      time: 100, // 0.1 saniye
      quality: 0.7,
    });
    return uri;
  } catch {
    return null;
  }
}
