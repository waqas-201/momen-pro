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
import { Sun, Sparkles, BookOpen, Minus, Plus } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { ArchWatermark } from '../components/ArchWatermark';
import { BrandHeader } from '../components/BrandHeader';
import { StepProgress } from '../components/StepProgress';
import { QuranicReflection } from '../components/QuranicReflection';
import { BottomCTA } from '../components/BottomCTA';
import { useOnboarding } from '../context/OnboardingContext';

interface ScreenDailyIntentionsProps {
  onNext: () => void;
  onBack: () => void;
}

export const ScreenDailyIntentions: React.FC<ScreenDailyIntentionsProps> = ({
  onNext,
  onBack,
}) => {
  const {
    targetPrayers,
    setTargetPrayers,
    targetDhikr,
    setTargetDhikr,
    targetRecitation,
    setTargetRecitation,
    recitationUnit,
  } = useOnboarding();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ArchWatermark />
        <BrandHeader onBack={onBack} />
        <StepProgress title="Your daily intentions" currentStep={6} totalSteps={6} />

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Qur'anic Reflection */}
          <QuranicReflection
            arabicText="فَاسْتَبِقُوا الْخَيْرَاتِ"
            reference="Surah Al-Baqarah · 2:148 · excerpt"
            translation="“So compete in good deeds.”"
          />

          {/* Question & Targets */}
          <View style={styles.questionSection}>
            <View style={styles.questionHeader}>
              <Text style={styles.title}>Set your daily intentions.</Text>
              <Text style={styles.subtitle}>
                Start with achievable goals. Adjust these now, or change them any time later.
              </Text>
            </View>

            <View style={styles.targetsList}>
              {/* Target 1: Prayer */}
              <View style={styles.targetCard}>
                <View style={styles.targetLabelRow}>
                  <Sun size={17} color={Colors.primary} strokeWidth={2.2} />
                  <Text style={styles.targetTitle}>Prayer</Text>
                </View>
                <View style={styles.controlRow}>
                  <TouchableOpacity
                    style={styles.stepBtn}
                    onPress={() => setTargetPrayers(prev => Math.max(1, prev - 1))}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    testID="target-prayer-minus"
                  >
                    <Minus size={13} color={Colors.primary} strokeWidth={2.4} />
                  </TouchableOpacity>

                  <View style={styles.valueRow}>
                    <Text style={styles.numberText}>{targetPrayers}</Text>
                    <Text style={styles.unitText}>prayers / day</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.stepBtn}
                    onPress={() => setTargetPrayers(prev => Math.min(5, prev + 1))}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    testID="target-prayer-plus"
                  >
                    <Plus size={13} color={Colors.primary} strokeWidth={2.4} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Target 2: Dhikr */}
              <View style={styles.targetCard}>
                <View style={styles.targetLabelRow}>
                  <Sparkles size={17} color={Colors.primary} strokeWidth={2.2} />
                  <Text style={styles.targetTitle}>Dhikr</Text>
                </View>
                <View style={styles.controlRow}>
                  <TouchableOpacity
                    style={styles.stepBtn}
                    onPress={() => setTargetDhikr(prev => Math.max(10, prev - 10))}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    testID="target-dhikr-minus"
                  >
                    <Minus size={13} color={Colors.primary} strokeWidth={2.4} />
                  </TouchableOpacity>

                  <View style={styles.valueRow}>
                    <Text style={styles.numberText}>{targetDhikr}</Text>
                    <Text style={styles.unitText}>remembrances / day</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.stepBtn}
                    onPress={() => setTargetDhikr(prev => prev + 10)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    testID="target-dhikr-plus"
                  >
                    <Plus size={13} color={Colors.primary} strokeWidth={2.4} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Target 3: Qur'an recitation */}
              <View style={styles.targetCard}>
                <View style={styles.targetLabelRow}>
                  <BookOpen size={17} color={Colors.primary} strokeWidth={2.2} />
                  <Text style={styles.targetTitle}>Qur’an recitation</Text>
                </View>
                <View style={styles.controlRow}>
                  <TouchableOpacity
                    style={styles.stepBtn}
                    onPress={() => setTargetRecitation(prev => Math.max(1, prev - 1))}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    testID="target-recitation-minus"
                  >
                    <Minus size={13} color={Colors.primary} strokeWidth={2.4} />
                  </TouchableOpacity>

                  <View style={styles.valueRow}>
                    <Text style={styles.numberText}>{targetRecitation}</Text>
                    <Text style={styles.unitText}>
                      {recitationUnit.toLowerCase()} / day
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.stepBtn}
                    onPress={() => setTargetRecitation(prev => prev + 1)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    testID="target-recitation-plus"
                  >
                    <Plus size={13} color={Colors.primary} strokeWidth={2.4} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <Text style={styles.footnote}>
              Dhikr total includes your selected adhkar.
            </Text>
          </View>
        </ScrollView>

        <BottomCTA
          title="Save my goals"
          subtitle="A little reflection. A gentler beginning."
          onPress={onNext}
          testID="save-goals-btn"
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
  targetsList: {
    gap: 8,
    marginTop: 2,
  },
  targetCard: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  targetLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  targetTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepBtn: {
    width: 30,
    height: 30,
    borderRadius: 9999,
    backgroundColor: Colors.surfaceWarm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 7,
  },
  numberText: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.primary,
  },
  unitText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  footnote: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 17,
    marginTop: 2,
  },
});
