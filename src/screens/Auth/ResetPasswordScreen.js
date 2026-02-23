import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import {
  TextInput,
  PrimaryButton,
  SuccessModal,
} from '../../components';
import { colors } from '../../theme/colors';
import { useAuth } from '../../context/AuthContext';

export default function ResetPasswordScreen({ navigation }) {
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleResetPassword = async () => {
    if (!password.trim()) {
      setError('Lütfen yeni şifrenizi girin.');
      return;
    }
    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await updatePassword(password);
      setShowSuccess(true);
    } catch (err) {
      const msg = err?.message || '';
      if (msg.includes('same_password')) {
        setError('Yeni şifre eski şifrenizle aynı olamaz.');
      } else {
        setError('Şifre güncellenirken bir hata oluştu. Tekrar deneyin.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setShowSuccess(false);
    navigation.reset('HomeTab');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#FF4B4B', '#FF6B6B']} style={styles.header}>
          <Ionicons name="lock-closed" size={48} color={colors.white} />
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.title}>Yeni Şifre Belirle</Text>
            <Text style={styles.description}>
              Hesabın için yeni bir şifre belirle. En az 6 karakter olmalıdır.
            </Text>

            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <TextInput
              label="Yeni Şifre"
              value={password}
              onChangeText={(t) => { setPassword(t); setError(''); }}
              secureTextEntry
            />

            <TextInput
              label="Yeni Şifre (Tekrar)"
              value={confirmPassword}
              onChangeText={(t) => { setConfirmPassword(t); setError(''); }}
              secureTextEntry
            />

            <PrimaryButton
              title={loading ? '' : 'Şifreyi Güncelle'}
              onPress={handleResetPassword}
              disabled={loading}
              style={styles.button}
            />
            {loading && (
              <ActivityIndicator
                color={colors.primary}
                style={styles.loadingIndicator}
              />
            )}
          </View>
        </View>
      </ScrollView>

      <SuccessModal
        visible={showSuccess}
        message="Şifren başarıyla güncellendi! Artık yeni şifrenle giriş yapabilirsin."
        buttonTitle="Devam Et"
        onPress={handleSuccess}
      />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
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
  button: {
    marginTop: 8,
  },
  loadingIndicator: {
    marginTop: 12,
  },
});
