import React, { useEffect } from 'react';
import {
  StyleSheet,
  StatusBar,
  Platform,
  View,
  useWindowDimensions,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import {
  CormorantGaramond_400Regular_Italic,
  CormorantGaramond_600SemiBold,
  CormorantGaramond_700Bold,
} from '@expo-google-fonts/cormorant-garamond';
import { Amiri_400Regular, Amiri_700Bold } from '@expo-google-fonts/amiri';
import { OnboardingProvider } from './src/context/OnboardingContext';
import { AppShell } from './src/shell/AppShell';
import { StepGateProvider } from './src/flow/StepGate';
import { Colors } from './src/theme/colors';

/** The design reference the screens were drawn against. Not a screen size. */
const ARTBOARD_WIDTH = 390;
const ARTBOARD_HEIGHT = 884;

export default function App() {
  const { width, height } = useWindowDimensions();
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    CormorantGaramond_400Regular_Italic,
    CormorantGaramond_600SemiBold,
    CormorantGaramond_700Bold,
    Amiri_400Regular,
    Amiri_700Bold,
  });

  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const linkId = 'momen-pro-google-fonts';
      if (!document.getElementById(linkId)) {
        const link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        link.href =
          'https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap';
        document.head.appendChild(link);
      }
    }
  }, []);

  /**
   * The artboard is a reference, never a constraint. On web the Flow is drawn at
   * the artboard size but capped to the window: a frame larger than the viewport
   * is centred, so its own `overflow: 'hidden'` would slice the top bar (Skip)
   * and the bottom CTA off the screen. On native the window is the frame.
   */
  const frameSize =
    Platform.OS === 'web'
      ? {
          width: Math.min(ARTBOARD_WIDTH, width),
          height: Math.min(ARTBOARD_HEIGHT, height),
        }
      : null;

  // The rounded device chrome only makes sense once the design width is honoured.
  const showFrameChrome =
    Platform.OS === 'web' && width >= ARTBOARD_WIDTH && height >= 560;

  // Text is measured with whatever font is available at first paint. Rendering
  // before the fonts are registered bakes fallback metrics into the layout and
  // clips the glyphs that replace them.
  if (!fontsLoaded && !fontError) {
    return <View style={styles.boot} />;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <OnboardingProvider>
          <StepGateProvider>
            <StatusBar barStyle="light-content" backgroundColor={Colors.darkBg} />
            <View style={styles.outerContainer}>
              <View
                style={[
                  styles.mobileFrame,
                  frameSize,
                  showFrameChrome && styles.mobileFrameChrome,
                ]}
              >
                <AppShell />
              </View>
            </View>
          </StepGateProvider>
        </OnboardingProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  boot: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  outerContainer: {
    flex: 1,
    backgroundColor: Platform.OS === 'web' ? '#041A16' : Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web'
      ? // dvh, not vh: on mobile browsers vh includes the area behind the
        // address bar, which pushes the centred frame out of view again.
        ({ minHeight: '100dvh', width: '100%' } as any)
      : {}),
  },
  mobileFrame: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.bg,
    overflow: 'hidden',
    position: 'relative',
  },
  mobileFrameChrome: {
    ...(Platform.OS === 'web'
      ? ({
          borderRadius: 36,
          boxShadow:
            '0 20px 60px rgba(0, 0, 0, 0.45), 0 0 40px rgba(200, 168, 107, 0.15)',
          borderWidth: 1,
          borderColor: 'rgba(200, 168, 107, 0.3)',
        } as any)
      : {}),
  },
});
