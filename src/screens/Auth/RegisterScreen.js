import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  TextInput,
  PrimaryButton,
  BottomSheetModal,
  VerificationCodeInput,
  SuccessModal,
} from '../../components';
import { colors } from '../../theme/colors';

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);

  const handleRegister = () => {
    setShowVerification(true);
  };

  const handleVerify = () => {
    setShowVerification(false);
    setShowSuccess(true);
  };

  const handleSuccess = () => {
    setShowSuccess(false);
    navigation.navigate('UsernameSelect');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <LinearGradient colors={['#FF4B4B', '#FF6B6B']} style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logo}>P</Text>
            </View>
          </LinearGradient>

          <View style={styles.content}>
            <Text style={styles.title}>Yeni hesap oluştur!</Text>
            <Text style={styles.subtitle}>
              Hemen kaydol ve Praboard'un fırsatlarını keşfet!
            </Text>

            <View style={styles.form}>
              <TextInput
                label="Ad Soyad"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
              />

              <TextInput
                label="Telefon"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />

              <TextInput
                label="E-Posta"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />

              <TextInput
                label="Şifre"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <PrimaryButton
                title="Keşfetmeye Başla!"
                onPress={handleRegister}
                style={styles.submitButton}
              />

              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.linkText}>
                  Hesabın var mı? <Text style={styles.linkBold}>Giriş yap!</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <BottomSheetModal
        visible={showVerification}
        onClose={() => setShowVerification(false)}
        title="Doğrulama Kodu"
      >
        <Text style={styles.modalDescription}>
          Lütfen e-posta adresine gönderdiğimiz 6 haneli doğrulama kodunu girin.
        </Text>

        <VerificationCodeInput code={verificationCode} setCode={setVerificationCode} />

        <PrimaryButton title="Doğrula" onPress={handleVerify} style={styles.modalButton} />
      </BottomSheetModal>

      <SuccessModal
        visible={showSuccess}
        message="E-posta adresin başarıyla doğrulandı!"
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
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
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
  form: {
    width: '100%',
  },
  submitButton: {
    marginTop: 8,
    marginBottom: 16,
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
  modalDescription: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 22,
  },
  modalButton: {
    marginTop: 16,
  },
});
