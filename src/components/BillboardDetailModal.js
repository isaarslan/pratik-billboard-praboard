import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function BillboardDetailModal({ visible, panel, onClose, onRent }) {
  if (!panel) return null;

  const isAvailable = panel.status === 'Müsait';

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handleRow}>
            <View style={styles.handle} />
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.panelId}>{panel.name}</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color={colors.gray[600]} />
              </TouchableOpacity>
            </View>

            {/* Image */}
            <Image
              source={{ uri: panel.image || 'https://picsum.photos/seed/billboard1/600/350' }}
              style={styles.image}
              resizeMode="cover"
            />

            {/* Info Grid */}
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Ionicons name="location-outline" size={18} color={colors.primary} />
                <Text style={styles.infoLabel}>Billboard Lokasyonu</Text>
                <Text style={styles.infoValue}>{panel.location || 'Gölbaşı, Ankara'}</Text>
              </View>

              <View style={styles.infoItem}>
                <Ionicons name="person-outline" size={18} color={colors.primary} />
                <Text style={styles.infoLabel}>Billboard Sahibi</Text>
                <Text style={styles.infoValue}>{panel.owner || 'Praboard'}</Text>
              </View>

              <View style={styles.infoItem}>
                <Ionicons name="resize-outline" size={18} color={colors.primary} />
                <Text style={styles.infoLabel}>Billboard Boyutları</Text>
                <Text style={styles.infoValue}>{panel.size || '3m x 6m'}</Text>
              </View>

              <View style={styles.infoItem}>
                <Ionicons name="star-outline" size={18} color={colors.primary} />
                <Text style={styles.infoLabel}>Puanı</Text>
                <Text style={styles.infoValue}>{panel.rating || '—'}</Text>
              </View>

              <View style={styles.infoItem}>
                <Ionicons name="pricetag-outline" size={18} color={colors.primary} />
                <Text style={styles.infoLabel}>Fiyat</Text>
                <Text style={styles.infoValue}>{panel.price || '1.166 TL/gün'}</Text>
              </View>

              <View style={styles.infoItem}>
                <Ionicons name="radio-button-on-outline" size={18} color={isAvailable ? '#2E7D32' : '#E65100'} />
                <Text style={styles.infoLabel}>Durumu</Text>
                <View style={[styles.statusBadge, isAvailable ? styles.statusAvailable : styles.statusFull]}>
                  <Text style={[styles.statusText, isAvailable ? styles.statusTextAvailable : styles.statusTextFull]}>
                    {panel.status || 'Aktif'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Description */}
            <View style={styles.descSection}>
              <Text style={styles.descTitle}>Açıklama</Text>
              <Text style={styles.descText}>
                Bu billboard, {panel.location || 'Gölbaşı, Ankara'} bölgesinde yoğun trafik alan bir noktada konumlanmıştır. Reklam vermek için ideal bir lokasyondur.
              </Text>
            </View>

            {/* CTA Button */}
            {isAvailable && (
              <TouchableOpacity style={styles.ctaButton} onPress={onRent} activeOpacity={0.7}>
                <Text style={styles.ctaText}>Billboarda Reklam Ver</Text>
              </TouchableOpacity>
            )}

            <View style={styles.bottomSpacer} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingHorizontal: 20,
  },
  handleRow: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.gray[300],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  panelId: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.gray[500],
  },
  image: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 14,
    backgroundColor: colors.gray[200],
    marginBottom: 20,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  infoItem: {
    width: '47%',
    backgroundColor: colors.gray[100],
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  infoLabel: {
    fontSize: 11,
    color: colors.gray[500],
    marginTop: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[900],
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 2,
  },
  statusAvailable: {
    backgroundColor: '#E8F5E9',
  },
  statusFull: {
    backgroundColor: '#FFF3E0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextAvailable: {
    color: '#2E7D32',
  },
  statusTextFull: {
    color: '#E65100',
  },
  descSection: {
    marginBottom: 20,
  },
  descTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: 8,
  },
  descText: {
    fontSize: 14,
    color: colors.gray[600],
    lineHeight: 22,
  },
  ctaButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 30,
  },
});
