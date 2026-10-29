import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { FontFamilies } from '../theme/typography';
import { QuranicReflection } from '../components/QuranicReflection';
import { StageBeat } from '../flow/StageBeat';
import { useOnboarding } from '../context/OnboardingContext';

const PRAYER_OPTIONS = [
  { value: '0', label: 'Not yet' },
  { value: '1–2', label: 'prayers' },
  { value: '3–4', label: 'prayers' },
  { value: '5', label: 'prayers' },
];

export const PrayersStep: React.FC = () => {
  const { dailyPrayersCount, setDailyPrayersCount } = useOnboarding();

  return (
    <View style={styles.mainContent}>
      <QuranicReflection
        arabicText="وَأَقِمِ الصَّلَاةَ لِذِكْرِي"
        reference="Surah Ta-Ha · 20:14 · excerpt"
        translation="“Establish prayer for My remembrance.”"
      />

      <View style={styles.questionSection}>
        <Text style={styles.title}>How often do you pray each day?</Text>
        <Text style={styles.subtitle}>
          Choose what reflects your days right now.
        </Text>
      </View>

      <StageBeat style={styles.optionsList}>
        {PRAYER_OPTIONS.map((option) => {
          const isSelected =
            dailyPrayersCount === option.value ||
            (option.value === '1–2' && dailyPrayersCount === '1-2') ||
            (option.value === '3–4' && dailyPrayersCount === '3-4');

          return (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionCard,
                isSelected ? styles.optionCardActive : styles.optionCardInactive,
              ]}
              onPress={() => setDailyPrayersCount(option.value)}
              activeOpacity={0.8}
              testID={`prayer-option-${option.value}`}
            >
              <Text style={styles.optionNumber} numberOfLines={1}>
                {option.value}
              </Text>
              <Text
                style={[
                  styles.optionLabel,
                  isSelected && styles.optionLabelActive,
                ]}
                numberOfLines={1}
              >
                {option.label}
              </Text>
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
    gap: 7,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
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
  optionNumber: {
    fontFamily: FontFamilies.serifSemiBold,
    fontSize: 16,
    color: '#083B32',
    width: 38,
  },
  optionLabel: {
    flex: 1,
    fontFamily: FontFamilies.sansMedium,
    fontSize: 13,
    color: '#083B32',
  },
  optionLabelActive: {
    fontFamily: FontFamilies.sansSemiBold,
    fontWeight: '600',
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
    backgroundColor: '#083B32',
    borderColor: '#083B32',
  },
});
