import React from 'react';
import Svg, { Path, Line } from 'react-native-svg';
import { colors } from '../theme/colors';

/**
 * PraboardLogo — Profesyonel SVG logo
 *
 * Kalın geometrik "P" harfi + yaprak motifi (yeşil reklamcılık kimliği)
 *
 * variant="onGradient"  → beyaz (yeşil gradient zemin için)
 * variant="standalone"  → yeşil (beyaz/açık zemin için)
 *
 * Gereksinim: expo install react-native-svg
 */
export default function PraboardLogo({ size = 80, variant = 'onGradient' }) {
  const color = variant === 'onGradient' ? '#FFFFFF' : colors.primary;
  const leafColor = variant === 'onGradient' ? 'rgba(255,255,255,0.65)' : colors.primaryLight;

  return (
    <Svg viewBox="0 0 100 100" width={size} height={size}>
      {/* P harfi — filled, evenodd ile iç boşluk */}
      <Path
        d={[
          // Dış sınır (P şekli)
          'M 16 92 V 8 H 54',
          'C 82 8, 82 56, 54 56',
          'H 32 V 92 Z',
          // İç boşluk (bowl counter)
          'M 32 22 H 50',
          'C 66 22, 66 42, 50 42',
          'H 32 Z',
        ].join(' ')}
        fill={color}
        fillRule="evenodd"
      />

      {/* Yaprak — P'nin sağ üstünden çıkar */}
      <Path
        d="M 70 10 C 78 -4, 96 0, 92 16 C 88 30, 74 24, 70 10 Z"
        fill={leafColor}
      />

      {/* Yaprak damarı */}
      <Line
        x1="73"
        y1="11"
        x2="89"
        y2="10"
        strokeWidth={1.5}
        stroke={color}
        opacity={0.35}
      />
    </Svg>
  );
}
