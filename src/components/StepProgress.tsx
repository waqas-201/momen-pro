import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

interface StepProgressProps {
  title: string;
  currentStep: number;
  totalSteps?: number;
  isComplete?: boolean;
}

export const StepProgress: React.FC<StepProgressProps> = ({
  title,
  currentStep,
  totalSteps = 6,
  isComplete = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.titleText}>{title.toUpperCase()}</Text>
        <Text style={styles.stepCountText}>
          {isComplete ? 'Complete' : `${currentStep} of ${totalSteps}`}
        </Text>
      </View>
      <View style={styles.track}>
        {Array.from({ length: totalSteps }).map((_, index) => {
          const isFilled = isComplete || index < currentStep;
          return (
            <View
              key={index}
              style={[
                styles.segment,
                { backgroundColor: isFilled ? Colors.primary : Colors.border },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 28,
    paddingVertical: 4,
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: Colors.primary,
  },
  stepCountText: {
    fontSize: 10,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  track: {
    flexDirection: 'row',
    gap: 5,
    width: '100%',
  },
  segment: {
    flex: 1,
    height: 3,
    borderRadius: 9999,
  },
});
