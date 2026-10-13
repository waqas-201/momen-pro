import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar, Platform, Modal, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
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
import {
  Amiri_400Regular,
  Amiri_700Bold,
} from '@expo-google-fonts/amiri';
import { OnboardingProvider } from './src/context/OnboardingContext';
import { SplashScreen } from './src/screens/SplashScreen';
import { ScreenPrayers } from './src/screens/ScreenPrayers';
import { ScreenPrayerSpace } from './src/screens/ScreenPrayerSpace';
import { ScreenRemembrance } from './src/screens/ScreenRemembrance';
import { ScreenRecitation } from './src/screens/ScreenRecitation';
import { ScreenMissedPrayers } from './src/screens/ScreenMissedPrayers';
import { ScreenDailyIntentions } from './src/screens/ScreenDailyIntentions';
import { ScreenJourneyBegins } from './src/screens/ScreenJourneyBegins';
import { Colors } from './src/theme/colors';
import { FontFamilies } from './src/theme/typography';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<number>(0);
  const [journeyCompleted, setJourneyCompleted] = useState<boolean>(false);

  const [fontsLoaded] = useFonts({
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

  const nextScreen = () => {
    setCurrentScreen((prev) => Math.min(prev + 1, 7));
  };

  const prevScreen = () => {
    setCurrentScreen((prev) => Math.max(prev - 1, 0));
  };

  const finishJourney = () => {
    setJourneyCompleted(true);
  };

  const resetJourney = () => {
    setJourneyCompleted(false);
    setCurrentScreen(0);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 0:
        return (
          <SplashScreen
            onStart={nextScreen}
            onSkip={() => setCurrentScreen(7)}
            onSignIn={() => setCurrentScreen(1)}
          />
        );
      case 1:
        return <ScreenPrayers onBack={prevScreen} onNext={nextScreen} />;
      case 2:
        return <ScreenPrayerSpace onBack={prevScreen} onNext={nextScreen} />;
      case 3:
        return <ScreenRemembrance onBack={prevScreen} onNext={nextScreen} />;
      case 4:
        return <ScreenRecitation onBack={prevScreen} onNext={nextScreen} />;
      case 5:
        return <ScreenMissedPrayers onBack={prevScreen} onNext={nextScreen} />;
      case 6:
        return <ScreenDailyIntentions onBack={prevScreen} onNext={nextScreen} />;
      case 7:
        return <ScreenJourneyBegins onBack={prevScreen} onFinish={finishJourney} />;
      default:
        return (
          <SplashScreen
            onStart={nextScreen}
            onSkip={() => setCurrentScreen(7)}
            onSignIn={() => setCurrentScreen(1)}
          />
        );
    }
  };

  return (
    <SafeAreaProvider>
      <OnboardingProvider>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.bg} />
        <View style={styles.outerContainer}>
          <View style={styles.mobileFrame}>
            {renderScreen()}

            {/* Journey Completed Modal */}
            <Modal
              visible={journeyCompleted}
              transparent
              animationType="fade"
              onRequestClose={() => setJourneyCompleted(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalCard}>
                  <Text style={styles.modalSeal}>✦ ﷽ ✦</Text>
                  <Text style={styles.modalTitle}>Māshā’Allāh!</Text>
                  <Text style={styles.modalMessage}>
                    Welcome to Momen Pro. Your sacred journey has begun. May your
                    days be filled with barakah and presence in your worship.
                  </Text>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={resetJourney}
                  >
                    <Text style={styles.modalButtonText}>Start Over / Explore</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </View>
      </OnboardingProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: Platform.OS === 'web' ? '#041A16' : Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' ? ({ minHeight: '100vh', width: '100vw' } as any) : {}),
  },
  mobileFrame: {
    width: Platform.OS === 'web' ? 390 : '100%',
    maxWidth: 390,
    height: Platform.OS === 'web' ? 884 : '100%',
    maxHeight: Platform.OS === 'web' ? 884 : undefined,
    backgroundColor: Colors.bg,
    overflow: 'hidden',
    position: 'relative',
    ...(Platform.OS === 'web'
      ? ({
          borderRadius: 36,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.45), 0 0 40px rgba(200, 168, 107, 0.15)',
          borderWidth: 1,
          borderColor: 'rgba(200, 168, 107, 0.3)',
        } as any)
      : {}),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(4, 26, 22, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.goldLight,
    padding: 28,
    alignItems: 'center',
    maxWidth: 340,
    width: '100%',
  },
  modalSeal: {
    color: Colors.gold,
    fontSize: 18,
    marginBottom: 10,
    fontFamily: FontFamilies.amiriRegular,
  },
  modalTitle: {
    fontFamily: FontFamilies.serifSemiBold,
    fontSize: 28,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 10,
  },
  modalMessage: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 13,
    lineHeight: 20,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
  },
  modalButtonText: {
    color: '#FFFDF9',
    fontSize: 13,
    fontWeight: '600',
    fontFamily: FontFamilies.sansSemiBold,
  },
});
