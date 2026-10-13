import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
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
    top: -64,
    alignSelf: 'center',
    width: 256,
    height: 256,
    borderRadius: 128,
    backgroundColor: 'rgba(229, 200, 142, 0.25)',
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
    borderColor: 'rgba(200, 168, 107, 0.2)',
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
    borderColor: 'rgba(200, 168, 107, 0.14)',
    borderStyle: 'dashed',
    borderTopLeftRadius: 168,
    borderTopRightRadius: 168,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
});
