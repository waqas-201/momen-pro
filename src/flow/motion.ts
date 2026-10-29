import { useMemo } from 'react';
import { Easing, useReducedMotion } from 'react-native-reanimated';

/**
 * How far the Stage travels during a button-driven move, in dp.
 *
 * 48dp gives a smooth, readable lateral glide across screens without
 * feeling abrupt or jarring.
 */
export const TRAVEL = 48;

/**
 * Reveal distance for the thumb-tracked back gesture, as a fraction of the stage
 * width. A surface that follows a thumb cannot move 48dp and stay attached to it,
 * so the interactive move is deliberately longer than the button move.
 */
export const DRAG_REVEAL = { ratio: 0.45, min: 160, max: 280 };

/** Release thresholds for the back gesture. */
export const DRAG_COMMIT = { distance: 0.35, velocity: 500 };

export const DURATION = {
  forward: 480,
  back: 420,
  lift: 440,
  settle: 260,
  cancel: 240,
  reduced: 160,
  labelIn: 220,
} as const;

/** Smooth, cushioned easing curve: gentle acceleration and soft, natural settle. */
export const EASE = Easing.bezier(0.25, 0.1, 0.25, 1);

/**
 * Opacity windows, as fractions of the move.
 *
 * Overlapped windows ensure a continuous, silky dissolve between screens
 * where the outgoing screen fades out smoothly while the incoming screen
 * gracefully emerges, avoiding sudden pops or harsh cutoffs.
 */
export const FADE = {
  out: [0, 0.82],
  in: [0.18, 1],
} as const;

/** Where the second beat of the arrival stagger starts, as a fraction of the move. */
export const STAGGER = 0.18;

export type MoveMode = 'slide' | 'lift';

export interface Motion {
  reduced: boolean;
  travel: number;
  durationFor: (dir: 1 | -1, mode: MoveMode) => number;
}

export function useMotion(): Motion {
  const reduced = useReducedMotion();

  return useMemo(
    () => ({
      reduced,
      travel: reduced ? 0 : TRAVEL,
      durationFor(dir: 1 | -1, mode: MoveMode) {
        if (reduced) return DURATION.reduced;
        if (mode === 'lift') return DURATION.lift;
        return dir > 0 ? DURATION.forward : DURATION.back;
      },
    }),
    [reduced]
  );
}
