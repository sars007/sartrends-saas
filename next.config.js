/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  generateBuildId: async () => `sartrends-${Date.now()}`,
  experimental: { serverComponentsExternalPackages: ['@prisma/client'] },
  output: 'standalone',
  trailingSlash: true,
  images: { unoptimized: true },
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname),
    };
    return config;
  },
};

module.exports = nextConfig;
