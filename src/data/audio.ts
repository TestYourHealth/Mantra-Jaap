import { AudioTrack } from '@/types/mantra';

export const ambientTracks: AudioTrack[] = [
  // Temple Sounds
  {
    id: 'temple-bell-loop',
    nameEn: 'Temple Bell Loop',
    nameHi: 'मंदिर घंटी',
    type: 'ambient',
    category: 'temple',
    icon: '🔔',
  },
  {
    id: 'morning-aarti',
    nameEn: 'Morning Aarti',
    nameHi: 'प्रातः आरती',
    type: 'ambient',
    category: 'temple',
    icon: '🛕',
  },
  {
    id: 'om-chanting',
    nameEn: 'Om Chanting',
    nameHi: 'ॐ जप',
    type: 'ambient',
    category: 'temple',
    icon: '🕉️',
  },

  // Instrumental
  {
    id: 'bansuri-flute',
    nameEn: 'Bansuri Flute',
    nameHi: 'बांसुरी',
    type: 'ambient',
    category: 'instrumental',
    icon: '🎵',
  },
  {
    id: 'tanpura-drone',
    nameEn: 'Tanpura Drone',
    nameHi: 'तानपुरा',
    type: 'ambient',
    category: 'instrumental',
    icon: '🎸',
  },
  {
    id: 'tabla-soft',
    nameEn: 'Soft Tabla',
    nameHi: 'मृदु तबला',
    type: 'ambient',
    category: 'instrumental',
    icon: '🥁',
  },
  {
    id: 'sitar-meditation',
    nameEn: 'Sitar Meditation',
    nameHi: 'सितार ध्यान',
    type: 'ambient',
    category: 'instrumental',
    icon: '🎶',
  },
  {
    id: 'santoor',
    nameEn: 'Santoor',
    nameHi: 'संतूर',
    type: 'ambient',
    category: 'instrumental',
    icon: '🎵',
  },
  {
    id: 'veena',
    nameEn: 'Veena Classical',
    nameHi: 'वीणा',
    type: 'ambient',
    category: 'instrumental',
    icon: '🎶',
  },

  // Nature
  {
    id: 'ganga-river',
    nameEn: 'Ganga River Flow',
    nameHi: 'गंगा नदी',
    type: 'ambient',
    category: 'nature',
    icon: '🌊',
  },
  {
    id: 'morning-birds',
    nameEn: 'Morning Birds',
    nameHi: 'प्रातः पक्षी',
    type: 'ambient',
    category: 'nature',
    icon: '🐦',
  },
  {
    id: 'forest-ashram',
    nameEn: 'Forest Ashram',
    nameHi: 'वन आश्रम',
    type: 'ambient',
    category: 'nature',
    icon: '🌿',
  },
  {
    id: 'night-crickets',
    nameEn: 'Night Crickets',
    nameHi: 'रात्रि झींगुर',
    type: 'ambient',
    category: 'nature',
    icon: '🌙',
  },
  {
    id: 'gentle-rain',
    nameEn: 'Gentle Rain',
    nameHi: 'मृदु वर्षा',
    type: 'ambient',
    category: 'nature',
    icon: '🌧️',
  },

  // Chants
  {
    id: 'vedic-chanting',
    nameEn: 'Vedic Chanting',
    nameHi: 'वैदिक मंत्र',
    type: 'ambient',
    category: 'chants',
    icon: '📿',
  },
  {
    id: 'bhajan-melody',
    nameEn: 'Bhajan Melody',
    nameHi: 'भजन धुन',
    type: 'ambient',
    category: 'chants',
    icon: '🙏',
  },
  {
    id: 'tibetan-bowls',
    nameEn: 'Tibetan Bowls',
    nameHi: 'तिब्बती कटोरे',
    type: 'ambient',
    category: 'chants',
    icon: '☮️',
  },
];

export const completionSounds: AudioTrack[] = [
  {
    id: 'temple-bell',
    nameEn: 'Temple Bell',
    nameHi: 'मंदिर घंटी',
    type: 'completion',
    category: 'temple',
    icon: '🔔',
  },
  {
    id: 'shankh',
    nameEn: 'Shankh (Conch)',
    nameHi: 'शंख',
    type: 'completion',
    category: 'temple',
    icon: '📯',
  },
  {
    id: 'celestial-chime',
    nameEn: 'Celestial Chime',
    nameHi: 'दिव्य झंकार',
    type: 'completion',
    category: 'temple',
    icon: '✨',
  },
  {
    id: 'dundubhi',
    nameEn: 'Victory Dundubhi',
    nameHi: 'विजय दुंदुभी',
    type: 'completion',
    category: 'temple',
    icon: '🎵',
  },
  {
    id: 'gentle-gong',
    nameEn: 'Gentle Gong',
    nameHi: 'मृदु घंटा',
    type: 'completion',
    category: 'temple',
    icon: '🔔',
  },
];

export const silenceOption: AudioTrack = {
  id: 'silence',
  nameEn: 'Silence',
  nameHi: 'मौन',
  type: 'ambient',
  category: 'nature',
  icon: '🤫',
};
