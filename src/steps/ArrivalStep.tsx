import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Check, Sun, Sparkles, BookOpen } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { FontFamilies } from '../theme/typography';
import { QuranicReflection } from '../components/QuranicReflection';
import { StageBeat } from '../flow/StageBeat';
import { DURATION, EASE } from '../flow/motion';
import { useOnboarding } from '../context/OnboardingContext';

export const ArrivalStep: React.FC = () => {
  const { targetPrayers, targetDhikr, targetRecitation, recitationUnit } =
    useOnboarding();

  const prayersDisplay = `${targetPrayers || 5} prayers`;
  const dhikrDisplay = `${targetDhikr || 100} remembrances`;
  const recitationDisplay = `${targetRecitation || 10} ${
    recitationUnit ? recitationUnit.toLowerCase() : 'ayahs'
  }`;

  // The payoff of the whole Flow: the seal settles a beat after the screen does.
  const seal = useSharedValue(0);
  useEffect(() => {
    seal.value = withDelay(
      160,
      withTiming(1, { duration: DURATION.lift, easing: EASE })
    );
  }, [seal]);

  const sealStyle = useAnimatedStyle(() => ({
    opacity: seal.value,
    transform: [{ scale: 0.82 + 0.18 * seal.value }],
  }));

  return (
    <View style={styles.mainContent}>
      <QuranicReflection
        arabicText="أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ"
        reference="Surah Ar-Ra‘d · 13:28 · excerpt"
        translation="“Surely, in the remembrance of Allah do hearts find rest.”"
      />

      <StageBeat beat={1} style={styles.confirmationHeader}>
        <Animated.View style={[styles.successSeal, sealStyle]}>
          <Check size={18} color="#083B32" strokeWidth={2.4} />
        </Animated.View>
        <Text style={styles.heading}>Your intentions are set.</Text>
        <Text style={styles.subheading}>
          May Allah grant barakah in every step of your journey.
        </Text>
      </StageBeat>

      <StageBeat style={styles.savedGoalsCard}>
        <Text style={styles.cardHeaderTitle}>DAILY INTENTIONS SUMMARY</Text>

        <View style={styles.goalRow}>
          <View style={styles.goalLabelGroup}>
            <Sun size={15} color="#083B32" strokeWidth={2.2} />
            <Text style={styles.goalName}>Prayer</Text>
          </View>
          <Text style={styles.goalValue}>{prayersDisplay}</Text>
        </View>

        <View style={styles.goalRow}>
          <View style={styles.goalLabelGroup}>
            <Sparkles size={15} color="#083B32" strokeWidth={2.2} />
            <Text style={styles.goalName}>Dhikr</Text>
          </View>
          <Text style={styles.goalValue}>{dhikrDisplay}</Text>
        </View>

        <View style={styles.goalRow}>
          <View style={styles.goalLabelGroup}>
            <BookOpen size={15} color="#083B32" strokeWidth={2.2} />
            <Text style={styles.goalName}>Qur’an</Text>
          </View>
          <Text style={styles.goalValue}>{recitationDisplay}</Text>
        </View>
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
  confirmationHeader: {
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 4,
  },
  successSeal: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EAF0EA',
    borderWidth: 1,
    borderColor: '#C8A86B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  heading: {
    fontFamily: FontFamilies.serifSemiBold,
    fontSize: 23,
    lineHeight: 28,
    textAlign: 'center',
    color: '#083B32',
    letterSpacing: -0.2,
  },
  subheading: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 12.5,
    lineHeight: 16,
    textAlign: 'center',
    color: '#57534E',
    paddingHorizontal: 10,
  },
  savedGoalsCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFDCD2',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 8,
    width: '100%',
  },
  cardHeaderTitle: {
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 9.5,
    letterSpacing: 0.5,
    color: '#083B32',
    marginBottom: 2,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  goalLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  goalName: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 12.5,
    color: '#083B32',
  },
  goalValue: {
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 12.5,
    color: '#083B32',
  },
});
