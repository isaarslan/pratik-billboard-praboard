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
import WebMap from '../../components/WebMap';

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

const panelData = [
  { id: 1, name: 'Kızılay Meydanı', loc: 'Kızılay, Ankara', size: '3m x 6m', price: '1.166', badge: 'Popüler', status: 'Müsait', lat: 39.9208, lng: 32.8541 },
  { id: 2, name: 'Tunalı Hilmi Cad.', loc: 'Çankaya, Ankara', size: '4m x 8m', price: '2.350', badge: 'Premium', status: 'Müsait', lat: 39.9075, lng: 32.8597 },
  { id: 3, name: 'Ulus Meydanı', loc: 'Altındağ, Ankara', size: '2.5m x 5m', price: '890', badge: null, status: 'Dolu', lat: 39.9414, lng: 32.8543 },
  { id: 4, name: 'Bahçelievler AVM', loc: 'Çankaya, Ankara', size: '3m x 4m', price: '1.500', badge: null, status: 'Müsait', lat: 39.9220, lng: 32.8280 },
  { id: 5, name: 'Batıkent Metro', loc: 'Yenimahalle, Ankara', size: '2m x 4m', price: '750', badge: null, status: 'Müsait', lat: 39.9700, lng: 32.7300 },
  { id: 6, name: 'Gölbaşı Sahil', loc: 'Gölbaşı, Ankara', size: '3m x 6m', price: '1.050', badge: null, status: 'Dolu', lat: 39.7850, lng: 32.8040 },
];

const mapMarkers = panelData.map((p) => ({
  id: p.id,
  lat: p.lat,
  lng: p.lng,
  label: 'P',
  color: p.status === 'Müsait' ? '#22C55E' : '#737373',
}));

const stats = [
  { value: '6+', label: 'Dijital Pano' },
  { value: '4', label: 'Stratejik Bölge' },
  { value: '7/24', label: 'Canlı Yayın' },
  { value: '%100', label: 'Dijital Süreç' },
];

/* ───── Reusable: Map Pin ───── */
const MapPin = ({ x, y, label, color = '#22C55E', size = 32 }) => (
  <View style={[mp.pin, { left: x, top: y }]}>
    <View style={[mp.circle, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]}>
      <Text style={[mp.label, { fontSize: size * 0.4 }]}>{label || 'P'}</Text>
    </View>
    <View style={[mp.tail, { borderTopColor: color }]} />
  </View>
);
const mp = StyleSheet.create({
  pin: { position: 'absolute', alignItems: 'center', zIndex: 10 },
  circle: { justifyContent: 'center', alignItems: 'center', borderWidth: 2.5, borderColor: '#fff' },
  label: { color: '#fff', fontWeight: '800' },
  tail: { width: 0, height: 0, borderLeftWidth: 5, borderRightWidth: 5, borderTopWidth: 7, borderLeftColor: 'transparent', borderRightColor: 'transparent', marginTop: -1 },
});

/* ───── Reusable: Map Background ───── */
const MapBg = ({ children, style }) => (
  <View style={[mapS.container, style]}>
    {/* Grid lines simulating map roads */}
    <View style={[mapS.road, mapS.roadH, { top: '25%' }]} />
    <View style={[mapS.road, mapS.roadH, { top: '55%' }]} />
    <View style={[mapS.road, mapS.roadH, { top: '78%' }]} />
    <View style={[mapS.road, mapS.roadV, { left: '20%' }]} />
    <View style={[mapS.road, mapS.roadV, { left: '50%' }]} />
    <View style={[mapS.road, mapS.roadV, { left: '75%' }]} />
    {/* Block fills */}
    <View style={[mapS.block, { top: '10%', left: '5%', width: '12%', height: '12%' }]} />
    <View style={[mapS.block, { top: '30%', left: '55%', width: '18%', height: '20%' }]} />
    <View style={[mapS.block, { top: '60%', left: '25%', width: '20%', height: '15%' }]} />
    <View style={[mapS.block, { top: '5%', left: '60%', width: '15%', height: '15%' }]} />
    {children}
  </View>
);
const mapS = StyleSheet.create({
  container: { backgroundColor: '#E8F0E4', borderRadius: 12, overflow: 'hidden', position: 'relative' },
  road: { position: 'absolute', backgroundColor: '#fff' },
  roadH: { left: 0, right: 0, height: 3 },
  roadV: { top: 0, bottom: 0, width: 3 },
  block: { position: 'absolute', backgroundColor: '#D4E4CF', borderRadius: 4 },
});

