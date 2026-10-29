import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Check, Landmark, Home, Building2, MapPin } from 'lucide-react-native';
import { FontFamilies } from '../theme/typography';
import { QuranicReflection } from '../components/QuranicReflection';
import { StageBeat } from '../flow/StageBeat';
import { useOnboarding } from '../context/OnboardingContext';

const SPACES = [
  { value: 'Mosque', label: 'Mosque', icon: Landmark },
  { value: 'Home', label: 'Home', icon: Home },
  { value: 'Work / school', label: 'Work / school', icon: Building2 },
  { value: 'It varies', label: 'It varies', icon: MapPin },
];

export const PrayerSpaceStep: React.FC = () => {
  const { prayerSpace, setPrayerSpace } = useOnboarding();
  const selectedSpace = prayerSpace || 'Mosque';

  return (
    <View style={styles.mainContent}>
      <QuranicReflection
        arabicText="فِي بُيُوتٍ أَذِنَ اللَّهُ أَن تُرْفَعَ"
        reference="Surah An-Nur · 24:36 · excerpt"
        translation="“[Lit is such a light] in houses which Allah has permitted to be raised.”"
      />

      <View style={styles.questionSection}>
        <Text style={styles.title}>Where do you usually pray?</Text>
        <Text style={styles.subtitle}>
          Every clean place is made a sanctuary.
        </Text>
      </View>

      <StageBeat style={styles.optionsList}>
        {SPACES.map((space) => {
          const isSelected = selectedSpace === space.value;
          const IconComponent = space.icon;

          return (
            <TouchableOpacity
              key={space.value}
              style={[
                styles.optionCard,
                isSelected ? styles.optionCardActive : styles.optionCardInactive,
              ]}
              onPress={() => setPrayerSpace(space.value)}
              activeOpacity={0.8}
              testID={`prayer-space-option-${space.value.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
            >
              <View style={styles.iconContainer}>
                <IconComponent
                  size={16}
                  color={isSelected ? '#083B32' : '#78716C'}
                  strokeWidth={2}
                />
              </View>

              <Text
                style={[
                  styles.optionLabel,
                  isSelected && styles.optionLabelActive,
                ]}
                numberOfLines={1}
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
                {isSelected && <Check size={11} color="#FFFFFF" strokeWidth={3} />}
              </View>
            </TouchableOpacity>
          );
        })}
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
  optionsList: {
    width: '100%',
    gap: 7,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  optionCardInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E7E4DA',
  },
  optionCardActive: {
    backgroundColor: '#F5EFE3',
    borderColor: '#C8A86B',
  },
  iconContainer: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  optionLabel: {
    flex: 1,
    fontFamily: FontFamilies.sansMedium,
    fontSize: 13,
    color: '#083B32',
  },
  optionLabelActive: {
    fontFamily: FontFamilies.sansSemiBold,
    fontWeight: '600',
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
});
