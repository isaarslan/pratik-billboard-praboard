import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import BillboardDetailModal from '../../components/BillboardDetailModal';
import WebMap from '../../components/WebMap';

const WEB_BREAKPOINT = 768;

const MOCK_PANELS = [
  {
    id: '1',
    name: 'Kızılay Meydanı',
    location: 'Kızılay, Ankara',
    size: '3m x 6m',
    price: '1.166 TL/gün',
    status: 'Müsait',
    image: 'https://picsum.photos/seed/panel1/400/250',
    lat: 39.9208,
    lng: 32.8541,
  },
  {
    id: '2',
    name: 'Tunalı Hilmi Caddesi',
    location: 'Çankaya, Ankara',
    size: '4m x 8m',
    price: '2.350 TL/gün',
    status: 'Müsait',
    image: 'https://picsum.photos/seed/panel2/400/250',
    lat: 39.9075,
    lng: 32.8597,
  },
  {
    id: '3',
    name: 'Ulus Meydanı',
    location: 'Altındağ, Ankara',
    size: '2.5m x 5m',
    price: '890 TL/gün',
    status: 'Dolu',
    image: 'https://picsum.photos/seed/panel3/400/250',
    lat: 39.9414,
    lng: 32.8543,
  },
  {
    id: '4',
    name: 'Bahçelievler AVM Girişi',
    location: 'Çankaya, Ankara',
    size: '3m x 4m',
    price: '1.500 TL/gün',
    status: 'Müsait',
    image: 'https://picsum.photos/seed/panel4/400/250',
    lat: 39.9220,
    lng: 32.8280,
  },
  {
    id: '5',
    name: 'Batıkent Metro Çıkışı',
    location: 'Yenimahalle, Ankara',
    size: '2m x 4m',
    price: '750 TL/gün',
    status: 'Müsait',
    image: 'https://picsum.photos/seed/panel5/400/250',
    lat: 39.9700,
    lng: 32.7300,
  },
  {
    id: '6',
    name: 'Gölbaşı Sahil Yolu',
    location: 'Gölbaşı, Ankara',
    size: '3m x 6m',
    price: '1.050 TL/gün',
    status: 'Dolu',
    image: 'https://picsum.photos/seed/panel6/400/250',
    lat: 39.7850,
    lng: 32.8040,
  },
];

export default function PanelsScreen({ navigation }) {
  const [viewMode, setViewMode] = useState('map');
  const [selectedPanel, setSelectedPanel] = useState(null);
  const { width } = useWindowDimensions();
  const isWebWide = Platform.OS === 'web' && width >= WEB_BREAKPOINT;

  const handlePanelPress = (panel) => {
    setSelectedPanel(panel);
  };

  const handleRent = () => {
    const panelData = selectedPanel;
    setSelectedPanel(null);
    navigation.navigate('AdUpload', { panel: panelData });
  };

  const mapMarkers = MOCK_PANELS.map((p) => ({
    id: p.id,
    lat: p.lat,
    lng: p.lng,
    label: p.name,
    color: p.status === 'Dolu' ? '#737373' : '#22C55E',
  }));

  const handleMarkerPress = useCallback((marker) => {
    const panel = MOCK_PANELS.find((p) => p.id === marker.id);
    if (panel) handlePanelPress(panel);
  }, []);

  // --- MAP VIEW ---
  const renderMapView = () => (
    <View style={styles.mapContainer}>
      <WebMap
        markers={mapMarkers}
        center={{ lat: 39.925, lng: 32.836 }}
        zoom={12}
        onMarkerPress={handleMarkerPress}
      />
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

  // Web wide: harita + liste yan yana
  if (isWebWide) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={[styles.header, styles.headerWeb]}>
          <View>
            <Text style={[styles.title, styles.titleWeb]}>Panolar</Text>
            <Text style={styles.subtitle}>Yakınındaki billboard panolarını keşfet</Text>
          </View>
        </View>

        <View style={styles.webSplitContainer}>
          <View style={styles.webMapSection}>
            <WebMap
              markers={mapMarkers}
              center={{ lat: 39.925, lng: 32.836 }}
              zoom={12}
              onMarkerPress={handleMarkerPress}
            />
          </View>
          <View style={styles.webListSection}>
            <FlatList
              data={MOCK_PANELS}
              renderItem={renderPanel}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.webListContent}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>

        <BillboardDetailModal
          visible={!!selectedPanel}
          panel={selectedPanel}
          onClose={() => setSelectedPanel(null)}
          onRent={handleRent}
        />
      </SafeAreaView>
    );
  }

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
    aspectRatio: 16 / 9,
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
  // Web styles
  headerWeb: {
    paddingHorizontal: 32,
    paddingVertical: 20,
  },
  titleWeb: {
    fontSize: 28,
  },
  webSplitContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  webMapSection: {
    flex: 1,
  },
  webListSection: {
    width: 400,
    borderLeftWidth: 1,
    borderLeftColor: colors.gray[200],
    backgroundColor: colors.background,
  },
  webListContent: {
    padding: 16,
    paddingBottom: 24,
  },
});
