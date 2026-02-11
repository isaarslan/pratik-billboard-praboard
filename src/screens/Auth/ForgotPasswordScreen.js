import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import {
  TextInput,
  PrimaryButton,
  VerificationCodeInput,
  SuccessModal,
} from '../../components';
import { colors } from '../../theme/colors';

export default function ForgotPasswordScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSendCode = () => {
    setStep(2);
  };

  const handleVerifyCode = () => {
    setStep(3);
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      setPasswordError('Şifreler eşleşmiyor.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Şifre en az 6 karakter olmalıdır.');
      return;
    }
    setPasswordError('');
    setShowSuccess(true);
  };

  const handleSuccess = () => {
    setShowSuccess(false);
    navigation.navigate('Login');
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Text style={styles.title}>Şifremi Unuttum</Text>
            <Text style={styles.description}>
              Hesabını doğrulamak için e-posta adresini veya kullanıcı adını yazabilirsin.
            </Text>

            <TextInput
              label="Kullanıcı Adı / E-Posta"
              value={emailOrUsername}
              onChangeText={setEmailOrUsername}
            />

            <PrimaryButton
              title="Doğrulama Kodu Gönder"
              onPress={handleSendCode}
              style={styles.button}
            />
          </>
        );

      case 2:
        return (
          <>
            <Text style={styles.title}>Doğrulama Kodu</Text>
            <Text style={styles.description}>
              Lütfen e-posta adresine gönderdiğimiz 6 haneli doğrulama kodunu girin.
            </Text>

            <VerificationCodeInput code={verificationCode} setCode={setVerificationCode} />

            <PrimaryButton
              title="Kodu Onayla"
              onPress={handleVerifyCode}
              style={styles.button}
            />

            <TouchableOpacity style={styles.resendContainer}>
              <Text style={styles.resendText}>Kodu almadın mı?</Text>
            </TouchableOpacity>
          </>
        );

      case 3:
        return (
          <>
            <Text style={styles.title}>Şifreni Belirle</Text>
            <Text style={styles.description}>
              Şimdi yeni bir şifre oluşturun ve hesabınıza güvenle erişin.
            </Text>

            <TextInput
              label="Yeni Şifre"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              error={passwordError && !confirmPassword ? passwordError : ''}
            />

            <TextInput
              label="Yeni Şifre Tekrar"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              error={passwordError && confirmPassword ? passwordError : ''}
            />

            <PrimaryButton
              title="Şifremi Değiştir"
              onPress={handleChangePassword}
              style={styles.button}
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#FF4B4B', '#FF6B6B']} style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              if (step > 1) {
                setStep(step - 1);
              } else {
                navigation.goBack();
              }
            }}
          >
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.card}>{renderStepContent()}</View>
        </View>
      </ScrollView>

      <SuccessModal
        visible={showSuccess}
        message="Yeni şifren oluşturuldu, hesabına giriş yapabilirsin."
        buttonTitle="Buradan Giriş Yapabilirsin"
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
    height: 120,
    justifyContent: 'center',
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 24,
    marginTop: -20,
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
  button: {
    marginTop: 8,
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  resendText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
});
