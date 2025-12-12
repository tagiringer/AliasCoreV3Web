export default {
  name: 'AliasCore',
  slug: 'aliascore-mobile',
  version: '1.0.0',
  orientation: 'portrait',
  // icon: './assets/icon.png', // Uncomment when you add actual icon
  userInterfaceStyle: 'automatic',
  splash: {
    // image: './assets/splash.png', // Uncomment when you add actual splash image
    resizeMode: 'contain',
    backgroundColor: '#6C63FF' // Primary brand color
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.aliascore.mobile',
    infoPlist: {
      NSLocationWhenInUseUsageDescription: 'AliasCore uses your location to show nearby gaming events on the map.',
      NSCameraUsageDescription: 'AliasCore needs camera access to scan QR codes.',
      NSPhotoLibraryUsageDescription: 'AliasCore needs photo library access to let you choose a profile avatar.',
      NFCReaderUsageDescription: 'AliasCore uses NFC to share your gaming profiles with nearby players.'
    }
  },
  android: {
    // adaptiveIcon: {
    //   foregroundImage: './assets/adaptive-icon.png',
    //   backgroundColor: '#ffffff'
    // }, // Uncomment when you add actual adaptive icon
    package: 'com.aliascore.mobile',
    permissions: [
      'ACCESS_FINE_LOCATION',
      'ACCESS_COARSE_LOCATION',
      'CAMERA',
      'READ_EXTERNAL_STORAGE',
      'WRITE_EXTERNAL_STORAGE',
      'NFC'
    ]
  },
  web: {
    // favicon: './assets/favicon.png' // Uncomment when you add actual favicon
  },
  plugins: [
    'expo-secure-store',
    'expo-location',
    [
      'expo-image-picker',
      {
        photosPermission: 'AliasCore needs access to your photos to set your profile avatar.'
      }
    ]
  ],
  extra: {
    apiBaseUrl: process.env.API_BASE_URL || 'https://api.aliascore.example.com',
    mockAuth: process.env.MOCK_AUTH === 'true',
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    env: process.env.ENV || 'development'
  }
};
