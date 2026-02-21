import { Platform } from 'react-native';

/**
 * Video URI'den thumbnail (ilk kare) cikarir.
 * Web: Canvas API ile aninda cikarir (ek paket gereksiz)
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
    try {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.src = videoUri;
      video.muted = true;
      video.preload = 'metadata';

      video.onloadeddata = () => {
        // 1. saniyeye atla (kapak karesi icin)
        video.currentTime = 1;
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
          video.src = '';
          video.load();
          resolve(dataUrl);
        } catch {
          resolve(null);
        }
      };

      video.onerror = () => {
        resolve(null);
      };

      // 5 saniye timeout - thumbnail cikaramazsa null don
      setTimeout(() => {
        if (!video.seeked) {
          video.src = '';
          video.load();
          resolve(null);
        }
      }, 5000);
    } catch {
      resolve(null);
    }
  });
}

async function extractThumbnailNative(videoUri) {
  try {
    const VideoThumbnails = require('expo-video-thumbnails');
    const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
      time: 1000, // 1. saniye
      quality: 0.7,
    });
    return uri;
  } catch {
    // expo-video-thumbnails yuklenmemis olabilir, null don
    return null;
  }
}
