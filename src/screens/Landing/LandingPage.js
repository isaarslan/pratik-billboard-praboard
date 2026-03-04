import React, { useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import PraboardLogo from '../../components/PraboardLogo';
import WebMap from '../../components/WebMap';

/* ─────────────────────────── constants ─────────────────────────── */

const BLUR = Platform.select({
  web: { backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' },
  default: {},
});

// Ferah emerald — koyu yeşil temayla kontrast, aydınlık his
const ACCENT = '#34D399';

// Landing harita demo marker'ları — gerçek Türkiye koordinatları
const LANDING_MARKERS = [
  { id: 1,  lat: 41.015, lng: 28.979, label: 'İst. Kadıköy',   color: '#1B8A4A' },
  { id: 2,  lat: 41.060, lng: 28.994, label: 'İst. Beşiktaş',  color: '#1B8A4A' },
  { id: 3,  lat: 40.993, lng: 29.128, label: 'İst. Üsküdar',   color: '#27AE60' },
  { id: 4,  lat: 40.900, lng: 29.350, label: 'İst. Maltepe',   color: '#27AE60' },
  { id: 5,  lat: 39.925, lng: 32.836, label: 'Ank. Kızılay',   color: '#1B8A4A' },
  { id: 6,  lat: 39.880, lng: 32.750, label: 'Ank. Çankaya',   color: '#1B8A4A' },
  { id: 7,  lat: 38.423, lng: 27.142, label: 'İzm. Alsancak',  color: '#1B8A4A' },
  { id: 8,  lat: 38.460, lng: 27.215, label: 'İzm. Bornova',   color: '#27AE60' },
  { id: 9,  lat: 40.183, lng: 29.061, label: 'Bursa Merkez',   color: '#27AE60' },
  { id: 10, lat: 36.897, lng: 30.713, label: 'Antalya',        color: '#1B8A4A' },
  { id: 11, lat: 37.001, lng: 35.329, label: 'Adana',          color: '#999999' },
  { id: 12, lat: 37.874, lng: 32.493, label: 'Konya',          color: '#27AE60' },
  { id: 13, lat: 37.060, lng: 37.383, label: 'Gaziantep',      color: '#999999' },
  { id: 14, lat: 41.284, lng: 36.330, label: 'Samsun',         color: '#1B8A4A' },
  { id: 15, lat: 39.760, lng: 30.524, label: 'Eskişehir',      color: '#27AE60' },
];

/* ─────────────────────────── helpers ─────────────────────────── */

function LogoMark({ size = 36, dark }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.25,
        backgroundColor: dark ? colors.eco.emerald : 'rgba(255,255,255,0.12)',
        borderWidth: dark ? 0 : 1,
        borderColor: dark ? 'transparent' : colors.glass.border,
        justifyContent: 'center',
        alignItems: 'center',
        ...(!dark ? BLUR : {}),
      }}
    >
      <PraboardLogo size={size * 0.62} variant="onGradient" />
    </View>
  );
}

