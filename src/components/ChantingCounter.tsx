import { useState, useCallback, useMemo } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChantingCounterProps {
  count: number;
  maxCount: number;
  round: number;
  mantraDevanagari: string;
  mantraTransliteration: string;
  onTap: () => void;
  onReset: () => void;
  onTogglePause: () => void;
  isPaused: boolean;
  language: 'en' | 'hi';
}

export function ChantingCounter({
  count,
  maxCount,
  round,
  mantraDevanagari,
  mantraTransliteration,
  onTap,
  onReset,
  onTogglePause,
  isPaused,
  language,
}: ChantingCounterProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const progress = (count / maxCount) * 100;
  const circumference = 2 * Math.PI * 140;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Dynamic font size based on mantra length
  const mantraFontSize = useMemo(() => {
    const length = mantraDevanagari.length;
    if (length <= 10) return 'text-3xl md:text-4xl';
    if (length <= 20) return 'text-2xl md:text-3xl';
    if (length <= 35) return 'text-xl md:text-2xl';
    if (length <= 50) return 'text-lg md:text-xl';
    if (length <= 70) return 'text-base md:text-lg';
    return 'text-sm md:text-base';
  }, [mantraDevanagari]);

  const handleTap = useCallback(() => {
    if (isPaused) return;
    
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    // Check if this will complete a round
    const willComplete = count + 1 >= maxCount;
    
    onTap();
    
    if (willComplete) {
      setIsComplete(true);
      setTimeout(() => setIsComplete(false), 1500);
    }
  }, [onTap, isPaused, count, maxCount]);

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4">
      {/* Counter Ring */}
      <div
        className={cn(
          "relative cursor-pointer select-none transition-all duration-300",
          isComplete && "animate-complete",
          isPaused && "opacity-60"
        )}
        onClick={handleTap}
      >
        <svg
          width="320"
          height="320"
          viewBox="0 0 320 320"
          className={cn(
            "counter-ring transform -rotate-90",
            isComplete && "counter-ring-complete"
          )}
        >
          {/* Background circle */}
          <circle
            cx="160"
            cy="160"
            r="140"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            className="text-muted/30"
          />
          {/* Progress circle */}
          <circle
            cx="160"
            cy="160"
            r="140"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-200 ease-out"
          />
          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(24, 95%, 53%)" />
              <stop offset="100%" stopColor="hsl(43, 96%, 56%)" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center content - Only Mantra */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          <p className={cn(
            "font-devanagari text-primary font-bold text-center leading-tight transition-transform max-w-[220px] break-words",
            mantraFontSize,
            isAnimating && "animate-count-pop"
          )}>
            {mantraDevanagari}
          </p>
        </div>
      </div>

      {/* Counter display below circle */}
      <div className="text-center mt-6">
        <div className={cn(
          "text-4xl md:text-5xl font-bold text-foreground transition-transform",
          isAnimating && "animate-count-pop"
        )}>
          {count}
          <span className="text-xl text-muted-foreground">/{maxCount}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {language === 'hi' ? 'माला' : 'Round'}: {round}
        </p>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-4 mt-6">
        <button
          onClick={onReset}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
          aria-label={language === 'hi' ? 'रीसेट' : 'Reset'}
        >
          <RotateCcw className="w-5 h-5 text-foreground" />
        </button>
        
        <button
          onClick={onTogglePause}
          className={cn(
            "flex items-center justify-center w-14 h-14 rounded-full transition-colors",
            isPaused 
              ? "bg-primary hover:bg-primary/90" 
              : "bg-secondary hover:bg-secondary/80"
          )}
          aria-label={isPaused ? (language === 'hi' ? 'जारी रखें' : 'Resume') : (language === 'hi' ? 'रोकें' : 'Pause')}
        >
          {isPaused ? (
            <Play className="w-6 h-6 text-primary-foreground" />
          ) : (
            <Pause className="w-6 h-6 text-foreground" />
          )}
        </button>
      </div>

      {/* Tap hint */}
      <p className="text-muted-foreground text-xs mt-4 animate-pulse">
        {isPaused 
          ? (language === 'hi' ? 'जारी रखने के लिए प्ले दबाएं' : 'Press play to resume')
          : (language === 'hi' ? 'जप करने के लिए टैप करें' : 'Tap circle to count')}
      </p>
    </div>
  );
}
