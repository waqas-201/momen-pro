import React, { useEffect } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '../theme/colors';
import { FontFamilies } from '../theme/typography';
import { DURATION, EASE } from './motion';

interface CompletionModalProps {
  visible: boolean;
  /** The Flow is over: this is the only way out of it, and it leads to Home. */
  onEnter: () => void;
}

export const CompletionModal: React.FC<CompletionModalProps> = ({
  visible,
  onEnter,
}) => {
  const p = useSharedValue(0);

  useEffect(() => {
    p.value = withTiming(visible ? 1 : 0, {
      duration: DURATION.settle,
      easing: EASE,
    });
  }, [visible, p]);

  const card = useAnimatedStyle(() => ({
    opacity: p.value,
    transform: [{ scale: 0.96 + 0.04 * p.value }],
  }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onEnter}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.card, card]}>
          <Text style={styles.seal}>✦ ﷽ ✦</Text>
          <Text style={styles.title}>Māshā’Allāh!</Text>
          <Text style={styles.message}>
            Welcome to Momen Pro. Your sacred journey has begun. May your days be
            filled with barakah and presence in your worship.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={onEnter}
            testID="completion-enter-button"
          >
            <Text style={styles.buttonText}>Enter Momen Pro</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(4, 26, 22, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.goldLight,
    padding: 28,
    alignItems: 'center',
    maxWidth: 340,
    width: '100%',
  },
  seal: {
    color: Colors.gold,
    fontSize: 18,
    marginBottom: 10,
    fontFamily: FontFamilies.amiriRegular,
  },
  title: {
    fontFamily: FontFamilies.serifSemiBold,
    fontSize: 28,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 10,
  },
  message: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 13,
    lineHeight: 20,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
  },
  buttonText: {
    color: '#FFFDF9',
    fontSize: 13,
    fontWeight: '600',
    fontFamily: FontFamilies.sansSemiBold,
  },
});
