import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { TextInput, PrimaryButton } from '../../components';
import BackHeader from '../../components/BackHeader';

const EditProfileScreen = ({ navigation }) => {
  const [name, setName] = useState('Günay Akay');
  const [phone, setPhone] = useState('05xx xxx xx xx');
  const [email, setEmail] = useState('test@gmail.com');

  const handleSave = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title="Profili Düzenle" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Cover Photo Section */}
          <View style={styles.coverPhotoContainer}>
            <View style={styles.coverPhoto} />
            <TouchableOpacity style={styles.coverEditIcon}>
              <Ionicons name="camera" size={20} color={colors.white} />
            </TouchableOpacity>
          </View>

          {/* Profile Avatar Section */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={40} color={colors.textSecondary} />
            </View>
            <TouchableOpacity style={styles.avatarEditIcon}>
              <Ionicons name="camera" size={16} color={colors.white} />
            </TouchableOpacity>
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ad Soyad</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Ad Soyad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Telefon</Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="Telefon"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-Posta</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="E-Posta"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* CTA Button */}
          <View style={styles.buttonContainer}>
            <PrimaryButton title="Keşfetmeye Başla!" onPress={handleSave} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  coverPhotoContainer: {
    position: 'relative',
    width: '100%',
    height: 180,
  },
  coverPhoto: {
    width: '100%',
    height: 180,
    backgroundColor: '#2A2A2A',
  },
  coverEditIcon: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: -40,
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.white,
  },
  avatarEditIcon: {
    position: 'absolute',
    bottom: 0,
    right: '40%',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
});

export default EditProfileScreen;
