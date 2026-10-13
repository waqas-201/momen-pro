import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import { ChevronLeft, Check, ArrowRight } from 'lucide-react-native';
import { FontFamilies } from '../theme/typography';
import { ArchWatermark } from '../components/ArchWatermark';
import { useOnboarding } from '../context/OnboardingContext';

interface ScreenPrayersProps {
  onNext: () => void;
  onBack: () => void;
}

const PRAYER_OPTIONS = [
  { value: '0', label: 'Not yet' },
  { value: '1–2', label: 'prayers' },
  { value: '3–4', label: 'prayers' },
  { value: '5', label: 'prayers' },
];

export const ScreenPrayers: React.FC<ScreenPrayersProps> = ({ onNext, onBack }) => {
  const { dailyPrayersCount, setDailyPrayersCount } = useOnboarding();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Architectural Arch Outline & Ambient Glow */}
        <ArchWatermark />

        {/* Header (Height: 104, padding: 16px 24px 0px) */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            testID="header-back-button"
          >
            <ChevronLeft size={16} color="#083B32" strokeWidth={2} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <View style={styles.logoContainer} pointerEvents="none">
            <Image
              source={require('../../assets/momen-pro-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Progress Bar (Height: 44, padding: 0 28px) */}
        <View style={styles.progressContainer}>
          <View style={styles.progressLabelRow}>
            <Text style={styles.progressCategory}>YOUR PRAYERS</Text>
            <Text style={styles.progressStepCount}>1 of 6</Text>
          </View>
          <View style={styles.progressTrack}>
            {[0, 1, 2, 3, 4, 5].map((index) => {
              const isActive = index === 0;
              return (
                <View
                  key={index}
                  style={[
                    styles.progressSegment,
                    isActive
                      ? styles.progressSegmentActive
                      : styles.progressSegmentInactive,
                  ]}
                />
              );
            })}
          </View>
        </View>

        {/* Scrollable Content Area */}
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Qur'anic Reflection (Height: 132, padding: 0 28px) */}
          <View style={styles.reflectionContainer}>
            <Text style={styles.arabicText}>وَأَقِمِ الصَّلَاةَ لِذِكْرِي</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeStar}>✦</Text>
              <Text style={styles.badgeText}>Surah Ta-Ha · 20:14 · excerpt</Text>
            </View>
            <Text style={styles.translationText}>
              “Establish prayer for My remembrance.”
            </Text>
          </View>

          {/* Personal Reflection (Padding: 18px 24px 12px) */}
          <View style={styles.personalReflection}>
            <Text style={styles.title}>
              How many prayers do you usually offer each day?
            </Text>
            <Text style={styles.subtitle}>
              Of the five daily prayers, choose what reflects your days right now.
            </Text>
          </View>

          {/* Prayer Count Options */}
          <View style={styles.optionsList}>
            {PRAYER_OPTIONS.map((option) => {
              const isSelected =
                dailyPrayersCount === option.value ||
                (option.value === '1–2' && dailyPrayersCount === '1-2') ||
                (option.value === '3–4' && dailyPrayersCount === '3-4');

              return (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionCard,
                    isSelected
                      ? styles.optionCardActive
                      : styles.optionCardInactive,
                  ]}
                  onPress={() => setDailyPrayersCount(option.value)}
                  activeOpacity={0.8}
                  testID={`prayer-option-${option.value}`}
                >
                  <Text
                    style={styles.optionNumber}
                    numberOfLines={1}
                    ellipsizeMode="clip"
                  >
                    {option.value}
                  </Text>
                  <Text
                    style={[
                      styles.optionLabel,
                      isSelected && styles.optionLabelActive,
                    ]}
                    numberOfLines={1}
                  >
                    {option.label}
                  </Text>
                  <View
                    style={[
                      styles.indicatorCircle,
                      isSelected
                        ? styles.indicatorCircleActive
                        : styles.indicatorCircleInactive,
                    ]}
                  >
                    {isSelected && (
                      <Check size={12} color="#FFFFFF" strokeWidth={3} />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Footnote */}
          <Text style={styles.footnote}>
            Every beginning matters. There’s no judgment here.
          </Text>
        </ScrollView>

        {/* Journey Action (Bottom CTA & Home Indicator) */}
        <View style={styles.journeyAction}>
          <TouchableOpacity
            onPress={onNext}
            style={styles.ctaButton}
            activeOpacity={0.85}
            testID="prayers-continue-btn"
          >
            <Text style={styles.ctaText}>Continue</Text>
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
    position: 'relative',
    maxWidth: 390,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    height: 104,
    paddingTop: 16,
    paddingHorizontal: 24,
    paddingBottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 24,
    top: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 2,
    zIndex: 10,
  },
  backText: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 12,
    color: '#083B32',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 96,
    height: 76,
  },
  progressContainer: {
    height: 44,
    paddingHorizontal: 28,
    justifyContent: 'center',
    gap: 8,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressCategory: {
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 10,
    letterSpacing: 0.8,
    color: '#083B32',
    textTransform: 'uppercase',
  },
  progressStepCount: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 10,
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
  progressSegmentActive: {
    backgroundColor: '#083B32',
  },
  progressSegmentInactive: {
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
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  arabicText: {
    fontFamily: FontFamilies.amiriRegular,
    fontSize: 25,
    lineHeight: 40,
    color: '#083B32',
    textAlign: 'center',
  },
  badge: {
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
    color: '#083B32',
  },
  translationText: {
    fontFamily: FontFamilies.serifItalic,
    fontStyle: 'italic',
    fontSize: 18,
    lineHeight: 23,
    color: '#57534E',
    textAlign: 'center',
  },
  personalReflection: {
    paddingTop: 18,
    paddingHorizontal: 24,
    paddingBottom: 12,
    gap: 6,
  },
  title: {
    fontFamily: FontFamilies.serifSemiBold,
    fontSize: 29,
    lineHeight: 32,
    color: '#083B32',
  },
  subtitle: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 13,
    lineHeight: 21,
    color: '#78716C',
  },
  optionsList: {
    paddingHorizontal: 24,
    gap: 8,
    marginTop: 2,
  },
  optionCard: {
    height: 44,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  optionCardInactive: {
    backgroundColor: '#FFFDF9',
    borderColor: '#DFDCD2',
  },
  optionCardActive: {
    backgroundColor: '#EAF0EA',
    borderColor: '#083B32',
  },
  optionNumber: {
    fontFamily: FontFamilies.serifSemiBold,
    fontSize: 20,
    lineHeight: 22,
    color: '#083B32',
    minWidth: 32,
    flexShrink: 0,
    textAlign: 'left',
    ...(Platform.OS === 'web' ? { whiteSpace: 'nowrap' as any } : {}),
  },
  optionLabel: {
    flex: 1,
    fontFamily: FontFamilies.sansMedium,
    fontSize: 14,
    lineHeight: 18,
    color: '#083B32',
    ...(Platform.OS === 'web' ? { whiteSpace: 'nowrap' as any } : {}),
  },
  optionLabelActive: {
    fontFamily: FontFamilies.sansSemiBold,
    fontWeight: '600',
  },
  indicatorCircle: {
    width: 20,
    height: 20,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
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
  footnote: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 13,
    lineHeight: 21,
    color: '#78716C',
    paddingHorizontal: 24,
    marginTop: 12,
  },
  journeyAction: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 14 : 12,
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'transparent',
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
      ? { boxShadow: '0px 8px 20px -5px rgba(8, 59, 50, 0.17)' as any }
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
    color: '#FAF9F6',
    letterSpacing: 0.2,
  },
  footerNote: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 10,
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
