import { useMemo } from 'react';
import { Easing, useReducedMotion } from 'react-native-reanimated';

/** A distance written as a fraction of the stage, clamped for small and large screens. */
export interface Span {
  ratio: number;
  min: number;
  max: number;
}

export function spanFor(span: Span, width: number): number {
  return Math.min(span.max, Math.max(span.min, width * span.ratio));
}

/**
 * How far the Stage travels during a button-driven move, in dp.
 *
 * A Step is one panel on a track, not a texture swap: it has to clear itself so
 * the eye follows a panel arriving. 58% of the stage is far enough to read as
 * travel, and close enough that the outgoing panel is still leaving the frame
 * when the incoming one lands.
 */
export const STEP_TRAVEL: Span = { ratio: 0.58, min: 200, max: 320 };

/**
 * Reveal distance for the thumb-tracked back gesture, as a fraction of the stage
 * width. The finger and the panel move 1:1, so this is also the drag distance at
 * which the move is complete. It is deliberately longer than a button move: a
 * surface attached to a thumb must never feel shorter than one on a timer.
 */
export const DRAG_REVEAL: Span = { ratio: 0.75, min: 260, max: 420 };

/** Release thresholds for the back gesture. */
export const DRAG_COMMIT = { distance: 0.35, velocity: 500 };

export const DURATION = {
  forward: 460,
  back: 420,
  lift: 400,
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
 * Both panels are readable for as long as they are travelling: the outgoing
 * stays solid while it leaves, the incoming settles before the move ends. The
 * closing stretch of the glide is therefore solid panel rather than a fade that
 * is still running on the final frame.
 */
export const FADE = {
  out: [0, 0.86],
  in: [0.08, 0.86],
} as const;

/** Where the second beat of the arrival stagger starts, as a fraction of the move. */
export const STAGGER = 0.18;

export type MoveMode = 'slide' | 'lift';

export interface Motion {
  reduced: boolean;
  travel: number;
  reveal: number;
  durationFor: (dir: 1 | -1, mode: MoveMode) => number;
}

/**
 * Motion is measured against the Stage, not the artboard: a stepper's stride is
 * a share of the surface it moves across, so the same move reads the same on a
 * small phone and a tablet.
 */
export function useMotion(width: number): Motion {
  const reduced = useReducedMotion();

  return useMemo(
    () => ({
      reduced,
      travel: reduced || width <= 0 ? 0 : spanFor(STEP_TRAVEL, width),
      reveal: width > 0 ? spanFor(DRAG_REVEAL, width) : DRAG_REVEAL.min,
      durationFor(dir: 1 | -1, mode: MoveMode) {
        if (reduced) return DURATION.reduced;
        if (mode === 'lift') return DURATION.lift;
        return dir > 0 ? DURATION.forward : DURATION.back;
      },
    }),
    [reduced, width]
  );
}
