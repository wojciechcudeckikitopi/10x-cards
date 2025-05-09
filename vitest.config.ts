import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'dist/**',
        '.astro/**',
        '**/*.d.ts',
        'src/tests/**',
        '**/*.config.{js,ts}',
      ],
    },
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    exclude: ['node_modules/**', 'dist/**', '.astro/**', 'src/tests/e2e/**'],
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
}); 