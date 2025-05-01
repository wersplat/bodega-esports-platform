/* eslint-env node */
/* global process, module */

// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['kvkmepmsloyekfqwdcgq.supabase.co'], // Add your Supabase domain or other image domains
  },
  env: {
    SUPABASE_URL: typeof process !== 'undefined' ? process.env.SUPABASE_URL : '',
    SUPABASE_ANON_KEY: typeof process !== 'undefined' ? process.env.SUPABASE_ANON_KEY : '',
    API_BASE: process.env.API_BASE,
  },
};

module.exports = nextConfig;
