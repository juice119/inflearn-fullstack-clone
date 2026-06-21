// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
import path from 'path';

const BACKEND_ROOT = __dirname;
const BACKEND_SERVER_PORT = 3101;

export default defineConfig({
  testDir: path.join(BACKEND_ROOT, 'test/e2e'),
  timeout: 30 * 1000,
  fullyParallel: false, // DB 상태 공유로 인한 데이터 꼬임 방지 (순차 실행)
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',

  use: {
    baseURL: `http://localhost:${BACKEND_SERVER_PORT}`,
    trace: 'on-first-retry',
  },

  webServer: {
    command: 'sh script/startE2ETestServer.sh',
    cwd: BACKEND_ROOT,
    url: `http://localhost:${BACKEND_SERVER_PORT}/hc`,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    env: {
      NODE_ENV: 'test',
      PORT: BACKEND_SERVER_PORT.toString(),
    },
    stdout: 'pipe',
    stderr: 'pipe',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
