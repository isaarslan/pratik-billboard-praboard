import React from 'react';
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

/* ─────────────────────────── constants ─────────────────────────── */

const BLUR = Platform.select({
  web: { backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' },
  default: {},
});

// Ferah emerald — koyu yeşil temayla kontrast, aydınlık his
const ACCENT = '#34D399';

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

/* ── Web Dashboard Önizlemesi (mobil ekran yerine) ── */
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

        {/* Harita satırı */}
        <View
          style={{
            marginTop: s(2),
            backgroundColor: '#1E293B',
            borderRadius: s(7),
            padding: s(9),
            flexDirection: 'row',
            alignItems: 'center',
            gap: s(10),
          }}
        >
          <View
            style={{
              width: s(38),
              height: s(38),
              backgroundColor: '#0D3320',
              borderRadius: s(5),
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Ionicons name="map-outline" size={s(16)} color={colors.eco.leaf} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: s(10), fontWeight: '600' }}>
              Panel Haritası
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: s(8), marginTop: s(1) }}>
              15 şehir · 150+ panel
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={s(12)} color="rgba(255,255,255,0.25)" />
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

/* ── Harita Görsel Mockup'u ── */
function MapMockup() {
  const cities = [
    { name: 'İstanbul', panels: 42, x: '14%', y: '20%', active: true, big: true },
    { name: 'Ankara',   panels: 28, x: '50%', y: '26%', active: true, big: true },
    { name: 'İzmir',    panels: 19, x: '12%', y: '52%', active: true, big: true },
    { name: 'Bursa',    panels: 12, x: '28%', y: '18%', active: true, big: false },
    { name: 'Antalya',  panels: 15, x: '40%', y: '74%', active: true, big: false },
    { name: 'Adana',    panels: 8,  x: '60%', y: '68%', active: false, big: false },
    { name: 'Konya',    panels: 10, x: '46%', y: '54%', active: true,  big: false },
    { name: 'Gaziantep',panels: 7,  x: '70%', y: '72%', active: false, big: false },
    { name: 'Kayseri',  panels: 6,  x: '60%', y: '36%', active: false, big: false },
    { name: 'Trabzon',  panels: 5,  x: '76%', y: '12%', active: false, big: false },
    { name: 'Eskişehir',panels: 9,  x: '36%', y: '30%', active: true,  big: false },
    { name: 'Samsun',   panels: 7,  x: '60%', y: '14%', active: false, big: false },
  ];

  return (
    <View
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.4,
        shadowRadius: 32,
        elevation: 16,
      }}
    >
      {/* Başlık çubuğu */}
      <View
        style={{
          backgroundColor: '#1E293B',
          paddingHorizontal: 16,
          paddingVertical: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Ionicons name="map" size={14} color={colors.eco.leaf} />
          <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>
            Türkiye Panel Haritası
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 14 }}>
          {[
            { color: '#22C55E', label: 'Aktif' },
            { color: ACCENT,    label: 'Yakında' },
          ].map((l, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: l.color }} />
              <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10 }}>{l.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Harita alanı */}
      <View style={{ height: 280, backgroundColor: '#0D1B2A', position: 'relative' }}>
        {/* Izgara çizgileri */}
        {[0.25, 0.5, 0.75].map((v, i) => (
          <View
            key={`h${i}`}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: `${v * 100}%`,
              height: 1,
              backgroundColor: 'rgba(255,255,255,0.04)',
            }}
          />
        ))}
        {[0.2, 0.4, 0.6, 0.8].map((v, i) => (
          <View
            key={`v${i}`}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${v * 100}%`,
              width: 1,
              backgroundColor: 'rgba(255,255,255,0.04)',
            }}
          />
        ))}

        {/* Şehir pin'leri */}
        {cities.map((city, i) => (
          <View
            key={i}
            style={{ position: 'absolute', left: city.x, top: city.y, alignItems: 'center' }}
          >
            {/* Büyük şehirlerde nabız halkası */}
            {city.big && (
              <View
                style={{
                  position: 'absolute',
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: city.active
                    ? 'rgba(34,197,94,0.12)'
                    : 'rgba(52,211,153,0.12)',
                  top: -7,
                  left: -7,
                }}
              />
            )}
            <View
              style={{
                width: city.big ? 16 : 9,
                height: city.big ? 16 : 9,
                borderRadius: city.big ? 8 : 5,
                backgroundColor: city.active ? '#22C55E' : ACCENT,
                borderWidth: city.big ? 2 : 1,
                borderColor: city.active
                  ? 'rgba(34,197,94,0.5)'
                  : 'rgba(52,211,153,0.5)',
              }}
            />
            {city.big && (
              <View
                style={{
                  backgroundColor: 'rgba(15,23,42,0.9)',
                  paddingHorizontal: 6,
                  paddingVertical: 3,
                  borderRadius: 5,
                  marginTop: 4,
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.08)',
                }}
              >
                <Text style={{ color: '#fff', fontSize: 9, fontWeight: '700' }}>{city.name}</Text>
                <Text
                  style={{
                    color: city.active ? '#22C55E' : ACCENT,
                    fontSize: 8,
                    marginTop: 1,
                  }}
                >
                  {city.panels} panel
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Alt istatistik çubuğu */}
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: '#1E293B',
          borderTopWidth: 1,
          borderColor: 'rgba(255,255,255,0.06)',
        }}
      >
        {[
          { label: 'Toplam Şehir', value: '15+', color: colors.eco.leaf },
          { label: 'Aktif Panel',  value: '150+', color: '#22C55E' },
          { label: 'Ort. Günlük Görüntülenme', value: '50K+', color: ACCENT },
        ].map((s, i) => (
          <View
            key={i}
            style={{
              flex: 1,
              paddingVertical: 12,
              alignItems: 'center',
              borderRightWidth: i < 2 ? 1 : 0,
              borderColor: 'rgba(255,255,255,0.06)',
            }}
          >
            <Text style={{ color: s.color, fontSize: 14, fontWeight: '800' }}>{s.value}</Text>
            <Text
              style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9, marginTop: 2, textAlign: 'center' }}
            >
              {s.label}
            </Text>
          </View>
        ))}
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

  const goTo = (screen) => navigation?.navigate(screen);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#F8FAFA' }}
      showsVerticalScrollIndicator={false}
    >
      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <LinearGradient
        colors={['#071E14', '#0B3D2E', '#14693E']}
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
                <Ionicons name="arrow-forward" size={15} color="#fff" />
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

          {/* Sağ: Dashboard mockup (sadece desktop) */}
          {isWide && (
            <View style={{ flex: 1, maxWidth: 420 }}>
              <DashboardMockup scale={0.95} />
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
          {/* Sol: Harita mockup */}
          <View style={{ flex: isWide ? 1 : undefined, width: isWide ? undefined : '100%' }}>
            <MapMockup />
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
      <View style={{ backgroundColor: '#0A1628', paddingVertical: 36 }}>
        <View
          style={{
            maxWidth: maxW,
            alignSelf: 'center',
            width: '100%',
            paddingHorizontal: px,
            flexDirection: isWide ? 'row' : 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <LogoMark size={26} dark />
            <Text style={{ color: '#fff', fontSize: 17, fontWeight: '700' }}>Praboard</Text>
          </View>
          <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
            © 2026 Praboard. Tüm hakları saklıdır.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
