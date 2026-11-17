import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SplashScreen } from '../screens/SplashScreen';
import { Chrome } from './Chrome';
import { StageLayer } from './StageLayer';
import { CompletionModal } from './CompletionModal';
import {
  DRAG_COMMIT,
  DURATION,
  EASE,
  FADE,
  useMotion,
  type MoveMode,
} from './motion';
import { useStepGate } from './StepGate';
import type { Flight } from './types';
import { ARRIVAL, SPLASH, STAGES, metaFor } from '../steps';

type LayerRole = 'rest' | 'entering' | 'exiting';

interface FlowProps {
  /** Leaves the Flow for Home. There is no surface of its own after the Arrival. */
  onFinish: () => void;
}

export const Flow: React.FC<FlowProps> = ({ onFinish }) => {
  // The Stage's own width is the measure every move is expressed against.
  const [width, setWidth] = useState(0);
  const { reduced, travel, reveal, durationFor } = useMotion(width);
  const gate = useStepGate();

  const [step, setStep] = useState(SPLASH);
  const [flight, setFlight] = useState<Flight | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);

  const t = useSharedValue(0);
  const busy = useSharedValue(false);
  const dragging = useSharedValue(false);

  /** Lands a move: the destination becomes the new rest position. */
  const commit = useCallback(
    (to: number) => {
      busy.set(false);
      dragging.set(false);
      setStep(to);
      setFlight(null);
    },
    [busy, dragging]
  );

  /** Abandons a move: the Stage settles back where it started. */
  const cancel = useCallback(() => {
    busy.set(false);
    dragging.set(false);
    setFlight(null);
  }, [busy, dragging]);

  /**
   * The only way the Flow moves. Targets are absolute, so a repeated tap can
   * never advance twice, and a move already in flight can be grabbed back.
   */
  const go = useCallback(
    (target: number) => {
      if (target < SPLASH || target > ARRIVAL) return;

      if (flight) {
        // A finger owns the Stage; buttons wait their turn.
        if (flight.interactive) return;
        // Reversing mid-flight is a cancel, not a second move.
        if (target === flight.from) {
          t.set(
            withTiming(0, { duration: DURATION.cancel, easing: EASE }, (done) => {
              if (done) runOnJS(cancel)();
            })
          );
        }
        // Any other target arrives while the Stage is still moving. Dropping it
        // is the whole anti-double-advance rule: one move, one destination.
        return;
      }

      if (target === step) return;

      const dir: 1 | -1 = target > step ? 1 : -1;
      const adjacent = Math.abs(target - step) === 1;
      const mode: MoveMode = adjacent ? 'slide' : 'lift';

      const move: Flight = {
        from: step,
        to: target,
        dir,
        mode,
        travel: mode === 'slide' ? travel : 0,
        interactive: false,
      };

      setFlight(move);
      busy.set(true);

      t.set(0);
      t.set(
        withTiming(1, { duration: durationFor(dir, mode), easing: EASE }, (done) => {
          if (done) runOnJS(commit)(target);
        })
      );
    },
    [flight, step, travel, durationFor, busy, cancel, commit, t]
  );

  /** Grabs the Stage for the interactive back gesture. */
  const beginDrag = useCallback(() => {
    if (step < 2) return;

    setFlight({
      from: step,
      to: step - 1,
      dir: -1,
      mode: 'slide',
      travel: reveal,
      interactive: true,
    });
    t.set(0);
  }, [step, reveal, t]);

  const finishDrag = useCallback(
    (didCommit: boolean) => {
      if (didCommit) commit(step - 1);
      else cancel();
    },
    [step, commit, cancel]
  );

  const handleBack = useCallback(() => {
    if (flight?.interactive) return;
    go(step - 1);
  }, [flight, step, go]);

  const handleNext = useCallback(() => {
    if (step === ARRIVAL) {
      setShowCompletion(true);
      return;
    }
    // A Step can refuse Forward, and only Forward: the Stage stays exactly
    // where it is while the Step explains itself.
    if (flight || !gate.canContinue(step)) return;
    go(step + 1);
  }, [step, go, gate, flight]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (step === SPLASH) return false;
        go(step - 1);
        return true;
      }
    );
    return () => subscription.remove();
  }, [step, go]);

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .enabled(step >= 2)
        .activeOffsetX(14)
        .failOffsetY([-22, 22])
        .onStart(() => {
          'worklet';
          if (busy.get()) return;
          busy.set(true);
          dragging.set(true);
          runOnJS(beginDrag)();
        })
        .onUpdate((event) => {
          'worklet';
          if (!dragging.get()) return;
          const distance = Math.max(0, event.translationX);
          t.set(Math.min(distance / reveal, 1));
        })
        .onEnd((event) => {
          'worklet';
          if (!dragging.get()) return;
          dragging.set(false);
          const shouldCommit =
            t.get() > DRAG_COMMIT.distance ||
            event.velocityX > DRAG_COMMIT.velocity;
          t.set(
            withTiming(
              shouldCommit ? 1 : 0,
              {
                duration: shouldCommit ? DURATION.settle : DURATION.cancel,
                easing: EASE,
              },
              (done) => {
                if (done) runOnJS(finishDrag)(shouldCommit);
              }
            )
          );
        })
        .onFinalize((_event, success) => {
          'worklet';
          if (!success && dragging.get()) {
            dragging.set(false);
            t.set(
              withTiming(0, { duration: DURATION.cancel, easing: EASE }, (done) => {
                if (done) runOnJS(finishDrag)(false);
              })
            );
          }
        }),
    [step, reveal, beginDrag, finishDrag, busy, dragging, t]
  );

  const fromStep = flight ? flight.from : step;
  const toStep = flight ? flight.to : step;

  const chromeStep = flight
    ? flight.to === SPLASH
      ? flight.from
      : flight.to
    : Math.max(step, 1);
  const chromeMeta = metaFor(chromeStep);
  const prevMeta =
    flight && flight.from !== SPLASH && flight.to !== SPLASH
      ? metaFor(flight.from)
      : null;

  /**
   * The Splash is the first panel on the same track, not a separate surface: it
   * travels the same distance and fades on the same windows as any other Step,
   * so entering the Flow feels like the first step of the stepper.
   */
  const splashStyle = useAnimatedStyle(() => {
    if (!flight) return { opacity: 1, transform: [{ translateX: 0 }] };
    if (flight.from !== SPLASH && flight.to !== SPLASH) {
      return { opacity: 0, transform: [{ translateX: 0 }] };
    }
    const exiting = flight.from === SPLASH;
    const p = t.value;
    const opacity = exiting
      ? interpolate(p, FADE.out, [1, 0], Extrapolation.CLAMP)
      : interpolate(p, FADE.in, [0, 1], Extrapolation.CLAMP);
    return {
      opacity,
      transform: [
        {
          translateX: exiting
            ? -flight.dir * flight.travel * p
            : flight.dir * flight.travel * (1 - p),
        },
      ],
    };
  }, [flight]);

  const splashVisible =
    step === SPLASH ||
    (flight !== null && (flight.from === SPLASH || flight.to === SPLASH));

  const layers: { index: number; role: LayerRole }[] = [];
  if (!flight) {
    if (step > SPLASH) layers.push({ index: step, role: 'rest' });
  } else if (flight.from === SPLASH) {
    layers.push({ index: flight.to, role: 'entering' });
  } else if (flight.to === SPLASH) {
    layers.push({ index: flight.from, role: 'exiting' });
  } else {
    layers.push({ index: flight.from, role: 'exiting' });
    layers.push({ index: flight.to, role: 'entering' });
  }

  return (
    <GestureDetector gesture={pan}>
      <View
        style={styles.root}
        onLayout={(event) => {
          const next = event.nativeEvent.layout.width;
          if (Math.abs(next - width) > 1) setWidth(next);
        }}
      >
        {step !== SPLASH || flight ? (
          <Animated.View style={styles.shell} testID="flow-shell">
            <Chrome
              meta={chromeMeta}
              prevMeta={prevMeta}
              fromStep={fromStep}
              toStep={toStep}
              t={t}
              dir={flight?.dir ?? 1}
              onBack={handleBack}
              onNext={handleNext}
            >
              {layers.map((layer) => {
                const Stage = STAGES[layer.index];
                if (!Stage) return null;
                return (
                  <StageLayer
                    key={layer.index}
                    index={layer.index}
                    role={layer.role}
                    flight={flight}
                    t={t}
                    reduced={reduced}
                  >
                    <Stage />
                  </StageLayer>
                );
              })}
            </Chrome>
          </Animated.View>
        ) : null}

        {splashVisible ? (
          <Animated.View
            style={[styles.splash, splashStyle]}
            pointerEvents={flight?.from === SPLASH ? 'none' : 'auto'}
            testID={
              flight && (flight.from === SPLASH || flight.to === SPLASH)
                ? 'flow-step-0'
                : undefined
            }
          >
            <SplashScreen
              onStart={() => go(1)}
              onSkip={() => go(ARRIVAL)}
              onSignIn={() => go(1)}
            />
          </Animated.View>
        ) : null}

        <CompletionModal visible={showCompletion} onEnter={onFinish} />
      </View>
    </GestureDetector>
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
  shell: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  splash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
