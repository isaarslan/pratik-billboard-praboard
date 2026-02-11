import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

const MOCK_PANELS = [
  {
    id: '1',
    name: 'Kızılay Meydanı',
    location: 'Kızılay, Ankara',
    size: '3m x 6m',
    price: '1.166 TL/gün',
    status: 'Müsait',
    image: 'https://picsum.photos/seed/panel1/400/250',
  },
  {
    id: '2',
    name: 'Tunalı Hilmi Caddesi',
    location: 'Çankaya, Ankara',
    size: '4m x 8m',
    price: '2.350 TL/gün',
    status: 'Müsait',
    image: 'https://picsum.photos/seed/panel2/400/250',
  },
  {
    id: '3',
    name: 'Ulus Meydanı',
    location: 'Altındağ, Ankara',
    size: '2.5m x 5m',
    price: '890 TL/gün',
    status: 'Dolu',
    image: 'https://picsum.photos/seed/panel3/400/250',
  },
  {
    id: '4',
    name: 'Bahçelievler AVM Girişi',
    location: 'Çankaya, Ankara',
    size: '3m x 4m',
    price: '1.500 TL/gün',
    status: 'Müsait',
    image: 'https://picsum.photos/seed/panel4/400/250',
  },
  {
    id: '5',
    name: 'Batıkent Metro Çıkışı',
    location: 'Yenimahalle, Ankara',
    size: '2m x 4m',
    price: '750 TL/gün',
    status: 'Müsait',
    image: 'https://picsum.photos/seed/panel5/400/250',
  },
  {
    id: '6',
    name: 'Gölbaşı Sahil Yolu',
    location: 'Gölbaşı, Ankara',
    size: '3m x 6m',
    price: '1.050 TL/gün',
    status: 'Dolu',
    image: 'https://picsum.photos/seed/panel6/400/250',
  },
];

export default function PanelsScreen() {
  const renderPanel = ({ item }) => {
    const isAvailable = item.status === 'Müsait';

    return (
      <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
        <View style={styles.cardBody}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardName}>{item.name}</Text>
            <View style={[styles.statusBadge, isAvailable ? styles.statusAvailable : styles.statusFull]}>
              <Text style={[styles.statusText, isAvailable ? styles.statusTextAvailable : styles.statusTextFull]}>
                {item.status}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={16} color={colors.gray[500]} />
            <Text style={styles.infoText}>{item.location}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="resize-outline" size={16} color={colors.gray[500]} />
            <Text style={styles.infoText}>{item.size}</Text>
          </View>

          <View style={styles.cardFooter}>
            <Text style={styles.priceText}>{item.price}</Text>
            {isAvailable && (
              <TouchableOpacity style={styles.rentButton} activeOpacity={0.7}>
                <Text style={styles.rentButtonText}>Kirala</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Panolar</Text>
        <Text style={styles.subtitle}>Yakınındaki billboard panolarını keşfet</Text>
      </View>

      <FlatList
        data={MOCK_PANELS}
        renderItem={renderPanel}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.gray[900],
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray[500],
    marginTop: 4,
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 160,
    backgroundColor: colors.gray[200],
  },
  cardBody: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.gray[900],
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusAvailable: {
    backgroundColor: '#E8F5E9',
  },
  statusFull: {
    backgroundColor: '#FFF3E0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextAvailable: {
    color: '#2E7D32',
  },
  statusTextFull: {
    color: '#E65100',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: colors.gray[600],
    marginLeft: 6,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  rentButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  rentButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
