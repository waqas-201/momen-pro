import type { ComponentType } from 'react';

/**
 * Chrome metadata for one Step. Steps own no Chrome of their own — the shell
 * reads this to render the header, the progress bar and the CTA.
 */
export interface StepMeta {
  title: string;
  countLabel: string;
  backLabel?: string;
  showBack?: boolean;
  cta: {
    label: string;
    testID: string;
  };
}

/** A Step's Stage content. It receives no props: Chrome owns navigation. */
export type StageComponent = ComponentType;

export interface Flight {
  from: number;
  to: number;
  dir: 1 | -1;
  mode: 'slide' | 'lift';
  /** Pixel distance the Stage travels. 0 for reduced motion and for lifts. */
  travel: number;
  /** True while the move is under a finger rather than on a timer. */
  interactive: boolean;
}
