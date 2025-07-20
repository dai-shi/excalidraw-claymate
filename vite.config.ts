import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { configDefaults } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'build',
  },
  ssr: {
    noExternal: ['@excalidraw/excalidraw'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    exclude: [...configDefaults.exclude],
    deps: {
      interopDefault: true,
      inline: ['@excalidraw/excalidraw'],
    },
  },
});
