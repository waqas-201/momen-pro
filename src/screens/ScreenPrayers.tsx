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
import { Check } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { ArchWatermark } from '../components/ArchWatermark';
import { BrandHeader } from '../components/BrandHeader';
import { StepProgress } from '../components/StepProgress';
import { QuranicReflection } from '../components/QuranicReflection';
import { BottomCTA } from '../components/BottomCTA';
import { useOnboarding } from '../context/OnboardingContext';

interface ScreenPrayersProps {
  onNext: () => void;
  onBack: () => void;
}

const PRAYER_OPTIONS = [
  { value: '0', label: 'Not yet' },
  { value: '1–2', label: 'prayers' },
  { value: '3–4', label: 'prayers' },
  { value: '5', label: 'prayers' },
];

export const ScreenPrayers: React.FC<ScreenPrayersProps> = ({ onNext, onBack }) => {
  const { dailyPrayersCount, setDailyPrayersCount } = useOnboarding();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ArchWatermark />
        <BrandHeader onBack={onBack} />
        <StepProgress title="Your prayers" currentStep={1} totalSteps={6} />

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Qur'anic Reflection */}
          <QuranicReflection
            arabicText="وَأَقِمِ الصَّلَاةَ لِذِكْرِي"
            reference="Surah Ta-Ha · 20:14 · excerpt"
            translation="“Establish prayer for My remembrance.”"
          />

          {/* Question & Choices */}
          <View style={styles.questionSection}>
            <View style={styles.questionHeader}>
              <Text style={styles.title}>
                How many prayers do you usually offer each day?
              </Text>
              <Text style={styles.subtitle}>
                Of the five daily prayers, choose what reflects your days right now.
              </Text>
            </View>

            <View style={styles.optionsList}>
              {PRAYER_OPTIONS.map((option) => {
                const isSelected = dailyPrayersCount === option.value;
                return (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionCard,
                      isSelected && styles.optionCardActive,
                    ]}
                    onPress={() => setDailyPrayersCount(option.value)}
                    activeOpacity={0.8}
                    testID={`prayer-option-${option.value}`}
                  >
                    <Text style={styles.optionNumber}>{option.value}</Text>
                    <Text
                      style={[
                        styles.optionLabel,
                        isSelected && styles.optionLabelActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                    <View
                      style={[
                        styles.indicatorCircle,
                        isSelected && styles.indicatorCircleActive,
                      ]}
                    >
                      {isSelected && (
                        <Check size={12} color={Colors.textLight} strokeWidth={3} />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.footnote}>
              Every beginning matters. There’s no judgment here.
            </Text>
          </View>
        </ScrollView>

        <BottomCTA
          title="Continue"
          subtitle="A little reflection. A gentler beginning."
          onPress={onNext}
          testID="prayers-continue-btn"
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
  optionsList: {
    gap: 8,
    marginTop: 2,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  optionCardActive: {
    backgroundColor: Colors.surfaceActive,
    borderColor: Colors.primary,
  },
  optionNumber: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'Cormorant Garamond, Georgia, serif' }),
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 22,
    color: Colors.primary,
    width: 36,
  },
  optionLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 18,
    color: Colors.primary,
  },
  optionLabelActive: {
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
  footnote: {
    fontSize: 13,
    lineHeight: 21,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
