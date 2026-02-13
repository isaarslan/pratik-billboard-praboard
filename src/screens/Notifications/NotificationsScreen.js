import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

const NOTIFICATIONS = [
  {
    id: '1',
    type: 'like',
    icon: 'heart',
    iconColor: '#E74C3C',
    iconBg: '#FDEDEE',
    title: 'Reklamın beğenildi!',
    body: 'Ahmet Yılmaz "Premium Billboard" reklamını beğendi.',
    time: '2 dakika önce',
    unread: true,
  },
  {
    id: '2',
    type: 'follow',
    icon: 'person-add',
    iconColor: colors.primary,
    iconBg: '#EBF0FF',
    title: 'Yeni takipçi',
    body: 'Sıla Torun seni takip etmeye başladı.',
    time: '15 dakika önce',
    unread: true,
  },
  {
    id: '3',
    type: 'ad_live',
    icon: 'megaphone',
    iconColor: '#27AE60',
    iconBg: '#E8F8EF',
    title: 'Reklamın yayında!',
    body: '"Kızılay Meydanı Billboard" reklamın şu anda yayında. Tebrikler!',
    time: '1 saat önce',
    unread: true,
  },
  {
    id: '4',
    type: 'payment',
    icon: 'card',
    iconColor: '#8E44AD',
    iconBg: '#F4ECF7',
    title: 'Ödeme onaylandı',
    body: '3.498 TL tutarındaki ödemeniz başarıyla gerçekleştirildi.',
    time: '3 saat önce',
    unread: false,
  },
  {
    id: '5',
    type: 'share',
    icon: 'share-social',
    iconColor: '#2980B9',
    iconBg: '#EBF5FB',
    title: 'Reklamın paylaşıldı',
    body: 'Mehmet Kaya "Tunalı Hilmi Billboard" reklamını paylaştı.',
    time: '5 saat önce',
    unread: false,
  },
  {
    id: '6',
    type: 'ad_end',
    icon: 'time',
    iconColor: '#E67E22',
    iconBg: '#FEF5E7',
    title: 'Reklam süresi bitiyor',
    body: '"Ulus Meydanı Billboard" reklamının süresi 2 gün sonra doluyor.',
    time: '8 saat önce',
    unread: false,
  },
  {
    id: '7',
    type: 'like',
    icon: 'heart',
    iconColor: '#E74C3C',
    iconBg: '#FDEDEE',
    title: '45 yeni beğeni',
    body: '"Kızılay Meydanı Billboard" reklamın bugün 45 yeni beğeni aldı.',
    time: '12 saat önce',
    unread: false,
  },
  {
    id: '8',
    type: 'system',
    icon: 'information-circle',
    iconColor: colors.primary,
    iconBg: '#EBF0FF',
    title: 'Praboard\'a hoş geldin!',
    body: 'Profilini tamamla ve ilk reklamını oluşturmaya başla.',
    time: '1 gün önce',
    unread: false,
  },
];

const NotificationsScreen = () => {
  const renderNotification = ({ item }) => (
    <TouchableOpacity
      style={[styles.notifCard, item.unread && styles.notifCardUnread]}
      activeOpacity={0.7}
    >
      <View style={[styles.iconCircle, { backgroundColor: item.iconBg }]}>
        <Ionicons name={item.icon} size={22} color={item.iconColor} />
      </View>
      <View style={styles.notifContent}>
        <View style={styles.notifHeader}>
          <Text style={[styles.notifTitle, item.unread && styles.notifTitleUnread]}>
            {item.title}
          </Text>
          {item.unread && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.notifBody} numberOfLines={2}>{item.body}</Text>
        <Text style={styles.notifTime}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bildirimler</Text>
        <TouchableOpacity style={styles.markAllBtn}>
          <Text style={styles.markAllText}>Tümünü okundu işaretle</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={NOTIFICATIONS}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    backgroundColor: colors.white,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  markAllBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: colors.gray[100],
  },
  markAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  listContent: {
    paddingVertical: 8,
  },
  notifCard: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  notifCardUnread: {
    backgroundColor: '#F0F4FF',
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notifContent: {
    flex: 1,
  },
  notifHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notifTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  notifTitleUnread: {
    fontWeight: '800',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginLeft: 8,
  },
  notifBody: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginTop: 4,
  },
  notifTime: {
    fontSize: 12,
    color: colors.gray[400],
    marginTop: 6,
  },
});

export default NotificationsScreen;
