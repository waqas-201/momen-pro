import React, { useState } from 'react';
import { View, StyleSheet, type LayoutChangeEvent } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { Colors } from '../theme/colors';
import { FontFamilies } from '../theme/typography';
import { TOTAL_STEPS } from '../steps';

interface StepProgressProps {
  title: string;
  countLabel: string;
  /** Chrome is anchored; its labels cross-fade in place when the Step changes. */
  prevTitle?: string | null;
  prevCountLabel?: string | null;
  fromStep: number;
  toStep: number;
  t: SharedValue<number>;
  dir: 1 | -1;
  totalSteps?: number;
}

const GAP = 4;
const HEIGHT = 3;

interface SegmentProps {
  index: number;
  width: number;
  fromStep: number;
  toStep: number;
  t: SharedValue<number>;
}

const Segment: React.FC<SegmentProps> = ({ index, width, fromStep, toStep, t }) => {
  // A continuous step position means the bar scrubs with the move (and with the
  // back gesture) instead of repainting.
  const fill = useAnimatedStyle(() => {
    const position = fromStep + (toStep - fromStep) * t.value;
    const ratio = interpolate(
      position - index,
      [0, 1],
      [0, 1],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ translateX: (ratio - 1) * width }],
    };
  }, [fromStep, toStep, width]);

  const settled = index < Math.round(fromStep);

  return (
    <View
      style={[
        styles.segment,
        { backgroundColor: settled ? Colors.primary : Colors.border },
      ]}
    >
      {width > 0 ? (
        <Animated.View
          style={[{ width, height: HEIGHT, backgroundColor: Colors.primary }, fill]}
        />
      ) : null}
    </View>
  );
};

export const StepProgress: React.FC<StepProgressProps> = ({
  title,
  countLabel,
  prevTitle,
  prevCountLabel,
  fromStep,
  toStep,
  t,
  dir,
  totalSteps = TOTAL_STEPS,
}) => {
  const [trackWidth, setTrackWidth] = useState(0);

  const onLayout = (event: LayoutChangeEvent) => {
    const next = event.nativeEvent.layout.width;
    if (Math.abs(next - trackWidth) > 0.5) setTrackWidth(next);
  };

  const segmentWidth =
    trackWidth > 0 ? (trackWidth - GAP * (totalSteps - 1)) / totalSteps : 0;

  const outgoing = useAnimatedStyle(() => ({
    opacity: 1 - t.value,
    transform: [{ translateX: -dir * 6 * t.value }],
  }), [dir]);

  const incoming = useAnimatedStyle(() => ({
    opacity: t.value,
    transform: [{ translateX: dir * 6 * (1 - t.value) }],
  }), [dir]);

  return (
    <View style={styles.container} testID="flow-progress">
      <View style={styles.labelRow}>
        <View style={styles.titleSlot}>
          {prevTitle ? (
            <Animated.Text
              style={[styles.titleText, styles.stacked, outgoing]}
              numberOfLines={1}
            >
              {prevTitle.toUpperCase()}
            </Animated.Text>
          ) : null}
          <Animated.Text
            style={[styles.titleText, prevTitle ? incoming : null]}
            numberOfLines={1}
          >
            {title.toUpperCase()}
          </Animated.Text>
        </View>

        <View style={styles.countSlot}>
          {prevCountLabel ? (
            <Animated.Text
              style={[styles.stepCountText, styles.stacked, outgoing]}
              numberOfLines={1}
            >
              {prevCountLabel}
            </Animated.Text>
          ) : null}
          <Animated.Text
            style={[styles.stepCountText, prevCountLabel ? incoming : null]}
            numberOfLines={1}
          >
            {countLabel}
          </Animated.Text>
        </View>
      </View>

      <View style={styles.track} onLayout={onLayout}>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <Segment
            key={index}
            index={index}
            width={segmentWidth}
            fromStep={fromStep}
            toStep={toStep}
            t={t}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 2,
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  titleSlot: {
    flexShrink: 1,
    justifyContent: 'center',
  },
  countSlot: {
    minWidth: 46,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  stacked: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  titleText: {
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 9.5,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: Colors.primary,
  },
  stepCountText: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 9.5,
    fontWeight: '400',
    color: Colors.textSecondary,
    textAlign: 'right',
  },
  track: {
    flexDirection: 'row',
    gap: GAP,
    width: '100%',
  },
  segment: {
    flex: 1,
    height: HEIGHT,
    borderRadius: 9999,
    overflow: 'hidden',
  },
});
