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
    isolate: false,
    maxWorkers: 4,
    root: './',
    environment: 'node',
    include: ['test/unit/**/*.spec.ts'],
    // Playwright E2E 테스트 폴더 및 node_modules는 스캔에서 제외
    exclude: ['test/e2e/**/*', 'node_modules/**/*'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['**/*.spec.ts', 'main.ts', '**/*.module.ts'],
    },
    env: {
      NODE_ENV: 'test',
    },
    setupFiles: ['reflect-metadata'],
  },
  plugins: [
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
});
