import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
import { ChevronLeft, Minus, Plus, Check, ArrowRight } from 'lucide-react-native';
import { FontFamilies } from '../theme/typography';
import { useOnboarding } from '../context/OnboardingContext';

interface ScreenRecitationProps {
  onNext: () => void;
  onBack: () => void;
}

const FREQUENCY_OPTIONS = ['Yes', 'Sometimes', 'Not yet'];
const UNIT_OPTIONS = ['Ayahs', 'Ruku', 'Para (Juz)'];

export const ScreenRecitation: React.FC<ScreenRecitationProps> = ({
  onNext,
  onBack,
}) => {
  const {
    recitesEveryDay,
    setRecitesEveryDay,
    recitationAmount,
    setRecitationAmount,
    recitationUnit,
    setRecitationUnit,
    setTargetRecitation,
  } = useOnboarding();

  const handleDecrease = () => {
    setRecitationAmount((prev) => {
      const next = Math.max(1, prev - 1);
      setTargetRecitation(next);
      return next;
    });
  };

  const handleIncrease = () => {
    setRecitationAmount((prev) => {
      const next = prev + 1;
      setTargetRecitation(next);
      return next;
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Ambient Glow */}
        <View style={styles.ambientGlow} pointerEvents="none" />

        {/* Arch Outline Watermark */}
        <View style={styles.archOutline} pointerEvents="none" />

        {/* Brand Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            testID="header-back-button"
          >
            <ChevronLeft size={16} color="#083B32" strokeWidth={2} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/momen-pro-logo.png')}
              style={styles.brandLogo}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBar}>
          <View style={styles.progressLabels}>
            <Text style={styles.progressTitle}>YOUR RECITATION</Text>
            <Text style={styles.progressCount}>4 of 6</Text>
          </View>
          <View style={styles.progressTrack}>
            {[1, 2, 3, 4, 5, 6].map((segment) => (
              <View
                key={segment}
                style={[
                  styles.progressSegment,
                  segment <= 4 ? styles.segmentActive : styles.segmentInactive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Qur'anic Reflection */}
          <View style={styles.reflectionContainer}>
            <Text style={styles.arabicText}>وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا</Text>
            <View style={styles.verseBadge}>
              <Text style={styles.badgeStar}>✦</Text>
              <Text style={styles.badgeText}>
                Surah Al-Muzzammil · 73:4 · excerpt
              </Text>
            </View>
            <Text style={styles.translationText}>
              “Recite the Qur’an with measured recitation.”
            </Text>
          </View>

          {/* Personal Reflection */}
          <View style={styles.personalReflection}>
            {/* Title & Subtitle */}
            <View style={styles.questionBlock}>
              <Text style={styles.title}>Do you recite the Qur’an every day?</Text>
              <Text style={styles.subtitle}>
                A few verses or a longer reading — every moment with the Qur’an matters.
              </Text>
            </View>

            {/* Recitation Answers Pills */}
            <View style={styles.answersRow}>
              {FREQUENCY_OPTIONS.map((freq) => {
                const isSelected = recitesEveryDay === freq;
                return (
                  <TouchableOpacity
                    key={freq}
                    style={[
                      styles.answerPill,
                      isSelected ? styles.answerPillActive : styles.answerPillInactive,
                    ]}
                    onPress={() => setRecitesEveryDay(freq)}
                    activeOpacity={0.8}
                    testID={`freq-pill-${freq.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  >
                    {isSelected && (
                      <Check size={13} color="#FAF9F6" strokeWidth={2.4} />
                    )}
                    <Text
                      style={[
                        styles.answerPillText,
                        isSelected
                          ? styles.answerPillTextActive
                          : styles.answerPillTextInactive,
                      ]}
                    >
                      {freq}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Recitation Amount Follow-up */}
            <View style={styles.followUpSection}>
              <Text style={styles.followUpLabel}>
                How much do you usually recite?
              </Text>

              {/* Stepper Input */}
              <View style={styles.stepperContainer}>
                <TouchableOpacity
                  style={styles.stepperButton}
                  onPress={handleDecrease}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  testID="recitation-decrease-btn"
                  activeOpacity={0.7}
                >
                  <Minus size={16} color="#083B32" strokeWidth={2.4} />
                </TouchableOpacity>

                <View style={styles.quantityContainer}>
                  <Text style={styles.quantityNumber}>{recitationAmount}</Text>
                  <Text style={styles.quantityUnit}>per day</Text>
                </View>

                <TouchableOpacity
                  style={styles.stepperButton}
                  onPress={handleIncrease}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  testID="recitation-increase-btn"
                  activeOpacity={0.7}
                >
                  <Plus size={16} color="#083B32" strokeWidth={2.4} />
                </TouchableOpacity>
              </View>

              {/* Unit Selection Pills */}
              <View style={styles.unitsRow}>
                {UNIT_OPTIONS.map((unit) => {
                  const isSelected = recitationUnit === unit;
                  return (
                    <TouchableOpacity
                      key={unit}
                      style={[
                        styles.unitPill,
                        isSelected ? styles.unitPillActive : styles.unitPillInactive,
                      ]}
                      onPress={() => setRecitationUnit(unit)}
                      activeOpacity={0.8}
                      testID={`unit-pill-${unit.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    >
                      {isSelected && (
                        <Check size={13} color="#FAF9F6" strokeWidth={2.4} />
                      )}
                      <Text
                        style={[
                          styles.unitPillText,
                          isSelected
                            ? styles.unitPillTextActive
                            : styles.unitPillTextInactive,
                        ]}
                      >
                        {unit}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Rhythm Caption */}
              <Text style={styles.rhythmCaption}>
                Your current rhythm: {recitationAmount} {recitationUnit.toLowerCase()} each day.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Journey Action */}
        <View style={styles.journeyAction}>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={onNext}
            activeOpacity={0.85}
            testID="recitation-continue-btn"
          >
            <Text style={styles.ctaText}>Continue</Text>
            <ArrowRight size={16} color="#C8A86B" strokeWidth={2.4} />
          </TouchableOpacity>

          <Text style={styles.footerNote}>
            A little reflection. A gentler beginning.
          </Text>

          <View style={styles.homeIndicatorContainer}>
            <View style={styles.homeIndicator} />
          </View>
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
    width: '100%',
    maxWidth: 390,
    maxHeight: 884,
    alignSelf: 'center',
    backgroundColor: '#FAF9F6',
    position: 'relative',
    overflow: 'hidden',
  },
  ambientGlow: {
    position: 'absolute',
    top: -100,
    alignSelf: 'center',
    width: 256,
    height: 256,
    borderRadius: 128,
    backgroundColor: 'rgba(229, 200, 142, 0.19)',
    ...(Platform.OS === 'web'
      ? { filter: 'blur(32px)' }
      : { shadowColor: '#C8A86B', shadowOpacity: 0.35, shadowRadius: 32 }),
  },
  archOutline: {
    position: 'absolute',
    top: 24,
    alignSelf: 'center',
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
    justifyContent: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 24,
    top: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 44,
    zIndex: 10,
  },
  backText: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 12,
    fontWeight: '500',
    color: '#083B32',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandLogo: {
    width: 96,
    height: 76,
  },
  progressBar: {
    height: 44,
    paddingHorizontal: 28,
    justifyContent: 'center',
    gap: 10,
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
    color: '#083B32',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
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
  segmentActive: {
    backgroundColor: '#083B32',
  },
  segmentInactive: {
    backgroundColor: '#DFDCD2',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  reflectionContainer: {
    height: 132,
    paddingHorizontal: 28,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  arabicText: {
    fontFamily: FontFamilies.amiriRegular,
    fontSize: 25,
    lineHeight: 40,
    color: '#083B32',
    textAlign: 'center',
  },
  verseBadge: {
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
  badgeStar: {
    color: '#C8A86B',
    fontSize: 10,
  },
  badgeText: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 10,
    fontWeight: '500',
    color: '#083B32',
  },
  translationText: {
    fontFamily: FontFamilies.serifItalic,
    fontStyle: 'italic',
    fontWeight: '400',
    fontSize: 18,
    lineHeight: 23,
    color: '#57534E',
    textAlign: 'center',
  },
  personalReflection: {
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 12,
    gap: 16,
  },
  questionBlock: {
    gap: 8,
  },
  title: {
    fontFamily: FontFamilies.serifSemiBold,
    fontSize: 29,
    fontWeight: '600',
    lineHeight: 32,
    color: '#083B32',
  },
  subtitle: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 21,
    color: '#78716C',
  },
  answersRow: {
    flexDirection: 'row',
    gap: 8,
  },
  answerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 9999,
    borderWidth: 1,
    gap: 7,
  },
  answerPillActive: {
    backgroundColor: '#083B32',
    borderColor: '#083B32',
  },
  answerPillInactive: {
    backgroundColor: '#FFFDF9',
    borderColor: '#DFDCD2',
  },
  answerPillText: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 12,
    fontWeight: '500',
  },
  answerPillTextActive: {
    color: '#FAF9F6',
  },
  answerPillTextInactive: {
    color: '#083B32',
  },
  followUpSection: {
    gap: 12,
  },
  followUpLabel: {
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 13,
    fontWeight: '600',
    color: '#083B32',
  },
  stepperContainer: {
    height: 58,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DFDCD2',
    backgroundColor: '#FFFDF9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepperButton: {
    width: 34,
    height: 34,
    borderRadius: 9999,
    backgroundColor: '#F4EDDF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  quantityNumber: {
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 22,
    fontWeight: '600',
    color: '#083B32',
  },
  quantityUnit: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 12,
    fontWeight: '400',
    color: '#78716C',
  },
  unitsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  unitPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 9999,
    borderWidth: 1,
    gap: 7,
  },
  unitPillActive: {
    backgroundColor: '#083B32',
    borderColor: '#083B32',
  },
  unitPillInactive: {
    backgroundColor: '#FFFDF9',
    borderColor: '#DFDCD2',
  },
  unitPillText: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 12,
    fontWeight: '500',
  },
  unitPillTextActive: {
    color: '#FAF9F6',
  },
  unitPillTextInactive: {
    color: '#083B32',
  },
  rhythmCaption: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 11,
    lineHeight: 18,
    fontWeight: '400',
    color: '#78716C',
  },
  journeyAction: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 14 : 12,
    gap: 14,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  ctaButton: {
    width: '100%',
    height: 54,
    backgroundColor: '#083B32',
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(200, 168, 107, 0.5)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  ctaText: {
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 15,
    fontWeight: '600',
    color: '#FAF9F6',
  },
  footerNote: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 10,
    fontWeight: '400',
    color: '#78716C',
    textAlign: 'center',
  },
  homeIndicatorContainer: {
    height: 24,
    paddingTop: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeIndicator: {
    width: 128,
    height: 4,
    backgroundColor: '#D6D3D1',
    borderRadius: 9999,
  },
});
