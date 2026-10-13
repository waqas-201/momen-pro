import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { Check, Sun, Sparkles, BookOpen, ArrowRight } from 'lucide-react-native';
import { FontFamilies } from '../theme/typography';
import { useOnboarding } from '../context/OnboardingContext';

interface Props {
  onBack: () => void;
  onFinish: () => void;
}

export const ScreenJourneyBegins: React.FC<Props> = ({ onBack, onFinish }) => {
  const { targetPrayers, targetDhikr, targetRecitation, recitationUnit } = useOnboarding();

  const prayersDisplay = `${targetPrayers || 5} prayers`;
  const dhikrDisplay = `${targetDhikr || 100} remembrances`;
  const recitationDisplay = `${targetRecitation || 10} ${
    recitationUnit ? recitationUnit.toLowerCase() : 'ayahs'
  }`;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Ambient Heavenly Glow */}
        <View style={styles.ambientGlow} pointerEvents="none" />

        {/* Architectural Arch Outline */}
        <View style={styles.archOutline} pointerEvents="none" />

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* 1. Header (Height: 120, padding: 32px 24px 0px) */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={onBack}
              style={styles.backButton}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              activeOpacity={0.7}
              testID="header-done-button"
              accessibilityRole="button"
              accessibilityLabel="Done"
            >
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>

            <Image
              source={require('../../assets/momen-pro-logo.png')}
              style={styles.logoEmblem}
              resizeMode="contain"
            />
          </View>

          {/* 2. Step Progress Bar (Height: 44, padding: 0 28px) */}
          <View style={styles.progressContainer}>
            <View style={styles.progressLabels}>
              <Text style={styles.progressTitle}>YOUR JOURNEY BEGINS</Text>
              <Text style={styles.progressStatus}>Complete</Text>
            </View>
            <View style={styles.progressTrack}>
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <View key={index} style={styles.progressSegment} />
              ))}
            </View>
          </View>

          {/* 3. Qur'anic Reflection (Height: 180, padding: 10px 28px) */}
          <View style={styles.reflectionContainer}>
            <Text style={styles.arabicText}>
              أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ
            </Text>

            <View style={styles.badgeContainer}>
              <Text style={styles.badgeStar}>✦</Text>
              <Text style={styles.badgeText}>Surah Ar-Ra‘d · 13:28 · excerpt</Text>
            </View>

            <Text style={styles.translationText}>
              “Surely, in the remembrance of Allah do hearts find rest.”
            </Text>
          </View>

          {/* 4. Personal Reflection & Saved Goals Section (padding: 18px 24px 12px) */}
          <View style={styles.personalReflectionSection}>
            {/* Goals Saved Confirmation */}
            <View style={styles.confirmationHeader}>
              <View style={styles.successSeal}>
                <Check size={24} color="#083B32" strokeWidth={2.4} />
              </View>
              <Text style={styles.heading}>Your intentions are set.</Text>
              <Text style={styles.subheading}>
                Your goals are saved. May every small step bring you closer to Allah.
              </Text>
            </View>

            {/* Saved Daily Goals Card */}
            <View style={styles.savedGoalsCard}>
              <Text style={styles.cardHeader}>YOUR DAILY GOALS</Text>

              {/* Row 1: Daily Prayers */}
              <View style={styles.goalRow}>
                <Sun size={18} color="#78716C" strokeWidth={2} />
                <Text style={styles.goalLabel}>Daily prayers</Text>
                <Text style={styles.goalValue}>{prayersDisplay}</Text>
              </View>

              {/* Row 2: Dhikr */}
              <View style={styles.goalRow}>
                <Sparkles size={18} color="#78716C" strokeWidth={2} />
                <Text style={styles.goalLabel}>Dhikr</Text>
                <Text style={styles.goalValue}>{dhikrDisplay}</Text>
              </View>

              {/* Row 3: Qur'an Recitation */}
              <View style={styles.goalRow}>
                <BookOpen size={18} color="#78716C" strokeWidth={2} />
                <Text style={styles.goalLabel}>Qur’an recitation</Text>
                <Text style={styles.goalValue}>{recitationDisplay}</Text>
              </View>
            </View>

            {/* Footnote */}
            <Text style={styles.revisitFootnote}>
              You can revisit your goals whenever you need.
            </Text>
          </View>

          {/* 5. Journey Action (padding: 12px 24px 0px) */}
          <View style={styles.journeyActionSection}>
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={onFinish}
              activeOpacity={0.88}
              testID="journey-finish-button"
            >
              <Text style={styles.ctaButtonText}>Begin my journey</Text>
              <ArrowRight size={17} color="#C8A86B" strokeWidth={2.4} />
            </TouchableOpacity>

            <Text style={styles.actionFooterNote}>
              Small steps. A meaningful journey.
            </Text>

            <View style={styles.homeIndicatorContainer}>
              <View style={styles.homeIndicator} />
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
    position: 'relative',
    overflow: 'hidden',
  },
  ambientGlow: {
    position: 'absolute',
    top: -100,
    left: 67,
    width: 256,
    height: 256,
    borderRadius: 9999,
    backgroundColor: 'rgba(229, 200, 142, 0.19)',
    ...(Platform.OS === 'web'
      ? { filter: 'blur(32px)' }
      : { shadowColor: '#C8A86B', shadowOpacity: 0.35, shadowRadius: 32 }),
  },
  archOutline: {
    position: 'absolute',
    top: 24,
    left: 15,
    right: 15,
    bottom: 24,
    maxWidth: 360,
    maxHeight: 836,
    alignSelf: 'center',
    width: '100%',
    height: '100%',
    borderWidth: 1,
    borderColor: 'rgba(200, 168, 107, 0.2)',
    borderTopLeftRadius: 180,
    borderTopRightRadius: 180,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 8,
  },

  // 1. Header
  header: {
    height: 120,
    paddingTop: 32,
    paddingHorizontal: 24,
    paddingBottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    alignSelf: 'stretch',
  },
  backButton: {
    position: 'absolute',
    left: 24,
    top: 54,
    height: 44,
    justifyContent: 'center',
    zIndex: 10,
  },
  doneText: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 12,
    color: '#083B32',
  },
  logoEmblem: {
    width: 96,
    height: 76,
  },

  // 2. Progress Bar
  progressContainer: {
    height: 44,
    paddingHorizontal: 28,
    justifyContent: 'center',
    gap: 8,
    alignSelf: 'stretch',
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressTitle: {
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 10,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: '#083B32',
  },
  progressStatus: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 10,
    color: '#78716C',
  },
  progressTrack: {
    flexDirection: 'row',
    gap: 5,
    width: '100%',
  },
  progressSegment: {
    flex: 1,
    height: 3,
    borderRadius: 9999,
    backgroundColor: '#083B32',
  },

  // 3. Qur'anic Reflection
  reflectionContainer: {
    height: 180,
    paddingVertical: 10,
    paddingHorizontal: 28,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'stretch',
  },
  arabicText: {
    fontFamily: FontFamilies.amiriRegular,
    fontSize: 25,
    lineHeight: 40,
    color: '#083B32',
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDF9',
    borderWidth: 1,
    borderColor: 'rgba(200, 168, 107, 0.4)',
    borderRadius: 9999,
    paddingVertical: 5,
    paddingHorizontal: 12,
    gap: 6,
  },
  badgeStar: {
    color: '#C8A86B',
    fontSize: 10,
  },
  badgeText: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 10,
    color: '#083B32',
  },
  translationText: {
    fontFamily: FontFamilies.serifItalic,
    fontStyle: 'italic',
    fontSize: 18,
    lineHeight: 23,
    color: '#57534E',
    textAlign: 'center',
  },

  // 4. Personal Reflection & Goals Section
  personalReflectionSection: {
    paddingTop: 18,
    paddingHorizontal: 24,
    paddingBottom: 12,
    gap: 16,
    alignSelf: 'stretch',
  },
  confirmationHeader: {
    alignItems: 'center',
    gap: 12,
  },
  successSeal: {
    width: 48,
    height: 48,
    borderRadius: 9999,
    backgroundColor: '#EAF0EA',
    borderWidth: 1,
    borderColor: 'rgba(200, 168, 107, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontFamily: FontFamilies.serifSemiBold,
    fontSize: 32,
    lineHeight: 36,
    color: '#083B32',
    textAlign: 'center',
  },
  subheading: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 13,
    lineHeight: 21,
    color: '#78716C',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  savedGoalsCard: {
    backgroundColor: '#FFFDF9',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DFDCD2',
    padding: 16,
    gap: 16,
    alignSelf: 'stretch',
  },
  cardHeader: {
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 10,
    letterSpacing: 0.8,
    color: '#78716C',
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: 10,
  },
  goalLabel: {
    flex: 1,
    fontFamily: FontFamilies.sansRegular,
    fontSize: 11,
    color: '#78716C',
  },
  goalValue: {
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 12,
    color: '#083B32',
  },
  revisitFootnote: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 11,
    color: '#78716C',
    textAlign: 'center',
  },

  // 5. Journey Action
  journeyActionSection: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 0,
    gap: 12,
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 54,
    backgroundColor: '#083B32',
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(200, 168, 107, 0.5)',
    gap: 12,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 8px 20px -5px rgba(8, 59, 50, 0.25)' }
      : {
          shadowColor: '#083B32',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 10,
          elevation: 3,
        }),
  },
  ctaButtonText: {
    color: '#FAF9F6',
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 15,
    letterSpacing: 0.2,
  },
  actionFooterNote: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 10,
    color: '#78716C',
    textAlign: 'center',
  },
  homeIndicatorContainer: {
    paddingTop: 4,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  homeIndicator: {
    width: 128,
    height: 4,
    backgroundColor: '#D6D3D1',
    borderRadius: 9999,
  },
});
