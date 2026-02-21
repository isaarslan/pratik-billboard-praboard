import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

export default function VideoPreview({ uri, style, shouldPlay = false }) {
  // Web: expo-video web'de HTML <video> kullanir, calismali
  // Native: expo-video native VideoView kullanir
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
