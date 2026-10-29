import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { User } from 'lucide-react-native';
import { FontFamilies } from '../theme/typography';
import { QuranicReflection } from '../components/QuranicReflection';
import { StageBeat } from '../flow/StageBeat';
import { useOnboarding } from '../context/OnboardingContext';
import { EASE } from '../flow/motion';

export const UsernameStep: React.FC = () => {
  const { userName, setUserName } = useOnboarding();
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const isLifted = isFocused || keyboardVisible;
  const lift = useSharedValue(0);

  useEffect(() => {
    lift.value = withTiming(isLifted ? 1 : 0, {
      duration: 260,
      easing: EASE,
    });
  }, [isLifted, lift]);

  const animatedLiftStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -90 * lift.value }],
  }));

  const animatedReflectionStyle = useAnimatedStyle(() => ({
    opacity: 1 - 0.65 * lift.value,
    transform: [{ translateY: -20 * lift.value }],
  }));

  const handleCardPress = () => {
    inputRef.current?.focus();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardAvoid}
    >
      <View style={styles.mainContent}>
        <Animated.View style={animatedReflectionStyle}>
          <QuranicReflection
            arabicText="وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا"
            reference="Surah Al-Hujurat · 49:13 · excerpt"
            translation="“And We made you into peoples and tribes, that you may know one another.”"
          />
        </Animated.View>

        <Animated.View style={[styles.interactiveContent, animatedLiftStyle]}>
          <View style={styles.questionSection}>
            <Text style={styles.title}>What should we call you?</Text>
            <Text style={styles.subtitle}>
              Your name personalizes your daily intentions and sacred journey.
            </Text>
          </View>

          <StageBeat style={styles.entrySection}>
            <Pressable
              style={[
                styles.inputCard,
                isFocused ? styles.inputCardFocused : styles.inputCardBlurred,
              ]}
              onPress={handleCardPress}
              accessible={false}
            >
              <View style={styles.iconContainer} pointerEvents="none">
                <User
                  size={18}
                  color={isFocused ? '#083B32' : '#78716C'}
                  strokeWidth={2.2}
                />
              </View>
              <TextInput
                ref={inputRef}
                style={styles.textInput}
                value={userName}
                onChangeText={setUserName}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Enter your name"
                placeholderTextColor="#A8A29E"
                autoCapitalize="words"
                autoCorrect={false}
                maxLength={32}
                selectionColor="#083B32"
                cursorColor="#083B32"
                returnKeyType="done"
                testID="username-input"
              />
            </Pressable>

            <View style={styles.guidanceBanner}>
              <Text style={styles.bannerText}>
                You can always update this anytime in your profile settings.
              </Text>
            </View>
          </StageBeat>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
    width: '100%',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  interactiveContent: {
    width: '100%',
    gap: 16,
    alignItems: 'center',
  },
  questionSection: {
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 4,
  },
  title: {
    fontFamily: FontFamilies.serifSemiBold,
    fontSize: 23,
    lineHeight: 28,
    textAlign: 'center',
    color: '#083B32',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 12.5,
    lineHeight: 16,
    textAlign: 'center',
    color: '#57534E',
    paddingHorizontal: 10,
  },
  entrySection: {
    width: '100%',
    gap: 12,
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 14,
    gap: 10,
  },
  inputCardBlurred: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFDCD2',
  },
  inputCardFocused: {
    backgroundColor: '#FCFAF6',
    borderWidth: 1.5,
    borderColor: '#C8A86B',
  },
  iconContainer: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 16,
    color: '#083B32',
    paddingVertical: 0,
    paddingHorizontal: 0,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' as any } : {}),
  },
  guidanceBanner: {
    backgroundColor: 'rgba(200, 168, 107, 0.1)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(200, 168, 107, 0.3)',
    paddingVertical: 9,
    paddingHorizontal: 12,
    alignItems: 'center',
    width: '100%',
  },
  bannerText: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 11.5,
    lineHeight: 16,
    color: '#083B32',
    textAlign: 'center',
  },
});
