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
import { FontFamilies } from '../theme/typography';

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
        {/* Specifications 2 & 3: Background, Ambient Glow & Arches */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <View style={styles.ambientGlow} />
          <View style={styles.outerArch} />
          <View style={styles.innerDashedArch} />
        </View>

        {/* Specification 4: Top Bar with Skip button */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={onSkip}
            style={styles.skipButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            testID="splash-skip-button"
            activeOpacity={0.7}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Center Content Section */}
        <View style={styles.centerSection}>
          {/* Specification 5: Master Brand Logo */}
          <View style={styles.logoWrapper}>
            <Image
              source={require('../../assets/momen-pro-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Specification 6: Ornamental Gold Divider (Top anchor) */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLineLeft} />
            <Text style={styles.dividerStar}>✦</Text>
            <View style={styles.dividerLineRight} />
          </View>

          {/* Specification 7: Arabic Calligraphy Inscription */}
          <Text style={styles.arabicHeading}>
            أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ
          </Text>

          {/* Specification 6: Ornamental Gold Divider (Bottom anchor) */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLineLeft} />
            <Text style={styles.dividerStar}>✦</Text>
            <View style={styles.dividerLineRight} />
          </View>

          {/* Specification 8: Verse Reference Pill */}
          <View style={styles.pillBadge}>
            <Text style={styles.pillStar}>✦</Text>
            <Text style={styles.pillText}>{"Surah Ar-Ra'd • 13:28"}</Text>
          </View>

          {/* Specification 9: Translation */}
          <Text style={styles.translationText}>
            {"“Verily, in the remembrance of Allah do\nhearts find rest.”"}
          </Text>
        </View>

        {/* Specifications 10, 11, 12: Bottom Section */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            onPress={onStart}
            style={styles.ctaButton}
            activeOpacity={0.88}
            testID="splash-begin-button"
          >
            <Text style={styles.ctaButtonText}>Begin with Bismillah</Text>
            <ArrowRight size={18} color="#C8A86B" strokeWidth={2.4} />
          </TouchableOpacity>

          <View style={styles.secondaryLoginPrompt}>
            <Text style={styles.travelerText}>Already a traveler? </Text>
            <TouchableOpacity onPress={onSignIn || onStart} activeOpacity={0.7}>
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
  // Specification 1: Container 390px x 884px
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 390,
    height: '100%',
    maxHeight: 884,
    alignSelf: 'center',
    backgroundColor: '#FAF9F6',
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
  },

  // Specifications 2 & 3: Soft radial gold gradient at top and Arches
  ambientGlow: {
    position: 'absolute',
    top: -64,
    alignSelf: 'center',
    width: 256,
    height: 256,
    borderRadius: 128,
    backgroundColor: 'rgba(229, 200, 142, 0.25)',
    ...(Platform.OS === 'web'
      ? {
          filter: 'blur(36px)',
          background: 'radial-gradient(circle, rgba(229, 200, 142, 0.25) 0%, rgba(229, 200, 142, 0) 70%)',
        }
      : {
          shadowColor: '#C8A86B',
          shadowOpacity: 0.35,
          shadowRadius: 36,
          elevation: 4,
        }),
  },
  outerArch: {
    position: 'absolute',
    top: 24,
    left: 15,
    right: 15,
    bottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(200, 168, 107, 0.2)',
    borderTopLeftRadius: 180,
    borderTopRightRadius: 180,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  innerDashedArch: {
    position: 'absolute',
    top: 36,
    left: 27,
    right: 27,
    bottom: 36,
    borderWidth: 1,
    borderColor: 'rgba(200, 168, 107, 0.14)',
    borderStyle: 'dashed',
    borderTopLeftRadius: 168,
    borderTopRightRadius: 168,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },

  // Specification 4: Top Bar
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 48,
    paddingRight: 24,
    zIndex: 10,
  },
  skipButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 9999,
  },
  skipText: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 12,
    color: 'rgba(10, 56, 48, 0.65)',
    letterSpacing: 0.3,
  },

  // Specification 5: Master Brand Logo & Center Section
  centerSection: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  logo: {
    width: 192,
    height: 152,
  },

  // Specification 6: Ornamental Gold Dividers
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 160,
  },
  dividerLineLeft: {
    flex: 1,
    height: 1,
    backgroundColor: '#C8A86B',
    ...(Platform.OS === 'web'
      ? {
          backgroundImage: 'linear-gradient(to right, rgba(200, 168, 107, 0), rgba(200, 168, 107, 0.85))',
        }
      : { opacity: 0.7 }),
  },
  dividerLineRight: {
    flex: 1,
    height: 1,
    backgroundColor: '#C8A86B',
    ...(Platform.OS === 'web'
      ? {
          backgroundImage: 'linear-gradient(to left, rgba(200, 168, 107, 0), rgba(200, 168, 107, 0.85))',
        }
      : { opacity: 0.7 }),
  },
  dividerStar: {
    fontSize: 10,
    color: '#C8A86B',
    marginHorizontal: 8,
    lineHeight: 12,
  },

  // Specification 7: Arabic Calligraphy Inscription
  arabicHeading: {
    fontFamily: FontFamilies.amiriBold,
    fontSize: 30,
    lineHeight: 49.5,
    color: '#073B32',
    textAlign: 'center',
    direction: 'rtl',
    paddingHorizontal: 16,
  },

  // Specification 8: Verse Reference Pill
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderColor: 'rgba(200, 168, 107, 0.45)',
    borderWidth: 1,
    gap: 6,
    marginTop: 2,
  },
  pillStar: {
    fontSize: 10,
    color: '#C8A86B',
    lineHeight: 12,
  },
  pillText: {
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 12,
    color: '#125246',
    letterSpacing: 0.3,
  },

  // Specification 9: Translation
  translationText: {
    fontFamily: FontFamilies.serifItalic,
    fontStyle: 'italic',
    fontSize: 16.5,
    lineHeight: 24,
    color: '#57534E',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 24,
  },

  // Specifications 10, 11, 12: Bottom Section
  bottomSection: {
    alignItems: 'center',
    paddingHorizontal: 27,
    paddingBottom: Platform.OS === 'ios' ? 14 : 16,
    gap: 14,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 54,
    paddingHorizontal: 24,
    borderRadius: 9999,
    backgroundColor: '#083B32',
    borderColor: 'rgba(200, 168, 107, 0.5)',
    borderWidth: 1,
    gap: 12,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 12px 28px -6px rgba(8, 59, 50, 0.35)' }
      : {
          shadowColor: '#083B32',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 14,
          elevation: 5,
        }),
  },
  ctaButtonText: {
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 15.5,
    color: '#FAF9F6',
    letterSpacing: 0.3,
  },
  secondaryLoginPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  travelerText: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 13,
    color: '#78716C',
  },
  signInText: {
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 13,
    color: '#083B32',
    textDecorationLine: 'underline',
  },
  homeIndicator: {
    width: 128,
    height: 4,
    borderRadius: 9999,
    backgroundColor: '#D6D3D1',
    alignSelf: 'center',
    marginTop: 4,
  },
});
