import { PrismaTestingHelper } from '@chax-at/transactional-prisma-testing';
import { ModuleMetadata } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppConfig } from 'src/common/config/AplicationConfig';
import { PrismaService } from 'src/prisma/prisma.service';

export class AppTestHepler {
  private readonly prismaTestingHelper: PrismaTestingHelper<PrismaService>;
  private readonly _originalPrismaService: PrismaService;
  private readonly _proxyPrismaService: PrismaService;
  private readonly _appConfig: AppConfig;

  private constructor(
    prismaTestingHelper: PrismaTestingHelper<PrismaService>,
    originalPrisma: PrismaService,
    proxyPrisma: PrismaService,
    _appConfig: AppConfig,
  ) {
    this.prismaTestingHelper = prismaTestingHelper;
    this._originalPrismaService = originalPrisma;
    this._proxyPrismaService = proxyPrisma;
    this._appConfig = _appConfig;
  }

  static async of(appConfig: AppConfig = AppConfig.ofYml('test')) {
    const prismaService = new PrismaService(appConfig);
    await prismaService.$connect();

    const prismaTestingHelper = new PrismaTestingHelper(prismaService);
    const proxyPrismaService = prismaTestingHelper.getProxyClient();

    return new AppTestHepler(prismaTestingHelper, prismaService, proxyPrismaService, appConfig);
  }

  async cleanData() {
    const tableNames: string[] = await this._originalPrismaService.$queryRaw`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      AND table_name != '_prisma_migrations';
  `.then((result: { table_name: string }[]) => result.map((row) => row.table_name));

    // 2. 외래키 제약조건을 잠시 끄고 모든 테이블을 TRUNCATE 합니다.
    for (const tableName of tableNames) {
      await this._originalPrismaService.$executeRawUnsafe(
        `TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE;`,
      );
    }
  }

  createTestingModule(metadata: ModuleMetadata) {
    const meta: ModuleMetadata = {
      imports: metadata.imports || [],
      controllers: metadata.controllers || [],
      providers: metadata.providers || [],
      exports: metadata.exports || [],
    };
    meta.providers?.push({ provide: AppConfig, useValue: this._appConfig });
    meta.providers?.push({ provide: PrismaService, useValue: this.prismaService });
    return Test.createTestingModule(meta);
  }

  startTransaction(timeout: number = 10000) {
    return this.prismaTestingHelper.startNewTransaction({ timeout });
  }

  rollbackTransaction() {
    this.prismaTestingHelper.rollbackCurrentTransaction();
  }

  async disconnetDBConnection() {
    await this._originalPrismaService.$disconnect();
  }

  get prismaService(): PrismaService {
    return this._proxyPrismaService;
  }
}
