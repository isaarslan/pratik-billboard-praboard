import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput as RNTextInput, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

export default function TextInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  error,
  success,
  keyboardType,
  autoCapitalize = 'none',
  editable = true,
  style,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const labelAnim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(labelAnim, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const getBorderColor = () => {
    if (error) return colors.error;
    if (success) return colors.success;
    if (isFocused) return colors.borderFocused;
    return colors.border;
  };

  const getBackgroundColor = () => {
    if (error) return colors.errorLight;
    if (success) return colors.successLight;
    return colors.white;
  };

  const getLabelColor = () => {
    if (error) return colors.error;
    if (success) return colors.success;
    if (isFocused) return colors.borderFocused;
    return colors.textSecondary;
  };

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.inputWrapper, { borderColor: getBorderColor(), backgroundColor: getBackgroundColor() }]}>
        <Animated.Text
          style={[
            styles.label,
            {
              color: getLabelColor(),
              top: labelAnim.interpolate({ inputRange: [0, 1], outputRange: [18, 6] }),
              fontSize: labelAnim.interpolate({ inputRange: [0, 1], outputRange: [16, 12] }),
            },
          ]}
        >
          {label}
        </Animated.Text>
        <RNTextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={isFocused ? placeholder : ''}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {secureTextEntry && (
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {success && <Text style={styles.successText}>{success}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  inputWrapper: {
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 56,
    justifyContent: 'center',
    position: 'relative',
  },
  label: {
    position: 'absolute',
    left: 16,
    backgroundColor: 'transparent',
  },
  input: {
    fontSize: 16,
    color: colors.textPrimary,
    paddingTop: 12,
    height: '100%',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  successText: {
    color: colors.success,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
