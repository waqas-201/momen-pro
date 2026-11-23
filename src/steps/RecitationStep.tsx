import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Minus, Plus, Check, BookOpen } from 'lucide-react-native';
import { FontFamilies } from '../theme/typography';
import { QuranicReflection } from '../components/QuranicReflection';
import { StageBeat } from '../flow/StageBeat';
import { useOnboarding } from '../context/OnboardingContext';

const UNIT_OPTIONS = ['Ayahs', 'Pages', 'Ruku', 'Para (Juz)'];
const QUICK_RECITATION_PILLS: Record<string, number[]> = {
  Ayahs: [5, 10, 20, 50],
  Pages: [1, 2, 4, 10],
  Ruku: [1, 2, 3, 5],
  'Para (Juz)': [0.25, 0.5, 1],
};

export const RecitationStep: React.FC = () => {
  const {
    recitesEveryDay,
    setRecitesEveryDay,
    recitationAmount,
    setRecitationAmount,
    recitationUnit,
    setRecitationUnit,
    targetRecitation,
    setTargetRecitation,
  } = useOnboarding();

  const isStartingFresh = recitesEveryDay === 'Not yet' || targetRecitation === 0;

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

  const handleSelectUnit = (unit: string) => {
    setRecitationUnit(unit);
    if (isStartingFresh) {
      setRecitesEveryDay('Yes');
      const defaultAmount = unit === 'Pages' || unit === 'Ruku' ? 2 : unit === 'Para (Juz)' ? 1 : 10;
      setRecitationAmount(defaultAmount);
      setTargetRecitation(defaultAmount);
    }
  };

  const handleQuickPill = (val: number) => {
    setRecitationAmount(val);
    setTargetRecitation(val);
    setRecitesEveryDay('Yes');
  };

  const handleToggleFresh = () => {
    if (isStartingFresh) {
      setRecitesEveryDay('Yes');
      setRecitationAmount(10);
      setTargetRecitation(10);
    } else {
      setRecitesEveryDay('Not yet');
      setTargetRecitation(0);
    }
  };

  const currentPills = QUICK_RECITATION_PILLS[recitationUnit] ?? QUICK_RECITATION_PILLS.Ayahs;

  return (
    <View style={styles.mainContent}>
      <QuranicReflection
        arabicText="وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا"
        reference="Surah Al-Muzzammil · 73:4 · excerpt"
        translation="“Recite the Qur’an with measured recitation.”"
      />

      <View style={styles.questionSection}>
        <Text style={styles.title}>Set your daily Qur’an intention</Text>
        <Text style={styles.subtitle}>
          Choose your daily recitation target. Even a single ayah brings light.
        </Text>
      </View>

      <StageBeat style={styles.controls}>
        {/* Main Target Stepper Card */}
        {!isStartingFresh && (
          <View style={styles.stepperContainer}>
            <View style={styles.stepperRow}>
              <TouchableOpacity
                style={styles.stepperButton}
                onPress={handleDecrease}
                activeOpacity={0.7}
                testID="recitation-decrease-btn"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Minus size={14} color="#083B32" strokeWidth={2.4} />
              </TouchableOpacity>

              <View style={styles.stepperValueContainer}>
                <Text style={styles.stepperValue}>{recitationAmount}</Text>
                <Text style={styles.stepperUnitLabel}>
                  {recitationUnit ? recitationUnit.toLowerCase() : 'ayahs'} / day
                </Text>
              </View>

              <TouchableOpacity
                style={styles.stepperButton}
                onPress={handleIncrease}
                activeOpacity={0.7}
                testID="recitation-increase-btn"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Plus size={14} color="#083B32" strokeWidth={2.4} />
              </TouchableOpacity>
            </View>

            {/* Quick amount pills for the active unit */}
            <View style={styles.quickPillsRow}>
              {currentPills.map((val) => {
                const isActive = recitationAmount === val;
                return (
                  <TouchableOpacity
                    key={val}
                    style={[
                      styles.quickPill,
                      isActive ? styles.quickPillActive : styles.quickPillInactive,
                    ]}
                    onPress={() => handleQuickPill(val)}
                    activeOpacity={0.7}
                    testID={`recitation-pill-${val}`}
                  >
                    <Text
                      style={[
                        styles.quickPillText,
                        isActive && styles.quickPillTextActive,
                      ]}
                    >
                      {val}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Unit Selector Pills */}
        <View style={styles.unitPillsRow}>
          {UNIT_OPTIONS.map((unit) => {
            const isSelected = recitationUnit === unit;
            const slug = unit.toLowerCase().replace(/[^a-z0-9]/g, '-');

            return (
              <TouchableOpacity
                key={unit}
                style={[
                  styles.unitPill,
                  isSelected ? styles.unitPillActive : styles.unitPillInactive,
                ]}
                onPress={() => handleSelectUnit(unit)}
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

        {/* Start fresh option */}
        <TouchableOpacity
          style={[
            styles.freshCard,
            isStartingFresh ? styles.freshCardActive : styles.freshCardInactive,
          ]}
          onPress={handleToggleFresh}
          activeOpacity={0.8}
          testID="recitation-not-yet-btn"
        >
          <View style={styles.freshLeft}>
            <BookOpen
              size={15}
              color={isStartingFresh ? '#083B32' : '#78716C'}
              strokeWidth={2}
            />
            <Text
              style={[
                styles.freshLabel,
                isStartingFresh && styles.freshLabelActive,
              ]}
            >
              I am starting fresh with Qur’an
            </Text>
          </View>
          <View
            style={[
              styles.indicatorCircle,
              isStartingFresh
                ? styles.indicatorCircleActive
                : styles.indicatorCircleInactive,
            ]}
          >
            {isStartingFresh && (
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
  controls: {
    width: '100%',
    gap: 10,
  },
  stepperContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E7E4DA',
    padding: 12,
    gap: 10,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  stepperButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F4EDDF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValueContainer: {
    alignItems: 'center',
    gap: 2,
  },
  stepperValue: {
    fontFamily: FontFamilies.serifSemiBold,
    fontSize: 32,
    lineHeight: 36,
    color: '#083B32',
  },
  stepperUnitLabel: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 12,
    color: '#78716C',
  },
  quickPillsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  quickPill: {
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
  },
  quickPillInactive: {
    backgroundColor: '#FDFCF9',
    borderColor: '#E7E4DA',
  },
  quickPillActive: {
    backgroundColor: '#083B32',
    borderColor: '#083B32',
  },
  quickPillText: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 11,
    color: '#57534E',
  },
  quickPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  unitPillsRow: {
    flexDirection: 'row',
    gap: 6,
    width: '100%',
  },
  unitPill: {
    flex: 1,
    height: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    gap: 4,
    paddingHorizontal: 4,
  },
  unitPillInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E7E4DA',
  },
  unitPillActive: {
    backgroundColor: '#F5EFE3',
    borderColor: '#C8A86B',
  },
  unitPillText: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 11.5,
    color: '#57534E',
  },
  unitPillTextActive: {
    color: '#083B32',
    fontFamily: FontFamilies.sansSemiBold,
    fontWeight: '600',
  },
  freshCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
  },
  freshCardInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E7E4DA',
  },
  freshCardActive: {
    backgroundColor: '#F5EFE3',
    borderColor: '#C8A86B',
  },
  freshLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  freshLabel: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 12.5,
    color: '#57534E',
  },
  freshLabelActive: {
    fontFamily: FontFamilies.sansSemiBold,
    color: '#083B32',
    fontWeight: '600',
  },
  indicatorCircle: {
    width: 17,
    height: 17,
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
