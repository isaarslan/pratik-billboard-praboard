import React from 'react';
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

const features = [
  {
    icon: 'megaphone-outline',
    title: 'Dijital Pano Reklamcılığı',
    desc: 'Reklamlarını şehrindeki dijital panolarda yayınla, geniş kitlelere ulaş.',
  },
  {
    icon: 'leaf-outline',
    title: 'Çevre Dostu Yaklaşım',
    desc: 'Kağıtsız, dijital açık hava reklamcılığı ile çevreye katkı sağla.',
  },
  {
    icon: 'bar-chart-outline',
    title: 'Kampanya Yönetimi',
    desc: 'Bölgene özel kampanyalar oluştur, performansını takip et.',
  },
];

const OnboardingScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const isWide = Platform.OS === 'web' && width > 768;

  const handleLogin = () => navigation.replace('Login');
  const handleRegister = () => navigation.replace('Register');

  const brandPanel = (
    <LinearGradient colors={['#16A34A', '#22C55E']} style={styles.brandPanel}>
      <View style={styles.brandContent}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>P</Text>
        </View>
        <Text style={styles.brandName}>Praboard</Text>
        <Text style={styles.brandTagline}>Yeşil Reklamcılık Platformu</Text>

        <View style={styles.brandFeatures}>
          <View style={styles.brandFeatureRow}>
            <Ionicons name="checkmark-circle" size={20} color="rgba(255,255,255,0.9)" />
            <Text style={styles.brandFeatureText}>Dijital panolarla açık hava reklamcılığı</Text>
          </View>
          <View style={styles.brandFeatureRow}>
            <Ionicons name="checkmark-circle" size={20} color="rgba(255,255,255,0.9)" />
            <Text style={styles.brandFeatureText}>Çevre dostu, kağıtsız reklam çözümleri</Text>
          </View>
          <View style={styles.brandFeatureRow}>
            <Ionicons name="checkmark-circle" size={20} color="rgba(255,255,255,0.9)" />
            <Text style={styles.brandFeatureText}>Yerel kampanya yönetimi ve takibi</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );

  const mainContent = (
    <ScrollView
      style={styles.mainPanel}
      contentContainerStyle={styles.mainContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.welcomeTitle}>Praboard'a Hoş Geldin!</Text>
      <Text style={styles.welcomeSubtitle}>
        Dijital panolar üzerinden reklamını yayınla, şehrinin nabzını tut.
      </Text>

      <View style={styles.featureCards}>
        {features.map((f, i) => (
          <View key={i} style={styles.featureCard}>
            <View style={styles.featureIconCircle}>
              <Ionicons name={f.icon} size={24} color={colors.primary} />
            </View>
            <View style={styles.featureInfo}>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.ctaSection}>
        <TouchableOpacity onPress={handleRegister} style={styles.ctaPrimary}>
          <Text style={styles.ctaPrimaryText}>Hemen Kayıt Ol</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogin} style={styles.ctaSecondary}>
          <Text style={styles.ctaSecondaryText}>Zaten hesabım var, Giriş Yap</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  if (isWide) {
    return (
      <View style={styles.splitContainer}>
        <View style={styles.splitLeft}>{brandPanel}</View>
        <View style={styles.splitRight}>{mainContent}</View>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#16A34A', '#22C55E']} style={styles.mobileContainer}>
      <ScrollView contentContainerStyle={styles.mobileContent} showsVerticalScrollIndicator={false}>
        <View style={styles.mobileLogoSection}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>P</Text>
          </View>
          <Text style={styles.brandName}>Praboard</Text>
          <Text style={styles.brandTagline}>Yeşil Reklamcılık Platformu</Text>
        </View>

        <View style={styles.mobileFeatures}>
          {features.map((f, i) => (
            <View key={i} style={styles.mobileFeatureRow}>
              <View style={styles.mobileFeatureIcon}>
                <Ionicons name={f.icon} size={22} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.mobileFeatureTitle}>{f.title}</Text>
                <Text style={styles.mobileFeatureDesc}>{f.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.mobileCta}>
          <TouchableOpacity onPress={handleRegister} style={styles.mobileCtaPrimary}>
            <Text style={styles.mobileCtaPrimaryText}>Hemen Kayıt Ol</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogin} style={styles.mobileCtaSecondary}>
            <Text style={styles.mobileCtaSecondaryText}>Zaten hesabım var, Giriş Yap</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  // Web split layout
  splitContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  splitLeft: {
    flex: 1,
  },
  splitRight: {
    flex: 1,
    backgroundColor: '#fff',
  },
  brandPanel: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48,
  },
  brandContent: {
    alignItems: 'center',
    maxWidth: 400,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 56,
    fontWeight: '900',
    color: '#fff',
  },
  brandName: {
    fontSize: 36,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 1,
  },
  brandTagline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 8,
    letterSpacing: 0.5,
  },
  brandFeatures: {
    marginTop: 40,
    gap: 16,
  },
  brandFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandFeatureText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 22,
  },
  // Right panel content
  mainPanel: {
    flex: 1,
  },
  mainContent: {
    padding: 48,
    justifyContent: 'center',
    flexGrow: 1,
    maxWidth: 520,
    alignSelf: 'center',
    width: '100%',
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 36,
  },
  featureCards: {
    gap: 16,
    marginBottom: 40,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  featureIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  ctaSection: {
    gap: 12,
  },
  ctaPrimary: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaPrimaryText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  ctaSecondary: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaSecondaryText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  // Mobile layout
  mobileContainer: {
    flex: 1,
  },
  mobileContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 30,
  },
  mobileLogoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  mobileFeatures: {
    gap: 20,
    marginBottom: 40,
  },
  mobileFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  mobileFeatureIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobileFeatureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  mobileFeatureDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 18,
  },
  mobileCta: {
    gap: 12,
  },
  mobileCtaPrimary: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  mobileCtaPrimaryText: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: '700',
  },
  mobileCtaSecondary: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.6)',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  mobileCtaSecondaryText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default OnboardingScreen;
