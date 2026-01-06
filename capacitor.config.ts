import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mantrajapa.app',
  appName: 'Mantra Japa',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#FF6B00',
      showSpinner: false,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#FF6B00',
    },
    Haptics: {
      enabled: true,
    },
  },
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#FF6B00',
  },
  android: {
    backgroundColor: '#FF6B00',
  },
};

export default config;
