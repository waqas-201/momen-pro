import {
  Coordinates,
  CalculationMethod,
  PrayerTimes as AdhanPrayerTimes,
  Madhab,
} from 'adhan';
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
 * Standard default fallback prayer schedule.
 */
export const PRAYER_SCHEDULES: PrayerSchedule[] = [
  {
    name: 'fajr',
    label: PRAYER_LABELS.fajr,
    arabic: 'الفجر',
    time: '05:15 AM',
    startMinutes: 5 * 60 + 15,
    endMinutes: 6 * 60 + 45,
  },
  {
    name: 'zuhr',
    label: PRAYER_LABELS.zuhr,
    arabic: 'الظهر',
    time: '12:45 PM',
    startMinutes: 12 * 60 + 45,
    endMinutes: 16 * 60 + 10,
  },
  {
    name: 'asr',
    label: PRAYER_LABELS.asr,
    arabic: 'العصر',
    time: '04:10 PM',
    startMinutes: 16 * 60 + 10,
    endMinutes: 17 * 60 + 35,
  },
  {
    name: 'maghrib',
    label: PRAYER_LABELS.maghrib,
    arabic: 'المغرب',
    time: '05:35 PM',
    startMinutes: 17 * 60 + 35,
    endMinutes: 19 * 60 + 15,
  },
  {
    name: 'isha',
    label: PRAYER_LABELS.isha,
    arabic: 'العشاء',
    time: '07:15 PM',
    startMinutes: 19 * 60 + 15,
    endMinutes: 23 * 60 + 59,
  },
];

/**
 * Computes exact offline prayer schedules using the Adhan library if coordinates are given.
 */
export function calculateSchedules(
  coordinates?: { latitude: number; longitude: number } | null,
  fiqh?: 'hanafi' | 'shafii' | 'maliki' | 'hanbali',
  date: Date = new Date()
): PrayerSchedule[] {
  if (!coordinates) {
    return PRAYER_SCHEDULES;
  }

  try {
    const coords = new Coordinates(coordinates.latitude, coordinates.longitude);
    const params = CalculationMethod.MuslimWorldLeague();
    params.madhab = fiqh === 'hanafi' ? Madhab.Hanafi : Madhab.Shafi;

    const pt = new AdhanPrayerTimes(coords, date, params);

    const formatTime = (d: Date) => {
      let hours = d.getHours();
      const minutes = d.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      return `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')} ${ampm}`;
    };

    const toMinutes = (d: Date) => d.getHours() * 60 + d.getMinutes();

    return [
      {
        name: 'fajr',
        label: PRAYER_LABELS.fajr,
        arabic: 'الفجر',
        time: formatTime(pt.fajr),
        startMinutes: toMinutes(pt.fajr),
        endMinutes: toMinutes(pt.sunrise),
      },
      {
        name: 'zuhr',
        label: PRAYER_LABELS.zuhr,
        arabic: 'الظهر',
        time: formatTime(pt.dhuhr),
        startMinutes: toMinutes(pt.dhuhr),
        endMinutes: toMinutes(pt.asr),
      },
      {
        name: 'asr',
        label: PRAYER_LABELS.asr,
        arabic: 'العصر',
        time: formatTime(pt.asr),
        startMinutes: toMinutes(pt.asr),
        endMinutes: toMinutes(pt.maghrib),
      },
      {
        name: 'maghrib',
        label: PRAYER_LABELS.maghrib,
        arabic: 'المغرب',
        time: formatTime(pt.maghrib),
        startMinutes: toMinutes(pt.maghrib),
        endMinutes: toMinutes(pt.isha),
      },
      {
        name: 'isha',
        label: PRAYER_LABELS.isha,
        arabic: 'العشاء',
        time: formatTime(pt.isha),
        startMinutes: toMinutes(pt.isha),
        endMinutes: 23 * 60 + 59,
      },
    ];
  } catch {
    return PRAYER_SCHEDULES;
  }
}

/**
 * Derives the real-time status of each prayer for today.
 */
export function getPrayerStates(
  offeredPrayers: PrayerName[],
  now: Date = new Date(),
  coordinates?: { latitude: number; longitude: number } | null,
  fiqh?: 'hanafi' | 'shafii' | 'maliki' | 'hanbali'
): PrayerItemState[] {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const schedules = calculateSchedules(coordinates, fiqh, now);

  return schedules.map((schedule) => {
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
