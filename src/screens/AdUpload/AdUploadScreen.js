import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import {
  Stepper,
  PrimaryButton,
  OutlinedButton,
  TextInput,
  SuccessModal,
} from '../../components';
import { colors } from '../../theme/colors';
import BackHeader from '../../components/BackHeader';
import DateTimePickerModal from '../../components/DateTimePickerModal';
import { useAds } from '../../context/AdContext';
import { useOrders } from '../../context/OrderContext';

const AdUploadScreen = ({ navigation }) => {
  const { addAd } = useAds();
  const { addOrder } = useOrders();
  const selectedPanel = navigation.currentRoute.params?.panel || null;
  const [currentStep, setCurrentStep] = useState(1);
  const [adTitle, setAdTitle] = useState('');
  const [adDuration, setAdDuration] = useState('');
  const [dates, setDates] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [editingDateIndex, setEditingDateIndex] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const openDatePickerForNew = () => {
    setEditingDateIndex(null);
    setShowDatePicker(true);
  };

  const openDatePickerForEdit = (index) => {
    setEditingDateIndex(index);
    setShowDatePicker(true);
  };

  const handleDateConfirm = (dateStr) => {
    if (editingDateIndex !== null) {
      setDates((prev) => prev.map((d, i) => (i === editingDateIndex ? dateStr : d)));
    } else {
      setDates((prev) => [...prev, dateStr]);
    }
    setShowDatePicker(false);
    setEditingDateIndex(null);
  };

  const removeDate = (index) => {
    setDates(dates.filter((_, i) => i !== index));
  };

  const renderSummaryTable = () => {
    const totalPrice = dates.length * 1166;

    return (
      <View style={styles.summaryTable}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Reklam Başlığı:</Text>
          <Text style={styles.summaryValue}>{adTitle || '-'}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Toplam Gün:</Text>
          <Text style={styles.summaryValue}>{dates.length}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Reklam Süresi:</Text>
          <Text style={styles.summaryValue}>{adDuration} saniye</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Toplam Fiyat:</Text>
          <Text style={styles.summaryValue}>{totalPrice} TL</Text>
        </View>
      </View>
    );
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Reklam Yükleme Zamanı</Text>
      <Stepper currentStep={1} totalSteps={6} />
      <Text style={styles.description}>
        Reklamını başlatmak için birkaç bilgiye ihtiyacımız var.
      </Text>

      {/* Secili Pano Bilgisi */}
      {selectedPanel && (
        <View style={styles.selectedPanelCard}>
          <Image source={{ uri: selectedPanel.image }} style={styles.selectedPanelImage} resizeMode="cover" />
          <View style={styles.selectedPanelInfo}>
            <Text style={styles.selectedPanelName}>{selectedPanel.name}</Text>
            <Text style={styles.selectedPanelLocation}>{selectedPanel.location}</Text>
            <Text style={styles.selectedPanelPrice}>{selectedPanel.price}</Text>
          </View>
          <Ionicons name="checkmark-circle" size={24} color="#2E7D32" />
        </View>
      )}

      <View style={styles.formContainer}>
        <TextInput
          label="Reklam Başlığı"
          value={adTitle}
          onChangeText={setAdTitle}
          placeholder="Reklam başlığını girin"
        />
        <TextInput
          label="Reklam Yayın Süresi (saniye)"
          value={adDuration}
          onChangeText={setAdDuration}
          placeholder="Süre girin"
          keyboardType="number-pad"
        />
      </View>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          title="Reklam Tarihlerini Belirle!"
          onPress={() => setCurrentStep(2)}
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Reklam Tarihini Belirle</Text>
      <Stepper currentStep={2} totalSteps={6} />
      <Text style={styles.description}>
        Reklamın hangi tarihlerde gösterilsin? Aşağıdan tarihleri seç!
      </Text>

      <View style={styles.dateListContainer}>
        {dates.length === 0 ? (
          <View style={styles.emptyDateContainer}>
            <Ionicons name="calendar-outline" size={48} color={colors.gray[300]} />
            <Text style={styles.emptyDateText}>Henüz tarih eklenmedi</Text>
            <Text style={styles.emptyDateSubtext}>Aşağıdaki butona tıklayarak tarih ekleyin</Text>
          </View>
        ) : (
          <FlatList
            data={dates}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
            renderItem={({ item, index }) => (
              <View style={styles.dateRow}>
                <View style={styles.dateIndexBadge}>
                  <Text style={styles.dateIndexText}>{index + 1}</Text>
                </View>
                <View style={styles.dateContent}>
                  <View>
                    <Text style={styles.dateText}>{item}</Text>
                  </View>
                  <View style={styles.dateActions}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => openDatePickerForEdit(index)}
                    >
                      <Ionicons name="pencil" size={18} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => removeDate(index)}
                    >
                      <Ionicons name="trash" size={18} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />
        )}
      </View>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          title="+ Yeni Tarih Ekle"
          onPress={openDatePickerForNew}
        />
        {dates.length > 0 && (
          <>
            <View style={styles.buttonSpacer} />
            <OutlinedButton
              title="İçerik Yükleme Adımına Geç!"
              onPress={() => setCurrentStep(3)}
            />
          </>
        )}
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Reklam İçeriğini Yükle</Text>
      <Stepper currentStep={3} totalSteps={6} />
      <Text style={styles.description}>
        Hangi içerik yayınlanacak? Detayları buradan ekle!
      </Text>

      {!selectedImage ? (
        <TouchableOpacity
          style={styles.uploadPlaceholder}
          onPress={pickImage}
        >
          <Ionicons name="cloud-upload-outline" size={64} color={colors.gray[400]} />
          <Text style={styles.uploadText}>Galeriden resim seçmek için dokunun</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.previewContainer}>
          <Text style={styles.previewTitle}>
            İçeriğin Billboard'da böyle gözükecek. Beğendin mi?
          </Text>
          <View style={styles.billboardPreview}>
            <Image
              source={{ uri: selectedImage }}
              style={styles.previewImage}
              resizeMode="cover"
            />
          </View>

          <View style={styles.buttonContainer}>
            <OutlinedButton
              title="İçeriğini beğenmedin mi? Değiştir"
              onPress={pickImage}
            />
            <View style={styles.buttonSpacer} />
            <PrimaryButton
              title="İçerik Özetini Gör"
              onPress={() => setCurrentStep(4)}
            />
          </View>
        </View>
      )}
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>İşte İçerik Özetin!</Text>
      <Stepper currentStep={4} totalSteps={6} />
      <Text style={styles.description}>
        İçeriğin Billboard'da böyle gözükecek. Beğendin mi?
      </Text>

      {renderSummaryTable()}

      <View style={styles.buttonContainer}>
        <OutlinedButton
          title="İçeriğini beğenmedin mi? Değiştir"
          onPress={() => setCurrentStep(3)}
        />
        <View style={styles.buttonSpacer} />
        <PrimaryButton
          title="Ödeme Adımına Geç!"
          onPress={() => setCurrentStep(5)}
        />
      </View>
    </View>
  );

  const renderStep5 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Son Bir Adım: Ödeme</Text>
      <Stepper currentStep={5} totalSteps={6} />
      <Text style={styles.description}>
        İçeriğini inceledin mi? Eğer tamamsa şimdi ödeme yapabilirsin!
      </Text>

      {renderSummaryTable()}

      <View style={styles.paymentPlaceholder}>
        <Text style={styles.paymentText}>İYZİCO ÖDEME ADIMLARI</Text>
      </View>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          title="Önizlemeyi Gör"
          onPress={() => setCurrentStep(6)}
        />
      </View>
    </View>
  );

  const renderStep6 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Reklamın Böyle Görünecek!</Text>
      <Stepper currentStep={6} totalSteps={6} />
      <Text style={styles.description}>
        Reklamın billboard panoda ve feed'de nasıl görünecek, son kez kontrol et!
      </Text>

      {/* Billboard Montaj Onizleme */}
      {selectedPanel && (
        <View style={styles.montageSection}>
          <Text style={styles.montageSectionTitle}>Billboard Panoda Görünüm</Text>
          <View style={styles.montageContainer}>
            <Image
              source={{ uri: selectedPanel.image }}
              style={styles.montageBackground}
              resizeMode="cover"
              blurRadius={2}
            />
            <View style={styles.montageOverlay}>
              <View style={styles.montageFrame}>
                {selectedImage ? (
                  <Image source={{ uri: selectedImage }} style={styles.montageAdImg} resizeMode="cover" />
                ) : (
                  <View style={[styles.montageAdImg, { justifyContent: 'center', alignItems: 'center', backgroundColor: colors.gray[200] }]}>
                    <Ionicons name="image-outline" size={40} color={colors.gray[400]} />
                  </View>
                )}
              </View>
              <View style={styles.montageTag}>
                <Ionicons name="location" size={12} color="#fff" />
                <Text style={styles.montageTagText}>{selectedPanel.name}</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Feed-style preview card */}
      <Text style={styles.montageSectionTitle}>Feed'deki Görünüm</Text>
      <View style={styles.feedPreviewCard}>
        <View style={styles.feedPreviewHeader}>
          <View style={styles.feedPreviewAvatar}>
            <Ionicons name="person" size={20} color={colors.gray[400]} />
          </View>
          <View style={styles.feedPreviewInfo}>
            <Text style={styles.feedPreviewName}>İsa Arslan</Text>
            <Text style={styles.feedPreviewMeta}>Az önce • {selectedPanel?.location || 'Ankara'}</Text>
          </View>
        </View>

        {selectedImage ? (
          <Image
            source={{ uri: selectedImage }}
            style={styles.feedPreviewImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.feedPreviewImage, styles.feedPreviewImagePlaceholder]}>
            <Ionicons name="image-outline" size={48} color={colors.gray[300]} />
          </View>
        )}

        <View style={styles.feedPreviewActions}>
          <View style={styles.feedPreviewAction}>
            <Ionicons name="heart-outline" size={22} color={colors.gray[600]} />
            <Text style={styles.feedPreviewActionText}>0</Text>
          </View>
          <View style={styles.feedPreviewAction}>
            <Ionicons name="share-outline" size={22} color={colors.gray[600]} />
            <Text style={styles.feedPreviewActionText}>0</Text>
          </View>
        </View>

        <View style={styles.feedPreviewDesc}>
          <Text style={styles.feedPreviewDescText}>
            <Text style={styles.feedPreviewDescBold}>isaarslan</Text>{' '}
            {adTitle || 'Reklam başlığı'}
          </Text>
        </View>
      </View>

      {renderSummaryTable()}

      <View style={styles.buttonContainer}>
        <OutlinedButton
          title="Geri Dön ve Düzenle"
          onPress={() => setCurrentStep(5)}
        />
        <View style={styles.buttonSpacer} />
        <PrimaryButton
          title="Onayla ve Yayınla"
          onPress={() => {
            addAd({
              title: adTitle,
              duration: adDuration,
              dates,
              image: selectedImage,
            });
            if (selectedPanel) {
              addOrder({
                adTitle,
                adImage: selectedImage,
                panel: selectedPanel,
                dates,
                adDuration,
              });
            }
            setShowSuccessModal(true);
          }}
        />
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      case 6:
        return renderStep6();
      default:
        return renderStep1();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <BackHeader title="Reklam Yükle" onBack={() => navigation.goBack()} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderCurrentStep()}
      </ScrollView>

      <DateTimePickerModal
        visible={showDatePicker}
        onClose={() => {
          setShowDatePicker(false);
          setEditingDateIndex(null);
        }}
        onConfirm={handleDateConfirm}
      />

      <SuccessModal
        visible={showSuccessModal}
        message="Ödemeniz başarıyla gerçekleştirildi. Reklamınız yayına alınmak üzere hazır."
        buttonTitle="Anasayfaya Dön"
        onPress={() => {
          setShowSuccessModal(false);
          setCurrentStep(1);
          setAdTitle('');
          setAdDuration('');
          setSelectedImage(null);
          navigation.navigate('HomeTab');
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  stepContainer: {
    flex: 1,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 20,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  formContainer: {
    marginTop: 8,
    gap: 16,
  },
  buttonContainer: {
    marginTop: 32,
  },
  buttonSpacer: {
    height: 12,
  },
  dateListContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  emptyDateContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  emptyDateText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 12,
  },
  emptyDateSubtext: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 10,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateIndexBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dateIndexText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  dateContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  dateActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EBF0FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FDEDEE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadPlaceholder: {
    marginTop: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.gray[300],
    borderRadius: 16,
    padding: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray[100],
  },
  uploadText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  previewContainer: {
    marginTop: 16,
  },
  previewTitle: {
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  billboardPreview: {
    backgroundColor: colors.gray[100],
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 8,
  },
  previewImage: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
    backgroundColor: colors.gray[200],
  },
  summaryTable: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  summaryLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  paymentPlaceholder: {
    marginTop: 24,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray[100],
  },
  paymentText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
  },
  selectedPanelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8F5E9',
    backgroundColor: '#FAFFF9',
  },
  selectedPanelImage: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: colors.gray[200],
  },
  selectedPanelInfo: {
    flex: 1,
    marginLeft: 12,
  },
  selectedPanelName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  selectedPanelLocation: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  selectedPanelPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 2,
  },
  montageSection: {
    marginBottom: 20,
  },
  montageSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  montageContainer: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  montageBackground: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  montageOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  montageFrame: {
    width: '70%',
    aspectRatio: 16 / 9,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#fff',
  },
  montageAdImg: {
    width: '100%',
    height: '100%',
  },
  montageTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 8,
    gap: 4,
  },
  montageTagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  feedPreviewCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  feedPreviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  feedPreviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedPreviewInfo: {
    marginLeft: 10,
  },
  feedPreviewName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  feedPreviewMeta: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  feedPreviewImage: {
    width: '100%',
    height: 220,
    backgroundColor: colors.gray[200],
  },
  feedPreviewImagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedPreviewActions: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 16,
  },
  feedPreviewAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  feedPreviewActionText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  feedPreviewDesc: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  feedPreviewDescText: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  feedPreviewDescBold: {
    fontWeight: 'bold',
  },
});

export default AdUploadScreen;
