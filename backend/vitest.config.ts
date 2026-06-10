import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    root: './',
    environment: 'node',
    include: ['src/**/*.unit.spec.ts', 'src/**/*.int.spec.ts'],
    // Playwright E2E 테스트 폴더 및 node_modules는 스캔에서 제외
    exclude: ['test/**/*', 'node_modules/**/*'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['**/*.spec.ts', 'main.ts', '**/*.module.ts'],
    },
  },
  plugins: [
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
});
