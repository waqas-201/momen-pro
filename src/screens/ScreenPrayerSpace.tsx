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
import {
  ChevronLeft,
  ArrowRight,
  Check,
  Landmark,
  Home,
  Building2,
  MapPin,
} from 'lucide-react-native';
import { FontFamilies } from '../theme/typography';
import { useOnboarding } from '../context/OnboardingContext';

interface ScreenPrayerSpaceProps {
  onNext: () => void;
  onBack: () => void;
}

const SPACES = [
  { value: 'Mosque', label: 'Mosque', icon: Landmark },
  { value: 'Home', label: 'Home', icon: Home },
  { value: 'Work / school', label: 'Work / school', icon: Building2 },
  { value: 'It varies', label: 'It varies', icon: MapPin },
];

export const ScreenPrayerSpace: React.FC<ScreenPrayerSpaceProps> = ({
  onNext,
  onBack,
}) => {
  const { prayerSpace, setPrayerSpace } = useOnboarding();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Ambient Heavenly Glow */}
        <View style={styles.ambientGlow} pointerEvents="none" />

        {/* 1. Architectural Arch Outline (360x836, border 'rgba(200, 168, 107, 0.2)', radius 180/40) */}
        <View style={styles.archOutline} pointerEvents="none" />

        {/* 2. Header (Height 104, padding 16px 24px 0px, centered brand logo emblem 96x76, Back button) */}
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

          <Image
            source={require('../../assets/momen-pro-logo.png')}
            style={styles.brandLogo}
            resizeMode="contain"
          />
        </View>

        {/* 3. Progress Bar (Height 44, padding 0 28px, 6 segments, segments 1 & 2 active) */}
        <View style={styles.progressBar}>
          <View style={styles.progressLabels}>
            <Text style={styles.progressTitle}>YOUR PRAYER SPACE</Text>
            <Text style={styles.progressStepCount}>2 of 6</Text>
          </View>
          <View style={styles.progressTrack}>
            {[1, 2, 3, 4, 5, 6].map((seg) => (
              <View
                key={seg}
                style={[
                  styles.progressSegment,
                  { backgroundColor: seg <= 2 ? '#083B32' : '#DFDCD2' },
                ]}
              />
            ))}
          </View>
        </View>

        {/* Scrollable Center Content */}
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* 4. Qur'anic Reflection (Height 132, padding 0 28px, Arabic + badge + translation) */}
          <View style={styles.quranicReflection}>
            <Text style={styles.quranicArabic}>
              إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ
            </Text>

            <View style={styles.quranicBadge}>
              <Text style={styles.badgeStar}>✦</Text>
              <Text style={styles.badgeText}>
                Surah Al-‘Ankabut · 29:45 · excerpt
              </Text>
            </View>

            <Text style={styles.quranicTranslation}>
              “Indeed, prayer restrains from shameful and unjust deeds.”
            </Text>
          </View>

          {/* 5. Personal Reflection (padding 18px 24px 12px, Title + Subtitle) */}
          <View style={styles.personalReflection}>
            <Text style={styles.personalTitle}>Where do you usually pray?</Text>
            <Text style={styles.personalSubtitle}>
              Choose the place that feels most familiar in your daily routine.
            </Text>
          </View>

          {/* 6. Prayer Space Options (4 cards, 12px 16px padding, active/inactive states) */}
          <View style={styles.optionsList}>
            {SPACES.map((space) => {
              const IconComponent = space.icon;
              const isSelected = prayerSpace === space.value;
              return (
                <TouchableOpacity
                  key={space.value}
                  style={[
                    styles.optionCard,
                    isSelected
                      ? styles.optionCardActive
                      : styles.optionCardInactive,
                  ]}
                  onPress={() => setPrayerSpace(space.value)}
                  activeOpacity={0.8}
                  testID={`space-option-${space.value.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                >
                  <IconComponent
                    size={20}
                    color={isSelected ? '#083B32' : '#78716C'}
                    strokeWidth={2}
                  />
                  <Text
                    style={[
                      styles.optionLabel,
                      isSelected
                        ? styles.optionLabelActive
                        : styles.optionLabelInactive,
                    ]}
                  >
                    {space.label}
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
        </ScrollView>

        {/* 7. Journey Action (CTA button, footer note, home indicator) */}
        <View style={styles.journeyAction}>
          <TouchableOpacity
            onPress={onNext}
            style={styles.ctaButton}
            activeOpacity={0.85}
            testID="prayerspace-continue-btn"
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
    position: 'relative',
    overflow: 'hidden',
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
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 24,
    top: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    zIndex: 10,
  },
  backText: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 12,
    color: '#083B32',
  },
  brandLogo: {
    width: 96,
    height: 76,
  },
  progressBar: {
    height: 44,
    paddingHorizontal: 28,
    paddingVertical: 0,
    justifyContent: 'center',
    gap: 8,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressTitle: {
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 10,
    color: '#083B32',
    letterSpacing: 0.5,
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
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  quranicReflection: {
    height: 132,
    paddingHorizontal: 28,
    paddingVertical: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  quranicArabic: {
    fontFamily: FontFamilies.amiriRegular,
    fontSize: 25,
    lineHeight: 40,
    color: '#083B32',
    textAlign: 'center',
    direction: 'rtl',
  },
  quranicBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
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
  quranicTranslation: {
    fontFamily: FontFamilies.serifItalic,
    fontStyle: 'italic',
    fontSize: 18,
    lineHeight: 23,
    color: '#57534E',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  personalReflection: {
    paddingTop: 18,
    paddingHorizontal: 24,
    paddingBottom: 12,
    gap: 6,
  },
  personalTitle: {
    fontFamily: FontFamilies.serifSemiBold,
    fontSize: 29,
    lineHeight: 32,
    color: '#083B32',
  },
  personalSubtitle: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 13,
    lineHeight: 21,
    color: '#78716C',
  },
  optionsList: {
    paddingHorizontal: 24,
    gap: 10,
  },
  optionCard: {
    paddingVertical: 12,
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
  optionLabel: {
    flex: 1,
    fontSize: 14,
    color: '#083B32',
  },
  optionLabelInactive: {
    fontFamily: FontFamilies.sansMedium,
  },
  optionLabelActive: {
    fontFamily: FontFamilies.sansSemiBold,
  },
  indicatorCircle: {
    width: 20,
    height: 20,
    borderRadius: 9999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorCircleInactive: {
    borderColor: '#DFDCD2',
    backgroundColor: '#FFFDF9',
  },
  indicatorCircleActive: {
    backgroundColor: '#083B32',
    borderColor: '#083B32',
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
    height: 54,
    width: '100%',
    backgroundColor: '#083B32',
    borderWidth: 1,
    borderColor: 'rgba(200, 168, 107, 0.5)',
    borderRadius: 9999,
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
  ctaButtonText: {
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
