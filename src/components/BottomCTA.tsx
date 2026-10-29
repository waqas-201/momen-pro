import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ArrowRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { FontFamilies } from '../theme/typography';
import { DURATION, EASE } from '../flow/motion';

interface BottomCTAProps {
  title: string;
  onPress: () => void;
  testID?: string;
  subtitle?: string;
}

/**
 * Anchored primary CTA. It never travels with the Stage; if its label changes
 * between Steps it cross-fades in place rather than swapping.
 */
export const BottomCTA: React.FC<BottomCTAProps> = ({
  title,
  onPress,
  testID = 'bottom-cta-button',
}) => {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(
    insets.bottom + 14,
    Platform.OS === 'android' ? 32 : 24
  );

  const [labels, setLabels] = useState<{ current: string; previous: string | null }>({
    current: title,
    previous: null,
  });
  const currentRef = useRef(title);
  const p = useSharedValue(1);

  useEffect(() => {
    if (title === currentRef.current) return;
    const previous = currentRef.current;
    currentRef.current = title;
    p.value = 0;
    p.value = withTiming(1, { duration: DURATION.labelIn, easing: EASE });
    setLabels({ current: title, previous });
  }, [title, p]);

  const incomingStyle = useAnimatedStyle(() => ({ opacity: p.value }));
  const outgoingStyle = useAnimatedStyle(() => ({ opacity: 1 - p.value }));

  return (
    <View style={[styles.container, { paddingBottom: bottomPadding }]} testID="flow-cta">
      <TouchableOpacity
        onPress={onPress}
        style={styles.pillButton}
        activeOpacity={0.85}
        testID={testID}
      >
        <View style={styles.labelStack}>
          {labels.previous ? (
            <Animated.Text
              style={[styles.buttonText, styles.stacked, outgoingStyle]}
              numberOfLines={1}
            >
              {labels.previous}
            </Animated.Text>
          ) : null}
          <Animated.Text
            style={[styles.buttonText, labels.previous ? incomingStyle : null]}
            numberOfLines={1}
          >
            {labels.current}
          </Animated.Text>
        </View>
        <ArrowRight size={17} color={Colors.gold} strokeWidth={2.4} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
    alignItems: 'center',
    backgroundColor: 'transparent',
    width: '100%',
  },
  pillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 50,
    backgroundColor: Colors.primary,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(200, 168, 107, 0.45)',
    gap: 10,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 6px 18px -4px rgba(8, 59, 50, 0.2)' }
      : {
          shadowColor: Colors.primary,
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.18,
          shadowRadius: 8,
          elevation: 3,
        }),
  },
  labelStack: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stacked: {
    position: 'absolute',
  },
  buttonText: {
    fontFamily: FontFamilies.sansSemiBold,
    color: Colors.textLight,
    fontSize: 14.5,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
