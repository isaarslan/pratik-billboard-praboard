/**
 * TV Display Ekrani
 *
 * Bu ekran, dijital billboard / TV cihazinda tam ekran olarak calisir.
 * Firebase Firestore'dan gercek zamanli icerik ceker ve gosterir.
 *
 * Kullanim:
 *   Web'de URL'ye ?tv=PANEL_ID parametresi ekleyerek acilir.
 *   Ornegin: https://praboard.vercel.app/?tv=1
 *
 * Ozellikler:
 *   - Gercek zamanli icerik guncelleme (Firestore onSnapshot)
 *   - Birden fazla reklam arasi otomatik gecis
 *   - Heartbeat gondererek admin panelde online/offline durumu
 *   - Icerik yokken bekleme ekrani
 *   - Baglanti durumu gostergesi
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, Image, StyleSheet, Animated, Platform } from 'react-native';
import {
  subscribe,
  getActiveContentsByPanel,
  getTvPanels,
  updatePanelHeartbeat,
  updatePanelCurrentContent,
  registerPanel,
  fetchContentsDirectly,
  isSnapshotActive,
} from '../../services/tvContentService';

const HEARTBEAT_INTERVAL = 120000; // 2 dakika (kota tasarrufu)
const SLIDE_DURATION = 15000; // Varsayilan 15 saniye her reklam

export default function TVDisplayScreen({ panelId }) {
  const [contents, setContents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [panelInfo, setPanelInfo] = useState(null);
  const [connected, setConnected] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideTimerRef = useRef(null);

  // Panel bilgilerini ve iceriklerini guncelle
  const refreshData = useCallback(() => {
    const activeContents = getActiveContentsByPanel(panelId);
    setContents(activeContents);

    const panels = getTvPanels();
    const panel = panels.find((p) => p.id === panelId);
    if (panel) setPanelInfo(panel);
  }, [panelId]);

  // Firestore degisikliklerini dinle
  useEffect(() => {
    // Ilk yuklemede direkt Firestore'dan oku (tek seferlik)
    fetchContentsDirectly().then(() => {
      refreshData();
    });

    const unsubscribe = subscribe(() => {
      refreshData();
      setConnected(true);
    });

    // Sadece onSnapshot calismiyorsa fallback polling yap (60sn arayla)
    const pollTimer = setInterval(() => {
      if (!isSnapshotActive()) {
        fetchContentsDirectly().then(() => {
          refreshData();
        });
      }
    }, 60000);

    return () => {
      unsubscribe();
      clearInterval(pollTimer);
    };
  }, [refreshData]);

  // Paneli Firebase'e kaydet ve heartbeat gonder
  useEffect(() => {
    registerPanel(panelId, {
      status: 'online',
      lastHeartbeat: Date.now(),
    });

    const heartbeatTimer = setInterval(() => {
      updatePanelHeartbeat(panelId);
    }, HEARTBEAT_INTERVAL);

    return () => clearInterval(heartbeatTimer);
  }, [panelId]);

  // Saat guncelle
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Reklamlar arasi otomatik gecis
  useEffect(() => {
    if (contents.length <= 1) return;

    const duration = (contents[currentIndex]?.duration || 15) * 1000;

    slideTimerRef.current = setTimeout(() => {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        const nextIndex = (currentIndex + 1) % contents.length;
        setCurrentIndex(nextIndex);

        // Yeni icerigi panele kaydet
        if (contents[nextIndex]) {
          updatePanelCurrentContent(panelId, contents[nextIndex].id);
        }

        // Fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      });
    }, duration);

    return () => {
      if (slideTimerRef.current) clearTimeout(slideTimerRef.current);
    };
  }, [currentIndex, contents, fadeAnim, panelId]);

  // Aktif icerigi panele kaydet
  useEffect(() => {
    if (contents.length > 0 && contents[currentIndex]) {
      updatePanelCurrentContent(panelId, contents[currentIndex].id);
    }
  }, [currentIndex, contents, panelId]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const currentContent = contents[currentIndex];

  // ============================================================
  // ICERIK YOK - BEKLEME EKRANI
  // ============================================================
  if (!currentContent) {
    return (
      <View style={styles.container}>
        <View style={styles.waitingScreen}>
          {/* Ust bilgi bari */}
          <View style={styles.topBar}>
            <View style={styles.topBarLeft}>
              <View style={[styles.connectionDot, { backgroundColor: connected ? '#2ECC71' : '#E74C3C' }]} />
              <Text style={styles.topBarText}>
                {panelInfo?.name || `Panel ${panelId}`}
              </Text>
            </View>
            <Text style={styles.topBarTime}>{formatTime(currentTime)}</Text>
          </View>

          {/* Orta logo ve mesaj */}
          <View style={styles.waitingCenter}>
            <Text style={styles.waitingLogo}>PRABOARD</Text>
            <Text style={styles.waitingSubtitle}>Dijital Billboard Sistemi</Text>
            <View style={styles.waitingDivider} />
            <Text style={styles.waitingMessage}>Reklam Bekleniyor</Text>
            <Text style={styles.waitingHint}>
              Admin panelden icerik onaylandiginda{'\n'}burada otomatik gosterilecektir.
            </Text>

            {/* Pulsing dot animation */}
            <View style={styles.pulsingContainer}>
              <View style={styles.pulsingDot} />
            </View>
          </View>

          {/* Alt bilgi */}
          <View style={styles.bottomBar}>
            <Text style={styles.bottomBarText}>{formatDate(currentTime)}</Text>
            <Text style={styles.bottomBarText}>Panel ID: {panelId}</Text>
          </View>
        </View>
      </View>
    );
  }

  // ============================================================
  // REKLAM GOSTERIM EKRANI
  // ============================================================
  return (
    <View style={styles.container}>
      {/* Tam ekran reklam gorseli */}
      <Animated.View style={[styles.adContainer, { opacity: fadeAnim }]}>
        <Image
          source={{ uri: currentContent.mediaUrl }}
          style={styles.adImage}
          resizeMode="cover"
        />

        {/* Reklam bilgi katmani (altta) */}
        <View style={styles.adOverlay}>
          <View style={styles.adOverlayContent}>
            <Text style={styles.adTitle} numberOfLines={2}>{currentContent.adTitle}</Text>
            {contents.length > 1 && (
              <View style={styles.slideIndicator}>
                {contents.map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.slideIndicatorDot,
                      i === currentIndex && styles.slideIndicatorDotActive,
                    ]}
                  />
                ))}
              </View>
            )}
          </View>
        </View>
      </Animated.View>

      {/* Ust bilgi bari (yari seffaf) */}
      <View style={styles.tvTopBar}>
        <View style={styles.topBarLeft}>
          <View style={[styles.connectionDot, { backgroundColor: connected ? '#2ECC71' : '#E74C3C' }]} />
          <Text style={styles.tvTopBarText}>{panelInfo?.name || `Panel ${panelId}`}</Text>
        </View>
        <View style={styles.topBarRight}>
          <Text style={styles.tvTopBarText}>{formatTime(currentTime)}</Text>
          {contents.length > 1 && (
            <Text style={styles.tvSlideCounter}>{currentIndex + 1}/{contents.length}</Text>
          )}
        </View>
      </View>

      {/* Ilerleme cubugu */}
      {contents.length > 1 && (
        <View style={styles.progressBarContainer}>
          <ProgressBar
            duration={(currentContent.duration || 15) * 1000}
            key={`${currentIndex}-${currentContent.id}`}
          />
        </View>
      )}
    </View>
  );
}

