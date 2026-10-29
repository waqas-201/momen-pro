import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.safeArea}>
      <View style={styles.container}>
        {/* Ambient Arches */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <View
            style={[
              styles.outerArch,
              { bottom: Math.max(insets.bottom + 12, 24) },
            ]}
          />
          <View
            style={[
              styles.innerDashedArch,
              { bottom: Math.max(insets.bottom + 20, 36) },
            ]}
          />
        </View>

        {/* Top Bar with Skip button */}
        <View
          style={[
            styles.topBar,
            { paddingTop: Math.max(insets.top + 4, 16) },
          ]}
        >
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
          {/* Master Brand Logo */}
          <View style={styles.logoWrapper}>
            <Image
              source={require('../../assets/momen-pro-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Ornamental Gold Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLineLeft} />
            <Text style={styles.dividerStar}>✦</Text>
            <View style={styles.dividerLineRight} />
          </View>

          {/* Arabic Calligraphy Inscription */}
          <Text style={styles.arabicHeading}>
            أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ
          </Text>

          {/* Ornamental Gold Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLineLeft} />
            <Text style={styles.dividerStar}>✦</Text>
            <View style={styles.dividerLineRight} />
          </View>

          {/* Verse Reference Pill */}
          <View style={styles.pillBadge}>
            <Text style={styles.pillStar}>✦</Text>
            <Text style={styles.pillText}>{"Surah Ar-Ra'd • 13:28"}</Text>
          </View>

          {/* Translation */}
          <Text style={styles.translationText}>
            {"“Verily, in the remembrance of Allah do\nhearts find rest.”"}
          </Text>
        </View>

        {/* Bottom Section */}
        <View
          style={[
            styles.bottomSection,
            {
              paddingBottom: Math.max(
                insets.bottom + 14,
                Platform.OS === 'android' ? 30 : 22
              ),
            },
          ]}
        >
          <TouchableOpacity
            onPress={onStart}
            style={styles.ctaButton}
            activeOpacity={0.88}
            testID="splash-begin-button"
          >
            <Text style={styles.ctaButtonText}>Begin with Bismillah</Text>
            <ArrowRight size={16} color="#C8A86B" strokeWidth={2.4} />
          </TouchableOpacity>

          <View style={styles.secondaryLoginPrompt}>
            <Text style={styles.travelerText}>Already a traveler? </Text>
            <TouchableOpacity
              onPress={onSignIn || onStart}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
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
    alignSelf: 'center',
    backgroundColor: '#FAF9F6',
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
  },
  outerArch: {
    position: 'absolute',
    top: 18,
    left: 14,
    right: 14,
    borderWidth: 1,
    borderColor: 'rgba(200, 168, 107, 0.18)',
    borderTopLeftRadius: 160,
    borderTopRightRadius: 160,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  innerDashedArch: {
    position: 'absolute',
    top: 28,
    left: 24,
    right: 24,
    borderWidth: 1,
    borderColor: 'rgba(200, 168, 107, 0.12)',
    borderStyle: 'dashed',
    borderTopLeftRadius: 150,
    borderTopRightRadius: 150,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 20,
    zIndex: 10,
  },
  skipButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 9999,
  },
  skipText: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 11,
    color: 'rgba(10, 56, 48, 0.65)',
    letterSpacing: 0.3,
  },
  centerSection: {
    // `flex: 1` lets the middle give way on short screens instead of pushing the
    // top bar and the bottom CTA past the edges of the container.
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 2,
    paddingHorizontal: 20,
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
  },
  logo: {
    width: 148,
    height: 114,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 130,
  },
  dividerLineLeft: {
    flex: 1,
    height: 1,
    backgroundColor: '#C8A86B',
    opacity: 0.7,
  },
  dividerLineRight: {
    flex: 1,
    height: 1,
    backgroundColor: '#C8A86B',
    opacity: 0.7,
  },
  dividerStar: {
    fontSize: 9,
    color: '#C8A86B',
    marginHorizontal: 8,
    lineHeight: 11,
  },
  arabicHeading: {
    fontFamily: FontFamilies.amiriBold,
    fontSize: 25,
    lineHeight: 40,
    textAlign: 'center',
    color: '#083B32',
    letterSpacing: -0.2,
    paddingHorizontal: 12,
    writingDirection: 'rtl',
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 253, 249, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(200, 168, 107, 0.55)',
    borderRadius: 9999,
    paddingVertical: 3,
    paddingHorizontal: 11,
  },
  pillStar: {
    fontSize: 9,
    color: '#C8A86B',
    lineHeight: 11,
  },
  pillText: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 10.5,
    color: '#083B32',
    letterSpacing: 0.2,
  },
  translationText: {
    fontFamily: FontFamilies.serifItalic,
    fontStyle: 'italic',
    fontSize: 13.5,
    lineHeight: 19,
    color: '#57534E',
    textAlign: 'center',
    marginTop: 2,
    paddingHorizontal: 16,
  },
  bottomSection: {
    width: '100%',
    paddingHorizontal: 22,
    gap: 8,
    alignItems: 'center',
  },
  ctaButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#083B32',
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(200, 168, 107, 0.4)',
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 8px 24px -4px rgba(8, 59, 50, 0.28)' }
      : {
          shadowColor: '#083B32',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.22,
          shadowRadius: 10,
          elevation: 3,
        }),
  },
  ctaButtonText: {
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 14,
    color: '#FFFDF9',
    letterSpacing: 0.2,
  },
  secondaryLoginPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  travelerText: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 11.5,
    color: '#78716C',
  },
  signInText: {
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 11.5,
    color: '#083B32',
    textDecorationLine: 'underline',
  },
});
