import { execSync } from 'node:child_process';
import path from 'node:path';

const BACKEND_ROOT = path.resolve(__dirname, '../..');

function run(command: string): void {
  execSync(command, {
    cwd: BACKEND_ROOT,
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'test' },
  });
}

export default function globalSetup(): void {
  if (process.env.SKIP_TEST_INFRA_SETUP === '1') {
    return;
  }

  run('sh script/initIntegrationTest.sh');
}
