import React, { useRef } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function VerificationCodeInput({ code, setCode, length = 6, expired = false }) {
  const inputs = useRef([]);

  const handleChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {Array.from({ length }).map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputs.current[index] = ref)}
          style={[
            styles.box,
            code[index] && styles.filledBox,
            expired && styles.expiredBox,
          ]}
          value={code[index] || ''}
          onChangeText={(text) => handleChange(text.slice(-1), index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          keyboardType="number-pad"
          maxLength={1}
          editable={!expired}
          selectTextOnFocus
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginVertical: 20,
  },
  box: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    backgroundColor: colors.white,
  },
  filledBox: {
    borderColor: colors.primary,
    borderWidth: 2.5,
  },
  expiredBox: {
    backgroundColor: colors.errorLight,
    borderColor: colors.disabled,
    color: colors.textSecondary,
  },
});
