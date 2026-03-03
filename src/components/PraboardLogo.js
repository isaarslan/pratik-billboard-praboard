import React from 'react';
import { Image } from 'react-native';

const logoSource = require('../../assets/logo.png');

/**
 * PraboardLogo — Coral bold "P" harfi (PNG, transparent arka plan)
 *
 * variant="standalone"  → coral P (beyaz/açık zemin için, varsayılan)
 * variant="onGradient"  → beyaz P (yeşil gradient zemin için)
 * variant="dark"        → beyaz P (koyu zemin için)
 */
export default function PraboardLogo({ size = 80, variant = 'standalone' }) {
  const tint = variant === 'standalone' ? undefined : '#FFFFFF';

  return (
    <Image
      source={logoSource}
      style={{
        width: size * 0.8,
        height: size,
        ...(tint ? { tintColor: tint } : {}),
      }}
      resizeMode="contain"
    />
  );
}
