import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Use a relative base so the built app works when served from a subfolder (e.g. /USINE-IA/...)
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    manifest: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
