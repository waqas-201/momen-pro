import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { FontFamilies } from '../theme/typography';

interface QuranicReflectionProps {
  arabicText: string;
  reference: string;
  translation: string;
}

export const QuranicReflection: React.FC<QuranicReflectionProps> = ({
  arabicText,
  reference,
  translation,
}) => {
  return (
    <View style={styles.container}>
      {/* Arabic Ayah */}
      <Text style={styles.arabic}>{arabicText}</Text>

      {/* Surah Reference Pill */}
      <View style={styles.pillBadge}>
        <Text style={styles.pillStar}>✦</Text>
        <Text style={styles.pillText}>{reference}</Text>
      </View>

      {/* Italic Translation */}
      <Text style={styles.translation}>{translation}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 28,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  arabic: {
    fontFamily: FontFamilies.amiriRegular,
    fontSize: 25,
    lineHeight: 40,
    textAlign: 'center',
    color: Colors.primary,
    fontWeight: '400',
    direction: 'rtl',
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 9999,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.goldMedium,
    gap: 6,
  },
  pillStar: {
    color: Colors.gold,
    fontSize: 10,
  },
  pillText: {
    fontFamily: FontFamilies.sansMedium,
    color: Colors.primary,
    fontSize: 10,
    fontWeight: '500',
  },
  translation: {
    fontFamily: FontFamilies.serifItalic,
    fontStyle: 'italic',
    fontSize: 18,
    lineHeight: 23,
    textAlign: 'center',
    color: Colors.textMuted,
    paddingHorizontal: 8,
  },
});
