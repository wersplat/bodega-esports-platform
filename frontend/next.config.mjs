import { withSentryConfig } from "@sentry/nextjs";
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  env: {
    API_BASE: process.env.API_BASE || 'https://api.bodegacatsgc.gg',
    API_VERSION: 'v2',
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve('./'), // Use project root for '@' alias
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
