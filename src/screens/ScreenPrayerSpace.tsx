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
import { Landmark, Home, Building2, MapPin, Check } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { ArchWatermark } from '../components/ArchWatermark';
import { BrandHeader } from '../components/BrandHeader';
import { StepProgress } from '../components/StepProgress';
import { QuranicReflection } from '../components/QuranicReflection';
import { BottomCTA } from '../components/BottomCTA';
import { useOnboarding } from '../context/OnboardingContext';

interface ScreenPrayerSpaceProps {
  onNext: () => void;
  onBack: () => void;
}

const SPACES = [
  { value: 'Mosque', label: 'Mosque', icon: Landmark },
  { value: 'Home', label: 'Home', icon: Home },
  { value: 'Work / school', label: 'Work / school', icon: Building2 },
  { value: 'It varies', label: 'It varies', icon: MapPin },
];

export const ScreenPrayerSpace: React.FC<ScreenPrayerSpaceProps> = ({
  onNext,
  onBack,
}) => {
  const { prayerSpace, setPrayerSpace } = useOnboarding();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ArchWatermark />
        <BrandHeader onBack={onBack} />
        <StepProgress title="Your prayer space" currentStep={2} totalSteps={6} />

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Qur'anic Reflection */}
          <QuranicReflection
            arabicText="إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ"
            reference="Surah Al-‘Ankabut · 29:45 · excerpt"
            translation="“Indeed, prayer restrains from shameful and unjust deeds.”"
          />

          {/* Question & Choices */}
          <View style={styles.questionSection}>
            <View style={styles.questionHeader}>
              <Text style={styles.title}>Where do you usually pray?</Text>
              <Text style={styles.subtitle}>
                Choose the place that feels most familiar in your daily routine.
              </Text>
            </View>

            <View style={styles.optionsList}>
              {SPACES.map((space) => {
                const IconComponent = space.icon;
                const isSelected = prayerSpace === space.value;
                return (
                  <TouchableOpacity
                    key={space.value}
                    style={[
                      styles.optionCard,
                      isSelected && styles.optionCardActive,
                    ]}
                    onPress={() => setPrayerSpace(space.value)}
                    activeOpacity={0.8}
                    testID={`space-option-${space.value.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  >
                    <IconComponent
                      size={20}
                      color={isSelected ? Colors.primary : Colors.textSecondary}
                      strokeWidth={2}
                    />
                    <Text
                      style={[
                        styles.optionLabel,
                        isSelected && styles.optionLabelActive,
                      ]}
                    >
                      {space.label}
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
          </View>
        </ScrollView>

        <BottomCTA
          title="Continue"
          subtitle="A little reflection. A gentler beginning."
          onPress={onNext}
          testID="prayerspace-continue-btn"
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
    gap: 10,
    marginTop: 2,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
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
  optionLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
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
});
