import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Platform } from 'react-native';
import { Check, Sun, Sparkles, BookOpen } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { ArchWatermark } from '../components/ArchWatermark';
import { BrandHeader } from '../components/BrandHeader';
import { StepProgress } from '../components/StepProgress';
import { QuranicReflection } from '../components/QuranicReflection';
import { BottomCTA } from '../components/BottomCTA';
import { useOnboarding } from '../context/OnboardingContext';

interface Props {
  onBack: () => void;
  onFinish: () => void;
}

export const ScreenJourneyBegins: React.FC<Props> = ({ onBack, onFinish }) => {
  const { targetPrayers, targetDhikr, targetRecitation, recitationUnit } = useOnboarding();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ArchWatermark />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <BrandHeader onBack={onBack} backText="Done" />

        <StepProgress
          title="Your journey begins"
          currentStep={6}
          totalSteps={6}
          isComplete={true}
        />

        <QuranicReflection
          arabicText="أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ"
          reference="Surah Ar-Ra‘d · 13:28 · excerpt"
          translation="“Surely, in the remembrance of Allah do hearts find rest.”"
        />

        <View style={styles.contentSection}>
          {/* Success Seal Header */}
          <View style={styles.sealContainer}>
            <View style={styles.sealCircle}>
              <Check size={24} color={Colors.primary} strokeWidth={2.4} />
            </View>
            <Text style={styles.heading}>Your intentions are set.</Text>
            <Text style={styles.subheading}>
              Your goals are saved. May every small step bring you closer to Allah.
            </Text>
          </View>

          {/* Saved Goals Card */}
          <View style={styles.goalsCard}>
            <Text style={styles.cardHeader}>YOUR DAILY GOALS</Text>

            <View style={styles.goalRow}>
              <View style={styles.goalIconWrap}>
                <Sun size={18} color={Colors.textSecondary} />
              </View>
              <Text style={styles.goalLabel}>Daily prayers</Text>
              <Text style={styles.goalValue}>{targetPrayers} prayers</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.goalRow}>
              <View style={styles.goalIconWrap}>
                <Sparkles size={18} color={Colors.gold} />
              </View>
              <Text style={styles.goalLabel}>Dhikr</Text>
              <Text style={styles.goalValue}>{targetDhikr} remembrances</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.goalRow}>
              <View style={styles.goalIconWrap}>
                <BookOpen size={18} color={Colors.textSecondary} />
              </View>
              <Text style={styles.goalLabel}>Qur’an recitation</Text>
              <Text style={styles.goalValue}>
                {targetRecitation} {recitationUnit ? recitationUnit.toLowerCase() : 'ayahs'}
              </Text>
            </View>
          </View>

          <Text style={styles.footerNote}>
            You can revisit your goals whenever you need.
          </Text>
        </View>

        <BottomCTA
          title="Begin my journey"
          subtitle="Small steps. A meaningful journey."
          onPress={onFinish}
          testID="journey-finish-button"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  contentSection: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
  },
  sealContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  sealCircle: {
    width: 48,
    height: 48,
    borderRadius: 9999,
    backgroundColor: '#EAF0EA',
    borderWidth: 1,
    borderColor: 'rgba(200, 168, 107, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  heading: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'Cormorant Garamond, Georgia, serif' }),
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '600',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 6,
  },
  subheading: {
    fontSize: 13,
    lineHeight: 21,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  goalsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    gap: 10,
  },
  goalIconWrap: {
    width: 20,
    alignItems: 'center',
  },
  goalLabel: {
    flex: 1,
    fontSize: 11,
    color: Colors.textSecondary,
  },
  goalValue: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 8,
    opacity: 0.4,
  },
  footerNote: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
