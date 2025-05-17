import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [process.env.SUPABASE_URL].filter(Boolean),
  },
  env: {
    SUPABASE_URL: process.env.SUPABASE_URL || '',
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
    API_BASE: process.env.API_BASE || 'https://api.bodegacatsgc.gg',
    API_VERSION: 'v2',
  },
  experimental: {
    appDir: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': new URL('./', import.meta.url).pathname,
    };
    return config;
  },
};

// Export the config with Sentry
const sentryWebpackPluginOptions = {
  org: "bodegacatsgc",
  project: "bodega-frontend",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  disableLogger: true,
};

export default withSentryConfig(nextConfig, sentryWebpackPluginOptions);
