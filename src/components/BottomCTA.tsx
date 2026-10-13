import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import { Colors } from '../theme/colors';

interface BottomCTAProps {
  title: string;
  subtitle?: string;
  onPress: () => void;
  testID?: string;
}

export const BottomCTA: React.FC<BottomCTAProps> = ({
  title,
  subtitle = 'A little reflection. A gentler beginning.',
  onPress,
  testID = 'bottom-cta-button',
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onPress}
        style={styles.pillButton}
        activeOpacity={0.85}
        testID={testID}
      >
        <Text style={styles.buttonText}>{title}</Text>
        <ArrowRight size={17} color={Colors.gold} strokeWidth={2.4} />
      </TouchableOpacity>

      {subtitle ? <Text style={styles.subtitleText}>{subtitle}</Text> : null}

      <View style={styles.homeIndicator} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 14 : 12,
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'transparent',
  },
  pillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 54,
    backgroundColor: Colors.primary,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(200, 168, 107, 0.5)',
    gap: 12,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 8px 20px -5px rgba(8, 59, 50, 0.17)' }
      : {
          shadowColor: Colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.17,
          shadowRadius: 10,
          elevation: 3,
        }),
  },
  buttonText: {
    color: Colors.textLight,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  subtitleText: {
    fontSize: 10,
    fontWeight: '400',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  homeIndicator: {
    width: 128,
    height: 4,
    backgroundColor: Colors.indicator,
    borderRadius: 9999,
    marginTop: 2,
  },
});
