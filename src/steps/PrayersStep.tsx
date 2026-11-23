import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { FontFamilies } from '../theme/typography';
import { QuranicReflection } from '../components/QuranicReflection';
import { StageBeat } from '../flow/StageBeat';
import { useOnboarding } from '../context/OnboardingContext';

interface PrayerTargetOption {
  target: number;
  label: string;
  sublabel: string;
  countKey: string;
}

const PRAYER_TARGET_OPTIONS: PrayerTargetOption[] = [
  { target: 5, label: 'All 5 prayers', sublabel: 'Fajr, Dhuhr, Asr, Maghrib, Isha', countKey: '5' },
  { target: 4, label: '4 prayers', sublabel: 'Building daily consistency', countKey: '4' },
  { target: 3, label: '3 prayers', sublabel: 'A solid daily foundation', countKey: '3' },
  { target: 2, label: '1–2 prayers', sublabel: 'A gentle and steady start', countKey: '1-2' },
];

export const PrayersStep: React.FC = () => {
  const { targetPrayers, setTargetPrayers, setDailyPrayersCount } = useOnboarding();

  const handleSelect = (option: PrayerTargetOption) => {
    setTargetPrayers(option.target);
    setDailyPrayersCount(option.countKey);
  };

  return (
    <View style={styles.mainContent}>
      <QuranicReflection
        arabicText="وَأَقِمِ الصَّلَاةَ لِذِكْرِي"
        reference="Surah Ta-Ha · 20:14 · excerpt"
        translation="“Establish prayer for My remembrance.”"
      />

      <View style={styles.questionSection}>
        <Text style={styles.title}>Set your daily prayer intention</Text>
        <Text style={styles.subtitle}>
          Commit to a daily foundation. Aim for all five, or begin at your pace.
        </Text>
      </View>

      <StageBeat style={styles.optionsList}>
        {PRAYER_TARGET_OPTIONS.map((option) => {
          const isSelected = targetPrayers === option.target;

          return (
            <TouchableOpacity
              key={option.target}
              style={[
                styles.optionCard,
                isSelected ? styles.optionCardActive : styles.optionCardInactive,
              ]}
              onPress={() => handleSelect(option)}
              activeOpacity={0.8}
              testID={`prayer-option-${option.countKey}`}
            >
              <View style={styles.targetBadge}>
                <Text style={styles.targetNumber}>{option.target}</Text>
              </View>
              <View style={styles.textGroup}>
                <Text
                  style={[
                    styles.optionLabel,
                    isSelected && styles.optionLabelActive,
                  ]}
                  numberOfLines={1}
                >
                  {option.label}
                </Text>
                <Text style={styles.optionSublabel} numberOfLines={1}>
                  {option.sublabel}
                </Text>
              </View>
              <View
                style={[
                  styles.indicatorCircle,
                  isSelected
                    ? styles.indicatorCircleActive
                    : styles.indicatorCircleInactive,
                ]}
              >
                {isSelected && <Check size={11} color="#FFFFFF" strokeWidth={3} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </StageBeat>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  questionSection: {
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 4,
  },
  title: {
    fontFamily: FontFamilies.serifSemiBold,
    fontSize: 23,
    lineHeight: 28,
    textAlign: 'center',
    color: '#083B32',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 12.5,
    lineHeight: 16,
    textAlign: 'center',
    color: '#57534E',
    paddingHorizontal: 10,
  },
  optionsList: {
    width: '100%',
    gap: 8,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  optionCardInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E7E4DA',
  },
  optionCardActive: {
    backgroundColor: '#F5EFE3',
    borderColor: '#C8A86B',
  },
  targetBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EAE5D8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  targetNumber: {
    fontFamily: FontFamilies.serifSemiBold,
    fontSize: 15,
    color: '#083B32',
  },
  textGroup: {
    flex: 1,
  },
  optionLabel: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 13.5,
    color: '#083B32',
  },
  optionLabelActive: {
    fontFamily: FontFamilies.sansSemiBold,
    fontWeight: '600',
  },
  optionSublabel: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 11,
    color: '#78716C',
  },
  indicatorCircle: {
    width: 18,
    height: 18,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorCircleInactive: {
    borderWidth: 1,
    borderColor: '#DFDCD2',
    backgroundColor: 'transparent',
  },
  indicatorCircleActive: {
    borderWidth: 1,
    borderColor: '#083B32',
    backgroundColor: '#083B32',
  },
});
