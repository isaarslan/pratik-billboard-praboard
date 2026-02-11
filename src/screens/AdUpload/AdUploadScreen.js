import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  Stepper,
  PrimaryButton,
  OutlinedButton,
  TextInput,
  SuccessModal,
} from '../../components';
import { colors } from '../../theme/colors';

const AdUploadScreen = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [adTitle, setAdTitle] = useState('');
  const [adDuration, setAdDuration] = useState('');
  const [dates, setDates] = useState([
    '14 Eylül 2024 12:00',
    '15 Eylül 2024 14:00',
    '16 Eylül 2024 16:00',
  ]);
  const [contentSelected, setContentSelected] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const addDate = () => {
    const newDate = `${dates.length + 14} Eylül 2024 ${12 + dates.length * 2}:00`;
    setDates([...dates, newDate]);
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
      <Stepper currentStep={1} totalSteps={5} />
      <Text style={styles.description}>
        Reklamını başlatmak için birkaç bilgiye ihtiyacımız var.
      </Text>

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
      <Stepper currentStep={2} totalSteps={5} />
      <Text style={styles.description}>
        Reklamın hangi tarihlerde gösterilsin? Aşağıdan tarihleri seç!
      </Text>

      <View style={styles.dateListContainer}>
        <FlatList
          data={dates}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.dateRow}>
              <View style={styles.dateContent}>
                <Text style={styles.dateText}>{item}</Text>
                <TouchableOpacity style={styles.editButton}>
                  <Ionicons name="pencil" size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => removeDate(index)}
              >
                <Ionicons name="trash" size={20} color={colors.error} />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      <View style={styles.buttonContainer}>
        <OutlinedButton
          title="İçerik Yükleme Adımına Geç!"
          onPress={() => setCurrentStep(3)}
        />
        <View style={styles.buttonSpacer} />
        <PrimaryButton title="Tarih Seç!" onPress={addDate} />
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Reklam İçeriğini Yükle</Text>
      <Stepper currentStep={3} totalSteps={5} />
      <Text style={styles.description}>
        Hangi içerik yayınlanacak? Detayları buradan ekle!
      </Text>

      {!contentSelected ? (
        <TouchableOpacity
          style={styles.uploadPlaceholder}
          onPress={() => setContentSelected(true)}
        >
          <Ionicons name="cloud-upload-outline" size={64} color={colors.gray[400]} />
          <Text style={styles.uploadText}>İçerik yüklemek için dokunun</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.previewContainer}>
          <Text style={styles.previewTitle}>
            İçeriğin Billboard'da böyle gözükecek. Beğendin mi?
          </Text>
          <View style={styles.billboardPreview}>
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image-outline" size={80} color={colors.gray[400]} />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <OutlinedButton
              title="İçeriğini beğenmedin mi? Değiştir"
              onPress={() => setContentSelected(false)}
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
      <Stepper currentStep={4} totalSteps={5} />
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
      <Stepper currentStep={5} totalSteps={5} />
      <Text style={styles.description}>
        İçeriğini inceledin mi? Eğer tamamsa şimdi ödeme yapabilirsin!
      </Text>

      {renderSummaryTable()}

      <View style={styles.paymentPlaceholder}>
        <Text style={styles.paymentText}>İYZİCO ÖDEME ADIMLARI</Text>
      </View>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          title="Reklamı Yayına Al"
          onPress={() => setShowSuccessModal(true)}
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
      default:
        return renderStep1();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderCurrentStep()}
      </ScrollView>

      <SuccessModal
        visible={showSuccessModal}
        message="Ödemeniz başarıyla gerçekleştirildi. Reklamınız yayına alınmak üzere hazır."
        buttonTitle="Anasayfaya Dön"
        onPress={() => {
          setShowSuccessModal(false);
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
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  editButton: {
    padding: 4,
  },
  deleteButton: {
    marginLeft: 12,
    padding: 4,
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
  imagePlaceholder: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: colors.gray[200],
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
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
});

export default AdUploadScreen;
