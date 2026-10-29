import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Minus, Plus, Check } from 'lucide-react-native';
import { FontFamilies } from '../theme/typography';
import { QuranicReflection } from '../components/QuranicReflection';
import { StageBeat } from '../flow/StageBeat';
import { useOnboarding } from '../context/OnboardingContext';

const FREQUENCY_OPTIONS = ['Yes', 'Sometimes', 'Not yet'];
const UNIT_OPTIONS = ['Ayahs', 'Ruku', 'Para (Juz)'];

export const RecitationStep: React.FC = () => {
  const {
    recitesEveryDay,
    setRecitesEveryDay,
    recitationAmount,
    setRecitationAmount,
    recitationUnit,
    setRecitationUnit,
    setTargetRecitation,
  } = useOnboarding();

  const handleDecrease = () => {
    setRecitationAmount((prev) => {
      const next = Math.max(1, prev - 1);
      setTargetRecitation(next);
      return next;
    });
  };

  const handleIncrease = () => {
    setRecitationAmount((prev) => {
      const next = prev + 1;
      setTargetRecitation(next);
      return next;
    });
  };

  const showFollowUp = recitesEveryDay !== 'Not yet';

  return (
    <View style={styles.mainContent}>
      <QuranicReflection
        arabicText="وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا"
        reference="Surah Al-Muzzammil · 73:4 · excerpt"
        translation="“Recite the Qur’an with measured recitation.”"
      />

      <View style={styles.questionSection}>
        <Text style={styles.title}>Do you recite Qur’an daily?</Text>
        <Text style={styles.subtitle}>
          Even a single ayah holds boundless light.
        </Text>
      </View>

      <StageBeat style={styles.controls}>
        <View style={styles.frequencyRow}>
          {FREQUENCY_OPTIONS.map((option) => {
            const isSelected = recitesEveryDay === option;
            const slug = option.toLowerCase().replace(/\s+/g, '-');

            return (
              <TouchableOpacity
                key={option}
                style={[
                  styles.freqPill,
                  isSelected ? styles.freqPillActive : styles.freqPillInactive,
                ]}
                onPress={() => setRecitesEveryDay(option)}
                activeOpacity={0.8}
                testID={`freq-pill-${slug}`}
                hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
              >
                {isSelected && (
                  <Check size={11} color="#083B32" strokeWidth={2.6} />
                )}
                <Text
                  style={[
                    styles.freqPillText,
                    isSelected && styles.freqPillTextActive,
                  ]}
                  numberOfLines={1}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {showFollowUp && (
          <View style={styles.followUpSection}>
            <Text style={styles.followUpLabel}>
              How much do you typically aim for?
            </Text>

            <View style={styles.stepperContainer}>
              <TouchableOpacity
                style={styles.stepperButton}
                onPress={handleDecrease}
                activeOpacity={0.7}
                testID="recitation-decrease-btn"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Minus size={13} color="#083B32" strokeWidth={2.4} />
              </TouchableOpacity>

              <View style={styles.stepperValueContainer}>
                <Text style={styles.stepperValue}>{recitationAmount}</Text>
                <Text style={styles.stepperUnitLabel}>
                  {recitationUnit ? recitationUnit.toLowerCase() : 'ayahs'}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.stepperButton}
                onPress={handleIncrease}
                activeOpacity={0.7}
                testID="recitation-increase-btn"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Plus size={13} color="#083B32" strokeWidth={2.4} />
              </TouchableOpacity>
            </View>

            <View style={styles.unitPillsRow}>
              {UNIT_OPTIONS.map((unit) => {
                const isSelected = recitationUnit === unit;
                const slug = unit.toLowerCase().replace(/[^a-z0-9]/g, '-');

                return (
                  <TouchableOpacity
                    key={unit}
                    style={[
                      styles.unitPill,
                      isSelected
                        ? styles.unitPillActive
                        : styles.unitPillInactive,
                    ]}
                    onPress={() => setRecitationUnit(unit)}
                    activeOpacity={0.8}
                    testID={`unit-pill-${slug}`}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    {isSelected && (
                      <Check size={10} color="#083B32" strokeWidth={2.4} />
                    )}
                    <Text
                      style={[
                        styles.unitPillText,
                        isSelected && styles.unitPillTextActive,
                      ]}
                      numberOfLines={1}
                    >
                      {unit}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
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
  controls: {
    width: '100%',
    gap: 9,
  },
  frequencyRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  freqPill: {
    flex: 1,
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
    paddingHorizontal: 8,
  },
  freqPillInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E7E4DA',
  },
  freqPillActive: {
    backgroundColor: '#F5EFE3',
    borderColor: '#C8A86B',
  },
  freqPillText: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 12.5,
    color: '#083B32',
  },
  freqPillTextActive: {
    fontFamily: FontFamilies.sansSemiBold,
    fontWeight: '600',
  },
  followUpSection: {
    width: '100%',
    gap: 7,
    alignItems: 'center',
  },
  followUpLabel: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 11.5,
    color: '#57534E',
    textAlign: 'center',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E7E4DA',
    paddingHorizontal: 12,
  },
  stepperButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F4EDDF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  stepperValue: {
    fontFamily: FontFamilies.serifSemiBold,
    fontSize: 20,
    color: '#083B32',
  },
  stepperUnitLabel: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 12,
    color: '#78716C',
  },
  unitPillsRow: {
    flexDirection: 'row',
    gap: 6,
    width: '100%',
  },
  unitPill: {
    flex: 1,
    height: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    gap: 5,
    paddingHorizontal: 4,
  },
  unitPillInactive: {
    backgroundColor: '#FAF9F6',
    borderColor: '#E7E4DA',
  },
  unitPillActive: {
    backgroundColor: '#F5EFE3',
    borderColor: '#C8A86B',
  },
  unitPillText: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 11,
    color: '#78716C',
  },
  unitPillTextActive: {
    fontFamily: FontFamilies.sansMedium,
    fontWeight: '600',
    color: '#083B32',
  },
});
