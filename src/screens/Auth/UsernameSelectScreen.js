import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, PrimaryButton } from '../../components';
import { colors } from '../../theme/colors';

export default function UsernameSelectScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (username.length > 0) {
      setIsValidating(true);
      setError('');
      setSuccess('');

      const timer = setTimeout(() => {
        if (username.toLowerCase().includes('test')) {
          setError('Maalesef, bu kullanıcı adı kullanımda. Farklı bir kullanıcı adı seçin.');
          setSuccess('');
        } else {
          setSuccess('Harika! Kullanıcı adın kaydedildi, bir sonraki adıma geçebilirsin.');
          setError('');
        }
        setIsValidating(false);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setError('');
      setSuccess('');
    }
  }, [username]);

  const handleComplete = () => {
    if (success) {
      navigation.replace('Main');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>👤</Text>
        </View>

        <Text style={styles.title}>Hesabını Tamamla!</Text>
        <Text style={styles.subtitle}>
          Bir kullanıcı adı seçerek Praboard'un bir parçası ol! Seni tanımaları için özgün
          bir isim belirle.
        </Text>

        <View style={styles.form}>
          <TextInput
            label="Kullanıcı Adı"
            value={username}
            onChangeText={setUsername}
            error={error}
            success={success}
            autoCapitalize="none"
          />

          <PrimaryButton
            title="Hesabını Oluştur"
            onPress={handleComplete}
            disabled={!success || isValidating}
            style={styles.submitButton}
          />

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>
              Hesabın var mı? <Text style={styles.linkBold}>Giriş yap!</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
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
});
