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
  Sun,
  Sparkles,
  BookOpen,
  Minus,
  Plus,
  ChevronDown,
  ArrowRight,
} from 'lucide-react-native';
import { FontFamilies } from '../theme/typography';
import { useOnboarding } from '../context/OnboardingContext';

interface ScreenDailyIntentionsProps {
  onNext: () => void;
  onBack: () => void;
}

export const ScreenDailyIntentions: React.FC<ScreenDailyIntentionsProps> = ({
  onNext,
  onBack,
}) => {
  const {
    targetPrayers,
    setTargetPrayers,
    targetDhikr,
    setTargetDhikr,
    targetRecitation,
    setTargetRecitation,
    recitationUnit,
    setRecitationUnit,
  } = useOnboarding();

  const cycleRecitationUnit = () => {
    const units = ['Ayahs', 'Ruku', 'Para (Juz)'];
    const currentIndex = units.indexOf(recitationUnit);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % units.length;
    setRecitationUnit(units[nextIndex]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Arch outline & Top Ambient Glow */}
        <View style={styles.ambientGlow} pointerEvents="none" />
        <View style={styles.archOutline} pointerEvents="none" />

        {/* 2. Header (Height: 104, padding: 16px 24px 0px) */}
        <View style={styles.header}>
          {/* Centered Brand Logo Emblem (width 96, height 76) */}
          <View style={styles.logoCenterWrap} pointerEvents="none">
            <Image
              source={require('../../assets/momen-pro-logo.png')}
              style={styles.brandLogo}
              resizeMode="contain"
            />
          </View>

          {/* Back button */}
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
        </View>

        {/* 3. Progress Bar (Height: 44, padding: 0 28px) */}
        <View style={styles.progressBarSection}>
          <View style={styles.progressLabelsRow}>
            <Text style={styles.progressTitle}>YOUR DAILY INTENTIONS</Text>
            <Text style={styles.progressStepCount}>6 of 6</Text>
          </View>
          <View style={styles.progressTrack}>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <View key={index} style={styles.progressSegment} />
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
          {/* 4. Qur'anic Reflection (Height: 132, padding: 0 28px) */}
          <View style={styles.reflectionSection}>
            <Text style={styles.arabicText}>فَاسْتَبِقُوا الْخَيْرَاتِ</Text>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeStar}>✦</Text>
              <Text style={styles.badgeText}>Surah Al-Baqarah · 2:148 · excerpt</Text>
            </View>
            <Text style={styles.translationText}>“So compete in good deeds.”</Text>
          </View>

          {/* 5. Personal Reflection (padding: 18px 24px 12px) */}
          <View style={styles.personalReflectionSection}>
            <Text style={styles.reflectionTitle}>Set your daily intentions.</Text>
            <Text style={styles.reflectionSubtitle}>
              Start with achievable goals. Adjust these now, or change them any time later.
            </Text>
          </View>

          {/* 6. Daily Targets (3 editable cards, gap: 8) */}
          <View style={styles.targetsContainer}>
            {/* Goal 1: Prayer */}
            <View style={styles.targetCard}>
              <View style={styles.targetLabelRow}>
                <Sun size={17} color="#083B32" strokeWidth={2.2} />
                <Text style={styles.targetTitle}>Prayer</Text>
              </View>
              <View style={styles.controlRow}>
                <TouchableOpacity
                  style={styles.controlBtn}
                  onPress={() => setTargetPrayers((prev) => Math.max(1, prev - 1))}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  testID="target-prayer-minus"
                  activeOpacity={0.7}
                >
                  <Minus size={13} color="#083B32" strokeWidth={2.4} />
                </TouchableOpacity>

                <View style={styles.valueRow}>
                  <Text style={styles.numberText}>{targetPrayers}</Text>
                  <Text style={styles.unitText}>prayers / day</Text>
                </View>

                <TouchableOpacity
                  style={styles.controlBtn}
                  onPress={() => setTargetPrayers((prev) => Math.min(5, prev + 1))}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  testID="target-prayer-plus"
                  activeOpacity={0.7}
                >
                  <Plus size={13} color="#083B32" strokeWidth={2.4} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Goal 2: Dhikr */}
            <View style={styles.targetCard}>
              <View style={styles.targetLabelRow}>
                <Sparkles size={17} color="#083B32" strokeWidth={2.2} />
                <Text style={styles.targetTitle}>Dhikr</Text>
              </View>
              <View style={styles.controlRow}>
                <TouchableOpacity
                  style={styles.controlBtn}
                  onPress={() => setTargetDhikr((prev) => Math.max(10, prev - 10))}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  testID="target-dhikr-minus"
                  activeOpacity={0.7}
                >
                  <Minus size={13} color="#083B32" strokeWidth={2.4} />
                </TouchableOpacity>

                <View style={styles.valueRow}>
                  <Text style={styles.numberText}>{targetDhikr}</Text>
                  <Text style={styles.unitText}>remembrances / day</Text>
                </View>

                <TouchableOpacity
                  style={styles.controlBtn}
                  onPress={() => setTargetDhikr((prev) => prev + 10)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  testID="target-dhikr-plus"
                  activeOpacity={0.7}
                >
                  <Plus size={13} color="#083B32" strokeWidth={2.4} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Goal 3: Qur'an recitation */}
            <View style={styles.targetCard}>
              <View style={styles.targetLabelRow}>
                <BookOpen size={17} color="#083B32" strokeWidth={2.2} />
                <Text style={styles.targetTitle}>Qur’an recitation</Text>
              </View>
              <View style={styles.controlRow}>
                <TouchableOpacity
                  style={styles.controlBtn}
                  onPress={() => setTargetRecitation((prev) => Math.max(1, prev - 1))}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  testID="target-recitation-minus"
                  activeOpacity={0.7}
                >
                  <Minus size={13} color="#083B32" strokeWidth={2.4} />
                </TouchableOpacity>

                <View style={styles.valueRow}>
                  <Text style={styles.numberText}>{targetRecitation}</Text>
                  <TouchableOpacity
                    style={styles.unitSelector}
                    onPress={cycleRecitationUnit}
                    activeOpacity={0.7}
                    testID="target-recitation-unit-toggle"
                  >
                    <Text style={styles.unitText}>
                      {recitationUnit ? recitationUnit.toLowerCase() : 'ayahs'} / day
                    </Text>
                    <ChevronDown size={12} color="#78716C" strokeWidth={2.2} />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.controlBtn}
                  onPress={() => setTargetRecitation((prev) => prev + 1)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  testID="target-recitation-plus"
                  activeOpacity={0.7}
                >
                  <Plus size={13} color="#083B32" strokeWidth={2.4} />
                </TouchableOpacity>
              </View>
            </View>

            {/* 7. Footnote */}
            <Text style={styles.footnote}>
              Dhikr total includes your selected adhkar.
            </Text>
          </View>
        </ScrollView>

        {/* 8. Journey Action */}
        <View style={styles.journeyActionContainer}>
          <TouchableOpacity
            onPress={onNext}
            style={styles.saveGoalsBtn}
            activeOpacity={0.85}
            testID="save-goals-btn"
          >
            <Text style={styles.saveGoalsBtnText}>Save my goals</Text>
            <ArrowRight size={17} color="#C8A86B" strokeWidth={2.4} />
          </TouchableOpacity>

          <Text style={styles.footerNoteText}>
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
    backgroundColor: 'rgba(200, 168, 107, 0.14)',
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
    justifyContent: 'flex-start',
    position: 'relative',
  },
  logoCenterWrap: {
    position: 'absolute',
    top: 14,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandLogo: {
    width: 96,
    height: 76,
  },
  backButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 4,
    marginTop: 6,
    zIndex: 10,
  },
  backText: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 12,
    color: '#083B32',
  },
  progressBarSection: {
    height: 44,
    paddingHorizontal: 28,
    justifyContent: 'center',
    gap: 8,
  },
  progressLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressTitle: {
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 10,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: '#083B32',
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
    backgroundColor: '#083B32',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  reflectionSection: {
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
    writingDirection: 'rtl',
  },
  badgeContainer: {
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
  personalReflectionSection: {
    paddingTop: 18,
    paddingHorizontal: 24,
    paddingBottom: 12,
    gap: 6,
  },
  reflectionTitle: {
    fontFamily: FontFamilies.serifSemiBold,
    fontSize: 29,
    lineHeight: 32,
    color: '#083B32',
  },
  reflectionSubtitle: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 13,
    lineHeight: 21,
    color: '#78716C',
  },
  targetsContainer: {
    paddingHorizontal: 24,
    gap: 8,
  },
  targetCard: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DFDCD2',
    backgroundColor: '#FFFDF9',
    gap: 8,
  },
  targetLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  targetTitle: {
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 11,
    color: '#083B32',
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controlBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F4EDDF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 7,
  },
  numberText: {
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 22,
    color: '#083B32',
  },
  unitText: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 12,
    color: '#78716C',
  },
  unitSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footnote: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 11,
    lineHeight: 17,
    color: '#78716C',
    marginTop: 4,
  },
  journeyActionContainer: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 14 : 12,
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'transparent',
  },
  saveGoalsBtn: {
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
  saveGoalsBtnText: {
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 15,
    color: '#FAF9F6',
    letterSpacing: 0.2,
  },
  footerNoteText: {
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
