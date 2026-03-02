import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

/**
 * PraboardLogo — Coral dairesel P logosu
 *
 * variant="onGradient"  → beyaz daire + coral P (yeşil gradient zemin için)
 * variant="standalone"  → coral daire + beyaz P (beyaz/açık zemin için, varsayılan)
 * variant="dark"        → koyu daire + beyaz P (koyu zemin için)
 */
export default function PraboardLogo({ size = 80, variant = 'standalone' }) {
  const bgColor =
    variant === 'onGradient'
      ? 'rgba(255,255,255,0.95)'
      : variant === 'dark'
        ? '#2D2D2D'
        : '#F2714D';
  const letterColor =
    variant === 'onGradient' ? '#F2714D' : '#FFFFFF';

  return (
    <Svg viewBox="0 0 100 100" width={size} height={size}>
      <Circle cx="50" cy="50" r="50" fill={bgColor} />
      <Path
        d={[
          'M 30 78 V 22 H 55',
          'C 78 22, 78 54, 55 54',
          'H 44 V 78 Z',
          'M 44 33 H 53',
          'C 65 33, 65 43, 53 43',
          'H 44 Z',
        ].join(' ')}
        fill={letterColor}
        fillRule="evenodd"
      />
    </Svg>
  );
}
