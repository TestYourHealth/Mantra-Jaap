import { Moon, Sun, Volume2, VolumeX, Vibrate, Languages, RotateCcw, Music, Loader2, Upload, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { AppSettings } from '@/types/mantra';
import { silenceOption } from '@/data/audio';
import { useUploadedTracks, UploadedTrack } from '@/hooks/useUploadedTracks';
import { useRef } from 'react';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (updates: Partial<AppSettings>) => void;
  onResetData: () => void;
  language: 'en' | 'hi';
  ambientMusic?: {
    playMusic: (trackId: string, volume: number) => Promise<void>;
    stopMusic: () => void;
    setVolume: (volume: number) => void;
    isPlaying: boolean;
    isLoading: boolean;
    currentTrackId: string | null;
  };
}

export function SettingsView({ settings, onUpdateSettings, onResetData, language, ambientMusic }: SettingsViewProps) {
  const { tracks, isUploading, uploadTrack, deleteTrack } = useUploadedTracks();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAmbientSelect = async (track: UploadedTrack) => {
    if (!ambientMusic) return;

    onUpdateSettings({ ambientSoundId: track.id });
    await ambientMusic.playMusic(track.file_url, settings.ambientVolume);
  };

  const handleSilence = () => {
    if (!ambientMusic) return;
    ambientMusic.stopMusic();
    onUpdateSettings({ ambientSoundId: null });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadTrack(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteTrack = async (track: UploadedTrack) => {
    if (settings.ambientSoundId === track.id) {
      ambientMusic?.stopMusic();
      onUpdateSettings({ ambientSoundId: null });
    }
    await deleteTrack(track);
  };

  return (
    <div className="flex flex-col h-full pb-20 px-4 pt-4 overflow-y-auto">
      <h1 className="text-2xl font-bold text-foreground mb-6">
        {language === 'hi' ? 'सेटिंग्स' : 'Settings'}
      </h1>

      <div className="space-y-6">
        {/* Appearance */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase mb-3">
            {language === 'hi' ? 'दिखावट' : 'Appearance'}
          </h2>
          <div className="card-spiritual space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {settings.darkMode ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
                <span>{language === 'hi' ? 'डार्क मोड' : 'Dark Mode'}</span>
              </div>
              <Switch
                checked={settings.darkMode}
                onCheckedChange={(checked) => onUpdateSettings({ darkMode: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Languages className="w-5 h-5 text-primary" />
                <span>{language === 'hi' ? 'भाषा' : 'Language'}</span>
              </div>
              <button
                onClick={() => onUpdateSettings({ language: settings.language === 'en' ? 'hi' : 'en' })}
                className="px-4 py-2 bg-secondary rounded-lg text-sm font-medium"
              >
                {settings.language === 'en' ? 'हिंदी' : 'English'}
              </button>
            </div>
          </div>
        </section>

        {/* Sound */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase mb-3">
            {language === 'hi' ? 'ध्वनि' : 'Sound'}
          </h2>
          <div className="card-spiritual space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {settings.soundEnabled ? <Volume2 className="w-5 h-5 text-primary" /> : <VolumeX className="w-5 h-5 text-muted-foreground" />}
                <span>{language === 'hi' ? 'ध्वनि' : 'Sound'}</span>
              </div>
              <Switch
                checked={settings.soundEnabled}
                onCheckedChange={(checked) => onUpdateSettings({ soundEnabled: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Vibrate className="w-5 h-5 text-primary" />
                <span>{language === 'hi' ? 'कंपन' : 'Vibration'}</span>
              </div>
              <Switch
                checked={settings.vibrationEnabled}
                onCheckedChange={(checked) => onUpdateSettings({ vibrationEnabled: checked })}
              />
            </div>
          </div>
        </section>

        {/* Ambient Music */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase mb-3">
            {language === 'hi' ? 'पृष्ठभूमि संगीत' : 'Ambient Music'}
          </h2>
          <div className="card-spiritual space-y-4">
            {/* Upload button */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{language === 'hi' ? 'अपलोड हो रहा है...' : 'Uploading...'}</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>{language === 'hi' ? 'संगीत अपलोड करें' : 'Upload Music'}</span>
                  </>
                )}
              </button>
              <p className="text-xs text-muted-foreground mt-1 text-center">
                {language === 'hi' ? 'MP3, WAV (अधिकतम 10MB)' : 'MP3, WAV (max 10MB)'}
              </p>
            </div>

            {/* Silence option */}
            <button
              onClick={handleSilence}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                !settings.ambientSoundId
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
            >
              <span>{silenceOption.icon}</span>
              <span>{language === 'hi' ? silenceOption.nameHi : silenceOption.nameEn}</span>
            </button>

            {/* Uploaded tracks */}
            {tracks.length > 0 && (
              <div>
                <h3 className="text-xs font-medium text-muted-foreground mb-2">
                  {language === 'hi' ? 'आपके ट्रैक्स' : 'Your Tracks'}
                </h3>
                <div className="space-y-2">
                  {tracks.map((track) => {
                    const isActive = settings.ambientSoundId === track.id;
                    const isCurrentlyPlaying = ambientMusic?.currentTrackId === track.file_url && ambientMusic?.isPlaying;
                    
                    return (
                      <div
                        key={track.id}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary'
                        }`}
                      >
                        <button
                          onClick={() => handleAmbientSelect(track)}
                          className="flex-1 flex items-center gap-2 text-left"
                        >
                          {isCurrentlyPlaying && <Music className="w-3 h-3 animate-pulse" />}
                          <span className="truncate text-sm">{track.name}</span>
                        </button>
                        <button
                          onClick={() => handleDeleteTrack(track)}
                          className={`p-1 rounded hover:bg-destructive/20 ${isActive ? 'text-primary-foreground' : 'text-destructive'}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {tracks.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                {language === 'hi' ? 'अपना संगीत अपलोड करें' : 'Upload your own music'}
              </p>
            )}

            {/* Volume control */}
            {settings.ambientSoundId && (
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  {language === 'hi' ? 'संगीत वॉल्यूम' : 'Music Volume'}
                </label>
                <Slider
                  value={[settings.ambientVolume * 100]}
                  onValueChange={([value]) => {
                    const volume = value / 100;
                    onUpdateSettings({ ambientVolume: volume });
                    ambientMusic?.setVolume(volume);
                  }}
                  max={100}
                  step={10}
                  className="w-full"
                />
              </div>
            )}
          </div>
        </section>

        {/* Reset */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase mb-3">
            {language === 'hi' ? 'डेटा' : 'Data'}
          </h2>
          <div className="card-spiritual">
            <button
              onClick={() => {
                if (confirm(language === 'hi' ? 'क्या आप सभी डेटा रीसेट करना चाहते हैं?' : 'Reset all data? This cannot be undone.')) {
                  onResetData();
                }
              }}
              className="flex items-center gap-3 text-destructive w-full"
            >
              <RotateCcw className="w-5 h-5" />
              <span>{language === 'hi' ? 'सभी डेटा रीसेट करें' : 'Reset All Data'}</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