/* ── Gerçek App Telefon Önizlemesi ── */
function PhoneMockup({ scale = 1 }) {
  const s = (v) => Math.round(v * scale);
  return (
    <View style={{ alignItems: 'center', position: 'relative' }}>
      {/* Telefon gövdesi */}
      <View
        style={{
          width: s(240),
          height: s(500),
          borderRadius: s(42),
          backgroundColor: '#1C1C1E',
          borderWidth: s(9),
          borderColor: '#2C2C2E',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: s(28) },
          shadowOpacity: 0.55,
          shadowRadius: s(44),
          elevation: 24,
          overflow: 'hidden',
        }}
      >
        {/* Notch */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            alignSelf: 'center',
            width: s(90),
            height: s(24),
            backgroundColor: '#1C1C1E',
            borderBottomLeftRadius: s(18),
            borderBottomRightRadius: s(18),
            zIndex: 10,
          }}
        />

        {/* Status bar */}
        <View
          style={{
            height: s(34),
            backgroundColor: colors.eco.emerald,
            paddingHorizontal: s(16),
            paddingTop: s(12),
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <Text style={{ color: '#fff', fontSize: s(9), fontWeight: '700' }}>9:41</Text>
          <Ionicons name="wifi" size={s(10)} color="#fff" />
        </View>

        {/* App header */}
        <View
          style={{
            backgroundColor: colors.eco.emerald,
            paddingHorizontal: s(14),
            paddingBottom: s(14),
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View>
            <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: s(9) }}>Merhaba 👋</Text>
            <Text style={{ color: '#fff', fontSize: s(14), fontWeight: '800', marginTop: s(2) }}>
              Panel Ağı
            </Text>
          </View>
          <View
            style={{
              width: s(30),
              height: s(30),
              borderRadius: s(15),
              backgroundColor: 'rgba(255,255,255,0.15)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Ionicons name="person-outline" size={s(15)} color="#fff" />
          </View>
        </View>

        {/* Screen body */}
        <View style={{ flex: 1, backgroundColor: '#F4F7F5', padding: s(10) }}>
          {/* Gerçek Leaflet haritası */}
          <View
            style={{
              height: s(130),
              borderRadius: s(12),
              marginBottom: s(10),
              overflow: 'hidden',
            }}
          >
            <WebMap
              markers={LANDING_MARKERS.slice(0, 5)}
              center={{ lat: 39.5, lng: 34.5 }}
              zoom={5}
              theme="light"
            />
          </View>

          {/* Panel kartları */}
          {[
            { name: 'İstanbul – Kadıköy', days: '12 gün', active: true },
            { name: 'Ankara – Kızılay',   days: '5 gün',  active: true },
            { name: 'İzmir – Alsancak',   days: 'Dolu',   active: false },
          ].map((p, i) => (
            <View
              key={i}
              style={{
                backgroundColor: '#fff',
                borderRadius: s(9),
                padding: s(8),
                marginBottom: s(6),
                flexDirection: 'row',
                alignItems: 'center',
                gap: s(8),
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
              }}
            >
              <View
                style={{
                  width: s(30),
                  height: s(30),
                  borderRadius: s(7),
                  backgroundColor: p.active ? colors.eco.mint : '#F3F4F6',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Ionicons
                  name="tv-outline"
                  size={s(14)}
                  color={p.active ? colors.eco.emerald : '#9CA3AF'}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: s(9), fontWeight: '700', color: '#111' }}>{p.name}</Text>
                <Text style={{ fontSize: s(7), color: p.active ? '#6B7280' : '#9CA3AF', marginTop: s(1) }}>
                  {p.active ? `Aktif · ${p.days} kaldı` : 'Dolu'}
                </Text>
              </View>
              <View
                style={{
                  width: s(7),
                  height: s(7),
                  borderRadius: s(4),
                  backgroundColor: p.active ? '#22C55E' : '#D1D5DB',
                }}
              />
            </View>
          ))}
        </View>

        {/* Bottom tab bar */}
        <View
          style={{
            backgroundColor: '#fff',
            flexDirection: 'row',
            paddingVertical: s(10),
            borderTopWidth: 0.5,
            borderColor: 'rgba(0,0,0,0.08)',
          }}
        >
          {[
            { icon: 'home-outline',          active: true },
            { icon: 'map-outline',            active: false },
            { icon: 'add-circle-outline',     active: false },
            { icon: 'notifications-outline',  active: false },
            { icon: 'person-outline',         active: false },
          ].map((t, i) => (
            <View key={i} style={{ flex: 1, alignItems: 'center' }}>
              <Ionicons
                name={t.icon}
                size={s(18)}
                color={t.active ? colors.eco.emerald : '#C4C4C4'}
              />
            </View>
          ))}
        </View>
      </View>

      {/* Floating badge — sağ üst */}
      <View
        style={{
          position: 'absolute',
          right: -s(24),
          top: s(72),
          backgroundColor: '#fff',
          borderRadius: s(14),
          paddingHorizontal: s(12),
          paddingVertical: s(10),
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12,
          shadowRadius: 12,
          elevation: 8,
          flexDirection: 'row',
          alignItems: 'center',
          gap: s(6),
        }}
      >
        <View style={{ width: s(24), height: s(24), borderRadius: s(12), backgroundColor: '#DCFCE7', justifyContent: 'center', alignItems: 'center' }}>
          <Ionicons name="trending-up" size={s(12)} color="#22C55E" />
        </View>
        <View>
          <Text style={{ fontSize: s(11), fontWeight: '800', color: '#111' }}>+42%</Text>
          <Text style={{ fontSize: s(8), color: '#6B7280' }}>Görüntülenme</Text>
        </View>
      </View>

      {/* Floating badge — sol alt */}
      <View
        style={{
          position: 'absolute',
          left: -s(28),
          bottom: s(90),
          backgroundColor: colors.eco.emerald,
          borderRadius: s(14),
          paddingHorizontal: s(12),
          paddingVertical: s(10),
          shadowColor: colors.eco.emerald,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 12,
          elevation: 8,
          flexDirection: 'row',
          alignItems: 'center',
          gap: s(6),
        }}
      >
        <Ionicons name="map-outline" size={s(14)} color="#fff" />
        <View>
          <Text style={{ fontSize: s(11), fontWeight: '800', color: '#fff' }}>150+</Text>
          <Text style={{ fontSize: s(8), color: 'rgba(255,255,255,0.7)' }}>Panel</Text>
        </View>
      </View>
    </View>
  );
}

/* ── Web Dashboard Önizlemesi ── */
function DashboardMockup({ scale = 1 }) {
  const s = (v) => Math.round(v * scale);
  return (
    <View
      style={{
        borderRadius: s(14),
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: s(24) },
        shadowOpacity: 0.5,
        shadowRadius: s(40),
        elevation: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.07)',
      }}
    >
      {/* Tarayıcı çerçevesi */}
      <View
        style={{
          backgroundColor: '#1E293B',
          paddingHorizontal: s(14),
          paddingVertical: s(10),
          flexDirection: 'row',
          alignItems: 'center',
          gap: s(8),
        }}
      >
        <View style={{ flexDirection: 'row', gap: s(5) }}>
          <View style={{ width: s(9), height: s(9), borderRadius: s(5), backgroundColor: '#EF4444' }} />
          <View style={{ width: s(9), height: s(9), borderRadius: s(5), backgroundColor: '#F59E0B' }} />
          <View style={{ width: s(9), height: s(9), borderRadius: s(5), backgroundColor: '#22C55E' }} />
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: '#0F172A',
            borderRadius: s(5),
            paddingHorizontal: s(10),
            paddingVertical: s(4),
          }}
        >
          <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: s(10) }}>
            app.praboard.com/dashboard
          </Text>
        </View>
      </View>

      {/* Dashboard içeriği */}
      <View style={{ backgroundColor: '#0F172A', padding: s(14) }}>
        {/* Üst istatistikler */}
        <View style={{ flexDirection: 'row', gap: s(8), marginBottom: s(14) }}>
          {[
            { label: 'Aktif Reklam', value: '24', color: '#22C55E', icon: 'megaphone-outline' },
            { label: 'Görüntülenme', value: '12.4K', color: '#3B82F6', icon: 'eye-outline' },
            { label: 'Bu Ay Gelir', value: '₺8.2K', color: ACCENT, icon: 'wallet-outline' },
          ].map((stat, i) => (
            <View
              key={i}
              style={{
                flex: 1,
                backgroundColor: '#1E293B',
                borderRadius: s(8),
                padding: s(10),
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.04)',
              }}
            >
              <Ionicons name={stat.icon} size={s(12)} color={stat.color} />
              <Text
                style={{ color: '#fff', fontSize: s(15), fontWeight: '700', marginTop: s(5) }}
              >
                {stat.value}
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: s(8), marginTop: s(2) }}>
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Bölüm başlığı */}
        <Text
          style={{
            color: 'rgba(255,255,255,0.4)',
            fontSize: s(9),
            fontWeight: '700',
            letterSpacing: 0.8,
            marginBottom: s(8),
          }}
        >
          AKTİF KAMPANYALAR
        </Text>

        {/* Reklam satırları */}
        {[
          { name: 'İstanbul – Kadıköy', status: 'Aktif', color: '#22C55E', days: '12 gün' },
          { name: 'Ankara – Kızılay', status: 'Onay', color: ACCENT, days: '5 gün' },
          { name: 'İzmir – Alsancak', status: 'Aktif', color: '#22C55E', days: '8 gün' },
        ].map((ad, i) => (
          <View
            key={i}
            style={{
              backgroundColor: '#1E293B',
              borderRadius: s(7),
              padding: s(9),
              marginBottom: s(6),
              flexDirection: 'row',
              alignItems: 'center',
              gap: s(10),
            }}
          >
            <View
              style={{
                width: s(38),
                height: s(24),
                backgroundColor: '#0D3320',
                borderRadius: s(4),
                borderWidth: 1,
                borderColor: 'rgba(27,138,74,0.3)',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Ionicons name="tv-outline" size={s(11)} color={colors.eco.leaf} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: s(10), fontWeight: '600' }}>
                {ad.name}
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: s(8), marginTop: s(1) }}>
                {ad.days} kaldı
              </Text>
            </View>
            <View
              style={{
                backgroundColor: `${ad.color}18`,
                paddingHorizontal: s(8),
                paddingVertical: s(3),
                borderRadius: s(100),
                borderWidth: 1,
                borderColor: `${ad.color}35`,
              }}
            >
              <Text style={{ color: ad.color, fontSize: s(8), fontWeight: '700' }}>
                {ad.status}
              </Text>
            </View>
          </View>
        ))}

        {/* Gerçek harita */}
        <View
          style={{
            marginTop: s(8),
            borderRadius: s(7),
            overflow: 'hidden',
            height: s(110),
          }}
        >
          <WebMap
            markers={LANDING_MARKERS.slice(0, 6)}
            center={{ lat: 39.0, lng: 35.0 }}
            zoom={5}
            theme="light"
          />
        </View>
      </View>
    </View>
  );
}

