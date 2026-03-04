import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import BackHeader from '../../components/BackHeader';
import VideoPreview from '../../components/VideoPreview';

const WEB_BREAKPOINT = 768;

export default function AdDetailScreen({ navigation }) {
  const ad = navigation.currentRoute.params || {};
  const { width } = useWindowDimensions();
  const isWebWide = Platform.OS === 'web' && width >= WEB_BREAKPOINT;

  const heroContent = ad.mediaType === 'video' ? (
    <View style={styles.heroVideoContainer}>
      <VideoPreview uri={ad.image} style={[styles.heroImage, isWebWide && styles.heroImageWeb]} />
      <View style={styles.heroVideoBadge}>
        <Ionicons name="videocam" size={14} color={colors.white} />
        <Text style={styles.heroVideoBadgeText}>Video Reklam</Text>
      </View>
    </View>
  ) : (
    <Image
      source={{ uri: ad.image || 'https://picsum.photos/seed/detail/800/500' }}
      style={[styles.heroImage, isWebWide && styles.heroImageWeb]}
      resizeMode="cover"
    />
  );

  const detailContent = (
    <View style={[styles.content, isWebWide && styles.contentWeb]}>
      <Text style={[styles.adTitle, isWebWide && styles.adTitleWeb]}>
        {ad.description || 'Reklam detayı'}
      </Text>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Ionicons name="heart" size={16} color={colors.primary} />
          <Text style={styles.statText}>{ad.likes || '0'} kişi beğendi</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="location" size={16} color={colors.primary} />
          <Text style={styles.statText}>{ad.location || 'Gölbaşı, Ankara'}</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="share-social" size={16} color={colors.primary} />
          <Text style={styles.statText}>{ad.shares || '0'} kişi paylaştı</Text>
        </View>
      </View>

      <View style={styles.plusBadge}>
        <View style={styles.plusIcon}>
          <Text style={styles.plusIconText}>P+</Text>
        </View>
        <View>
          <Text style={styles.plusTitle}>Praboard Plus</Text>
          <Text style={styles.plusDesc}>Bu reklam Praboard Plus üyesi tarafından verilmiştir.</Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Yayın Tarihi</Text>
          <Text style={styles.infoValue}>{ad.time || '14 Eylül 2024'}</Text>
        </View>
        <View style={styles.infoDivider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Sektör</Text>
          <Text style={styles.infoValue}>{ad.sector || 'Genel'}</Text>
        </View>
      </View>

      <View style={styles.descriptionCard}>
        <Text style={styles.descriptionTitle}>Açıklama</Text>
        <Text style={styles.descriptionText}>
          {ad.description || 'Bu reklam hakkında detaylı bilgi bulunmuyor.'}
        </Text>
      </View>

      {ad.campaignDetails ? (
        <View style={styles.campaignDetailsCard}>
          <View style={styles.campaignDetailsHeader}>
            <View style={styles.campaignDetailsIcon}>
              <Ionicons name="megaphone" size={18} color={colors.primary} />
            </View>
            <Text style={styles.campaignDetailsTitle}>Kampanya Detayı</Text>
          </View>
          <Text style={styles.campaignDetailsText}>{ad.campaignDetails}</Text>
          <View style={styles.campaignDetailsBadge}>
            <Ionicons name="shield-checkmark" size={14} color={colors.primary} />
            <Text style={styles.campaignDetailsBadgeText}>Reklam veren tarafından eklendi</Text>
          </View>
        </View>
      ) : null}
    </View>
  );

  // Web wide: hero sol, detail sağ (side by side)
  if (isWebWide) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <BackHeader title="" onBack={() => navigation.goBack()} />
        <View style={styles.webSplitLayout}>
          <View style={styles.webHeroSection}>
            {heroContent}
          </View>
          <ScrollView style={styles.webDetailSection} showsVerticalScrollIndicator={false}>
            {detailContent}

            {/* Bottom Bar inline on web */}
            <View style={styles.bottomBarWeb}>
              <View style={styles.bottomLeft}>
                <View style={styles.bottomAvatar}>
                  <Ionicons name="person" size={20} color={colors.gray[400]} />
                </View>
                <View>
                  <Text style={styles.bottomName}>{ad.user || 'Kullanıcı'}</Text>
                  <Text style={styles.bottomUsername}>@{ad.username || 'kullanici'}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.followBtn} activeOpacity={0.7}>
                <Text style={styles.followBtnText}>Takip Et</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <BackHeader title="" onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {heroContent}
        {detailContent}
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.bottomLeft}>
          <View style={styles.bottomAvatar}>
            <Ionicons name="person" size={20} color={colors.gray[400]} />
          </View>
          <View>
            <Text style={styles.bottomName}>{ad.user || 'Kullanıcı'}</Text>
            <Text style={styles.bottomUsername}>@{ad.username || 'kullanici'}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.followBtn} activeOpacity={0.7}>
          <Text style={styles.followBtnText}>Takip Et</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  heroImage: {
    width: '100%',
    aspectRatio: 4 / 3,
    backgroundColor: colors.gray[200],
  },
  heroImageWeb: {
    aspectRatio: undefined,
    height: '100%',
    borderRadius: 12,
  },
  heroVideoContainer: {
    position: 'relative',
    flex: 1,
  },
  heroVideoBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  heroVideoBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  contentWeb: {
    paddingHorizontal: 28,
    paddingVertical: 24,
  },
  adTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.gray[900],
    lineHeight: 30,
    marginBottom: 16,
  },
  adTitleWeb: {
    fontSize: 26,
    lineHeight: 34,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 13,
    color: colors.gray[600],
  },
  plusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    gap: 12,
  },
  plusIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIconText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.white,
  },
  plusTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.gray[900],
  },
  plusDesc: {
    fontSize: 12,
    color: colors.gray[600],
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: colors.gray[100],
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.gray[500],
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[900],
  },
  infoDivider: {
    height: 1,
    backgroundColor: colors.gray[200],
  },
  descriptionCard: {
    marginBottom: 20,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: colors.gray[600],
    lineHeight: 22,
  },
  campaignDetailsCard: {
    backgroundColor: '#FFF5F5',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  campaignDetailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  campaignDetailsIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FECACA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  campaignDetailsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.gray[900],
  },
  campaignDetailsText: {
    fontSize: 14,
    color: colors.gray[700],
    lineHeight: 22,
    marginBottom: 12,
  },
  campaignDetailsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF0F0',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  campaignDetailsBadgeText: {
    fontSize: 11,
    color: colors.primaryDark,
    fontWeight: '600',
  },
  // Web split layout
  webSplitLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  webHeroSection: {
    flex: 1,
    padding: 20,
  },
  webDetailSection: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: colors.gray[200],
  },
  bottomBarWeb: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    marginTop: 8,
  },
  // Mobile bottom bar
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    backgroundColor: colors.white,
  },
  bottomLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bottomAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.gray[900],
  },
  bottomUsername: {
    fontSize: 12,
    color: colors.gray[500],
  },
  followBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  followBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
