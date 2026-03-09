import React, { useState, useCallback, useEffect } from 'react';
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
import { getPanels, cleanDuplicatePanels } from '../../services/panelService';

const WEB_BREAKPOINT = 768;

const STATUS_MAP = {
  available: 'Müsait',
  full: 'Dolu',
  maintenance: 'Bakımda',
};

function formatPanel(p, index) {
  return {
    ...p,
    displayId: index + 1,
    rawPrice: p.price,
    status: STATUS_MAP[p.status] || p.status || 'Müsait',
    price: typeof p.price === 'number' ? `${p.price.toLocaleString('tr-TR')} TL/gün` : p.price,
    image: p.image || `https://picsum.photos/seed/panel${p.id}/400/250`,
  };
}

export default function PanelsScreen({ navigation }) {
  const [viewMode, setViewMode] = useState('map');
  const [selectedPanel, setSelectedPanel] = useState(null);
  const [panels, setPanels] = useState([]);
  const [loadError, setLoadError] = useState(false);
  const { width } = useWindowDimensions();
  const isWebWide = Platform.OS === 'web' && width >= WEB_BREAKPOINT;

  useEffect(() => {
    // Önce duplicate panelleri temizle, sonra listele
    cleanDuplicatePanels().then(() => {
      getPanels().then((data) => {
        if (data.length === 0) {
          setLoadError(true);
        } else {
          setLoadError(false);
          setPanels(data.map(formatPanel));
        }
      });
    });
  }, []);

  const handlePanelPress = (panel) => {
    setSelectedPanel(panel);
  };

  const handleRent = () => {
    const panelData = selectedPanel;
    setSelectedPanel(null);
    navigation.navigate('AdUpload', { panel: panelData });
  };

  const mapMarkers = panels.map((p) => ({
    id: p.id,
    lat: p.lat,
    lng: p.lng,
    label: p.name,
    color: p.status === 'Dolu' || p.status === 'Bakımda' ? '#737373' : '#FF4B4B',
  }));

  const handleMarkerPress = useCallback((marker) => {
    const panel = panels.find((p) => p.id === marker.id);
    if (panel) handlePanelPress(panel);
  }, [panels]);

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
    const isMaintenance = item.status === 'Bakımda';

    return (
      <TouchableOpacity style={styles.card} onPress={() => handlePanelPress(item)} activeOpacity={0.7}>
        <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
        <View style={styles.cardBody}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardName}>{item.name}</Text>
            <View style={[
              styles.statusBadge,
              isAvailable ? styles.statusAvailable : isMaintenance ? styles.statusMaintenance : styles.statusFull,
            ]}>
              <Text style={[
                styles.statusText,
                isAvailable ? styles.statusTextAvailable : isMaintenance ? styles.statusTextMaintenance : styles.statusTextFull,
              ]}>
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
      data={panels}
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
              data={panels}
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

      {loadError ? (
        <View style={styles.errorContainer}>
          <Ionicons name="cloud-offline-outline" size={48} color={colors.gray[400]} />
          <Text style={styles.errorTitle}>Paneller yüklenemedi</Text>
          <Text style={styles.errorText}>Lütfen internet bağlantınızı kontrol edip tekrar deneyin.</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setLoadError(false);
              getPanels().then((data) => {
                if (data.length === 0) {
                  setLoadError(true);
                } else {
                  setPanels(data.map(formatPanel));
                }
              });
            }}
          >
            <Text style={styles.retryButtonText}>Tekrar Dene</Text>
          </TouchableOpacity>
        </View>
      ) : viewMode === 'map' ? renderMapView() : renderListView()}

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
  statusMaintenance: {
    backgroundColor: '#FFEBEE',
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
  statusTextMaintenance: {
    color: '#C62828',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.gray[700],
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: colors.gray[500],
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
