import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('reklamlar');

  // Mock data for ads
  const mockAds = [
    { id: '1', title: 'Premium Billboard Ad', date: '15 Ocak 2026' },
    { id: '2', title: 'City Center Display', date: '10 Ocak 2026' },
    { id: '3', title: 'Highway Billboard', date: '5 Ocak 2026' },
  ];

  // Mock data for liked ads
  const mockLikedAds = [
    { id: '1', title: 'Favorite Billboard', date: '20 Ocak 2026' },
    { id: '2', title: 'Popular Display Ad', date: '18 Ocak 2026' },
  ];

  // Mock data for content
  const mockContent = [
    {
      id: '1',
      title: 'Premium Billboard Ad',
      totalDays: '30',
      adDuration: '15 gün',
      publishDate: '15 Ocak 2026',
    },
    {
      id: '2',
      title: 'City Center Display',
      totalDays: '45',
      adDuration: '20 gün',
      publishDate: '10 Ocak 2026',
    },
  ];

  const renderAdCard = ({ item }) => (
    <View style={styles.adCard}>
      <View style={styles.adImagePlaceholder}>
        <Ionicons name="image-outline" size={40} color={colors.textSecondary} />
      </View>
      <View style={styles.adCardContent}>
        <Text style={styles.adTitle}>{item.title}</Text>
        <Text style={styles.adDate}>{item.date}</Text>
      </View>
    </View>
  );

  const renderMediaGrid = () => {
    const mediaItems = Array(6).fill(null);
    return (
      <View style={styles.mediaGrid}>
        {mediaItems.map((_, index) => (
          <View key={index} style={styles.mediaItem}>
            <View style={styles.mediaPlaceholder}>
              <Ionicons name="image-outline" size={30} color={colors.textSecondary} />
            </View>
            {index % 3 === 0 && (
              <View style={styles.playIconOverlay}>
                <Ionicons name="play-circle" size={30} color={colors.white} />
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderContentItem = ({ item }) => (
    <View style={styles.contentCard}>
      <View style={styles.contentThumbnail}>
        <Ionicons name="image-outline" size={24} color={colors.textSecondary} />
      </View>
      <View style={styles.contentDetails}>
        <View style={styles.contentRow}>
          <Text style={styles.contentLabel}>Reklam Başlığı:</Text>
          <Text style={styles.contentValue}>{item.title}</Text>
        </View>
        <View style={styles.contentRow}>
          <Text style={styles.contentLabel}>Toplam Gün:</Text>
          <Text style={styles.contentValue}>{item.totalDays}</Text>
        </View>
        <View style={styles.contentRow}>
          <Text style={styles.contentLabel}>Reklam Süresi:</Text>
          <Text style={styles.contentValue}>{item.adDuration}</Text>
        </View>
        <View style={styles.contentRow}>
          <Text style={styles.contentLabel}>Yayınlama Tarihi:</Text>
          <Text style={styles.contentValue}>{item.publishDate}</Text>
        </View>
      </View>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'reklamlar':
        return (
          <FlatList
            data={mockAds}
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
            data={mockContent}
            renderItem={renderContentItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.tabContent}
            scrollEnabled={false}
          />
        );
      case 'begenilenler':
        return (
          <FlatList
            data={mockLikedAds}
            renderItem={renderAdCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.tabContent}
            scrollEnabled={false}
          />
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
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="settings-outline" size={24} color={colors.white} />
              </TouchableOpacity>
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
              <Text style={styles.name}>Günay Akay</Text>
              <View style={styles.goldBadge}>
                <Text style={styles.goldBadgeText}>P</Text>
              </View>
            </View>
            <Text style={styles.username}>@gunayakay</Text>

            <View style={styles.statsRow}>
              <Text style={styles.statsText}>16 Reklam</Text>
              <Text style={styles.statsSeparator}>|</Text>
              <Text style={styles.statsText}>1 Takip edilen</Text>
              <Text style={styles.statsSeparator}>|</Text>
              <Text style={styles.statsText}>1.2M Takipçi</Text>
            </View>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <Text style={styles.editButtonText}>Profili düzenle</Text>
            </TouchableOpacity>
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
  editButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.primary,
    alignSelf: 'center',
  },
  editButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
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
    fontSize: 14,
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
  adImagePlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
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
    width: (width - 40) / 3,
    height: (width - 40) / 3,
    position: 'relative',
  },
  mediaPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
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
  contentThumbnail: {
    width: 60,
    height: 60,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default ProfileScreen;
