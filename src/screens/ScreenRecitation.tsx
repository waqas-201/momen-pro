import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import { Minus, Plus, Check } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { ArchWatermark } from '../components/ArchWatermark';
import { BrandHeader } from '../components/BrandHeader';
import { StepProgress } from '../components/StepProgress';
import { QuranicReflection } from '../components/QuranicReflection';
import { BottomCTA } from '../components/BottomCTA';
import { useOnboarding } from '../context/OnboardingContext';

interface ScreenRecitationProps {
  onNext: () => void;
  onBack: () => void;
}

const FREQUENCY_OPTIONS = ['Yes', 'Sometimes', 'Not yet'];
const UNIT_OPTIONS = ['Ayahs', 'Ruku', 'Para (Juz)'];

export const ScreenRecitation: React.FC<ScreenRecitationProps> = ({
  onNext,
  onBack,
}) => {
  const {
    recitesEveryDay,
    setRecitesEveryDay,
    recitationAmount,
    setRecitationAmount,
    recitationUnit,
    setRecitationUnit,
  } = useOnboarding();

  const handleDecrease = () => {
    setRecitationAmount(prev => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    setRecitationAmount(prev => prev + 1);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ArchWatermark />
        <BrandHeader onBack={onBack} />
        <StepProgress title="Your recitation" currentStep={4} totalSteps={6} />

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Qur'anic Reflection */}
          <QuranicReflection
            arabicText="وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا"
            reference="Surah Al-Muzzammil · 73:4 · excerpt"
            translation="“Recite the Qur’an with measured recitation.”"
          />

          {/* Question & Choices */}
          <View style={styles.questionSection}>
            <View style={styles.questionHeader}>
              <Text style={styles.title}>Do you recite the Qur’an every day?</Text>
              <Text style={styles.subtitle}>
                A few verses or a longer reading — every moment with the Qur’an matters.
              </Text>
            </View>

            {/* Frequency Selection Pills */}
            <View style={styles.pillsRow}>
              {FREQUENCY_OPTIONS.map((freq) => {
                const isSelected = recitesEveryDay === freq;
                return (
                  <TouchableOpacity
                    key={freq}
                    style={[
                      styles.freqPill,
                      isSelected && styles.freqPillActive,
                    ]}
                    onPress={() => setRecitesEveryDay(freq)}
                    activeOpacity={0.8}
                    testID={`freq-pill-${freq.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  >
                    {isSelected && (
                      <Check size={12} color={Colors.textLight} strokeWidth={2.6} />
                    )}
                    <Text
                      style={[
                        styles.freqText,
                        isSelected && styles.freqTextActive,
                      ]}
                    >
                      {freq}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Recitation Amount Stepper */}
            <View style={styles.followUpCard}>
              <Text style={styles.followUpTitle}>How much do you usually recite?</Text>

              <View style={styles.stepperContainer}>
                <TouchableOpacity
                  style={styles.stepperButton}
                  onPress={handleDecrease}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  testID="recitation-decrease-btn"
                >
                  <Minus size={15} color={Colors.primary} strokeWidth={2.4} />
                </TouchableOpacity>

                <View style={styles.stepperValueContainer}>
                  <Text style={styles.stepperNumber}>{recitationAmount}</Text>
                  <Text style={styles.stepperUnit}>per day</Text>
                </View>

                <TouchableOpacity
                  style={styles.stepperButton}
                  onPress={handleIncrease}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  testID="recitation-increase-btn"
                >
                  <Plus size={15} color={Colors.primary} strokeWidth={2.4} />
                </TouchableOpacity>
              </View>

              {/* Unit Pills */}
              <View style={styles.pillsRow}>
                {UNIT_OPTIONS.map((unit) => {
                  const isSelected = recitationUnit === unit;
                  return (
                    <TouchableOpacity
                      key={unit}
                      style={[
                        styles.unitPill,
                        isSelected && styles.unitPillActive,
                      ]}
                      onPress={() => setRecitationUnit(unit)}
                      activeOpacity={0.8}
                      testID={`unit-pill-${unit.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    >
                      {isSelected && (
                        <Check size={12} color={Colors.textLight} strokeWidth={2.6} />
                      )}
                      <Text
                        style={[
                          styles.unitText,
                          isSelected && styles.unitTextActive,
                        ]}
                      >
                        {unit}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={styles.rhythmCaption}>
                Your current rhythm: {recitationAmount} {recitationUnit.toLowerCase()} each day.
              </Text>
            </View>
          </View>
        </ScrollView>

        <BottomCTA
          title="Continue"
          subtitle="A little reflection. A gentler beginning."
          onPress={onNext}
          testID="recitation-continue-btn"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  questionSection: {
    paddingHorizontal: 24,
    paddingTop: 8,
    gap: 14,
  },
  questionHeader: {
    gap: 6,
  },
  title: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'Cormorant Garamond, Georgia, serif' }),
    fontSize: 29,
    fontWeight: '600',
    lineHeight: 32,
    color: Colors.primary,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 21,
    color: Colors.textSecondary,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  freqPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 9999,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 7,
  },
  freqPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  freqText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary,
  },
  freqTextActive: {
    color: Colors.textLight,
  },
  followUpCard: {
    paddingVertical: 14,
    gap: 12,
  },
  followUpTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 58,
  },
  stepperButton: {
    width: 34,
    height: 34,
    borderRadius: 9999,
    backgroundColor: Colors.surfaceWarm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  stepperNumber: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.primary,
  },
  stepperUnit: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  unitPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 9999,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  unitPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  unitText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary,
  },
  unitTextActive: {
    color: Colors.textLight,
  },
  rhythmCaption: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginTop: 2,
  },
});
