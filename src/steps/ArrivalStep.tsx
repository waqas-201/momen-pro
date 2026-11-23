import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Check, Sun, Sparkles, BookOpen, Heart, RotateCcw } from 'lucide-react-native';
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
import { DHIKR_LABELS } from './dhikrData';

export const ArrivalStep: React.FC = () => {
  const {
    userName,
    targetPrayers,
    targetDarood,
    adhkarRoutines,
    targetRecitation,
    recitationUnit,
    targetQadha,
  } = useOnboarding();

  const prayersDisplay = `${targetPrayers || 5} prayers`;
  const daroodDisplay =
    targetDarood > 0 ? `${targetDarood} salawat` : 'Starting fresh';

  const activeDhikr = adhkarRoutines.filter((r) => r !== 'No current routine');
  const dhikrDisplay =
    activeDhikr.length === 0
      ? 'Starting fresh'
      : activeDhikr.length === 4
      ? 'All daily azkar'
      : activeDhikr
          .map((r) => {
            if (r === 'Morning azkar') return 'Morning';
            if (r === 'Evening azkar') return 'Evening';
            if (r === 'After prayer') return 'After prayers';
            return r;
          })
          .join(', ');

  const recitationDisplay = `${targetRecitation || 10} ${
    recitationUnit ? recitationUnit.toLowerCase() : 'ayahs'
  }`;
  const qadhaDisplay = `${targetQadha} makeup / day`;

  const headingText = userName.trim()
    ? `${userName.trim()}, your intentions are set.`
    : 'Your intentions are set.';

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
        <Text style={styles.heading}>{headingText}</Text>
        <Text style={styles.subheading}>
          May Allah grant barakah in every step of your journey.
        </Text>
      </StageBeat>

      <StageBeat style={styles.savedGoalsCard}>
        <Text style={styles.cardHeaderTitle}>DAILY INTENTIONS SUMMARY</Text>

        <View style={styles.goalRow}>
          <View style={styles.goalLabelGroup}>
            <Sun size={14} color="#083B32" strokeWidth={2.2} />
            <Text style={styles.goalName}>Prayer</Text>
          </View>
          <Text style={styles.goalValue}>{prayersDisplay}</Text>
        </View>

        <View style={styles.goalRow}>
          <View style={styles.goalLabelGroup}>
            <Heart size={14} color="#083B32" strokeWidth={2.2} />
            <Text style={styles.goalName}>Darood</Text>
          </View>
          <Text style={styles.goalValue}>{daroodDisplay}</Text>
        </View>

        <View style={styles.goalRow}>
          <View style={styles.goalLabelGroup}>
            <Sparkles size={14} color="#083B32" strokeWidth={2.2} />
            <Text style={styles.goalName}>Dhikr</Text>
          </View>
          <Text style={styles.goalValue}>{dhikrDisplay}</Text>
        </View>

        <View style={styles.goalRow}>
          <View style={styles.goalLabelGroup}>
            <BookOpen size={14} color="#083B32" strokeWidth={2.2} />
            <Text style={styles.goalName}>Qur’an</Text>
          </View>
          <Text style={styles.goalValue}>{recitationDisplay}</Text>
        </View>

        {targetQadha > 0 && (
          <View style={styles.goalRow}>
            <View style={styles.goalLabelGroup}>
              <RotateCcw size={14} color="#083B32" strokeWidth={2.2} />
              <Text style={styles.goalName}>Qadha</Text>
            </View>
            <Text style={styles.goalValue}>{qadhaDisplay}</Text>
          </View>
        )}
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
    gap: 5,
  },
  successSeal: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F4EDDF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#C8A86B',
    marginBottom: 2,
  },
  heading: {
    fontFamily: FontFamilies.serifSemiBold,
    fontSize: 22,
    lineHeight: 27,
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
    paddingHorizontal: 16,
  },
  savedGoalsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DFDCD2',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 9,
  },
  cardHeaderTitle: {
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 10,
    letterSpacing: 0.8,
    color: '#C8A86B',
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
    gap: 9,
    flexShrink: 0,
  },
  goalName: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 13,
    color: '#083B32',
  },
  goalValue: {
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 13,
    color: '#083B32',
    textAlign: 'right',
    flexShrink: 1,
    marginLeft: 10,
  },
});
