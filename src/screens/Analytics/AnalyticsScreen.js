import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import BackHeader from '../../components/BackHeader';
import { useAuth } from '../../context/AuthContext';
import { getUserAnalytics } from '../../services/analyticsService';

export default function AnalyticsScreen({ navigation }) {
  const { profile } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!profile?.id) return;
    const data = await getUserAnalytics(profile.id);
    setAnalytics(data);
    setLoading(false);
  }, [profile?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const formatDuration = (ms) => {
    if (!ms) return '0s';
    const seconds = Math.round(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}dk ${seconds % 60}s`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <BackHeader title="Analitik" onBack={() => navigation.goBack()} />
        <View style={styles.loadingContainer}>
          <Ionicons name="pulse-outline" size={32} color={colors.gray[400]} />
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const maxDaily = Math.max(...(analytics?.dailyViews || []).map((d) => d.count), 1);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <BackHeader title="Analitik" onBack={() => navigation.goBack()} />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {/* Özet Kartları */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: '#FFF0F0' }]}>
            <View style={[styles.statIconCircle, { backgroundColor: '#FECACA' }]}>
              <Ionicons name="eye-outline" size={20} color={colors.primary} />
            </View>
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              {analytics?.totalViews || 0}
            </Text>
            <Text style={styles.statLabel}>Toplam Gösterim</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
            <View style={[styles.statIconCircle, { backgroundColor: '#C8E6C9' }]}>
              <Ionicons name="time-outline" size={20} color="#2E7D32" />
            </View>
            <Text style={[styles.statNumber, { color: '#2E7D32' }]}>
              {formatDuration(analytics?.avgDuration)}
            </Text>
            <Text style={styles.statLabel}>Ort. Süre</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
            <View style={[styles.statIconCircle, { backgroundColor: '#BBDEFB' }]}>
              <Ionicons name="heart-outline" size={20} color="#1565C0" />
            </View>
            <Text style={[styles.statNumber, { color: '#1565C0' }]}>
              {analytics?.totalLikes || 0}
            </Text>
            <Text style={styles.statLabel}>Beğeni</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
            <View style={[styles.statIconCircle, { backgroundColor: '#FFE0B2' }]}>
              <Ionicons name="share-social-outline" size={20} color="#E65100" />
            </View>
            <Text style={[styles.statNumber, { color: '#E65100' }]}>
              {analytics?.totalShares || 0}
            </Text>
            <Text style={styles.statLabel}>Paylaşım</Text>
          </View>
        </View>

        {/* Sipariş Özeti */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{analytics?.totalOrders || 0}</Text>
              <Text style={styles.summaryLabel}>Toplam Sipariş</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNumber, { color: '#2E7D32' }]}>
                {analytics?.activeOrders || 0}
              </Text>
              <Text style={styles.summaryLabel}>Aktif Yayın</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>
                {formatDuration(analytics?.totalDuration)}
              </Text>
              <Text style={styles.summaryLabel}>Toplam Süre</Text>
            </View>
          </View>
        </View>

        {/* Son 7 Gün Grafiği */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Son 7 Gün</Text>
          <View style={styles.chartContainer}>
            {(analytics?.dailyViews || []).map((day) => (
              <View key={day.date} style={styles.chartColumn}>
                <Text style={styles.chartCount}>{day.count}</Text>
                <View style={styles.chartBarContainer}>
                  <View
                    style={[
                      styles.chartBar,
                      {
                        height: day.count > 0 ? Math.max((day.count / maxDaily) * 100, 4) : 4,
                        backgroundColor: day.count > 0 ? colors.primary : colors.gray[200],
                      },
                    ]}
                  />
                </View>
                <Text style={styles.chartLabel}>{day.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Panel Dağılımı */}
        {Object.keys(analytics?.panelCounts || {}).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Panel Dağılımı</Text>
            {Object.entries(analytics.panelCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([panelId, count]) => {
                const maxCount = Math.max(...Object.values(analytics.panelCounts));
                const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
                return (
                  <View key={panelId} style={styles.panelRow}>
                    <View style={styles.panelInfo}>
                      <Ionicons name="tv-outline" size={16} color={colors.textSecondary} />
                      <Text style={styles.panelName} numberOfLines={1}>
                        {panelId}
                      </Text>
                    </View>
                    <View style={styles.panelBarOuter}>
                      <View style={[styles.panelBarInner, { width: `${pct}%` }]} />
                    </View>
                    <Text style={styles.panelCount}>{count}</Text>
                  </View>
                );
              })}
          </View>
        )}

        {/* Sipariş Bazlı Performans */}
        {(analytics?.orderStats || []).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reklam Performansı</Text>
            {analytics.orderStats
              .sort((a, b) => b.views - a.views)
              .map((order) => (
                <View key={order.id} style={styles.orderStatCard}>
                  <View style={styles.orderStatInfo}>
                    <Text style={styles.orderStatTitle} numberOfLines={1}>
                      {order.title || order.id}
                    </Text>
                    <View style={styles.orderStatMeta}>
                      <View style={[styles.statusDot, {
                        backgroundColor: order.status === 'live' ? '#2E7D32' : colors.gray[400],
                      }]} />
                      <Text style={styles.orderStatStatus}>
                        {order.status === 'live' ? 'Yayında' : order.status}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.orderStatViews}>
                    <Ionicons name="eye" size={14} color={colors.primary} />
                    <Text style={styles.orderStatViewsText}>{order.views}</Text>
                  </View>
                </View>
              ))}
          </View>
        )}

        {/* Veri yoksa */}
        {analytics?.totalViews === 0 && (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="analytics-outline" size={36} color={colors.gray[400]} />
            </View>
            <Text style={styles.emptyTitle}>Henüz gösterim verisi yok</Text>
            <Text style={styles.emptyText}>
              Reklamlarınız TV panolarında gösterildiğinde burada detaylı analitikler göreceksiniz.
            </Text>
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
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
    fontSize: 24,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  // Summary
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  summaryLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 4,
  },
  summaryDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.border,
  },
  // Section
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  // Chart
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  chartColumn: {
    flex: 1,
    alignItems: 'center',
  },
  chartCount: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  chartBarContainer: {
    width: '80%',
    height: 100,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  chartBar: {
    width: '100%',
    borderRadius: 4,
    minHeight: 4,
  },
  chartLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '600',
    marginTop: 6,
  },
  // Panel Distribution
  panelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  panelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: 100,
  },
  panelName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  panelBarOuter: {
    flex: 1,
    height: 8,
    backgroundColor: colors.gray[100],
    borderRadius: 4,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  panelBarInner: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  panelCount: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    minWidth: 30,
    textAlign: 'right',
  },
  // Order Stats
  orderStatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  orderStatInfo: {
    flex: 1,
  },
  orderStatTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  orderStatMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  orderStatStatus: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  orderStatViews: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF0F0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  orderStatViewsText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  // Empty
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
});
