import React, { useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { useAds } from '../../context/AdContext';
import { useOrders } from '../../context/OrderContext';
import VideoPreview from '../../components/VideoPreview';

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

const HomeScreen = ({ navigation }) => {
  const { allAds } = useAds();
  const { orders } = useOrders();

  const feedData = useMemo(() => {
    const approvedAds = orders
      .filter((o) => o.status === 'hazirlaniyor' || o.status === 'live')
      .map(orderToAd);
    return [...approvedAds, ...allAds];
  }, [orders, allAds]);
  const renderAdCard = ({ item }) => (
    <TouchableOpacity style={styles.adCard} onPress={() => navigation.navigate('AdDetail', item)} activeOpacity={0.8}>
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

      {/* Page Indicator Dots */}
      <View style={styles.pageIndicator}>
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>

      {/* Interaction Row */}
      <View style={styles.interactionRow}>
        <View style={styles.interactionItem}>
          <Ionicons name="heart-outline" size={24} color={colors.gray[700]} />
          <Text style={styles.interactionText}>{item.likes}</Text>
        </View>
        <View style={styles.interactionItem}>
          <Ionicons name="share-outline" size={24} color={colors.gray[700]} />
          <Text style={styles.interactionText}>{item.shares}</Text>
        </View>
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top Section */}
      <View style={styles.topSection}>
        <View style={styles.topLeft}>
          <View style={styles.profileCircle}>
            <Ionicons name="person" size={24} color={colors.gray[400]} />
          </View>
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>Günaydın</Text>
            <Text style={styles.nameText}>İsa Arslan</Text>
          </View>
        </View>
        <View style={styles.topRight}>
          <View style={styles.praboardPlusIcon}>
            <Text style={styles.praboardPlusText}>P+</Text>
          </View>
        </View>
      </View>

      {/* Location Bar */}
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

      {/* Feed */}
      <FlatList
        data={feedData}
        renderItem={renderAdCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.feedContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  profileCircle: {
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
  adCard: {
    backgroundColor: colors.white,
    marginTop: 16,
    borderBottomWidth: 8,
    borderBottomColor: colors.gray[100],
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
  adHeaderInfo: {
    marginLeft: 12,
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
  pageIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.gray[300],
    marginHorizontal: 3,
  },
  dotActive: {
    backgroundColor: colors.primary,
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
    paddingBottom: 12,
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
});

export default HomeScreen;
