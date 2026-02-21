import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';

// Web: dogrudan HTML <video> kullan (expo-video web'de sorunlu)
// Native: expo-video kullan
function VideoPreviewNative({ uri, style, shouldPlay = false }) {
  const { useVideoPlayer, VideoView } = require('expo-video');
  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
    if (shouldPlay) {
      p.play();
    }
  });

  return (
    <VideoView
      player={player}
      style={style}
      nativeControls
      contentFit="cover"
    />
  );
}

function VideoPreviewWeb({ uri, style }) {
  // React Native Web ortaminda React.createElement ile native HTML video olustur
  // preload="metadata" ilk kareyi yukler, poster olarak gosterir
  const flatStyle = StyleSheet.flatten(style) || {};
  return React.createElement('video', {
    src: uri,
    controls: true,
    playsInline: true,
    loop: true,
    preload: 'metadata',
    style: {
      width: flatStyle.width || '100%',
      aspectRatio: flatStyle.aspectRatio || '16/9',
      borderRadius: flatStyle.borderRadius || 12,
      backgroundColor: '#000',
      objectFit: 'cover',
      display: 'block',
    },
  });
}

export default function VideoPreview(props) {
  if (Platform.OS === 'web') {
    return <VideoPreviewWeb {...props} />;
  }
  return <VideoPreviewNative {...props} />;
}
