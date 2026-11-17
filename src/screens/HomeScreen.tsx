import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BookOpen,
  Check,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  Sparkles,
  Sun,
} from 'lucide-react-native';
import { useOnboarding } from '../context/OnboardingContext';
import { useCheckins } from '../checkins/CheckinsContext';
import {
  buildIntentions,
  type Intention,
  type IntentionKey,
} from '../checkins/intentions';
import { formatDay } from '../checkins/day';
import { Colors } from '../theme/colors';
import { FontFamilies } from '../theme/typography';
import { InteractivePrayerCard } from '../components/InteractivePrayerCard';
import { PrayerStatsCard } from '../components/PrayerStatsCard';

/** The Flow's routine names, shortened so four fit across a card. */
const ROUTINE_LABELS: Record<string, string> = {
  'Morning azkar': 'Morning',
  'Evening azkar': 'Evening',
  'After prayer': 'After prayers',
  'Before sleep': 'Before sleep',
};

const IntentionIcon: React.FC<{ intention: IntentionKey }> = ({ intention }) => {
  const common = { size: 16, color: Colors.darkGold, strokeWidth: 2.3 };
  switch (intention) {
    case 'prayer':
      return <Sun {...common} />;
    case 'darood':
      return <Heart {...common} />;
    case 'dhikr':
      return <Sparkles {...common} />;
    case 'quran':
      return <BookOpen {...common} />;
    case 'qadha':
      return <RotateCcw {...common} />;
    default:
      return null;
  }
};

const StatusPill: React.FC<{ kept: boolean }> = ({ kept }) => (
  <View style={[styles.pill, kept ? styles.pillKept : styles.pillOpen]}>
    {kept ? <Check size={9} color={Colors.darkSuccess} strokeWidth={3} /> : null}
    <Text style={[styles.pillText, kept ? styles.pillTextKept : styles.pillTextOpen]}>
      {kept ? 'Kept' : 'Not yet'}
    </Text>
  </View>
);

/** Adds and takes back Check-ins without leaving Home. */
const Counter: React.FC<{
  addLabel: string;
  addTestID: string;
  removeTestID: string;
  onAdd: () => void;
  onRemove: () => void;
}> = ({ addLabel, addTestID, removeTestID, onAdd, onRemove }) => (
  <View style={styles.counterRow}>
    <TouchableOpacity
      style={styles.counterButton}
      onPress={onRemove}
      activeOpacity={0.7}
      testID={removeTestID}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Minus size={13} color={Colors.darkGold} strokeWidth={2.4} />
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.counterButton, styles.counterAdd]}
      onPress={onAdd}
      activeOpacity={0.8}
      testID={addTestID}
    >
      <Plus size={13} color="#061612" strokeWidth={2.8} />
      <Text style={styles.counterAddText}>{addLabel}</Text>
    </TouchableOpacity>
  </View>
);

/**
 * The surface a person lives on once the Flow is finished: every Intention they
 * set, whether it has been kept today, with darker background, stronger typography,
 * and an interactive prayer schedule component.
 */
