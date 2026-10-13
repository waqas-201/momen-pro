import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
import { ChevronLeft, Heart, Check, ArrowRight } from 'lucide-react-native';
import { FontFamilies } from '../theme/typography';
import { useOnboarding } from '../context/OnboardingContext';

interface ScreenMissedPrayersProps {
  onNext: () => void;
  onBack: () => void;
}

export const ScreenMissedPrayers: React.FC<ScreenMissedPrayersProps> = ({
  onNext,
  onBack,
}) => {
  const { missedPrayers, setMissedPrayers, missedNotSure, setMissedNotSure } =
    useOnboarding();

  const handleToggleNotSure = () => {
    setMissedNotSure(!missedNotSure);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Ambient Glow */}
        <View style={styles.ambientGlow} pointerEvents="none" />

        {/* Arch Outline (width 360, height 836, borderRadius 180/40, border 'rgba(200, 168, 107, 0.2)') */}
        <View style={styles.archOutline} pointerEvents="none" />

        {/* Header (Height 104, padding: 16px 24px 0px) */}
        <View style={styles.header}>
          <View style={styles.headerBackContainer}>
            {onBack && (
              <TouchableOpacity
                onPress={onBack}
                style={styles.backButton}
                activeOpacity={0.7}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                testID="header-back-button"
              >
                <ChevronLeft size={16} color="#083B32" strokeWidth={2.2} />
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.headerLogoContainer}>
            <Image
              source={require('../../assets/momen-pro-logo.png')}
              style={styles.headerLogo}
              resizeMode="contain"
            />
          </View>
          <View style={styles.headerRightPlaceholder} />
        </View>

        {/* Progress Bar (Height 44, padding: 0 28px) */}
        <View style={styles.progressContainer}>
          <View style={styles.progressLabels}>
            <Text style={styles.progressTitle}>A FRESH BEGINNING</Text>
            <Text style={styles.progressCount}>5 of 6</Text>
          </View>
          <View style={styles.progressTrack}>
            {[1, 2, 3, 4, 5, 6].map((segmentIndex) => (
              <View
                key={segmentIndex}
                style={[
                  styles.progressSegment,
                  {
                    backgroundColor:
                      segmentIndex <= 5 ? '#083B32' : '#DFDCD2',
                  },
                ]}
              />
            ))}
          </View>
        </View>

        {/* Scrollable Content Area */}
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Qur'anic Reflection (Height 132, padding: 0 28px) */}
          <View style={styles.reflectionContainer}>
            <Text style={styles.reflectionArabic}>
              لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ
            </Text>
            <View style={styles.reflectionBadge}>
              <Text style={styles.reflectionBadgeStar}>✦</Text>
              <Text style={styles.reflectionBadgeText}>
                Surah Az-Zumar · 39:53 · excerpt
              </Text>
            </View>
            <Text style={styles.reflectionTranslation}>
              “Do not despair of Allah’s mercy.”
            </Text>
          </View>

          {/* Personal Reflection (Padding: 18px 24px 12px) */}
          <View style={styles.personalReflection}>
            <Text style={styles.personalTitle}>
              How many prayers did you miss last month?
            </Text>
            <Text style={styles.personalSubtitle}>
              For your qaza record, estimate the total missed prayers across the whole month.
            </Text>
          </View>

          {/* Monthly Missed Prayer Entry */}
          <View style={styles.entrySection}>
            <Text style={styles.entryLabel}>Missed prayers · last month</Text>

            {/* Numeric Input Card (Height 62px, paddingHorizontal: 18) */}
            <TouchableOpacity
              activeOpacity={1}
              style={[
                styles.inputCard,
                !missedNotSure && styles.inputCardActive,
              ]}
              onPress={() => {
                if (missedNotSure) {
                  setMissedNotSure(false);
                }
              }}
            >
              <TextInput
                style={styles.numericInput}
                value={
                  missedNotSure
                    ? ''
                    : missedPrayers !== undefined
                    ? String(missedPrayers)
                    : '8'
                }
                placeholder={missedNotSure ? '0' : '8'}
                placeholderTextColor="#78716C"
                onChangeText={(val) => {
                  if (missedNotSure) setMissedNotSure(false);
                  const parsed = parseInt(val.replace(/[^0-9]/g, ''), 10);
                  setMissedPrayers(isNaN(parsed) ? 0 : parsed);
                }}
                keyboardType="number-pad"
                editable={!missedNotSure}
                testID="missed-prayers-input"
              />
              <View style={styles.caret} />
              <Text style={styles.unitLabel}>prayers in total</Text>
            </TouchableOpacity>

            {/* 'I’m not sure' Answer Card (padding: 12px 16px, borderRadius: 16) */}
            <TouchableOpacity
              style={[
                styles.notSureCard,
                missedNotSure && styles.notSureCardActive,
              ]}
              onPress={handleToggleNotSure}
              activeOpacity={0.8}
              testID="missed-not-sure-option"
            >
              <Text
                style={[
                  styles.notSureText,
                  missedNotSure && styles.notSureTextActive,
                ]}
              >
                I’m not sure
              </Text>
              <View
                style={[
                  styles.radioIndicator,
                  missedNotSure && styles.radioIndicatorActive,
                ]}
              >
                {missedNotSure && (
                  <Check size={12} color="#FAF9F6" strokeWidth={3} />
                )}
              </View>
            </TouchableOpacity>

            {/* Gentle Guidance Banner (padding: 14px, borderRadius: 12) */}
            <View style={styles.guidanceBanner}>
              <Heart size={17} color="#C8A86B" strokeWidth={2.2} />
              <Text style={styles.guidanceText}>
                An estimate is enough for now. You can update your record later.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Journey Action (CTA button 54px + Footer note + Home indicator 128x4) */}
        <View style={styles.journeyAction}>
          <TouchableOpacity
            onPress={onNext}
            style={styles.ctaButton}
            activeOpacity={0.85}
            testID="missed-prayers-continue-btn"
          >
            <Text style={styles.ctaButtonText}>Continue</Text>
            <ArrowRight size={17} color="#C8A86B" strokeWidth={2.4} />
          </TouchableOpacity>

          <Text style={styles.footerNote}>
            A little reflection. A gentler beginning.
          </Text>

          <View style={styles.homeIndicator} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
    width: '100%',
    maxWidth: 390,
    alignSelf: 'center',
    position: 'relative',
  },
  ambientGlow: {
    position: 'absolute',
    top: -90,
    alignSelf: 'center',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(229, 200, 142, 0.22)',
    opacity: 0.8,
    ...(Platform.OS === 'web'
      ? { filter: 'blur(36px)' }
      : { shadowColor: '#C8A86B', shadowOpacity: 0.35, shadowRadius: 36 }),
  },
  archOutline: {
    position: 'absolute',
    top: 24,
    left: 15,
    width: 360,
    height: 836,
    borderWidth: 1,
    borderColor: 'rgba(200, 168, 107, 0.2)',
    borderTopLeftRadius: 180,
    borderTopRightRadius: 180,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  header: {
    height: 104,
    paddingTop: 16,
    paddingHorizontal: 24,
    paddingBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  headerBackContainer: {
    width: 70,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  backText: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 12,
    fontWeight: '500',
    color: '#083B32',
  },
  headerLogoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLogo: {
    width: 96,
    height: 76,
  },
  headerRightPlaceholder: {
    width: 70,
  },
  progressContainer: {
    height: 44,
    paddingHorizontal: 28,
    paddingVertical: 0,
    justifyContent: 'center',
    gap: 8,
    zIndex: 1,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressTitle: {
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: '#083B32',
  },
  progressCount: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 10,
    fontWeight: '400',
    color: '#78716C',
  },
  progressTrack: {
    flexDirection: 'row',
    gap: 5,
    width: '100%',
  },
  progressSegment: {
    flex: 1,
    height: 3,
    borderRadius: 9999,
  },
  scrollArea: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  reflectionContainer: {
    height: 132,
    paddingHorizontal: 28,
    paddingVertical: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  reflectionArabic: {
    fontFamily: FontFamilies.amiriRegular,
    fontSize: 25,
    lineHeight: 40,
    textAlign: 'center',
    color: '#083B32',
    fontWeight: '400',
    writingDirection: 'rtl',
  },
  reflectionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 9999,
    backgroundColor: '#FFFDF9',
    borderWidth: 1,
    borderColor: 'rgba(200, 168, 107, 0.4)',
    gap: 6,
  },
  reflectionBadgeStar: {
    color: '#C8A86B',
    fontSize: 10,
  },
  reflectionBadgeText: {
    fontFamily: FontFamilies.sansMedium,
    color: '#083B32',
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 14,
  },
  reflectionTranslation: {
    fontFamily: FontFamilies.serifItalic,
    fontStyle: 'italic',
    fontSize: 18,
    lineHeight: 23,
    color: '#57534E',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  personalReflection: {
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 12,
    gap: 6,
  },
  personalTitle: {
    fontFamily: FontFamilies.serifSemiBold,
    fontSize: 29,
    fontWeight: '600',
    lineHeight: 32,
    letterSpacing: -0.3,
    color: '#083B32',
  },
  personalSubtitle: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 21,
    color: '#78716C',
  },
  entrySection: {
    paddingHorizontal: 24,
    gap: 10,
  },
  entryLabel: {
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 12,
    fontWeight: '600',
    color: '#083B32',
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 62,
    backgroundColor: '#FFFDF9',
    borderWidth: 1,
    borderColor: '#DFDCD2',
    borderRadius: 12,
    paddingHorizontal: 18,
    gap: 12,
  },
  inputCardActive: {
    borderColor: '#083B32',
  },
  numericInput: {
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 26,
    fontWeight: '600',
    color: '#083B32',
    minWidth: 28,
    padding: 0,
    margin: 0,
  },
  caret: {
    width: 1,
    height: 25,
    backgroundColor: '#C8A86B',
  },
  unitLabel: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 12,
    fontWeight: '400',
    color: '#78716C',
  },
  notSureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#FFFDF9',
    borderWidth: 1,
    borderColor: '#DFDCD2',
  },
  notSureCardActive: {
    backgroundColor: '#EAF0EA',
    borderColor: '#083B32',
  },
  notSureText: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 14,
    fontWeight: '500',
    color: '#083B32',
  },
  notSureTextActive: {
    fontFamily: FontFamilies.sansSemiBold,
    fontWeight: '600',
  },
  radioIndicator: {
    width: 20,
    height: 20,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#DFDCD2',
    backgroundColor: '#FFFDF9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioIndicatorActive: {
    backgroundColor: '#083B32',
    borderColor: '#083B32',
  },
  guidanceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#F4EDDF',
    gap: 10,
    marginTop: 2,
  },
  guidanceText: {
    flex: 1,
    fontFamily: FontFamilies.sansRegular,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 21,
    color: '#78716C',
  },
  journeyAction: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 14 : 12,
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 54,
    backgroundColor: '#083B32',
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(200, 168, 107, 0.5)',
    gap: 12,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 8px 20px -5px rgba(8, 59, 50, 0.17)' }
      : {
          shadowColor: '#083B32',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.17,
          shadowRadius: 10,
          elevation: 3,
        }),
  },
  ctaButtonText: {
    fontFamily: FontFamilies.sansSemiBold,
    color: '#FAF9F6',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  footerNote: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 10,
    fontWeight: '400',
    color: '#78716C',
    textAlign: 'center',
  },
  homeIndicator: {
    width: 128,
    height: 4,
    backgroundColor: '#D6D3D1',
    borderRadius: 9999,
    marginTop: 2,
  },
});
