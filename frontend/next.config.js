import path from 'path';
import { env } from 'node:process';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['kvkmepmsloyekfqwdcgq.supabase.co'], // Add your Supabase domain or other image domains
  },
  env: {
    SUPABASE_URL: env.SUPABASE_URL || '',
    SUPABASE_ANON_KEY: env.SUPABASE_ANON_KEY || '',
    API_BASE: env.API_BASE,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve('./'),
    };
    return config;
  },
};

export default nextConfig;
