import React, { useState } from 'react';
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
import BillboardDetailModal from '../../components/BillboardDetailModal';

const MOCK_PANELS = [
  {
    id: '1',
    name: 'Kızılay Meydanı',
    location: 'Kızılay, Ankara',
    size: '3m x 6m',
    price: '1.166 TL/gün',
    status: 'Müsait',
    image: 'https://picsum.photos/seed/panel1/400/250',
    mapX: '52%', mapY: '38%',
  },
  {
    id: '2',
    name: 'Tunalı Hilmi Caddesi',
    location: 'Çankaya, Ankara',
    size: '4m x 8m',
    price: '2.350 TL/gün',
    status: 'Müsait',
    image: 'https://picsum.photos/seed/panel2/400/250',
    mapX: '62%', mapY: '52%',
  },
  {
    id: '3',
    name: 'Ulus Meydanı',
    location: 'Altındağ, Ankara',
    size: '2.5m x 5m',
    price: '890 TL/gün',
    status: 'Dolu',
    image: 'https://picsum.photos/seed/panel3/400/250',
    mapX: '48%', mapY: '28%',
  },
  {
    id: '4',
    name: 'Bahçelievler AVM Girişi',
    location: 'Çankaya, Ankara',
    size: '3m x 4m',
    price: '1.500 TL/gün',
    status: 'Müsait',
    image: 'https://picsum.photos/seed/panel4/400/250',
    mapX: '35%', mapY: '45%',
  },
  {
    id: '5',
    name: 'Batıkent Metro Çıkışı',
    location: 'Yenimahalle, Ankara',
    size: '2m x 4m',
    price: '750 TL/gün',
    status: 'Müsait',
    image: 'https://picsum.photos/seed/panel5/400/250',
    mapX: '22%', mapY: '32%',
  },
  {
    id: '6',
    name: 'Gölbaşı Sahil Yolu',
    location: 'Gölbaşı, Ankara',
    size: '3m x 6m',
    price: '1.050 TL/gün',
    status: 'Dolu',
    image: 'https://picsum.photos/seed/panel6/400/250',
    mapX: '55%', mapY: '72%',
  },
];

export default function PanelsScreen({ navigation }) {
  const [viewMode, setViewMode] = useState('map');
  const [selectedPanel, setSelectedPanel] = useState(null);

  const handlePanelPress = (panel) => {
    setSelectedPanel(panel);
  };

  const handleRent = () => {
    setSelectedPanel(null);
    navigation.navigate('AdUpload');
  };

  // --- MAP VIEW ---
  const renderMapView = () => (
    <View style={styles.mapContainer}>
      <Image
        source={{ uri: 'https://api.mapbox.com/styles/v1/mapbox/light-v11/static/32.85,39.92,11,0/800x600@2x?access_token=placeholder' }}
        style={styles.mapFallback}
        resizeMode="cover"
      />
      {/* Map background */}
      <View style={styles.mapOverlay}>
        {/* Grid lines for map feel */}
        <View style={[styles.gridLine, { top: '25%' }]} />
        <View style={[styles.gridLine, { top: '50%' }]} />
        <View style={[styles.gridLine, { top: '75%' }]} />
        <View style={[styles.gridLineV, { left: '25%' }]} />
        <View style={[styles.gridLineV, { left: '50%' }]} />
        <View style={[styles.gridLineV, { left: '75%' }]} />

        {/* Road-like lines */}
        <View style={styles.roadH1} />
        <View style={styles.roadH2} />
        <View style={styles.roadV1} />
        <View style={styles.roadV2} />

        {/* Billboard Pins */}
        {MOCK_PANELS.map((panel) => (
          <TouchableOpacity
            key={panel.id}
            style={[styles.mapPin, { left: panel.mapX, top: panel.mapY }]}
            onPress={() => handlePanelPress(panel)}
            activeOpacity={0.7}
          >
            <View style={[styles.pinBody, panel.status === 'Dolu' && styles.pinBodyDolu]}>
              <Text style={styles.pinText}>P</Text>
            </View>
            <View style={[styles.pinTail, panel.status === 'Dolu' && styles.pinTailDolu]} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // --- LIST VIEW ---
  const renderPanel = ({ item }) => {
    const isAvailable = item.status === 'Müsait';

    return (
      <TouchableOpacity style={styles.card} onPress={() => handlePanelPress(item)} activeOpacity={0.7}>
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
              <TouchableOpacity style={styles.rentButton} activeOpacity={0.7} onPress={() => handlePanelPress(item)}>
                <Text style={styles.rentButtonText}>Kirala</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderListView = () => (
    <FlatList
      data={MOCK_PANELS}
      renderItem={renderPanel}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Panolar</Text>
          <Text style={styles.subtitle}>Yakınındaki billboard panolarını keşfet</Text>
        </View>
        <TouchableOpacity
          style={styles.viewToggle}
          onPress={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
          activeOpacity={0.7}
        >
          <Ionicons name={viewMode === 'map' ? 'list' : 'map'} size={22} color={colors.gray[700]} />
        </TouchableOpacity>
      </View>

      {viewMode === 'map' ? renderMapView() : renderListView()}

      <BillboardDetailModal
        visible={!!selectedPanel}
        panel={selectedPanel}
        onClose={() => setSelectedPanel(null)}
        onRent={handleRent}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  viewToggle: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  // MAP
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  mapFallback: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#E8EAE6',
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#E8EAE6',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#D5D8D2',
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#D5D8D2',
  },
  roadH1: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: '#CBCEC8',
  },
  roadH2: {
    position: 'absolute',
    top: '60%',
    left: '20%',
    right: '10%',
    height: 4,
    backgroundColor: '#CBCEC8',
  },
  roadV1: {
    position: 'absolute',
    left: '45%',
    top: '10%',
    bottom: '20%',
    width: 6,
    backgroundColor: '#CBCEC8',
  },
  roadV2: {
    position: 'absolute',
    left: '70%',
    top: '25%',
    bottom: '35%',
    width: 4,
    backgroundColor: '#CBCEC8',
  },
  mapPin: {
    position: 'absolute',
    alignItems: 'center',
    marginLeft: -18,
    marginTop: -42,
  },
  pinBody: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  pinBodyDolu: {
    backgroundColor: colors.gray[500],
  },
  pinText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  pinTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.primary,
    marginTop: -2,
  },
  pinTailDolu: {
    borderTopColor: colors.gray[500],
  },
  // LIST
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
