import 'dotenv/config';
import { version } from './package.json';

export default ({ config }) => {
  const ENV = process.env.ENV || 'development';

  // projectId только один, ты используешь preview — можно расширить позже
  const projectIds = {
    development: 'd440a57c-6473-4974-bae4-288633ed101e',
    preview:     'd440a57c-6473-4974-bae4-288633ed101e',
    production:  'd440a57c-6473-4974-bae4-288633ed101e'
  };

  return {
    ...config,
    expo: {
      ...config.expo,
      name: 'Seka Front',
      slug: 'seka_front_last',
      version,
      orientation: 'portrait',
      scheme: 'sekaapp', // можно использовать для deep linking
      icon: './assets/icon.png',
      splash: {
        image: './assets/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#ffffff'
      },
      assetBundlePatterns: ['**/*'],
      updates: {
        fallbackToCacheTimeout: 0
      },
      userInterfaceStyle: 'automatic',
      extra: {
        eas: {
          projectId: projectIds[ENV]
        },
        ENV
      },
      // для Android
      android: {
        package: 'com.almuko.seka', // укажи свой, если планируешь публиковать
        versionCode: Math.floor(Date.now() / 1000), // авто-уникальный код
        permissions: [],
        config: {
          googleMaps: {
            apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
          },
        },
      },
      
      // для Web
      web: {
        favicon: './assets/icon.png'
      }
    }
  };
};
