import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BookOpen, House, Sparkles, Sun } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { FontFamilies } from '../theme/typography';

export type Tab = 'home' | 'prayer' | 'dhikr' | 'quran';

const TABS: {
  key: Tab;
  label: string;
  Icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
}[] = [
  { key: 'home', label: 'Home', Icon: House },
  { key: 'prayer', label: 'Prayer', Icon: Sun },
  { key: 'dhikr', label: 'Dhikr', Icon: Sparkles },
  { key: 'quran', label: 'Qur’an', Icon: BookOpen },
];

interface TabBarProps {
  tab: Tab;
  onChange: (tab: Tab) => void;
}

/** Anchored to the bottom of the app once the Flow is done, like Chrome. */
export const TabBar: React.FC<TabBarProps> = ({ tab, onChange }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.root, { paddingBottom: Math.max(insets.bottom, 8) }]}
      testID="tab-bar"
    >
      {TABS.map(({ key, label, Icon }) => {
        const active = key === tab;
        return (
          <TouchableOpacity
            key={key}
            style={styles.tab}
            onPress={() => onChange(key)}
            activeOpacity={0.75}
            testID={`tab-${key}`}
          >
            <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
              <Icon
                size={17}
                color={active ? Colors.darkGold : Colors.darkTextMuted}
                strokeWidth={active ? 2.4 : 2}
              />
            </View>
            <Text style={[styles.label, active && styles.labelActive]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    paddingTop: 8,
    backgroundColor: Colors.darkBg,
    borderTopWidth: 1,
    borderTopColor: Colors.darkBorderSubtle,
  },
  tab: {
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 10,
    minWidth: 62,
  },
  iconWrap: {
    width: 36,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: 'rgba(212, 175, 55, 0.14)',
  },
  label: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 10,
    color: Colors.darkTextMuted,
  },
  labelActive: {
    fontFamily: FontFamilies.sansBold,
    color: Colors.darkGold,
  },
});
