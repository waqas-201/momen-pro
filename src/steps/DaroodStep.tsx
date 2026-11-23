import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Heart, Check, Minus, Plus } from 'lucide-react-native';
import { FontFamilies } from '../theme/typography';
import { QuranicReflection } from '../components/QuranicReflection';
import { StageBeat } from '../flow/StageBeat';
import { useOnboarding } from '../context/OnboardingContext';

const QUICK_PILLS = ['10', '20', '50', '100', '200', '500+'];

export const DaroodStep: React.FC = () => {
  const { targetDarood, setTargetDarood, setDaroodFrequency } = useOnboarding();

  const isNotYet = targetDarood === 0;

  const handleToggleNotYet = () => {
    if (isNotYet) {
      setTargetDarood(10);
      setDaroodFrequency('10 / day');
    } else {
      setTargetDarood(0);
      setDaroodFrequency('Not yet');
    }
  };

  const handleTextChange = (text: string) => {
    const numericVal = parseInt(text.replace(/[^0-9]/g, ''), 10) || 0;
    setTargetDarood(numericVal);
    setDaroodFrequency(numericVal > 0 ? `${numericVal} / day` : 'Not yet');
  };

  const handleDecrement = () => {
    setTargetDarood((prev) => {
      const step = 10;
      const next = Math.max(0, prev - step);
      setDaroodFrequency(next > 0 ? `${next} / day` : 'Not yet');
      return next;
    });
  };

  const handleIncrement = () => {
    setTargetDarood((prev) => {
      const step = 10;
      const next = prev === 0 ? 10 : prev + step;
      setDaroodFrequency(`${next} / day`);
      return next;
    });
  };

  const handleQuickPill = (pill: string) => {
    const numericVal = parseInt(pill.replace(/[^0-9]/g, ''), 10) || 0;
    setTargetDarood(numericVal);
    setDaroodFrequency(`${numericVal} / day`);
  };

  return (
    <View style={styles.mainContent}>
      <QuranicReflection
        arabicText="إِنَّ اللَّهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ"
        reference="Surah Al-Ahzab · 33:56 · excerpt"
        translation="“Indeed, Allah confers blessing upon the Prophet, and His angels [ask Him to do so].”"
      />

      <View style={styles.questionSection}>
        <Text style={styles.title}>Set your daily Darood intention</Text>
        <Text style={styles.subtitle}>
          Choose your daily recitation target or begin fresh.
        </Text>
      </View>

      <StageBeat style={styles.entrySection}>
        <View style={styles.inputCard}>
          <TouchableOpacity
            style={styles.stepperBtn}
            onPress={handleDecrement}
            activeOpacity={0.7}
            testID="darood-minus-btn"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Minus size={13} color="#083B32" strokeWidth={2.4} />
          </TouchableOpacity>

          <View style={styles.inputCenter}>
            <TextInput
              style={styles.textInput}
              value={isNotYet ? '' : targetDarood > 0 ? String(targetDarood) : ''}
              onChangeText={handleTextChange}
              placeholder={isNotYet ? 'Not yet' : '10'}
              placeholderTextColor="#A8A29E"
              keyboardType="number-pad"
              maxLength={5}
              testID="darood-number-input"
            />
            <Text style={styles.inputSuffix}>times / day</Text>
          </View>

          <TouchableOpacity
            style={styles.stepperBtn}
            onPress={handleIncrement}
            activeOpacity={0.7}
            testID="darood-plus-btn"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Plus size={13} color="#083B32" strokeWidth={2.4} />
          </TouchableOpacity>
        </View>

        <View style={styles.quickPillsRow}>
          {QUICK_PILLS.map((pill) => {
            const pillNum = parseInt(pill.replace(/[^0-9]/g, ''), 10) || 0;
            const isSelected =
              !isNotYet &&
              (pill.endsWith('+') ? targetDarood >= pillNum : targetDarood === pillNum);

            return (
              <TouchableOpacity
                key={pill}
                style={[
                  styles.quickPill,
                  isSelected ? styles.quickPillActive : styles.quickPillInactive,
                ]}
                onPress={() => handleQuickPill(pill)}
                activeOpacity={0.7}
                hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
                testID={`darood-pill-${pillNum}`}
              >
                <Text
                  style={[
                    styles.quickPillText,
                    isSelected && styles.quickPillTextActive,
                  ]}
                >
                  {pill}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[
            styles.notYetCard,
            isNotYet ? styles.notYetCardActive : styles.notYetCardInactive,
          ]}
          onPress={handleToggleNotYet}
          activeOpacity={0.8}
          testID="darood-not-yet-btn"
        >
          <View style={styles.notYetLabelGroup}>
            <Heart
              size={15}
              color={isNotYet ? '#083B32' : '#78716C'}
              strokeWidth={2}
            />
            <Text
              style={[
                styles.notYetText,
                isNotYet && styles.notYetTextActive,
              ]}
            >
              {"Not yet — I'd like to start"}
            </Text>
          </View>

          <View
            style={[
              styles.indicatorCircle,
              isNotYet
                ? styles.indicatorCircleActive
                : styles.indicatorCircleInactive,
            ]}
          >
            {isNotYet && (
              <Check size={10} color="#FFFFFF" strokeWidth={3} />
            )}
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
  entrySection: {
    width: '100%',
    gap: 9,
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFDCD2',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  inputCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  textInput: {
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 21,
    color: '#083B32',
    padding: 0,
    textAlign: 'center',
    minWidth: 40,
  },
  inputSuffix: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 13,
    color: '#78716C',
  },
  stepperBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F4EDDF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickPillsRow: {
    flexDirection: 'row',
    gap: 6,
    width: '100%',
  },
  quickPill: {
    flex: 1,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
  quickPillInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E7E4DA',
  },
  quickPillActive: {
    backgroundColor: '#F5EFE3',
    borderColor: '#C8A86B',
  },
  quickPillText: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 11.5,
    color: '#78716C',
  },
  quickPillTextActive: {
    fontFamily: FontFamilies.sansSemiBold,
    fontWeight: '600',
    color: '#083B32',
  },
  notYetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  notYetCardInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E7E4DA',
  },
  notYetCardActive: {
    backgroundColor: '#F5EFE3',
    borderColor: '#C8A86B',
  },
  notYetLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notYetText: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 12.5,
    color: '#57534E',
  },
  notYetTextActive: {
    fontFamily: FontFamilies.sansSemiBold,
    fontWeight: '600',
    color: '#083B32',
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
