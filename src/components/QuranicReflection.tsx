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
      <Text style={styles.translation} numberOfLines={2}>
        {translation}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  arabic: {
    fontFamily: FontFamilies.amiriRegular,
    fontSize: 21,
    lineHeight: 33,
    textAlign: 'center',
    color: Colors.primary,
    fontWeight: '400',
    writingDirection: 'rtl',
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 9999,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.goldMedium,
    gap: 5,
  },
  pillStar: {
    color: Colors.gold,
    fontSize: 9,
  },
  pillText: {
    fontFamily: FontFamilies.sansMedium,
    color: Colors.primary,
    fontSize: 9,
    fontWeight: '500',
  },
  translation: {
    fontFamily: FontFamilies.serifItalic,
    fontStyle: 'italic',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    color: Colors.textMuted,
    paddingHorizontal: 8,
  },
});