function StatItem({ number, label }) {
  return (
    <View style={{ alignItems: 'center', flex: 1 }}>
      <Text style={{ fontSize: 28, fontWeight: '800', color: '#fff', letterSpacing: -0.5 }}>
        {number}
      </Text>
      <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>{label}</Text>
    </View>
  );
}

function FeatureCard({ icon, title, description, isWide, index }) {
  const accents = [
    { bg: '#E8F5E9', icon: colors.eco.emerald, top: colors.eco.emerald },
    { bg: '#EFF6FF', icon: '#3B82F6', top: '#3B82F6' },
    { bg: '#FFF7ED', icon: '#F59E0B', top: '#F59E0B' },
    { bg: '#F5F3FF', icon: '#8B5CF6', top: '#8B5CF6' },
  ];
  const a = accents[index % accents.length];
  return (
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        flex: isWide ? 1 : undefined,
        width: isWide ? undefined : '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 16,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.04)',
        borderTopWidth: 3,
        borderTopColor: a.top,
      }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 13,
          backgroundColor: a.bg,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 14,
        }}
      >
        <Ionicons name={icon} size={23} color={a.icon} />
      </View>
      <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 8 }}>
        {title}
      </Text>
      <Text style={{ fontSize: 14, color: '#6B7280', lineHeight: 21 }}>{description}</Text>
    </View>
  );
}

