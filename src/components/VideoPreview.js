import React from 'react';
import { Platform, View } from 'react-native';

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
  return (
    <View style={[style, { overflow: 'hidden' }]}>
      {React.createElement('video', {
        src: uri,
        controls: true,
        playsInline: true,
        loop: true,
        style: {
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: 12,
          backgroundColor: '#000',
        },
      })}
    </View>
  );
}

export default function VideoPreview(props) {
  if (Platform.OS === 'web') {
    return <VideoPreviewWeb {...props} />;
  }
  return <VideoPreviewNative {...props} />;
}
