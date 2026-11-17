import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Platform,
} from 'react-native';
import { Check, ShieldCheck, X } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { FontFamilies } from '../theme/typography';
import type { PrayerSchedule } from '../checkins/prayerTimes';

interface PrayerHoldModalProps {
  visible: boolean;
  prayer: PrayerSchedule | null;
  onClose: () => void;
  onConfirm: (prayerName: PrayerSchedule['name']) => void;
}

const HOLD_DURATION_MS = 1400;

interface PrayerHoldSheetProps {
  prayer: PrayerSchedule;
  onClose: () => void;
  onConfirm: (prayerName: PrayerSchedule['name']) => void;
}

const PrayerHoldSheet: React.FC<PrayerHoldSheetProps> = ({
  prayer,
  onClose,
  onConfirm,
}) => {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  const animRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
      }
    };
  }, []);

  const handlePressIn = () => {
    if (isComplete) return;
    setIsHolding(true);
    setHint(null);
    startRef.current = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      const currentProgress = Math.min(1, elapsed / HOLD_DURATION_MS);
      setProgress(currentProgress);

      if (currentProgress >= 1) {
        setIsComplete(true);
        setIsHolding(false);
        onConfirm(prayer.name);
        setTimeout(() => {
          onClose();
        }, 700);
      } else {
        animRef.current = requestAnimationFrame(tick);
      }
    };

    animRef.current = requestAnimationFrame(tick);
  };

  const handlePressOut = () => {
    if (isComplete) return;
    if (animRef.current) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
    }
    setIsHolding(false);

    if (progress < 1) {
      setProgress(0);
      setHint('Hold until full to confirm');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
          <View style={styles.sheet} testID="prayer-hold-modal">
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onClose}
              activeOpacity={0.7}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              testID="prayer-modal-close"
            >
              <X size={18} color={Colors.darkTextSecondary} />
            </TouchableOpacity>

            {/* Header */}
            <View style={styles.sheetHeader}>
              <Text style={styles.kicker}>SACRED WITNESS</Text>
              <Text style={styles.sheetTitle}>Confirming {prayer.label}</Text>
              <Text style={styles.prayerTimeBadge}>
                {prayer.arabic} · {prayer.time}
              </Text>
            </View>

            {/* Quranic Ayah Box */}
            <View style={styles.ayahBox}>
              <View style={styles.ayahArchOrnament} />
              <Text style={styles.arabicVerse}>
                أَلَمْ يَعْلَم بِأَنَّ اللَّهَ يَرَىٰ
              </Text>
              <Text style={styles.versePhonetic}>
                {'\u201C'}Alam ya‘lam bi-anna Allāha yarā{'\u201D'}
              </Text>
              <Text style={styles.verseTranslation}>
                {'\u201C'}Does he not know that Allah sees?{'\u201D'}
              </Text>
              <View style={styles.referenceBadge}>
                <Text style={styles.referenceText}>
                  Surah Al-‘Alaq · 96:14
                </Text>
              </View>
              <Text style={styles.moralReminder}>
                Prayer is a sacred covenant with your Creator. Bear honest witness before Him.
              </Text>
            </View>

            {/* Interactive Hold-to-Confirm Button */}
            <View style={styles.actionContainer}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={[
                  styles.holdButton,
                  isComplete && styles.holdButtonComplete,
                ]}
                testID="hold-i-have-prayed-button"
              >
                {/* Progress Fill Bar */}
                <View
                  style={[
                    styles.fillBar,
                    { width: `${Math.round(progress * 100)}%` },
                    isComplete && styles.fillBarComplete,
                  ]}
                />

                {/* Button Content */}
                <View style={styles.buttonInner}>
                  {isComplete ? (
                    <>
                      <View style={styles.iconCircleSuccess}>
                        <Check size={18} color="#FFFFFF" strokeWidth={3} />
                      </View>
                      <Text style={styles.buttonTextComplete}>
                        Alhamdulillah · Prayer Recorded
                      </Text>
                    </>
                  ) : (
                    <>
                      <View style={styles.iconCircle}>
                        <ShieldCheck
                          size={16}
                          color={isHolding ? Colors.darkGold : Colors.darkTextPrimary}
                          strokeWidth={2.4}
                        />
                      </View>
                      <View style={styles.buttonTextCol}>
                        <Text style={styles.buttonTitle}>
                          {isHolding
                            ? `Holding... ${Math.round(progress * 100)}%`
                            : `Hold: I have prayed ${prayer.label}`}
                        </Text>
                        <Text style={styles.buttonSubtitle}>
                          Press & hold to record honestly
                        </Text>
                      </View>
                    </>
                  )}
                </View>
              </TouchableOpacity>

              {hint ? <Text style={styles.hintText}>{hint}</Text> : null}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