// Ilerleme cubugu (reklam suresi gostergesi)
function ProgressBar({ duration }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: duration,
      useNativeDriver: false,
    }).start();
  }, [duration, progress]);

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.progressBar}>
      <Animated.View style={[styles.progressFill, { width }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    ...(Platform.OS === 'web' ? {
      width: '100vw',
      height: '100vh',
      maxWidth: '100%',
      overflow: 'hidden',
      cursor: 'none',
    } : {}),
  },

  // ============================================================
  // BEKLEME EKRANI
  // ============================================================
  waitingScreen: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  connectionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  topBarText: {
    color: '#888',
    fontSize: 16,
    fontWeight: '500',
  },
  topBarTime: {
    color: '#888',
    fontSize: 16,
    fontWeight: '500',
  },
  waitingCenter: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  waitingLogo: {
    color: '#FF4B4B',
    fontSize: 64,
    fontWeight: '900',
    letterSpacing: 8,
  },
  waitingSubtitle: {
    color: '#555',
    fontSize: 20,
    fontWeight: '400',
    marginTop: 8,
    letterSpacing: 4,
  },
  waitingDivider: {
    width: 80,
    height: 2,
    backgroundColor: '#333',
    marginVertical: 40,
  },
  waitingMessage: {
    color: '#ccc',
    fontSize: 28,
    fontWeight: '300',
  },
  waitingHint: {
    color: '#555',
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 24,
  },
  pulsingContainer: {
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulsingDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF4B4B',
    opacity: 0.6,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  bottomBarText: {
    color: '#444',
    fontSize: 14,
    fontWeight: '400',
  },

  // ============================================================
  // REKLAM GOSTERIM EKRANI
  // ============================================================
  adContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  adImage: {
    width: '100%',
    height: '100%',
  },
  adOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 40,
    paddingBottom: 30,
    paddingTop: 60,
    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
    ...(Platform.OS !== 'web' ? { backgroundColor: 'rgba(0,0,0,0.4)' } : {}),
  },
  adOverlayContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  adTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    flex: 1,
    marginRight: 20,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  slideIndicator: {
    flexDirection: 'row',
    gap: 6,
  },
  slideIndicatorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  slideIndicatorDotActive: {
    backgroundColor: '#FF4B4B',
    width: 28,
    borderRadius: 5,
  },

  // TV ust bar (reklam gosterirken)
  tvTopBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  tvTopBarText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
  tvSlideCounter: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    fontWeight: '600',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },

  // Ilerleme cubugu
  progressBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF4B4B',
  },
});
