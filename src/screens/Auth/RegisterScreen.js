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
import {
  TextInput,
  PrimaryButton,
  SuccessModal,
} from '../../components';
import PraboardLogo from '../../components/PraboardLogo';
import { colors } from '../../theme/colors';
import { useAuth } from '../../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const { width } = useWindowDimensions();
  const isWide = Platform.OS === 'web' && width > 768;

  const validate = () => {
    if (!fullName.trim()) return 'Ad Soyad alanı zorunludur.';
    if (!email.trim()) return 'E-posta alanı zorunludur.';
    if (!password.trim()) return 'Şifre alanı zorunludur.';
    if (password.length < 6) return 'Şifre en az 6 karakter olmalıdır.';
    if (!/\S+@\S+\.\S+/.test(email.trim())) return 'Geçerli bir e-posta adresi girin.';
    return null;
  };

  const handleRegister = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setLoading(true);
    try {
      await signUp({
        email: email.trim(),
        password,
        fullName: fullName.trim(),
        phone: phone.trim(),
      });
      setShowSuccess(true);
    } catch (err) {
      const msg = err?.message || '';
      const status = err?.status || err?.statusCode;
      if (status === 429 || msg.includes('rate limit') || msg.includes('too many requests')) {
        setError('Çok fazla deneme yaptınız. Lütfen birkaç dakika bekleyip tekrar deneyin.');
      } else if (status === 406 || msg.includes('not acceptable')) {
        setError('E-posta gönderim limiti aşıldı. Lütfen 1 saat bekleyip tekrar deneyin.');
      } else if (msg.includes('already registered') || msg.includes('already been registered')) {
        setError('Bu e-posta adresi zaten kayıtlı. Giriş yapmayı deneyin.');
      } else if (msg.includes('password')) {
        setError('Şifre en az 6 karakter olmalıdır.');
      } else {
        setError(`Kayıt hatası: ${msg || 'Bilinmeyen hata'} (${status || 'N/A'})`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setShowSuccess(false);
    navigation.navigate('UsernameSelect');
  };

  const registerForm = (
    <>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.form}>
        <TextInput
          label="Ad Soyad"
          value={fullName}
          onChangeText={(t) => { setFullName(t); setError(''); }}
          autoCapitalize="words"
        />

        <TextInput
          label="Telefon"
          value={phone}
          onChangeText={(t) => { setPhone(t); setError(''); }}
          keyboardType="phone-pad"
        />

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

        <PrimaryButton
          title={loading ? '' : 'Keşfetmeye Başla!'}
          onPress={handleRegister}
          disabled={loading}
          style={styles.submitButton}
        />
        {loading && (
          <ActivityIndicator
            color={colors.white}
            style={styles.loadingIndicator}
          />
        )}

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>
            Hesabın var mı? <Text style={styles.linkBold}>Giriş yap!</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const successModal = (
    <SuccessModal
      visible={showSuccess}
      message="Hesabın başarıyla oluşturuldu! Şimdi bir kullanıcı adı seç."
      buttonTitle="Devam Et"
      onPress={handleSuccess}
    />
  );

  if (isWide) {
    return (
      <View style={styles.splitContainer}>
        <LinearGradient colors={['#16A34A', '#22C55E']} style={styles.brandPanel}>
          <View style={styles.brandContent}>
            <PraboardLogo size={110} variant="onGradient" />
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
        <View style={styles.splitRight}>
          <ScrollView
            contentContainerStyle={styles.formContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.formTitle}>Yeni Hesap Oluştur</Text>
            <Text style={styles.formSubtitle}>
              Hemen kaydol ve Praboard'un fırsatlarını keşfet!
            </Text>
            {registerForm}
          </ScrollView>
        </View>
        {successModal}
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
          <LinearGradient colors={['#16A34A', '#22C55E']} style={styles.header}>
            <PraboardLogo size={88} variant="onGradient" />
          </LinearGradient>

          <View style={styles.content}>
            <Text style={styles.title}>Yeni hesap oluştur!</Text>
            <Text style={styles.mobileSubtitle}>
              Hemen kaydol ve Praboard'un fırsatlarını keşfet!
            </Text>
            {registerForm}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {successModal}
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
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
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
  mobileSubtitle: {
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
