import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { TextInput, PrimaryButton } from '../../components';
import { colors } from '../../theme/colors';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Lütfen e-posta ve şifre alanlarını doldurun.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await signIn({ email: email.trim(), password });
      // Auth state değişince navigation otomatik yönlendirecek
    } catch (err) {
      const msg = err?.message || '';
      if (msg.includes('Invalid login credentials')) {
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#FF4B4B', '#FF6B6B']} style={styles.header}>
          <Text style={styles.headerTitle}>Giriş Yap</Text>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Hoş geldin!</Text>
            <Text style={styles.subtitle}>
              Giriş yapmak için lütfen bilgilerini gir.
            </Text>

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
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.white,
  },
  content: {
    padding: 24,
    marginTop: -40,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 24,
    lineHeight: 22,
  },
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
    marginBottom: 12,
  },
  loadingIndicator: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 58,
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
