import { useState, useEffect } from 'react';
import { ChantingCounter } from '@/components/ChantingCounter';
import { BottomNav } from '@/components/BottomNav';
import { MantraGallery } from '@/components/MantraGallery';
import { StatsView } from '@/components/StatsView';
import { SettingsView } from '@/components/SettingsView';
import { Footer } from '@/components/Footer';
import { useChanting } from '@/hooks/useChanting';
import { useAudio, useVibration } from '@/hooks/useAudio';
import { useAmbientMusic } from '@/hooks/useAmbientMusic';
import { Mantra } from '@/types/mantra';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const Index = () => {
  const [activeTab, setActiveTab] = useState('chant');
  const [showAddMantra, setShowAddMantra] = useState(false);
  const [newMantra, setNewMantra] = useState({
    devanagari: '',
    transliteration: '',
    meaning: '',
    meaningHindi: '',
  });

  const {
    currentMantra,
    currentCount,
    currentRound,
    isPaused,
    maxCount,
    stats,
    settings,
    allMantras,
    favorites,
    incrementCount,
    resetCount,
    setMantra,
    togglePause,
    updateSettings,
    addCustomMantra,
    toggleFavorite,
    resetAllData,
  } = useChanting();

  const { playCompletionSound, playTapSound, startAmbient, stopAmbient } = useAudio(
    settings.soundEnabled,
    settings.completionVolume
  );
  const { vibrate, vibrateCompletion } = useVibration(settings.vibrationEnabled);
  const ambientMusic = useAmbientMusic();

  // Apply dark mode
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  // Handle ambient music cleanup on unmount
  useEffect(() => {
    return () => ambientMusic.stopMusic();
  }, [ambientMusic]);

  const handleCount = () => {
    if (isPaused) return;

    const isComplete = incrementCount();

    // Play tap sound
    if (settings.soundEnabled) {
      playTapSound();
    }

    // Vibration feedback
    if (settings.vibrationEnabled) {
      if (isComplete) {
        vibrateCompletion();
      } else {
        vibrate(10);
      }
    }

    // Completion celebration
    if (isComplete) {
      if (settings.soundEnabled) {
        playCompletionSound(settings.completionSoundId);
      }
      toast.success(
        settings.language === 'hi' 
          ? '🙏 १०८ जप पूर्ण! शुभ हो!' 
          : '🙏 108 chants complete! Blessed!',
        { duration: 3000 }
      );
    }
  };

  const handleSelectMantra = (mantraId: string) => {
    setMantra(mantraId);
    setActiveTab('chant');
    const mantra = allMantras.find(m => m.id === mantraId);
    if (mantra) {
      toast.success(
        settings.language === 'hi'
          ? `${mantra.devanagari} चुना गया`
          : `Selected: ${mantra.transliteration}`,
        { duration: 2000 }
      );
    }
  };

  const handleAddCustomMantra = () => {
    if (!newMantra.devanagari || !newMantra.transliteration) {
      toast.error(
        settings.language === 'hi'
          ? 'कृपया मंत्र और लिप्यंतरण भरें'
          : 'Please fill mantra and transliteration'
      );
      return;
    }

    addCustomMantra({
      devanagari: newMantra.devanagari,
      transliteration: newMantra.transliteration,
      meaning: newMantra.meaning || 'Custom mantra',
      meaningHindi: newMantra.meaningHindi || 'कस्टम मंत्र',
      category: 'universal',
    });

    setShowAddMantra(false);
    setNewMantra({ devanagari: '', transliteration: '', meaning: '', meaningHindi: '' });
    toast.success(
      settings.language === 'hi'
        ? 'मंत्र जोड़ा गया!'
        : 'Mantra added successfully!'
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-spiritual-saffron/10 via-background to-spiritual-gold/5 dark:from-spiritual-maroon/20 dark:via-background dark:to-spiritual-gold/5">
      {/* Mandala Background Pattern */}
      <div className="fixed inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZGVmcz48cGF0dGVybiBpZD0ibWFuZGFsYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNGRjZCMDAiIHN0cm9rZS13aWR0aD0iMC41Ii8+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iMzAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGNkIwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRkY2QjAwIiBzdHJva2Utd2lkdGg9IjAuNSIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjEwIiBmaWxsPSJub25lIiBzdHJva2U9IiNGRjZCMDAiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI21hbmRhbGEpIi8+PC9zdmc+')] bg-repeat" />

      {/* Main Content */}
      <main className="relative pb-32 pt-safe min-h-screen flex flex-col">
        {activeTab === 'chant' && (
          <ChantingCounter
            count={currentCount}
            maxCount={maxCount}
            round={currentRound}
            mantraDevanagari={currentMantra.devanagari}
            mantraTransliteration={currentMantra.transliteration}
            onTap={handleCount}
            onReset={resetCount}
            onTogglePause={togglePause}
            isPaused={isPaused}
            language={settings.language}
          />
        )}

        {activeTab === 'gallery' && (
          <MantraGallery
            mantras={allMantras}
            favorites={favorites}
            currentMantraId={currentMantra.id}
            language={settings.language}
            onSelectMantra={handleSelectMantra}
            onToggleFavorite={toggleFavorite}
            onAddCustom={() => setShowAddMantra(true)}
          />
        )}

        {activeTab === 'stats' && (
          <StatsView
            stats={stats}
            mantras={allMantras}
            language={settings.language}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            onUpdateSettings={updateSettings}
            onResetData={resetAllData}
            language={settings.language}
            ambientMusic={ambientMusic}
          />
        )}
        
        {activeTab !== 'chant' && (
          <div className="mt-auto">
            <Footer />
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        language={settings.language}
      />

      {/* Add Custom Mantra Dialog */}
      <Dialog open={showAddMantra} onOpenChange={setShowAddMantra}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-devanagari">
              {settings.language === 'hi' ? 'नया मंत्र जोड़ें' : 'Add Custom Mantra'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="mantra-text">
                {settings.language === 'hi' ? 'मंत्र (देवनागरी)' : 'Mantra (Devanagari)'}
              </Label>
              <Input
                id="mantra-text"
                value={newMantra.devanagari}
                onChange={(e) => setNewMantra(prev => ({ ...prev, devanagari: e.target.value }))}
                placeholder="ॐ..."
                className="font-devanagari text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transliteration">
                {settings.language === 'hi' ? 'लिप्यंतरण' : 'Transliteration'}
              </Label>
              <Input
                id="transliteration"
                value={newMantra.transliteration}
                onChange={(e) => setNewMantra(prev => ({ ...prev, transliteration: e.target.value }))}
                placeholder="Om..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meaning">
                {settings.language === 'hi' ? 'अर्थ (अंग्रेज़ी)' : 'Meaning (English)'}
              </Label>
              <Textarea
                id="meaning"
                value={newMantra.meaning}
                onChange={(e) => setNewMantra(prev => ({ ...prev, meaning: e.target.value }))}
                placeholder="The meaning..."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meaning-hi">
                {settings.language === 'hi' ? 'अर्थ (हिंदी)' : 'Meaning (Hindi)'}
              </Label>
              <Textarea
                id="meaning-hi"
                value={newMantra.meaningHindi}
                onChange={(e) => setNewMantra(prev => ({ ...prev, meaningHindi: e.target.value }))}
                placeholder="अर्थ..."
                className="font-devanagari"
                rows={2}
              />
            </div>
            <Button 
              onClick={handleAddCustomMantra} 
              className="w-full bg-spiritual-saffron hover:bg-spiritual-deepOrange text-white"
            >
              {settings.language === 'hi' ? 'मंत्र जोड़ें' : 'Add Mantra'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
