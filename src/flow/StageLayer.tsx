import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { FADE } from './motion';
import { BeatProvider } from './StageBeat';
import type { SharedValue } from 'react-native-reanimated';
import type { Flight } from './types';

interface StageLayerProps {
  /** The Step's position in the Flow. Used for the layer's test hook. */
  index: number;
  role: 'rest' | 'entering' | 'exiting';
  flight: Flight | null;
  t: SharedValue<number>;
  reduced: boolean;
  children: React.ReactNode;
}

/**
 * One Step's content during a move. At rest the layer is static; while moving it
 * carries the shared-axis travel and the cross-fade. Only transforms and opacity
 * animate, so it all stays on the UI thread.
 */
export const StageLayer: React.FC<StageLayerProps> = ({
  index,
  role,
  flight,
  t,
  reduced,
  children,
}) => {
  const dir = flight?.dir ?? 1;
  const travel = flight?.travel ?? 0;
  const mode = flight?.mode ?? 'slide';
  const interactive = flight?.interactive ?? false;

  const animated = useAnimatedStyle(() => {
    if (role === 'rest' || reduced) {
      return { opacity: 1, transform: [{ translateX: 0 }, { translateY: 0 }] };
    }

    const p = t.value;
    // A drag keeps both surfaces readable: the reveal is under a thumb, so it
    // must not wash out halfway.
    const outWindow = interactive ? [0, 0.8] : FADE.out;
    const inWindow = interactive ? [0, 1] : FADE.in;

    const opacity =
      role === 'exiting'
        ? interpolate(p, outWindow, [1, 0], Extrapolation.CLAMP)
        : interpolate(p, inWindow, [0, 1], Extrapolation.CLAMP);

    return {
      opacity,
      transform: [
        {
          translateX:
            role === 'exiting' ? -dir * travel * p : dir * travel * (1 - p),
        },
        {
          translateY:
            mode === 'lift'
              ? role === 'exiting'
                ? -8 * p
                : 8 * (1 - p)
              : 0,
        },
      ],
    };
  }, [role, dir, travel, mode, interactive, reduced]);

  return (
    <Animated.View
      style={[styles.layer, animated]}
      pointerEvents={role === 'exiting' ? 'none' : 'auto'}
      testID={`flow-step-${index}`}
    >
      <BeatProvider t={t} entering={role === 'entering'} reduced={reduced}>
        {children}
      </BeatProvider>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  layer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
});
