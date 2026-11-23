import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import {
  Check,
  Sunrise,
  Sunset,
  Sparkles,
  Heart,
  Minus,
  Plus,
} from 'lucide-react-native';
import { FontFamilies } from '../theme/typography';
import { QuranicReflection } from '../components/QuranicReflection';
import { StageBeat } from '../flow/StageBeat';
import { useOnboarding } from '../context/OnboardingContext';

interface RoutineStation {
  id: string;
  title: string;
  subtitle: string;
  icon: (color: string) => React.ReactNode;
}

const ROUTINE_STATIONS: RoutineStation[] = [
  {
    id: 'Morning azkar',
    title: 'Morning Adhkar',
    subtitle: 'From Fajr until sunrise',
    icon: (c) => <Sunrise size={17} color={c} strokeWidth={2.2} />,
  },
  {
    id: 'Evening azkar',
    title: 'Evening Adhkar',
    subtitle: 'From Asr until Maghrib',
    icon: (c) => <Sunset size={17} color={c} strokeWidth={2.2} />,
  },
  {
    id: 'After prayer',
    title: 'After Salah',
    subtitle: 'SubhanAllah, Alhamdulillah, Allahu Akbar',
    icon: (c) => <Sparkles size={17} color={c} strokeWidth={2.2} />,
  },
  {
    id: 'Daily Istighfar',
    title: 'Daily Istighfar',
    subtitle: 'Astaghfirullah for heart and soul',
    icon: (c) => <Heart size={17} color={c} strokeWidth={2.2} />,
  },
];

const QUICK_DHIKR_PILLS = [33, 100, 300, 500];

