import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import BackHeader from '../../components/BackHeader';
import { useOrders } from '../../context/OrderContext';

const OrderDetailScreen = ({ navigation }) => {
  const routeParams = navigation.currentRoute.params;
  const { orders, STATUS_LABELS, STATUS_COLORS, STATUS_STEPS } = useOrders();

  // Context'ten guncel siparisi cek (admin durum degistirmisse yansisin)
  const order = orders.find((o) => o.id === routeParams?.id) || routeParams;

  if (!order) return null;

  const currentStepIndex = STATUS_STEPS.indexOf(order.status);
  const statusColor = STATUS_COLORS[order.status] || STATUS_COLORS.onay_bekliyor;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <BackHeader title="Sipariş Detayı" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Siparis No + Durum */}
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderId}>{order.id}</Text>
            <Text style={styles.orderDate}>{order.createdAt}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
            <Text style={[styles.statusText, { color: statusColor.text }]}>
              {STATUS_LABELS[order.status]}
            </Text>
          </View>
        </View>

        {/* Durum Takip Cizgisi */}
        <View style={styles.trackingSection}>
          <Text style={styles.sectionTitle}>Sipariş Durumu</Text>
          <View style={styles.timeline}>
            {STATUS_STEPS.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const stepColor = STATUS_COLORS[step];
              return (
                <View key={step} style={styles.timelineItem}>
                  <View style={styles.timelineDotColumn}>
                    <View style={[
                      styles.timelineDot,
                      isCompleted && { backgroundColor: stepColor.text },
                      isCurrent && styles.timelineDotCurrent,
                    ]}>
                      {isCompleted && <Ionicons name="checkmark" size={14} color="#fff" />}
                    </View>
                    {index < STATUS_STEPS.length - 1 && (
                      <View style={[
                        styles.timelineLine,
                        isCompleted && { backgroundColor: stepColor.text },
                      ]} />
                    )}
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={[
                      styles.timelineLabel,
                      isCurrent && { fontWeight: '800', color: stepColor.text },
                    ]}>
                      {STATUS_LABELS[step]}
                    </Text>
                    {isCurrent && step === 'onay_bekliyor' && (
                      <Text style={styles.timelineDesc}>Ödemeniz alındı, sipariş onaylanıyor.</Text>
                    )}
                    {isCurrent && step === 'hazirlaniyor' && (
                      <Text style={styles.timelineDesc}>Reklamınız panoya yerleştirilmek üzere hazırlanıyor.</Text>
                    )}
                    {isCurrent && step === 'live' && (
                      <Text style={styles.timelineDesc}>Reklamınız şu anda billboard panoda yayında!</Text>
                    )}
                    {isCurrent && step === 'completed' && (
                      <Text style={styles.timelineDesc}>Reklam süresi tamamlandı. Teşekkürler!</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Reddedilme Bilgisi */}
        {order.status === 'rejected' && (
          <View style={styles.rejectedSection}>
            <View style={styles.rejectedBox}>
              <Ionicons name="close-circle" size={24} color="#C62828" />
              <View style={styles.rejectedContent}>
                <Text style={styles.rejectedTitle}>Sipariş Reddedildi</Text>
                <Text style={styles.rejectedReason}>
                  {order.rejectReason || 'Reklam içeriği uygun bulunmadı.'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Billboard Montaj Onizlemesi */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Billboard Görünümü</Text>
          <Text style={styles.sectionSubtitle}>Reklamınız panoda böyle görünüyor</Text>
          <View style={styles.montageContainer}>
            <Image
              source={{ uri: order.panel.image }}
              style={styles.panelBackgroundImage}
              resizeMode="cover"
              blurRadius={2}
            />
            <View style={styles.montageOverlay}>
              <View style={styles.montageFrame}>
                <Image
                  source={{ uri: order.adImage }}
                  style={styles.montageAdImage}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.montageLabel}>
                <Ionicons name="location" size={12} color="#fff" />
                <Text style={styles.montageLabelText}>{order.panel.name}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Foto Dogrulama */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Yerinde Doğrulama</Text>
          {order.proofPhoto ? (
            <View>
              <Text style={styles.sectionSubtitle}>Sahadaki ekibimiz tarafından çekilmiştir</Text>
              <View style={styles.proofContainer}>
                <Image
                  source={{ uri: order.proofPhoto }}
                  style={styles.proofImage}
                  resizeMode="cover"
                />
                <View style={styles.proofWatermark}>
                  <View style={styles.proofBadge}>
                    <Ionicons name="checkmark-circle" size={16} color="#2E7D32" />
                    <Text style={styles.proofBadgeText}>Doğrulandı</Text>
                  </View>
                  <Text style={styles.proofTimestamp}>{order.proofDate}</Text>
                  <Text style={styles.proofLocation}>{order.panel.location}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.proofPending}>
              <Ionicons name="camera-outline" size={40} color={colors.gray[300]} />
              <Text style={styles.proofPendingText}>Doğrulama fotoğrafı bekleniyor</Text>
              <Text style={styles.proofPendingSubtext}>
                Reklam panoya yerleştirildiğinde saha ekibimiz fotoğraf çekecektir.
              </Text>
            </View>
          )}
        </View>

        {/* Pano Bilgileri */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pano Bilgileri</Text>
          <View style={styles.infoCard}>
            <Image source={{ uri: order.panel.image }} style={styles.panelThumb} resizeMode="cover" />
            <View style={styles.panelInfo}>
              <Text style={styles.panelName}>{order.panel.name}</Text>
              <View style={styles.panelRow}>
                <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
                <Text style={styles.panelDetail}>{order.panel.location}</Text>
              </View>
              <View style={styles.panelRow}>
                <Ionicons name="resize-outline" size={14} color={colors.textSecondary} />
                <Text style={styles.panelDetail}>{order.panel.size}</Text>
              </View>
              <View style={styles.panelRow}>
                <Ionicons name="pricetag-outline" size={14} color={colors.textSecondary} />
                <Text style={styles.panelDetail}>{order.panel.price}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Siparis Ozeti */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sipariş Özeti</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Reklam Başlığı</Text>
              <Text style={styles.summaryValue} numberOfLines={1}>{order.adTitle}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Yayın Günleri</Text>
              <Text style={styles.summaryValue}>{order.dates?.length || 0} gün</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Reklam Süresi</Text>
              <Text style={styles.summaryValue}>{order.adDuration}</Text>
            </View>
            <View style={[styles.summaryRow, styles.summaryRowLast]}>
              <Text style={styles.summaryLabelBold}>Toplam Tutar</Text>
              <Text style={styles.summaryValueBold}>{order.totalPrice}</Text>
            </View>
          </View>
        </View>

        {/* Yayin Tarihleri */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Yayın Tarihleri</Text>
          {order.dates?.map((d, i) => (
            <View key={i} style={styles.dateChip}>
              <View style={styles.dateChipIndex}>
                <Text style={styles.dateChipIndexText}>{i + 1}</Text>
              </View>
              <Text style={styles.dateChipText}>{d}</Text>
              {order.status === 'live' && i === 0 && (
                <View style={styles.liveDot}>
                  <Text style={styles.liveDotText}>Aktif</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  orderId: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  orderDate: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
  },
  // Timeline
  trackingSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  timeline: {
    marginTop: 12,
    paddingLeft: 4,
  },
  timelineItem: {
    flexDirection: 'row',
    minHeight: 56,
  },
  timelineDotColumn: {
    alignItems: 'center',
    width: 28,
  },
  timelineDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.gray[200],
  },
  timelineDotCurrent: {
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  timelineLine: {
    width: 3,
    flex: 1,
    backgroundColor: colors.gray[200],
    marginVertical: 2,
  },
  timelineContent: {
    flex: 1,
    paddingLeft: 12,
    paddingBottom: 12,
  },
  timelineLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  timelineDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 17,
  },
  // Montage
  section: {
    marginBottom: 24,
  },
  montageContainer: {
    aspectRatio: 16 / 9,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  panelBackgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  montageOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  montageFrame: {
    width: '75%',
    aspectRatio: 16 / 9,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  montageAdImage: {
    width: '100%',
    height: '100%',
  },
  montageLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 10,
    gap: 4,
  },
  montageLabelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  // Proof
  proofContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  proofImage: {
    width: '100%',
    aspectRatio: 4 / 3,
    backgroundColor: colors.gray[200],
  },
  proofWatermark: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  proofBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  proofBadgeText: {
    color: '#A5D6A7',
    fontSize: 13,
    fontWeight: '700',
  },
  proofTimestamp: {
    color: '#ccc',
    fontSize: 12,
  },
  proofLocation: {
    color: '#aaa',
    fontSize: 11,
    marginTop: 1,
  },
  proofPending: {
    alignItems: 'center',
    paddingVertical: 36,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    marginTop: 8,
  },
  proofPendingText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 10,
  },
  proofPendingSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 24,
  },
  // Panel Info
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 8,
  },
  panelThumb: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: colors.gray[200],
  },
  panelInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  panelName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  panelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  panelDetail: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  // Summary
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  summaryRowLast: {
    borderBottomWidth: 0,
    paddingTop: 14,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    maxWidth: '55%',
    textAlign: 'right',
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
  // Dates
  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateChipIndex: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  dateChipIndexText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  dateChipText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
    flex: 1,
  },
  liveDot: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  liveDotText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2E7D32',
  },
  // Rejected
  rejectedSection: {
    marginBottom: 24,
  },
  rejectedBox: {
    flexDirection: 'row',
    backgroundColor: '#FFEBEE',
    borderRadius: 14,
    padding: 16,
    gap: 12,
    alignItems: 'flex-start',
  },
  rejectedContent: {
    flex: 1,
  },
  rejectedTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#C62828',
    marginBottom: 4,
  },
  rejectedReason: {
    fontSize: 14,
    color: '#C62828',
    lineHeight: 20,
  },
});

export default OrderDetailScreen;
