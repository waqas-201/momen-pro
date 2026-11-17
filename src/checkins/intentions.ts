import { PRAYER_NAMES, type Checkin } from './types';

export type IntentionKey = 'prayer' | 'darood' | 'dhikr' | 'quran' | 'qadha';

export interface Intention {
  key: IntentionKey;
  title: string;
  /** The Target in the person's own words — the amount they committed to. */
  targetLabel: string;
  done: number;
  target: number;
  kept: boolean;
  /** The routines a Dhikr Intention is kept by, in the order they were chosen. */
  routines?: string[];
}

/** The Targets chosen in the Flow. Home reads them, never writes them. */
export interface IntentionsSource {
  targetPrayers: number;
  targetDarood: number;
  targetRecitation: number;
  recitationUnit: string;
  targetQadha: number;
  routines: string[];
}

/**
 * An Intention only appears once it has a real Target. A zero salawat count or
 * an empty routine list is not a goal the person failed — it is one they never
 * set, so it stays off Home rather than reading as a miss.
 */
export function buildIntentions(
  source: IntentionsSource,
  checkin: Checkin
): Intention[] {
  const intentions: Intention[] = [];

  // Prayer is a floor, not a checklist of five: a Target of 3 is kept by any
  // three of the named prayers.
  const prayerTarget = Math.min(
    PRAYER_NAMES.length,
    Math.max(1, source.targetPrayers)
  );
  intentions.push({
    key: 'prayer',
    title: 'Prayer',
    targetLabel:
      prayerTarget === PRAYER_NAMES.length
        ? 'All five prayers'
        : `${prayerTarget} of the five prayers`,
    done: checkin.prayers.length,
    target: prayerTarget,
    kept: checkin.prayers.length >= prayerTarget,
  });

  if (source.targetDarood > 0) {
    intentions.push({
      key: 'darood',
      title: 'Darood o Salam',
      targetLabel: `${source.targetDarood} salawat`,
      done: checkin.darood,
      target: source.targetDarood,
      kept: checkin.darood >= source.targetDarood,
    });
  }

  if (source.routines.length > 0) {
    const done = source.routines.filter((routine) =>
      checkin.routines.includes(routine)
    ).length;
    intentions.push({
      key: 'dhikr',
      title: 'Dhikr',
      targetLabel: `${source.routines.length} ${
        source.routines.length === 1 ? 'routine' : 'routines'
      }`,
      done,
      target: source.routines.length,
      kept: done >= source.routines.length,
      routines: source.routines,
    });
  }

  if (source.targetRecitation > 0) {
    const unit = (source.recitationUnit || 'Ayahs').toLowerCase();
    intentions.push({
      key: 'quran',
      title: 'Qur’an',
      targetLabel: `${source.targetRecitation} ${unit}`,
      done: checkin.quran,
      target: source.targetRecitation,
      kept: checkin.quran >= source.targetRecitation,
    });
  }

  if (source.targetQadha > 0) {
    intentions.push({
      key: 'qadha',
      title: 'Qadha',
      targetLabel: `${source.targetQadha} makeup / day`,
      done: checkin.qadha,
      target: source.targetQadha,
      kept: checkin.qadha >= source.targetQadha,
    });
  }

  return intentions;
}
