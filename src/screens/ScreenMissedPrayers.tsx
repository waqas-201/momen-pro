import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import { Heart, Check } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { ArchWatermark } from '../components/ArchWatermark';
import { BrandHeader } from '../components/BrandHeader';
import { StepProgress } from '../components/StepProgress';
import { QuranicReflection } from '../components/QuranicReflection';
import { BottomCTA } from '../components/BottomCTA';
import { useOnboarding } from '../context/OnboardingContext';

interface ScreenMissedPrayersProps {
  onNext: () => void;
  onBack: () => void;
}

export const ScreenMissedPrayers: React.FC<ScreenMissedPrayersProps> = ({
  onNext,
  onBack,
}) => {
  const { missedPrayers, setMissedPrayers, missedNotSure, setMissedNotSure } =
    useOnboarding();

  const handleToggleNotSure = () => {
    setMissedNotSure(!missedNotSure);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ArchWatermark />
        <BrandHeader onBack={onBack} />
        <StepProgress title="A fresh beginning" currentStep={5} totalSteps={6} />

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Qur'anic Reflection */}
          <QuranicReflection
            arabicText="لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ"
            reference="Surah Az-Zumar · 39:53 · excerpt"
            translation="“Do not despair of Allah’s mercy.”"
          />

          {/* Question & Choices */}
          <View style={styles.questionSection}>
            <View style={styles.questionHeader}>
              <Text style={styles.title}>
                How many prayers did you miss last month?
              </Text>
              <Text style={styles.subtitle}>
                For your qaza record, estimate the total missed prayers across the whole month.
              </Text>
            </View>

            <View style={styles.entryContainer}>
              <Text style={styles.entryLabel}>Missed prayers · last month</Text>

              {/* Numeric Input */}
              <View
                style={[
                  styles.inputCard,
                  !missedNotSure && styles.inputCardActive,
                ]}
              >
                <TextInput
                  style={styles.numericInput}
                  value={missedNotSure ? '0' : String(missedPrayers)}
                  onChangeText={(val) => {
                    const parsed = parseInt(val, 10);
                    setMissedPrayers(isNaN(parsed) ? 0 : parsed);
                    if (missedNotSure) setMissedNotSure(false);
                  }}
                  keyboardType="number-pad"
                  editable={!missedNotSure}
                  testID="missed-prayers-input"
                />
                <View style={styles.caret} />
                <Text style={styles.suffixText}>prayers in total</Text>
              </View>

              {/* "I'm not sure" Option Card */}
              <TouchableOpacity
                style={[
                  styles.notSureCard,
                  missedNotSure && styles.notSureCardActive,
                ]}
                onPress={handleToggleNotSure}
                activeOpacity={0.8}
                testID="missed-not-sure-option"
              >
                <Text
                  style={[
                    styles.notSureText,
                    missedNotSure && styles.notSureTextActive,
                  ]}
                >
                  I’m not sure
                </Text>
                <View
                  style={[
                    styles.indicatorCircle,
                    missedNotSure && styles.indicatorCircleActive,
                  ]}
                >
                  {missedNotSure && (
                    <Check size={12} color={Colors.textLight} strokeWidth={3} />
                  )}
                </View>
              </TouchableOpacity>
            </View>

            {/* Gentle Guidance Banner */}
            <View style={styles.guidanceBanner}>
              <Heart size={18} color={Colors.gold} strokeWidth={2.2} />
              <Text style={styles.guidanceText}>
                An estimate is enough for now. You can update your record later.
              </Text>
            </View>
          </View>
        </ScrollView>

        <BottomCTA
          title="Continue"
          subtitle="A little reflection. A gentler beginning."
          onPress={onNext}
          testID="missed-prayers-continue-btn"
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
  entryContainer: {
    gap: 10,
    marginTop: 2,
  },
  entryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 62,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 18,
    gap: 12,
  },
  inputCardActive: {
    borderColor: Colors.primary,
  },
  numericInput: {
    fontSize: 26,
    fontWeight: '600',
    color: Colors.primary,
    minWidth: 32,
    padding: 0,
  },
  caret: {
    width: 1,
    height: 25,
    backgroundColor: Colors.gold,
  },
  suffixText: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  notSureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  notSureCardActive: {
    backgroundColor: Colors.surfaceActive,
    borderColor: Colors.primary,
  },
  notSureText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
  },
  notSureTextActive: {
    fontWeight: '600',
  },
  indicatorCircle: {
    width: 20,
    height: 20,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorCircleActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  guidanceBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    borderRadius: 12,
    backgroundColor: Colors.surfaceWarm,
    gap: 10,
    marginTop: 4,
  },
  guidanceText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 21,
    color: Colors.textSecondary,
  },
});
