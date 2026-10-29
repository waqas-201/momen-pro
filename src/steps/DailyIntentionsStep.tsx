import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Sun, Sparkles, BookOpen, Minus, Plus, ChevronDown } from 'lucide-react-native';
import { FontFamilies } from '../theme/typography';
import { QuranicReflection } from '../components/QuranicReflection';
import { StageBeat } from '../flow/StageBeat';
import { useOnboarding } from '../context/OnboardingContext';

export const DailyIntentionsStep: React.FC = () => {
  const {
    targetPrayers,
    setTargetPrayers,
    targetDhikr,
    setTargetDhikr,
    targetRecitation,
    setTargetRecitation,
    recitationUnit,
    setRecitationUnit,
  } = useOnboarding();

  const cycleRecitationUnit = () => {
    const units = ['Ayahs', 'Ruku', 'Para (Juz)'];
    const currentIndex = units.indexOf(recitationUnit);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % units.length;
    setRecitationUnit(units[nextIndex]);
  };

  return (
    <View style={styles.mainContent}>
      <QuranicReflection
        arabicText="فَاسْتَبِقُوا الْخَيْرَاتِ"
        reference="Surah Al-Baqarah · 2:148 · excerpt"
        translation="“So compete in good deeds.”"
      />

      <View style={styles.questionSection}>
        <Text style={styles.title}>Set your daily intentions.</Text>
        <Text style={styles.subtitle}>
          Start with achievable goals. Adjust them any time later.
        </Text>
      </View>

      <StageBeat style={styles.targetsContainer}>
        <View style={styles.targetRow}>
          <View style={styles.targetLabelGroup}>
            <Sun size={16} color="#083B32" strokeWidth={2.2} />
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
              <Minus size={12} color="#083B32" strokeWidth={2.4} />
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
              <Plus size={12} color="#083B32" strokeWidth={2.4} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.targetRow}>
          <View style={styles.targetLabelGroup}>
            <Sparkles size={16} color="#083B32" strokeWidth={2.2} />
            <Text style={styles.targetTitle}>Dhikr</Text>
          </View>
          <View style={styles.stepperGroup}>
            <TouchableOpacity
              style={styles.stepperBtn}
              onPress={() => setTargetDhikr((prev) => Math.max(10, prev - 10))}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              testID="target-dhikr-minus"
              activeOpacity={0.7}
            >
              <Minus size={12} color="#083B32" strokeWidth={2.4} />
            </TouchableOpacity>
            <View style={styles.valueGroup}>
              <Text style={styles.numberText}>{targetDhikr}</Text>
              <Text style={styles.unitText}>/ day</Text>
            </View>
            <TouchableOpacity
              style={styles.stepperBtn}
              onPress={() => setTargetDhikr((prev) => prev + 10)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              testID="target-dhikr-plus"
              activeOpacity={0.7}
            >
              <Plus size={12} color="#083B32" strokeWidth={2.4} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.targetRow}>
          <View style={styles.targetLabelGroup}>
            <BookOpen size={16} color="#083B32" strokeWidth={2.2} />
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
              <Minus size={12} color="#083B32" strokeWidth={2.4} />
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
              <Plus size={12} color="#083B32" strokeWidth={2.4} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.footnote}>
          Dhikr total includes your selected adhkar routines.
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
  targetsContainer: {
    width: '100%',
    gap: 7,
  },
  targetRow: {
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E7E4DA',
    backgroundColor: '#FFFFFF',
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
  stepperGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepperBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F4EDDF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    minWidth: 54,
    justifyContent: 'center',
  },
  numberText: {
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 17,
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
    gap: 3,
  },
  footnote: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 10.5,
    color: '#78716C',
    textAlign: 'center',
    marginTop: 2,
  },
});
