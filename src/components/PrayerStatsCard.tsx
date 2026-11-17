import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Check, Moon } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { FontFamilies } from '../theme/typography';

export interface PrayerStatsCardProps {
  offeredCount?: number;
  streakDays?: number;
  activeDayIndex?: number; // 0=Sun, 1=Mon, ..., 6=Sat
}

interface WeekDayItem {
  id: string;
  label: string;
  dayIndex: number;
}

const WEEK_DAYS: WeekDayItem[] = [
  { id: 'sat', label: 'Sat', dayIndex: 6 },
  { id: 'sun', label: 'Sun', dayIndex: 0 },
  { id: 'mon', label: 'Mon', dayIndex: 1 },
  { id: 'tue', label: 'Tue', dayIndex: 2 },
  { id: 'wed', label: 'Wed', dayIndex: 3 },
  { id: 'thu', label: 'Thu', dayIndex: 4 },
  { id: 'jumuah', label: "Jumu'ah", dayIndex: 5 },
];

const RING_SIZE = 34;
const STROKE_WIDTH = 2.5;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const PrayerStatsCard: React.FC<PrayerStatsCardProps> = ({
  offeredCount = 0,
  streakDays = 0,
  activeDayIndex,
}) => {
  const currentDay = activeDayIndex ?? new Date().getDay();

  return (
    <View style={styles.card} testID="prayer-stats-card">
      {/* Top Header: Crescent + Streak Count + Encouragement */}
      <View style={styles.headerRow}>
        <View style={styles.crescentWrap}>
          <Moon
            size={18}
            color={Colors.darkGold}
            strokeWidth={2.2}
            fill="rgba(212, 175, 55, 0.22)"
          />
        </View>

        <View style={styles.textColumn}>
          <Text style={styles.streakText}>{streakDays} days</Text>
          <Text style={styles.subtitleText}>
            All five on time keeps it growing.
          </Text>
        </View>
      </View>

      {/* 7-day weekly ring row */}
      <View style={styles.weekRow} testID="weekly-ring-row">
        {WEEK_DAYS.map((day) => {
          const isToday = day.dayIndex === currentDay;
          // For today, use actual offeredCount (0 to 5)
          const completedPrayers = isToday ? Math.min(5, Math.max(0, offeredCount)) : 0;
          const progress = completedPrayers / 5;
          const strokeDashoffset = CIRCUMFERENCE * (1 - progress);
          const isAllDone = completedPrayers === 5;

          return (
            <View
              key={day.id}
              style={styles.dayCol}
              testID={`day-ring-${day.id}`}
            >
              {/* Circular Progress Ring */}
              <View style={styles.ringContainer}>
                <Svg
                  width={RING_SIZE}
                  height={RING_SIZE}
                  viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
                >
                  {/* Background Track Circle */}
                  <Circle
                    cx={RING_SIZE / 2}
                    cy={RING_SIZE / 2}
                    r={RADIUS}
                    stroke={
                      isToday
                        ? 'rgba(212, 175, 55, 0.2)'
                        : 'rgba(255, 255, 255, 0.08)'
                    }
                    strokeWidth={STROKE_WIDTH}
                    fill="transparent"
                  />
                  {/* Progress Indicator Circle */}
                  {completedPrayers > 0 ? (
                    <Circle
                      cx={RING_SIZE / 2}
                      cy={RING_SIZE / 2}
                      r={RADIUS}
                      stroke={isAllDone ? Colors.darkSuccess : Colors.darkGold}
                      strokeWidth={STROKE_WIDTH}
                      fill="transparent"
                      strokeDasharray={CIRCUMFERENCE}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
                    />
                  ) : null}
                </Svg>

                {/* Inner status marker */}
                <View style={styles.ringInner}>
                  {isAllDone ? (
                    <Check
                      size={11}
                      color={Colors.darkSuccess}
                      strokeWidth={3.2}
                    />
                  ) : completedPrayers > 0 ? (
                    <View style={styles.activeDot} />
                  ) : null}
                </View>
              </View>

              {/* Day Label Pill */}
              <View
                style={[
                  styles.dayLabelWrap,
                  isToday && styles.activeDayPill,
                ]}
              >
                <Text
                  style={[
                    styles.dayLabelText,
                    isToday ? styles.activeDayText : styles.inactiveDayText,
                  ]}
                  numberOfLines={1}
                >
                  {day.label}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.darkCard,
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: Colors.darkBorder,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  crescentWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColumn: {
    flex: 1,
    gap: 2,
  },
  streakText: {
    fontFamily: FontFamilies.serifItalic,
    fontStyle: 'italic',
    fontSize: 23,
    lineHeight: 28,
    color: Colors.darkTextPrimary,
    letterSpacing: -0.2,
  },
  subtitleText: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 12,
    lineHeight: 16,
    color: Colors.darkTextSecondary,
  },
  weekRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  dayCol: {
    alignItems: 'center',
    gap: 7,
  },
  ringContainer: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringInner: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.darkGold,
  },
  dayLabelWrap: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 999,
  },
  activeDayPill: {
    backgroundColor: 'rgba(212, 175, 55, 0.16)',
    borderWidth: 1,
    borderColor: Colors.darkGold,
  },
  dayLabelText: {
    fontSize: 10.5,
    textAlign: 'center',
  },
  activeDayText: {
    fontFamily: FontFamilies.sansBold,
    color: Colors.darkGold,
  },
  inactiveDayText: {
    fontFamily: FontFamilies.sansMedium,
    color: Colors.darkTextMuted,
  },
});
