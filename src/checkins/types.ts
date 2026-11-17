export const PRAYER_NAMES = [
  'fajr',
  'zuhr',
  'asr',
  'maghrib',
  'isha',
] as const;

export type PrayerName = (typeof PRAYER_NAMES)[number];

export const PRAYER_LABELS: Record<PrayerName, string> = {
  fajr: 'Fajr',
  zuhr: 'Zuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha',
};

/**
 * Everything checked in during one Day. There is no history: yesterday's
 * Check-ins are dropped at local midnight, because Home only speaks for today.
 */
export interface Checkin {
  day: string;
  prayers: PrayerName[];
  darood: number;
  quran: number;
  qadha: number;
  routines: string[];
}

export function emptyCheckin(day: string): Checkin {
  return { day, prayers: [], darood: 0, quran: 0, qadha: 0, routines: [] };
}
