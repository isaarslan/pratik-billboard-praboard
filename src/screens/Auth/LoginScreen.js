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
import { TextInput, PrimaryButton } from '../../components';
import { colors } from '../../theme/colors';

export default function LoginScreen({ navigation }) {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    navigation.replace('Main');
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

            <View style={styles.form}>
              <TextInput
                label="E-Posta / Kullanıcı Adı"
                value={emailOrUsername}
                onChangeText={setEmailOrUsername}
              />

              <TextInput
                label="Şifre"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}
                style={styles.forgotPasswordContainer}
              >
                <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
              </TouchableOpacity>

              <PrimaryButton
                title="Giriş Yap"
                onPress={handleLogin}
                style={styles.submitButton}
              />

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
});
