import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];

const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

export default function DateTimePickerModal({ visible, onClose, onConfirm, initialDate }) {
  const init = initialDate || new Date();
  const [selectedYear, setSelectedYear] = useState(init.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(init.getMonth());
  const [selectedDay, setSelectedDay] = useState(init.getDate());
  const [selectedHour, setSelectedHour] = useState(init.getHours());
  const [selectedMinute, setSelectedMinute] = useState(0);

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 15, 30, 45];
  const years = [2024, 2025, 2026, 2027];

  const handleConfirm = () => {
    const day = Math.min(selectedDay, daysInMonth);
    const dateStr = `${day} ${MONTHS[selectedMonth]} ${selectedYear} ${String(selectedHour).padStart(2, '0')}:${String(selectedMinute).padStart(2, '0')}`;
    onConfirm(dateStr);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Tarih ve Saat Seç</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Preview */}
          <View style={styles.preview}>
            <Ionicons name="calendar" size={20} color={colors.primary} />
            <Text style={styles.previewText}>
              {Math.min(selectedDay, daysInMonth)} {MONTHS[selectedMonth]} {selectedYear} {String(selectedHour).padStart(2, '0')}:{String(selectedMinute).padStart(2, '0')}
            </Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollArea}>
            {/* Year */}
            <Text style={styles.sectionLabel}>Yıl</Text>
            <View style={styles.chipRow}>
              {years.map((y) => (
                <TouchableOpacity
                  key={y}
                  style={[styles.chip, selectedYear === y && styles.chipActive]}
                  onPress={() => setSelectedYear(y)}
                >
                  <Text style={[styles.chipText, selectedYear === y && styles.chipTextActive]}>{y}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Month */}
            <Text style={styles.sectionLabel}>Ay</Text>
            <View style={styles.monthGrid}>
              {MONTHS.map((m, i) => (
                <TouchableOpacity
                  key={m}
                  style={[styles.monthChip, selectedMonth === i && styles.chipActive]}
                  onPress={() => setSelectedMonth(i)}
                >
                  <Text style={[styles.chipText, selectedMonth === i && styles.chipTextActive]}>{m}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Day */}
            <Text style={styles.sectionLabel}>Gün</Text>
            <View style={styles.dayGrid}>
              {days.map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[styles.dayChip, selectedDay === d && styles.chipActive]}
                  onPress={() => setSelectedDay(d)}
                >
                  <Text style={[styles.dayChipText, selectedDay === d && styles.chipTextActive]}>{d}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Hour */}
            <Text style={styles.sectionLabel}>Saat</Text>
            <View style={styles.timeRow}>
              {hours.map((h) => (
                <TouchableOpacity
                  key={h}
                  style={[styles.timeChip, selectedHour === h && styles.chipActive]}
                  onPress={() => setSelectedHour(h)}
                >
                  <Text style={[styles.timeChipText, selectedHour === h && styles.chipTextActive]}>
                    {String(h).padStart(2, '0')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Minute */}
            <Text style={styles.sectionLabel}>Dakika</Text>
            <View style={styles.chipRow}>
              {minutes.map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[styles.chip, selectedMinute === m && styles.chipActive]}
                  onPress={() => setSelectedMinute(m)}
                >
                  <Text style={[styles.chipText, selectedMinute === m && styles.chipTextActive]}>
                    {String(m).padStart(2, '0')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>İptal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
              <Text style={styles.confirmBtnText}>Tarihi Onayla</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray[50] || '#F8F9FA',
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  previewText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  scrollArea: {
    paddingHorizontal: 20,
    marginTop: 12,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 16,
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.gray[100],
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  chipTextActive: {
    color: colors.white,
    fontWeight: '700',
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  monthChip: {
    width: '30%',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.gray[100],
    borderWidth: 1,
    borderColor: colors.gray[200],
    alignItems: 'center',
  },
  dayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  dayChip: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  dayChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  timeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  timeChip: {
    width: 48,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  timeChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray[300],
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  confirmBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  confirmBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
});
