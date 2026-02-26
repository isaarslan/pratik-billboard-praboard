import React from 'react';
import { View } from 'react-native';
import { colors } from '../theme/colors';

/**
 * PraboardLogo — Kalın çizgili P harfi
 *  · Üstte yatay çubuk (solda stem'den taşar)
 *  · Sol dikey gövde (tam yükseklik)
 *  · Sağda D-şekli yay
 *
 * variant="onGradient"  → beyaz P  (kırmızı/gradient zemin için)
 * variant="standalone"  → kırmızı P  (beyaz zemin için)
 */
export default function PraboardLogo({ size = 80, variant = 'onGradient' }) {
  const isOnGradient = variant === 'onGradient';
  const color = isOnGradient ? colors.white : colors.primary;

  const sw    = Math.round(size * 0.185);       // stroke kalınlığı
  const overh = Math.round(sw * 0.6);           // üst çubuğun sola taşması
  const bowlH = Math.round(size * 0.63);        // D-yayın yüksekliği
  const bowlX = overh + Math.round(sw * 0.5);  // D-yayın başladığı x

  return (
    <View style={{ width: size, height: size, backgroundColor: 'transparent' }}>

      {/* Üst yatay çubuk — solda stem'den taşar, tam genişlik */}
      <View style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: size,
        height: sw,
        borderRadius: sw / 2,
        backgroundColor: color,
      }} />

      {/* Dikey gövde — tam yükseklik */}
      <View style={{
        position: 'absolute',
        left: overh,
        top: 0,
        width: sw,
        height: size,
        borderRadius: sw / 2,
        backgroundColor: color,
      }} />

      {/* D-şekli yay — üst/sağ/alt border, sol açık */}
      <View style={{
        position: 'absolute',
        left: bowlX,
        top: 0,
        width: size - bowlX,
        height: bowlH,
        borderTopWidth: sw,
        borderRightWidth: sw,
        borderBottomWidth: sw,
        borderLeftWidth: 0,
        borderColor: color,
        borderTopRightRadius: bowlH / 2,
        borderBottomRightRadius: bowlH / 2,
        backgroundColor: 'transparent',
      }} />

    </View>
  );
}
