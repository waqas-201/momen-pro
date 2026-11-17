import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArchWatermark } from '../components/ArchWatermark';
import { Colors } from '../theme/colors';
import { FontFamilies } from '../theme/typography';
import type { Tab } from '../shell/TabBar';

const COPY: Record<Exclude<Tab, 'home'>, { title: string; body: string }> = {
  prayer: {
    title: 'Prayer',
    body: 'Prayer times and each day’s five prayers are next. For now, mark them on Home.',
  },
  dhikr: {
    title: 'Dhikr',
    body: 'Counting and azkar collections will live here. Your chosen routines are on Home.',
  },
  quran: {
    title: 'Qur’an',
    body: 'A reading companion is on its way. Your daily portion is on Home.',
  },
};

export const PlaceholderScreen: React.FC<{ tab: Exclude<Tab, 'home'> }> = ({
  tab,
}) => {
  const insets = useSafeAreaInsets();
  const copy = COPY[tab];

  return (
    <View
      style={[styles.root, { paddingTop: Math.max(insets.top + 10, 20) }]}
      testID={`placeholder-${tab}`}
    >
      <ArchWatermark />
      <Text style={styles.kicker}>Coming soon</Text>
      <Text style={styles.title}>{copy.title}</Text>
      <Text style={styles.body}>{copy.body}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.darkBg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
    gap: 8,
    overflow: 'hidden',
  },
  kicker: {
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 10,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: Colors.darkGold,
  },
  title: {
    fontFamily: FontFamilies.serifSemiBold,
    fontSize: 26,
    lineHeight: 31,
    color: Colors.darkTextPrimary,
  },
  body: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 12.5,
    lineHeight: 19,
    textAlign: 'center',
    color: Colors.darkTextSecondary,
  },
});
