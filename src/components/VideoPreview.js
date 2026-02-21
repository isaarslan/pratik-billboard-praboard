import React, { useState } from 'react';
import { Platform, View, StyleSheet, ActivityIndicator, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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

function VideoPreviewWeb({ uri, poster, style }) {
  const [isLoading, setIsLoading] = useState(true);
  const [playRequested, setPlayRequested] = useState(false);
  const flatStyle = StyleSheet.flatten(style) || {};

  const containerStyle = {
    width: flatStyle.width || '100%',
    aspectRatio: flatStyle.aspectRatio || 16 / 9,
    borderRadius: flatStyle.borderRadius || 12,
    backgroundColor: '#000',
    position: 'relative',
    overflow: 'hidden',
  };

  // Poster varsa ve henuz play istenmemisse thumbnail goster
  if (poster && !playRequested) {
    return (
      <Pressable onPress={() => setPlayRequested(true)}>
        <View style={containerStyle}>
          <Image
            source={{ uri: poster }}
            style={{ width: '100%', height: '100%', borderRadius: flatStyle.borderRadius || 12 }}
            resizeMode="cover"
          />
          {/* Play butonu overlay */}
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
      {isLoading && (
        <View style={webStyles.loadingOverlay}>
          {poster ? (
            <Image
              source={{ uri: poster }}
              style={{ width: '100%', height: '100%', position: 'absolute' }}
              resizeMode="cover"
            />
          ) : null}
          <ActivityIndicator size="large" color="#fff" style={{ zIndex: 1 }} />
        </View>
      )}
      {React.createElement('video', {
        src: uri,
        controls: true,
        playsInline: true,
        loop: true,
        autoPlay: playRequested,
        preload: 'auto',
        poster: poster || undefined,
        onCanPlay: () => setIsLoading(false),
        onLoadedData: () => setIsLoading(false),
        style: {
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: flatStyle.borderRadius || 12,
          display: 'block',
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    zIndex: 2,
  },
});

export default function VideoPreview(props) {
  if (Platform.OS === 'web') {
    return <VideoPreviewWeb {...props} />;
  }
  return <VideoPreviewNative {...props} />;
}
