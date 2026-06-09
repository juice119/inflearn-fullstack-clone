import { Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { AppConfig } from 'src/common/config/AplicationConfig';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(private config: AppConfig) {
    super({
      adapter: new PrismaPg({
        connectionString: config.database.url,
      }),
    });
  }
}
