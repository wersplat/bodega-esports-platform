import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  root: 'frontend', // Set the root directory to frontend
  plugins: [
    react(),
    visualizer({
      filename: 'bundle-analysis.html',
      open: true,
    }),
  ],
  build: {
    outDir: 'dist',
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
