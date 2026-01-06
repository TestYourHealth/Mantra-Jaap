import { useState, useRef, useCallback } from 'react';

export function useAmbientMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  const stopMusic = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    setIsPlaying(false);
    setCurrentTrackId(null);
  }, []);

  const playMusic = useCallback(async (trackId: string, volume: number = 0.5) => {
    // If same track, just toggle
    if (currentTrackId === trackId && isPlaying) {
      stopMusic();
      return;
    }

    // Stop any existing music
    stopMusic();

    setIsLoading(true);
    setCurrentTrackId(trackId);

    try {
      // Check if this is an uploaded track URL (starts with http)
      if (trackId.startsWith('http')) {
        const audio = new Audio(trackId);
        audio.loop = true;
        audio.volume = volume;
        audioRef.current = audio;

        audio.onerror = () => {
          console.error('Error playing uploaded track');
          setIsPlaying(false);
          setCurrentTrackId(null);
        };

        await audio.play();
        setIsPlaying(true);
      } else {
        // For preset tracks, we no longer use API - just show message
        console.log('Preset tracks require user-uploaded audio');
        setCurrentTrackId(null);
      }
    } catch (error) {
      console.error('Error playing ambient music:', error);
      setCurrentTrackId(null);
    } finally {
      setIsLoading(false);
    }
  }, [currentTrackId, isPlaying, stopMusic]);

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  }, []);

  return {
    playMusic,
    stopMusic,
    setVolume,
    isPlaying,
    isLoading,
    currentTrackId,
  };
}
