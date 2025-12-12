import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    lib: {
      entry: 'src/cookie-consent.ts',
      name: 'CookieConsent',
      fileName: () => 'cookie-consent-standalone.js',
      formats: ['iife'],
    },
  },
});
