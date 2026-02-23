import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { useAds } from '../../context/AdContext';
import { useOrders } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';

const ProfileScreen = ({ navigation }) => {
  const { profile, isAdmin, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('reklamlar');
  const { myAds, allAds } = useAds();
  const { orders, STATUS_LABELS, STATUS_COLORS } = useOrders();

  const handleSignOut = async () => {
    await signOut();
    // Auth state değişince navigation otomatik Onboarding'e yönlendirir
  };

  // Beğenilen ilanlar (ilk 3 başkasının ilanı)
  const likedAds = allAds.filter((a) => !a.isOwn).slice(0, 3);

  const renderAdCard = ({ item }) => (
    <TouchableOpacity
      style={styles.adCard}
      onPress={() => navigation.navigate('AdDetail', item)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.image }} style={styles.adImageReal} resizeMode="cover" />
      <View style={styles.adCardContent}>
        <Text style={styles.adTitle} numberOfLines={1}>{item.description || item.title}</Text>
        <Text style={styles.adDate}>{item.publishDate || item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderMediaGrid = () => (
    <View style={styles.mediaGrid}>
      {myAds.map((ad, index) => (
        <TouchableOpacity
          key={ad.id}
          style={styles.mediaItem}
          onPress={() => navigation.navigate('AdDetail', ad)}
          activeOpacity={0.8}
        >
          <Image source={{ uri: ad.image }} style={styles.mediaImage} resizeMode="cover" />
          {index % 3 === 0 && (
            <View style={styles.playIconOverlay}>
              <Ionicons name="play-circle" size={30} color={colors.white} />
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderContentItem = ({ item }) => (
    <View style={styles.contentCard}>
      <Image source={{ uri: item.image }} style={styles.contentThumbnailImg} resizeMode="cover" />
      <View style={styles.contentDetails}>
        <View style={styles.contentRow}>
          <Text style={styles.contentLabel}>Reklam Başlığı:</Text>
          <Text style={styles.contentValue} numberOfLines={1}>{item.description || '-'}</Text>
        </View>
        <View style={styles.contentRow}>
          <Text style={styles.contentLabel}>Toplam Gün:</Text>
          <Text style={styles.contentValue}>{item.totalDays || '-'}</Text>
        </View>
        <View style={styles.contentRow}>
          <Text style={styles.contentLabel}>Reklam Süresi:</Text>
          <Text style={styles.contentValue}>{item.adDuration || '-'}</Text>
        </View>
        <View style={styles.contentRow}>
          <Text style={styles.contentLabel}>Yayınlama Tarihi:</Text>
          <Text style={styles.contentValue}>{item.publishDate || '-'}</Text>
        </View>
      </View>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'reklamlar':
        return (
          <FlatList
            data={myAds}
            renderItem={renderAdCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.tabContent}
            scrollEnabled={false}
          />
        );
      case 'medya':
        return <View style={styles.tabContent}>{renderMediaGrid()}</View>;
      case 'iceriklerim':
        return (
          <FlatList
            data={myAds}
            renderItem={renderContentItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.tabContent}
            scrollEnabled={false}
          />
        );
      case 'begenilenler':
        return (
          <FlatList
            data={likedAds}
            renderItem={renderAdCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.tabContent}
            scrollEnabled={false}
          />
        );
      case 'siparislerim':
        return (
          <View style={styles.tabContent}>
            {orders.length === 0 ? (
              <View style={styles.emptyOrderContainer}>
                <Ionicons name="receipt-outline" size={48} color={colors.gray[300]} />
                <Text style={styles.emptyOrderText}>Henüz sipariş yok</Text>
              </View>
            ) : (
              orders.map((order) => {
                const sc = STATUS_COLORS[order.status];
                return (
                  <TouchableOpacity
                    key={order.id}
                    style={styles.orderCard}
                    onPress={() => navigation.navigate('OrderDetail', order)}
                    activeOpacity={0.7}
                  >
                    <Image source={{ uri: order.adImage }} style={styles.orderThumb} resizeMode="cover" />
                    <View style={styles.orderInfo}>
                      <Text style={styles.orderTitle} numberOfLines={1}>{order.adTitle}</Text>
                      <Text style={styles.orderPanel}>{order.panel.name}</Text>
                      <View style={styles.orderBottom}>
                        <View style={[styles.orderStatusBadge, { backgroundColor: sc.bg }]}>
                          <Text style={[styles.orderStatusText, { color: sc.text }]}>
                            {STATUS_LABELS[order.status]}
                          </Text>
                        </View>
                        <Text style={styles.orderPrice}>{order.totalPrice}</Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover Photo Section */}
        <View style={styles.coverPhotoContainer}>
          <View style={styles.coverPhoto} />
          <View style={styles.coverOverlayIcons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={24} color={colors.white} />
            </TouchableOpacity>
            <View style={styles.rightIcons}>
              {isAdmin && (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => navigation.navigate('Admin')}
                >
                  <Ionicons name="shield-checkmark" size={24} color={colors.white} />
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.plusBadge}>
                <Text style={styles.plusBadgeText}>P+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Profile Info Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={40} color={colors.textSecondary} />
            </View>
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{profile?.full_name || 'Kullanıcı'}</Text>
              <View style={styles.goldBadge}>
                <Text style={styles.goldBadgeText}>P</Text>
              </View>
            </View>
            <Text style={styles.username}>@{profile?.username || '...'}</Text>

            {profile?.bio ? (
              <Text style={styles.bioText}>{profile.bio}</Text>
            ) : null}

            <View style={styles.statsRow}>
              <Text style={styles.statsText}>{myAds.length} Reklam</Text>
              <Text style={styles.statsSeparator}>|</Text>
              <Text style={styles.statsText}>{orders.length} Sipariş</Text>
            </View>

            <View style={styles.profileButtons}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate('EditProfile')}
              >
                <Text style={styles.editButtonText}>Profili düzenle</Text>
              </TouchableOpacity>
              {isAdmin && (
                <TouchableOpacity
                  style={styles.adminButton}
                  onPress={() => navigation.navigate('Admin')}
                >
                  <Ionicons name="shield-checkmark" size={16} color={colors.white} />
                  <Text style={styles.adminButtonText}>Admin Paneli</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleSignOut}
              >
                <Ionicons name="log-out-outline" size={16} color={colors.primary} />
                <Text style={styles.logoutButtonText}>Çıkış</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Tab Bar */}
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'reklamlar' && styles.activeTab]}
              onPress={() => setActiveTab('reklamlar')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'reklamlar' && styles.activeTabText,
                ]}
              >
                Reklamlar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'medya' && styles.activeTab]}
              onPress={() => setActiveTab('medya')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'medya' && styles.activeTabText,
                ]}
              >
                Medya
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'iceriklerim' && styles.activeTab]}
              onPress={() => setActiveTab('iceriklerim')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'iceriklerim' && styles.activeTabText,
                ]}
              >
                İçeriklerim
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'begenilenler' && styles.activeTab]}
              onPress={() => setActiveTab('begenilenler')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'begenilenler' && styles.activeTabText,
                ]}
              >
                Beğeniler
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'siparislerim' && styles.activeTab]}
              onPress={() => setActiveTab('siparislerim')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'siparislerim' && styles.activeTabText,
                ]}
              >
                Siparişler
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Content */}
        {renderTabContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  coverPhotoContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  coverPhoto: {
    width: '100%',
    height: 200,
    backgroundColor: '#2A2A2A',
  },
  coverOverlayIcons: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  plusBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusBadgeText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  profileCard: {
    backgroundColor: colors.white,
    marginTop: -40,
    marginHorizontal: 16,
    borderRadius: 12,
    paddingBottom: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: -40,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.white,
  },
  profileInfo: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  goldBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goldBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  statsText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  statsSeparator: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  profileButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
  },
  editButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  editButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  adminButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 24,
    backgroundColor: colors.primary,
  },
  adminButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  logoutButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  bioText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  tabContent: {
    padding: 16,
  },
  adCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  adImageReal: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: colors.gray[200],
  },
  adCardContent: {
    padding: 12,
  },
  adTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  adDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  mediaItem: {
    width: '32%',
    aspectRatio: 1,
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.gray[200],
  },
  playIconOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -15 }, { translateY: -15 }],
  },
  contentCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    flexDirection: 'row',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  contentThumbnailImg: {
    width: 72,
    height: 72,
    borderRadius: 10,
    backgroundColor: colors.gray[200],
  },
  contentDetails: {
    flex: 1,
    gap: 4,
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contentLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  contentValue: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  // Siparis stilleri
  emptyOrderContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyOrderText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 12,
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
    width: 72,
    height: 72,
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
  orderPanel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  orderBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  orderStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  orderStatusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  orderPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
});

export default ProfileScreen;
