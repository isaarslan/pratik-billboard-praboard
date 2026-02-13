import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import BackHeader from '../../components/BackHeader';
import { useOrders } from '../../context/OrderContext';

const FILTER_OPTIONS = [
  { key: 'all', label: 'Tümü' },
  { key: 'onay_bekliyor', label: 'Bekleyen' },
  { key: 'hazirlaniyor', label: 'Hazırlanan' },
  { key: 'live', label: 'Yayında' },
  { key: 'completed', label: 'Tamamlanan' },
  { key: 'rejected', label: 'Reddedilen' },
];

export default function AdminScreen({ navigation }) {
  const { orders, updateOrderStatus, rejectOrder, STATUS_LABELS, STATUS_COLORS } = useOrders();
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectTargetId, setRejectTargetId] = useState(null);

  const filteredOrders = activeFilter === 'all'
    ? orders
    : orders.filter((o) => o.status === activeFilter);

  const pendingCount = orders.filter((o) => o.status === 'onay_bekliyor').length;
  const liveCount = orders.filter((o) => o.status === 'live').length;
  const totalCount = orders.length;

  const getNextStatus = (currentStatus) => {
    const flow = ['onay_bekliyor', 'hazirlaniyor', 'live', 'completed'];
    const idx = flow.indexOf(currentStatus);
    if (idx >= 0 && idx < flow.length - 1) return flow[idx + 1];
    return null;
  };

  const handleApproveNext = (order) => {
    const next = getNextStatus(order.status);
    if (next) updateOrderStatus(order.id, next);
  };

  const handleOpenReject = (orderId) => {
    setRejectTargetId(orderId);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const handleConfirmReject = () => {
    if (rejectTargetId) {
      rejectOrder(rejectTargetId, rejectReason);
    }
    setShowRejectModal(false);
    setRejectTargetId(null);
    setRejectReason('');
    setSelectedOrder(null);
  };

  const getActionLabel = (status) => {
    switch (status) {
      case 'onay_bekliyor': return 'Onayla';
      case 'hazirlaniyor': return 'Yayına Al';
      case 'live': return 'Tamamla';
      default: return null;
    }
  };

  const renderOrderDetail = () => {
    if (!selectedOrder) return null;
    const order = orders.find((o) => o.id === selectedOrder.id) || selectedOrder;
    const sc = STATUS_COLORS[order.status] || STATUS_COLORS.onay_bekliyor;
    const actionLabel = getActionLabel(order.status);

    return (
      <Modal visible={true} animationType="slide" transparent={false}>
        <SafeAreaView style={styles.container} edges={['top']}>
          <BackHeader title="Sipariş Yönetimi" onBack={() => setSelectedOrder(null)} />
          <ScrollView contentContainerStyle={styles.detailScroll} showsVerticalScrollIndicator={false}>
            {/* Siparis Bilgi Header */}
            <View style={styles.detailHeader}>
              <View>
                <Text style={styles.detailOrderId}>{order.id}</Text>
                <Text style={styles.detailDate}>{order.createdAt}</Text>
              </View>
              <View style={[styles.statusBadgeLarge, { backgroundColor: sc.bg }]}>
                <Text style={[styles.statusBadgeLargeText, { color: sc.text }]}>
                  {STATUS_LABELS[order.status]}
                </Text>
              </View>
            </View>

            {/* Reklam Gorseli */}
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Reklam Gorseli</Text>
              <Image
                source={{ uri: order.adImage }}
                style={styles.detailAdImage}
                resizeMode="cover"
              />
              <Text style={styles.detailAdTitle}>{order.adTitle}</Text>
            </View>

            {/* Pano Bilgileri */}
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Pano Bilgileri</Text>
              <View style={styles.panelInfoCard}>
                <Image source={{ uri: order.panel.image }} style={styles.panelThumb} resizeMode="cover" />
                <View style={styles.panelDetails}>
                  <Text style={styles.panelName}>{order.panel.name}</Text>
                  <View style={styles.panelRow}>
                    <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
                    <Text style={styles.panelText}>{order.panel.location}</Text>
                  </View>
                  <View style={styles.panelRow}>
                    <Ionicons name="resize-outline" size={14} color={colors.textSecondary} />
                    <Text style={styles.panelText}>{order.panel.size}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Siparis Ozeti */}
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Siparis Ozeti</Text>
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Yayin Gunleri</Text>
                  <Text style={styles.summaryValue}>{order.dates?.length || 0} gun</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Reklam Suresi</Text>
                  <Text style={styles.summaryValue}>{order.adDuration}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Birim Fiyat</Text>
                  <Text style={styles.summaryValue}>{order.panel.price}</Text>
                </View>
                <View style={[styles.summaryRow, { borderBottomWidth: 0 }]}>
                  <Text style={styles.summaryLabelBold}>Toplam Tutar</Text>
                  <Text style={styles.summaryValueBold}>{order.totalPrice}</Text>
                </View>
              </View>
            </View>

            {/* Yayin Tarihleri */}
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Yayin Tarihleri</Text>
              {order.dates?.map((d, i) => (
                <View key={i} style={styles.dateChip}>
                  <View style={styles.dateChipIdx}>
                    <Text style={styles.dateChipIdxText}>{i + 1}</Text>
                  </View>
                  <Text style={styles.dateChipText}>{d}</Text>
                </View>
              ))}
            </View>

            {/* Reddedilme Sebebi */}
            {order.status === 'rejected' && order.rejectReason && (
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Ret Sebebi</Text>
                <View style={styles.rejectReasonBox}>
                  <Ionicons name="close-circle" size={20} color="#C62828" />
                  <Text style={styles.rejectReasonText}>{order.rejectReason}</Text>
                </View>
              </View>
            )}

            {/* Admin Aksiyonlar */}
            {order.status !== 'completed' && order.status !== 'rejected' && (
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Admin Islemleri</Text>
                <View style={styles.actionButtons}>
                  {actionLabel && (
                    <TouchableOpacity
                      style={styles.approveButton}
                      onPress={() => {
                        handleApproveNext(order);
                        setSelectedOrder({ ...order, status: getNextStatus(order.status) });
                      }}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="checkmark-circle" size={20} color="#fff" />
                      <Text style={styles.approveButtonText}>{actionLabel}</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.rejectButton}
                    onPress={() => handleOpenReject(order.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="close-circle" size={20} color="#fff" />
                    <Text style={styles.rejectButtonText}>Reddet</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <View style={{ height: 40 }} />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <BackHeader title="Admin Paneli" onBack={() => navigation.goBack()} />

      {/* Ozet Kartlari */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
          <Text style={[styles.statNumber, { color: '#E65100' }]}>{pendingCount}</Text>
          <Text style={styles.statLabel}>Bekleyen</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
          <Text style={[styles.statNumber, { color: '#2E7D32' }]}>{liveCount}</Text>
          <Text style={styles.statLabel}>Yayinda</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
          <Text style={[styles.statNumber, { color: '#1565C0' }]}>{totalCount}</Text>
          <Text style={styles.statLabel}>Toplam</Text>
        </View>
      </View>

      {/* Filtre Bari */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar} contentContainerStyle={styles.filterBarContent}>
        {FILTER_OPTIONS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterChip, activeFilter === f.key && styles.filterChipActive]}
            onPress={() => setActiveFilter(f.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterChipText, activeFilter === f.key && styles.filterChipTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Siparis Listesi */}
      <ScrollView style={styles.orderList} showsVerticalScrollIndicator={false}>
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="file-tray-outline" size={48} color={colors.gray[300]} />
            <Text style={styles.emptyText}>Bu kategoride siparis yok</Text>
          </View>
        ) : (
          filteredOrders.map((order) => {
            const sc = STATUS_COLORS[order.status] || STATUS_COLORS.onay_bekliyor;
            const actionLabel = getActionLabel(order.status);
            return (
              <TouchableOpacity
                key={order.id}
                style={styles.orderCard}
                onPress={() => setSelectedOrder(order)}
                activeOpacity={0.7}
              >
                <Image source={{ uri: order.adImage }} style={styles.orderThumb} resizeMode="cover" />
                <View style={styles.orderInfo}>
                  <Text style={styles.orderTitle} numberOfLines={1}>{order.adTitle}</Text>
                  <View style={styles.orderMeta}>
                    <Ionicons name="location-outline" size={13} color={colors.textSecondary} />
                    <Text style={styles.orderMetaText}>{order.panel.name}</Text>
                  </View>
                  <View style={styles.orderFooter}>
                    <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
                      <Text style={[styles.statusText, { color: sc.text }]}>
                        {STATUS_LABELS[order.status]}
                      </Text>
                    </View>
                    <Text style={styles.orderPrice}>{order.totalPrice}</Text>
                  </View>
                </View>

                {/* Hizli Aksiyon Butonlari */}
                <View style={styles.quickActions}>
                  {actionLabel && (
                    <TouchableOpacity
                      style={styles.quickApprove}
                      onPress={(e) => {
                        e.stopPropagation?.();
                        handleApproveNext(order);
                      }}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="checkmark" size={18} color="#fff" />
                    </TouchableOpacity>
                  )}
                  {order.status !== 'completed' && order.status !== 'rejected' && (
                    <TouchableOpacity
                      style={styles.quickReject}
                      onPress={(e) => {
                        e.stopPropagation?.();
                        handleOpenReject(order.id);
                      }}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="close" size={18} color="#fff" />
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        )}
        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Siparis Detay Modal */}
      {selectedOrder && renderOrderDetail()}

      {/* Reddetme Modal */}
      <Modal visible={showRejectModal} transparent animationType="fade">
        <View style={styles.rejectModalOverlay}>
          <View style={styles.rejectModalContent}>
            <View style={styles.rejectModalHeader}>
              <Ionicons name="close-circle" size={40} color="#C62828" />
              <Text style={styles.rejectModalTitle}>Siparisi Reddet</Text>
              <Text style={styles.rejectModalSubtitle}>
                Ret sebebini belirtin (opsiyonel)
              </Text>
            </View>

            <TextInput
              style={styles.rejectInput}
              placeholder="Ret sebebi girin..."
              placeholderTextColor={colors.gray[400]}
              value={rejectReason}
              onChangeText={setRejectReason}
              multiline
              numberOfLines={3}
            />

            <View style={styles.rejectModalButtons}>
              <TouchableOpacity
                style={styles.rejectModalCancel}
                onPress={() => {
                  setShowRejectModal(false);
                  setRejectTargetId(null);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.rejectModalCancelText}>Vazgec</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.rejectModalConfirm}
                onPress={handleConfirmReject}
                activeOpacity={0.7}
              >
                <Ionicons name="close-circle" size={18} color="#fff" />
                <Text style={styles.rejectModalConfirmText}>Reddet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // Stats
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  // Filter
  filterBar: {
    maxHeight: 48,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterBarContent: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'center',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: colors.white,
  },
  // Order list
  orderList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  orderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  orderThumb: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: colors.gray[200],
  },
  orderInfo: {
    flex: 1,
    marginLeft: 12,
  },
  orderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  orderMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  orderMetaText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  orderFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  orderPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  quickActions: {
    gap: 6,
    marginLeft: 8,
  },
  quickApprove: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickReject: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#C62828',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 12,
  },
  // Detail modal
  detailScroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  detailOrderId: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  detailDate: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusBadgeLarge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusBadgeLargeText: {
    fontSize: 14,
    fontWeight: '700',
  },
  detailSection: {
    marginBottom: 24,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  detailAdImage: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 14,
    backgroundColor: colors.gray[200],
  },
  detailAdTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 10,
  },
  panelInfoCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  panelThumb: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: colors.gray[200],
  },
  panelDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  panelName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  panelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  panelText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  summaryLabelBold: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  summaryValueBold: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateChipIdx: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  dateChipIdxText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  dateChipText: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  rejectReasonBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  rejectReasonText: {
    flex: 1,
    fontSize: 14,
    color: '#C62828',
    lineHeight: 20,
  },
  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  approveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  approveButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C62828',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  rejectButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  // Reject modal
  rejectModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  rejectModalContent: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  rejectModalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  rejectModalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 10,
  },
  rejectModalSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  rejectInput: {
    backgroundColor: colors.gray[100],
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: colors.textPrimary,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: colors.border,
  },
  rejectModalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  rejectModalCancel: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  rejectModalCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  rejectModalConfirm: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#C62828',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  rejectModalConfirmText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});
