import React, { useState, useRef, useEffect } from 'react';
import { Platform, View, StyleSheet, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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

// Web: DOM video elementine ref ile event baglama (RN Web synthetic event sorunu yok)
function VideoPreviewWeb({ uri, poster, style }) {
  const [showPoster, setShowPoster] = useState(!!poster);
  const videoRef = useRef(null);
  const flatStyle = StyleSheet.flatten(style) || {};

  // Video DOM elementine direkt ref ile event bagla
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const handler = () => setShowPoster(false);
    el.addEventListener('play', handler);
    return () => el.removeEventListener('play', handler);
  }, []);

  const containerStyle = {
    width: flatStyle.width || '100%',
    aspectRatio: flatStyle.aspectRatio || '16/9',
    borderRadius: flatStyle.borderRadius || 12,
    backgroundColor: '#000',
    position: 'relative',
    overflow: 'hidden',
  };

  // Poster varsa thumbnail + play butonu goster
  if (showPoster && poster) {
    return (
      <Pressable onPress={() => setShowPoster(false)}>
        <View style={containerStyle}>
          <Image
            source={{ uri: poster }}
            style={{ width: '100%', height: '100%', borderRadius: flatStyle.borderRadius || 12 }}
            resizeMode="cover"
          />
          <View style={webStyles.playOverlay}>
            <View style={webStyles.playButton}>
              <Ionicons name="play" size={32} color="#fff" />
            </View>
          </View>
        </View>
      </Pressable>
    );
  }

  // Video oynatici - hicbir overlay yok, direkt native video
  return React.createElement('video', {
    ref: videoRef,
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

const webStyles = StyleSheet.create({
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 4,
  },
});

export default function VideoPreview(props) {
  if (Platform.OS === 'web') {
    return <VideoPreviewWeb {...props} />;
  }
  return <VideoPreviewNative {...props} />;
}
