export interface Mantra {
  id: string;
  devanagari: string;
  transliteration: string;
  meaning: string;
  meaningHindi: string;
  category: MantraCategory;
  isFavorite?: boolean;
  isCustom?: boolean;
}

export type MantraCategory = 
  | 'shiva' 
  | 'ram' 
  | 'krishna' 
  | 'goddess' 
  | 'ganesh' 
  | 'hanuman' 
  | 'universal';

export interface CategoryInfo {
  id: MantraCategory;
  nameEn: string;
  nameHi: string;
  icon: string;
  color: string;
}

export interface AudioTrack {
  id: string;
  nameEn: string;
  nameHi: string;
  type: 'ambient' | 'completion';
  category: 'temple' | 'instrumental' | 'nature' | 'chants';
  icon: string;
}

export interface ChantingStats {
  todayCount: number;
  todayRounds: number;
  lifetimeCount: number;
  lifetimeRounds: number;
  dailyStreak: number;
  lastChantDate: string | null;
  mostUsedMantraId: string | null;
  mantraUsage: Record<string, number>;
}

export interface AppSettings {
  language: 'en' | 'hi';
  darkMode: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  completionSoundId: string;
  ambientSoundId: string | null;
  completionVolume: number;
  ambientVolume: number;
}

export interface AppState {
  currentMantraId: string;
  currentCount: number;
  currentRound: number;
  isPaused: boolean;
}
