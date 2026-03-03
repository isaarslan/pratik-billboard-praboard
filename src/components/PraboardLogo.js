import React from 'react';
import Svg, { Path } from 'react-native-svg';

/**
 * PraboardLogo — Coral bold "P" harfi (transparent arka plan)
 *
 * variant="standalone"  → coral P (beyaz/açık zemin için, varsayılan)
 * variant="onGradient"  → beyaz P (yeşil gradient zemin için)
 * variant="dark"        → beyaz P (koyu zemin için)
 */
export default function PraboardLogo({ size = 80, variant = 'standalone' }) {
  const CORAL = '#F2665A';
  const letterColor =
    variant === 'standalone' ? CORAL : '#FFFFFF';

  return (
    <Svg viewBox="0 0 80 100" width={size * 0.8} height={size}>
      <Path
        d={[
          // Dış P şekli - kalın gövde, yuvarlak bowl
          'M 4 96 V 4 H 44',
          'C 76 4, 76 56, 44 56',
          'H 26 V 96 Z',
          // İç boşluk (bowl counter)
          'M 26 20 H 40',
          'C 58 20, 58 40, 40 40',
          'H 26 Z',
        ].join(' ')}
        fill={letterColor}
        fillRule="evenodd"
      />
    </Svg>
  );
}
