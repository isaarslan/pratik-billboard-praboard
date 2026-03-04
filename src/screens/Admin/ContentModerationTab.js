import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { useOrders } from '../../context/OrderContext';

const REJECT_TEMPLATES = [
  'Görsel kalitesi yetersiz',
  'İçerik politikamıza uygun değil',
  'Telif hakkı ihlali',
  'Yanıltıcı veya uygunsuz içerik',
  'Teknik gereksinimler karşılanmadı',
];

export default function ContentModerationTab() {
  const { orders, updateOrderStatus, rejectOrder, STATUS_LABELS, STATUS_COLORS } = useOrders();
  const [selectedIds, setSelectedIds] = useState([]);
  const [showRejectReason, setShowRejectReason] = useState(null); // orderId for reject

  const pendingOrders = useMemo(
    () => orders.filter((o) => o.status === 'onay_bekliyor'),
    [orders]
  );

  const toggleSelect = (orderId) => {
    setSelectedIds((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === pendingOrders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(pendingOrders.map((o) => o.id));
    }
  };

  const handleApprove = async (orderId) => {
    await updateOrderStatus(orderId, 'hazirlaniyor');
    setSelectedIds((prev) => prev.filter((id) => id !== orderId));
  };

  const handleReject = async (orderId, reason) => {
    await rejectOrder(orderId, reason);
    setSelectedIds((prev) => prev.filter((id) => id !== orderId));
    setShowRejectReason(null);
  };

  const handleBulkApprove = async () => {
    if (selectedIds.length === 0) return;

    const msg = `${selectedIds.length} içeriği onaylamak istediğinize emin misiniz?`;
    const doApprove = async () => {
      for (const id of selectedIds) {
        await updateOrderStatus(id, 'hazirlaniyor');
      }
      setSelectedIds([]);
    };

    if (Platform.OS === 'web') {
      if (window.confirm(msg)) doApprove();
    } else {
      Alert.alert('Toplu Onay', msg, [
        { text: 'Vazgeç', style: 'cancel' },
        { text: 'Onayla', onPress: doApprove },
      ]);
    }
  };

  const handleBulkReject = async (reason) => {
    if (selectedIds.length === 0) return;

    for (const id of selectedIds) {
      await rejectOrder(id, reason);
    }
    setSelectedIds([]);
  };

  return (
    <View style={styles.container}>
      {/* Üst Bar */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <View style={styles.pendingBadge}>
            <Text style={styles.pendingBadgeText}>{pendingOrders.length}</Text>
          </View>
          <Text style={styles.topBarTitle}>Onay Bekleyen</Text>
        </View>

        {pendingOrders.length > 0 && (
          <TouchableOpacity onPress={selectAll} activeOpacity={0.7}>
            <Text style={styles.selectAllText}>
              {selectedIds.length === pendingOrders.length ? 'Seçimi Kaldır' : 'Tümünü Seç'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Toplu İşlem Barı */}
      {selectedIds.length > 0 && (
        <View style={styles.bulkBar}>
          <Text style={styles.bulkText}>{selectedIds.length} seçili</Text>
          <View style={styles.bulkActions}>
            <TouchableOpacity style={styles.bulkApproveBtn} onPress={handleBulkApprove} activeOpacity={0.7}>
              <Ionicons name="checkmark-circle" size={16} color="#fff" />
              <Text style={styles.bulkBtnText}>Toplu Onayla</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bulkRejectBtn}
              onPress={() => handleBulkReject(REJECT_TEMPLATES[0])}
              activeOpacity={0.7}
            >
              <Ionicons name="close-circle" size={16} color="#fff" />
              <Text style={styles.bulkBtnText}>Toplu Reddet</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* İçerik Listesi */}
      <ScrollView style={styles.listArea} showsVerticalScrollIndicator={false}>
        {pendingOrders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="checkmark-done-outline" size={36} color="#2E7D32" />
            </View>
            <Text style={styles.emptyTitle}>Harika!</Text>
            <Text style={styles.emptyText}>Tüm içerikler moderasyon sürecinden geçti</Text>
          </View>
        ) : (
          pendingOrders.map((order) => {
            const isSelected = selectedIds.includes(order.id);
            return (
              <View key={order.id} style={[styles.contentCard, isSelected && styles.contentCardSelected]}>
                {/* Seçim Checkbox */}
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => toggleSelect(order.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.checkboxInner, isSelected && styles.checkboxChecked]}>
                    {isSelected && <Ionicons name="checkmark" size={14} color="#fff" />}
                  </View>
                </TouchableOpacity>

                {/* Büyük Önizleme */}
                <View style={styles.previewSection}>
                  <Image
                    source={{ uri: order.adImage }}
                    style={styles.previewImage}
                    resizeMode="cover"
                  />
                  <View style={styles.previewOverlay}>
                    <Text style={styles.previewTitle} numberOfLines={2}>{order.adTitle}</Text>
                  </View>
                </View>

                {/* Detaylar */}
                <View style={styles.contentDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
                    <Text style={styles.detailText}>{order.panel?.name || '-'}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="resize-outline" size={14} color={colors.textSecondary} />
                    <Text style={styles.detailText}>{order.panel?.size || '-'}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                    <Text style={styles.detailText}>{order.adDuration || '-'}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
                    <Text style={styles.detailText}>{order.dates?.length || 0} gün</Text>
                  </View>
                </View>

                {/* İşlem Butonları */}
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.approveBtn}
                    onPress={() => handleApprove(order.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="checkmark-circle" size={18} color="#fff" />
                    <Text style={styles.approveBtnText}>Onayla</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.rejectBtn}
                    onPress={() => setShowRejectReason(showRejectReason === order.id ? null : order.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="close-circle" size={18} color="#fff" />
                    <Text style={styles.rejectBtnText}>Reddet</Text>
                  </TouchableOpacity>
                </View>

                {/* Ret Sebepleri (Şablonlar) */}
                {showRejectReason === order.id && (
                  <View style={styles.rejectTemplates}>
                    <Text style={styles.rejectTemplatesTitle}>Ret Sebebi Seçin:</Text>
                    {REJECT_TEMPLATES.map((reason, idx) => (
                      <TouchableOpacity
                        key={idx}
                        style={styles.rejectTemplate}
                        onPress={() => handleReject(order.id, reason)}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="alert-circle-outline" size={14} color="#C62828" />
                        <Text style={styles.rejectTemplateText}>{reason}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            );
          })
        )}
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Top Bar
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pendingBadge: {
    backgroundColor: '#FFF3E0',
    borderRadius: 10,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  pendingBadgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#E65100',
  },
  topBarTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  selectAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  // Bulk Bar
  bulkBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF0F0',
    marginHorizontal: 16,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 8,
  },
  bulkText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  bulkActions: {
    flexDirection: 'row',
    gap: 8,
  },
  bulkApproveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  bulkRejectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C62828',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  bulkBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  // List
  listArea: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  // Content Card
  contentCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  contentCardSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  checkbox: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 10,
  },
  checkboxInner: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.white,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  // Preview
  previewSection: {
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: colors.gray[200],
  },
  previewOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  // Details
  contentDetails: {
    padding: 14,
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  // Actions
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  approveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 6,
  },
  approveBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  rejectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C62828',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 6,
  },
  rejectBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  // Reject Templates
  rejectTemplates: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    gap: 6,
  },
  rejectTemplatesTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  rejectTemplate: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  rejectTemplateText: {
    fontSize: 13,
    color: '#C62828',
    fontWeight: '500',
  },
});
