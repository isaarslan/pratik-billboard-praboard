import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

const DISTRICTS = [
  'Ayaş',
  'Bala',
  'Beypazarı',
  'Çamlıdere',
  'Çankaya',
  'Çubuk',
  'Elmadağ',
  'Etimesgut',
  'Evren',
  'Gölbaşı',
  'Güdül',
  'Haymana',
  'Kahramankazan',
  'Kalecik',
  'Keçiören',
  'Kızılcahamam',
  'Mamak',
  'Nallıhan',
  'Polatlı',
  'Pursaklar',
  'Sincan',
  'Şereflikoçhisar',
  'Yenimahalle',
];

const LocationSelectScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');

  const filteredDistricts = DISTRICTS.filter((district) =>
    district.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSelectDistrict = (district) => {
    // In real app, would set location context here
    navigation.goBack();
  };

  const renderDistrictItem = ({ item }) => (
    <TouchableOpacity
      style={styles.districtItem}
      onPress={() => handleSelectDistrict(item)}
    >
      <Text style={styles.districtText}>
        {item}, Ankara
      </Text>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Lütfen konumunuzu seçin.</Text>

        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color={colors.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Lokasyon ara"
            placeholderTextColor={colors.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <FlatList
          data={filteredDistricts}
          keyExtractor={(item) => item}
          renderItem={renderDistrictItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 20,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
    backgroundColor: colors.white,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: colors.text,
  },
  listContent: {
    paddingBottom: 20,
  },
  districtItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  districtText: {
    fontSize: 16,
    color: colors.text,
  },
});

export default LocationSelectScreen;
