export interface DhikrSubItem {
  id: string;
  name: string;
  arabicSnippet: string;
  hadithNote: string;
}

export interface DhikrCategory {
  id: string;
  title: string;
  arabicTitle: string;
  timeLabel: string;
  description: string;
  items: DhikrSubItem[];
}

export const DHIKR_CATEGORIES: DhikrCategory[] = [
  {
    id: 'waking_up',
    title: 'Waking Up',
    arabicTitle: 'أذكار الاستيقاظ',
    timeLabel: 'Dawn / Awakening',
    description: 'Gratitude for life restored upon opening the eyes.',
    items: [
      {
        id: 'waking_praise',
        name: 'Waking praise (Life after death)',
        arabicSnippet: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا',
        hadithNote: 'Sunnah upon opening the eyes (Sahih al-Bukhari)',
      },
      {
        id: 'waking_night',
        name: 'Night awakening & Tawhid',
        arabicSnippet: 'لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
        hadithNote: 'Whoever wakes at night and recites this, prayers are answered (Bukhari)',
      },
    ],
  },
  {
    id: 'morning',
    title: 'Morning Remembrance',
    arabicTitle: 'أذكار الصباح',
    timeLabel: 'Fajr to Sunrise',
    description: 'Complete spiritual shield, forgiveness, and barakah for the day ahead.',
    items: [
      {
        id: 'morning_ayat_quls',
        name: 'Ayat al-Kursi & 3 Quls (3x)',
        arabicSnippet: 'آيَةُ الْكُرْسِيِّ وَالْمُعَوِّذَاتُ (ثَلَاثًا)',
        hadithNote: 'Protects from all evil until evening (Sunan Abu Dawud & Tirmidhi)',
      },
      {
        id: 'morning_sayyid_istighfar',
        name: 'Sayyid al-Istighfar (Master of Forgiveness)',
        arabicSnippet: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي',
        hadithNote: 'Whoever recites with conviction and dies that day enters Paradise (Bukhari)',
      },
      {
        id: 'morning_asbahna',
        name: 'Asbahna wa Asbahal-Mulk',
        arabicSnippet: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        hadithNote: 'Affirming sovereignty, guidance, and refuge at dawn (Sahih Muslim)',
      },
      {
        id: 'morning_subhanallah_100',
        name: 'SubhanAllahi wa bihamdihi (100x)',
        arabicSnippet: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ (مِائَةَ مَرَّةٍ)',
        hadithNote: 'Sins forgiven even if like the foam of the sea (Sahih al-Bukhari)',
      },
    ],
  },
  {
    id: 'after_prayer',
    title: 'After Obligatory Prayer',
    arabicTitle: 'أذكار بعد الصلاة',
    timeLabel: 'After each of the 5 Prayers',
    description: 'The authentic Prophetic remembrances directly following fard prayer.',
    items: [
      {
        id: 'prayer_istighfar_salam',
        name: 'Istighfar (3x) & Salam',
        arabicSnippet: 'أَسْتَغْفِرُ اللَّهَ (٣) · اللَّهُمَّ أَنْتَ السَّلَامُ',
        hadithNote: 'Astaghfirullah (3x) and “Allahumma Antas-Salam...” (Sahih Muslim)',
      },
      {
        id: 'prayer_ayat_kursi',
        name: 'Ayat al-Kursi after Fard',
        arabicSnippet: 'آيَةُ الْكُرْسِيِّ دُبُرَ كُلِّ صَلَاةٍ مَكْتُوبَةٍ',
        hadithNote: 'Nothing prevents entry into Paradise upon death (Sunan an-Nasa’i)',
      },
      {
        id: 'prayer_tasbih_fatimah',
        name: 'Tasbih of Fatimah (33x, 33x, 33x)',
        arabicSnippet: '٣٣ سُبْحَانَ اللَّهِ · ٣٣ الْحَمْدُ لِلَّهِ · ٣٣ اللَّهُ أَكْبَرُ',
        hadithNote: '33x SubhanAllah, 33x Alhamdulillah, 33x Allahu Akbar (Sahih Muslim)',
      },
      {
        id: 'prayer_tawhid_seal',
        name: 'Tawhid Seal of the 100th',
        arabicSnippet: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
        hadithNote: 'Completes the 100 remembrances; forgives all transgressions (Muslim)',
      },
    ],
  },
  {
    id: 'evening',
    title: 'Evening Remembrance',
    arabicTitle: 'أذكار المساء',
    timeLabel: '‘Asr to Sunset',
    description: 'A fortress of protection as night begins to descend upon the earth.',
    items: [
      {
        id: 'evening_ayat_quls',
        name: 'Ayat al-Kursi & 3 Quls (3x)',
        arabicSnippet: 'آيَةُ الْكُرْسِيِّ وَالْمُعَوِّذَاتُ (ثَلَاثًا)',
        hadithNote: 'Shields from nightfall until morning (Tirmidhi & Abu Dawud)',
      },
      {
        id: 'evening_sayyid_istighfar',
        name: 'Sayyid al-Istighfar at Dusk',
        arabicSnippet: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي',
        hadithNote: 'The master supplication for forgiveness entering the night (Bukhari)',
      },
      {
        id: 'evening_amsayna',
        name: 'Amsayna wa Amsal-Mulk',
        arabicSnippet: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        hadithNote: 'Surrendering into the night under Allah’s kingdom (Sahih Muslim)',
      },
      {
        id: 'evening_refuge',
        name: 'Protection Du’as (3x)',
        arabicSnippet: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ',
        hadithNote: 'Bismillahilladhi la yadurru... & A‘udhu bi kalimatillah (Tirmidhi)',
      },
    ],
  },
  {
    id: 'before_sleep',
    title: 'Before Sleep',
    arabicTitle: 'أذكار النوم',
    timeLabel: 'Night / Bedtime',
    description: 'Entrusting the soul into Allah’s care before the minor death of sleep.',
    items: [
      {
        id: 'sleep_3quls_wipe',
        name: '3 Quls cupped & wiped (3x)',
        arabicSnippet: 'النَّفْثُ فِي الْكَفَّيْنِ بِالْمُعَوِّذَاتِ وَمَسْحُ الْجَسَدِ',
        hadithNote: 'Blow into cupped hands, recite 3 Quls, and wipe body 3x (Bukhari)',
      },
      {
        id: 'sleep_ayat_baqarah',
        name: 'Ayat al-Kursi & Baqarah end',
        arabicSnippet: 'آيَةُ الْكُرْسِيِّ وَخَوَاتِيمُ سُورَةِ الْبَقَرَةِ',
        hadithNote: 'Angel guardian stays over you; sufficient against all harm (Bukhari)',
      },
      {
        id: 'sleep_surrender',
        name: 'Surrendering Du’a (Bismika Rabbi)',
        arabicSnippet: 'بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي وَبِكَ أَرْفَعُهُ',
        hadithNote: '“In Your Name my Lord I lie down and by You I rise...” (Bukhari & Muslim)',
      },
      {
        id: 'sleep_final_dua',
        name: 'Final Sleep Du’a',
        arabicSnippet: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
        hadithNote: '“In Your Name, O Allah, I die and I live” (Sahih al-Bukhari)',
      },
    ],
  },
];

