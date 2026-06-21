import { fakerKO as faker } from '@faker-js/faker';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, User } from '@prisma/client';
import { hashSync } from 'bcryptjs';
import { e2eAppConfig } from './e2eAppConfig';

export class E2eDbHelper {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient({
      adapter: new PrismaPg({
        connectionString: e2eAppConfig.database.url,
      }),
    });
  }

  async connect(): Promise<void> {
    await this.prisma.$connect();
  }

  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }

  async cleanData(): Promise<void> {
    const tableNames: string[] = await this.prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        AND table_name != '_prisma_migrations';
    `.then((result: { table_name: string }[]) => result.map((row) => row.table_name));

    await Promise.all(
      tableNames.map(async (tableName) => {
        await this.prisma.$executeRawUnsafe(
          `TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE;`,
        );
      }),
    );
  }

  createUser(data: Partial<Pick<User, 'name' | 'email' | 'image' | 'bio'>> = {}): Promise<User> {
    return this.prisma.user.create({
      data: {
        name: data.name ?? faker.internet.displayName(),
        email: data.email ?? faker.internet.email(),
        emailVerified: faker.date.recent(),
        hashedPassword: hashSync(faker.internet.password(), 10),
        image: data.image ?? null,
        bio: data.bio ?? null,
      },
    });
  }

  deleteUser(id: string): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }
}
