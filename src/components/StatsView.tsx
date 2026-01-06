import { Flame, Target, Award, TrendingUp } from 'lucide-react';
import { ChantingStats, Mantra } from '@/types/mantra';

interface StatsViewProps {
  stats: ChantingStats;
  mantras: Mantra[];
  language: 'en' | 'hi';
}

export function StatsView({ stats, mantras, language }: StatsViewProps) {
  const mostUsedMantra = mantras.find(m => m.id === stats.mostUsedMantraId);

  const statCards = [
    {
      icon: Target,
      labelEn: "Today's Count",
      labelHi: 'आज की गिनती',
      value: stats.todayCount,
      subLabelEn: `${stats.todayRounds} rounds`,
      subLabelHi: `${stats.todayRounds} माला`,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: Flame,
      labelEn: 'Daily Streak',
      labelHi: 'दैनिक लकीर',
      value: stats.dailyStreak,
      subLabelEn: 'days',
      subLabelHi: 'दिन',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      icon: TrendingUp,
      labelEn: 'Lifetime Count',
      labelHi: 'कुल गिनती',
      value: stats.lifetimeCount.toLocaleString(),
      subLabelEn: `${stats.lifetimeRounds} rounds`,
      subLabelHi: `${stats.lifetimeRounds} माला`,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: Award,
      labelEn: 'Most Chanted',
      labelHi: 'सबसे अधिक जप',
      value: mostUsedMantra?.transliteration || '-',
      isText: true,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="flex flex-col h-full pb-20 px-4 pt-4">
      <h1 className="text-2xl font-bold text-foreground mb-6">
        {language === 'hi' ? 'आपकी प्रगति' : 'Your Progress'}
      </h1>

      <div className="grid grid-cols-2 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="card-spiritual flex flex-col items-center text-center p-5"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`p-3 rounded-full ${stat.bgColor} mb-3`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <p className="text-sm text-muted-foreground mb-1">
                {language === 'hi' ? stat.labelHi : stat.labelEn}
              </p>
              <p className={`text-2xl font-bold text-foreground ${stat.isText ? 'text-base' : ''}`}>
                {stat.value}
              </p>
              {stat.subLabelEn && !stat.isText && (
                <p className="text-xs text-muted-foreground">
                  {language === 'hi' ? stat.subLabelHi : stat.subLabelEn}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Motivational message */}
      <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl text-center">
        <p className="font-devanagari text-xl text-primary mb-2">
          ॐ शांति शांति शांति
        </p>
        <p className="text-sm text-muted-foreground">
          {language === 'hi' 
            ? 'नियमित जप से मन को शांति मिलती है'
            : 'Regular chanting brings peace to the mind'}
        </p>
      </div>
    </div>
  );
}
