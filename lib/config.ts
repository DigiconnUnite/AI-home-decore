// Production configuration for AI Wall Visualizer

export const config = {
  // App settings
  app: {
    name: 'AI Wall Visualizer',
    version: '1.0.0',
    description: 'Transform your space with AI-powered wall visualization',
  },

  // Image processing settings
  image: {
    maxSize: process.env.NEXT_PUBLIC_MAX_IMAGE_SIZE 
      ? parseInt(process.env.NEXT_PUBLIC_MAX_IMAGE_SIZE) 
      : 10 * 1024 * 1024, // 10MB default
    supportedFormats: process.env.NEXT_PUBLIC_SUPPORTED_FORMATS 
      ? process.env.NEXT_PUBLIC_SUPPORTED_FORMATS.split(',') 
      : ['jpg', 'jpeg', 'png', 'webp'],
    maxWidth: 4096,
    maxHeight: 4096,
  },

  // AI settings
  ai: {
    enabled: process.env.NEXT_PUBLIC_ENABLE_ADVANCED_AI === 'true',
    fallbackEnabled: true,
    confidenceThreshold: 0.3,
    processingTimeout: 30000, // 30 seconds
  },

  // Feature flags
  features: {
    betaFeatures: process.env.NEXT_PUBLIC_ENABLE_BETA_FEATURES === 'true',
    advancedExport: true,
    realTimeCollaboration: false,
    mobileOptimization: true,
  },

  // Performance settings
  performance: {
    canvasMaxSize: 2048,
    thumbnailSize: 100,
    compressionQuality: 0.9,
    lazyLoading: true,
  },

  // External services
  services: {
    analytics: {
      enabled: !!process.env.NEXT_PUBLIC_ANALYTICS_ID,
      id: process.env.NEXT_PUBLIC_ANALYTICS_ID,
    },
    storage: {
      type: 'local', // 'local' | 'cloud' | 'hybrid'
      maxStorage: 100 * 1024 * 1024, // 100MB
    },
  },

  // Development settings
  development: {
    debugMode: process.env.NODE_ENV === 'development',
    mockData: process.env.NODE_ENV === 'development',
    hotReload: process.env.NODE_ENV === 'development',
  },
} as const;

// Type-safe config access
export type Config = typeof config;

// Helper functions
export const isFeatureEnabled = (feature: keyof typeof config.features): boolean => {
  return config.features[feature];
};

export const isDevelopment = (): boolean => {
  return config.development.debugMode;
};

export const getImageConfig = () => {
  return config.image;
};

export const getAIConfig = () => {
  return config.ai;
};
