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

const MOCK_ADS = [
  {
    id: '1',
    user: 'Ahmet Yılmaz',
    username: 'ahmetyilmaz',
    time: '7 gün önce',
    location: 'Gölbaşı, Ankara',
    likes: '2.345',
    shares: '117',
    description:
      'Yeni sezon indirimlerimiz başladı! Tüm ürünlerde %50ye varan fırsatları kaçırmayın.',
    image: 'https://picsum.photos/seed/ad1/600/400',
  },
  {
    id: '2',
    user: 'Sıla Torun',
    username: 'silatorun',
    time: '3 gün önce',
    location: 'Çankaya, Ankara',
    likes: '1.203',
    shares: '89',
    description: 'Hafta sonu etkinliğimize herkesi bekliyoruz!',
    image: 'https://picsum.photos/seed/ad2/600/400',
  },
  {
    id: '3',
    user: 'Mehmet Kaya',
    username: 'mehmetkaya',
    time: '1 gün önce',
    location: 'Etimesgut, Ankara',
    likes: '567',
    shares: '34',
    description: 'Yeni açılan şubemize özel kampanyalar devam ediyor.',
    image: 'https://picsum.photos/seed/ad3/600/400',
  },
  {
    id: '4',
    user: 'Elif Demir',
    username: 'elifdemir',
    time: '5 saat önce',
    location: 'Keçiören, Ankara',
    likes: '890',
    shares: '56',
    description: 'Doğa yürüyüşü etkinliğimiz bu cumartesi! Katılım ücretsiz.',
    image: 'https://picsum.photos/seed/ad4/600/400',
  },
  {
    id: '5',
    user: 'Can Özkan',
    username: 'canozkan',
    time: '2 saat önce',
    location: 'Mamak, Ankara',
    likes: '432',
    shares: '21',
    description: 'Teknoloji fuarı için son kayıt tarihi yarın!',
    image: 'https://picsum.photos/seed/ad5/600/400',
  },
];

const HomeScreen = ({ navigation }) => {
  const renderAdCard = ({ item }) => (
    <View style={styles.adCard}>
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
      </View>

      {/* Description */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>
          <Text style={styles.descriptionUsername}>{item.username}</Text>{' '}
          {item.description}
        </Text>
      </View>
    </View>
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
            <Text style={styles.nameText}>Jane Doe</Text>
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
        data={MOCK_ADS}
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
  },
  adImage: {
    width: '100%',
    height: 250,
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
