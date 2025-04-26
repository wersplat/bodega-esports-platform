// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';

export default defineConfig({
  root: path.resolve(__dirname, 'frontend'), // 🔥 ADD THIS
  plugins: [
    react(),
    visualizer({
      filename: 'bundle-analysis.html',
      open: true,
    }),
  ],
  build: {
    outDir: path.resolve(__dirname, 'frontend/dist'), // 🔥 update outDir properly
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js', '@supabase/postgrest-js'],
        },
      },
    },
  },
});
