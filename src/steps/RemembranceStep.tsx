import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { FontFamilies } from '../theme/typography';
import { QuranicReflection } from '../components/QuranicReflection';
import { StageBeat } from '../flow/StageBeat';
import { useOnboarding } from '../context/OnboardingContext';

const ROUTINE_ROWS = [
  ['Morning azkar', 'Evening azkar'],
  ['After prayer', 'Before sleep'],
];

export const RemembranceStep: React.FC = () => {
  const { adhkarRoutines, toggleAdhkarRoutine } = useOnboarding();

  const isNoneSelected =
    adhkarRoutines.length === 1 && adhkarRoutines[0] === 'No current routine';

  return (
    <View style={styles.mainContent}>
      <QuranicReflection
        arabicText="اذْكُرُوا اللَّهَ ذِكْرًا كَثِيرًا"
        reference="Surah Al-Ahzab · 33:41 · excerpt"
        translation="“Remember Allah with much remembrance.”"
      />

      <View style={styles.questionSection}>
        <Text style={styles.title}>Do you practice daily dhikr?</Text>
        <Text style={styles.subtitle}>
          Select your routines or begin fresh today.
        </Text>
      </View>

      <StageBeat style={styles.optionsContainer}>
        {ROUTINE_ROWS.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.routineRow}>
            {row.map((item) => {
              const isSelected = adhkarRoutines.includes(item);
              const testIdSlug = item.toLowerCase().replace(/\s+/g, '-');

              return (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.routineCard,
                    isSelected
                      ? styles.routineCardActive
                      : styles.routineCardInactive,
                  ]}
                  onPress={() => toggleAdhkarRoutine(item)}
                  activeOpacity={0.8}
                  testID={`routine-${testIdSlug}`}
                >
                  <Text
                    style={[
                      styles.cardText,
                      isSelected && styles.cardTextActive,
                    ]}
                    numberOfLines={1}
                  >
                    {item}
                  </Text>
                  <View
                    style={[
                      styles.indicatorCircle,
                      isSelected
                        ? styles.indicatorCircleActive
                        : styles.indicatorCircleInactive,
                    ]}
                  >
                    {isSelected && (
                      <Check size={10} color="#FFFFFF" strokeWidth={3} />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}

        <TouchableOpacity
          style={[
            styles.routineCardFull,
            isNoneSelected
              ? styles.routineCardActive
              : styles.routineCardInactive,
          ]}
          onPress={() => toggleAdhkarRoutine('No current routine')}
          activeOpacity={0.8}
          testID="routine-no-current-routine"
        >
          <Text
            style={[styles.cardText, isNoneSelected && styles.cardTextActive]}
            numberOfLines={1}
          >
            No current routine
          </Text>
          <View
            style={[
              styles.indicatorCircle,
              isNoneSelected
                ? styles.indicatorCircleActive
                : styles.indicatorCircleInactive,
            ]}
          >
            {isNoneSelected && (
              <Check size={10} color="#FFFFFF" strokeWidth={3} />
            )}
          </View>
        </TouchableOpacity>
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
  optionsContainer: {
    width: '100%',
    gap: 7,
  },
  routineRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  routineCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  routineCardFull: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  routineCardInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E7E4DA',
  },
  routineCardActive: {
    backgroundColor: '#F5EFE3',
    borderColor: '#C8A86B',
  },
  cardText: {
    flex: 1,
    fontFamily: FontFamilies.sansMedium,
    fontSize: 12.5,
    color: '#083B32',
    marginRight: 6,
  },
  cardTextActive: {
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
