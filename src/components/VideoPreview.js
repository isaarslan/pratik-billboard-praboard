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
      nativeControls={!shouldPlay}
      contentFit="cover"
    />
  );
}

// Web: shouldPlay=true ise TV modu (autoplay, kontrol yok), degilse normal preview
function VideoPreviewWeb({ uri, poster, style, shouldPlay = false, muted: mutedProp }) {
  const isMuted = mutedProp !== undefined ? mutedProp : shouldPlay;
  const [showPoster, setShowPoster] = useState(!shouldPlay && !!poster);
  const videoRef = useRef(null);
  const flatStyle = StyleSheet.flatten(style) || {};

  // shouldPlay modunda: DOM'a mount olunca otomatik oynat
  useEffect(() => {
    if (!shouldPlay) return;
    const el = videoRef.current;
    if (!el) return;
    el.muted = isMuted;
    el.play().catch(() => {
      // Sesli autoplay engellendiyse sessiz dene
      el.muted = true;
      el.play().catch(() => {});
    });
  }, [shouldPlay, uri, isMuted]);

  // muted prop degisince video elementini guncelle
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = isMuted;
  }, [isMuted]);

  // Normal modda play eventini dinle
  useEffect(() => {
    if (shouldPlay) return;
    const el = videoRef.current;
    if (!el) return;
    const handler = () => setShowPoster(false);
    el.addEventListener('play', handler);
    return () => el.removeEventListener('play', handler);
  }, [shouldPlay]);

  const containerStyle = {
    width: flatStyle.width || '100%',
    height: flatStyle.height || undefined,
    aspectRatio: flatStyle.height ? undefined : (flatStyle.aspectRatio || 4/3),
    borderRadius: shouldPlay ? 0 : (flatStyle.borderRadius || 0),
    backgroundColor: '#000',
    position: 'relative',
    overflow: 'hidden',
  };

  // Poster modu (sadece normal preview icin, TV modunda devre disi)
  if (showPoster && poster && !shouldPlay) {
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

  // Video oynatici
  return (
    <View style={containerStyle}>
      {React.createElement('video', {
        ref: videoRef,
        src: uri,
        controls: !shouldPlay,
        playsInline: true,
        loop: true,
        muted: isMuted,
        autoPlay: shouldPlay,
        preload: shouldPlay ? 'auto' : 'metadata',
        style: {
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: shouldPlay ? 0 : (flatStyle.borderRadius || 0),
          backgroundColor: '#000',
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0,
        },
      })}
    </View>
  );
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
