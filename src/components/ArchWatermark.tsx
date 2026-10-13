import React from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { Colors } from '../theme/colors';

interface ArchWatermarkProps {
  hasInnerDashed?: boolean;
}

export const ArchWatermark: React.FC<ArchWatermarkProps> = ({ hasInnerDashed = false }) => {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Top Ambient Heavenly Glow */}
      <View style={styles.ambientGlow} />

      {/* Main Architectural Arch Hairline Watermark */}
      <View style={styles.archOutline} />

      {/* Optional Inner dashed border (used in splash) */}
      {hasInnerDashed && <View style={styles.dashedArch} />}
    </View>
  );
};

const styles = StyleSheet.create({
  ambientGlow: {
    position: 'absolute',
    top: -90,
    alignSelf: 'center',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: Colors.goldGlow,
    opacity: 0.8,
    ...(Platform.OS === 'web'
      ? { filter: 'blur(36px)' }
      : { shadowColor: Colors.gold, shadowOpacity: 0.35, shadowRadius: 36 }),
  },
  archOutline: {
    position: 'absolute',
    top: 24,
    left: 15,
    right: 15,
    bottom: 24,
    borderWidth: 1,
    borderColor: Colors.goldLight,
    borderTopLeftRadius: 180,
    borderTopRightRadius: 180,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  dashedArch: {
    position: 'absolute',
    top: 36,
    left: 27,
    right: 27,
    bottom: 36,
    borderWidth: 1,
    borderColor: 'rgba(200, 168, 107, 0.16)',
    borderStyle: 'dashed',
    borderTopLeftRadius: 168,
    borderTopRightRadius: 168,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
});
