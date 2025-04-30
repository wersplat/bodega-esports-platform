import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  root: 'frontend', // project source lives here
  plugins: [
    react(),
    visualizer({
      filename: 'bundle-analysis.html',
      open: false, // set to true locally if you want to visualize bundle
    }),
  ],
  build: {
    outDir: 'dist',          // outputs to frontend/dist
    emptyOutDir: true,       // clean dist/ before building
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
