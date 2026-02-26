import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

/**
 * PraboardLogo — Elmas şekli + "P" harfi
 *
 * variant="onGradient"  → beyaz elmas, kırmızı P  (kırmızı header içinde)
 * variant="standalone"  → kırmızı elmas, beyaz P  (beyaz zemin üzerinde)
 */
export default function PraboardLogo({ size = 80, variant = 'onGradient' }) {
  const isOnGradient = variant === 'onGradient';
  const diamondBg = isOnGradient ? colors.white : colors.primary;
  const letterColor = isOnGradient ? colors.primary : colors.white;
  const fontSize = size * 0.38;

  return (
    <View style={[styles.wrapper, { width: size, height: size }]}>
      <View
        style={[
          styles.diamond,
          {
            width: size * 0.78,
            height: size * 0.78,
            borderRadius: size * 0.08,
            backgroundColor: diamondBg,
          },
        ]}
      >
        <View style={styles.innerContent}>
          <Text style={[styles.letter, { fontSize, color: letterColor }]}>P</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  diamond: {
    transform: [{ rotate: '45deg' }],
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContent: {
    transform: [{ rotate: '-45deg' }],
    justifyContent: 'center',
    alignItems: 'center',
  },
  letter: {
    fontWeight: 'bold',
  },
});
