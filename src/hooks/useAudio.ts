import { useCallback, useRef, useEffect } from 'react';

// Audio frequencies for different sounds
const FREQUENCIES = {
  'temple-bell': [523.25, 659.25, 783.99], // C5, E5, G5
  'shankh': [261.63, 329.63, 392.00], // C4, E4, G4
  'celestial-chime': [1046.50, 1318.51, 1567.98], // C6, E6, G6
  'dundubhi': [130.81, 164.81, 196.00], // C3, E3, G3
  'gentle-gong': [220.00, 277.18, 329.63], // A3, C#4, E4
};

export function useAudio(enabled: boolean, volume: number = 0.7) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const ambientOscillatorRef = useRef<OscillatorNode | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);

  // Initialize audio context on first interaction
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      const W = window as unknown as {
        AudioContext?: typeof AudioContext;
        webkitAudioContext?: typeof AudioContext;
      };
      const AC = W.AudioContext || W.webkitAudioContext;
      if (AC) {
        audioContextRef.current = new AC();
      }
    }
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  // Play completion sound
  const playCompletionSound = useCallback((soundId: string = 'temple-bell') => {
    if (!enabled) return;
    
    try {
      const ctx = initAudioContext();
      const frequencies = FREQUENCIES[soundId as keyof typeof FREQUENCIES] || FREQUENCIES['temple-bell'];
      
      frequencies.forEach((freq, index) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.value = freq;
        oscillator.type = 'sine';
        
        const startTime = ctx.currentTime + (index * 0.05);
        const duration = 2;
        
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(volume * 0.3, startTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      });
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }, [enabled, volume, initAudioContext]);

  // Play tap sound (short click)
  const playTapSound = useCallback(() => {
    if (!enabled) return;
    
    try {
      const ctx = initAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      const now = ctx.currentTime;
      gainNode.gain.setValueAtTime(volume * 0.15, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      
      oscillator.start(now);
      oscillator.stop(now + 0.08);
    } catch (error) {
      console.warn('Tap sound failed:', error);
    }
  }, [enabled, volume, initAudioContext]);

  const stopAmbient = useCallback(() => {
    if (ambientOscillatorRef.current && ambientGainRef.current && audioContextRef.current) {
      try {
        const now = audioContextRef.current.currentTime;
        ambientGainRef.current.gain.linearRampToValueAtTime(0, now + 0.5);
        ambientOscillatorRef.current.stop(now + 0.6);
      } catch (error) {
        // Already stopped
      }
      ambientOscillatorRef.current = null;
      ambientGainRef.current = null;
    }
  }, []);

  // Start ambient drone
  const startAmbient = useCallback((trackId: string, ambientVolume: number = 0.3) => {
    if (!enabled || trackId === 'silence') {
      stopAmbient();
      return;
    }
    
    try {
      const ctx = initAudioContext();
      
      // Stop existing ambient
      stopAmbient();
      
      // Create new ambient sound
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      // Different base frequencies for different tracks
      const baseFreq = {
        'tanpura-drone': 130.81, // C3
        'om-chanting': 136.10, // Om frequency
        'bansuri-flute': 261.63, // C4
        'default': 110.00, // A2
      };
      
      oscillator.frequency.value = baseFreq[trackId as keyof typeof baseFreq] || baseFreq.default;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(ambientVolume * 0.1, ctx.currentTime + 2);
      
      oscillator.start();
      
      ambientOscillatorRef.current = oscillator;
      ambientGainRef.current = gainNode;
    } catch (error) {
      console.warn('Ambient audio failed:', error);
    }
  }, [enabled, initAudioContext, stopAmbient]);
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAmbient();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stopAmbient]);

  return {
    playCompletionSound,
    playTapSound,
    startAmbient,
    stopAmbient,
    initAudioContext,
  };
}

// Vibration hook
export function useVibration(enabled: boolean) {
  const vibrate = useCallback((pattern: number | number[] = 50) => {
    if (!enabled) return;
    
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }, [enabled]);

  const vibrateCompletion = useCallback(() => {
    vibrate([100, 50, 100, 50, 200]);
  }, [vibrate]);

  return { vibrate, vibrateCompletion };
}
