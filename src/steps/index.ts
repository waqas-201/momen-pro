import type { StageComponent, StepMeta } from '../flow/types';
import { PrayersStep } from './PrayersStep';
import { DaroodStep } from './DaroodStep';
import { RemembranceStep } from './RemembranceStep';
import { RecitationStep } from './RecitationStep';
import { MissedPrayersStep } from './MissedPrayersStep';
import { UsernameStep } from './UsernameStep';
import { USERNAME_STEP } from './userNameForm';
import { DailyIntentionsStep } from './DailyIntentionsStep';
import { PrayerSettingsStep } from './PrayerSettingsStep';
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
  2: DaroodStep,
  3: RemembranceStep,
  4: RecitationStep,
  5: MissedPrayersStep,
  [USERNAME_STEP]: UsernameStep,
  7: DailyIntentionsStep,
  8: PrayerSettingsStep,
  9: ArrivalStep,
};

export const META: Record<number, StepMeta> = {
  1: {
    title: 'Your Prayers',
    countLabel: `1 of ${TOTAL_STEPS}`,
    cta: { label: 'Continue', testID: 'prayers-continue-btn' },
  },
  2: {
    title: 'Your Darood o Salam',
    countLabel: `2 of ${TOTAL_STEPS}`,
    cta: { label: 'Continue', testID: 'darood-continue-btn' },
  },
  3: {
    title: 'Your Remembrance',
    countLabel: `3 of ${TOTAL_STEPS}`,
    cta: { label: 'Continue', testID: 'remembrance-continue-btn' },
  },
  4: {
    title: 'Your Recitation',
    countLabel: `4 of ${TOTAL_STEPS}`,
    cta: { label: 'Continue', testID: 'recitation-continue-btn' },
  },
  5: {
    title: 'A Fresh Beginning',
    countLabel: `5 of ${TOTAL_STEPS}`,
    cta: { label: 'Continue', testID: 'missed-prayers-continue-btn' },
  },
  [USERNAME_STEP]: {
    title: 'Your Name',
    countLabel: `6 of ${TOTAL_STEPS}`,
    cta: { label: 'Continue', testID: 'username-continue-btn' },
  },
  7: {
    title: 'Your Daily Intentions',
    countLabel: `7 of ${TOTAL_STEPS}`,
    cta: { label: 'Continue', testID: 'save-goals-btn' },
  },
  8: {
    title: 'Your Tradition & Horizon',
    countLabel: `8 of ${TOTAL_STEPS}`,
    cta: { label: 'Save my preferences', testID: 'prayer-settings-continue-btn' },
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
