import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exclude problematic packages from server-side bundling
  serverExternalPackages: [
    'thread-stream',
    '@walletconnect/logger',
    'pino',
    'tesseract.js',
  ],
  // Configure webpack to ignore test files and other non-essential files
  webpack: (config, { isServer }) => {
    // Ignore test files, LICENSE files, and other non-essential files from node_modules
    config.module.rules.push({
      test: /\.(test|spec)\.(js|ts|mjs)$/,
      include: /node_modules/,
      use: 'ignore-loader',
    });
    
    config.module.rules.push({
      test: /\.(LICENSE|md|txt|zip|sh|yml)$/,
      include: /node_modules/,
      use: 'ignore-loader',
    });

    // Ignore directories with test files
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      'thread-stream/test': false,
    };

    return config;
  },
};

export default nextConfig;
