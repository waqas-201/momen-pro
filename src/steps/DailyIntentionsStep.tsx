import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  Sun,
  Sparkles,
  BookOpen,
  Heart,
  RotateCcw,
  Minus,
  Plus,
  ChevronDown,
  Check,
} from 'lucide-react-native';
import { FontFamilies } from '../theme/typography';
import { QuranicReflection } from '../components/QuranicReflection';
import { StageBeat } from '../flow/StageBeat';
import { useOnboarding } from '../context/OnboardingContext';
import { DHIKR_LABELS } from './dhikrData';

export const DailyIntentionsStep: React.FC = () => {
  const {
    userName,
    targetPrayers,
    setTargetPrayers,
    targetDarood,
    setTargetDarood,
    adhkarRoutines,
    toggleAdhkarRoutine,
    targetRecitation,
    setTargetRecitation,
    recitationUnit,
    setRecitationUnit,
    missedPrayers,
    targetQadha,
    setTargetQadha,
  } = useOnboarding();

  const activeRoutines = adhkarRoutines.filter((r) => r !== 'No current routine');

  const cycleRecitationUnit = () => {
    const units = ['Ayahs', 'Ruku', 'Para (Juz)'];
    const currentIndex = units.indexOf(recitationUnit);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % units.length;
    setRecitationUnit(units[nextIndex]);
  };

  const greeting = userName.trim()
    ? `${userName.trim()}, set your daily intentions.`
    : 'Set your daily intentions.';

  return (
    <View style={styles.mainContent}>
      <QuranicReflection
        arabicText="فَاسْتَبِقُوا الْخَيْرَاتِ"
        reference="Surah Al-Baqarah · 2:148 · excerpt"
        translation="“So compete in good deeds.”"
      />

      <View style={styles.questionSection}>
        <Text style={styles.title}>{greeting}</Text>
        <Text style={styles.subtitle}>
          Start with achievable goals. Adjust them any time later.
        </Text>
      </View>

      <StageBeat style={styles.targetsContainer}>
        {/* 1. Prayer */}
        <View style={styles.targetRow}>
          <View style={styles.targetLabelGroup}>
            <Sun size={15} color="#083B32" strokeWidth={2.2} />
            <Text style={styles.targetTitle}>Prayer</Text>
          </View>
          <View style={styles.stepperGroup}>
            <TouchableOpacity
              style={styles.stepperBtn}
              onPress={() => setTargetPrayers((prev) => Math.max(1, prev - 1))}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              testID="target-prayer-minus"
              activeOpacity={0.7}
            >
              <Minus size={11} color="#083B32" strokeWidth={2.4} />
            </TouchableOpacity>
            <View style={styles.valueGroup}>
              <Text style={styles.numberText}>{targetPrayers}</Text>
              <Text style={styles.unitText}>/ day</Text>
            </View>
            <TouchableOpacity
              style={styles.stepperBtn}
              onPress={() => setTargetPrayers((prev) => Math.min(5, prev + 1))}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              testID="target-prayer-plus"
              activeOpacity={0.7}
            >
              <Plus size={11} color="#083B32" strokeWidth={2.4} />
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. Darood o Salam */}
        <View style={styles.targetRow}>
          <View style={styles.targetLabelGroup}>
            <Heart size={15} color="#083B32" strokeWidth={2.2} />
            <Text style={styles.targetTitle}>Darood</Text>
          </View>
          <View style={styles.stepperGroup}>
            <TouchableOpacity
              style={styles.stepperBtn}
              onPress={() => setTargetDarood((prev) => Math.max(0, prev - 10))}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              testID="target-darood-minus"
              activeOpacity={0.7}
            >
              <Minus size={11} color="#083B32" strokeWidth={2.4} />
            </TouchableOpacity>
            <View style={styles.valueGroup}>
              <Text style={styles.numberText}>{targetDarood > 0 ? targetDarood : '0'}</Text>
              <Text style={styles.unitText}>{targetDarood > 0 ? '/ day' : 'none'}</Text>
            </View>
            <TouchableOpacity
              style={styles.stepperBtn}
              onPress={() => setTargetDarood((prev) => prev + 10)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              testID="target-darood-plus"
              activeOpacity={0.7}
            >
              <Plus size={11} color="#083B32" strokeWidth={2.4} />
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. Dhikr (Non-numeric spiritual routines) */}
        <View style={styles.dhikrCard}>
          <View style={styles.targetRowInner}>
            <View style={styles.targetLabelGroup}>
              <Sparkles size={15} color="#083B32" strokeWidth={2.2} />
              <Text style={styles.targetTitle}>Dhikr</Text>
            </View>
            <Text style={styles.routineStatusText}>
              {activeRoutines.length === 0
                ? 'No routine'
                : `${activeRoutines.length} routine${activeRoutines.length > 1 ? 's' : ''}`}
            </Text>
          </View>

          <View style={styles.routinesRow}>
            {activeRoutines.length === 0 ? (
              <Text style={styles.noRoutineNote}>
                No routines selected. You can add them anytime.
              </Text>
            ) : (
              activeRoutines.map((routineId) => {
                const label = DHIKR_LABELS[routineId] ?? routineId;
                const slug = label.toLowerCase().replace(/\s+/g, '-');
                return (
                  <TouchableOpacity
                    key={routineId}
                    style={[styles.routinePill, styles.routinePillActive]}
                    onPress={() => toggleAdhkarRoutine(routineId)}
                    activeOpacity={0.7}
                    testID={`intention-dhikr-${slug}`}
                    hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                  >
                    <Check size={9} color="#083B32" strokeWidth={2.8} />
                    <Text
                      style={[
                        styles.routinePillText,
                        styles.routinePillTextActive,
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </View>

        {/* 4. Qur'an */}
        <View style={styles.targetRow}>
          <View style={styles.targetLabelGroup}>
            <BookOpen size={15} color="#083B32" strokeWidth={2.2} />
            <Text style={styles.targetTitle}>Qur’an</Text>
          </View>
          <View style={styles.stepperGroup}>
            <TouchableOpacity
              style={styles.stepperBtn}
              onPress={() => setTargetRecitation((prev) => Math.max(1, prev - 1))}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              testID="target-recitation-minus"
              activeOpacity={0.7}
            >
              <Minus size={11} color="#083B32" strokeWidth={2.4} />
            </TouchableOpacity>
            <View style={styles.valueGroup}>
              <Text style={styles.numberText}>{targetRecitation}</Text>
              <TouchableOpacity
                style={styles.unitSelector}
                onPress={cycleRecitationUnit}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 6, right: 6 }}
                testID="target-recitation-unit-toggle"
              >
                <Text style={styles.unitText}>
                  {recitationUnit ? recitationUnit.toLowerCase() : 'ayahs'}
                </Text>
                <ChevronDown size={10} color="#78716C" strokeWidth={2.2} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.stepperBtn}
              onPress={() => setTargetRecitation((prev) => prev + 1)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              testID="target-recitation-plus"
              activeOpacity={0.7}
            >
              <Plus size={11} color="#083B32" strokeWidth={2.4} />
            </TouchableOpacity>
          </View>
        </View>

        {/* 5. Qadha Makeup (Optional, can be decreased to 0 / left empty) */}
        {(missedPrayers > 0 || targetQadha > 0) && (
          <View style={styles.targetRow}>
            <View style={styles.targetLabelGroup}>
              <RotateCcw size={15} color="#083B32" strokeWidth={2.2} />
              <View>
                <Text style={styles.targetTitle}>Qadha</Text>
                <Text style={styles.targetSubtitle}>makeup goal</Text>
              </View>
            </View>
            <View style={styles.stepperGroup}>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => setTargetQadha((prev) => Math.max(0, prev - 1))}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                testID="target-qadha-minus"
                activeOpacity={0.7}
              >
                <Minus size={11} color="#083B32" strokeWidth={2.4} />
              </TouchableOpacity>
              <View style={styles.valueGroup}>
                <Text style={styles.numberText}>{targetQadha > 0 ? targetQadha : '0'}</Text>
                <Text style={styles.unitText}>{targetQadha > 0 ? '/ day' : 'none'}</Text>
              </View>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => setTargetQadha((prev) => Math.min(5, prev + 1))}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                testID="target-qadha-plus"
                activeOpacity={0.7}
              >
                <Plus size={11} color="#083B32" strokeWidth={2.4} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        <Text style={styles.footnote}>
          Every deed done consistently, even if small, is beloved to Allah.
        </Text>
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
    fontSize: 22,
    lineHeight: 27,
    textAlign: 'center',
    color: '#083B32',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
    color: '#57534E',
    paddingHorizontal: 10,
  },
  targetsContainer: {
    width: '100%',
    gap: 6,
  },
  targetRow: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E7E4DA',
    backgroundColor: '#FFFFFF',
  },
  dhikrCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E7E4DA',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 13,
    paddingVertical: 8,
    gap: 7,
  },
  targetRowInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  routineStatusText: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 11,
    color: '#78716C',
  },
  routinesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    paddingTop: 1,
  },
  routinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  routinePillActive: {
    backgroundColor: '#F5EFE3',
    borderColor: '#C8A86B',
  },
  routinePillInactive: {
    backgroundColor: '#FAF9F6',
    borderColor: '#E7E4DA',
  },
  routinePillText: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 10,
    color: '#78716C',
  },
  routinePillTextActive: {
    fontFamily: FontFamilies.sansSemiBold,
    color: '#083B32',
  },
  targetLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  targetTitle: {
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 13,
    color: '#083B32',
  },
  targetSubtitle: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 9,
    color: '#78716C',
    marginTop: -2,
  },
  stepperGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepperBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F4EDDF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    minWidth: 50,
    justifyContent: 'center',
  },
  numberText: {
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 16,
    color: '#083B32',
  },
  unitText: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 11,
    color: '#78716C',
  },
  unitSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  noRoutineNote: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 11,
    color: '#78716C',
    fontStyle: 'italic',
  },
  footnote: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 10.5,
    color: '#78716C',
    textAlign: 'center',
    marginTop: 2,
  },
});
