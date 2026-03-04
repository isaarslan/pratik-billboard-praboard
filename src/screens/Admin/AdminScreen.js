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
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import BackHeader from '../../components/BackHeader';
import { useOrders } from '../../context/OrderContext';
import { useTVContent } from '../../context/TVContentContext';
import DashboardTab from './DashboardTab';
import PanelManagementTab from './PanelManagementTab';
import UserManagementTab from './UserManagementTab';
import ContentModerationTab from './ContentModerationTab';

const ADMIN_TABS = [
  { key: 'dashboard', label: 'Dashboard', icon: 'grid-outline' },
  { key: 'orders', label: 'Siparişler', icon: 'receipt-outline' },
  { key: 'panels', label: 'Paneller', icon: 'map-outline' },
  { key: 'moderation', label: 'Moderasyon', icon: 'shield-checkmark-outline' },
  { key: 'users', label: 'Kullanıcılar', icon: 'people-outline' },
  { key: 'tv', label: 'TV Yönetimi', icon: 'tv-outline' },
];

const ORDER_FILTERS = [
  { key: 'all', label: 'Tümü' },
  { key: 'onay_bekliyor', label: 'Bekleyen' },
  { key: 'hazirlaniyor', label: 'Hazırlanan' },
  { key: 'live', label: 'Yayında' },
  { key: 'completed', label: 'Tamamlanan' },
  { key: 'rejected', label: 'Reddedilen' },
];