export const RemembranceStep: React.FC = () => {
  const {
    adhkarRoutines,
    setAdhkarRoutines,
    targetDhikr,
    setTargetDhikr,
  } = useOnboarding();

  const isNoneSelected =
    adhkarRoutines.length === 1 && adhkarRoutines[0] === 'No current routine';

  const toggleStation = (stationId: string) => {
    setAdhkarRoutines((prev) => {
      const filtered = prev.filter((id) => id !== 'No current routine');
      if (filtered.includes(stationId)) {
        const next = filtered.filter((id) => id !== stationId);
        return next.length > 0 ? next : ['No current routine'];
      } else {
        return [...filtered, stationId];
      }
    });
    if (targetDhikr === 0) {
      setTargetDhikr(100);
    }
  };

  const handleSelectNone = () => {
    if (isNoneSelected) {
      setAdhkarRoutines(['Morning azkar', 'Evening azkar']);
      setTargetDhikr(100);
    } else {
      setAdhkarRoutines(['No current routine']);
      setTargetDhikr(0);
    }
  };

  const handleDecrement = () => {
    setTargetDhikr((prev) => Math.max(0, prev - 25));
  };

  const handleIncrement = () => {
    setTargetDhikr((prev) => (prev === 0 ? 33 : prev + 25));
  };

  const handleTextChange = (text: string) => {
    const val = parseInt(text.replace(/[^0-9]/g, ''), 10) || 0;
    setTargetDhikr(val);
  };

  return (
    <View style={styles.mainContent}>
      <QuranicReflection
        arabicText="فَاذْكُرُونِي أَذْكُرْكُمْ"
        reference="Surah Al-Baqarah · 2:152 · excerpt"
        translation="“So remember Me; I will remember you.”"
      />

      <View style={styles.questionSection}>
        <Text style={styles.title}>Set your daily Dhikr intention</Text>
        <Text style={styles.subtitle}>
          Select core routine stations and choose your daily count target.
        </Text>
      </View>

      <StageBeat style={styles.stationsList}>
        <View style={styles.grid}>
          {ROUTINE_STATIONS.map((station) => {
            const isSelected = adhkarRoutines.includes(station.id);
            const slug = station.id.toLowerCase().replace(/\s+/g, '-');

            return (
              <TouchableOpacity
                key={station.id}
                style={[
                  styles.stationCard,
                  isSelected ? styles.stationCardActive : styles.stationCardInactive,
                ]}
                onPress={() => toggleStation(station.id)}
                activeOpacity={0.8}
                testID={`dhikr-station-${slug}`}
              >
                <View style={styles.stationTopRow}>
                  <View style={styles.iconBox}>
                    {station.icon(isSelected ? '#083B32' : '#78716C')}
                  </View>
                  <View
                    style={[
                      styles.indicatorCircle,
                      isSelected
                        ? styles.indicatorCircleActive
                        : styles.indicatorCircleInactive,
                    ]}
                  >
                    {isSelected && <Check size={10} color="#FFFFFF" strokeWidth={3} />}
                  </View>
                </View>
                <Text
                  style={[
                    styles.stationTitle,
                    isSelected && styles.stationTitleActive,
                  ]}
                  numberOfLines={1}
                >
                  {station.title}
                </Text>
                <Text style={styles.stationSubtitle} numberOfLines={1}>
                  {station.subtitle}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Daily Dhikr count stepper & quick pills */}
        {!isNoneSelected && (
          <View style={styles.counterSection}>
            <View style={styles.counterRow}>
              <Text style={styles.counterLabel}>Daily Count Target</Text>
              <View style={styles.stepperBox}>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={handleDecrement}
                  activeOpacity={0.7}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  testID="dhikr-minus-btn"
                >
                  <Minus size={12} color="#083B32" strokeWidth={2.4} />
                </TouchableOpacity>

                <View style={styles.inputCenter}>
                  <TextInput
                    style={styles.textInput}
                    value={targetDhikr > 0 ? String(targetDhikr) : ''}
                    onChangeText={handleTextChange}
                    placeholder="100"
                    placeholderTextColor="#A8A29E"
                    keyboardType="number-pad"
                    maxLength={5}
                    testID="dhikr-count-input"
                  />
                  <Text style={styles.inputSuffix}>/ day</Text>
                </View>

                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={handleIncrement}
                  activeOpacity={0.7}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  testID="dhikr-plus-btn"
                >
                  <Plus size={12} color="#083B32" strokeWidth={2.4} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.quickPillsRow}>
              {QUICK_DHIKR_PILLS.map((pill) => {
                const isPillActive = targetDhikr === pill;
                return (
                  <TouchableOpacity
                    key={pill}
                    style={[
                      styles.quickPill,
                      isPillActive ? styles.quickPillActive : styles.quickPillInactive,
                    ]}
                    onPress={() => setTargetDhikr(pill)}
                    activeOpacity={0.7}
                    testID={`dhikr-pill-${pill}`}
                  >
                    <Text
                      style={[
                        styles.quickPillText,
                        isPillActive && styles.quickPillTextActive,
                      ]}
                    >
                      {pill}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.noneOptionCard,
            isNoneSelected ? styles.noneOptionActive : styles.noneOptionInactive,
          ]}
          onPress={handleSelectNone}
          activeOpacity={0.8}
          testID="remembrance-option-none"
        >
          <Text
            style={[
              styles.noneOptionLabel,
              isNoneSelected && styles.noneOptionLabelActive,
            ]}
          >
            I am starting fresh with Dhikr
          </Text>
          <View
            style={[
              styles.indicatorCircle,
              isNoneSelected
                ? styles.indicatorCircleActive
                : styles.indicatorCircleInactive,
            ]}
          >
            {isNoneSelected && <Check size={10} color="#FFFFFF" strokeWidth={3} />}
          </View>
        </TouchableOpacity>
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
  stationsList: {
    width: '100%',
    gap: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  stationCard: {
    width: '48.5%',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'space-between',
    minHeight: 74,
  },
  stationCardInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E7E4DA',
  },
  stationCardActive: {
    backgroundColor: '#F5EFE3',
    borderColor: '#C8A86B',
  },
  stationTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  iconBox: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stationTitle: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 12.5,
    color: '#083B32',
  },
  stationTitleActive: {
    fontFamily: FontFamilies.sansSemiBold,
    fontWeight: '600',
  },
  stationSubtitle: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 10,
    color: '#78716C',
    marginTop: 1,
  },
  counterSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E7E4DA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  counterLabel: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 12.5,
    color: '#083B32',
  },
  stepperBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepperBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F4EDDF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputCenter: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  textInput: {
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 15,
    color: '#083B32',
    minWidth: 34,
    textAlign: 'center',
    paddingVertical: 0,
  },
  inputSuffix: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 11,
    color: '#78716C',
  },
  quickPillsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  quickPill: {
    flex: 1,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  quickPillInactive: {
    backgroundColor: '#FDFCF9',
    borderColor: '#E7E4DA',
  },
  quickPillActive: {
    backgroundColor: '#083B32',
    borderColor: '#083B32',
  },
  quickPillText: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 11,
    color: '#57534E',
  },
  quickPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  noneOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
  },
  noneOptionInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E7E4DA',
  },
  noneOptionActive: {
    backgroundColor: '#F5EFE3',
    borderColor: '#C8A86B',
  },
  noneOptionLabel: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 12,
    color: '#57534E',
  },
  noneOptionLabelActive: {
    fontFamily: FontFamilies.sansSemiBold,
    color: '#083B32',
    fontWeight: '600',
  },
  indicatorCircle: {
    width: 16,
    height: 16,
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
    borderColor: '#083B32',
    backgroundColor: '#083B32',
  },
});
