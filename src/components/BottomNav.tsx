import { Home, BookOpen, BarChart3, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  language: 'en' | 'hi';
}

const tabs = [
  { id: 'chant', icon: Home, labelEn: 'Chant', labelHi: 'जप' },
  { id: 'gallery', icon: BookOpen, labelEn: 'Mantras', labelHi: 'मंत्र' },
  { id: 'stats', icon: BarChart3, labelEn: 'Stats', labelHi: 'आंकड़े' },
  { id: 'settings', icon: Settings, labelEn: 'Settings', labelHi: 'सेटिंग्स' },
];

export function BottomNav({ activeTab, onTabChange, language }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border safe-area-pb">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full transition-all duration-200",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 mb-1 transition-transform",
                isActive && "scale-110"
              )} />
              <span className="text-xs font-medium">
                {language === 'hi' ? tab.labelHi : tab.labelEn}
              </span>
              {isActive && (
                <div className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
