/**
 * TV Display Ekrani — Dijital Billboard
 *
 * Gercek bir dijital billboard deneyimi.
 * Supabase Realtime ile gercek zamanli icerik ceker ve gosterir.
 *
 * Kullanim:
 *   Web'de URL'ye ?tv=PANEL_ID parametresi ekleyerek acilir.
 *   Ornegin: https://praboard.vercel.app/?tv=1
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, Image, StyleSheet, Animated, Platform, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import VideoPreview from '../../components/VideoPreview';
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
import { recordImpression } from '../../services/analyticsService';

const HEARTBEAT_INTERVAL = 120000;
const SLIDE_DURATION = 15000;

export default function TVDisplayScreen({ panelId }) {
  const [contents, setContents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [panelInfo, setPanelInfo] = useState(null);
  const [connected, setConnected] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [soundEnabled, setSoundEnabled] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideTimerRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  // Pulse animasyonu
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.4, duration: 1500, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  const refreshData = useCallback(() => {
    const activeContents = getActiveContentsByPanel(panelId);
    setContents(activeContents);
    const panels = getTvPanels();
    const panel = panels.find((p) => p.id === panelId);
    if (panel) setPanelInfo(panel);
  }, [panelId]);

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      refreshData();
      setConnected(true);
    });

    const initialFetch = async () => {
      await fetchContentsDirectly();
      refreshData();
      setTimeout(async () => {
        await fetchContentsDirectly();
        refreshData();
      }, 2000);
    };
    initialFetch();

    const pollTimer = setInterval(() => {
      fetchContentsDirectly().then(() => refreshData());
    }, 30000);

    return () => {
      unsubscribe();
      clearInterval(pollTimer);
    };
  }, [refreshData]);

  useEffect(() => {
    registerPanel(panelId, { status: 'online', lastHeartbeat: Date.now() });
    const heartbeatTimer = setInterval(() => updatePanelHeartbeat(panelId), HEARTBEAT_INTERVAL);
    return () => clearInterval(heartbeatTimer);
  }, [panelId]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (contents.length <= 1) return;
    const duration = (contents[currentIndex]?.duration || 15) * 1000;

    slideTimerRef.current = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0, duration: 800, useNativeDriver: true,
      }).start(() => {
        const nextIndex = (currentIndex + 1) % contents.length;
        setCurrentIndex(nextIndex);
        if (contents[nextIndex]) updatePanelCurrentContent(panelId, contents[nextIndex].id);
        Animated.timing(fadeAnim, {
          toValue: 1, duration: 800, useNativeDriver: true,
        }).start();
      });
    }, duration);

    return () => { if (slideTimerRef.current) clearTimeout(slideTimerRef.current); };
  }, [currentIndex, contents, fadeAnim, panelId]);

  useEffect(() => {
    if (contents.length > 0 && contents[currentIndex]) {
      updatePanelCurrentContent(panelId, contents[currentIndex].id);
      // Gösterim kaydı
      const c = contents[currentIndex];
      recordImpression({
        adId: c.adId || c.id,
        orderId: c.orderId || null,
        panelId,
        durationMs: (c.duration || 15) * 1000,
      });
    }
  }, [currentIndex, contents, panelId]);

  const formatTime = (date) => date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  const formatTimeFull = (date) => date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const formatDate = (date) => date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

  const currentContent = contents[currentIndex];

  // ============================================================
  // BEKLEME EKRANI — Sinematik Billboard Bekleme
  // ============================================================
  if (!currentContent) {
    return (
      <View style={styles.container}>
        <View style={styles.waitingScreen}>
          {/* Dekoratif köşe çizgileri */}
          <View style={[styles.cornerLine, styles.cornerTL]} />
          <View style={[styles.cornerLine, styles.cornerTR]} />
          <View style={[styles.cornerLine, styles.cornerBL]} />
          <View style={[styles.cornerLine, styles.cornerBR]} />

          {/* Üst bar */}
          <View style={styles.topBar}>
            <View style={styles.topBarLeft}>
              <Animated.View style={[styles.connectionDot, {
                backgroundColor: connected ? '#FF4B4B' : '#E74C3C',
                opacity: pulseAnim,
              }]} />
              <Text style={styles.topBarPanelName}>
                {panelInfo?.name || `PANEL ${panelId}`}
              </Text>
            </View>
            <View style={styles.topBarRight}>
              <Text style={styles.topBarDate}>{formatDate(currentTime)}</Text>
            </View>
          </View>

          {/* Merkez — Büyük Billboard Logo */}
          <View style={styles.waitingCenter}>
            <View style={styles.logoContainer}>
              <Text style={styles.waitingLogoP}>P</Text>
              <View style={styles.logoDividerV} />
            </View>
            <Text style={styles.waitingBrandName}>PRABOARD</Text>
            <Text style={styles.waitingTagline}>DIGITAL BILLBOARD NETWORK</Text>

            <View style={styles.waitingDivider} />

            <View style={styles.clockContainer}>
              <Text style={styles.clockTime}>{formatTimeFull(currentTime)}</Text>
            </View>

            <View style={styles.statusContainer}>
              <Animated.View style={[styles.statusDot, { opacity: pulseAnim }]} />
              <Text style={styles.statusText}>YAYIN BEKLENİYOR</Text>
            </View>

            <Text style={styles.waitingHint}>
              Reklam içeriği onaylandığında otomatik olarak yayına başlayacaktır
            </Text>
          </View>

          {/* Alt bar */}
          <View style={styles.bottomBar}>
            <View style={styles.bottomBarLeft}>
              <View style={styles.networkBadge}>
                <View style={[styles.networkDot, { backgroundColor: connected ? '#FF4B4B' : '#555' }]} />
                <Text style={styles.networkText}>{connected ? 'ONLINE' : 'OFFLINE'}</Text>
              </View>
            </View>
            <Text style={styles.bottomBarId}>ID: {panelId}</Text>
          </View>
        </View>
      </View>
    );
  }

  // ============================================================
  // REKLAM GÖSTERİM — Sinematik Billboard
  // ============================================================
  return (
    <View style={styles.container}>
      {/* Tam ekran reklam */}
      <Animated.View style={[styles.adContainer, { opacity: fadeAnim }]}>
        {currentContent.mediaType === 'video' ? (
          <VideoPreview
            uri={currentContent.mediaUrl}
            style={styles.adMedia}
            shouldPlay
            muted={!soundEnabled}
          />
        ) : (
          <Image
            source={{ uri: currentContent.mediaUrl }}
            style={styles.adMedia}
            resizeMode="cover"
          />
        )}
      </Animated.View>

      {/* Üst bar — Billboard bilgi şeridi */}
      <View style={styles.tvTopBar}>
        <View style={styles.tvTopBarInner}>
          <View style={styles.topBarLeft}>
            <View style={styles.tvBrandBadge}>
              <Text style={styles.tvBrandLetter}>P</Text>
            </View>
            <View>
              <Text style={styles.tvPanelName}>{panelInfo?.name || `Panel ${panelId}`}</Text>
              <Text style={styles.tvPanelLocation}>Praboard Digital Network</Text>
            </View>
          </View>
          <View style={styles.topBarRight}>
            <Text style={styles.tvClock}>{formatTime(currentTime)}</Text>
            {contents.length > 1 && (
              <View style={styles.tvSlideCounterBadge}>
                <Text style={styles.tvSlideCounterText}>{currentIndex + 1} / {contents.length}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Alt bilgi katmanı — Reklam başlığı ve göstergeler */}
      <View style={styles.adBottomOverlay}>
        <View style={styles.adBottomContent}>
          <View style={styles.adTitleSection}>
            <Text style={styles.adTitle} numberOfLines={2}>{currentContent.adTitle}</Text>
            {currentContent.campaignDetails && (
              <Text style={styles.adSubtitle} numberOfLines={1}>{currentContent.campaignDetails}</Text>
            )}
          </View>
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

      {/* Ses kontrol */}
      {currentContent.mediaType === 'video' && (
        <TouchableOpacity
          style={styles.soundButton}
          onPress={() => setSoundEnabled((prev) => !prev)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={soundEnabled ? 'volume-high' : 'volume-mute'}
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
      )}

      {/* İlerleme çubuğu */}
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

function ProgressBar({ duration }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1, duration: duration, useNativeDriver: false,
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
    backgroundColor: '#080808',
    justifyContent: 'space-between',
  },

  // Köşe dekor çizgileri
  cornerLine: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderColor: 'rgba(255, 75, 75, 0.15)',
    zIndex: 2,
  },
  cornerTL: { top: 20, left: 20, borderTopWidth: 2, borderLeftWidth: 2 },
  cornerTR: { top: 20, right: 20, borderTopWidth: 2, borderRightWidth: 2 },
  cornerBL: { bottom: 20, left: 20, borderBottomWidth: 2, borderLeftWidth: 2 },
  cornerBR: { bottom: 20, right: 20, borderBottomWidth: 2, borderRightWidth: 2 },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 50,
    paddingVertical: 28,
    zIndex: 3,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  connectionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  topBarPanelName: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  topBarDate: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 1,
  },

  // Merkez
  waitingCenter: {
    alignItems: 'center',
    paddingHorizontal: 60,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: '#FF4B4B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#FF4B4B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 40,
    elevation: 20,
  },
  waitingLogoP: {
    color: '#fff',
    fontSize: 72,
    fontWeight: '900',
    marginTop: -4,
  },
  logoDividerV: {
    display: 'none',
  },
  waitingBrandName: {
    color: '#fff',
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 12,
  },
  waitingTagline: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 6,
    marginTop: 8,
  },
  waitingDivider: {
    width: 60,
    height: 1,
    backgroundColor: 'rgba(255, 75, 75, 0.3)',
    marginVertical: 40,
  },
  clockContainer: {
    marginBottom: 32,
  },
  clockTime: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 56,
    fontWeight: '200',
    letterSpacing: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4B4B',
  },
  statusText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 4,
  },
  waitingHint: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 13,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Alt bar
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 50,
    paddingVertical: 24,
  },
  bottomBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  networkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  networkDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  networkText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
  },
  bottomBarId: {
    color: 'rgba(255,255,255,0.15)',
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 1,
  },

  // ============================================================
  // REKLAM GÖSTERİM
  // ============================================================
  adContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  adMedia: {
    width: '100%',
    height: '100%',
    ...(Platform.OS === 'web' ? {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    } : {}),
  },

  // Üst bar — reklam gösteriminde
  tvTopBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    background: 'linear-gradient(rgba(0,0,0,0.6), transparent)',
    ...(Platform.OS !== 'web' ? { backgroundColor: 'rgba(0,0,0,0.4)' } : {}),
  },
  tvTopBarInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 18,
  },
  tvBrandBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FF4B4B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tvBrandLetter: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
  },
  tvPanelName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  tvPanelLocation: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    fontWeight: '400',
    letterSpacing: 1,
    marginTop: 1,
  },
  tvClock: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
  tvSlideCounterBadge: {
    backgroundColor: 'rgba(255, 75, 75, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  tvSlideCounterText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },

  // Alt overlay — reklam başlığı
  adBottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 80,
    paddingBottom: 28,
    paddingHorizontal: 32,
    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
    ...(Platform.OS !== 'web' ? { backgroundColor: 'rgba(0,0,0,0.5)' } : {}),
  },
  adBottomContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  adTitleSection: {
    flex: 1,
    marginRight: 20,
  },
  adTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    lineHeight: 36,
  },
  adSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    fontWeight: '400',
    marginTop: 6,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  slideIndicator: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  slideIndicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  slideIndicatorDotActive: {
    backgroundColor: '#FF4B4B',
    width: 32,
    borderRadius: 4,
  },

  // Ses butonu
  soundButton: {
    position: 'absolute',
    bottom: 70,
    right: 32,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },

  // İlerleme çubuğu
  progressBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF4B4B',
  },
});