export const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    userName,
    targetPrayers,
    targetDarood,
    targetRecitation,
    recitationUnit,
    targetQadha,
    adhkarRoutines,
  } = useOnboarding();
  const {
    checkin,
    togglePrayer,
    toggleRoutine,
    addDarood,
    addQuran,
    addQadha,
  } = useCheckins();

  const routines = adhkarRoutines.filter(
    (routine) => routine !== 'No current routine'
  );
  const intentions = buildIntentions(
    {
      targetPrayers,
      targetDarood,
      targetRecitation,
      recitationUnit,
      targetQadha,
      routines,
    },
    checkin
  );

  const kept = intentions.filter((intention) => intention.kept).length;
  const name = userName.trim();
  const complete = intentions.length > 0 && kept === intentions.length;

  const controlFor = (intention: Intention) => {
    if (intention.key === 'dhikr') {
      return (
        <View style={styles.chipRow}>
          {(intention.routines ?? []).map((routine) => {
            const done = checkin.routines.includes(routine);
            return (
              <TouchableOpacity
                key={routine}
                style={[styles.chip, done && styles.chipDone]}
                onPress={() => toggleRoutine(routine)}
                activeOpacity={0.75}
                testID={`checkin-routine-${routine
                  .toLowerCase()
                  .replace(/\s+/g, '-')}`}
              >
                {done ? (
                  <Check size={10} color={Colors.darkSuccess} strokeWidth={3} />
                ) : null}
                <Text style={[styles.chipText, done && styles.chipTextDone]}>
                  {ROUTINE_LABELS[routine] ?? routine}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      );
    }

    if (intention.key === 'darood') {
      return (
        <Counter
          addLabel="Add 10"
          addTestID="checkin-darood-add"
          removeTestID="checkin-darood-remove"
          onAdd={() => addDarood(10)}
          onRemove={() => addDarood(-10)}
        />
      );
    }

    if (intention.key === 'qadha') {
      return (
        <Counter
          addLabel="Add 1"
          addTestID="checkin-qadha-add"
          removeTestID="checkin-qadha-remove"
          onAdd={() => addQadha(1)}
          onRemove={() => addQadha(-1)}
        />
      );
    }

    return (
      <Counter
        addLabel="Add 1"
        addTestID="checkin-quran-add"
        removeTestID="checkin-quran-remove"
        onAdd={() => addQuran(1)}
        onRemove={() => addQuran(-1)}
      />
    );
  };

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[
        styles.content,
        { paddingTop: Math.max(insets.top + 10, 20) },
      ]}
      showsVerticalScrollIndicator={false}
      testID="home-screen"
    >
      <View style={styles.header}>
        <Text style={styles.kicker}>{formatDay()}</Text>
        <Text style={styles.greeting}>
          {name ? `Assalāmu ‘alaykum, ${name}` : 'Assalāmu ‘alaykum'}
        </Text>
      </View>

      {intentions.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Set your intentions</Text>
          <Text style={styles.emptyBody}>
            The Intentions you chose while setting up Momen Pro appear here, with
            today’s progress.
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryKicker}>TODAY’S INTENTIONS</Text>
            <Text style={styles.summaryValue}>
              {kept} of {intentions.length} kept
            </Text>
            <View style={styles.summaryTrack}>
              {kept > 0 ? (
                <View style={[styles.summaryFill, { flex: kept }]} />
              ) : null}
              {kept < intentions.length ? (
                <View style={{ flex: intentions.length - kept }} />
              ) : null}
            </View>
            <Text style={styles.summaryNote}>
              {complete
                ? 'Every Intention kept today. Alhamdulillah.'
                : 'A Day ends at local midnight, so this begins again tomorrow.'}
            </Text>
          </View>

          {/* Intentions List: Prayer uses the rich InteractivePrayerCard */}
          {intentions.map((intention) => {
            if (intention.key === 'prayer') {
              return (
                <InteractivePrayerCard
                  key="prayer"
                  offeredPrayers={checkin.prayers}
                  targetPrayers={targetPrayers}
                  onTogglePrayer={togglePrayer}
                />
              );
            }

            const progress = Math.min(
              1,
              intention.target === 0 ? 1 : intention.done / intention.target
            );

            return (
              <View
                key={intention.key}
                style={styles.card}
                testID={`intention-${intention.key}`}
              >
                <View style={styles.cardTop}>
                  <View style={styles.cardLabel}>
                    <IntentionIcon intention={intention.key} />
                    <Text style={styles.cardTitle}>{intention.title}</Text>
                  </View>
                  <StatusPill kept={intention.kept} />
                </View>

                <View style={styles.cardMeta}>
                  <Text style={styles.cardTarget}>{intention.targetLabel}</Text>
                  <Text style={styles.cardCount}>
                    {intention.done} / {intention.target}
                  </Text>
                </View>

                <View style={styles.track}>
                  {progress > 0 ? (
                    <View style={[styles.fill, { flex: progress }]} />
                  ) : null}
                  {progress < 1 ? <View style={{ flex: 1 - progress }} /> : null}
                </View>

                {controlFor(intention)}
              </View>
            );
          })}

          <PrayerStatsCard
            offeredCount={checkin.prayers.length}
            streakDays={0}
          />

          <Text style={styles.footnote}>
            {'\u201C'}Every deed done consistently, even if small, is beloved to Allah.{'\u201D'}
          </Text>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.darkBg,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 36,
    gap: 14,
  },
  header: {
    gap: 4,
    paddingHorizontal: 2,
    paddingBottom: 4,
  },
  kicker: {
    fontFamily: FontFamilies.sansBold,
    fontSize: 10.5,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: Colors.darkGold,
  },
  greeting: {
    fontFamily: FontFamilies.serifSemiBold,
    fontSize: 27,
    lineHeight: 33,
    color: Colors.darkTextPrimary,
    letterSpacing: -0.3,
  },
  summaryCard: {
    backgroundColor: Colors.darkSurface,
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: Colors.darkBorderGold,
    paddingHorizontal: 18,
    paddingVertical: 16,
    gap: 8,
  },
  summaryKicker: {
    fontFamily: FontFamilies.sansBold,
    fontSize: 10,
    letterSpacing: 1.1,
    color: Colors.darkGold,
  },
  summaryValue: {
    fontFamily: FontFamilies.serifSemiBold,
    fontSize: 23,
    lineHeight: 28,
    color: Colors.darkTextPrimary,
  },
  summaryTrack: {
    flexDirection: 'row',
    height: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  summaryFill: {
    backgroundColor: Colors.darkGold,
    borderRadius: 999,
  },
  summaryNote: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 11.5,
    lineHeight: 16,
    color: Colors.darkTextSecondary,
  },
  card: {
    backgroundColor: Colors.darkCard,
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: Colors.darkBorder,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 9,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  cardTitle: {
    fontFamily: FontFamilies.sansBold,
    fontSize: 14.5,
    color: Colors.darkTextPrimary,
    letterSpacing: 0.1,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  cardTarget: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 11.5,
    color: Colors.darkTextSecondary,
  },
  cardCount: {
    fontFamily: FontFamilies.sansBold,
    fontSize: 13,
    color: Colors.darkGold,
  },
  track: {
    flexDirection: 'row',
    height: 3.5,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  fill: {
    backgroundColor: Colors.darkGold,
    borderRadius: 999,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 2.5,
  },
  pillKept: {
    backgroundColor: Colors.darkSuccessBg,
    borderColor: Colors.darkSuccessBorder,
  },
  pillOpen: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: Colors.darkBorder,
  },
  pillText: {
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 9.5,
    letterSpacing: 0.2,
  },
  pillTextKept: {
    color: Colors.darkSuccess,
  },
  pillTextOpen: {
    color: Colors.darkTextSecondary,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    backgroundColor: Colors.darkSurface,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipDone: {
    backgroundColor: Colors.darkSuccessBg,
    borderColor: Colors.darkSuccessBorder,
  },
  chipText: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 11,
    color: Colors.darkTextSecondary,
  },
  chipTextDone: {
    fontFamily: FontFamilies.sansBold,
    color: Colors.darkSuccess,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  counterButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.darkCardElevated,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
  },
  counterAdd: {
    width: 'auto',
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: Colors.darkGold,
    borderColor: Colors.darkGold,
  },
  counterAddText: {
    fontFamily: FontFamilies.sansBold,
    fontSize: 11,
    color: '#061612',
  },
  footnote: {
    fontFamily: FontFamilies.serifItalic,
    fontSize: 12.5,
    lineHeight: 18,
    color: Colors.darkGold,
    opacity: 0.85,
    textAlign: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  emptyCard: {
    backgroundColor: Colors.darkCard,
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: Colors.darkBorder,
    paddingHorizontal: 18,
    paddingVertical: 20,
    gap: 6,
  },
  emptyTitle: {
    fontFamily: FontFamilies.serifSemiBold,
    fontSize: 20,
    color: Colors.darkTextPrimary,
  },
  emptyBody: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 13,
    lineHeight: 19,
    color: Colors.darkTextSecondary,
  },
});
