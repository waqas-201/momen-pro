import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { User } from 'lucide-react-native';
import { FontFamilies } from '../theme/typography';
import { QuranicReflection } from '../components/QuranicReflection';
import { StageBeat } from '../flow/StageBeat';
import { useOnboarding } from '../context/OnboardingContext';

export const UsernameStep: React.FC = () => {
  const { userName, setUserName } = useOnboarding();

  return (
    <View style={styles.mainContent}>
      <QuranicReflection
        arabicText="وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَىٰ فَادْعُوهُ بِهَا"
        reference="Surah Al-A‘raf · 7:180 · excerpt"
        translation="“And to Allah belong the best names, so call upon Him by them.”"
      />

      <View style={styles.questionSection}>
        <Text style={styles.title}>What should we call you?</Text>
        <Text style={styles.subtitle}>
          Your name personalizes your daily intentions and sacred journey.
        </Text>
      </View>

      <StageBeat style={styles.entrySection}>
        <View style={styles.inputCard}>
          <View style={styles.iconContainer}>
            <User size={18} color="#083B32" strokeWidth={2.2} />
          </View>
          <TextInput
            style={styles.textInput}
            value={userName}
            onChangeText={setUserName}
            placeholder="Enter your name"
            placeholderTextColor="#A8A29E"
            autoCapitalize="words"
            autoCorrect={false}
            maxLength={32}
            testID="username-input"
          />
        </View>

        <View style={styles.guidanceBanner}>
          <Text style={styles.bannerText}>
            You can always update this anytime in your profile settings.
          </Text>
        </View>
      </StageBeat>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
    paddingVertical: 4,
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
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFDCD2',
    borderRadius: 12,
    paddingHorizontal: 14,
    gap: 10,
  },
  iconContainer: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    fontFamily: FontFamilies.sansMedium,
    fontSize: 16,
    color: '#083B32',
    padding: 0,
  },
  guidanceBanner: {
    backgroundColor: 'rgba(200, 168, 107, 0.1)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(200, 168, 107, 0.3)',
    paddingVertical: 9,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  bannerText: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 11.5,
    lineHeight: 16,
    color: '#083B32',
    textAlign: 'center',
  },
});
