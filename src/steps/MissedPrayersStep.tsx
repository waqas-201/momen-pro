import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Heart, Check } from 'lucide-react-native';
import { FontFamilies } from '../theme/typography';
import { QuranicReflection } from '../components/QuranicReflection';
import { StageBeat } from '../flow/StageBeat';
import { useOnboarding } from '../context/OnboardingContext';

const QUICK_PILLS = ['0', '5', '10', '25', '50+'];

export const MissedPrayersStep: React.FC = () => {
  const { missedPrayers, setMissedPrayers, missedNotSure, setMissedNotSure } =
    useOnboarding();

  const handleToggleNotSure = () => {
    setMissedNotSure(!missedNotSure);
  };

  const handleQuickPill = (val: string) => {
    const numericVal = parseInt(val.replace(/[^0-9]/g, ''), 10) || 0;
    setMissedPrayers(numericVal);
    setMissedNotSure(false);
  };

  return (
    <View style={styles.mainContent}>
      <QuranicReflection
        arabicText="لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ"
        reference="Surah Az-Zumar · 39:53 · excerpt"
        translation="“Do not despair of the mercy of Allah.”"
      />

      <View style={styles.questionSection}>
        <Text style={styles.title}>Do you have prayers to make up?</Text>
        <Text style={styles.subtitle}>
          A fresh beginning with gentle intentions.
        </Text>
      </View>

      <StageBeat style={styles.entrySection}>
        <View style={styles.inputCard}>
          <TextInput
            style={styles.textInput}
            value={
              missedNotSure ? '' : missedPrayers > 0 ? String(missedPrayers) : ''
            }
            onChangeText={(text) => {
              const numericVal = parseInt(text.replace(/[^0-9]/g, ''), 10) || 0;
              setMissedPrayers(numericVal);
              if (missedNotSure) setMissedNotSure(false);
            }}
            placeholder={missedNotSure ? 'Starting fresh' : '0'}
            placeholderTextColor="#A8A29E"
            keyboardType="number-pad"
            maxLength={5}
            testID="missed-prayers-input"
          />
          <Text style={styles.inputSuffix}>prayers</Text>
        </View>

        <View style={styles.quickPillsRow}>
          {QUICK_PILLS.map((pill) => {
            const pillNum = parseInt(pill.replace(/[^0-9]/g, ''), 10) || 0;
            const isSelected = !missedNotSure && missedPrayers === pillNum;

            return (
              <TouchableOpacity
                key={pill}
                style={[
                  styles.quickPill,
                  isSelected ? styles.quickPillActive : styles.quickPillInactive,
                ]}
                onPress={() => handleQuickPill(pill)}
                activeOpacity={0.7}
                hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
              >
                <Text
                  style={[
                    styles.quickPillText,
                    isSelected && styles.quickPillTextActive,
                  ]}
                >
                  {pill}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[
            styles.notSureCard,
            missedNotSure
              ? styles.notSureCardActive
              : styles.notSureCardInactive,
          ]}
          onPress={handleToggleNotSure}
          activeOpacity={0.8}
          testID="missed-not-sure-btn"
        >
          <View style={styles.notSureLabelGroup}>
            <Heart
              size={15}
              color={missedNotSure ? '#083B32' : '#78716C'}
              strokeWidth={2}
            />
            <Text
              style={[
                styles.notSureText,
                missedNotSure && styles.notSureTextActive,
              ]}
            >
              {"I'm not sure / Starting fresh"}
            </Text>
          </View>

          <View
            style={[
              styles.indicatorCircle,
              missedNotSure
                ? styles.indicatorCircleActive
                : styles.indicatorCircleInactive,
            ]}
          >
            {missedNotSure && (
              <Check size={10} color="#FFFFFF" strokeWidth={3} />
            )}
          </View>
        </TouchableOpacity>

        <View style={styles.guidanceBanner}>
          <Text style={styles.bannerText}>
            Every prayer completed is barakah. Take it one day at a time.
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
    gap: 7,
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 46,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFDCD2',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  textInput: {
    flex: 1,
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 20,
    color: '#083B32',
    padding: 0,
  },
  inputSuffix: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 13,
    color: '#78716C',
  },
  quickPillsRow: {
    flexDirection: 'row',
    gap: 6,
    width: '100%',
  },
  quickPill: {
    flex: 1,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
  quickPillInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E7E4DA',
  },
  quickPillActive: {
    backgroundColor: '#F5EFE3',
    borderColor: '#C8A86B',
  },
  quickPillText: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 11.5,
    color: '#78716C',
  },
  quickPillTextActive: {
    fontFamily: FontFamilies.sansSemiBold,
    fontWeight: '600',
    color: '#083B32',
  },
  notSureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 42,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  notSureCardInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E7E4DA',
  },
  notSureCardActive: {
    backgroundColor: '#F5EFE3',
    borderColor: '#C8A86B',
  },
  notSureLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notSureText: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 12.5,
    color: '#57534E',
  },
  notSureTextActive: {
    fontFamily: FontFamilies.sansSemiBold,
    fontWeight: '600',
    color: '#083B32',
  },
  indicatorCircle: {
    width: 18,
    height: 18,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorCircleInactive: {
    borderWidth: 1,
    borderColor: '#DFDCD2',
    backgroundColor: 'transparent',
  },
  indicatorCircleActive: {
    borderWidth: 1,
    backgroundColor: '#083B32',
    borderColor: '#083B32',
  },
  guidanceBanner: {
    backgroundColor: 'rgba(200, 168, 107, 0.1)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(200, 168, 107, 0.3)',
    paddingVertical: 7,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  bannerText: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 11,
    lineHeight: 15,
    color: '#083B32',
    textAlign: 'center',
  },
});
