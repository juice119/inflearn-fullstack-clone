import { readFileSync } from 'fs';
import { join } from 'path';
import yaml from 'js-yaml';
import { defineConfig } from 'prisma/config';

const env = process.env.NODE_ENV || 'local';
const configPath = join(process.cwd(), 'enviorment', `${env}-enviorment.yml`);
const { database } = yaml.load(readFileSync(configPath, 'utf8')) as {
  database: { url: string };
};

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: database.url,
  },
});
