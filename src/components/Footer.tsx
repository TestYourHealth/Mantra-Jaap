import { Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full py-6 text-center border-t border-border/40 bg-background/50 backdrop-blur-sm z-10 relative">
      <div className="flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
        <p className="flex items-center gap-1 font-medium">
          Made with <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" /> (Rishabh Gupta) for Inner Peace
        </p>
        <p className="text-xs opacity-75">
          © 2025 Mantra Japa. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
