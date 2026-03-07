import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import ChipSelector from '../../components/ChipSelector';
import BackHeader from '../../components/BackHeader';
import { useAds } from '../../context/AdContext';

const TOPICS = [
  'Ekonomi',
  'Tarım',
  'İş',
  'Doğa',
  'Spor',
  'Bilim',
  'Seyahat',
  'E-Ticaret',
  'Mühendislik',
  'Medya',
];

const AD_TYPES = [
  'Kampanya/Kupon',
  'Kupon',
  'İş fırsatı',
  'Duyuru/Bildirim',
  'Klasik Reklam',
  'Acil Bildirim',
];

const FilterScreen = ({ navigation }) => {
  const { filters, applyFilters, clearFilters: clearContextFilters } = useAds();
  const [searchText, setSearchText] = useState(filters.searchText || '');
  const [selectedTopics, setSelectedTopics] = useState(filters.topics || []);
  const [selectedAdTypes, setSelectedAdTypes] = useState(filters.adTypes || []);

  const toggleTopic = (topic) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const toggleAdType = (adType) => {
    if (selectedAdTypes.includes(adType)) {
      setSelectedAdTypes(selectedAdTypes.filter((t) => t !== adType));
    } else {
      setSelectedAdTypes([...selectedAdTypes, adType]);
    }
  };

  const clearFilters = () => {
    setSelectedTopics([]);
    setSelectedAdTypes([]);
    setSearchText('');
    clearContextFilters();
  };

  const handleApply = () => {
    applyFilters({
      searchText,
      topics: selectedTopics,
      adTypes: selectedAdTypes,
    });
    navigation.goBack();
  };

  const filteredTopics = TOPICS.filter((topic) =>
    topic.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title="Filtrele" onBack={() => navigation.goBack()} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color={colors.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Reklam konusu ara..."
            placeholderTextColor={colors.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Konu</Text>
          <View style={styles.chipsContainer}>
            {filteredTopics.map((topic) => (
              <ChipSelector
                key={topic}
                label={topic}
                selected={selectedTopics.includes(topic)}
                onPress={() => toggleTopic(topic)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Reklam Türü</Text>
          <View style={styles.chipsContainer}>
            {AD_TYPES.map((adType) => (
              <ChipSelector
                key={adType}
                label={adType}
                selected={selectedAdTypes.includes(adType)}
                onPress={() => toggleAdType(adType)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={clearFilters}>
          <Text style={styles.clearButton}>Filtreleri Temizle</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
          <Text style={styles.applyButtonText}>Filtrele</Text>
        </TouchableOpacity>
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
    color: colors.textPrimary,
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
    marginBottom: 24,
    backgroundColor: colors.white,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: colors.textPrimary,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },
  clearButton: {
    fontSize: 16,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  applyButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});

export default FilterScreen;
