/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  
  // Fix webpack caching issues
  webpack: (config, { dev, isServer }) => {
    // Prevent failed cache writes on Windows
    config.infrastructureLogging = {
      level: 'error',
    };
    
    // Force cache disabling in development mode
    if (dev) {
      config.cache = false;
    }
    
    return config;
  },
  
  // Optimize build performance
  swcMinify: true,
  
  // Add output file tracing to reduce bundle size
  experimental: {
    outputFileTracingExcludes: {
      '*': [
        'node_modules/@swc/core-win32-x64-msvc',
        'node_modules/webpack',
      ],
    },
  },
};

module.exports = nextConfig; 