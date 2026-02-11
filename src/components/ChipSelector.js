import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function ChipSelector({ items, selectedItems, onToggle }) {
  return (
    <View style={styles.container}>
      {items.map((item) => {
        const isSelected = selectedItems.includes(item);
        return (
          <TouchableOpacity
            key={item}
            style={[styles.chip, isSelected && styles.chipSelected]}
            onPress={() => onToggle(item)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>{item}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  chipSelected: {
    backgroundColor: colors.primary,
  },
  chipText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: colors.white,
  },
});
