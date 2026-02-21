import React from 'react';
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

const HomeScreen = ({ navigation }) => {
  const { allAds } = useAds();
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

      {/* Image */}
      <View style={styles.adImageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.adImage}
          resizeMode="cover"
        />
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
        data={allAds}
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
  },
  adImage: {
    width: '100%',
    aspectRatio: 4 / 3,
    backgroundColor: colors.gray[200],
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
