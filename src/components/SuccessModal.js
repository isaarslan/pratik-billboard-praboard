import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import PrimaryButton from './PrimaryButton';

export default function SuccessModal({ visible, title, message, buttonTitle, onPress, type = 'success' }) {
  const isSuccess = type === 'success';

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {title && <Text style={styles.title}>{title}</Text>}
          <View style={[styles.iconCircle, { backgroundColor: isSuccess ? colors.success : colors.error }]}>
            <Ionicons
              name={isSuccess ? 'checkmark' : 'close'}
              size={40}
              color={colors.white}
            />
          </View>
          <Text style={styles.message}>{message}</Text>
          <PrimaryButton title={buttonTitle} onPress={onPress} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 20,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  message: {
    fontSize: 15,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
});