export const PrayerHoldModal: React.FC<PrayerHoldModalProps> = ({
  visible,
  prayer,
  onClose,
  onConfirm,
}) => {
  if (!visible || !prayer) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <PrayerHoldSheet
        key={prayer.name}
        prayer={prayer}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 10, 8, 0.78)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  sheet: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: Colors.darkSurface,
    borderRadius: 24,
    borderWidth: 1.2,
    borderColor: Colors.darkBorderGold,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 22,
    gap: 16,
    ...Platform.select({
      web: {
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.65)',
      },
      default: {
        elevation: 12,
      },
    }),
  },
  closeBtn: {
    position: 'absolute',
    top: 18,
    right: 18,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  sheetHeader: {
    alignItems: 'center',
    gap: 4,
    paddingTop: 4,
  },
  kicker: {
    fontFamily: FontFamilies.sansBold,
    fontSize: 10,
    letterSpacing: 1.4,
    color: Colors.darkGold,
    textTransform: 'uppercase',
  },
  sheetTitle: {
    fontFamily: FontFamilies.serifSemiBold,
    fontSize: 24,
    lineHeight: 28,
    color: Colors.darkTextPrimary,
    letterSpacing: -0.3,
  },
  prayerTimeBadge: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 12,
    color: Colors.darkTextSecondary,
  },
  ayahBox: {
    backgroundColor: 'rgba(5, 20, 16, 0.85)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.25)',
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 7,
  },
  ayahArchOrnament: {
    width: 36,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.darkGold,
    opacity: 0.6,
    marginBottom: 4,
  },
  arabicVerse: {
    fontFamily: FontFamilies.amiriBold,
    fontSize: 28,
    lineHeight: 46,
    color: '#FFF4DE',
    textAlign: 'center',
  },
  versePhonetic: {
    fontFamily: FontFamilies.serifItalic,
    fontSize: 13,
    color: Colors.darkGold,
    textAlign: 'center',
    opacity: 0.9,
  },
  verseTranslation: {
    fontFamily: FontFamilies.serifItalic,
    fontSize: 15.5,
    lineHeight: 21,
    color: Colors.darkTextPrimary,
    textAlign: 'center',
  },
  referenceBadge: {
    marginTop: 2,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
    borderWidth: 0.8,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  referenceText: {
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 10,
    color: Colors.darkGold,
    letterSpacing: 0.4,
  },
  moralReminder: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 11,
    lineHeight: 15,
    color: Colors.darkTextSecondary,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 6,
  },
  actionContainer: {
    gap: 8,
    alignItems: 'center',
    marginTop: 2,
  },
  holdButton: {
    width: '100%',
    height: 60,
    borderRadius: 16,
    backgroundColor: Colors.darkCardElevated,
    borderWidth: 1.2,
    borderColor: Colors.darkBorderGold,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  holdButtonComplete: {
    borderColor: Colors.darkSuccess,
    backgroundColor: '#0F382B',
  },
  fillBar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(212, 175, 55, 0.45)',
  },
  fillBarComplete: {
    backgroundColor: Colors.darkSuccess,
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 16,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleSuccess: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.darkSuccess,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTextCol: {
    alignItems: 'flex-start',
  },
  buttonTitle: {
    fontFamily: FontFamilies.sansBold,
    fontSize: 14.5,
    color: Colors.darkTextPrimary,
    letterSpacing: 0.2,
  },
  buttonSubtitle: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 10.5,
    color: Colors.darkTextSecondary,
  },
  buttonTextComplete: {
    fontFamily: FontFamilies.sansBold,
    fontSize: 14.5,
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  hintText: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 11,
    color: Colors.darkGold,
    textAlign: 'center',
  },
});
