import { useState } from 'react';
import { Heart, Plus, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Mantra, MantraCategory } from '@/types/mantra';
import { categories } from '@/data/mantras';
import { Input } from '@/components/ui/input';

interface MantraGalleryProps {
  mantras: Mantra[];
  favorites: string[];
  currentMantraId: string;
  onSelectMantra: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onAddCustom: () => void;
  language: 'en' | 'hi';
}

export function MantraGallery({
  mantras,
  favorites,
  currentMantraId,
  onSelectMantra,
  onToggleFavorite,
  onAddCustom,
  language,
}: MantraGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<MantraCategory | 'all' | 'favorites'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMantras = mantras.filter(mantra => {
    if (selectedCategory === 'favorites') {
      return favorites.includes(mantra.id);
    }
    if (selectedCategory !== 'all' && mantra.category !== selectedCategory) {
      return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        mantra.devanagari.includes(searchQuery) ||
        mantra.transliteration.toLowerCase().includes(query) ||
        mantra.meaning.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col h-full pb-20">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-2xl font-bold text-foreground mb-4">
          {language === 'hi' ? 'मंत्र गैलरी' : 'Mantra Gallery'}
        </h1>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={language === 'hi' ? 'मंत्र खोजें...' : 'Search mantras...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary/50"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory('all')}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
              selectedCategory === 'all'
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            {language === 'hi' ? 'सभी' : 'All'}
          </button>
          <button
            onClick={() => setSelectedCategory('favorites')}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1",
              selectedCategory === 'favorites'
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            <Heart className="w-3 h-3" />
            {language === 'hi' ? 'पसंदीदा' : 'Favorites'}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                selectedCategory === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {cat.icon} {language === 'hi' ? cat.nameHi : cat.nameEn}
            </button>
          ))}
        </div>
      </div>

      {/* Mantra Grid */}
      <div className="flex-1 overflow-y-auto px-4">
        <div className="grid grid-cols-1 gap-3 pb-4">
          {/* Add Custom Button */}
          <button
            onClick={onAddCustom}
            className="card-spiritual flex items-center justify-center gap-2 py-6 border-2 border-dashed border-primary/30 hover:border-primary/60"
          >
            <Plus className="w-5 h-5 text-primary" />
            <span className="text-primary font-medium">
              {language === 'hi' ? 'कस्टम मंत्र जोड़ें' : 'Add Custom Mantra'}
            </span>
          </button>

          {filteredMantras.map((mantra) => {
            const isSelected = mantra.id === currentMantraId;
            const isFavorite = favorites.includes(mantra.id);
            const category = categories.find(c => c.id === mantra.category);

            return (
              <div
                key={mantra.id}
                className={cn(
                  "card-spiritual relative overflow-hidden",
                  isSelected && "ring-2 ring-primary"
                )}
              >
                <div className="flex items-start justify-between">
                  <button
                    onClick={() => onSelectMantra(mantra.id)}
                    className="flex-1 text-left"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span>{category?.icon}</span>
                      <span className="text-xs text-muted-foreground">
                        {language === 'hi' ? category?.nameHi : category?.nameEn}
                      </span>
                      {mantra.isCustom && (
                        <span className="text-xs bg-accent/20 text-accent-foreground px-2 py-0.5 rounded">
                          {language === 'hi' ? 'कस्टम' : 'Custom'}
                        </span>
                      )}
                    </div>
                    <p className="font-devanagari text-lg text-foreground mb-1">
                      {mantra.devanagari}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {mantra.transliteration}
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      {language === 'hi' ? mantra.meaningHindi : mantra.meaning}
                    </p>
                  </button>
                  
                  <button
                    onClick={() => onToggleFavorite(mantra.id)}
                    className="p-2 hover:bg-secondary rounded-full transition-colors"
                  >
                    <Heart
                      className={cn(
                        "w-5 h-5 transition-colors",
                        isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
                      )}
                    />
                  </button>
                </div>
                
                {isSelected && (
                  <div className="absolute top-2 right-12 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                    {language === 'hi' ? 'चयनित' : 'Selected'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
