import React, { useMemo, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  useWindowDimensions,
  RefreshControl,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { useAds } from '../../context/AdContext';
import { useOrders } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import VideoPreview from '../../components/VideoPreview';
import { toggleLike, getUserLikedAdIds } from '../../services/likeService';
import { shareAd } from '../../services/shareService';


const DEMO_ADS = [
  {
    id: 'demo-1',
    user: 'Praboard Reklam',
    username: 'praboard',
    time: '2 saat önce',
    location: 'Kızılay, Ankara',
    likes: '124',
    shares: '18',
    description: 'Ankara\'nın kalbinde dijital billboard ile markanızı milyonlara ulaştırın!',
    image: 'https://picsum.photos/seed/billboard1/800/600',
    sector: 'Reklam',
    isOwn: false,
    mediaType: 'image',
    campaignDetails: 'Yeni müşterilere özel %30 indirim kampanyası devam ediyor.',
  },
  {
    id: 'demo-2',
    user: 'TechStore',
    username: 'techstore_tr',
    time: '5 saat önce',
    location: 'Çankaya, Ankara',
    likes: '89',
    shares: '7',
    description: 'Yeni sezon teknoloji ürünlerinde büyük indirimler başladı!',
    image: 'https://picsum.photos/seed/tech2/800/600',
    sector: 'Teknoloji',
    isOwn: false,
    mediaType: 'image',
    campaignDetails: '',
  },
  {
    id: 'demo-3',
    user: 'Cafe Ankara',
    username: 'cafeankaraofficial',
    time: '1 gün önce',
    location: 'Gölbaşı, Ankara',
    likes: '256',
    shares: '34',
    description: 'Billboard reklamımız ile yeni şubemizi duyuruyoruz! Açılışa özel kampanyaları kaçırmayın.',
    image: 'https://picsum.photos/seed/cafe3/800/600',
    sector: 'Yeme-İçme',
    isOwn: false,
    mediaType: 'image',
    campaignDetails: 'Açılış haftası tüm içeceklerde %50 indirim!',
  },
  {
    id: 'demo-4',
    user: 'SporsalTR',
    username: 'sporsaltr',
    time: '2 gün önce',
    location: 'Eryaman, Ankara',
    likes: '67',
    shares: '5',
    description: 'Spor salonu üyeliklerinde yılbaşı kampanyası! Billboard ile binlerce kişiye ulaştık.',
    image: 'https://picsum.photos/seed/sport4/800/600',
    sector: 'Spor',
    isOwn: false,
    mediaType: 'image',
    campaignDetails: '',
  },
  {
    id: 'demo-video-1',
    user: 'Praboard Demo',
    username: 'praboard_demo',
    time: '3 saat önce',
    location: 'Kızılay, Ankara',
    likes: '312',
    shares: '45',
    description: 'Video reklam örneği - dijital billboard panolarımızda video reklamlar da yayınlayabilirsiniz!',
    image: 'https://www.w3schools.com/html/mov_bbb.mp4',
    sector: 'Tanıtım',
    isOwn: false,
    mediaType: 'video',
    campaignDetails: 'Video reklamlar artık Praboard\'da! Hemen deneyin.',
  },
  {
    id: 'demo-5',
    user: 'EmlakPlus',
    username: 'emlakplus',
    time: '3 gün önce',
    location: 'Batıkent, Ankara',
    likes: '45',
    shares: '12',
    description: 'Yeni konut projemizi billboard ile tanıttık. Satışlar rekor kırdı!',
    image: 'https://picsum.photos/seed/emlak5/800/600',
    sector: 'Emlak',
    isOwn: false,
    mediaType: 'image',
    campaignDetails: 'Lansman dönemi özel fiyatlar ile ev sahibi olun.',
  },
];

function getTimeAgo(dateStr) {
  if (!dateStr) return '';
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Az önce';
  if (diffMin < 60) return `${diffMin} dk önce`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} saat önce`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 30) return `${diffDay} gün önce`;
  const diffMonth = Math.floor(diffDay / 30);
  return `${diffMonth} ay önce`;
}

function orderToAd(order) {
  return {
    id: `order-${order.id}`,
    user: order.adTitle,
    username: 'praboard',
    time: getTimeAgo(order.createdAt),
    location: order.panel?.location || 'Ankara',
    likes: '0',
    shares: '0',
    description: order.campaignDetails || order.adTitle,
    image: order.adImage,
    sector: 'Reklam',
    isOwn: false,
    mediaType: order.mediaType || 'image',
    campaignDetails: order.campaignDetails || '',
  };
}

const WEB_BREAKPOINT = 768;

const HomeScreen = ({ navigation }) => {
  const { allAds } = useAds();
  const { orders } = useOrders();
  const { profile } = useAuth();
  const { width } = useWindowDimensions();

  const isWebWide = Platform.OS === 'web' && width >= WEB_BREAKPOINT;
  const [refreshing, setRefreshing] = useState(false);
  const [likedAds, setLikedAds] = useState({});
  const [likeCounts, setLikeCounts] = useState({});
  const [shareToast, setShareToast] = useState(false);

  // Kullanıcının beğenilerini yükle
  useEffect(() => {
    if (!profile?.id) return;
    getUserLikedAdIds(profile.id).then((ids) => {
      const map = {};
      ids.forEach((id) => { map[id] = true; });
      setLikedAds(map);
    });
  }, [profile?.id]);

  const handleLike = useCallback(async (adId) => {
    if (!profile?.id) return;

    // Optimistic update
    const wasLiked = likedAds[adId];
    setLikedAds((prev) => ({ ...prev, [adId]: !wasLiked }));
    setLikeCounts((prev) => ({
      ...prev,
      [adId]: (prev[adId] || 0) + (wasLiked ? -1 : 1),
    }));

    const { error } = await toggleLike(profile.id, adId);
    if (error) {
      // Hata olursa geri al
      setLikedAds((prev) => ({ ...prev, [adId]: wasLiked }));
      setLikeCounts((prev) => ({
        ...prev,
        [adId]: (prev[adId] || 0) + (wasLiked ? 1 : -1),
      }));
    }
  }, [profile?.id, likedAds]);

  const handleShare = useCallback(async (item) => {
    const result = await shareAd(profile?.id, item);
    if (result.shared) {
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2000);
    }
  }, [profile?.id]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (profile?.id) {
      getUserLikedAdIds(profile.id).then((ids) => {
        const map = {};
        ids.forEach((id) => { map[id] = true; });
        setLikedAds(map);
      });
    }
    setTimeout(() => setRefreshing(false), 1200);
  }, [profile?.id]);

  const feedData = useMemo(() => {
    const approvedAds = orders
      .filter((o) => o.status === 'hazirlaniyor' || o.status === 'live')
      .map(orderToAd);
    const userContent = [...approvedAds, ...allAds];
    // Kullanıcı içeriği yoksa demo veriler göster
    return userContent.length > 0 ? userContent : DEMO_ADS;
  }, [orders, allAds]);

  const renderAdCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.adCard, isWebWide && styles.adCardWeb]}
      onPress={() => navigation.navigate('AdDetail', item)}
      activeOpacity={0.8}
    >
      {/* Header */}
      <View style={styles.adHeader}>
        <View style={styles.adHeaderLeft}>
          <View style={styles.profileCircle}>
            <Ionicons name="person" size={24} color={colors.gray[400]} />
          </View>
          <View style={styles.adHeaderInfo}>
            <Text style={styles.adUserName}>{item.user}</Text>
            <View style={styles.adMetaRow}>
              <Text style={styles.adMetaText}>{item.time}</Text>
              <Text style={styles.adMetaText}> • </Text>
              <Text style={styles.adMetaText}>{item.location}</Text>
            </View>
          </View>
        </View>
        <View style={styles.adHeaderRight}>
          <TouchableOpacity style={styles.followButton}>
            <Text style={styles.followButtonText}>Takip Et</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="ellipsis-vertical" size={20} color={colors.gray[600]} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Image / Video */}
      <View style={styles.adImageContainer}>
        {item.mediaType === 'video' ? (
          <>
            <VideoPreview uri={item.image} style={styles.adImage} />
            <View style={styles.videoBadge}>
              <Ionicons name="videocam" size={12} color={colors.white} />
              <Text style={styles.videoBadgeText}>Video</Text>
            </View>
          </>
        ) : (
          <Image
            source={{ uri: item.image }}
            style={styles.adImage}
            resizeMode="cover"
          />
        )}
      </View>

      {/* Interaction Row */}
      <View style={styles.interactionRow}>
        <TouchableOpacity
          style={styles.interactionItem}
          onPress={() => handleLike(item.id)}
          activeOpacity={0.6}
        >
          <Ionicons
            name={likedAds[item.id] ? 'heart' : 'heart-outline'}
            size={24}
            color={likedAds[item.id] ? colors.primary : colors.gray[700]}
          />
          <Text style={[styles.interactionText, likedAds[item.id] && { color: colors.primary }]}>
            {(parseInt(item.likes) || 0) + (likeCounts[item.id] || 0)}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.interactionItem}
          onPress={() => handleShare(item)}
          activeOpacity={0.6}
        >
          <Ionicons name="share-outline" size={24} color={colors.gray[700]} />
          <Text style={styles.interactionText}>{item.shares}</Text>
        </TouchableOpacity>
        {item.campaignDetails ? (
          <View style={styles.interactionItem}>
            <Ionicons name="megaphone-outline" size={22} color={colors.primary} />
            <Text style={styles.campaignBadgeText}>Detay</Text>
          </View>
        ) : null}
      </View>

      {/* Description */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>
          <Text style={styles.descriptionUsername}>{item.username}</Text>{' '}
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Web header for wide screens
  const renderWebHeader = () => (
    <View style={styles.webHeader}>
      <View style={styles.webHeaderInner}>
        <View>
          <Text style={styles.webGreeting}>
            Merhaba, {profile?.full_name || 'Kullanıcı'}
          </Text>
          <Text style={styles.webSubGreeting}>
            Reklam akışını keşfet
          </Text>
        </View>
        <View style={styles.webHeaderActions}>
          <TouchableOpacity
            style={styles.webLocationPill}
            onPress={() => navigation.navigate('LocationSelect')}
          >
            <Ionicons name="location" size={16} color={colors.primary} />
            <Text style={styles.webLocationText}>Gölbaşı, Ankara</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.webFilterBtn}
            onPress={() => navigation.navigate('Filter')}
          >
            <Ionicons name="options" size={20} color={colors.gray[600]} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Mobile header
  const renderMobileHeader = () => (
    <>
      <View style={styles.topSection}>
        <View style={styles.topLeft}>
          <View style={styles.profileCircleLg}>
            <Ionicons name="person" size={24} color={colors.gray[400]} />
          </View>
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>Merhaba</Text>
            <Text style={styles.nameText}>{profile?.full_name || 'Kullanıcı'}</Text>
          </View>
        </View>
        <View style={styles.topRight}>
          <View style={styles.praboardPlusIcon}>
            <Text style={styles.praboardPlusText}>P+</Text>
          </View>
        </View>
      </View>

      <View style={styles.locationBar}>
        <TouchableOpacity
          style={styles.locationPill}
          onPress={() => navigation.navigate('LocationSelect')}
        >
          <Ionicons name="location" size={18} color={colors.gray[700]} />
          <Text style={styles.locationText}>Gölbaşı, Ankara</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => navigation.navigate('Filter')}
        >
          <Ionicons name="options" size={24} color={colors.gray[700]} />
        </TouchableOpacity>
      </View>
    </>
  );

  if (isWebWide) {
    return (
      <View style={styles.webContainer}>
        {renderWebHeader()}
        <View style={styles.webFeedContainer}>
          <FlatList
            data={feedData}
            renderItem={renderAdCard}
            keyExtractor={(item) => item.id}
            style={{ flex: 1 }}
            contentContainerStyle={styles.webFeedContent}
            showsVerticalScrollIndicator={false}
            numColumns={width >= 1200 ? 2 : 1}
            key={width >= 1200 ? 'grid-2' : 'grid-1'}
            columnWrapperStyle={width >= 1200 ? styles.webGridRow : undefined}
          />
        </View>
        {shareToast && (
          <View style={styles.shareToast}>
            <Ionicons name="checkmark-circle" size={18} color={colors.white} />
            <Text style={styles.shareToastText}>Link kopyalandı!</Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {renderMobileHeader()}
      <FlatList
        data={feedData}
        renderItem={renderAdCard}
        keyExtractor={(item) => item.id}
        style={{ flex: 1 }}
        contentContainerStyle={styles.feedContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />
      {/* Share Toast */}
      {shareToast && (
        <View style={styles.shareToast}>
          <Ionicons name="checkmark-circle" size={18} color={colors.white} />
          <Text style={styles.shareToastText}>Link kopyalandı!</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // === Mobile styles ===
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  topLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileCircleLg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  greetingContainer: {
    marginLeft: 12,
  },
  greetingText: {
    fontSize: 14,
    color: colors.gray[600],
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.gray[900],
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  locationText: {
    fontSize: 14,
    color: colors.gray[700],
    marginLeft: 6,
  },
  filterButton: {
    padding: 8,
  },
  feedContainer: {
    paddingBottom: 16,
  },

  // === Web styles ===
  webContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  webHeader: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    paddingHorizontal: 32,
    paddingVertical: 20,
  },
  webHeaderInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: 1200,
  },
  webGreeting: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.gray[900],
  },
  webSubGreeting: {
    fontSize: 14,
    color: colors.gray[500],
    marginTop: 4,
  },
  webHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  webLocationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 75, 75, 0.08)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 75, 75, 0.2)',
  },
  webLocationText: {
    fontSize: 14,
    color: colors.gray[700],
    marginLeft: 6,
    fontWeight: '500',
  },
  webFilterBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  webFeedContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  webFeedContent: {
    paddingBottom: 32,
    maxWidth: 1200,
  },
  webGridRow: {
    gap: 20,
  },

  // === Ad Card ===
  adCard: {
    backgroundColor: colors.white,
    marginTop: 16,
    borderBottomWidth: 8,
    borderBottomColor: colors.gray[100],
  },
  adCardWeb: {
    borderRadius: 16,
    borderBottomWidth: 0,
    marginBottom: 20,
    marginTop: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden',
    flex: 1,
    maxWidth: 580,
  },
  adHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  adHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  praboardPlusIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  praboardPlusText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.white,
  },
  adHeaderInfo: {
    marginLeft: 10,
    flex: 1,
  },
  adUserName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.gray[900],
  },
  adMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  adMetaText: {
    fontSize: 12,
    color: colors.gray[600],
  },
  adHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  followButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginRight: 8,
  },
  followButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  menuButton: {
    padding: 4,
  },
  adImageContainer: {
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  adImage: {
    width: '100%',
    aspectRatio: 4 / 3,
    backgroundColor: colors.gray[200],
  },
  videoBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  videoBadgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '600',
  },
  interactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  interactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  interactionText: {
    fontSize: 14,
    color: colors.gray[700],
    marginLeft: 6,
  },
  campaignBadgeText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
  descriptionContainer: {
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  descriptionText: {
    fontSize: 14,
    color: colors.gray[700],
    lineHeight: 20,
  },
  descriptionUsername: {
    fontWeight: 'bold',
    color: colors.gray[900],
  },
  shareToast: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[900],
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  shareToastText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default HomeScreen;
