import { PRAYER_LABELS, type PrayerName } from './types';

export interface PrayerSchedule {
  name: PrayerName;
  label: string;
  arabic: string;
  time: string;
  startMinutes: number;
  endMinutes: number;
}

export type PrayerStatus = 'completed' | 'active' | 'upcoming' | 'past' | 'future';

export interface PrayerItemState {
  schedule: PrayerSchedule;
  status: PrayerStatus;
  isOffered: boolean;
  statusText: string;
  timeRemaining?: string;
}

/**
 * Standard realistic prayer schedule for the day.
 * Times are stored in local minutes from midnight.
 */
export const PRAYER_SCHEDULES: PrayerSchedule[] = [
  {
    name: 'fajr',
    label: PRAYER_LABELS.fajr,
    arabic: 'الفجر',
    time: '05:15 AM',
    startMinutes: 5 * 60 + 15, // 05:15
    endMinutes: 6 * 60 + 45,   // 06:45 (Sunrise)
  },
  {
    name: 'zuhr',
    label: PRAYER_LABELS.zuhr,
    arabic: 'الظهر',
    time: '12:45 PM',
    startMinutes: 12 * 60 + 45, // 12:45
    endMinutes: 16 * 60 + 10,  // 04:10 PM
  },
  {
    name: 'asr',
    label: PRAYER_LABELS.asr,
    arabic: 'العصر',
    time: '04:10 PM',
    startMinutes: 16 * 60 + 10, // 04:10 PM
    endMinutes: 17 * 60 + 35,  // 05:35 PM
  },
  {
    name: 'maghrib',
    label: PRAYER_LABELS.maghrib,
    arabic: 'المغرب',
    time: '05:35 PM',
    startMinutes: 17 * 60 + 35, // 05:35 PM
    endMinutes: 19 * 60 + 15,  // 07:15 PM
  },
  {
    name: 'isha',
    label: PRAYER_LABELS.isha,
    arabic: 'العشاء',
    time: '07:15 PM',
    startMinutes: 19 * 60 + 15, // 07:15 PM
    endMinutes: 23 * 60 + 59,  // 11:59 PM
  },
];

/**
 * Derives the real-time status of each prayer for today.
 */
export function getPrayerStates(
  offeredPrayers: PrayerName[],
  now: Date = new Date()
): PrayerItemState[] {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  return PRAYER_SCHEDULES.map((schedule) => {
    const isOffered = offeredPrayers.includes(schedule.name);

    if (isOffered) {
      return {
        schedule,
        status: 'completed',
        isOffered: true,
        statusText: 'Offered',
      };
    }

    // Prayer is past its window and not offered
    if (currentMinutes >= schedule.endMinutes) {
      return {
        schedule,
        status: 'past',
        isOffered: false,
        statusText: 'Time passed',
      };
    }

    // Prayer is currently active
    if (
      currentMinutes >= schedule.startMinutes &&
      currentMinutes < schedule.endMinutes
    ) {
      const remaining = schedule.endMinutes - currentMinutes;
      const hours = Math.floor(remaining / 60);
      const mins = remaining % 60;
      const remainingLabel = hours > 0 ? `${hours}h ${mins}m left` : `${mins}m left`;

      return {
        schedule,
        status: 'active',
        isOffered: false,
        statusText: 'Active now',
        timeRemaining: remainingLabel,
      };
    }

    // Prayer is upcoming: check if it's about to arrive (within 45 minutes)
    const minutesUntil = schedule.startMinutes - currentMinutes;
    if (minutesUntil > 0 && minutesUntil <= 45) {
      return {
        schedule,
        status: 'upcoming',
        isOffered: false,
        statusText: 'About to arrive',
        timeRemaining: `In ${minutesUntil}m`,
      };
    }

    // Scheduled for later
    const hoursUntil = Math.floor(minutesUntil / 60);
    const minsRemainder = minutesUntil % 60;
    const futureLabel =
      hoursUntil > 0
        ? `In ${hoursUntil}h ${minsRemainder > 0 ? `${minsRemainder}m` : ''}`
        : `In ${minutesUntil}m`;

    return {
      schedule,
      status: 'future',
      isOffered: false,
      statusText: 'Upcoming',
      timeRemaining: futureLabel,
    };
  });
}