function StepItem({ number, title, description, icon, isWide }) {
  return (
    <View style={{ flex: isWide ? 1 : undefined, alignItems: 'center', paddingHorizontal: 16 }}>
      <View
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: colors.eco.leaf,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 20,
          shadowColor: colors.eco.leaf,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.35,
          shadowRadius: 12,
        }}
      >
        <Ionicons name={icon} size={26} color="#fff" />
      </View>
      <Text
        style={{
          fontSize: 13,
          fontWeight: '700',
          color: colors.eco.leaf,
          marginBottom: 6,
          letterSpacing: 1,
        }}
      >
        ADIM {number}
      </Text>
      <Text
        style={{ fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 8, textAlign: 'center' }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: 15,
          color: 'rgba(255,255,255,0.65)',
          lineHeight: 22,
          textAlign: 'center',
          maxWidth: 260,
        }}
      >
        {description}
      </Text>
    </View>
  );
}

function Connector() {
  return (
    <View
      style={{
        width: 48,
        height: 2,
        backgroundColor: 'rgba(255,255,255,0.15)',
        marginTop: 30,
      }}
    />
  );
}

/* ── Gerçek Leaflet haritası — tarayıcı çerçevesiyle ── */
function MapPreview({ isWide, theme = 'dark' }) {
  return (
    <View
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.12,
        shadowRadius: 40,
        elevation: 16,
      }}
    >
      {/* Tarayıcı chrome */}
      <View
        style={{
          backgroundColor: '#1E293B',
          paddingHorizontal: 14,
          paddingVertical: 10,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <View style={{ flexDirection: 'row', gap: 5 }}>
          <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: '#EF4444' }} />
          <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: '#F59E0B' }} />
          <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: '#22C55E' }} />
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: '#0F172A',
            borderRadius: 5,
            paddingHorizontal: 10,
            paddingVertical: 4,
          }}
        >
          <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10 }}>
            app.praboard.com/panels
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {[
            { color: '#1B8A4A', label: 'Aktif' },
            { color: '#999',    label: 'Dolu' },
          ].map((l, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: l.color }} />
              <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 9 }}>{l.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Gerçek Leaflet haritası */}
      <View style={{ height: isWide ? 400 : 280 }}>
        <WebMap
          markers={LANDING_MARKERS}
          center={{ lat: 39.0, lng: 35.0 }}
          zoom={6}
          theme={theme}
        />
      </View>

    </View>
  );
}

/* ─────────────────────────── MAIN ─────────────────────────── */

