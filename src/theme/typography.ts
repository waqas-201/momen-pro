import { Platform, TextStyle } from 'react-native';

/**
 * Cross-platform font families for Momen Pro
 * Maps to @expo-google-fonts on native and CSS font-families on web
 */
export const FontFamilies = {
  // Plus Jakarta Sans
  sansRegular: Platform.select({
    web: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    default: 'PlusJakartaSans_400Regular',
  }),
  sansMedium: Platform.select({
    web: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    default: 'PlusJakartaSans_500Medium',
  }),
  sansSemiBold: Platform.select({
    web: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    default: 'PlusJakartaSans_600SemiBold',
  }),
  sansBold: Platform.select({
    web: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    default: 'PlusJakartaSans_700Bold',
  }),

  // Cormorant Garamond
  serifSemiBold: Platform.select({
    web: "'Cormorant Garamond', Georgia, serif",
    default: 'CormorantGaramond_600SemiBold',
  }),
  serifItalic: Platform.select({
    web: "'Cormorant Garamond', Georgia, serif",
    default: 'CormorantGaramond_400Regular_Italic',
  }),
  serifBold: Platform.select({
    web: "'Cormorant Garamond', Georgia, serif",
    default: 'CormorantGaramond_700Bold',
  }),

  // Amiri (Arabic)
  amiriRegular: Platform.select({
    web: "'Amiri', serif",
    default: 'Amiri_400Regular',
  }),
  amiriBold: Platform.select({
    web: "'Amiri', serif",
    default: 'Amiri_700Bold',
  }),
};

export const Typography: Record<string, TextStyle> = {
  // Screen title (e.g. "How many prayers do you usually offer each day?")
  headingSerif: {
    fontFamily: FontFamilies.serifSemiBold,
    fontWeight: '600',
    fontSize: 29,
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  
  // Final screen title ("Your intentions are set.")
  headingSerifLarge: {
    fontFamily: FontFamilies.serifSemiBold,
    fontWeight: '600',
    fontSize: 32,
    lineHeight: 36,
  },

  // Arabic Calligraphy in Header
  arabicHeader: {
    fontFamily: FontFamilies.amiriRegular,
    fontSize: 25,
    lineHeight: 40,
    textAlign: 'center',
  },

  // Splash Arabic Calligraphy (larger & bold)
  arabicSplash: {
    fontFamily: FontFamilies.amiriBold,
    fontSize: 30,
    lineHeight: 50,
    letterSpacing: 0.75,
    textAlign: 'center',
  },

  // Quranic translation italic
  verseTranslation: {
    fontFamily: FontFamilies.serifItalic,
    fontStyle: 'italic',
    fontWeight: '400',
    fontSize: 18,
    lineHeight: 23,
    textAlign: 'center',
  },

  // Splash Quranic translation
  verseTranslationSplash: {
    fontFamily: FontFamilies.serifItalic,
    fontStyle: 'italic',
    fontWeight: '400',
    fontSize: 16.5,
    lineHeight: 24,
    textAlign: 'center',
  },

  // Badge reference text ("Surah Ta-Ha · 20:14 · excerpt")
  verseReference: {
    fontFamily: FontFamilies.sansMedium,
    fontWeight: '500',
    fontSize: 10,
    lineHeight: 14,
  },

  // Screen subtitle ("Of the five daily prayers...")
  subheading: {
    fontFamily: FontFamilies.sansRegular,
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 21,
  },

  // Option card number ("0", "1–2", "3–4", "5")
  cardOptionNumber: {
    fontFamily: FontFamilies.serifSemiBold,
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 22,
  },

  // Option card label ("prayers", "Not yet", "Mosque")
  cardOptionLabel: {
    fontFamily: FontFamilies.sansMedium,
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 18,
  },

  // Option card label when selected
  cardOptionLabelSelected: {
    fontFamily: FontFamilies.sansSemiBold,
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 18,
  },

  // Pill CTA text ("Continue", "Begin my journey", "Save my goals")
  buttonCta: {
    fontFamily: FontFamilies.sansSemiBold,
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 24,
    letterSpacing: 0.3,
  },

  // Stepper / Input large numbers ("5", "10", "100", "8")
  numericDisplay: {
    fontFamily: FontFamilies.sansSemiBold,
    fontWeight: '600',
    fontSize: 22,
    lineHeight: 28,
  },

  // Step indicator ("1 of 6", "YOUR PRAYERS")
  stepCategory: {
    fontFamily: FontFamilies.sansSemiBold,
    fontWeight: '600',
    fontSize: 10,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  stepCount: {
    fontFamily: FontFamilies.sansRegular,
    fontWeight: '400',
    fontSize: 10,
  },

  // Footer note ("A little reflection. A gentler beginning.")
  footerNote: {
    fontFamily: FontFamilies.sansRegular,
    fontWeight: '400',
    fontSize: 10,
    lineHeight: 14,
    textAlign: 'center',
  },
};