export const DHIKR_LABELS: Record<string, string> = {
  waking_praise: 'Waking Praise',
  waking_night: 'Night Tawhid',
  morning_ayat_quls: 'Morning Quls',
  morning_sayyid_istighfar: 'Morning Istighfar',
  morning_asbahna: 'Asbahna',
  morning_subhanallah_100: 'SubhanAllah 100x',
  prayer_istighfar_salam: 'Prayer Istighfar',
  prayer_ayat_kursi: 'Prayer Kursi',
  prayer_tasbih_fatimah: 'Tasbih Fatimah',
  prayer_tawhid_seal: 'Tawhid Seal',
  evening_ayat_quls: 'Evening Quls',
  evening_sayyid_istighfar: 'Evening Istighfar',
  evening_amsayna: 'Amsayna',
  evening_refuge: 'Evening Refuge',
  sleep_3quls_wipe: 'Sleep Quls',
  sleep_ayat_baqarah: 'Sleep Kursi & Baqarah',
  sleep_surrender: 'Surrender Du’a',
  sleep_final_dua: 'Sleep Du’a',
};

/** All individual sub-item IDs */
export const ALL_DHIKR_ITEM_IDS = DHIKR_CATEGORIES.flatMap((c) =>
  c.items.map((item) => item.id)
);

/** Default selection: foundational morning and evening remembrances */
export const DEFAULT_SELECTED_DHIKR = [
  'morning_ayat_quls',
  'morning_sayyid_istighfar',
  'evening_ayat_quls',
  'evening_sayyid_istighfar',
];
