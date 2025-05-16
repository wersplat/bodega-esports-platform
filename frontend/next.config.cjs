const path = require('path');
const { env } = require('node:process');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [env.SUPABASE_URL], // Add your Supabase domain or other image domains
  },
  env: {
    SUPABASE_URL: env.SUPABASE_URL || '',
    SUPABASE_ANON_KEY: env.SUPABASE_ANON_KEY || '',
    API_BASE: env.API_BASE || 'https://api.bodegacatsgc.gg',
    API_VERSION: 'v2',
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve('./'),
    };
    return config;
  },
};

// Remove the ES module export
// export default nextConfig;

// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  nextConfig,
  {
    // Sentry configuration options...
    org: "bodegacatsgc",
    project: "bodega-frontend",
    silent: !process.env.CI,
    widenClientFileUpload: true,
    disableLogger: true,
  }
);