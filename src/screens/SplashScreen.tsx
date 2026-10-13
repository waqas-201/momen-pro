import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { ArchWatermark } from '../components/ArchWatermark';

interface SplashScreenProps {
  onStart: () => void;
  onSkip: () => void;
  onSignIn?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onStart,
  onSkip,
  onSignIn,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ArchWatermark hasInnerDashed={true} />

        {/* Top bar with Skip button */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={onSkip}
            style={styles.skipButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            testID="splash-skip-button"
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Center Content Section */}
        <View style={styles.centerSection}>
          {/* 1. Master Brand Logo */}
          <View style={styles.logoWrapper}>
            <Image
              source={require('../../assets/momen-pro-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Ornamental Divider (top anchor) */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerStar}>✦</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* 2. Arabic Ayah Inscription */}
          <Text style={styles.arabicHeading}>
            أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ
          </Text>

          {/* Ornamental Divider (bottom anchor) */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerStar}>✦</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* 3. Surah Pill Badge */}
          <View style={styles.pillBadge}>
            <Text style={styles.pillStar}>✦</Text>
            <Text style={styles.pillText}>{"Surah Ar-Ra'd • 13:28"}</Text>
          </View>

          {/* 4. English Italic Serif Translation */}
          <Text style={styles.translationText}>
            “Verily, in the remembrance of Allah do{'\n'}hearts find rest.”
          </Text>
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            onPress={onStart}
            style={styles.ctaButton}
            activeOpacity={0.88}
            testID="splash-begin-button"
          >
            <Text style={styles.ctaButtonText}>Begin with Bismillah</Text>
            <ArrowRight size={18} color={Colors.gold} strokeWidth={2.4} />
          </TouchableOpacity>

          <View style={styles.secondaryLoginPrompt}>
            <Text style={styles.travelerText}>Already a traveler? </Text>
            <TouchableOpacity onPress={onSignIn || onStart}>
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.homeIndicator} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: Colors.bg,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 12,
    paddingRight: 10,
    zIndex: 10,
  },
  skipButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 9999,
  },
  skipText: {
    fontSize: 12.5,
    fontWeight: '500',
    color: 'rgba(10, 56, 48, 0.65)',
    letterSpacing: 0.3,
  },
  centerSection: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  logoWrapper: {
    marginBottom: 6,
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 145,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 160,
    opacity: 0.75,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.gold,
  },
  dividerStar: {
    color: Colors.gold,
    fontSize: 10,
    marginHorizontal: 8,
  },
  arabicHeading: {
    fontFamily: Platform.select({ ios: 'Geeza Pro', android: 'serif', default: 'Amiri, Traditional Arabic, serif' }),
    fontSize: 27,
    fontWeight: '700',
    lineHeight: 44,
    letterSpacing: 0.5,
    textAlign: 'center',
    color: Colors.primaryDark,
    paddingHorizontal: 16,
    direction: 'rtl',
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    gap: 6,
    marginTop: 2,
  },
  pillStar: {
    color: Colors.gold,
    fontSize: 10,
  },
  pillText: {
    color: Colors.primaryLight,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  translationText: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'Cormorant Garamond, Georgia, serif' }),
    fontStyle: 'italic',
    fontSize: 16.5,
    lineHeight: 24,
    textAlign: 'center',
    color: Colors.textDarkStone,
    marginTop: 6,
    paddingHorizontal: 24,
  },
  bottomSection: {
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 14 : 16,
    gap: 14,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 54,
    backgroundColor: Colors.primary,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: Colors.goldMedium,
    gap: 12,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 12px 28px -6px rgba(8, 59, 50, 0.35)' }
      : {
          shadowColor: Colors.primary,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 14,
          elevation: 5,
        }),
  },
  ctaButtonText: {
    color: Colors.textLight,
    fontSize: 15.5,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  secondaryLoginPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  travelerText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  signInText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  homeIndicator: {
    width: 128,
    height: 4,
    backgroundColor: Colors.indicator,
    borderRadius: 9999,
    marginTop: 4,
  },
});
