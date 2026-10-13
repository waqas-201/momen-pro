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

interface ScreenRemembranceProps {
  onNext: () => void;
  onBack: () => void;
}

const ROUTINES = [
  ['Morning azkar', 'Evening azkar'],
  ['After prayer', 'Before sleep'],
];

export const ScreenRemembrance: React.FC<ScreenRemembranceProps> = ({
  onNext,
  onBack,
}) => {
  const { adhkarRoutines, toggleAdhkarRoutine } = useOnboarding();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ArchWatermark />
        <BrandHeader onBack={onBack} />
        <StepProgress title="Your remembrance" currentStep={3} totalSteps={6} />

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Qur'anic Reflection */}
          <QuranicReflection
            arabicText="اذْكُرُوا اللَّهَ ذِكْرًا كَثِيرًا"
            reference="Surah Al-Ahzab · 33:41 · excerpt"
            translation="“Remember Allah with much remembrance.”"
          />

          {/* Question & Choices */}
          <View style={styles.questionSection}>
            <View style={styles.questionHeader}>
              <Text style={styles.title}>
                Which adhkar routines do you already practice?
              </Text>
              <Text style={styles.subtitle}>Select all that apply.</Text>
            </View>

            <View style={styles.grid}>
              {ROUTINES.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                  {row.map((routine) => {
                    const isSelected = adhkarRoutines.includes(routine);
                    return (
                      <TouchableOpacity
                        key={routine}
                        style={[
                          styles.card,
                          isSelected && styles.cardActive,
                        ]}
                        onPress={() => toggleAdhkarRoutine(routine)}
                        activeOpacity={0.8}
                        testID={`routine-${routine.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                      >
                        <View style={styles.cardHeader}>
                          <Text
                            style={[
                              styles.cardText,
                              isSelected && styles.cardTextActive,
                            ]}
                          >
                            {routine}
                          </Text>
                          <View
                            style={[
                              styles.checkbox,
                              isSelected && styles.checkboxActive,
                            ]}
                          >
                            {isSelected && (
                              <Check size={11} color={Colors.textLight} strokeWidth={3} />
                            )}
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}

              {/* No current routine option */}
              <TouchableOpacity
                style={[
                  styles.cardFull,
                  adhkarRoutines.includes('No current routine') && styles.cardActive,
                ]}
                onPress={() => toggleAdhkarRoutine('No current routine')}
                activeOpacity={0.8}
                testID="routine-no-current-routine"
              >
                <View style={styles.cardHeader}>
                  <Text
                    style={[
                      styles.cardText,
                      adhkarRoutines.includes('No current routine') && styles.cardTextActive,
                    ]}
                  >
                    No current routine
                  </Text>
                  <View
                    style={[
                      styles.checkbox,
                      adhkarRoutines.includes('No current routine') && styles.checkboxActive,
                    ]}
                  >
                    {adhkarRoutines.includes('No current routine') && (
                      <Check size={11} color={Colors.textLight} strokeWidth={3} />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <BottomCTA
          title="Continue"
          subtitle="A little reflection. A gentler beginning."
          onPress={onNext}
          testID="remembrance-continue-btn"
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
  grid: {
    gap: 8,
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  card: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    minHeight: 52,
  },
  cardFull: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    minHeight: 52,
  },
  cardActive: {
    backgroundColor: Colors.surfaceActive,
    borderColor: Colors.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardText: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    color: Colors.primary,
  },
  cardTextActive: {
    color: Colors.primary,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
});
