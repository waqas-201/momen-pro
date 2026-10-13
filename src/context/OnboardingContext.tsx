import React, { createContext, useContext, useState } from 'react';

export interface OnboardingState {
  dailyPrayersCount: string;
  prayerSpace: string;
  adhkarRoutines: string[];
  recitesEveryDay: string;
  recitationAmount: number;
  recitationUnit: string;
  missedPrayers: number;
  missedNotSure: boolean;
  targetPrayers: number;
  targetDhikr: number;
  targetRecitation: number;
  
  setDailyPrayersCount: (val: string) => void;
  setPrayerSpace: (val: string) => void;
  toggleAdhkarRoutine: (val: string) => void;
  setRecitesEveryDay: (val: string) => void;
  setRecitationAmount: (val: number | ((prev: number) => number)) => void;
  setRecitationUnit: (val: string) => void;
  setMissedPrayers: (val: number | ((prev: number) => number)) => void;
  setMissedNotSure: (val: boolean) => void;
  setTargetPrayers: (val: number | ((prev: number) => number)) => void;
  setTargetDhikr: (val: number | ((prev: number) => number)) => void;
  setTargetRecitation: (val: number | ((prev: number) => number)) => void;
}

const OnboardingContext = createContext<OnboardingState | null>(null);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dailyPrayersCount, setDailyPrayersCount] = useState<string>('5');
  const [prayerSpace, setPrayerSpace] = useState<string>('Home');
  const [adhkarRoutines, setAdhkarRoutines] = useState<string[]>(['Morning azkar', 'Evening azkar']);
  const [recitesEveryDay, setRecitesEveryDay] = useState<string>('Yes');
  const [recitationAmount, setRecitationAmount] = useState<number>(10);
  const [recitationUnit, setRecitationUnit] = useState<string>('Ayahs');
  const [missedPrayers, setMissedPrayers] = useState<number>(8);
  const [missedNotSure, setMissedNotSure] = useState<boolean>(false);
  const [targetPrayers, setTargetPrayers] = useState<number>(5);
  const [targetDhikr, setTargetDhikr] = useState<number>(100);
  const [targetRecitation, setTargetRecitation] = useState<number>(10);

  const toggleAdhkarRoutine = (routine: string) => {
    if (routine === 'No current routine') {
      setAdhkarRoutines(['No current routine']);
      return;
    }
    setAdhkarRoutines(prev => {
      const filtered = prev.filter(r => r !== 'No current routine');
      if (filtered.includes(routine)) {
        const next = filtered.filter(r => r !== routine);
        return next.length > 0 ? next : ['No current routine'];
      } else {
        return [...filtered, routine];
      }
    });
  };

  return (
    <OnboardingContext.Provider
      value={{
        dailyPrayersCount,
        setDailyPrayersCount,
        prayerSpace,
        setPrayerSpace,
        adhkarRoutines,
        toggleAdhkarRoutine,
        recitesEveryDay,
        setRecitesEveryDay,
        recitationAmount,
        setRecitationAmount,
        recitationUnit,
        setRecitationUnit,
        missedPrayers,
        setMissedPrayers,
        missedNotSure,
        setMissedNotSure,
        targetPrayers,
        setTargetPrayers,
        targetDhikr,
        setTargetDhikr,
        targetRecitation,
        setTargetRecitation,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};
