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
    maxWorkers: '90%',
    isolate: false,
    root: './',
    // execArgv: [
    //   '--cpu-prof',
    //   '--cpu-prof-dir=test-runner-profile',
    //   '--heap-prof',
    //   '--heap-prof-dir=test-runner-profile',
    // ],
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
    setupFiles: ['reflect-metadata'],
  },
  plugins: [
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
});