export default function AdminScreen({ navigation }) {
  const { orders, updateOrderStatus, rejectOrder, STATUS_LABELS, STATUS_COLORS } = useOrders();
  const { tvContents, tvPanels, pushToTV, startPlaying, markComplete, remove, onlinePanels, playingCount, approvedCount, TV_STATUS_LABELS, TV_STATUS_COLORS } = useTVContent();

  const [mainTab, setMainTab] = useState('dashboard');
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

  const handleApproveNext = async (order) => {
    const next = getNextStatus(order.status);
    if (!next) return;

    await updateOrderStatus(order.id, next);

    // Siparis onaylandiginda otomatik olarak TV'ye icerik gonder (Supabase'e yazar)
    if (order.status === 'onay_bekliyor' && next === 'hazirlaniyor') {
      await pushToTV(order);
    }
  };

  const handleOpenReject = (orderId) => {
    setRejectTargetId(orderId);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const handleConfirmReject = async () => {
    if (rejectTargetId) {
      await rejectOrder(rejectTargetId, rejectReason);
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

  // =====================================================
  // SIPARIS DETAY MODALI
  // =====================================================
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

            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Reklam Görseli</Text>
              <Image source={{ uri: order.adImage }} style={styles.detailAdImage} resizeMode="cover" />
              <Text style={styles.detailAdTitle}>{order.adTitle}</Text>
            </View>

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

            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Sipariş Özeti</Text>
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Yayın Günleri</Text>
                  <Text style={styles.summaryValue}>{order.dates?.length || 0} gün</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Reklam Süresi</Text>
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

            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Yayın Tarihleri</Text>
              {order.dates?.map((d, i) => (
                <View key={i} style={styles.dateChip}>
                  <View style={styles.dateChipIdx}>
                    <Text style={styles.dateChipIdxText}>{i + 1}</Text>
                  </View>
                  <Text style={styles.dateChipText}>{d}</Text>
                </View>
              ))}
            </View>

            {order.status === 'rejected' && order.rejectReason && (
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Ret Sebebi</Text>
                <View style={styles.rejectReasonBox}>
                  <Ionicons name="close-circle" size={20} color="#C62828" />
                  <Text style={styles.rejectReasonText}>{order.rejectReason}</Text>
                </View>
              </View>
            )}

            {order.status !== 'completed' && order.status !== 'rejected' && (
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Admin İşlemleri</Text>
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
                    style={styles.rejectBtn}
                    onPress={() => handleOpenReject(order.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="close-circle" size={20} color="#fff" />
                    <Text style={styles.rejectBtnText}>Reddet</Text>
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

  // =====================================================
  // SIPARISLER SEKMESI
  // =====================================================
  const renderOrdersTab = () => (
    <>
      {/* Özet Kartları */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
          <Text style={[styles.statNumber, { color: '#E65100' }]}>{pendingCount}</Text>
          <Text style={styles.statLabel}>Bekleyen</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
          <Text style={[styles.statNumber, { color: '#2E7D32' }]}>{liveCount}</Text>
          <Text style={styles.statLabel}>Yayında</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
          <Text style={[styles.statNumber, { color: '#1565C0' }]}>{totalCount}</Text>
          <Text style={styles.statLabel}>Toplam</Text>
        </View>
      </View>

      {/* Filtre */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar} contentContainerStyle={styles.filterBarContent}>
        {ORDER_FILTERS.map((f) => (
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

      {/* Sipariş Listesi */}
      <ScrollView style={styles.listArea} showsVerticalScrollIndicator={false}>
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="file-tray-outline" size={48} color={colors.gray[300]} />
            <Text style={styles.emptyText}>Bu kategoride sipariş yok</Text>
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
                      <Text style={[styles.statusBadgeText, { color: sc.text }]}>
                        {STATUS_LABELS[order.status]}
                      </Text>
                    </View>
                    <Text style={styles.orderPrice}>{order.totalPrice}</Text>
                  </View>
                </View>
                <View style={styles.quickActions}>
                  {actionLabel && (
                    <TouchableOpacity
                      style={styles.quickApprove}
                      onPress={(e) => { e.stopPropagation?.(); handleApproveNext(order); }}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="checkmark" size={18} color="#fff" />
                    </TouchableOpacity>
                  )}
                  {order.status !== 'completed' && order.status !== 'rejected' && (
                    <TouchableOpacity
                      style={styles.quickReject}
                      onPress={(e) => { e.stopPropagation?.(); handleOpenReject(order.id); }}
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
    </>
  );

  // =====================================================
  // TV YONETIMI SEKMESI
  // =====================================================
  const renderTVTab = () => (
    <ScrollView style={styles.listArea} showsVerticalScrollIndicator={false}>
      {/* TV Özet */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
          <Text style={[styles.statNumber, { color: '#2E7D32' }]}>{onlinePanels}</Text>
          <Text style={styles.statLabel}>Çevrimiçi</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
          <Text style={[styles.statNumber, { color: '#1565C0' }]}>{playingCount}</Text>
          <Text style={styles.statLabel}>Yayında</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
          <Text style={[styles.statNumber, { color: '#E65100' }]}>{approvedCount}</Text>
          <Text style={styles.statLabel}>Sırada</Text>
        </View>
      </View>

      {/* TV Panolari */}
      <View style={styles.tvSection}>
        <Text style={styles.tvSectionTitle}>Pano Durumları</Text>
        {tvPanels.map((panel) => {
          const currentContent = tvContents.find((c) => c.id === panel.currentContentId)
            || tvContents.find((c) => c.panelId === panel.id && c.status === 'playing');
          const isOnline = panel.status === 'online' || !!currentContent;
          return (
            <View key={panel.id} style={styles.tvPanelCard}>
              <View style={styles.tvPanelHeader}>
                <View style={styles.tvPanelNameRow}>
                  <View style={[styles.onlineDot, { backgroundColor: isOnline ? '#2E7D32' : '#C62828' }]} />
                  <Text style={styles.tvPanelName}>{panel.name}</Text>
                </View>
                <View style={[styles.tvOnlineBadge, { backgroundColor: isOnline ? '#E8F5E9' : '#FFEBEE' }]}>
                  <Text style={[styles.tvOnlineBadgeText, { color: isOnline ? '#2E7D32' : '#C62828' }]}>
                    {isOnline ? 'Çevrimiçi' : 'Çevrimdışı'}
                  </Text>
                </View>
              </View>
              <View style={styles.tvPanelBody}>
                <View style={styles.tvPanelRow}>
                  <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
                  <Text style={styles.tvPanelText}>{panel.location}</Text>
                </View>
                <View style={styles.tvPanelRow}>
                  <Ionicons name="desktop-outline" size={14} color={colors.textSecondary} />
                  <Text style={styles.tvPanelText}>{panel.resolution}</Text>
                </View>
                {currentContent ? (
                  <View style={styles.tvCurrentContent}>
                    <Ionicons name="play-circle" size={16} color="#2E7D32" />
                    <Text style={styles.tvCurrentContentText} numberOfLines={1}>
                      {currentContent.adTitle}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.tvCurrentContent}>
                    <Ionicons name="remove-circle-outline" size={16} color={colors.gray[400]} />
                    <Text style={[styles.tvCurrentContentText, { color: colors.gray[400] }]}>
                      İçerik atanmamış
                    </Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </View>

      {/* TV Icerik Kuyrugu */}
      <View style={styles.tvSection}>
        <Text style={styles.tvSectionTitle}>İçerik Kuyruğu</Text>
        {tvContents.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="tv-outline" size={48} color={colors.gray[300]} />
            <Text style={styles.emptyText}>TV içeriği yok</Text>
            <Text style={styles.emptySubtext}>Sipariş onaylandığında içerik otomatik eklenir</Text>
          </View>
        ) : (
          tvContents.map((content) => {
            const tvSc = TV_STATUS_COLORS[content.status] || TV_STATUS_COLORS.pending;
            return (
              <View key={content.id} style={styles.tvContentCard}>
                <Image source={{ uri: content.mediaUrl }} style={styles.tvContentThumb} resizeMode="cover" />
                <View style={styles.tvContentInfo}>
                  <Text style={styles.tvContentTitle} numberOfLines={1}>{content.adTitle}</Text>
                  <View style={styles.tvContentMeta}>
                    <Ionicons name="location-outline" size={12} color={colors.textSecondary} />
                    <Text style={styles.tvContentMetaText}>{content.panelName}</Text>
                  </View>
                  <View style={styles.tvContentMeta}>
                    <Ionicons name="time-outline" size={12} color={colors.textSecondary} />
                    <Text style={styles.tvContentMetaText}>{content.duration}sn | {content.scheduledDates?.length || 0} gün</Text>
                  </View>
                  <View style={styles.tvContentFooter}>
                    <View style={[styles.statusBadge, { backgroundColor: tvSc.bg }]}>
                      <Text style={[styles.statusBadgeText, { color: tvSc.text }]}>
                        {TV_STATUS_LABELS[content.status]}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.quickActions}>
                  {content.status === 'approved' && (
                    <TouchableOpacity
                      style={styles.quickApprove}
                      onPress={() => startPlaying(content.id)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="play" size={16} color="#fff" />
                    </TouchableOpacity>
                  )}
                  {content.status === 'playing' && (
                    <TouchableOpacity
                      style={[styles.quickApprove, { backgroundColor: '#6A1B9A' }]}
                      onPress={() => markComplete(content.id)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="checkmark-done" size={16} color="#fff" />
                    </TouchableOpacity>
                  )}
                  {content.status !== 'completed' && (
                    <TouchableOpacity
                      style={styles.quickReject}
                      onPress={() => remove(content.id)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="trash" size={16} color="#fff" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })
        )}
      </View>

      <View style={{ height: 24 }} />
    </ScrollView>
  );

  // =====================================================
  // ANA EKRAN
  // =====================================================
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <BackHeader title="Admin Paneli" onBack={() => navigation.goBack()} />

      {/* Ana Sekme Bari - Yatay Kaydırılabilir */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.mainTabBar}
        contentContainerStyle={styles.mainTabBarContent}
      >
        {ADMIN_TABS.map((tab) => {
          const isActive = mainTab === tab.key;
          const badge = tab.key === 'orders' ? pendingCount
            : tab.key === 'tv' ? playingCount
            : tab.key === 'moderation' ? pendingCount
            : 0;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.mainTab, isActive && styles.mainTabActive]}
              onPress={() => setMainTab(tab.key)}
              activeOpacity={0.7}
            >
              <Ionicons name={tab.icon} size={16} color={isActive ? colors.white : colors.textSecondary} />
              <Text style={[styles.mainTabText, isActive && styles.mainTabTextActive]}>
                {tab.label}
              </Text>
              {badge > 0 && (
                <View style={[styles.tabBadge, isActive && { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
                  <Text style={styles.tabBadgeText}>{badge}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Sekme Icerigi */}
      {mainTab === 'dashboard' && <DashboardTab />}
      {mainTab === 'orders' && renderOrdersTab()}
      {mainTab === 'panels' && <PanelManagementTab />}
      {mainTab === 'moderation' && <ContentModerationTab />}
      {mainTab === 'users' && <UserManagementTab />}
      {mainTab === 'tv' && renderTVTab()}

      {/* Siparis Detay Modal */}
      {selectedOrder && renderOrderDetail()}

      {/* Reddetme Modal */}
      <Modal visible={showRejectModal} transparent animationType="fade">
        <View style={styles.rejectModalOverlay}>
          <View style={styles.rejectModalContent}>
            <View style={styles.rejectModalHeader}>
              <Ionicons name="close-circle" size={40} color="#C62828" />
              <Text style={styles.rejectModalTitle}>Siparişi Reddet</Text>
              <Text style={styles.rejectModalSubtitle}>Ret sebebini belirtin (opsiyonel)</Text>
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
                onPress={() => { setShowRejectModal(false); setRejectTargetId(null); }}
                activeOpacity={0.7}
              >
                <Text style={styles.rejectModalCancelText}>Vazgeç</Text>
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
  // Ana Sekme Bari
  mainTabBar: {
    maxHeight: 52,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  mainTabBarContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  mainTab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mainTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  mainTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  mainTabTextActive: {
    color: colors.white,
  },
  tabBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  tabBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },
  // Stats
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
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
  // List area
  listArea: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  // Order card
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
  statusBadgeText: {
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
  emptySubtext: {
    fontSize: 13,
    color: colors.gray[400],
    marginTop: 4,
    textAlign: 'center',
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
  rejectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C62828',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  rejectBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  // TV Section
  tvSection: {
    marginBottom: 20,
  },
  tvSectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
    marginTop: 4,
  },
  tvPanelCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tvPanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  tvPanelNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  tvPanelName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  tvOnlineBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tvOnlineBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  tvPanelBody: {
    gap: 4,
  },
  tvPanelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tvPanelText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  tvCurrentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
    backgroundColor: colors.gray[100],
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tvCurrentContentText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#2E7D32',
  },
  // TV Content Card
  tvContentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tvContentThumb: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: colors.gray[200],
  },
  tvContentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  tvContentTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  tvContentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  tvContentMetaText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  tvContentFooter: {
    marginTop: 4,
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
