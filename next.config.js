/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Handle client-side only modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        util: false,
        buffer: false,
        process: false,
      };
    }

    // Optimize bundle size
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          fabric: {
            test: /[\\/]node_modules[\\/]fabric[\\/]/,
            name: 'fabric',
            chunks: 'all',
            priority: 20,
          },
        },
      },
    };

    return config;
  },
  images: {
    domains: [
      'images.pexels.com',
      'images.unsplash.com',
      'picsum.photos',
      'via.placeholder.com',
    ],
    unoptimized: true,
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Production optimizations - disabled problematic ones
  experimental: {
    // Disable CSS optimization that requires critters
    optimizeCss: false,
    optimizePackageImports: ['fabric', 'lucide-react', 'framer-motion'],
  },
  // Ensure consistent rendering
  reactStrictMode: true,
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  // Fix build issues
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
  // Better error handling
  typescript: {
    ignoreBuildErrors: false,
  },
  // Disable problematic optimizations in development
  ...(process.env.NODE_ENV === 'development' && {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
          path: false,
          crypto: false,
          stream: false,
          util: false,
          buffer: false,
          process: false,
        };
      }

      return config;
    },
  }),
  // Output configuration for better compatibility
  output: 'standalone',
  // Disable static optimization for problematic pages
  staticPageGenerationTimeout: 120,
};

module.exports = nextConfig;
