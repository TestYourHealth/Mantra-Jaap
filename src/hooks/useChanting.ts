import { useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { AppState, ChantingStats, AppSettings, Mantra } from '@/types/mantra';
import { mantras } from '@/data/mantras';

const MAX_COUNT = 108;

const defaultState: AppState = {
  currentMantraId: 'shiva-1',
  currentCount: 0,
  currentRound: 0,
  isPaused: false,
};

const defaultStats: ChantingStats = {
  todayCount: 0,
  todayRounds: 0,
  lifetimeCount: 0,
  lifetimeRounds: 0,
  dailyStreak: 0,
  lastChantDate: null,
  mostUsedMantraId: null,
  mantraUsage: {},
};

const defaultSettings: AppSettings = {
  language: 'en',
  darkMode: false,
  soundEnabled: true,
  vibrationEnabled: true,
  completionSoundId: 'temple-bell',
  ambientSoundId: null,
  completionVolume: 0.7,
  ambientVolume: 0.3,
};

const getTodayDate = () => new Date().toISOString().split('T')[0];

export function useChanting() {
  const [state, setState] = useLocalStorage<AppState>('mantra-state', defaultState);
  const [stats, setStats] = useLocalStorage<ChantingStats>('mantra-stats', defaultStats);
  const [settings, setSettings] = useLocalStorage<AppSettings>('mantra-settings', defaultSettings);
  const [customMantras, setCustomMantras] = useLocalStorage<Mantra[]>('custom-mantras', []);
  const [favorites, setFavorites] = useLocalStorage<string[]>('favorite-mantras', []);

  // Check and update streak on mount
  useEffect(() => {
    const today = getTodayDate();
    const lastDate = stats.lastChantDate;

    if (lastDate && lastDate !== today) {
      const lastDateObj = new Date(lastDate);
      const todayObj = new Date(today);
      const diffDays = Math.floor((todayObj.getTime() - lastDateObj.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays > 1) {
        // Streak broken
        setStats(prev => ({
          ...prev,
          dailyStreak: 0,
          todayCount: 0,
          todayRounds: 0,
        }));
      } else if (diffDays === 1) {
        // New day, reset today counts
        setStats(prev => ({
          ...prev,
          todayCount: 0,
          todayRounds: 0,
        }));
      }
    }
  }, [setStats, stats.lastChantDate]);

  const allMantras = [...mantras, ...customMantras];
  
  const currentMantra = allMantras.find(m => m.id === state.currentMantraId) || mantras[0];

  const incrementCount = useCallback(() => {
    const today = getTodayDate();
    
    setState(prev => {
      const newCount = prev.currentCount + 1;
      const isComplete = newCount >= MAX_COUNT;
      
      return {
        ...prev,
        currentCount: isComplete ? 0 : newCount,
        currentRound: isComplete ? prev.currentRound + 1 : prev.currentRound,
      };
    });

    setStats(prev => {
      const isNewDay = prev.lastChantDate !== today;
      const newTodayCount = isNewDay ? 1 : prev.todayCount + 1;
      const isRoundComplete = (state.currentCount + 1) >= MAX_COUNT;
      
      // Update mantra usage
      const mantraUsage = { ...prev.mantraUsage };
      mantraUsage[state.currentMantraId] = (mantraUsage[state.currentMantraId] || 0) + 1;
      
      // Find most used mantra
      let mostUsedMantraId = prev.mostUsedMantraId;
      let maxUsage = 0;
      Object.entries(mantraUsage).forEach(([id, count]) => {
        if (count > maxUsage) {
          maxUsage = count;
          mostUsedMantraId = id;
        }
      });

      return {
        ...prev,
        todayCount: newTodayCount,
        todayRounds: isRoundComplete ? (isNewDay ? 1 : prev.todayRounds + 1) : (isNewDay ? 0 : prev.todayRounds),
        lifetimeCount: prev.lifetimeCount + 1,
        lifetimeRounds: isRoundComplete ? prev.lifetimeRounds + 1 : prev.lifetimeRounds,
        dailyStreak: isNewDay ? prev.dailyStreak + 1 : prev.dailyStreak,
        lastChantDate: today,
        mostUsedMantraId,
        mantraUsage,
      };
    });

    return (state.currentCount + 1) >= MAX_COUNT;
  }, [state.currentCount, state.currentMantraId, setState, setStats]);

  const resetCount = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentCount: 0,
    }));
  }, [setState]);

  const resetRound = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentCount: 0,
      currentRound: 0,
    }));
  }, [setState]);

  const setMantra = useCallback((mantraId: string) => {
    setState(prev => ({
      ...prev,
      currentMantraId: mantraId,
      currentCount: 0,
    }));
  }, [setState]);

  const togglePause = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPaused: !prev.isPaused,
    }));
  }, [setState]);

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, [setSettings]);

  const addCustomMantra = useCallback((mantra: Omit<Mantra, 'id' | 'isCustom'>) => {
    const newMantra: Mantra = {
      ...mantra,
      id: `custom-${Date.now()}`,
      isCustom: true,
    };
    setCustomMantras(prev => [...prev, newMantra]);
    return newMantra.id;
  }, [setCustomMantras]);

  const removeCustomMantra = useCallback((mantraId: string) => {
    setCustomMantras(prev => prev.filter(m => m.id !== mantraId));
    setFavorites(prev => prev.filter(id => id !== mantraId));
    if (state.currentMantraId === mantraId) {
      setState(prev => ({ ...prev, currentMantraId: 'shiva-1' }));
    }
  }, [setCustomMantras, setFavorites, state.currentMantraId, setState]);

  const toggleFavorite = useCallback((mantraId: string) => {
    setFavorites(prev => 
      prev.includes(mantraId) 
        ? prev.filter(id => id !== mantraId)
        : [...prev, mantraId]
    );
  }, [setFavorites]);

  const resetAllData = useCallback(() => {
    setState(defaultState);
    setStats(defaultStats);
    setCustomMantras([]);
    setFavorites([]);
  }, [setState, setStats, setCustomMantras, setFavorites]);

  return {
    // State
    state,
    currentMantra,
    currentCount: state.currentCount,
    currentRound: state.currentRound,
    isPaused: state.isPaused,
    maxCount: MAX_COUNT,
    progress: (state.currentCount / MAX_COUNT) * 100,
    
    // Stats
    stats,
    
    // Settings
    settings,
    updateSettings,
    
    // Mantras
    allMantras,
    customMantras,
    favorites,
    
    // Actions
    incrementCount,
    resetCount,
    resetRound,
    setMantra,
    togglePause,
    addCustomMantra,
    removeCustomMantra,
    toggleFavorite,
    resetAllData,
  };
}
