import 'dotenv/config';
import { defineConfig } from 'prisma/config';
import { AppConfig } from 'src/common/config/AplicationConfig';

const appConfig = AppConfig.ofYml(process.env.NODE_ENV || '');

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: appConfig.database.url,
  },
});
