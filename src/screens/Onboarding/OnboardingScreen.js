import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme';
import PraboardLogo from '../../components/PraboardLogo';

/* ───── Data ───── */

const steps = [
  {
    num: '1',
    icon: 'cloud-upload-outline',
    title: 'Reklamını Yükle',
    desc: 'Görsel veya video reklamını platforma yükle. 60 saniyeye kadar video desteği.',
  },
  {
    num: '2',
    icon: 'map-outline',
    title: 'Pano Seç',
    desc: 'Harita üzerinde şehrindeki dijital panoları keşfet, uygun olanı seç.',
  },
  {
    num: '3',
    icon: 'calendar-outline',
    title: 'Tarihleri Belirle',
    desc: 'Kampanya tarihlerini seç, toplam maliyeti anında gör.',
  },
  {
    num: '4',
    icon: 'tv-outline',
    title: 'Canlı Yayına Geç',
    desc: 'Onay sonrası reklamın dijital panolarda anında yayınlanmaya başlar.',
  },
];

const features = [
  {
    icon: 'speedometer-outline',
    title: 'Gerçek Zamanlı Yayın',
    desc: 'Reklamın onaylandığı anda dijital panolara iletilir. Canlı takip imkanı.',
  },
  {
    icon: 'location-outline',
    title: 'Stratejik Lokasyonlar',
    desc: 'Şehrin en işlek noktalarındaki dijital panolarda reklamını sergile.',
  },
  {
    icon: 'wallet-outline',
    title: 'Şeffaf Fiyatlandırma',
    desc: 'Günlük bazda net fiyatlar. Gizli maliyet yok, ne ödeyeceğini önceden bil.',
  },
  {
    icon: 'shield-checkmark-outline',
    title: 'Kanıtlı Yayın',
    desc: 'Saha ekibimiz yayın kanıt fotoğraflarıyla reklamının gösterimini doğrular.',
  },
  {
    icon: 'phone-portrait-outline',
    title: 'Her Yerden Yönet',
    desc: 'Mobil ve web uygulamasıyla kampanyalarını istediğin yerden takip et.',
  },
  {
    icon: 'leaf-outline',
    title: 'Çevre Dostu',
    desc: 'Kağıtsız dijital reklamcılık ile çevreye duyarlı bir çözüm.',
  },
];

const panels = [
  { name: 'Kızılay Meydanı', size: '3m x 6m', price: '1.166', badge: 'Popüler' },
  { name: 'Tunalı Hilmi Cad.', size: '4m x 8m', price: '2.350', badge: 'Premium' },
  { name: 'Ulus Meydanı', size: '2.5m x 5m', price: '890', badge: null },
  { name: 'Bahçelievler AVM', size: '3m x 4m', price: '1.500', badge: null },
];

const stats = [
  { value: '6+', label: 'Dijital Pano' },
  { value: '4', label: 'Stratejik Bölge' },
  { value: '7/24', label: 'Canlı Yayın' },
  { value: '%100', label: 'Dijital Süreç' },
];

/* ───── Component ───── */

const OnboardingScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web' && width > 768;
  const scrollRef = useRef(null);

  const handleLogin = () => navigation.replace('Login');
  const handleRegister = () => navigation.replace('Register');

  /* ── Shared: Navbar ── */
  const navbar = (
    <View style={[s.navbar, isWeb && s.navbarWeb]}>
      <View style={s.navBrand}>
        <PraboardLogo size={36} variant="standalone" />
        <Text style={s.navBrandText}>Praboard</Text>
      </View>
      <View style={s.navActions}>
        <TouchableOpacity onPress={handleLogin}>
          <Text style={s.navLink}>Giriş Yap</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleRegister} style={s.navCta}>
          <Text style={s.navCtaText}>Kayıt Ol</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  /* ── Section: Hero ── */
  const heroSection = (
    <LinearGradient colors={['#065F46', '#059669', '#10B981']} style={s.hero}>
      <View style={[s.heroInner, isWeb && s.heroInnerWeb]}>
        <View style={[s.heroText, isWeb && s.heroTextWeb]}>
          <View style={s.heroBadge}>
            <Ionicons name="flash" size={14} color="#F2714D" />
            <Text style={s.heroBadgeText}>Dijital Açık Hava Reklamcılığı</Text>
          </View>
          <Text style={[s.heroTitle, isWeb && s.heroTitleWeb]}>
            Reklamını Şehrinin{'\n'}
            <Text style={{ color: '#A7F3D0' }}>Dijital Panolarında</Text>{'\n'}
            Yayınla
          </Text>
          <Text style={s.heroSubtitle}>
            Praboard ile dijital billboard reklamcılığı artık herkes için erişilebilir.
            Reklamını yükle, pano seç, anında yayına geç.
          </Text>
          <View style={s.heroCtas}>
            <TouchableOpacity onPress={handleRegister} style={s.heroBtn}>
              <Text style={s.heroBtnText}>Hemen Başla</Text>
              <Ionicons name="arrow-forward" size={18} color="#065F46" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogin} style={s.heroSecBtn}>
              <Text style={s.heroSecBtnText}>Giriş Yap</Text>
            </TouchableOpacity>
          </View>
        </View>

        {isWeb && (
          <View style={s.heroVisual}>
            {/* App mockup */}
            <View style={s.mockPhone}>
              <View style={s.mockScreen}>
                <View style={s.mockHeader}>
                  <PraboardLogo size={20} variant="standalone" />
                  <Text style={s.mockHeaderText}>Ana Sayfa</Text>
                </View>
                {/* Mock ad cards */}
                <View style={s.mockCard}>
                  <View style={[s.mockImg, { backgroundColor: '#D1FAE5' }]}>
                    <Ionicons name="image-outline" size={28} color="#059669" />
                  </View>
                  <View style={s.mockCardBody}>
                    <View style={[s.mockLine, { width: '70%' }]} />
                    <View style={[s.mockLine, { width: '50%', opacity: 0.4 }]} />
                  </View>
                </View>
                <View style={s.mockCard}>
                  <View style={[s.mockImg, { backgroundColor: '#FEF3C7' }]}>
                    <Ionicons name="videocam-outline" size={28} color="#D97706" />
                  </View>
                  <View style={s.mockCardBody}>
                    <View style={[s.mockLine, { width: '60%' }]} />
                    <View style={[s.mockLine, { width: '80%', opacity: 0.4 }]} />
                  </View>
                </View>
                <View style={s.mockTabBar}>
                  <Ionicons name="home" size={18} color="#059669" />
                  <Ionicons name="grid-outline" size={18} color="#aaa" />
                  <View style={s.mockAddBtn}>
                    <Ionicons name="add" size={20} color="#fff" />
                  </View>
                  <Ionicons name="notifications-outline" size={18} color="#aaa" />
                  <Ionicons name="person-outline" size={18} color="#aaa" />
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    </LinearGradient>
  );

  /* ── Section: Stats ── */
  const statsSection = (
    <View style={[s.statsBar, isWeb && s.statsBarWeb]}>
      {stats.map((st, i) => (
        <View key={i} style={s.statItem}>
          <Text style={[s.statValue, isWeb && s.statValueWeb]}>{st.value}</Text>
          <Text style={s.statLabel}>{st.label}</Text>
        </View>
      ))}
    </View>
  );

  /* ── Section: How it works ── */
  const howSection = (
    <View style={[s.section, isWeb && s.sectionWeb]}>
      <Text style={s.sectionLabel}>NASIL ÇALIŞIR?</Text>
      <Text style={[s.sectionTitle, isWeb && s.sectionTitleWeb]}>
        4 Adımda Reklamını Yayınla
      </Text>
      <Text style={s.sectionSubtitle}>
        Karmaşık süreçlere son. Praboard ile dijital pano reklamı vermek çok kolay.
      </Text>
      <View style={[s.stepsGrid, isWeb && s.stepsGridWeb]}>
        {steps.map((st, i) => (
          <View key={i} style={[s.stepCard, isWeb && s.stepCardWeb]}>
            <View style={s.stepNum}>
              <Text style={s.stepNumText}>{st.num}</Text>
            </View>
            <View style={s.stepIconCircle}>
              <Ionicons name={st.icon} size={28} color="#059669" />
            </View>
            <Text style={s.stepTitle}>{st.title}</Text>
            <Text style={s.stepDesc}>{st.desc}</Text>
            {i < steps.length - 1 && isWeb && (
              <View style={s.stepArrow}>
                <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );

  /* ── Section: Features ── */
  const featuresSection = (
    <View style={[s.section, s.sectionGray, isWeb && s.sectionWeb]}>
      <Text style={s.sectionLabel}>ÖZELLİKLER</Text>
      <Text style={[s.sectionTitle, isWeb && s.sectionTitleWeb]}>
        Neden Praboard?
      </Text>
      <Text style={s.sectionSubtitle}>
        Geleneksel billboardların aksine, Praboard dijital ve şeffaf bir deneyim sunar.
      </Text>
      <View style={[s.featGrid, isWeb && s.featGridWeb]}>
        {features.map((f, i) => (
          <View key={i} style={[s.featCard, isWeb && s.featCardWeb]}>
            <View style={s.featIcon}>
              <Ionicons name={f.icon} size={24} color="#059669" />
            </View>
            <Text style={s.featTitle}>{f.title}</Text>
            <Text style={s.featDesc}>{f.desc}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  /* ── Section: Panels preview ── */
  const panelsSection = (
    <View style={[s.section, isWeb && s.sectionWeb]}>
      <Text style={s.sectionLabel}>PANOLAR</Text>
      <Text style={[s.sectionTitle, isWeb && s.sectionTitleWeb]}>
        Dijital Pano Lokasyonları
      </Text>
      <Text style={s.sectionSubtitle}>
        Ankara'nın en stratejik noktalarındaki dijital panolardan seçim yap.
      </Text>
      <View style={[s.panelGrid, isWeb && s.panelGridWeb]}>
        {panels.map((p, i) => (
          <View key={i} style={[s.panelCard, isWeb && s.panelCardWeb]}>
            <View style={s.panelVisual}>
              <Ionicons name="easel-outline" size={36} color="#059669" />
              {p.badge && (
                <View style={s.panelBadge}>
                  <Text style={s.panelBadgeText}>{p.badge}</Text>
                </View>
              )}
            </View>
            <Text style={s.panelName}>{p.name}</Text>
            <Text style={s.panelSize}>{p.size}</Text>
            <View style={s.panelPriceRow}>
              <Text style={s.panelPrice}>{p.price} TL</Text>
              <Text style={s.panelPriceUnit}>/gün</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  /* ── Section: How system works (visual) ── */
  const systemSection = (
    <View style={[s.section, s.sectionDark, isWeb && s.sectionWeb]}>
      <Text style={[s.sectionLabel, { color: '#6EE7B7' }]}>SİSTEM</Text>
      <Text style={[s.sectionTitle, isWeb && s.sectionTitleWeb, { color: '#fff' }]}>
        Reklamın Panoya Nasıl Ulaşır?
      </Text>
      <View style={[s.flowRow, isWeb && s.flowRowWeb]}>
        {[
          { icon: 'person-outline', label: 'Reklam\nYükle', color: '#A7F3D0' },
          { icon: 'checkmark-circle-outline', label: 'Admin\nOnayı', color: '#FDE68A' },
          { icon: 'cloud-upload-outline', label: 'İçerik\nGönderimi', color: '#93C5FD' },
          { icon: 'tv-outline', label: 'Canlı\nYayın', color: '#FCA5A5' },
        ].map((item, i) => (
          <React.Fragment key={i}>
            {i > 0 && (
              <View style={s.flowArrow}>
                <Ionicons name={isWeb ? 'arrow-forward' : 'arrow-down'} size={18} color="#6EE7B7" />
              </View>
            )}
            <View style={s.flowItem}>
              <View style={[s.flowIcon, { backgroundColor: item.color + '20' }]}>
                <Ionicons name={item.icon} size={28} color={item.color} />
              </View>
              <Text style={s.flowLabel}>{item.label}</Text>
            </View>
          </React.Fragment>
        ))}
      </View>
      <Text style={s.systemNote}>
        Tüm süreç dijital ortamda gerçekleşir. Siparişiniz onaylandığında
        içerik otomatik olarak ilgili panoya iletilir ve canlı yayın başlar.
      </Text>
    </View>
  );

  /* ── Section: CTA ── */
  const ctaSection = (
    <LinearGradient colors={['#059669', '#10B981']} style={[s.ctaSection, isWeb && s.ctaSectionWeb]}>
      <PraboardLogo size={56} variant="onGradient" />
      <Text style={[s.ctaTitle, isWeb && s.ctaTitleWeb]}>
        Dijital Reklamcılığa Başla
      </Text>
      <Text style={s.ctaSubtitle}>
        Hemen ücretsiz hesap oluştur, ilk kampanyanı başlat.
      </Text>
      <View style={s.ctaBtns}>
        <TouchableOpacity onPress={handleRegister} style={s.ctaBtn}>
          <Text style={s.ctaBtnText}>Ücretsiz Kayıt Ol</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogin} style={s.ctaSecBtn}>
          <Text style={s.ctaSecBtnText}>Giriş Yap</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  /* ── Section: Footer ── */
  const footer = (
    <View style={[s.footer, isWeb && s.footerWeb]}>
      <View style={s.footerBrand}>
        <PraboardLogo size={28} variant="standalone" />
        <Text style={s.footerBrandText}>Praboard</Text>
      </View>
      <Text style={s.footerCopy}>
        © 2025 Praboard. Dijital Açık Hava Reklamcılığı Platformu.
      </Text>
    </View>
  );

  return (
    <View style={s.root}>
      {navbar}
      <ScrollView
        ref={scrollRef}
        style={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        {heroSection}
        {statsSection}
        {howSection}
        {featuresSection}
        {panelsSection}
        {systemSection}
        {ctaSection}
        {footer}
      </ScrollView>
    </View>
  );
};

/* ───── Styles ───── */

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  scroll: { flex: 1 },

  /* Navbar */
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  navbarWeb: { paddingHorizontal: 48 },
  navBrand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  navBrandText: { fontSize: 20, fontWeight: '800', color: colors.textPrimary },
  navActions: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  navLink: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  navCta: {
    backgroundColor: '#059669',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  navCtaText: { fontSize: 14, fontWeight: '700', color: '#fff' },

  /* Hero */
  hero: { paddingTop: 40, paddingBottom: 60 },
  heroInner: { paddingHorizontal: 24 },
  heroInnerWeb: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 64,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    gap: 60,
  },
  heroText: { flex: 1 },
  heroTextWeb: { flex: 1 },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    marginBottom: 24,
  },
  heroBadgeText: { fontSize: 13, color: '#D1FAE5', fontWeight: '600' },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    lineHeight: 42,
    marginBottom: 16,
  },
  heroTitleWeb: { fontSize: 48, lineHeight: 60 },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 26,
    marginBottom: 32,
    maxWidth: 500,
  },
  heroCtas: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  heroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  heroBtnText: { fontSize: 16, fontWeight: '700', color: '#065F46' },
  heroSecBtn: {
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
  },
  heroSecBtnText: { fontSize: 16, fontWeight: '600', color: '#fff' },

  /* Hero visual - phone mockup */
  heroVisual: { flex: 0, width: 280, alignItems: 'center' },
  mockPhone: {
    width: 260,
    height: 440,
    backgroundColor: '#1F2937',
    borderRadius: 32,
    padding: 8,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }
      : { elevation: 20 }),
  },
  mockScreen: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    overflow: 'hidden',
  },
  mockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  mockHeaderText: { fontSize: 14, fontWeight: '700', color: '#1F2937' },
  mockCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  mockImg: {
    width: 56,
    height: 56,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mockCardBody: { flex: 1, gap: 8 },
  mockLine: { height: 10, backgroundColor: '#E5E7EB', borderRadius: 5 },
  mockTabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  mockAddBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Stats bar */
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 28,
    paddingHorizontal: 16,
    backgroundColor: '#F0FDF4',
    flexWrap: 'wrap',
    gap: 12,
  },
  statsBarWeb: {
    paddingVertical: 36,
    paddingHorizontal: 64,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  statItem: { alignItems: 'center', minWidth: 70 },
  statValue: { fontSize: 28, fontWeight: '900', color: '#065F46' },
  statValueWeb: { fontSize: 36 },
  statLabel: { fontSize: 13, color: '#6B7280', marginTop: 4, fontWeight: '500' },

  /* Sections */
  section: { paddingVertical: 56, paddingHorizontal: 24 },
  sectionWeb: {
    paddingVertical: 72,
    paddingHorizontal: 64,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  sectionGray: { backgroundColor: '#F9FAFB' },
  sectionDark: { backgroundColor: '#0F172A' },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#059669',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  sectionTitleWeb: { fontSize: 34 },
  sectionSubtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    maxWidth: 560,
    alignSelf: 'center',
  },

  /* Steps */
  stepsGrid: { gap: 20 },
  stepsGridWeb: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  stepCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  stepCardWeb: { flex: 1, maxWidth: 260 },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNumText: { fontSize: 14, fontWeight: '800', color: '#fff' },
  stepIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  stepDesc: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
    textAlign: 'center',
  },
  stepArrow: {
    position: 'absolute',
    right: -14,
    top: '50%',
  },

  /* Features grid */
  featGrid: { gap: 16 },
  featGridWeb: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
  },
  featCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  featCardWeb: { width: '30%', minWidth: 280 },
  featIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  featDesc: { fontSize: 14, color: '#6B7280', lineHeight: 22 },

  /* Panels */
  panelGrid: { gap: 16 },
  panelGridWeb: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
  },
  panelCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    alignItems: 'center',
  },
  panelCardWeb: { width: '22%', minWidth: 220 },
  panelVisual: {
    width: '100%',
    height: 100,
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  panelBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#F2714D',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  panelBadgeText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  panelName: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  panelSize: { fontSize: 13, color: '#9CA3AF', marginBottom: 8 },
  panelPriceRow: { flexDirection: 'row', alignItems: 'baseline' },
  panelPrice: { fontSize: 22, fontWeight: '800', color: '#059669' },
  panelPriceUnit: { fontSize: 13, color: '#9CA3AF', marginLeft: 2 },

  /* System flow */
  flowRow: { alignItems: 'center', gap: 8, marginBottom: 32 },
  flowRowWeb: { flexDirection: 'row', justifyContent: 'center', gap: 16 },
  flowItem: { alignItems: 'center' },
  flowIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  flowLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#D1D5DB',
    textAlign: 'center',
    lineHeight: 18,
  },
  flowArrow: { paddingVertical: 4 },
  systemNote: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 500,
    alignSelf: 'center',
  },

  /* CTA */
  ctaSection: { padding: 48, alignItems: 'center' },
  ctaSectionWeb: { paddingVertical: 72 },
  ctaTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  ctaTitleWeb: { fontSize: 36 },
  ctaSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 32,
    textAlign: 'center',
  },
  ctaBtns: { flexDirection: 'row', gap: 12, flexWrap: 'wrap', justifyContent: 'center' },
  ctaBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  ctaBtnText: { fontSize: 16, fontWeight: '700', color: '#065F46' },
  ctaSecBtn: {
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  ctaSecBtnText: { fontSize: 16, fontWeight: '600', color: '#fff' },

  /* Footer */
  footer: {
    padding: 24,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  footerWeb: { paddingVertical: 32 },
  footerBrand: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  footerBrandText: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  footerCopy: { fontSize: 13, color: '#9CA3AF' },
});

export default OnboardingScreen;
