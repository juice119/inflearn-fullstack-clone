import path from 'path';
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    root: './',
    environment: 'node',
    include: ['test/integration/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['**/*.spec.ts', 'main.ts', '**/*.module.ts'],
    },
    env: {
      NODE_ENV: 'test',
    },
  },
  plugins: [
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
});
