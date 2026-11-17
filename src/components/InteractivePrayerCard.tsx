import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { Check } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { FontFamilies } from '../theme/typography';
import {
  getPrayerStates,
  type PrayerItemState,
  type PrayerSchedule,
} from '../checkins/prayerTimes';
import { useOnboarding } from '../context/OnboardingContext';
import { CelestialSkyline } from './CelestialSkyline';
import { PrayerHoldModal } from './PrayerHoldModal';
import type { PrayerName } from '../checkins/types';

export interface InteractivePrayerCardProps {
  offeredPrayers: PrayerName[];
  targetPrayers?: number;
  onTogglePrayer: (prayer: PrayerName) => void;
}

const PRAYER_DISPLAY_NAMES: Record<PrayerName, string> = {
  fajr: 'Fajr',
  zuhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha',
};

function formatShortTime(time: string): string {
  return time.replace(/^0/, '').replace(/\s*(AM|PM)/i, '');
}

export const InteractivePrayerCard: React.FC<InteractivePrayerCardProps> = ({
  offeredPrayers,
  onTogglePrayer,
}) => {
  const { coordinates, fiqh } = useOnboarding();
  const [now, setNow] = useState(() => new Date());
  const [selectedPrayer, setSelectedPrayer] = useState<PrayerSchedule | null>(
    null
  );

  // Update clock every 30 seconds for real-time status transitions
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 30_000);
    return () => clearInterval(timer);
  }, []);

  const prayerStates: PrayerItemState[] = getPrayerStates(
    offeredPrayers,
    now,
    coordinates,
    fiqh
  );

  // Identify the currently active, upcoming, or fallback prayer
  const activeItem =
    prayerStates.find((p) => p.status === 'active') ??
    prayerStates.find((p) => p.status === 'upcoming') ??
    prayerStates.find((p) => p.status === 'future') ??
    prayerStates[0];

  const activePrayerName: PrayerName = activeItem ? activeItem.schedule.name : 'zuhr';
  const activeDisplayName = PRAYER_DISPLAY_NAMES[activePrayerName] ?? 'Prayer';
  const isActiveOffered = activeItem?.isOffered ?? false;

  const handleConfirmHold = (prayerName: PrayerName) => {
    if (!offeredPrayers.includes(prayerName)) {
      onTogglePrayer(prayerName);
    }
  };

  const handleMainButtonPress = () => {
    if (activeItem) {
      setSelectedPrayer(activeItem.schedule);
    }
  };

  // Connecting segments between adjacent prayer nodes: 4 segments total
  const lineSegments = [0, 1, 2, 3].map((idx) => {
    const prev = prayerStates[idx];
    const next = prayerStates[idx + 1];
    const isSolid = Boolean(prev?.isOffered && next?.isOffered);
    return { isSolid };
  });

  return (
    <View style={styles.card} testID="intention-prayer">
      {/* 1. Celestial Skyline Top Illustration */}
      <View style={styles.skylineWrap}>
        <CelestialSkyline
          activePrayer={activePrayerName}
          height={165}
          onSelectPrayer={(name) => {
            const target = prayerStates.find((p) => p.schedule.name === name);
            if (target) {
              setSelectedPrayer(target.schedule);
            }
          }}
        />
      </View>

      <View style={styles.contentWrap}>
        {/* 2. Prominent Rounded Gold Pill Button: ✓ I've prayed */}
        <TouchableOpacity
          style={[
            styles.goldPillButton,
            isActiveOffered && styles.goldPillButtonOffered,
          ]}
          onPress={handleMainButtonPress}
          activeOpacity={0.85}
          testID="ive-prayed-button"
        >
          <Check
            size={18}
            color={isActiveOffered ? Colors.darkSuccess : '#061612'}
            strokeWidth={3}
          />
          <Text
            style={[
              styles.goldPillButtonText,
              isActiveOffered && styles.goldPillButtonTextOffered,
            ]}
          >
            {isActiveOffered
              ? `${activeDisplayName} Recorded`
              : `I've prayed ${activeDisplayName}`}
          </Text>
        </TouchableOpacity>

        {/* 3. Horizontal Connected Timeline Card for 5 Prayers */}
        <View style={styles.timelineCard}>
          {/* Background Connecting Lines */}
          <View style={styles.connectingLinesContainer} pointerEvents="none">
            {lineSegments.map((segment, idx) => (
              <View key={idx} style={styles.lineContainer}>
                {segment.isSolid ? (
                  <View style={styles.lineSolid} />
                ) : (
                  <Svg height="2" width="100%">
                    <Line
                      x1="0"
                      y1="1"
                      x2="100%"
                      y2="1"
                      stroke="rgba(255, 255, 255, 0.22)"
                      strokeWidth="1.5"
                      strokeDasharray="3, 3"
                    />
                  </Svg>
                )}
              </View>
            ))}
          </View>

          {/* 5 Prayer Nodes */}
          <View style={styles.nodesRow}>
            {prayerStates.map((item) => {
              const { schedule, status, isOffered } = item;
              const isActive = status === 'active' && !isOffered;
              const isPastUnprayed = status === 'past' && !isOffered;
              const isFuture =
                (status === 'upcoming' || status === 'future') && !isOffered;
              const displayName =
                PRAYER_DISPLAY_NAMES[schedule.name] ?? schedule.label;
              const shortTime = formatShortTime(schedule.time);

              return (
                <TouchableOpacity
                  key={schedule.name}
                  style={styles.nodeColumn}
                  onPress={() => setSelectedPrayer(schedule)}
                  activeOpacity={0.75}
                  testID={`checkin-prayer-${schedule.name}`}
                >
                  {/* Node Circle */}
                  <View style={styles.nodeCircleWrapper}>
                    {isOffered ? (
                      /* Completed: Circle with checkmark ✓ */
                      <View style={styles.circleCompleted}>
                        <Check size={14} color="#FFFFFF" strokeWidth={3.4} />
                      </View>
                    ) : isActive ? (
                      /* Active: Glowing ring with center dot ⦿ */
                      <View style={styles.circleActive}>
                        <View style={styles.activeDot} />
                      </View>
                    ) : isPastUnprayed ? (
                      /* Past unprayed: Dimmed / blurred out */
                      <View style={styles.circlePast}>
                        <View style={styles.pastDot} />
                      </View>
                    ) : (
                      /* Future: Clean outlined circle ○ */
                      <View style={styles.circleFuture} />
                    )}
                  </View>

                  {/* Prayer Name */}
                  <Text
                    style={[
                      styles.prayerName,
                      isOffered && styles.prayerNameOffered,
                      isActive && styles.prayerNameActive,
                      isPastUnprayed && styles.prayerNamePast,
                      isFuture && styles.prayerNameFuture,
                    ]}
                    numberOfLines={1}
                  >
                    {displayName}
                  </Text>

                  {/* Subtext: time or "late" */}
                  <Text
                    style={[
                      styles.prayerSubtext,
                      isOffered && styles.prayerSubtextOffered,
                      isActive && styles.prayerSubtextActive,
                      isPastUnprayed && styles.prayerSubtextPast,
                      isFuture && styles.prayerSubtextFuture,
                    ]}
                    numberOfLines={1}
                  >
                    {isPastUnprayed ? 'late' : shortTime}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      {/* 4. Sacred Hold-to-Confirm Modal with Quranic Ayah */}
      <PrayerHoldModal
        visible={Boolean(selectedPrayer)}
        prayer={selectedPrayer}
        onClose={() => setSelectedPrayer(null)}
        onConfirm={handleConfirmHold}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.darkCard,
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: Colors.darkBorder,
    overflow: 'hidden',
  },
  skylineWrap: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.15)',
  },
  contentWrap: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 14,
  },
  goldPillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.darkGold,
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 22,
    shadowColor: Colors.darkGold,
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 3,
  },
  goldPillButtonOffered: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderWidth: 1,
    borderColor: Colors.darkSuccessBorder,
    shadowOpacity: 0,
    elevation: 0,
  },
  goldPillButtonText: {
    fontFamily: FontFamilies.sansBold,
    fontSize: 14.5,
    letterSpacing: 0.3,
    color: '#061612',
  },
  goldPillButtonTextOffered: {
    color: Colors.darkSuccess,
  },
  timelineCard: {
    position: 'relative',
    backgroundColor: Colors.darkSurface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.darkBorderSubtle,
    paddingVertical: 16,
    paddingHorizontal: 10,
  },
  connectingLinesContainer: {
    position: 'absolute',
    top: 31, // Vertically centered with node circles (paddingTop 16 + circleRadius 15)
    left: 36, // Center of first column
    right: 36, // Center of last column
    flexDirection: 'row',
    alignItems: 'center',
  },
  lineContainer: {
    flex: 1,
    height: 2,
    justifyContent: 'center',
  },
  lineSolid: {
    height: 2,
    backgroundColor: Colors.darkGold,
    borderRadius: 1,
  },
  nodesRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  nodeColumn: {
    width: 52,
    alignItems: 'center',
    gap: 4,
  },
  nodeCircleWrapper: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleCompleted: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.darkSuccess,
    borderWidth: 1.5,
    borderColor: Colors.darkSuccess,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleActive: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(212, 175, 55, 0.22)',
    borderWidth: 2,
    borderColor: Colors.darkGold,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.darkGold,
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 4,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.darkGold,
  },
  circlePast: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    opacity: 0.38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pastDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.darkTextMuted,
  },
  circleFuture: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.darkCard,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  prayerName: {
    fontSize: 11.5,
    textAlign: 'center',
  },
  prayerNameOffered: {
    fontFamily: FontFamilies.sansSemiBold,
    color: Colors.darkTextPrimary,
  },
  prayerNameActive: {
    fontFamily: FontFamilies.sansBold,
    color: Colors.darkGold,
  },
  prayerNamePast: {
    fontFamily: FontFamilies.sansRegular,
    color: Colors.darkTextMuted,
    opacity: 0.45,
  },
  prayerNameFuture: {
    fontFamily: FontFamilies.sansMedium,
    color: Colors.darkTextSecondary,
  },
  prayerSubtext: {
    fontSize: 10,
    textAlign: 'center',
  },
  prayerSubtextOffered: {
    fontFamily: FontFamilies.sansRegular,
    color: Colors.darkTextSecondary,
  },
  prayerSubtextActive: {
    fontFamily: FontFamilies.sansBold,
    color: Colors.darkGold,
  },
  prayerSubtextPast: {
    fontFamily: FontFamilies.sansMedium,
    color: Colors.darkTextMuted,
    opacity: 0.6,
  },
  prayerSubtextFuture: {
    fontFamily: FontFamilies.sansRegular,
    color: Colors.darkTextMuted,
  },
});
