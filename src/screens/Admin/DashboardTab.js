import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { getDashboardStats, getRecentActivities } from '../../services/adminService';
import { getPanelStats } from '../../services/panelService';

const STATUS_LABELS = {
  onay_bekliyor: 'Onay Bekliyor',
  hazirlaniyor: 'Hazırlanıyor',
  live: 'Yayında',
  completed: 'Tamamlandı',
  rejected: 'Reddedildi',
};

const STATUS_ICONS = {
  onay_bekliyor: 'time-outline',
  hazirlaniyor: 'construct-outline',
  live: 'play-circle-outline',
  completed: 'checkmark-circle-outline',
  rejected: 'close-circle-outline',
};

const STATUS_COLORS = {
  onay_bekliyor: '#E65100',
  hazirlaniyor: '#1565C0',
  live: '#2E7D32',
  completed: '#6A1B9A',
  rejected: '#C62828',
};

export default function DashboardTab() {
  const [stats, setStats] = useState(null);
  const [panelStats, setPanelStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    const [s, ps, acts] = await Promise.all([
      getDashboardStats(),
      getPanelStats(),
      getRecentActivities(8),
    ]);
    setStats(s);
    setPanelStats(ps);
    setActivities(acts);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const formatCurrency = (amount) => {
    if (!amount) return '0 TL';
    return `${amount.toLocaleString('tr-TR')} TL`;
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'Az önce';
    if (diffMin < 60) return `${diffMin} dk önce`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour} saat önce`;
    const diffDay = Math.floor(diffHour / 24);
    if (diffDay < 7) return `${diffDay} gün önce`;
    return date.toLocaleDateString('tr-TR');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="pulse-outline" size={32} color={colors.gray[400]} />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
    >
      {/* Ana İstatistik Kartları */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: '#FFF0F0' }]}>
          <View style={[styles.statIconCircle, { backgroundColor: '#FECACA' }]}>
            <Ionicons name="receipt-outline" size={20} color={colors.primary} />
          </View>
          <Text style={[styles.statNumber, { color: colors.primary }]}>{stats?.totalOrders || 0}</Text>
          <Text style={styles.statLabel}>Toplam Sipariş</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
          <View style={[styles.statIconCircle, { backgroundColor: '#C8E6C9' }]}>
            <Ionicons name="play-circle-outline" size={20} color="#2E7D32" />
          </View>
          <Text style={[styles.statNumber, { color: '#2E7D32' }]}>{stats?.liveOrders || 0}</Text>
          <Text style={styles.statLabel}>Aktif Yayın</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
          <View style={[styles.statIconCircle, { backgroundColor: '#BBDEFB' }]}>
            <Ionicons name="people-outline" size={20} color="#1565C0" />
          </View>
          <Text style={[styles.statNumber, { color: '#1565C0' }]}>{stats?.totalUsers || 0}</Text>
          <Text style={styles.statLabel}>Kullanıcı</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
          <View style={[styles.statIconCircle, { backgroundColor: '#FFE0B2' }]}>
            <Ionicons name="time-outline" size={20} color="#E65100" />
          </View>
          <Text style={[styles.statNumber, { color: '#E65100' }]}>{stats?.pendingOrders || 0}</Text>
          <Text style={styles.statLabel}>Bekleyen</Text>
        </View>
      </View>

      {/* Gelir Kartı */}
      <View style={styles.revenueCard}>
        <View style={styles.revenueHeader}>
          <View>
            <Text style={styles.revenueLabel}>Toplam Gelir</Text>
            <Text style={styles.revenueAmount}>{formatCurrency(stats?.totalRevenue)}</Text>
          </View>
          <View style={styles.revenueIconCircle}>
            <Ionicons name="wallet-outline" size={24} color={colors.primary} />
          </View>
        </View>
        <View style={styles.revenueStats}>
          <View style={styles.revenueStat}>
            <Ionicons name="heart-outline" size={14} color={colors.primary} />
            <Text style={styles.revenueStatText}>{stats?.totalLikes || 0} beğeni</Text>
          </View>
          <View style={styles.revenueStat}>
            <Ionicons name="share-social-outline" size={14} color={colors.primary} />
            <Text style={styles.revenueStatText}>{stats?.totalShares || 0} paylaşım</Text>
          </View>
        </View>
      </View>

      {/* Panel Durumları */}
      {panelStats && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Panel Durumları</Text>
          <View style={styles.panelStatsRow}>
            <View style={[styles.panelStatChip, { backgroundColor: '#E8F5E9' }]}>
              <View style={[styles.panelStatDot, { backgroundColor: '#2E7D32' }]} />
              <Text style={styles.panelStatCount}>{panelStats.available}</Text>
              <Text style={styles.panelStatLabel}>Müsait</Text>
            </View>
            <View style={[styles.panelStatChip, { backgroundColor: '#FFF3E0' }]}>
              <View style={[styles.panelStatDot, { backgroundColor: '#E65100' }]} />
              <Text style={styles.panelStatCount}>{panelStats.full}</Text>
              <Text style={styles.panelStatLabel}>Dolu</Text>
            </View>
            <View style={[styles.panelStatChip, { backgroundColor: '#FFEBEE' }]}>
              <View style={[styles.panelStatDot, { backgroundColor: '#C62828' }]} />
              <Text style={styles.panelStatCount}>{panelStats.maintenance}</Text>
              <Text style={styles.panelStatLabel}>Bakımda</Text>
            </View>
            <View style={[styles.panelStatChip, { backgroundColor: '#F5F5F5' }]}>
              <View style={[styles.panelStatDot, { backgroundColor: colors.gray[500] }]} />
              <Text style={styles.panelStatCount}>{panelStats.total}</Text>
              <Text style={styles.panelStatLabel}>Toplam</Text>
            </View>
          </View>
        </View>
      )}

      {/* Son Aktiviteler */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Son Aktiviteler</Text>
        {activities.length === 0 ? (
          <View style={styles.emptyActivity}>
            <Ionicons name="newspaper-outline" size={36} color={colors.gray[300]} />
            <Text style={styles.emptyActivityText}>Henüz aktivite yok</Text>
          </View>
        ) : (
          activities.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: (STATUS_COLORS[activity.status] || colors.gray[400]) + '20' }]}>
                <Ionicons
                  name={STATUS_ICONS[activity.status] || 'ellipse-outline'}
                  size={18}
                  color={STATUS_COLORS[activity.status] || colors.gray[400]}
                />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle} numberOfLines={1}>{activity.title}</Text>
                <View style={styles.activityMeta}>
                  <Text style={styles.activityStatus}>
                    {STATUS_LABELS[activity.status] || activity.status}
                  </Text>
                  {activity.subtitle ? (
                    <Text style={styles.activitySubtitle}> · {activity.subtitle}</Text>
                  ) : null}
                </View>
              </View>
              <Text style={styles.activityTime}>{formatTime(activity.createdAt)}</Text>
            </View>
          ))
        )}
      </View>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: colors.gray[400],
  },
  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  statCard: {
    width: '48%',
    flexGrow: 1,
    borderRadius: 16,
    padding: 16,
  },
  statIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  // Revenue Card
  revenueCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  revenueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  revenueLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  revenueAmount: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 4,
  },
  revenueIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  revenueStats: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  revenueStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  revenueStatText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  // Section
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  // Panel Stats
  panelStatsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  panelStatChip: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  panelStatDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 6,
  },
  panelStatCount: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  panelStatLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  // Activity
  emptyActivity: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyActivityText: {
    fontSize: 14,
    color: colors.gray[400],
    marginTop: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  activityStatus: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  activitySubtitle: {
    fontSize: 12,
    color: colors.gray[400],
  },
  activityTime: {
    fontSize: 11,
    color: colors.gray[400],
    fontWeight: '500',
    marginLeft: 8,
  },
});
