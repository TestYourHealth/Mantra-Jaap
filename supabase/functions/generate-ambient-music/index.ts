import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { trackId, duration } = await req.json();
    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');

    if (!ELEVENLABS_API_KEY) {
      throw new Error('ELEVENLABS_API_KEY is not configured');
    }

    // Map track IDs to sound effect prompts (using Sound Effects API instead of Music API)
    const sfxPrompts: Record<string, string> = {
      // Temple Sounds
      'temple-bell-loop': 'Temple bells ringing gently, peaceful meditation atmosphere, soft resonating bell sounds',
      'morning-aarti': 'Indian temple aarti bells and chimes, devotional ceremony sounds, gentle metallic ringing',
      'om-chanting': 'Deep om chanting drone, peaceful meditation humming, spiritual ambient sound',
      
      // Instrumental
      'bansuri-flute': 'Soft bamboo flute melody, peaceful Indian classical music, gentle wind instrument',
      'tanpura-drone': 'Tanpura drone sound, continuous humming stringed instrument, meditation music',
      'tabla-soft': 'Soft tabla percussion, gentle Indian drums, rhythmic meditation beats',
      'sitar-meditation': 'Gentle sitar strings being plucked, Indian classical melody, peaceful music',
      'santoor': 'Santoor hammered strings, Indian classical dulcimer, gentle melodic tones',
      'veena': 'Veena classical strings, peaceful Indian melody, spiritual instrument sound',
      
      // Nature
      'ganga-river': 'Peaceful river flowing water, gentle stream sounds, nature ambiance',
      'morning-birds': 'Morning birds chirping, peaceful dawn birdsong, nature sounds',
      'forest-ashram': 'Forest ambiance with birds and gentle breeze, peaceful nature sounds',
      'night-crickets': 'Night crickets chirping, peaceful evening ambiance, nature sounds',
      'gentle-rain': 'Gentle rain falling softly, peaceful rainfall, relaxing rain sounds',
      
      // Chants
      'vedic-chanting': 'Sanskrit mantra chanting voices, spiritual humming, meditation chant',
      'bhajan-melody': 'Soft devotional singing, peaceful spiritual melody, gentle vocals',
      'tibetan-bowls': 'Tibetan singing bowls resonating, deep meditation sound, healing tones',
    };

    const prompt = sfxPrompts[trackId] || 'Peaceful meditation ambient sound, calming and spiritual';
    
    console.log(`Generating SFX for track: ${trackId}, prompt: ${prompt}`);

    // Use Sound Effects API instead of Music API
    const response = await fetch('https://api.elevenlabs.io/v1/sound-generation', {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: prompt,
        duration_seconds: duration || 10,
        prompt_influence: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', response.status, errorText);
      throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
    }

    const audioBuffer = await response.arrayBuffer();
    console.log(`Generated audio for ${trackId}, size: ${audioBuffer.byteLength} bytes`);

    return new Response(audioBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error) {
    console.error('Error generating ambient music:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
