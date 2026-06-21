import { existsSync, readFileSync } from 'fs';
import yaml from 'js-yaml';
import { dirname, join } from 'path';

type E2eConfig = {
  database: {
    url: string;
  };
  jwt: {
    authSecret: string;
  };
};

function resolveBackendRoot(): string {
  let currentDir = __dirname;

  while (currentDir !== dirname(currentDir)) {
    if (existsSync(join(currentDir, 'enviorment', 'test-enviorment.yml'))) {
      return currentDir;
    }
    currentDir = dirname(currentDir);
  }

  throw new Error(
    'backend 루트를 찾을 수 없습니다. enviorment/test-enviorment.yml 파일을 확인하세요.',
  );
}

const configPath = join(resolveBackendRoot(), 'enviorment', 'test-enviorment.yml');
const configObject = yaml.load(readFileSync(configPath, 'utf8')) as E2eConfig;

export const e2eAppConfig = configObject;
