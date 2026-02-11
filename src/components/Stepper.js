import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

export default function Stepper({ currentStep, totalSteps = 5 }) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  const getStepStyle = (step) => {
    if (step < currentStep) return 'completed';
    if (step === currentStep) return 'active';
    return 'pending';
  };

  return (
    <View style={styles.container}>
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <View style={[styles.circle, styles[getStepStyle(step)]]}>
            {getStepStyle(step) === 'completed' ? (
              <Ionicons name="checkmark" size={16} color={colors.white} />
            ) : (
              <Text style={[styles.stepText, getStepStyle(step) === 'active' && styles.activeText]}>
                {step}
              </Text>
            )}
          </View>
          {index < steps.length - 1 && (
            <View style={[styles.line, step < currentStep && styles.lineCompleted]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completed: {
    backgroundColor: colors.success,
  },
  active: {
    backgroundColor: colors.primary,
  },
  pending: {
    backgroundColor: colors.border,
  },
  stepText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
  activeText: {
    color: colors.white,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },
  lineCompleted: {
    backgroundColor: colors.success,
  },
});