/* ───── Reusable: Phone Frame ───── */
const PhoneFrame = ({ children, title, width = 220, height = 400 }) => (
  <View style={[pf.phone, { width, height }]}>
    <View style={pf.notch} />
    <View style={pf.screen}>
      {title && (
        <View style={pf.header}>
          <PraboardLogo size={16} variant="standalone" />
          <Text style={pf.headerText}>{title}</Text>
        </View>
      )}
      <View style={pf.body}>{children}</View>
    </View>
  </View>
);
const pf = StyleSheet.create({
  phone: {
    backgroundColor: '#1F2937',
    borderRadius: 28,
    padding: 6,
    ...(Platform.OS === 'web' ? { boxShadow: '0 16px 48px rgba(0,0,0,0.35)' } : { elevation: 16 }),
  },
  notch: { width: 80, height: 6, backgroundColor: '#374151', borderRadius: 3, alignSelf: 'center', marginTop: 4, marginBottom: 2 },
  screen: { flex: 1, backgroundColor: '#F9FAFB', borderRadius: 22, overflow: 'hidden' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  headerText: { fontSize: 12, fontWeight: '700', color: '#1F2937' },
  body: { flex: 1 },
});

/* ───── Component ───── */

const OnboardingScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web' && width > 768;
  const scrollRef = useRef(null);

  const go = (screen) => () => navigation.replace(screen);

  /* ── Navbar ── */
  const navbar = (
    <View style={[s.navbar, isWeb && s.navbarWeb]}>
      <View style={s.navBrand}>
        <PraboardLogo size={36} variant="standalone" />
        <Text style={s.navBrandText}>Praboard</Text>
      </View>
      <View style={s.navActions}>
        <TouchableOpacity onPress={go('Login')}>
          <Text style={s.navLink}>Giriş Yap</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={go('Register')} style={s.navCta}>
          <Text style={s.navCtaText}>Kayıt Ol</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  /* ── Hero ── */
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
            Haritadan pano seç, reklamını yükle, anında yayına geç.
          </Text>
          <View style={s.heroCtas}>
            <TouchableOpacity onPress={go('Register')} style={s.heroBtn}>
              <Text style={s.heroBtnText}>Hemen Başla</Text>
              <Ionicons name="arrow-forward" size={18} color="#065F46" />
            </TouchableOpacity>
            <TouchableOpacity onPress={go('Login')} style={s.heroSecBtn}>
              <Text style={s.heroSecBtnText}>Giriş Yap</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero mockup: Phone with MAP view */}
        {isWeb && (
          <View style={s.heroVisual}>
            <PhoneFrame title="Panolar" width={270} height={460}>
              {/* Real Leaflet map inside phone mockup */}
              <View style={{ flex: 1, position: 'relative' }}>
                <WebMap
                  markers={mapMarkers}
                  center={{ lat: 39.925, lng: 32.836 }}
                  zoom={12}
                />
                {/* Selected panel card overlay */}
                <View style={s.heroMapCard}>
                  <View style={s.heroMapCardDot} />
                  <View style={{ flex: 1 }}>
                    <Text style={s.heroMapCardName}>Kızılay Meydanı</Text>
                    <Text style={s.heroMapCardLoc}>Kızılay, Ankara · 3m x 6m</Text>
                  </View>
                  <Text style={s.heroMapCardPrice}>1.166₺</Text>
                </View>
              </View>
              {/* Bottom tab bar */}
              <View style={s.mockTabBar}>
                <Ionicons name="home-outline" size={16} color="#aaa" />
                <View style={{ alignItems: 'center' }}>
                  <Ionicons name="map" size={16} color="#059669" />
                  <View style={s.mockTabDot} />
                </View>
                <View style={s.mockAddBtn}>
                  <Ionicons name="add" size={18} color="#fff" />
                </View>
                <Ionicons name="notifications-outline" size={16} color="#aaa" />
                <Ionicons name="person-outline" size={16} color="#aaa" />
              </View>
            </PhoneFrame>
          </View>
        )}

        {/* Mobile: map preview */}
        {!isWeb && (
          <View style={{ height: 180, marginTop: 24, borderRadius: 16, overflow: 'hidden', position: 'relative' }}>
            {Platform.OS === 'web' ? (
              <WebMap markers={mapMarkers} center={{ lat: 39.925, lng: 32.836 }} zoom={11} />
            ) : (
              <MapBg style={{ flex: 1 }}>
                <MapPin x="15%" y="20%" label="P" size={26} />
                <MapPin x="50%" y="35%" label="P" size={26} />
                <MapPin x="30%" y="65%" label="P" size={26} color="#737373" />
                <MapPin x="70%" y="50%" label="P" size={26} />
                <MapPin x="60%" y="15%" label="P" size={26} />
              </MapBg>
            )}
            <View style={[s.heroMapCard, { bottom: 8, left: 8, right: 8 }]}>
              <View style={s.heroMapCardDot} />
              <View style={{ flex: 1 }}>
                <Text style={s.heroMapCardName}>Kızılay Meydanı</Text>
                <Text style={s.heroMapCardLoc}>3m x 6m · Müsait</Text>
              </View>
              <Text style={s.heroMapCardPrice}>1.166₺</Text>
            </View>
          </View>
        )}
      </View>
    </LinearGradient>
  );

  /* ── Stats ── */
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

  /* ── How it works ── */
  const howSection = (
    <View style={[s.section, isWeb && s.sectionWeb]}>
      <Text style={s.sectionLabel}>NASIL ÇALIŞIR?</Text>
      <Text style={[s.sectionTitle, isWeb && s.sectionTitleWeb]}>4 Adımda Reklamını Yayınla</Text>
      <Text style={s.sectionSubtitle}>Karmaşık süreçlere son. Praboard ile dijital pano reklamı vermek çok kolay.</Text>
      <View style={[s.stepsGrid, isWeb && s.stepsGridWeb]}>
        {steps.map((st, i) => (
          <View key={i} style={[s.stepCard, isWeb && s.stepCardWeb]}>
            <View style={s.stepNum}><Text style={s.stepNumText}>{st.num}</Text></View>
            <View style={s.stepIconCircle}><Ionicons name={st.icon} size={28} color="#059669" /></View>
            <Text style={s.stepTitle}>{st.title}</Text>
            <Text style={s.stepDesc}>{st.desc}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  /* ── NEW: Map Discovery Section ── */
  const mapDiscoverySection = (
    <View style={[s.section, s.sectionGray, isWeb && s.sectionWeb]}>
      <Text style={s.sectionLabel}>HARİTA İLE KEŞFET</Text>
      <Text style={[s.sectionTitle, isWeb && s.sectionTitleWeb]}>Şehrindeki Panoları Haritada Gör</Text>
      <Text style={s.sectionSubtitle}>
        Interaktif harita üzerinden dijital panoları keşfet. Lokasyon, boyut ve fiyat bilgilerini anında görüntüle.
      </Text>

      {/* Split: Real Map + Panel List */}
      <View style={[s.mapDiscovery, isWeb && s.mapDiscoveryWeb]}>
        {/* Real Leaflet map */}
        <View style={[s.mapSide, isWeb && s.mapSideWeb]}>
          {Platform.OS === 'web' ? (
            <WebMap
              markers={mapMarkers}
              center={{ lat: 39.925, lng: 32.836 }}
              zoom={12}
            />
          ) : (
            <MapBg style={{ flex: 1 }}>
              <MapPin x="18%" y="15%" label="P" size={28} />
              <MapPin x="52%" y="28%" label="P" size={28} />
              <MapPin x="35%" y="50%" label="P" size={28} color="#737373" />
              <MapPin x="72%" y="42%" label="P" size={28} />
              <MapPin x="25%" y="72%" label="P" size={28} />
              <MapPin x="62%" y="68%" label="P" size={28} color="#737373" />
            </MapBg>
          )}
        </View>

        {/* Panel list side (web only) */}
        {isWeb && (
          <View style={s.mapListSide}>
            <Text style={s.mapListTitle}>Yakınındaki Panolar</Text>
            {panelData.slice(0, 3).map((p, i) => (
              <View key={i} style={s.mapListCard}>
                <View style={[s.mapListIndicator, { backgroundColor: p.status === 'Müsait' ? '#22C55E' : '#D1D5DB' }]} />
                <View style={{ flex: 1 }}>
                  <Text style={s.mapListName}>{p.name}</Text>
                  <Text style={s.mapListLoc}>{p.loc} · {p.size}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={s.mapListPrice}>{p.price}₺</Text>
                  <Text style={s.mapListUnit}>/gün</Text>
                </View>
              </View>
            ))}
            <View style={s.mapListMore}>
              <Text style={s.mapListMoreText}>+3 pano daha</Text>
              <Ionicons name="chevron-forward" size={14} color="#059669" />
            </View>
          </View>
        )}
      </View>
    </View>
  );

  /* ── Features ── */
  const featuresSection = (
    <View style={[s.section, isWeb && s.sectionWeb]}>
      <Text style={s.sectionLabel}>ÖZELLİKLER</Text>
      <Text style={[s.sectionTitle, isWeb && s.sectionTitleWeb]}>Neden Praboard?</Text>
      <Text style={s.sectionSubtitle}>Geleneksel billboardların aksine, Praboard dijital ve şeffaf bir deneyim sunar.</Text>
      <View style={[s.featGrid, isWeb && s.featGridWeb]}>
        {features.map((f, i) => (
          <View key={i} style={[s.featCard, isWeb && s.featCardWeb]}>
            <View style={s.featIcon}><Ionicons name={f.icon} size={24} color="#059669" /></View>
            <Text style={s.featTitle}>{f.title}</Text>
            <Text style={s.featDesc}>{f.desc}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  /* ── NEW: App Screenshots / Uygulamadan Görünümler ── */
  const screenshotsSection = (
    <View style={[s.section, s.sectionDark, isWeb && s.sectionWeb]}>
      <Text style={[s.sectionLabel, { color: '#6EE7B7' }]}>UYGULAMADAN GÖRÜNÜMLER</Text>
      <Text style={[s.sectionTitle, isWeb && s.sectionTitleWeb, { color: '#fff' }]}>
        Uygulama İçinden Ekranlar
      </Text>
      <Text style={[s.sectionSubtitle, { color: '#94A3B8' }]}>
        Praboard'un mobil ve web arayüzünden görünümler
      </Text>

      <ScrollView
        horizontal={!isWeb}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[s.screenshotsRow, isWeb && s.screenshotsRowWeb]}
      >
        {/* Screen 1: Map / Panels */}
        <View style={s.screenshotItem}>
          <PhoneFrame title="Panolar" width={200} height={360}>
            <MapBg style={{ flex: 1 }}>
              <MapPin x="20%" y="20%" label="P" size={22} />
              <MapPin x="55%" y="35%" label="P" size={22} />
              <MapPin x="35%" y="60%" label="P" size={22} color="#737373" />
              <MapPin x="65%" y="55%" label="P" size={22} />
              <MapPin x="25%" y="78%" label="P" size={22} />
            </MapBg>
            <View style={s.ssTabBar}>
              <Ionicons name="home-outline" size={14} color="#aaa" />
              <Ionicons name="map" size={14} color="#059669" />
              <View style={s.ssAddBtn}><Ionicons name="add" size={14} color="#fff" /></View>
              <Ionicons name="notifications-outline" size={14} color="#aaa" />
              <Ionicons name="person-outline" size={14} color="#aaa" />
            </View>
          </PhoneFrame>
          <Text style={s.screenshotLabel}>Harita ile Pano Keşfi</Text>
        </View>

        {/* Screen 2: Ad Upload Wizard */}
        <View style={s.screenshotItem}>
          <PhoneFrame title="Reklam Oluştur" width={200} height={360}>
            <View style={s.ssUpload}>
              {/* Stepper */}
              <View style={s.ssStepper}>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <React.Fragment key={n}>
                    {n > 1 && <View style={[s.ssStepLine, n <= 3 && s.ssStepLineActive]} />}
                    <View style={[s.ssStepDot, n <= 3 && s.ssStepDotActive]}>
                      <Text style={[s.ssStepNum, n <= 3 && { color: '#fff' }]}>{n}</Text>
                    </View>
                  </React.Fragment>
                ))}
              </View>
              <Text style={s.ssUploadTitle}>Medya Yükle</Text>
              {/* Upload area */}
              <View style={s.ssUploadArea}>
                <View style={s.ssUploadIcon}>
                  <Ionicons name="cloud-upload-outline" size={28} color="#059669" />
                </View>
                <Text style={s.ssUploadHint}>Görsel veya Video</Text>
                <Text style={s.ssUploadSub}>Max 60 sn video</Text>
              </View>
              {/* Preview placeholder */}
              <View style={s.ssPreview}>
                <View style={[s.ssPreviewThumb, { backgroundColor: '#D1FAE5' }]}>
                  <Ionicons name="image" size={16} color="#059669" />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={[s.ssLine, { width: '70%' }]} />
                  <View style={[s.ssLine, { width: '45%', opacity: 0.4 }]} />
                </View>
                <Ionicons name="checkmark-circle" size={16} color="#22C55E" />
              </View>
            </View>
          </PhoneFrame>
          <Text style={s.screenshotLabel}>6 Adımlı Reklam Yükleme</Text>
        </View>

        {/* Screen 3: Order Tracking */}
        <View style={s.screenshotItem}>
          <PhoneFrame title="Sipariş Detayı" width={200} height={360}>
            <View style={s.ssOrder}>
              {/* Billboard montage mini */}
              <View style={s.ssOrderBillboard}>
                <View style={s.ssOrderBbFrame}>
                  <View style={s.ssOrderBbScreen}>
                    <Ionicons name="image" size={20} color="#059669" />
                  </View>
                  <View style={s.ssOrderBbLeg} />
                </View>
                <Text style={s.ssOrderBbLabel}>Kızılay Meydanı</Text>
              </View>
              {/* Status timeline */}
              <View style={s.ssTimeline}>
                {[
                  { label: 'Onay Bekliyor', done: true },
                  { label: 'Hazırlanıyor', done: true },
                  { label: 'Yayında', done: true, active: true },
                  { label: 'Tamamlandı', done: false },
                ].map((step, i) => (
                  <View key={i} style={s.ssTimelineItem}>
                    <View style={s.ssTimelineLeft}>
                      <View style={[
                        s.ssTimelineDot,
                        step.done && s.ssTimelineDotDone,
                        step.active && s.ssTimelineDotActive,
                      ]}>
                        {step.done && <Ionicons name="checkmark" size={10} color="#fff" />}
                      </View>
                      {i < 3 && <View style={[s.ssTimelineLine, step.done && !step.active && s.ssTimelineLineDone]} />}
                    </View>
                    <Text style={[s.ssTimelineLabel, step.active && { color: '#059669', fontWeight: '700' }]}>
                      {step.label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </PhoneFrame>
          <Text style={s.screenshotLabel}>Gerçek Zamanlı Takip</Text>
        </View>
      </ScrollView>
    </View>
  );

  /* ── NEW: Billboard Montage Section ── */
  const billboardSection = (
    <View style={[s.section, isWeb && s.sectionWeb]}>
      <Text style={s.sectionLabel}>DİJİTAL PANO</Text>
      <Text style={[s.sectionTitle, isWeb && s.sectionTitleWeb]}>Reklamınız Böyle Görünecek</Text>
      <Text style={s.sectionSubtitle}>
        Yüklediğiniz reklam, seçtiğiniz dijital panoda gerçek zamanlı olarak yayınlanır.
      </Text>

      {/* Billboard mockup */}
      <View style={[s.bbContainer, isWeb && s.bbContainerWeb]}>
        {/* Street context */}
        <View style={s.bbScene}>
          {/* Sky */}
          <LinearGradient colors={['#93C5FD', '#DBEAFE']} style={s.bbSky} />
          {/* Billboard structure */}
          <View style={s.bbStructure}>
            <View style={s.bbFrame}>
              <View style={s.bbScreenGrad}>
                <LinearGradient colors={['#059669', '#10B981']} style={s.bbAdContent}>
                  <PraboardLogo size={32} variant="onGradient" />
                  <Text style={s.bbAdTitle}>Yeni Ürün Lansmanı</Text>
                  <Text style={s.bbAdSub}>Harika fırsatlar sizi bekliyor!</Text>
                  <View style={s.bbAdBadge}>
                    <Text style={s.bbAdBadgeText}>REKLAMINIZ</Text>
                  </View>
                </LinearGradient>
              </View>
              {/* Panel info */}
              <View style={s.bbInfoStrip}>
                <Ionicons name="tv-outline" size={10} color="#6B7280" />
                <Text style={s.bbInfoText}>Kızılay Meydanı · 3m x 6m · Canlı</Text>
                <View style={s.bbLiveDot} />
              </View>
            </View>
            {/* Pole */}
            <View style={s.bbPole} />
          </View>
          {/* Ground */}
          <View style={s.bbGround} />
        </View>

        {/* Info cards */}
        <View style={[s.bbInfo, isWeb && s.bbInfoWeb]}>
          {[
            { icon: 'eye-outline', title: 'Canlı Önizleme', desc: 'Yüklemeden önce reklamınızı panoda nasıl görüneceğini inceleyin.' },
            { icon: 'camera-outline', title: 'Kanıt Fotoğrafı', desc: 'Saha ekibimiz yayın başladığında kanıt fotoğrafı çeker.' },
            { icon: 'time-outline', title: '7/24 Yayın', desc: 'Reklamınız seçtiğiniz tarih aralığında kesintisiz yayınlanır.' },
          ].map((item, i) => (
            <View key={i} style={s.bbInfoCard}>
              <View style={s.bbInfoIcon}>
                <Ionicons name={item.icon} size={20} color="#059669" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.bbInfoTitle}>{item.title}</Text>
                <Text style={s.bbInfoDesc}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  /* ── Panels (enhanced) ── */
  const panelsSection = (
    <View style={[s.section, s.sectionGray, isWeb && s.sectionWeb]}>
      <Text style={s.sectionLabel}>PANOLAR</Text>
      <Text style={[s.sectionTitle, isWeb && s.sectionTitleWeb]}>Dijital Pano Lokasyonları</Text>
      <Text style={s.sectionSubtitle}>Ankara'nın en stratejik noktalarındaki dijital panolardan seçim yap.</Text>
      <View style={[s.panelGrid, isWeb && s.panelGridWeb]}>
        {panelData.map((p, i) => (
          <View key={i} style={[s.panelCard, isWeb && s.panelCardWeb]}>
            {/* Mini map preview */}
            <View style={s.panelMapPreview}>
              <MapBg style={{ flex: 1 }}>
                <MapPin
                  x="42%"
                  y="30%"
                  label="P"
                  size={24}
                  color={p.status === 'Müsait' ? '#22C55E' : '#737373'}
                />
              </MapBg>
              {p.badge && (
                <View style={s.panelBadge}><Text style={s.panelBadgeText}>{p.badge}</Text></View>
              )}
              <View style={[s.panelStatusDot, { backgroundColor: p.status === 'Müsait' ? '#22C55E' : '#F59E0B' }]} />
            </View>
            <Text style={s.panelName}>{p.name}</Text>
            <View style={s.panelLocRow}>
              <Ionicons name="location-outline" size={12} color="#9CA3AF" />
              <Text style={s.panelLoc}>{p.loc}</Text>
            </View>
            <Text style={s.panelSize}>{p.size}</Text>
            <View style={s.panelPriceRow}>
              <Text style={s.panelPrice}>{p.price} TL</Text>
              <Text style={s.panelPriceUnit}>/gün</Text>
            </View>
            <View style={[s.panelStatusBadge, { backgroundColor: p.status === 'Müsait' ? '#ECFDF5' : '#FEF3C7' }]}>
              <Text style={[s.panelStatusText, { color: p.status === 'Müsait' ? '#059669' : '#D97706' }]}>{p.status}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  /* ── System flow ── */
  const systemSection = (
    <View style={[s.section, s.sectionDark2, isWeb && s.sectionWeb]}>
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

  /* ── CTA ── */
  const ctaSection = (
    <LinearGradient colors={['#059669', '#10B981']} style={[s.ctaSection, isWeb && s.ctaSectionWeb]}>
      <PraboardLogo size={56} variant="onGradient" />
      <Text style={[s.ctaTitle, isWeb && s.ctaTitleWeb]}>Dijital Reklamcılığa Başla</Text>
      <Text style={s.ctaSubtitle}>Hemen ücretsiz hesap oluştur, ilk kampanyanı başlat.</Text>
      <View style={s.ctaBtns}>
        <TouchableOpacity onPress={go('Register')} style={s.ctaBtn}>
          <Text style={s.ctaBtnText}>Ücretsiz Kayıt Ol</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={go('Login')} style={s.ctaSecBtn}>
          <Text style={s.ctaSecBtnText}>Giriş Yap</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  /* ── Footer ── */
  const footer = (
    <View style={[s.footer, isWeb && s.footerWeb]}>
      <View style={s.footerBrand}>
        <PraboardLogo size={28} variant="standalone" />
        <Text style={s.footerBrandText}>Praboard</Text>
      </View>
      <Text style={s.footerCopy}>© 2025 Praboard. Dijital Açık Hava Reklamcılığı Platformu.</Text>
    </View>
  );

  return (
    <View style={s.root}>
      {navbar}
      <ScrollView ref={scrollRef} style={s.scroll} showsVerticalScrollIndicator={false}>
        {heroSection}
        {statsSection}
        {howSection}
        {mapDiscoverySection}
        {featuresSection}
        {screenshotsSection}
        {billboardSection}
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
  navbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  navbarWeb: { paddingHorizontal: 48 },
  navBrand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  navBrandText: { fontSize: 20, fontWeight: '800', color: colors.textPrimary },
  navActions: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  navLink: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  navCta: { backgroundColor: '#059669', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  navCtaText: { fontSize: 14, fontWeight: '700', color: '#fff' },

  /* Hero */
  hero: { paddingTop: 40, paddingBottom: 60 },
  heroInner: { paddingHorizontal: 24 },
  heroInnerWeb: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 64, maxWidth: 1200, alignSelf: 'center', width: '100%', gap: 60 },
  heroText: { flex: 1 },
  heroTextWeb: { flex: 1 },
  heroBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, gap: 6, marginBottom: 24 },
  heroBadgeText: { fontSize: 13, color: '#D1FAE5', fontWeight: '600' },
  heroTitle: { fontSize: 32, fontWeight: '900', color: '#fff', lineHeight: 42, marginBottom: 16 },
  heroTitleWeb: { fontSize: 48, lineHeight: 60 },
  heroSubtitle: { fontSize: 16, color: 'rgba(255,255,255,0.85)', lineHeight: 26, marginBottom: 32, maxWidth: 500 },
  heroCtas: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  heroBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 28, paddingVertical: 14, borderRadius: 12, gap: 8 },
  heroBtnText: { fontSize: 16, fontWeight: '700', color: '#065F46' },
  heroSecBtn: { borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)', paddingHorizontal: 28, paddingVertical: 14, borderRadius: 12 },
  heroSecBtnText: { fontSize: 16, fontWeight: '600', color: '#fff' },

  /* Hero visual */
  heroVisual: { flex: 0, width: 290, alignItems: 'center' },
  heroMapCard: { position: 'absolute', bottom: 12, left: 12, right: 12, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, padding: 10, gap: 10, ...(Platform.OS === 'web' ? { boxShadow: '0 4px 12px rgba(0,0,0,0.15)' } : { elevation: 6 }) },
  heroMapCardDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#22C55E' },
  heroMapCardName: { fontSize: 12, fontWeight: '700', color: '#1F2937' },
  heroMapCardLoc: { fontSize: 10, color: '#6B7280', marginTop: 1 },
  heroMapCardPrice: { fontSize: 14, fontWeight: '800', color: '#059669' },

  mockTabBar: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 8, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  mockTabDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#059669', marginTop: 2 },
  mockAddBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#059669', justifyContent: 'center', alignItems: 'center' },

  /* Stats bar */
  statsBar: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 28, paddingHorizontal: 16, backgroundColor: '#F0FDF4', flexWrap: 'wrap', gap: 12 },
  statsBarWeb: { paddingVertical: 36, paddingHorizontal: 64, maxWidth: 1200, alignSelf: 'center', width: '100%' },
  statItem: { alignItems: 'center', minWidth: 70 },
  statValue: { fontSize: 28, fontWeight: '900', color: '#065F46' },
  statValueWeb: { fontSize: 36 },
  statLabel: { fontSize: 13, color: '#6B7280', marginTop: 4, fontWeight: '500' },

  /* Sections */
  section: { paddingVertical: 56, paddingHorizontal: 24 },
  sectionWeb: { paddingVertical: 72, paddingHorizontal: 64, maxWidth: 1200, alignSelf: 'center', width: '100%' },
  sectionGray: { backgroundColor: '#F9FAFB' },
  sectionDark: { backgroundColor: '#0F172A' },
  sectionDark2: { backgroundColor: '#111827' },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: '#059669', letterSpacing: 2, textAlign: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 26, fontWeight: '800', color: colors.textPrimary, textAlign: 'center', marginBottom: 12 },
  sectionTitleWeb: { fontSize: 34 },
  sectionSubtitle: { fontSize: 15, color: '#6B7280', textAlign: 'center', lineHeight: 24, marginBottom: 40, maxWidth: 560, alignSelf: 'center' },

  /* Steps */
  stepsGrid: { gap: 20 },
  stepsGridWeb: { flexDirection: 'row', justifyContent: 'center', gap: 24 },
  stepCard: { backgroundColor: '#fff', borderRadius: 16, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: '#F3F4F6' },
  stepCardWeb: { flex: 1, maxWidth: 260 },
  stepNum: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#059669', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  stepNumText: { fontSize: 14, fontWeight: '800', color: '#fff' },
  stepIconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#ECFDF5', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  stepTitle: { fontSize: 17, fontWeight: '700', color: colors.textPrimary, marginBottom: 8, textAlign: 'center' },
  stepDesc: { fontSize: 14, color: '#6B7280', lineHeight: 22, textAlign: 'center' },

  /* Map Discovery */
  mapDiscovery: { borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' },
  mapDiscoveryWeb: { flexDirection: 'row', height: 380 },
  mapSide: { height: 280, borderRadius: 0 },
  mapSideWeb: { flex: 1, height: 'auto' },
  mapListSide: { width: 320, backgroundColor: '#fff', padding: 20, borderLeftWidth: 1, borderLeftColor: '#F3F4F6' },
  mapListTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 16 },
  mapListCard: { flexDirection: 'row', alignItems: 'center', padding: 14, backgroundColor: '#F9FAFB', borderRadius: 12, marginBottom: 10, gap: 12 },
  mapListIndicator: { width: 8, height: 8, borderRadius: 4 },
  mapListName: { fontSize: 14, fontWeight: '600', color: '#1F2937' },
  mapListLoc: { fontSize: 11, color: '#6B7280', marginTop: 2 },
  mapListPrice: { fontSize: 16, fontWeight: '800', color: '#059669' },
  mapListUnit: { fontSize: 10, color: '#9CA3AF' },
  mapListMore: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, gap: 4 },
  mapListMoreText: { fontSize: 13, fontWeight: '600', color: '#059669' },

  /* Features grid */
  featGrid: { gap: 16 },
  featGridWeb: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 20 },
  featCard: { backgroundColor: '#fff', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: '#F3F4F6' },
  featCardWeb: { width: '30%', minWidth: 280 },
  featIcon: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#ECFDF5', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  featTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 8 },
  featDesc: { fontSize: 14, color: '#6B7280', lineHeight: 22 },

  /* Screenshots */
  screenshotsRow: { gap: 32, paddingHorizontal: 20, paddingVertical: 8 },
  screenshotsRowWeb: { flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 0 },
  screenshotItem: { alignItems: 'center' },
  screenshotLabel: { fontSize: 14, fontWeight: '600', color: '#D1D5DB', marginTop: 16 },
  ssTabBar: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 7, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  ssAddBtn: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#059669', justifyContent: 'center', alignItems: 'center' },

  /* SS: Upload */
  ssUpload: { flex: 1, padding: 12 },
  ssStepper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  ssStepDot: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' },
  ssStepDotActive: { backgroundColor: '#059669' },
  ssStepLine: { width: 14, height: 2, backgroundColor: '#E5E7EB' },
  ssStepLineActive: { backgroundColor: '#059669' },
  ssStepNum: { fontSize: 9, fontWeight: '700', color: '#9CA3AF' },
  ssUploadTitle: { fontSize: 13, fontWeight: '700', color: '#1F2937', marginBottom: 10 },
  ssUploadArea: { borderWidth: 2, borderColor: '#D1FAE5', borderStyle: 'dashed', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 12, backgroundColor: '#F0FDF4' },
  ssUploadIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#D1FAE5', justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  ssUploadHint: { fontSize: 11, fontWeight: '600', color: '#374151' },
  ssUploadSub: { fontSize: 9, color: '#9CA3AF', marginTop: 2 },
  ssPreview: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderRadius: 8, padding: 8, gap: 8 },
  ssPreviewThumb: { width: 32, height: 32, borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
  ssLine: { height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, marginBottom: 4 },

  /* SS: Order */
  ssOrder: { flex: 1, padding: 12 },
  ssOrderBillboard: { alignItems: 'center', marginBottom: 14 },
  ssOrderBbFrame: { alignItems: 'center' },
  ssOrderBbScreen: { width: 120, height: 60, backgroundColor: '#D1FAE5', borderRadius: 6, borderWidth: 2, borderColor: '#374151', justifyContent: 'center', alignItems: 'center' },
  ssOrderBbLeg: { width: 4, height: 16, backgroundColor: '#6B7280' },
  ssOrderBbLabel: { fontSize: 10, fontWeight: '600', color: '#6B7280', marginTop: 4 },
  ssTimeline: { gap: 0 },
  ssTimelineItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  ssTimelineLeft: { alignItems: 'center', width: 18 },
  ssTimelineDot: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' },
  ssTimelineDotDone: { backgroundColor: '#22C55E' },
  ssTimelineDotActive: { backgroundColor: '#059669', borderWidth: 2, borderColor: '#A7F3D0' },
  ssTimelineLine: { width: 2, height: 20, backgroundColor: '#E5E7EB' },
  ssTimelineLineDone: { backgroundColor: '#22C55E' },
  ssTimelineLabel: { fontSize: 11, color: '#6B7280', paddingTop: 2, paddingBottom: 8 },

  /* Billboard mockup */
  bbContainer: {},
  bbContainerWeb: { flexDirection: 'row', gap: 40, alignItems: 'center' },
  bbScene: { alignItems: 'center', borderRadius: 16, overflow: 'hidden', position: 'relative' },
  bbSky: { position: 'absolute', top: 0, left: 0, right: 0, height: '70%' },
  bbStructure: { alignItems: 'center', paddingTop: 40, paddingBottom: 0, zIndex: 2 },
  bbFrame: { borderRadius: 8, overflow: 'hidden', ...(Platform.OS === 'web' ? { boxShadow: '0 8px 24px rgba(0,0,0,0.2)' } : { elevation: 10 }) },
  bbScreenGrad: { width: 280, height: 140 },
  bbAdContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  bbAdTitle: { fontSize: 15, fontWeight: '800', color: '#fff', marginTop: 6 },
  bbAdSub: { fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  bbAdBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  bbAdBadgeText: { fontSize: 8, fontWeight: '700', color: '#fff', letterSpacing: 1 },
  bbInfoStrip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1F2937', paddingHorizontal: 10, paddingVertical: 5, gap: 4 },
  bbInfoText: { fontSize: 9, color: '#9CA3AF', flex: 1 },
  bbLiveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#22C55E' },
  bbPole: { width: 8, height: 50, backgroundColor: '#6B7280', borderBottomLeftRadius: 4, borderBottomRightRadius: 4 },
  bbGround: { height: 40, backgroundColor: '#D1D5DB', width: '100%' },
  bbInfo: { marginTop: 24, gap: 16 },
  bbInfoWeb: { flex: 1, marginTop: 0 },
  bbInfoCard: { flexDirection: 'row', gap: 14, padding: 16, backgroundColor: '#F9FAFB', borderRadius: 12, borderWidth: 1, borderColor: '#F3F4F6' },
  bbInfoIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#ECFDF5', justifyContent: 'center', alignItems: 'center' },
  bbInfoTitle: { fontSize: 14, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  bbInfoDesc: { fontSize: 12, color: '#6B7280', lineHeight: 18 },

  /* Panels (enhanced) */
  panelGrid: { gap: 16 },
  panelGridWeb: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 20 },
  panelCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  panelCardWeb: { width: '22%', minWidth: 240 },
  panelMapPreview: { height: 100, borderRadius: 12, overflow: 'hidden', marginBottom: 12, position: 'relative' },
  panelBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: '#F2714D', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
  panelBadgeText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  panelStatusDot: { position: 'absolute', top: 8, left: 8, width: 10, height: 10, borderRadius: 5, borderWidth: 2, borderColor: '#fff' },
  panelName: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  panelLocRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 },
  panelLoc: { fontSize: 12, color: '#9CA3AF' },
  panelSize: { fontSize: 12, color: '#9CA3AF', marginBottom: 8 },
  panelPriceRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 8 },
  panelPrice: { fontSize: 22, fontWeight: '800', color: '#059669' },
  panelPriceUnit: { fontSize: 13, color: '#9CA3AF', marginLeft: 2 },
  panelStatusBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  panelStatusText: { fontSize: 12, fontWeight: '600' },

  /* System flow */
  flowRow: { alignItems: 'center', gap: 8, marginBottom: 32 },
  flowRowWeb: { flexDirection: 'row', justifyContent: 'center', gap: 16 },
  flowItem: { alignItems: 'center' },
  flowIcon: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  flowLabel: { fontSize: 13, fontWeight: '600', color: '#D1D5DB', textAlign: 'center', lineHeight: 18 },
  flowArrow: { paddingVertical: 4 },
  systemNote: { fontSize: 14, color: '#9CA3AF', textAlign: 'center', lineHeight: 22, maxWidth: 500, alignSelf: 'center' },

  /* CTA */
  ctaSection: { padding: 48, alignItems: 'center' },
  ctaSectionWeb: { paddingVertical: 72 },
  ctaTitle: { fontSize: 28, fontWeight: '800', color: '#fff', marginTop: 20, marginBottom: 12, textAlign: 'center' },
  ctaTitleWeb: { fontSize: 36 },
  ctaSubtitle: { fontSize: 16, color: 'rgba(255,255,255,0.85)', marginBottom: 32, textAlign: 'center' },
  ctaBtns: { flexDirection: 'row', gap: 12, flexWrap: 'wrap', justifyContent: 'center' },
  ctaBtn: { backgroundColor: '#fff', paddingHorizontal: 32, paddingVertical: 16, borderRadius: 12 },
  ctaBtnText: { fontSize: 16, fontWeight: '700', color: '#065F46' },
  ctaSecBtn: { borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)', paddingHorizontal: 32, paddingVertical: 16, borderRadius: 12 },
  ctaSecBtnText: { fontSize: 16, fontWeight: '600', color: '#fff' },

  /* Footer */
  footer: { padding: 24, backgroundColor: '#F9FAFB', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  footerWeb: { paddingVertical: 32 },
  footerBrand: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  footerBrandText: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  footerCopy: { fontSize: 13, color: '#9CA3AF' },
});

export default OnboardingScreen;
