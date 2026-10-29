import React, { createContext, useContext } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { STAGGER } from './motion';

interface BeatContextValue {
  t: SharedValue<number>;
  entering: boolean;
  reduced: boolean;
}

const BeatContext = createContext<BeatContextValue | null>(null);

export const BeatProvider: React.FC<{
  t: SharedValue<number>;
  entering: boolean;
  reduced: boolean;
  children: React.ReactNode;
}> = ({ t, entering, reduced, children }) => (
  <BeatContext.Provider value={{ t, entering, reduced }}>
    {children}
  </BeatContext.Provider>
);

interface StageBeatProps {
  /** 1 settles with the move; 2 follows slightly later. */
  beat?: 1 | 2;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

/**
 * The second beat of a Step's arrival. Content wrapped in this settles just
 * after the move itself, so the eye has a path — read, then act — instead of a
 * whole page arriving as one block.
 */
export const StageBeat: React.FC<StageBeatProps> = ({
  beat = 2,
  style,
  children,
}) => {
  const ctx = useContext(BeatContext);
  const t = ctx?.t;
  const entering = ctx?.entering ?? false;
  const reduced = ctx?.reduced ?? false;
  const start = beat === 2 ? STAGGER : 0;

  const animated = useAnimatedStyle(() => {
    if (!t || !entering || reduced) {
      return { opacity: 1, transform: [{ translateY: 0 }] };
    }
    const p = interpolate(
      t.value,
      [start, 1],
      [0, 1],
      Extrapolation.CLAMP
    );
    return {
      opacity: p,
      transform: [{ translateY: (1 - p) * 7 }],
    };
  }, [t, entering, reduced, start]);

  return (
    <Animated.View style={[styles.wrap, style, animated]}>{children}</Animated.View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
});
