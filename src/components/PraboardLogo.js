import React from 'react';
import { Image } from 'react-native';

const logoImage = require('../../assets/praboard_p_logo_transparent.png');

/**
 * PraboardLogo — Gerçek logo görseli
 *
 * variant="onGradient"  → beyaz tint (kırmızı/gradient zemin için)
 * variant="standalone"  → normal (beyaz zemin için)
 */
export default function PraboardLogo({ size = 80, variant = 'onGradient' }) {
  const isOnGradient = variant === 'onGradient';

  return (
    <Image
      source={logoImage}
      style={{
        width: size,
        height: size,
        resizeMode: 'contain',
        tintColor: isOnGradient ? '#FFFFFF' : undefined,
      }}
    />
  );
}
