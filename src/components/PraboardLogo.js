import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

/**
 * PraboardLogo — Billboard (panel + direk) şekli
 *
 * variant="onGradient"  → beyaz panel + beyaz direk  (kırmızı/gradient zemin için)
 * variant="standalone"  → kırmızı panel + kırmızı direk  (beyaz zemin için)
 */
export default function PraboardLogo({ size = 80, variant = 'onGradient' }) {
  const isOnGradient = variant === 'onGradient';
  const logoColor = isOnGradient ? colors.white : colors.primary;

  const panelW = size * 0.9;
  const panelH = size * 0.55;
  const poleW = size * 0.08;
  const poleH = size * 0.32;
  const fontSize = panelH * 0.62;
  const borderRadius = size * 0.06;

  return (
    <View style={[styles.wrapper, { width: size, height: size }]}>
      {/* Billboard paneli */}
      <View
        style={[
          styles.panel,
          {
            width: panelW,
            height: panelH,
            borderRadius,
            backgroundColor: logoColor,
          },
        ]}
      >
        <Text
          style={[
            styles.letter,
            {
              fontSize,
              color: isOnGradient ? colors.primary : colors.white,
            },
          ]}
        >
          P
        </Text>
      </View>

      {/* Direk */}
      <View
        style={[
          styles.pole,
          {
            width: poleW,
            height: poleH,
            borderRadius: poleW / 2,
            backgroundColor: logoColor,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
  },
  panel: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  letter: {
    fontWeight: '800',
  },
  pole: {},
});
