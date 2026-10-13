import React, { useState } from 'react';
import { StyleSheet, View, StatusBar, Platform, Modal, Text, TouchableOpacity } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
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

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<number>(0);
  const [journeyCompleted, setJourneyCompleted] = useState<boolean>(false);

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
  },
  mobileFrame: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 440 : undefined,
    height: '100%',
    backgroundColor: Colors.bg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 28,
    elevation: 8,
    position: 'relative',
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
    maxWidth: 360,
    width: '100%',
  },
  modalSeal: {
    color: Colors.gold,
    fontSize: 18,
    marginBottom: 10,
  },
  modalTitle: {
    fontFamily: Platform.select({ ios: 'Georgia', default: 'serif' }),
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 10,
  },
  modalMessage: {
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
    borderColor: Colors.goldLight,
  },
  modalButtonText: {
    color: '#FFFDF9',
    fontSize: 13,
    fontWeight: '600',
  },
});
