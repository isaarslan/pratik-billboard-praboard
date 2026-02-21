import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

export default function CreateActionModal({ visible, onClose, onSharePost, onCreateAd }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.container}>
          {/* Handle bar */}
          <View style={styles.handleBar} />

          <Text style={styles.title}>Ne yapmak istersin?</Text>
          <Text style={styles.subtitle}>
            Paylaşım yap veya billboard panolarında reklam ver
          </Text>

          {/* Option 1: Share Post */}
          <TouchableOpacity
            style={styles.optionCard}
            activeOpacity={0.7}
            onPress={() => {
              onClose();
              onSharePost();
            }}
          >
            <View style={styles.optionIconContainer}>
              <View style={[styles.optionIcon, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="create-outline" size={28} color="#1976D2" />
              </View>
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Paylaşım Yap</Text>
              <Text style={styles.optionDesc}>
                Sosyal feed'de bir paylaşım oluştur. Takipçilerinle içerik paylaş.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={colors.gray[400]} />
          </TouchableOpacity>

          {/* Option 2: Billboard Ad */}
          <TouchableOpacity
            style={[styles.optionCard, styles.optionCardHighlighted]}
            activeOpacity={0.7}
            onPress={() => {
              onClose();
              onCreateAd();
            }}
          >
            <View style={styles.optionIconContainer}>
              <View style={[styles.optionIcon, { backgroundColor: '#FFF0F0' }]}>
                <Ionicons name="easel-outline" size={28} color={colors.primary} />
              </View>
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Reklam Ver</Text>
              <Text style={styles.optionDesc}>
                Billboard panosu seç ve reklamını binlerce kişiye ulaştır.
              </Text>
              <View style={styles.popularBadge}>
                <Ionicons name="star" size={12} color={colors.gold} />
                <Text style={styles.popularBadgeText}>Popüler</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={22} color={colors.gray[400]} />
          </TouchableOpacity>

          {/* Cancel */}
          <TouchableOpacity style={styles.cancelButton} onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.cancelText}>Vazgeç</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 34,
    paddingTop: 12,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.gray[300],
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.gray[900],
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray[500],
    textAlign: 'center',
    marginBottom: 24,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  optionCardHighlighted: {
    backgroundColor: '#FFF8F8',
    borderWidth: 1,
    borderColor: '#FFE0E0',
  },
  optionIconContainer: {
    marginRight: 14,
  },
  optionIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: 4,
  },
  optionDesc: {
    fontSize: 13,
    color: colors.gray[500],
    lineHeight: 18,
  },
  popularBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF8E1',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 6,
  },
  popularBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#F57F17',
  },
  cancelButton: {
    marginTop: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.gray[500],
  },
});
