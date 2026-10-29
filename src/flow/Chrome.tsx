import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { SharedValue } from 'react-native-reanimated';
import { ArchWatermark } from '../components/ArchWatermark';
import { BrandHeader } from '../components/BrandHeader';
import { StepProgress } from '../components/StepProgress';
import { BottomCTA } from '../components/BottomCTA';
import type { StepMeta } from './types';
import { TOTAL_STEPS } from '../steps';

interface ChromeProps {
  meta: StepMeta;
  /** The Step being left behind, so Chrome can cross-fade its labels in place. */
  prevMeta: StepMeta | null;
  fromStep: number;
  toStep: number;
  t: SharedValue<number>;
  dir: 1 | -1;
  onBack: () => void;
  onNext: () => void;
  children: React.ReactNode;
}

/**
 * The persistent frame of the Flow. It is anchored: it never travels with the
 * Stage. Only its labels move, and only in place.
 */
export const Chrome: React.FC<ChromeProps> = ({
  meta,
  prevMeta,
  fromStep,
  toStep,
  t,
  dir,
  onBack,
  onNext,
  children,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 6) }]}>
      <ArchWatermark />

      <BrandHeader
        onBack={onBack}
        backText={meta.backLabel ?? 'Back'}
        showBack={meta.showBack !== false}
      />

      <StepProgress
        title={meta.title}
        countLabel={meta.countLabel}
        prevTitle={prevMeta?.title ?? null}
        prevCountLabel={prevMeta?.countLabel ?? null}
        fromStep={fromStep}
        toStep={toStep}
        t={t}
        dir={dir}
        totalSteps={TOTAL_STEPS}
      />

      <View style={styles.stage} testID="flow-stage">
        {children}
      </View>

      <BottomCTA
        title={meta.cta.label}
        onPress={onNext}
        testID={meta.cta.testID}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FAF9F6',
    overflow: 'hidden',
    position: 'relative',
  },
  stage: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
});
