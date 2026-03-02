import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { TextInput, PrimaryButton } from '../../components';
import PraboardLogo from '../../components/PraboardLogo';
import { colors } from '../../theme/colors';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { width } = useWindowDimensions();
  const isWide = Platform.OS === 'web' && width > 768;

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Lütfen e-posta ve şifre alanlarını doldurun.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await signIn({ email: email.trim(), password });
    } catch (err) {
      const msg = err?.message || '';
      const status = err?.status || err?.statusCode;
      if (status === 429 || msg.includes('rate limit') || msg.includes('too many requests')) {
        setError('Çok fazla deneme yaptınız. Lütfen birkaç dakika bekleyip tekrar deneyin.');
      } else if (msg.includes('Invalid login credentials')) {
        setError('E-posta veya şifre hatalı.');
      } else if (msg.includes('Email not confirmed')) {
        setError('Lütfen önce e-posta adresinizi doğrulayın.');
      } else {
        setError('Giriş yapılırken bir hata oluştu. Tekrar deneyin.');
      }
    } finally {
      setLoading(false);
    }
  };

  const loginForm = (
    <>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.form}>
        <TextInput
          label="E-Posta"
          value={email}
          onChangeText={(t) => { setEmail(t); setError(''); }}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          label="Şifre"
          value={password}
          onChangeText={(t) => { setPassword(t); setError(''); }}
          secureTextEntry
        />

        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}
          style={styles.forgotPasswordContainer}
        >
          <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
        </TouchableOpacity>

        <PrimaryButton
          title={loading ? '' : 'Giriş Yap'}
          onPress={handleLogin}
          disabled={loading}
          style={styles.submitButton}
        />
        {loading && (
          <ActivityIndicator
            color={colors.white}
            style={styles.loadingIndicator}
          />
        )}

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>
            Hesabın yok mu? <Text style={styles.linkBold}>Kayıt ol!</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );

  if (isWide) {
    return (
      <View style={styles.splitContainer}>
        <LinearGradient colors={['#065F46', '#059669', '#10B981']} style={styles.brandPanel}>
          <View style={styles.brandContent}>
            <PraboardLogo size={100} variant="onGradient" />
            <Text style={styles.brandName}>Praboard</Text>
            <Text style={styles.brandTagline}>Dijital Açık Hava Reklamcılığı</Text>

            <View style={styles.brandFeatures}>
              <View style={styles.brandFeatureRow}>
                <Ionicons name="checkmark-circle" size={20} color="rgba(255,255,255,0.9)" />
                <Text style={styles.brandFeatureText}>Reklamını dijital panolarda yayınla</Text>
              </View>
              <View style={styles.brandFeatureRow}>
                <Ionicons name="checkmark-circle" size={20} color="rgba(255,255,255,0.9)" />
                <Text style={styles.brandFeatureText}>Şeffaf fiyatlandırma, kanıtlı yayın</Text>
              </View>
              <View style={styles.brandFeatureRow}>
                <Ionicons name="checkmark-circle" size={20} color="rgba(255,255,255,0.9)" />
                <Text style={styles.brandFeatureText}>Her yerden kampanya yönetimi</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
        <View style={styles.splitRight}>
          <ScrollView
            contentContainerStyle={styles.formContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.formTitle}>Giriş Yap</Text>
            <Text style={styles.formSubtitle}>
              Hesabına giriş yapmak için bilgilerini gir.
            </Text>
            {loginForm}
          </ScrollView>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <LinearGradient colors={['#065F46', '#059669']} style={styles.header}>
            <PraboardLogo size={88} variant="onGradient" />
            <Text style={styles.headerTitle}>Giriş Yap</Text>
          </LinearGradient>

          <View style={styles.content}>
            <Text style={styles.title}>Hoş geldin!</Text>
            <Text style={styles.subtitle}>
              Giriş yapmak için lütfen bilgilerini gir.
            </Text>
            {loginForm}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Web split
  splitContainer: {
    flex: 1,
    flexDirection: 'row',
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
  brandName: {
    fontSize: 36,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 1,
    marginTop: 20,
  },
  brandTagline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 8,
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
  splitRight: {
    flex: 1,
    backgroundColor: '#fff',
    minWidth: 0,
  },
  formContent: {
    paddingHorizontal: 40,
    paddingVertical: 48,
    justifyContent: 'center',
    flexGrow: 1,
  },
  formTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 32,
  },
  // Mobile
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    gap: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.white,
    letterSpacing: 0.5,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  // Shared
  form: {
    width: '100%',
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    textAlign: 'center',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: -8,
    marginBottom: 16,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  submitButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  loadingIndicator: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 52,
  },
  linkText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  linkBold: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});