export default function LandingPage({ navigation }) {
  const { width } = useWindowDimensions();
  const isWide = width >= 900;
  const maxW = 1100;
  const px = isWide ? 60 : 24;

  const scrollRef = useRef(null);
  const stepsOffsetY = useRef(0);

  const goTo = (screen) => navigation?.navigate(screen);
  const scrollToSteps = () =>
    scrollRef.current?.scrollTo({ y: stepsOffsetY.current, animated: true });

  return (
    <ScrollView
      ref={scrollRef}
      style={{ flex: 1, backgroundColor: '#F8FAFA' }}
      showsVerticalScrollIndicator={false}
    >
      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <LinearGradient
        colors={['#0A3D22', '#0F5C32', '#1A7A42']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ width: '100%', overflow: 'hidden', position: 'relative' }}
      >
        {/* Dekoratif blob'lar */}
        <View
          style={{
            position: 'absolute',
            right: -120,
            top: -100,
            width: 520,
            height: 520,
            borderRadius: 260,
            backgroundColor: 'rgba(27,138,74,0.08)',
          }}
        />
        <View
          style={{
            position: 'absolute',
            left: -80,
            bottom: '5%',
            width: 320,
            height: 320,
            borderRadius: 160,
            backgroundColor: 'rgba(52,211,153,0.04)',
          }}
        />

        {/* ─── Navbar ─── */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: maxW,
            alignSelf: 'center',
            width: '100%',
            paddingHorizontal: px,
            paddingTop: 28,
            paddingBottom: 16,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <LogoMark size={36} />
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700', letterSpacing: -0.3 }}>
              Praboard
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <TouchableOpacity
              onPress={() => goTo('Login')}
              style={{
                paddingHorizontal: 18,
                paddingVertical: 9,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.2)',
                backgroundColor: colors.glass.light,
                ...BLUR,
              }}
            >
              <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>Giriş Yap</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => goTo('Register')}
              style={{
                paddingHorizontal: 18,
                paddingVertical: 9,
                borderRadius: 10,
                backgroundColor: ACCENT,
                shadowColor: ACCENT,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 8,
              }}
            >
              <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>Kayıt Ol</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── Hero İçeriği ─── */}
        <View
          style={{
            maxWidth: maxW,
            alignSelf: 'center',
            width: '100%',
            paddingHorizontal: px,
            paddingTop: isWide ? 72 : 48,
            paddingBottom: isWide ? 80 : 60,
            flexDirection: isWide ? 'row' : 'column',
            alignItems: isWide ? 'center' : 'flex-start',
            gap: 48,
          }}
        >
          {/* Sol: Metin */}
          <View style={{ flex: isWide ? 1 : undefined, maxWidth: isWide ? 560 : undefined }}>
            {/* Eco badge */}
            <View
              style={{
                alignSelf: 'flex-start',
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.glass.light,
                borderWidth: 1,
                borderColor: colors.glass.border,
                borderRadius: 100,
                paddingHorizontal: 18,
                paddingVertical: 8,
                gap: 8,
                marginBottom: 28,
                ...BLUR,
              }}
            >
              <Ionicons name="leaf" size={15} color={colors.eco.leaf} />
              <Text style={{ color: colors.eco.sage, fontSize: 14, fontWeight: '600' }}>
                Çevreci · Pratik · Etkili
              </Text>
            </View>

            {/* Başlık */}
            <Text
              style={{
                color: '#fff',
                fontSize: isWide ? 56 : 36,
                fontWeight: '800',
                lineHeight: isWide ? 66 : 44,
                letterSpacing: -2,
              }}
            >
              Dijital Billboard{'\n'}Reklamcılığının{'\n'}
              <Text style={{ color: colors.eco.leaf }}>Geleceği</Text>
            </Text>

            {/* Alt başlık */}
            <Text
              style={{
                color: 'rgba(255,255,255,0.65)',
                fontSize: isWide ? 18 : 16,
                lineHeight: 27,
                marginTop: 20,
                maxWidth: 480,
              }}
            >
              Praboard ile çevreci dijital billboard ağına katılın.{'\n'}
              Düşük maliyetle, yüksek görünürlük elde edin.
            </Text>

            {/* CTA butonları */}
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 36, flexWrap: 'wrap' }}>
              <TouchableOpacity
                onPress={() => goTo('Register')}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: ACCENT,
                  paddingHorizontal: 24,
                  paddingVertical: 14,
                  borderRadius: 12,
                  gap: 8,
                  shadowColor: ACCENT,
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.4,
                  shadowRadius: 16,
                }}
              >
                <Ionicons name="rocket-outline" size={17} color="#fff" />
                <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>Hemen Başla</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={scrollToSteps}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 22,
                  paddingVertical: 14,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.18)',
                  backgroundColor: colors.glass.light,
                  gap: 8,
                  ...BLUR,
                }}
              >
                <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>Nasıl Çalışır?</Text>
                <Ionicons name="chevron-down" size={15} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Glass istatistikler */}
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: colors.glass.medium,
                borderWidth: 1,
                borderColor: colors.glass.border,
                borderRadius: 16,
                paddingVertical: 22,
                paddingHorizontal: 8,
                marginTop: 48,
                maxWidth: isWide ? 520 : undefined,
                ...BLUR,
              }}
            >
              <StatItem number="150+" label="Aktif Panel" />
              <View style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.1)' }} />
              <StatItem number="500+" label="Reklam Veren" />
              <View style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.1)' }} />
              <StatItem number="15+" label="Şehir" />
              <View style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.1)' }} />
              <StatItem number="%98" label="Memnuniyet" />
            </View>
          </View>

          {/* Sağ: Telefon mockup */}
          {isWide && (
            <View style={{ flex: 1, alignItems: 'center', paddingRight: 24 }}>
              <PhoneMockup scale={1} />
            </View>
          )}
        </View>
      </LinearGradient>

      {/* ═══════════════════════ ÖZELLİKLER ═══════════════════════ */}
      <View style={{ backgroundColor: '#F8FAFA', paddingVertical: isWide ? 96 : 60 }}>
        <View
          style={{ maxWidth: maxW, alignSelf: 'center', width: '100%', paddingHorizontal: px }}
        >
          <View style={{ alignItems: 'center', marginBottom: 48 }}>
            <View
              style={{
                backgroundColor: colors.eco.mint,
                paddingHorizontal: 14,
                paddingVertical: 5,
                borderRadius: 100,
                marginBottom: 14,
              }}
            >
              <Text
                style={{
                  color: colors.eco.emerald,
                  fontSize: 12,
                  fontWeight: '700',
                  letterSpacing: 0.5,
                }}
              >
                ÖZELLİKLER
              </Text>
            </View>
            <Text
              style={{
                fontSize: isWide ? 40 : 28,
                fontWeight: '800',
                color: '#111827',
                letterSpacing: -1,
                textAlign: 'center',
              }}
            >
              Neden <Text style={{ color: colors.eco.emerald }}>Praboard</Text>?
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: '#6B7280',
                marginTop: 10,
                textAlign: 'center',
                maxWidth: 440,
                lineHeight: 24,
              }}
            >
              Çevreci teknoloji ile reklamcılığı yeniden tanımlıyoruz
            </Text>
          </View>

          <View style={{ flexDirection: isWide ? 'row' : 'column', gap: 18 }}>
            <FeatureCard
              index={0}
              icon="leaf-outline"
              title="Çevreci Teknoloji"
              description="Düşük enerji tüketimli LED panellerle çevreye duyarlı dijital reklamcılık"
              isWide={isWide}
            />
            <FeatureCard
              index={1}
              icon="globe-outline"
              title="Geniş Ağ"
              description="Türkiye genelinde 15+ şehirde aktif dijital billboard ağı"
              isWide={isWide}
            />
            <FeatureCard
              index={2}
              icon="wallet-outline"
              title="Uygun Fiyat"
              description="Geleneksel billboardlara göre %60 daha uygun reklam fiyatları"
              isWide={isWide}
            />
            <FeatureCard
              index={3}
              icon="flash-outline"
              title="Kolay Kullanım"
              description="Sadece 3 adımda reklamınızı oluşturup yayına alın"
              isWide={isWide}
            />
          </View>
        </View>
      </View>

      {/* ═══════════════════════ PLATFORM ÖNİZLEMESİ ═══════════════════════ */}
      <View
        style={{ backgroundColor: '#111827', paddingVertical: isWide ? 96 : 60, overflow: 'hidden' }}
      >
        {/* Arka plan dekorasyonu */}
        <View
          style={{
            position: 'absolute',
            right: -200,
            top: -200,
            width: 600,
            height: 600,
            borderRadius: 300,
            backgroundColor: 'rgba(27,138,74,0.05)',
          }}
        />
        <View
          style={{
            maxWidth: maxW,
            alignSelf: 'center',
            width: '100%',
            paddingHorizontal: px,
            flexDirection: isWide ? 'row' : 'column',
            alignItems: isWide ? 'center' : undefined,
            gap: isWide ? 64 : 40,
          }}
        >
          {/* Sol: Açıklama */}
          <View style={{ flex: isWide ? 1 : undefined, maxWidth: isWide ? 420 : undefined }}>
            <View
              style={{
                alignSelf: 'flex-start',
                backgroundColor: 'rgba(52,211,153,0.1)',
                borderWidth: 1,
                borderColor: 'rgba(52,211,153,0.2)',
                paddingHorizontal: 14,
                paddingVertical: 5,
                borderRadius: 100,
                marginBottom: 20,
              }}
            >
              <Text style={{ color: ACCENT, fontSize: 12, fontWeight: '700', letterSpacing: 0.5 }}>
                WEB PLATFORM
              </Text>
            </View>
            <Text
              style={{
                fontSize: isWide ? 38 : 28,
                fontWeight: '800',
                color: '#fff',
                letterSpacing: -1,
                lineHeight: isWide ? 48 : 36,
              }}
            >
              Tüm Kampanyalarınızı{'\n'}
              <Text style={{ color: colors.eco.leaf }}>Tek Yerden</Text> Yönetin
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: 'rgba(255,255,255,0.55)',
                marginTop: 16,
                lineHeight: 24,
                maxWidth: 380,
              }}
            >
              Güçlü web platformumuzdan reklamlarınızı oluşturun, panelleri harita
              üzerinden seçin ve performansı canlı takip edin.
            </Text>

            {[
              { icon: 'analytics-outline', text: 'Canlı görüntülenme ve dönüşüm takibi' },
              { icon: 'map-outline', text: 'Harita üzerinden panel seçimi' },
              { icon: 'notifications-outline', text: 'Anlık kampanya bildirimleri' },
            ].map((item, i) => (
              <View
                key={i}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 14 }}
              >
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: 'rgba(27,138,74,0.15)',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Ionicons name={item.icon} size={15} color={colors.eco.leaf} />
                </View>
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>{item.text}</Text>
              </View>
            ))}

            <TouchableOpacity
              onPress={() => goTo('Register')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: ACCENT,
                paddingHorizontal: 22,
                paddingVertical: 13,
                borderRadius: 11,
                gap: 8,
                marginTop: 32,
                alignSelf: 'flex-start',
                shadowColor: ACCENT,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.35,
                shadowRadius: 16,
              }}
            >
              <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>
                Platformu Keşfet
              </Text>
              <Ionicons name="arrow-forward" size={15} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Sağ: Dashboard mockup */}
          <View
            style={{
              flex: isWide ? 1 : undefined,
              width: isWide ? undefined : '100%',
              maxWidth: isWide ? undefined : 500,
              alignSelf: isWide ? undefined : 'center',
            }}
          >
            <DashboardMockup scale={isWide ? 1 : 0.82} />
          </View>
        </View>
      </View>

      {/* ═══════════════════════ PANEL HARİTASI ═══════════════════════ */}
      <View style={{ backgroundColor: '#F8FAFA', paddingVertical: isWide ? 96 : 60 }}>
        <View
          style={{
            maxWidth: maxW,
            alignSelf: 'center',
            width: '100%',
            paddingHorizontal: px,
            flexDirection: isWide ? 'row' : 'column',
            alignItems: isWide ? 'center' : undefined,
            gap: isWide ? 64 : 40,
          }}
        >
          {/* Sol: Gerçek harita */}
          <View style={{ flex: isWide ? 1 : undefined, width: isWide ? undefined : '100%' }}>
            <MapPreview isWide={isWide} />
          </View>

          {/* Sağ: Açıklama */}
          <View style={{ flex: isWide ? 1 : undefined, maxWidth: isWide ? 420 : undefined }}>
            <View
              style={{
                alignSelf: 'flex-start',
                backgroundColor: colors.eco.mint,
                paddingHorizontal: 14,
                paddingVertical: 5,
                borderRadius: 100,
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  color: colors.eco.emerald,
                  fontSize: 12,
                  fontWeight: '700',
                  letterSpacing: 0.5,
                }}
              >
                PANEL AĞIMIZ
              </Text>
            </View>

            <Text
              style={{
                fontSize: isWide ? 38 : 28,
                fontWeight: '800',
                color: '#111827',
                letterSpacing: -1,
                lineHeight: isWide ? 48 : 36,
              }}
            >
              Türkiye'nin{' '}
              <Text style={{ color: colors.eco.emerald }}>Her Noktasında</Text>
              {'\n'}Görünün
            </Text>

            <Text
              style={{
                fontSize: 15,
                color: '#6B7280',
                marginTop: 16,
                lineHeight: 24,
                maxWidth: 380,
              }}
            >
              İnteraktif haritamız üzerinden 15+ şehirdeki 150'den fazla dijital
              billboard panelini keşfedin. Trafik yoğunluğu, günlük görüntülenme
              sayısı ve doluluk oranlarını anlık olarak görüntüleyin.
            </Text>

            {[
              {
                icon: 'location-outline',
                title: 'Konum Bazlı Filtreleme',
                desc: 'Şehir, ilçe veya koordinat ile yakındaki panelleri listeleyin',
              },
              {
                icon: 'people-outline',
                title: 'Trafik Yoğunluğu',
                desc: 'Sabah/akşam saatlerinde ortalama geçiş trafiğini inceleyin',
              },
              {
                icon: 'bar-chart-outline',
                title: 'Doluluk Takvimi',
                desc: 'Panelin müsait tarihlerini gerçek zamanlı olarak görün',
              },
            ].map((item, i) => (
              <View
                key={i}
                style={{
                  flexDirection: 'row',
                  gap: 14,
                  marginTop: 20,
                  alignItems: 'flex-start',
                }}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: colors.eco.mint,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Ionicons name={item.icon} size={17} color={colors.eco.emerald} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#111827' }}>
                    {item.title}
                  </Text>
                  <Text style={{ fontSize: 13, color: '#6B7280', marginTop: 3, lineHeight: 20 }}>
                    {item.desc}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* ═══════════════════════ NASIL ÇALIŞIR ═══════════════════════ */}
      <LinearGradient
        colors={['#0D4F2B', '#1B8A4A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        onLayout={(e) => { stepsOffsetY.current = e.nativeEvent.layout.y; }}
        style={{ paddingVertical: isWide ? 96 : 60 }}
      >
        <View
          style={{ maxWidth: maxW, alignSelf: 'center', width: '100%', paddingHorizontal: px }}
        >
          <View style={{ alignItems: 'center', marginBottom: 56 }}>
            <View
              style={{
                backgroundColor: colors.glass.light,
                borderWidth: 1,
                borderColor: colors.glass.border,
                paddingHorizontal: 14,
                paddingVertical: 5,
                borderRadius: 100,
                marginBottom: 14,
                ...BLUR,
              }}
            >
              <Text
                style={{ color: colors.eco.sage, fontSize: 12, fontWeight: '700', letterSpacing: 0.5 }}
              >
                ADIMLAR
              </Text>
            </View>
            <Text
              style={{
                fontSize: isWide ? 40 : 28,
                fontWeight: '800',
                color: '#fff',
                letterSpacing: -1,
                textAlign: 'center',
              }}
            >
              Nasıl Çalışır?
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: 'rgba(255,255,255,0.55)',
                marginTop: 10,
                textAlign: 'center',
              }}
            >
              3 basit adımda reklamınızı yayına alın
            </Text>
          </View>

          <View
            style={{
              flexDirection: isWide ? 'row' : 'column',
              gap: isWide ? 0 : 44,
              alignItems: 'flex-start',
              justifyContent: 'center',
            }}
          >
            <StepItem
              number="1"
              icon="cloud-upload-outline"
              title="Reklamınızı Yükleyin"
              description="Görsel veya video içeriğinizi yükleyin; kampanya bütçesi, tarih aralığı ve hedef kitleyi belirleyin"
              isWide={isWide}
            />
            {isWide && <Connector />}
            <StepItem
              number="2"
              icon="map-outline"
              title="Haritadan Panel Seçin"
              description="İnteraktif harita üzerinden şehir, semt veya trafik yoğunluğuna göre size en uygun dijital paneli seçin"
              isWide={isWide}
            />
            {isWide && <Connector />}
            <StepItem
              number="3"
              icon="play-circle-outline"
              title="Yayına Alın"
              description="Ekibimiz içeriğinizi onayladıktan sonra reklamınız seçtiğiniz panelde anında yayına girer; performansı canlı takip edin"
              isWide={isWide}
            />
          </View>
        </View>
      </LinearGradient>

      {/* ═══════════════════════ GÜVEN ÇUBUĞU ═══════════════════════ */}
      <View
        style={{
          backgroundColor: '#fff',
          paddingVertical: 36,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: 'rgba(0,0,0,0.05)',
        }}
      >
        <View
          style={{
            maxWidth: maxW,
            alignSelf: 'center',
            width: '100%',
            paddingHorizontal: px,
            flexDirection: isWide ? 'row' : 'column',
            gap: isWide ? 0 : 20,
          }}
        >
          {[
            { icon: 'shield-checkmark-outline', text: 'SSL Güvenlik Sertifikası', color: '#10B981' },
            { icon: 'time-outline', text: '7/24 Teknik Destek', color: '#3B82F6' },
            { icon: 'card-outline', text: 'Güvenli Ödeme Altyapısı', color: ACCENT },
            { icon: 'trending-up-outline', text: 'Canlı Performans Takibi', color: '#8B5CF6' },
          ].map((item, i) => (
            <View
              key={i}
              style={{
                flex: isWide ? 1 : undefined,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 11,
                  backgroundColor: `${item.color}14`,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Ionicons name={item.icon} size={18} color={item.color} />
              </View>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151' }}>{item.text}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ═══════════════════════ CTA ═══════════════════════ */}
      <View style={{ backgroundColor: '#F8FAFA', paddingVertical: isWide ? 96 : 60 }}>
        <View
          style={{
            maxWidth: 680,
            alignSelf: 'center',
            width: '100%',
            paddingHorizontal: px,
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              backgroundColor: colors.eco.mint,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 24,
            }}
          >
            <Ionicons name="leaf" size={30} color={colors.eco.emerald} />
          </View>
          <Text
            style={{
              fontSize: isWide ? 40 : 28,
              fontWeight: '800',
              color: '#111827',
              letterSpacing: -1,
              textAlign: 'center',
              lineHeight: isWide ? 50 : 36,
            }}
          >
            Reklamcılığa <Text style={{ color: colors.eco.emerald }}>Yeşil</Text> Bir Adım Atın
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: '#6B7280',
              marginTop: 14,
              textAlign: 'center',
              maxWidth: 440,
              lineHeight: 25,
            }}
          >
            Hemen ücretsiz hesap oluşturun ve çevreci dijital billboard ağına katılın
          </Text>
          <TouchableOpacity
            onPress={() => goTo('Register')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: ACCENT,
              paddingHorizontal: 28,
              paddingVertical: 15,
              borderRadius: 13,
              gap: 8,
              marginTop: 32,
              shadowColor: ACCENT,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.35,
              shadowRadius: 16,
            }}
          >
            <Ionicons name="person-add-outline" size={17} color="#fff" />
            <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>
              Ücretsiz Hesap Oluştur
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ═══════════════════════ FOOTER ═══════════════════════ */}
      <View style={{ backgroundColor: '#0A1628', paddingTop: isWide ? 60 : 48, paddingBottom: 32 }}>
        <View style={{ maxWidth: maxW, alignSelf: 'center', width: '100%', paddingHorizontal: px }}>

          {/* Ana footer kolonları */}
          <View
            style={{
              flexDirection: isWide ? 'row' : 'column',
              gap: isWide ? 0 : 36,
              paddingBottom: 40,
              borderBottomWidth: 1,
              borderColor: 'rgba(255,255,255,0.07)',
            }}
          >
            {/* Kolon 1: Marka */}
            <View style={{ flex: isWide ? 1.6 : undefined, paddingRight: isWide ? 40 : 0 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <LogoMark size={32} dark />
                <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>Praboard</Text>
              </View>
              <Text
                style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, lineHeight: 22, maxWidth: 260 }}
              >
                Türkiye'nin çevreci dijital billboard ağı. Düşük maliyetle, yüksek görünürlük.
              </Text>
              {/* Sosyal medya ikonları */}
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
                {[
                  { icon: 'logo-twitter',   color: '#1DA1F2' },
                  { icon: 'logo-instagram', color: '#E1306C' },
                  { icon: 'logo-linkedin',  color: '#0A66C2' },
                ].map((s, i) => (
                  <View
                    key={i}
                    style={{
                      width: 36, height: 36, borderRadius: 10,
                      backgroundColor: 'rgba(255,255,255,0.06)',
                      borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
                      justifyContent: 'center', alignItems: 'center',
                    }}
                  >
                    <Ionicons name={s.icon} size={16} color={s.color} />
                  </View>
                ))}
              </View>
            </View>

            {/* Kolon 2: Platform */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '700',
                  letterSpacing: 1, marginBottom: 18,
                }}
              >
                PLATFORM
              </Text>
              {[
                { label: 'Özellikler' },
                { label: 'Panel Haritası' },
                { label: 'Nasıl Çalışır?', onPress: scrollToSteps },
                { label: 'Fiyatlandırma' },
                { label: 'SSS' },
              ].map((link, i) => (
                <TouchableOpacity key={i} onPress={link.onPress} style={{ marginBottom: 11 }}>
                  <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, lineHeight: 20 }}>
                    {link.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Kolon 3: Hesap */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '700',
                  letterSpacing: 1, marginBottom: 18,
                }}
              >
                HESAP
              </Text>
              {[
                { label: 'Giriş Yap',   screen: 'Login' },
                { label: 'Kayıt Ol',    screen: 'Register' },
                { label: 'Şifremi Unuttum', screen: 'ForgotPassword' },
                { label: 'Profilim' },
                { label: 'Destek' },
              ].map((link, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => link.screen && goTo(link.screen)}
                  style={{ marginBottom: 11 }}
                >
                  <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, lineHeight: 20 }}>
                    {link.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Kolon 4: Yasal */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '700',
                  letterSpacing: 1, marginBottom: 18,
                }}
              >
                YASAL
              </Text>
              {[
                'Gizlilik Politikası',
                'Kullanım Koşulları',
                'Çerez Politikası',
                'KVKK',
              ].map((link, i) => (
                <TouchableOpacity key={i} style={{ marginBottom: 11 }}>
                  <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, lineHeight: 20 }}>
                    {link}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Alt çubuk */}
          <View
            style={{
              paddingTop: 24,
              flexDirection: isWide ? 'row' : 'column',
              justifyContent: 'space-between',
              alignItems: isWide ? 'center' : 'flex-start',
              gap: 10,
            }}
          >
            <Text style={{ color: 'rgba(255,255,255,0.22)', fontSize: 13 }}>
              © 2026 Praboard. Tüm hakları saklıdır.
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="leaf" size={12} color={colors.eco.leaf} />
              <Text style={{ color: 'rgba(255,255,255,0.22)', fontSize: 12 }}>
                Çevreci teknoloji ile güçlendirilmiştir
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
