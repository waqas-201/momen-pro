import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AppState } from 'react-native';
import { dayKey } from './day';
import { emptyCheckin, type Checkin, type PrayerName } from './types';

const STORAGE_KEY = 'momen-pro:checkins:v1';

interface CheckinsApi {
  checkin: Checkin;
  togglePrayer: (prayer: PrayerName) => void;
  toggleRoutine: (routine: string) => void;
  addDarood: (delta: number) => void;
  addQuran: (delta: number) => void;
  addQadha: (delta: number) => void;
}

const CheckinsContext = createContext<CheckinsApi | null>(null);

/**
 * Today's Check-ins. They live on the device: there is no account yet, so a
 * Check-in is only ever read back by the phone that wrote it.
 */
export const CheckinsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [checkin, setCheckin] = useState<Checkin>(() =>
    emptyCheckin(dayKey())
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const stored = raw ? (JSON.parse(raw) as Partial<Checkin>) : null;
        // A stored Day that is not today is yesterday, and yesterday is gone.
        if (alive && stored?.day === dayKey()) {
          setCheckin({ ...emptyCheckin(stored.day), ...stored });
        }
      } catch {
        // An unreadable store is not worth blocking Home over: the Day starts
        // empty instead of showing an error the person cannot act on.
      }
      if (alive) setHydrated(true);
    })();

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(checkin)).catch(() => {
      // Losing a write only costs today's ticks; nothing else depends on it.
    });
  }, [checkin, hydrated]);

  const rollToToday = useCallback(() => {
    const today = dayKey();
    setCheckin((prev) => (prev.day === today ? prev : emptyCheckin(today)));
  }, []);

  // A Day changes at local midnight. Waking the app covers one that slept
  // through it, and the minute tick covers one left open overnight. Rolling is
  // a no-op until the date actually changes, so ticking costs nothing.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') rollToToday();
    });
    const tick = setInterval(rollToToday, 60_000);
    return () => {
      subscription.remove();
      clearInterval(tick);
    };
  }, [rollToToday]);

  const api = useMemo<CheckinsApi>(
    () => ({
      checkin,
      togglePrayer(prayer) {
        setCheckin((prev) => ({
          ...prev,
          prayers: prev.prayers.includes(prayer)
            ? prev.prayers.filter((name) => name !== prayer)
            : [...prev.prayers, prayer],
        }));
      },
      toggleRoutine(routine) {
        setCheckin((prev) => ({
          ...prev,
          routines: prev.routines.includes(routine)
            ? prev.routines.filter((name) => name !== routine)
            : [...prev.routines, routine],
        }));
      },
      addDarood(delta) {
        setCheckin((prev) => ({
          ...prev,
          darood: Math.max(0, prev.darood + delta),
        }));
      },
      addQuran(delta) {
        setCheckin((prev) => ({
          ...prev,
          quran: Math.max(0, prev.quran + delta),
        }));
      },
      addQadha(delta) {
        setCheckin((prev) => ({
          ...prev,
          qadha: Math.max(0, prev.qadha + delta),
        }));
      },
    }),
    [checkin]
  );

  return (
    <CheckinsContext.Provider value={api}>{children}</CheckinsContext.Provider>
  );
};

export function useCheckins(): CheckinsApi {
  const api = useContext(CheckinsContext);
  if (!api) {
    throw new Error('useCheckins must be used within CheckinsProvider');
  }
  return api;
}
