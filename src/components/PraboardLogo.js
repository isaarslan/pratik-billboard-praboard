import React from 'react';
import Svg, { Line, Path } from 'react-native-svg';
import { colors } from '../theme/colors';

/**
 * PraboardLogo — SVG tabanlı P harfi (View/border yaklaşımından çok daha temiz eğri)
 *
 * variant="onGradient"  → beyaz P  (kırmızı/gradient zemin için)
 * variant="standalone"  → kırmızı P  (beyaz zemin için)
 *
 * Gereksinim: expo install react-native-svg
 */
export default function PraboardLogo({ size = 80, variant = 'onGradient' }) {
  const color = variant === 'onGradient' ? colors.white : colors.primary;

  // Tüm koordinatlar 100×100 viewBox'a göre — size parametresiyle ölçeklenir
  const sw     = 20;                       // stroke kalınlığı
  const overh  = 11;                       // üst çubuğun sola taşması
  const stemCX = overh + sw / 2;          // stem merkez X = 21
  const bowlH  = 63;                       // D-yayının yüksekliği
  const bowlRy = (bowlH - sw) / 2;        // dikey yarı-eksen = 21.5
  const bowlRx = 69;                       // yatay yarı-eksen (sağ uca kadar uzanır)

  // Eliptik ark: stem merkezinden aşağı dönerek tekrar stem merkezine döner
  // sweep=1 (saat yönü) → sağa uzanır = D şekli
  const bowlPath = `M ${stemCX} ${sw / 2} A ${bowlRx} ${bowlRy} 0 0 1 ${stemCX} ${bowlH - sw / 2}`;

  return (
    <Svg viewBox="0 0 100 100" width={size} height={size}>

      {/* Üst yatay çubuk — solda stem'den taşar, tam genişlik */}
      <Line
        x1="0" y1={sw / 2}
        x2="100" y2={sw / 2}
        strokeWidth={sw}
        strokeLinecap="round"
        stroke={color}
      />

      {/* Dikey gövde — tam yükseklik */}
      <Line
        x1={stemCX} y1="0"
        x2={stemCX} y2="100"
        strokeWidth={sw}
        strokeLinecap="round"
        stroke={color}
      />

      {/* D-şekli eliptik yay */}
      <Path
        d={bowlPath}
        strokeWidth={sw}
        fill="none"
        strokeLinecap="round"
        stroke={color}
      />

    </Svg>
  );
}
