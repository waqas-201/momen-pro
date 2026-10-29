import type { StageComponent, StepMeta } from '../flow/types';
import { PrayersStep } from './PrayersStep';
import { PrayerSpaceStep } from './PrayerSpaceStep';
import { DaroodStep } from './DaroodStep';
import { RemembranceStep } from './RemembranceStep';
import { RecitationStep } from './RecitationStep';
import { MissedPrayersStep } from './MissedPrayersStep';
import { UsernameStep } from './UsernameStep';
import { DailyIntentionsStep } from './DailyIntentionsStep';
import { ArrivalStep } from './ArrivalStep';

/** The Splash sits before the Flow and owns no progress segment. */
export const SPLASH = 0;

/** The Arrival sits after the last Step and reads as complete, not as "9 of 8". */
export const ARRIVAL = 9;

export const TOTAL_STEPS = 8;

/**
 * Ordered Flow. Index is the Step's position — the thing Forward and Back move
 * through, and what the progress bar reads.
 */
export const STAGES: Record<number, StageComponent> = {
  1: PrayersStep,
  2: PrayerSpaceStep,
  3: DaroodStep,
  4: RemembranceStep,
  5: RecitationStep,
  6: MissedPrayersStep,
  7: UsernameStep,
  8: DailyIntentionsStep,
  9: ArrivalStep,
};

export const META: Record<number, StepMeta> = {
  1: {
    title: 'Your Prayers',
    countLabel: `1 of ${TOTAL_STEPS}`,
    cta: { label: 'Continue', testID: 'prayers-continue-btn' },
  },
  2: {
    title: 'Your Prayer Space',
    countLabel: `2 of ${TOTAL_STEPS}`,
    cta: { label: 'Continue', testID: 'prayer-space-continue-btn' },
  },
  3: {
    title: 'Your Darood o Salam',
    countLabel: `3 of ${TOTAL_STEPS}`,
    cta: { label: 'Continue', testID: 'darood-continue-btn' },
  },
  4: {
    title: 'Your Remembrance',
    countLabel: `4 of ${TOTAL_STEPS}`,
    cta: { label: 'Continue', testID: 'remembrance-continue-btn' },
  },
  5: {
    title: 'Your Recitation',
    countLabel: `5 of ${TOTAL_STEPS}`,
    cta: { label: 'Continue', testID: 'recitation-continue-btn' },
  },
  6: {
    title: 'A Fresh Beginning',
    countLabel: `6 of ${TOTAL_STEPS}`,
    cta: { label: 'Continue', testID: 'missed-prayers-continue-btn' },
  },
  7: {
    title: 'Your Name',
    countLabel: `7 of ${TOTAL_STEPS}`,
    cta: { label: 'Continue', testID: 'username-continue-btn' },
  },
  8: {
    title: 'Your Daily Intentions',
    countLabel: `8 of ${TOTAL_STEPS}`,
    cta: { label: 'Save my goals', testID: 'save-goals-btn' },
  },
  9: {
    title: 'Your Journey Begins',
    countLabel: 'Complete',
    backLabel: 'Done',
    cta: { label: 'Begin my journey', testID: 'journey-finish-button' },
  },
};

export function metaFor(step: number): StepMeta {
  return META[step] ?? META[1];
}
